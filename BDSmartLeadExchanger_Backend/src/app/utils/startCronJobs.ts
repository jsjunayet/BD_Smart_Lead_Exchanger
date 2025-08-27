// src/utils/cronJobs.ts
import mongoose from 'mongoose';
import cron from 'node-cron';
import { User } from '../modules/Auth/auth.model';
import { JobSubmission } from '../modules/JobSubmission/JobSubmission.model';

export const startCronJobs = () => {
  // Daily $0.5 deduction
  cron.schedule('0 0 * * *', async () => {
    const users = await User.find();
    for (const u of users) {
      if (u.wallet > 0) {
        u.wallet = Math.max(0, u.wallet - 0.5);
        await u.save();
      }
    }
    console.log('✅ Daily wallet deduction done');
  });

  // 1-hour auto submission
  cron.schedule('0 * * * *', async () => {
    console.log('⏳ Checking pending submissions for auto-approval...');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const now = new Date();

      // সব pending submissions নিয়ে আসি
      const submissions = await JobSubmission.find({ status: 'submitted' })
        .populate('job')
        .populate('user')
        .session(session);

      // group করি owner অনুযায়ী
      const ownerSubmissionsMap = new Map<string, typeof submissions>();

      for (const sub of submissions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const job: any = sub.job;
        if (!ownerSubmissionsMap.has(job.postedBy.toString())) {
          ownerSubmissionsMap.set(job.postedBy.toString(), []);
        }
        ownerSubmissionsMap.get(job.postedBy.toString()).push(sub);
      }

      // প্রতিটা owner আলাদা করে handle
      for (const [ownerId, subs] of ownerSubmissionsMap.entries()) {
        const owner = await User.findById(ownerId).session(session);
        if (!owner) continue;

        // শুধু expired submissions filter
        const expiredSubs = subs.filter((s) => {
          const diffInSeconds =
            (now.getTime() - s.submittedAt.getTime()) / 1000;
          return diffInSeconds > 3600;
        });

        if (expiredSubs.length === 0) continue;

        // owner এর balance sufficient কিনা check
        if (owner.surfingBalance < expiredSubs.length) {
          console.log(
            `❌ Owner ${ownerId} balance insufficient: ${owner.surfingBalance}, needed ${expiredSubs.length}`,
          );
          continue;
        }

        // একসাথে deduct
        owner.surfingBalance -= expiredSubs.length;
        await owner.save({ session });

        for (const sub of expiredSubs) {
          sub.status = 'approved';
          await sub.save({ session });

          await User.findByIdAndUpdate(
            sub.user._id,
            { $inc: { surfingBalance: 1 } },
            { session },
          );

          console.log(
            `✅ Auto-approved submission ${sub._id} | Owner: ${owner._id} -> User: ${sub.user._id}`,
          );
        }
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('❌ Auto-approval failed:', err);
    }
  });
};
