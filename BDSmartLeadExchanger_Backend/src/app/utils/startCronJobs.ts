// src/utils/cronJobs.ts
import mongoose from 'mongoose';
import cron from 'node-cron';
import { User } from '../modules/Auth/auth.model';
import { JobSubmission } from '../modules/JobSubmission/JobSubmission.model';

export const startCronJobs = () => {
  // ✅ Daily $0.5 deduction
  cron.schedule('0 0 * * *', async () => {
    const users = await User.find();
    for (const u of users) {
      if (u.wallet > 0) {
        u.wallet = Math.max(0, u.wallet - 0.05);
        await u.save();
      }
    }
    console.log('✅ Daily wallet deduction done');
  });

  // ✅ 1-hour auto submission approval
  cron.schedule('0 * * * *', async () => {
    console.log('⏳ Checking pending submissions for auto-approval...');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const now = new Date();

      // সব pending submissions নিয়ে আসা
      const submissions = await JobSubmission.find({ status: 'submitted' })
        .populate('job')
        .populate('user')
        .session(session);

      // Owner অনুযায়ী submissions group করা
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ownerSubmissionsMap = new Map<string, any[]>();

      for (const sub of submissions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const job: any = sub.job;

        // Owner এর key
        const key = job.postedBy.toString();

        // যদি এই owner আগে না থাকে তাহলে initialize করি
        if (!ownerSubmissionsMap.has(key)) {
          ownerSubmissionsMap.set(key, []);
        }

        // এখন push করা safe
        ownerSubmissionsMap.get(key)!.push(sub);
      }

      // প্রতিটি owner-এর submissions আলাদা করে handle করা
      for (const [ownerId, subs] of ownerSubmissionsMap.entries()) {
        const owner = await User.findById(ownerId).session(session);
        if (!owner) continue;

        // expired submissions filter
        const expiredSubs = subs.filter((s) => {
          const diffInSeconds =
            (now.getTime() - s.submittedAt.getTime()) / 1000;
          return diffInSeconds > 3600; // 1 ঘন্টা পেরিয়ে গেছে
        });

        if (expiredSubs.length === 0) continue;

        // owner balance check
        if (owner.surfingBalance < expiredSubs.length) {
          console.log(
            `❌ Owner ${ownerId} balance insufficient: ${owner.surfingBalance}, needed ${expiredSubs.length}`,
          );
          continue;
        }

        // একসাথে deduct
        owner.surfingBalance -= expiredSubs.length;
        await owner.save({ session });

        // প্রতিটি submission approve করা
        for (const sub of expiredSubs) {
          sub.status = 'approved';
          await sub.save({ session });

          // TypeScript-safe casting for populated user
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userDoc = sub.user as any;

          await User.findByIdAndUpdate(
            userDoc._id,
            { $inc: { surfingBalance: 1 } },
            { session },
          );

          console.log(
            `✅ Auto-approved submission ${sub._id} | Owner: ${owner._id} -> User: ${userDoc._id}`,
          );
        }
      }

      await session.commitTransaction();
      session.endSession();
      console.log('✅ Auto-approval process completed');
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('❌ Auto-approval failed:', err);
    }
  });
};
