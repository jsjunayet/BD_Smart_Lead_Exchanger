import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const GetAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.GetAllUser(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All user Retrived Succesfully!',
    data: result,
  });
});
const GetAllSingleUser = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await UserServices.GetAllSingleUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single User Retrived Succesfully!',
    data: result,
  });
});

const GetAllSingleUserForAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.GetAllSingleUserForAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single User Retrived For Admin Succesfully!',
    data: result,
  });
});
const UserProfileUpdate = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await UserServices.UserProfileUpdate(id, req.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Profile Update Succesfully!',
    data: result,
  });
});
const ApprovedUser = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const userId = req.params.id;
  const result = await UserServices.ApprovedUser(id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Aprrove for Access!',
    data: result,
  });
});
const DeletedUser = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const userId = req.params.id;
  const result = await UserServices.DeletedUser(id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted Succesfully!',
    data: result,
  });
});

export const UserController = {
  GetAllUser,
  GetAllSingleUser,
  UserProfileUpdate,
  ApprovedUser,
  DeletedUser,
  GetAllSingleUserForAdmin,
};
