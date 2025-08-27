import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReportService } from './report.service';

const createReport = catchAsync(async (req, res) => {
  const id = req.user.userId;

  const result = await ReportService.createReport(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '  createReport Succesfully!',
    data: result,
  });
});

const getAllReports = catchAsync(async (req, res) => {
  const result = await ReportService.getAllReports();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all Report Succesfully!',
    data: result,
  });
});
const getMyReports = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReportService.getMyReports(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Own report Succesfully!',
    data: result,
  });
});
const getReportById = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await ReportService.getReportById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Submission Succesfully!',
    data: result,
  });
});
const updateReportStatus = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;
  const result = await ReportService.updateReportStatus(userId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update Report Status Succesfully!',
    data: result,
  });
});
export const ReportController = {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
};
