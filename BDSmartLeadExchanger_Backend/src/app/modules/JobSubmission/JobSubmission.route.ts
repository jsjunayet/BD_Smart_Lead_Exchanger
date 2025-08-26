import express, { NextFunction } from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import { JobSubmissionController } from './JobSubmission.controller';

const router = express.Router();

router.patch(
  '/review/:id',
  auth('admin', 'superAdmin', 'user'),
  JobSubmissionController.reviewSubmission,
);

router.post(
  '/jobSubmit/:id',
  upload.array('files', 4), // max 4 screenshot allow
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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
export const JobSubmissionRoutes = router;
