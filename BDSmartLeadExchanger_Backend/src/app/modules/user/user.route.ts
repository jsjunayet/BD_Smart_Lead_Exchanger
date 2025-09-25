import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
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
  '/admin/get-single',
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
router.delete(
  '/admin/user-deleted/:id',
  auth('superAdmin'),
  UserController.DeletedUser,
);
router.patch(
  '/profile-edit',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    // Only parse if data exists
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid JSON' });
      }
    }
    next();
  },
  auth('admin', 'user', 'superAdmin'),
  UserController.UserProfileUpdate,
);

export const UserRoutes = router;
