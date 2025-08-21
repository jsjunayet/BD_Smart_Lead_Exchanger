import { Document } from 'mongoose';

export type TLoginUser = {
  email: string;
  password: string;
};

export interface IUser extends Document {
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  affiliateNetworkName: string;
  publisherId: string;
  password: string;
  role: string;
  image: string;
  isApproved: boolean;
  isDeleted: boolean;
  status: boolean;
}
