import { Types } from 'mongoose';

export interface IReport {
  user: Types.ObjectId; // who created the report
  submission: Types.ObjectId; // related JobSubmission
  reason: string; // why user reported
  status: 'pending' | 'resolved' | 'rejected'; // admin review status
  createdAt?: Date;
  updatedAt?: Date;
}
