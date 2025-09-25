import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { User } from '../auth/auth.model';
import { JobSubmission } from '../JobSubmission/JobSubmission.model';
import { IJob } from './job.interface';
import { Job } from './job.model';

const jobPost = async (
  userId: string,
  data: {
    title: string;
    description: string;
    jobUrl: string;
    screenshotTitles: string[];
    thumbnail?: string;
  },
  file,
) => {
  if (file) {
    const imageName = `${data.title}${data?.description}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    data.thumbnail = secure_url as string;
  }
  const existing = await Job.findOne({ postedBy: userId });
  if (existing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User can post only one job, please edit it',
    );
  }

  const user = await User.findById(userId);
  if (!user || user.wallet <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient  balance to post job.',
    );
  }

  const job = new Job({
    title: data.title,
    description: data.description,
    jobUrl: data.jobUrl,
    screenshotTitles: data.screenshotTitles,
    thumbnail: data.thumbnail || '',
    postedBy: userId,
  });

  await job.save();
  return job;
};

const approveOrrejectJob = async (
  jobId: string,
  adminId: string,
  action: 'approve' | 'reject',
) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }
  if (action === 'approve') {
    job.approvedByAdmin = true;
  } else {
    job.approvedByAdmin = false;
  }

  const result = await job.save();
  return result;
};
const getJobsByOwner = async (ownerId: string) => {
  const jobs = await Job.aggregate([
    {
      $match: { postedBy: new mongoose.Types.ObjectId(ownerId) }, // owner filter
    },
    {
      $lookup: {
        from: 'jobsubmissions', // JobSubmission collection name
        localField: '_id', // Job._id
        foreignField: 'job', // JobSubmission.job
        as: 'submissions',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return jobs;
};
// 3. Get all deposits for admin
// For Admin (see all jobs + their submissions)
const getAllJobForAdmin = async () => {
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .populate('postedBy', 'name email') // Job owner info
    .lean();
  for (const job of jobs) {
    const submissions = await JobSubmission.find({ job: job._id })
      .populate('user', 'name email')
      .lean();

    job.submissions = submissions;
  }

  return jobs;
};

// const getOwnJobSubmitted = async (ownId) => {
//   return await Job.find({ 'completedBy.user': ownId }) // <-- use braces
//     .populate('completedBy.user', 'name email')
//     .sort({ createdAt: -1 });
// };

const updateJob = async (
  jobId: string,
  userId: string,
  data: Partial<IJob>,
  file,
) => {
  if (file) {
    const imageName = `${data.title}${data?.description}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    data.thumbnail = secure_url as string;
  }
  const job = await Job.findOne({ _id: jobId, postedBy: userId });
  if (!job) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Job not found or permission denied',
    );
  }
  data.approvedByAdmin = false;
  const result = await Job.findByIdAndUpdate(jobId, data, {
    new: true,
    runValidators: true,
  });
  return result;
};
// const getWorkplaceJobs = async (userId) => {
//   const jobs = await Job.find({
//     approvedByAdmin: true, // শুধু approved job গুলো
//     completedBy: {
//       $not: {
//         $elemMatch: {
//           user: userId,
//           status: 'approved',
//           completedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // শেষ ২৪ ঘন্টার মধ্যে
//         },
//       },
//     },
//   })
//     .populate('postedBy', 'name email') // 👈 job owner info show হবে
//     .select('-completedBy');
//   return jobs;
// };

const getWorkplaceJobs = async (userId: string) => {
  const completedJobs = await JobSubmission.find({
    user: userId,
    submittedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).distinct('job');
  console.log(completedJobs);
  const jobs = await Job.find({
    approvedByAdmin: true,
    _id: { $nin: completedJobs },
  })
    .populate('postedBy', 'name email')
    .lean();

  return jobs;
};

// const completeJob = async (jobId: string, workerId: string) => {
//   const job = await Job.findById(jobId);
//   if (!job) {
//     AppError(httpStatus.NOT_FOUND, 'Job not found');
//   }
//   job.completedBy.push({
//     user: new Types.ObjectId(workerId),
//     status: 'submitted',
//     completedAt: new Date(),
//   });

//   await job.save();
// };
export const jobService = {
  jobPost,
  getAllJobForAdmin,
  updateJob,
  approveOrrejectJob,
  getWorkplaceJobs,
  getJobsByOwner,
};
