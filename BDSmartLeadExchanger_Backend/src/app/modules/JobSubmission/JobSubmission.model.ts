import { model, Schema } from 'mongoose';
import { IJobSubmission } from './JobSubmission.interface';

const JobSubmissionSchema = new Schema<IJobSubmission>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    autoApproveJobId: { type: Schema.Types.ObjectId, default: null },
    proofScreenshots: [String],
    status: {
      type: String,
      enum: ['submitted', 'approved', 'rejected'],
      default: 'submitted',
    },
    submittedAt: { type: Date, default: Date.now },
    rejectReason: { type: String, default: '' },
  },

  { timestamps: true },
);

export const JobSubmission = model<IJobSubmission>(
  'JobSubmission',
  JobSubmissionSchema,
);
