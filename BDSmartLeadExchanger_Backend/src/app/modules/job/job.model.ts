import { model, Schema } from 'mongoose';
import { IJob } from './job.interface';

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    jobUrl: { type: String, required: true },
    screenshotTitles: [String],
    thumbnail: String,
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Job = model<IJob>('Job', JobSchema);
