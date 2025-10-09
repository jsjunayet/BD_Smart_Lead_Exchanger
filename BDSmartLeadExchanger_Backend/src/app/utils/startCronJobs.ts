// src/utils/cronJobs.ts
import mongoose from 'mongoose';
import cron from 'node-cron';
import { User } from '../modules/Auth/auth.model';
import { JobSubmission } from '../modules/JobSubmission/JobSubmission.model';

export const startCronJobs = () => {
  // cron.schedule('0 0 * * *', async () => {
  //   const users = await User.find();
  //   for (const u of users) {
  //     if (u.wallet > 0) {
  //       u.wallet = Math.max(0, Number((u.wallet - 0.05).toFixed(2)));
  //       await u.save();
  //     }
  //   }
  //   console.log('✅ Daily wallet deduction done');
  // });
  cron.schedule('*/10 * * * *', async () => {
    console.log('⏳ Deducting 0.05 from all users...');

    const users = await User.find();
    for (const u of users) {
      if (u.wallet > 0) {
        u.wallet = Math.max(0, Number((u.wallet - 0.05).toFixed(2)));
        await u.save();
      }
    }

    console.log('✅ 0.05 deducted from all wallets successfully');
  });

  cron.schedule('*/5 * * * *', async () => {
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
      const ownerSubmissionsMap = new Map<string, any[]>();

      for (const sub of submissions) {
        const job: any = sub.job;
        const key = job.postedBy.toString();

        if (!ownerSubmissionsMap.has(key)) {
          ownerSubmissionsMap.set(key, []);
        }

        ownerSubmissionsMap.get(key)!.push(sub);
      }

      // প্রতিটি owner-এর submissions আলাদা করে handle করা
      for (const [ownerId, subs] of ownerSubmissionsMap.entries()) {
        const owner = await User.findById(ownerId).session(session);
        if (!owner) continue;

        // ✅ এখন 2 মিনিটের বেশি পুরানো submissions filter করবো
        const expiredSubs = subs.filter((s) => {
          const diffInSeconds =
            (now.getTime() - s.submittedAt.getTime()) / 1000;
          return diffInSeconds > 120; // 2 মিনিট = 120 সেকেন্ড
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

          const userDoc: any = sub.user;

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
