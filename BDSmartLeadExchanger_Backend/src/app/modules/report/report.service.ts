import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Report } from './report.model';

const createReport = async (userId: string, body) => {
  const { submission, reason } = body;
  const result = await Report.create({
    user: userId, // from auth middleware
    submission,
    reason,
  });
  return result;
};

const getAllReports = async () => {
  const result = await Report.find().populate('user submission');
  return result;
};

const updateReportStatus = async (reportId: string, status: string) => {
  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { status },
    { new: true },
  );

  if (!updatedReport) {
    throw new AppError(httpStatus.NOT_FOUND, 'Report not found');
  }
  return updatedReport;
};
const getMyReports = async (userId: string) => {
  const result = await Report.find({ user: userId }).populate('submission');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Report not found');
  }
  return result;
};
const getReportById = async (ReportId: string) => {
  const result = await Report.findById(ReportId).populate('user submission');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Report not found');
  }
  return result;
};
export const ReportService = {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
};
