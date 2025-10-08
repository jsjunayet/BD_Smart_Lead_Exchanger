import { Document, Model } from 'mongoose';

export type TLoginUser = {
  identifier: string;
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
  wallet: number;
  image: string;
  ProfileImage?: string;
  surfingBalance: number;
  isApproved: boolean;
  isDeleted: boolean;
  home: boolean;
  status: boolean;
}

// 👇 এখানে Model<IUser> কে extend করে custom static method define করা হয়েছে
export interface IUserModel extends Model<IUser> {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
}
