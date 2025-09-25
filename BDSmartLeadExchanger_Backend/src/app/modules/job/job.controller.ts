import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { jobService } from './job.service';

const jobPost = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await jobService.jobPost(id, req.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit Create Succesfully!',
    data: result,
  });
});
const approveOrrejectJob = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const adminId = req.user.id;
  console.log(req.body.action);
  const result = await jobService.approveOrrejectJob(
    userId,
    adminId,
    req.body.action,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Job Post Create ${req.body.action}  Succesfully!`,
    data: result,
  });
});
const getAlljobForAdmin = catchAsync(async (req, res) => {
  const result = await jobService.getAllJobForAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Deposit Retrived Succesfully!',
    data: result,
  });
});
const getJobsByOwner = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await jobService.getJobsByOwner(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Own Deposit Retrived Succesfully!',
    data: result,
  });
});
const getWorkplaceJobs = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await jobService.getWorkplaceJobs(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' WorkplaceJobs Retrived Succesfully!',
    data: result,
  });
});
// const getWorkplaceJobs = catchAsync(async (req, res) => {
//   const id = req.user.userId;
//   const result = await jobService.getWorkplaceJobs(id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: ' WorkplaceJobs Retrived Succesfully!',
//     data: result,
//   });
// });
const reviewSubmission = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await jobService.reviewSubmission(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' reviewSubmission Succesfully!',
    data: result,
  });
});
const updateJob = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const result = await jobService.updateJob(jobId, userId, req.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit Create Succesfully!',
    data: result,
  });
});

export const jobController = {
  jobPost,
  getAlljobForAdmin,
  getJobsByOwner,
  approveOrrejectJob,
  getWorkplaceJobs,
  reviewSubmission,
  updateJob,
};
