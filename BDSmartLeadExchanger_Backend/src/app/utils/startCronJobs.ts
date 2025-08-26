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

      // সব pending submissions খুঁজে বের করবো
      const submissions = await JobSubmission.find({ status: 'submitted' })
        .populate('job')
        .populate('user')
        .session(session);

      for (const submission of submissions) {
        // যদি submission time 1 ঘন্টা হয়ে যায়
        const diffInSeconds =
          (now.getTime() - submission.submittedAt.getTime()) / 1000;

        if (diffInSeconds > 3600) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const job: any = submission.job;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user: any = submission.user;

          // owner (job poster) খুঁজে বের করবো
          const owner = await User.findById(job.postedBy).session(session);

          if (!owner || owner.surfingBalance <= 0) {
            console.log(
              `❌ Skipped submission ${submission._id}, insufficient balance for owner ${job.postedBy}`,
            );
            continue;
          }

          // status update
          submission.status = 'approved';
          await submission.save({ session });

          // balance transfer
          owner.surfingBalance -= 1;
          await owner.save({ session });

          await User.findByIdAndUpdate(
            user._id,
            { $inc: { surfingBalance: 1 } },
            { session },
          );

          console.log(
            `✅ Auto-approved submission ${submission._id} | Owner: ${owner._id} -> User: ${user._id}`,
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
