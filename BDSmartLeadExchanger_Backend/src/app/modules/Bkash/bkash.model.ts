import { model, Schema } from 'mongoose';
import { IBkash } from './bkash.interface';

const bkashSchema = new Schema<IBkash>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

export const Bkash = model<IBkash>('Bkash', bkashSchema);
