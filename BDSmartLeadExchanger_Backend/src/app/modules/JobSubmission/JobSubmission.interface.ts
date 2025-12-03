import { Document, Schema } from 'mongoose';

export interface IJobSubmission extends Document {
  job: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  autoApproveJobId: string | null;
  proofScreenshots: string[];
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: Date;
  rejectReason: string;
  createdAt: Date;
}
