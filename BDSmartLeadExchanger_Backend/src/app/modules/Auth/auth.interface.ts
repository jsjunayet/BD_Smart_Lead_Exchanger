import { Document, Model } from 'mongoose';

export type TLoginUser = {
  email: string;
  userName?: string;
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
  ProfileImage: string;
  surfingBalance: number;
  isApproved: boolean;
  isDeleted: boolean;
  status: boolean;
}
export interface IUserModel extends Model<IUser> {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
}
