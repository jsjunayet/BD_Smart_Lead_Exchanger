import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../Auth/auth.model';
import { Job } from '../job/job.model';
import { JobSubmission } from './JobSubmission.model';

const submitJob = async (
  jobId: string,
  userId: string,
  proofPaths: string[],
) => {
  const job = await Job.findById(jobId);
  if (!job) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  if (!job.approvedByAdmin)
    throw new AppError(httpStatus.BAD_REQUEST, 'Job not approved');
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  if (user.wallet <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }
  const submission = new JobSubmission({
    job: jobId,
    user: userId,
    proofScreenshots: proofPaths,
    status: 'submitted',
  });

  await submission.save();
  return submission;
};
const reviewSubmission = async (
  submissionId: string,
  ownerId: string,
  action: 'approve' | 'reject',
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const submission = await JobSubmission.findById(submissionId)
      .populate('job')
      .populate('user')
      .session(session); // transaction-aware

    if (!submission) {
      throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
    }

    if (submission.job.postedBy.toString() !== ownerId.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Not authorized to review this submission',
      );
    }

    const owner = await User.findById(ownerId).session(session);

    if (!owner || owner.wallet <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    if (action.action === 'approve') {
      submission.status = 'approved';

      if (!owner || owner.surfingBalance <= 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Insufficient surfingBalance balance',
        );
      }
      console.log(owner);
      owner.surfingBalance -= 1;
      await owner.save({ session });

      await User.findByIdAndUpdate(
        submission.user,
        { $inc: { surfingBalance: 1 } },
        { session },
      );
    } else {
      submission.status = 'rejected';
    }

    await submission.save({ session });

    await session.commitTransaction();
    session.endSession();

    return submission;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // rollback হলে error propagate করবে
  }
};

const getAllSubmission = async () => {
  const result = await JobSubmission.find().populate('job').populate('user');
  return result;
};
const getOwnSubmission = async (userId: string) => {
  console.log(userId);
  const result = await JobSubmission.find({ user: userId })
    .populate('job')
    .populate('user');
  return result;
};
const getSingleSubmission = async (jobsubmissionId: string) => {
  const result = await JobSubmission.findOne({ _id: jobsubmissionId })
    .populate('job')
    .populate('user');
  return result;
};
export const JobSubmissionService = {
  submitJob,
  reviewSubmission,
  getAllSubmission,
  getOwnSubmission,
  getSingleSubmission,
};
