import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { JobSubmissionService } from './JobSubmission.service';

const reviewSubmission = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const submissionId = req.params.id;

  const result = await JobSubmissionService.reviewSubmission(
    submissionId,
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' reviewSubmission Succesfully!',
    data: result,
  });
});
const jobSubmitted = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const jobId = req.params.id;
  const { screenshots } = req.body;

  const result = await JobSubmissionService.submitJob(
    jobId,
    userId,
    screenshots,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job submitted successfully!',
    data: result,
  });
});

const getAllSubmission = catchAsync(async (req, res) => {
  const result = await JobSubmissionService.getAllSubmission();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all Submission Succesfully!',
    data: result,
  });
});
const getOwnSubmission = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await JobSubmissionService.getOwnSubmission(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Own Submission Succesfully!',
    data: result,
  });
});
const deletedSubmission = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await JobSubmissionService.deletedSubmission(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Submission Succesfully!',
    data: result,
  });
});
const getSingleSubmission = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await JobSubmissionService.getSingleSubmission(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Submission Succesfully!',
    data: result,
  });
});
export const JobSubmissionController = {
  reviewSubmission,
  jobSubmitted,
  getAllSubmission,
  getOwnSubmission,
  getSingleSubmission,
  deletedSubmission,
};
