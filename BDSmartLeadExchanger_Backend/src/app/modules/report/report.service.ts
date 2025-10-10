import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IReport } from './report.interface';
import { Report } from './report.model';

const createReport = async (userId: string, body: IReport) => {
  const { submission, reason, adminNotes } = body;
  const result = await Report.create({
    user: userId, // from auth middleware
    submission,
    reason,
    adminNotes,
  });
  return result;
};

const getAllReports = async () => {
  const result = await Report.find()
    .populate('user')
    .populate({
      path: 'submission',
      populate: {
        path: 'job', // submission এর ভিতরের job field
        populate: {
          path: 'postedBy', // this is the extra nested population
        },
      },
    })
    .sort({ createdAt: -1 });

  return result;
};

const updateReportStatus = async (
  reportId: string,
  payload: Partial<IReport>,
) => {
  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { status: payload.status, adminNotes: payload.adminNotes },
    { new: true },
  );

  if (!updatedReport) {
    throw new AppError(httpStatus.NOT_FOUND, 'Report not found');
  }
  return updatedReport;
};
const getMyReports = async (userId: string, submissionId: string) => {
  const result = await Report.findOne({
    user: userId,
    submission: submissionId,
  })
    .populate('submission')
    .sort({ createdAt: -1 });

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
