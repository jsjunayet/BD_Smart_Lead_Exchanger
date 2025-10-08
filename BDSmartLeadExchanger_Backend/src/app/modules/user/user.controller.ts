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
const GetAllUserForHome = catchAsync(async (req, res) => {
  const result = await UserServices.GetAllUserForHome();
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
const GetDashboardData = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await UserServices.GetDashboardData(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashbaord Data Retrived Succesfully!',
    data: result,
  });
});
const GetAllSingleUserForAdmin = catchAsync(async (req, res) => {
  const id = req.user.id;
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
  const result = await UserServices.UserProfileUpdate(id, req.body);
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
  const body = req.body.data;
  console.log(body);
  const result = await UserServices.ApprovedUser(id, userId, body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Aprrove for Access!',
    data: result,
  });
});
const userRoleUpdate = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const adminId = req.user.userId;
  const { newRole } = req.body;
  const result = await UserServices.userRoleUpdate(adminId, userId, newRole);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sucessfully User Role Update!',
    data: result,
  });
});
const userHomeUpdate = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserServices.userHomeUpdate(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sucessfully User Home Page added!',
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
  GetDashboardData,
  userRoleUpdate,
  userHomeUpdate,
  GetAllUserForHome,
};
