import { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  jobUrl: string;
  screenshotTitles: string[];
  thumbnail?: string;
  postedBy: Schema.Types.ObjectId;
  approvedByAdmin: boolean;
  createdAt: Date;
}
