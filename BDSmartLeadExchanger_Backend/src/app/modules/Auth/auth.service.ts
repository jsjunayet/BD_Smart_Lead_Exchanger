import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { IUser, TLoginUser } from './auth.interface';
import { User } from './auth.model';
import { createToken, verifyToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user exists by email or userName
  const user = await User.findOne({
    $or: [{ email: payload.email }, { userName: payload.userName }],
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // checking if the user is blocked (status = false = blocked)
  if (user.status === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // checking if the user is approved
  if (!user.isApproved) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account is waiting for admin approval!',
    );
  }

  // checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // create token and send to the client
  const jwtPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const signUpUser = async (payload: IUser, file?: Express.Multer.File) => {
  if (file) {
    const imageName = `${payload.email}${payload?.name}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.image = secure_url as string;
  }
  const result = await User.create(payload);
  return result;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  console.log(userData);
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  if (user.isApproved === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account is waiting for admin approval!',
    );
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  if (user.isApproved === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account is waiting for admin approval!',
    );
  }
  // if (
  //   user.passwordChangedAt &&
  //   User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  // ) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  // }

  const jwtPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  console.log(email);
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  if (user.isApproved === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account is waiting for admin approval!',
    );
  }
  const jwtPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;

  await sendEmail(user.email, resetUILink, 'Reset your Password');

  console.log(resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }
  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }
  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  signUpUser,
};
