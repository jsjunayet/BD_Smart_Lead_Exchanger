import express from 'express';
import auth from '../../middlewares/auth';
import { JobSubmissionController } from './JobSubmission.controller';

const router = express.Router();

router.patch(
  '/review/:id',
  auth('admin', 'superAdmin', 'user'),
  JobSubmissionController.reviewSubmission,
);

router.post(
  '/jobSubmit/:id',
  auth('admin', 'user', 'superAdmin'),
  JobSubmissionController.jobSubmitted,
);

router.get(
  '/get-all-submittion',
  auth('admin', 'superAdmin'),
  JobSubmissionController.getAllSubmission,
);
router.get(
  '/get-own-submittion',
  auth('admin', 'superAdmin', 'user'),
  JobSubmissionController.getOwnSubmission,
);
router.get(
  '/get-own-submittion/:id',
  auth('admin', 'superAdmin', 'user'),
  JobSubmissionController.getSingleSubmission,
);
router.delete(
  '/get-Job-deleted/job/:id',
  auth('admin', 'superAdmin'),
  JobSubmissionController.deletedSubmission,
);
export const JobSubmissionRoutes = router;
