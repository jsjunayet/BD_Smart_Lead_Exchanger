import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
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
  auth('admin', 'user', 'superAdmin'),
  validateRequest(jobValidation.jobSchema),
  jobController.jobPost,
);

router.patch(
  '/jobEdit/:id',
  auth('admin', 'user', 'superAdmin'),
  jobController.updateJob,
);

export const jobRoutes = router;
