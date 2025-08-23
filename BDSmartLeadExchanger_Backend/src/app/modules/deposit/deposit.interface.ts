import mongoose, { Document } from 'mongoose';
import { IUser } from '../Auth/auth.interface';

export interface IDeposit extends Document {
  user: mongoose.Types.ObjectId | IUser;
  amount: number;
  transactionId: string;
  bkashNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
