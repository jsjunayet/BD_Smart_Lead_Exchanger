import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../Auth/auth.model';
import { JobSubmission } from '../JobSubmission/JobSubmission.model';
import { IJob } from './job.interface';
import { Job } from './job.model';

// const jobPost = async (
//   userId: string,
//   data: {
//     title: string;
//     description: string;
//     jobUrl: string;
//     screenshotTitles: string[];
//     thumbnail?: string;
//   },
//   file,
// ) => {
//   if (file) {
//     const imageName = `${data.title}${data?.description}`;
//     const path = file?.path;
//     const { secure_url } = await sendImageToCloudinary(imageName, path);
//     data.thumbnail = secure_url as string;
//   }
//   const existing = await Job.findOne({ postedBy: userId });
//   if (existing) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'User can post only one job, please edit it',
//     );
//   }

//   const user = await User.findById(userId);
//   if (!user || user.wallet <= 0) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Insufficient  balance to post job.',
//     );
//   }

//   const job = new Job({
//     title: data.title,
//     description: data.description,
//     jobUrl: data.jobUrl,
//     screenshotTitles: data.screenshotTitles,
//     thumbnail: data.thumbnail || '',
//     postedBy: userId,
//   });

//   await job.save();
//   return job;
// };
// Utility: sanitize public_id

// Job Create
const jobPost = async (
  userId: string,
  data: {
    title: string;
    description: string;
    jobUrl: string;
    screenshotTitles: string[];
    thumbnail?: string;
  },
) => {
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
      'Insufficient balance to post job.',
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

// Job Update
const updateJob = async (
  jobId: string,
  userId: string,
  data: Partial<IJob>,
) => {
  const job = await Job.findOne({ _id: jobId, postedBy: userId });
  if (!job) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Job not found or permission denied',
    );
  }

  data.approvedByAdmin = false; // admin has to approve again after update

  const result = await Job.findByIdAndUpdate(jobId, data, {
    new: true,
    runValidators: true,
  });
  return result;
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
  const jobs = await Job.find({ postedBy: ownerId })
    .sort({ createdAt: -1 })
    .lean();

  const jobsWithSubmissions = await Promise.all(
    jobs.map(async (job) => {
      const submissions = await JobSubmission.find({ job: job._id })
        .populate('user', 'name email ProfileImage')
        .sort({ createdAt: -1 }) // শুধুমাত্র name, email, ProfileImage
        .lean();

      return { ...job, submissions };
    }),
  );

  return jobsWithSubmissions;
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
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (job as any).submissions = submissions;
  }

  return jobs;
};

// const getOwnJobSubmitted = async (ownId) => {
//   return await Job.find({ 'completedBy.user': ownId }) // <-- use braces
//     .populate('completedBy.user', 'name email')
//     .sort({ createdAt: -1 });
// };

// const updateJob = async (
//   jobId: string,
//   userId: string,
//   data: Partial<IJob>,
//   file,
// ) => {
//   if (file) {
//     const imageName = `${data.title}${data?.description}`;
//     const path = file?.path;
//     const { secure_url } = await sendImageToCloudinary(imageName, path);
//     data.thumbnail = secure_url as string;
//   }
//   const job = await Job.findOne({ _id: jobId, postedBy: userId });
//   if (!job) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'Job not found or permission denied',
//     );
//   }
//   data.approvedByAdmin = false;
//   const result = await Job.findByIdAndUpdate(jobId, data, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
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
  // ✅ ইউজারের গত ২৪ ঘণ্টায় সাবমিট করা job বাদ দিচ্ছি
  const completedJobs = await JobSubmission.find({
    user: userId,
    submittedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).distinct('job');

  // ✅ সব approved job নিচ্ছি, যেগুলো completed নয়
  const jobs = await Job.find({
    approvedByAdmin: true,
    _id: { $nin: completedJobs },
  })
    .populate('postedBy', 'name email surfingBalance')
    .lean();

  // ✅ filter: যার surfingBalance <= 0 → তার job বাদ
  const filteredJobs = jobs.filter((job) => {
    const postedBy = job.postedBy as any;
    return postedBy?.surfingBalance > 0;
  });

  return filteredJobs;
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
