import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { AuthControllers } from './auth.controller';
import { UserValidation } from './auth.validation';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post(
  '/signUp',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = req.body;
    if (body?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).body = JSON.parse(body.data);
    }
    next();
  },
  validateRequest(UserValidation.signupValidationSchema),
  AuthControllers.signUpUser,
);
router.post(
  '/change-password/changes',
  auth('admin', 'user', 'superAdmin'),
  validateRequest(UserValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
