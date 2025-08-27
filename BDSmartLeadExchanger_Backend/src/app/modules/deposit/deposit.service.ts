import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../Auth/auth.model';
import { Deposit } from './deposit.model';

const createUserDeposit = async (
  userId: string,
  body: { amount: number; transactionId: string; bkashNumber: string },
) => {
  const deposit = await Deposit.create({
    user: userId,
    ...body,
    status: 'pending',
  });
  return deposit;
};

// 2. Get all deposits for user
const getUserDeposits = async (userId: string) => {
  return await Deposit.find({ user: userId }).sort({ createdAt: -1 });
};

// 3. Get all deposits for admin
const getAllDepositsForAdmin = async () => {
  return await Deposit.find()
    .populate('user', 'name email phoneNumber')
    .sort({ createdAt: -1 });
};

// 4. Admin approve/reject deposit
const updateDepositStatus = async (
  depositId: string,
  status: 'approved' | 'rejected',
  message?: string,
) => {
  const deposit = await Deposit.findById(depositId);
  if (!deposit) throw new AppError(httpStatus.NOT_FOUND, 'Deposit not found');
  console.log(deposit, status);
  if (status.status === 'approved') {
    deposit.status = 'approved';
    deposit.message = message || 'verified Payment';
    await deposit.save();
    // Update user balance
    const user = await User.findById(deposit.user);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    console.log(user);

    user.wallet = (user.wallet || 0) + deposit.amount;
    await user.save();
  } else if (status.status === 'rejected') {
    deposit.status = 'rejected';
    deposit.message = message || 'No reason provided';
    await deposit.save();
  }

  return deposit;
};

export const depositService = {
  createUserDeposit,
  getAllDepositsForAdmin,
  updateDepositStatus,
  getUserDeposits,
};
