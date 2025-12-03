// src/agenda/autoApprove.job.ts

import mongoose from 'mongoose';
import { User } from '../modules/Auth/auth.model';
import { JobSubmission } from '../modules/JobSubmission/JobSubmission.model';
import { agenda } from './agenda';

// DELAYED JOB DEFINITION
agenda.define('auto-approve-submission', async (job: any) => {
  const { submissionId } = job.attrs.data;
  console.log('Auto-approve running for:', submissionId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const submission = await JobSubmission.findById(submissionId)
      .populate('job')
      .populate('user')
      .session(session);

    if (!submission) return;
    if (submission.status !== 'submitted') return; // Already approved manually

    // Fetch approver (job.postedBy)
    const jobData: any = submission.job;
    const approver = await User.findById(jobData.postedBy).session(session);
    const submitter = await User.findById(submission.user).session(session);

    if (!approver || !submitter) return;

    // Business rule: deduct from approver.surfingBalance
    const amount = 1; // তুমি দেওয়া logic অনুযায়ী fix/variable করতে পারো

    approver.surfingBalance -= amount;
    submitter.surfingBalance += amount;

    await approver.save({ session });
    await submitter.save({ session });

    submission.status = 'approved';
    await submission.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log('AUTO APPROVED:', submissionId);
  } catch (err) {
    console.error('Auto-approve failed:', err);
    await session.abortTransaction();
    session.endSession();
  }
});
export const cancelAutoApproveJob = async (submission: any) => {
  if (submission.autoApproveJobId) {
    await agenda.cancel({ _id: submission.autoApproveJobId });
    submission.autoApproveJobId = null; // clear reference
  }
};
