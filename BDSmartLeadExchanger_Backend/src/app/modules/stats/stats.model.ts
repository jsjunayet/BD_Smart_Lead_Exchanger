import { Schema, model } from 'mongoose';
import { IStats } from './stats.interface';

const statsSchema = new Schema<IStats>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

const Stats = model<IStats>('Stats', statsSchema);
export default Stats;
