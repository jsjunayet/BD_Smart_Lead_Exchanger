import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BkashService } from './Bkash.service';

const createBkash = catchAsync(async (req, res) => {
  const result = await BkashService.createBkash(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '  createBkash Succesfully!',
    data: result,
  });
});

const getAllBkashs = catchAsync(async (req, res) => {
  const result = await BkashService.getAllBkashs();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all Bkash Succesfully!',
    data: result,
  });
});

const getBkashById = catchAsync(async (req, res) => {
  const Id = req.params.id;
  const result = await BkashService.getBkashById(Id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Submission Succesfully!',
    data: result,
  });
});
const updateBkashStatus = catchAsync(async (req, res) => {
  const Id = req.params.id;
  const result = await BkashService.updateBkashStatus(Id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update Bkash Status Succesfully!',
    data: result,
  });
});
const DeletedBkashById = catchAsync(async (req, res) => {
  const Id = req.params.id;
  const result = await BkashService.getBkashById(Id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deleted Succesfully!',
    data: result,
  });
});
export const BkashController = {
  createBkash,
  getAllBkashs,
  getBkashById,
  updateBkashStatus,
  DeletedBkashById,
};
