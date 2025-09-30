import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatsService } from './stats.service';

const createStats = catchAsync(async (req, res) => {
  const result = await StatsService.createStats(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Stats created successfully!',
    data: result,
  });
});

const getAllStats = catchAsync(async (req, res) => {
  const result = await StatsService.getAllStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All stats fetched successfully!',
    data: result,
  });
});

const getSingleStats = catchAsync(async (req, res) => {
  const result = await StatsService.getSingleStats(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single stats fetched successfully!',
    data: result,
  });
});

const updateStats = catchAsync(async (req, res) => {
  const result = await StatsService.updateStats(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stats updated successfully!',
    data: result,
  });
});

const deleteStats = catchAsync(async (req, res) => {
  const result = await StatsService.deleteStats(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stats deleted successfully!',
    data: result,
  });
});

export const StatsController = {
  createStats,
  getAllStats,
  getSingleStats,
  updateStats,
  deleteStats,
};
