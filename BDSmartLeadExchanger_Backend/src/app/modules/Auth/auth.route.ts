import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { UserValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

// router.post(
//   '/signUp',
//   upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     next();
//   },
//   validateRequest(UserValidation.signupValidationSchema),
//   AuthControllers.signUpUser,
// );
// router.post(
//   '/change-password',
//   auth('admin', 'user'),
//   validateRequest(UserValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// );

// router.post(
//   '/refresh-token',
//   validateRequest(UserValidation.refreshTokenValidationSchema),
//   AuthControllers.refreshToken,
// );

// router.post(
//   '/forget-password',
//   validateRequest(UserValidation.forgetPasswordValidationSchema),
//   AuthControllers.forgetPassword,
// );

// router.post(
//   '/reset-password',
//   validateRequest(UserValidation.forgetPasswordValidationSchema),
//   AuthControllers.resetPassword,
// );

export const AuthRoutes = router;
