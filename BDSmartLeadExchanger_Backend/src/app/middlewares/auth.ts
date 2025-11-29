import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';

import { User } from '../modules/Auth/auth.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // No Authorization Header
    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Authorization header missing!',
      );
    }

    // Check Bearer format
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid Authorization format! Use: Bearer <token>',
      );
    }

    const token = tokenParts[1];
    console.log(token, 'token');

    // Verify Token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    console.log(decoded, 'decoded');

    const { role, email } = decoded;

    // Check user
    const user = await User.findOne({ email });
    console.log(user, 'user');

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
    }

    if (user.status === false) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Access denied!');
    }

    req.user = decoded as JwtPayload & { role: string };

    next();
  });
};

export default auth;
