import { Document, Schema } from 'mongoose';

export interface IJobSubmission extends Document {
  job: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  proofScreenshots: string[];
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: Date;
}
