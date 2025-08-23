import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { User } from '../Auth/auth.model';

// Get all users
const GetAllUser = async (userData: JwtPayload) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  if (user.isApproved === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account is waiting for admin approval!',
    );
  }
  const result = await User.find();
  return result;
};

// Get single user by ID
const GetAllSingleUser = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

// Get single user for admin (could be extended with more checks)
const GetAllSingleUserForAdmin = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

// Update user profile
const ALLOWED_UPDATE_FIELDS = [
  'image',
  'name',
  'phoneNumber',
  'country',
  'city',
  'affiliateNetworkName',
  'publisherId',
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserProfileUpdate = async (id: string, body: Partial<any>, file) => {
  // Pick only allowed fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (file) {
    const imageName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    body.image = secure_url as string;
  }
  if (!body || Object.keys(body).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No data provided to update');
  }
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }
  if (!user.isApproved) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Not approved!');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Partial<any> = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (body[key] !== undefined) {
      updateData[key] = body[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No valid fields to update');
  }

  const result = await User.findByIdAndUpdate(id, updateData, {
    new: true, // return updated doc
    runValidators: true, // validate against schema
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};
// Approve user
const ApprovedUser = async (adminId: string, userId: string) => {
  // 1. Check if admin exists
  const admin = await User.findById(adminId);

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
  }

  if (admin.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is deleted!');
  }

  if (admin.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is blocked!');
  }

  // 2. Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (user.isApproved) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already approved!');
  }

  // 3. Approve the user
  const result = await User.findByIdAndUpdate(
    userId,
    { isApproved: true },
    { new: true },
  );

  return result;
};

// Delete user
const DeletedUser = async (adminId: string, userId: string) => {
  const admin = await User.findById(adminId);

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
  }

  if (admin.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is deleted!');
  }

  if (admin.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is blocked!');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const UserServices = {
  GetAllUser,
  GetAllSingleUser,
  GetAllSingleUserForAdmin,
  UserProfileUpdate,
  ApprovedUser,
  DeletedUser,
};
