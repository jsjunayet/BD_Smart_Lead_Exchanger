import express, { NextFunction } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { jobController } from './job.controller';
import { jobValidation } from './job.validation';

const router = express.Router();
router.get(
  '/get-all',
  auth('admin', 'superAdmin'),
  jobController.getAlljobForAdmin,
);
router.get(
  '/get-workplace',
  auth('admin', 'superAdmin', 'user'),
  jobController.getWorkplaceJobs,
);
router.get(
  '/get-own',
  auth('admin', 'superAdmin', 'user'),
  jobController.getJobsByOwner,
);
router.patch(
  '/action/:id',
  auth('admin', 'superAdmin'),
  jobController.approveOrrejectJob,
);
router.patch(
  '/review',
  auth('admin', 'superAdmin', 'user'),
  jobController.reviewSubmission,
);
router.post(
  '/jobPost',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('admin', 'user', 'superAdmin'),
  validateRequest(jobValidation.jobSchema),
  jobController.jobPost,
);
router.patch(
  '/jobEdit/:id',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('admin', 'user', 'superAdmin'),
  jobController.updateJob,
);

export const jobRoutes = router;
