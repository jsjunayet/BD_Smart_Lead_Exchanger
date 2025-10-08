import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { IUser, IUserModel } from './auth.interface';

const UserSchema = new Schema<IUser, IUserModel>( // 👈 এখানে IUserModel include করো
  {
    name: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    affiliateNetworkName: { type: String, required: true, trim: true },
    publisherId: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', required: true },
    image: { type: String, required: true, default: '' },
    ProfileImage: { type: String, default: '' },
    surfingBalance: { type: Number, default: 5 },
    wallet: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false, required: true },
    status: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    home: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  try {
    if (this.isModified('email')) {
      const existingEmail = await User.findOne({ email: this.email });
      if (existingEmail) return next(new Error('Email already exists'));
    }

    if (this.isModified('userName')) {
      const existingUserName = await User.findOne({ userName: this.userName });
      if (existingUserName) return next(new Error('Username already exists'));
    }

    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.isPasswordMatched = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User =
  mongoose.models.User || mongoose.model<IUser, IUserModel>('User', UserSchema);
