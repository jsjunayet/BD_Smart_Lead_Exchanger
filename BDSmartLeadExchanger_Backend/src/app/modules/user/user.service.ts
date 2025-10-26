import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '../Auth/auth.model';
import { Job } from '../job/job.model';
import { JobSubmission } from '../JobSubmission/JobSubmission.model';

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
  const result = await User.find().sort({ createdAt: -1 });
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
const GetDashboardData = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const Balance = result.wallet;
  const Surfing_Balance = result.surfingBalance;
  const MyJobsPost = await Job.find({ postedBy: id });
  const myJobPostCount = MyJobsPost.length;
  const MySubmittedJobs = await JobSubmission.find({ user: id });
  const MySubmittedJobCount = MySubmittedJobs.length;
  return { Balance, Surfing_Balance, myJobPostCount, MySubmittedJobCount };
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
  'ProfileImage',
  'name',
  'phoneNumber',
  'country',
  'city',
  'affiliateNetworkName',
  'publisherId',
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserProfileUpdate = async (id: string, body: Partial<any>) => {
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
const ApprovedUser = async (
  adminId: string,
  userId: string,
  action: 'approved' | 'rejected',
) => {
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

  if (user.isApproved && action === 'approved') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already approved!');
  }

  // 3. Update user approval/rejection
  const isApproved = action === 'approved';
  const result = await User.findByIdAndUpdate(
    userId,
    { isApproved: isApproved },
    { new: true },
  );

  // 4. Send different email based on action
  let html = '';
  let subject = '';

  if (action === 'approved') {
    html = `
      <h2>Hello ${user.name},</h2>
      <p>Your account has been approved by Admin. 🎉</p>
      <p>Now you can login using your email & password.</p>
    `;
    subject = 'Your Account Approved';
  } else if (action === 'rejected') {
    html = `
      <h2>Hello ${user.name},</h2>
      <p>We're sorry! Your account has been rejected by Admin. ❌</p>
      <p>Please contact support for further assistance.</p>
    `;
    subject = 'Your Account Rejected';
  }

  await sendEmail(user.email, html, subject);

  return result;
};

const userRoleUpdate = async (
  adminId: string,
  userId: string,
  newRole: string,
) => {
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

  // 🚫 Only superAdmin can update roles
  if (admin.role !== 'superAdmin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only superAdmin can update user roles!',
    );
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

  // 🚫 Optional: Prevent superAdmin’s own role from being downgraded
  if (user.role === 'superAdmin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot modify another superAdmin’s role!',
    );
  }

  console.log(newRole, 'service');

  // 3. Update the user role
  const result = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true },
  );

  return result;
};

export const userHomeUpdate = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.home = !user.home;
  await user.save();
};

// Delete user
export const DeletedUser = async (adminId: string, userId: string) => {
  // 1️⃣ Find and verify the admin
  const admin = await User.findById(adminId);
  console.log(admin, 'admin');

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
  }
  if (admin.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is deleted!');
  }
  if (admin.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is blocked!');
  }

  // 2️⃣ Find the target user
  const user = await User.findById(userId);
  console.log(user, 'user');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // 3️⃣ Prevent SuperAdmin from being deleted
  if (user.role === 'superAdmin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'SuperAdmin accounts cannot be deleted!',
    );
  }

  // 4️⃣ Optional: Restrict normal admin from deleting other admins
  if (admin.role === 'admin' && user.role === 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Admins cannot delete other admins!',
    );
  }

  // 5️⃣ Proceed with deletion
  const result = await User.findByIdAndDelete(userId);
  return result;
};
const GetAllUserForHome = async () => {
  const users = await User.find({ home: true });
  return users;
};
export const UserServices = {
  GetAllUser,
  GetAllSingleUser,
  GetAllSingleUserForAdmin,
  UserProfileUpdate,
  ApprovedUser,
  DeletedUser,
  GetDashboardData,
  userRoleUpdate,
  GetAllUserForHome,
  userHomeUpdate,
};
