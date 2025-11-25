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
  cron.schedule(
    '0 0 * * *',
    async () => {
      const users = await User.find();
      for (const u of users) {
        if (u.wallet > 0) {
          u.wallet = Math.max(0, Number((u.wallet - 0.05).toFixed(2)));
          await u.save();
        }
      }
      console.log('✅ 0.05 deducted from all wallets successfully');
    },
    {
      timezone: 'Asia/Dhaka', // 🔹 Bangladesh time zone
    },
  );

  // RUN EVERY 2 MINUTES
  cron.schedule('*/2 * * * *', async () => {
    console.log('⏳ Checking submissions older than 5 hours...');

    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    // const fiveHoursAgo = new Date(now.getTime() - 6 * 60 * 1000);
    try {
      // 🟢 Submissions exactly 5 hours old
      const submissions = await JobSubmission.find({
        status: 'submitted',
        submittedAt: { $lte: fiveHoursAgo },
      })
        .populate('job')
        .populate('user');

      if (!submissions.length) {
        console.log('No submissions older than 5 hours.');
        return;
      }

      console.log(`🟢 Found ${submissions.length} submissions to auto-approve`);

      for (const submission of submissions) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const job = submission.job;
          const submitter = submission.user;

          if (!job || !submitter) {
            await session.abortTransaction();
            session.endSession();
            continue;
          }

          const owner = await User.findById(job.postedBy).session(session);

          if (!owner) {
            await session.abortTransaction();
            session.endSession();
            continue;
          }

          if (owner.surfingBalance <= 0) {
            console.log(`❌ Owner ${owner._id} has insufficient balance.`);
            await session.abortTransaction();
            session.endSession();
            continue;
          }

          // Approve
          submission.status = 'approved';
          await submission.save({ session });

          // Owner: -1
          owner.surfingBalance -= 1;
          await owner.save({ session });

          // Submitter: +1
          await User.findByIdAndUpdate(
            submitter._id,
            { $inc: { surfingBalance: 1 } },
            { session },
          );

          await session.commitTransaction();
          session.endSession();

          console.log(`✅ Auto Approved: ${submission._id}`);
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error('Error auto-approving:', err);
        }
      }

      console.log('✨ Auto approval cycle complete.');
    } catch (err) {
      console.error('CRON ERROR:', err);
    }
  });

  console.log('🔁 Auto approve cron started (every 2 minutes)');
};
