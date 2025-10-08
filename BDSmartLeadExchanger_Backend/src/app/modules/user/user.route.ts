import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get(
  '/admin/get-all',
  auth('admin', 'superAdmin'),
  UserController.GetAllUser,
);
router.get(
  '/admin/get-single/:id',
  auth('admin', 'user', 'superAdmin'),
  UserController.GetAllSingleUserForAdmin,
);
router.get(
  '/user/get-single',
  auth('admin', 'user', 'superAdmin'),
  UserController.GetAllSingleUser,
);
router.get(
  '/dashboard',
  auth('admin', 'user', 'superAdmin'),
  UserController.GetDashboardData,
);
router.patch(
  '/admin/approved/:id',
  auth('admin', 'superAdmin'),
  UserController.ApprovedUser,
);
router.patch(
  '/admin/role/:id',
  auth('admin', 'superAdmin'),
  UserController.userRoleUpdate,
);
router.patch(
  '/admin/home/:id',
  auth('superAdmin'),
  UserController.userHomeUpdate,
);
router.get('/admin/home/get-all', UserController.GetAllUserForHome);

router.delete(
  '/admin/user-deleted/:id',
  auth('superAdmin', 'admin'),
  UserController.DeletedUser,
);
router.patch(
  '/profile-edit',
  auth('admin', 'user', 'superAdmin'),
  UserController.UserProfileUpdate,
);

export const UserRoutes = router;
