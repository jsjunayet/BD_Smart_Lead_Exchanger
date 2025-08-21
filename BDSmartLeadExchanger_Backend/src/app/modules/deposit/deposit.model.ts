import mongoose, { Schema } from 'mongoose';
import { IDeposit } from './deposit.interface';

const DepositSchema: Schema<IDeposit> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    bkashNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectReason: { type: String },
  },
  { timestamps: true },
);

export const Deposit = mongoose.model<IDeposit>('Deposit', DepositSchema);
