import { model, Schema } from 'mongoose';
import { IMobileBank } from './bkash.interface';

const bkashSchema = new Schema<IMobileBank>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['bkash', 'nagad', 'rocket', 'upay', 'others'],
      required: true,
    },
  },
  { timestamps: true },
);

export const Bkash = model<IMobileBank>('Bkash', bkashSchema);
