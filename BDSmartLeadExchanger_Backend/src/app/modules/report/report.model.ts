import { Schema, model } from 'mongoose';
import { IReport } from './report.interface';

const reportSchema = new Schema<IReport>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submission: {
      type: Schema.Types.ObjectId,
      ref: 'JobSubmission',
      required: true,
    },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Report = model<IReport>('Report', reportSchema);
