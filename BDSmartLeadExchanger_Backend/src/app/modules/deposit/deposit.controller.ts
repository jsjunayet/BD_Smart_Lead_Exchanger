// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { depositService } from './deposit.service';

// const createDepositSchema = catchAsync(async (req, res) => {
//   const id = req.user.userId;
//   const result = await depositService.createUserDeposit(id, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Deposit Create Succesfully!',
//     data: result,
//   });
// });

// const getAllDepositsForAdmin = catchAsync(async (req, res) => {
//   const result = await depositService.getAllDepositsForAdmin();
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'All Deposit Retrived Succesfully!',
//     data: result,
//   });
// });
// const getUserDeposits = catchAsync(async (req, res) => {
//   const id = req.user.userId;
//   const result = await depositService.getUserDeposits(id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Own Deposit Retrived Succesfully!',
//     data: result,
//   });
// });

// const updateDepositStatus = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await depositService.updateDepositStatus(id, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Single User Retrived For Admin Succesfully!',
//     data: result,
//   });
// });

// export const DepositController = {
//   createDepositSchema,
//   getAllDepositsForAdmin,
//   getUserDeposits,
//   updateDepositStatus,
// };
