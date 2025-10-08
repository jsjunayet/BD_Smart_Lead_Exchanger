import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { UserValidation } from './auth.validation';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post(
  '/signUp',
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
