import httpStatus from 'http-status';
import mongoose, { ClientSession } from 'mongoose';
import AppError from '../../errors/AppError';
import { IUser } from '../Auth/auth.interface';
import { User } from '../Auth/auth.model';
import { Job } from '../job/job.model';
import { IJobSubmission } from './JobSubmission.interface';
import { JobSubmission } from './JobSubmission.model';

const submitJob = async (
  jobId: string,
  userId: string,
  proofPaths: string[],
) => {
  const job = await Job.findById(jobId);
  if (!job) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  if (job?.postedBy?.toString() === userId.toString()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot submit your own job.',
    );
  }
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
// const reviewSubmission = async (
//   submissionId: string,
//   ownerId: string,
//   action: 'approve' | 'reject',
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const submission = await JobSubmission.findById(submissionId)
//       .populate('job')
//       .populate('user')
//       .session(session);

//     if (!submission) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
//     }

//     const currentUser = await User.findById(ownerId).session(session);
//     const isAdmin =
//       currentUser?.role === 'admin' || currentUser?.role === 'superAdmin';

//     // Role-based validation
//     if (isAdmin) {
//       await handleAdminReview(submission, action, session);
//     } else {
//       await handleRegularUserReview(
//         submission,
//         currentUser,
//         ownerId,
//         action,
//         session,
//       );
//     }

//     await submission.save({ session });
//     await session.commitTransaction();
//     session.endSession();

//     return submission;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }

//   // Helper functions
//   async function handleAdminReview(submission, action, session) {
//     if (action.action === 'approve') {
//       submission.status = 'approved';
//       // Admin can approve without balance checks, still reward user
//       await User.findByIdAndUpdate(
//         submission.user,
//         { $inc: { surfingBalance: 1 } },
//         { session },
//       );
//     } else {
//       submission.status = 'rejected';
//     }
//   }

//   async function handleRegularUserReview(
//     submission,
//     currentUser,
//     ownerId,
//     action,
//     session,
//   ) {
//     // Ownership check
//     if (submission.job.postedBy.toString() !== ownerId.toString()) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'Not authorized to review this submission',
//       );
//     }

//     if (!currentUser || currentUser.wallet <= 0) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
//     }

//     if (action.action === 'approve') {
//       submission.status = 'approved';

//       if (!currentUser || currentUser.surfingBalance <= 0) {
//         throw new AppError(
//           httpStatus.BAD_REQUEST,
//           'Insufficient surfingBalance balance',
//         );
//       }

//       currentUser.surfingBalance -= 1;
//       await currentUser.save({ session });

//       await User.findByIdAndUpdate(
//         submission.user,
//         { $inc: { surfingBalance: 1 } },
//         { session },
//       );
//     } else {
//       submission.status = 'rejected';
//     }
//   }
// };
export const reviewSubmission = async (
  submissionId: string,
  ownerId: string,
  action: 'approve' | 'reject',
): Promise<IJobSubmission> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const submission = await JobSubmission.findById(submissionId)
      .populate('job')
      .populate('user')
      .session(session);
    if (!submission) {
      throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
    }

    const currentUser = await User.findById(ownerId).session(session);
    const isAdmin =
      currentUser?.role === 'admin' || currentUser?.role === 'superAdmin';

    if (isAdmin) {
      await handleAdminReview(submission, action, session);
    } else {
      await handleRegularUserReview(
        submission,
        currentUser,
        ownerId,
        action,
        session,
      );
    }

    await submission.save({ session });
    await session.commitTransaction();
    session.endSession();

    return submission;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ---------------------------
// ✅ Helper functions
// ---------------------------

async function handleAdminReview(
  submission: any,
  action: any,
  session: ClientSession,
): Promise<void> {
  if (action.action === 'approve') {
    submission.status = 'approved';
    await User.findByIdAndUpdate(
      submission.user._id,
      { $inc: { surfingBalance: 1 } },
      { session },
    );
    await User.findByIdAndUpdate(
      submission.job.postedBy,
      { $inc: { surfingBalance: -1 } },
      { session },
    );
  } else {
    submission.status = 'rejected';
  }
}

async function handleRegularUserReview(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submission: any,
  currentUser: IUser | null,
  ownerId: string,
  action: any,
  session: ClientSession,
): Promise<void> {
  if (submission.job.postedBy.toString() !== ownerId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to review this submission',
    );
  }

  if (!currentUser || currentUser.wallet <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  if (action.action === 'approve') {
    submission.status = 'approved';

    if (currentUser.surfingBalance <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Insufficient surfingBalance balance',
      );
    }

    currentUser.surfingBalance -= 1;
    await currentUser.save({ session });

    await User.findByIdAndUpdate(
      submission.user._id,
      { $inc: { surfingBalance: 1 } },
      { session },
    );
  } else {
    submission.status = 'rejected';
  }
}

const getAllSubmission = async () => {
  const result = await JobSubmission.find().populate('job').populate('user');
  return result;
};
const getOwnSubmission = async (userId: string) => {
  const result = await JobSubmission.find({ user: userId })
    .populate({
      path: 'job',
      populate: {
        path: 'postedBy', // nested populate
        model: 'User',
        select: 'name email ProfileImage', // optional: limit fields
      },
    })
    .populate('user'); // main submission user

  return result;
};

const getSingleSubmission = async (jobsubmissionId: string) => {
  const result = await JobSubmission.findOne({ _id: jobsubmissionId })
    .populate('job')
    .populate('user');
  return result;
};
const deletedSubmission = async (jobsubmissionId: string) => {
  const result = await JobSubmission.deleteOne({ _id: jobsubmissionId });
  return result;
};
export const JobSubmissionService = {
  submitJob,
  reviewSubmission,
  getAllSubmission,
  getOwnSubmission,
  getSingleSubmission,
  deletedSubmission,
};
