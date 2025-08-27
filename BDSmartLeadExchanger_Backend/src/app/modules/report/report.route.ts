import express from 'express';
import auth from '../../middlewares/auth';
import { ReportController } from './report.controller';

const router = express.Router();

// user creates report
router.post(
  '/',
  auth('user', 'admin', 'superAdmin'),
  ReportController.createReport,
);
router.patch(
  '/status/:id',
  auth('admin', 'superAdmin'),
  ReportController.updateReportStatus,
);

// admin view all reports
router.get('/', auth('admin', 'superAdmin'), ReportController.getAllReports);

// single report
router.get(
  '/:id',
  auth('admin', 'superAdmin', 'user'),
  ReportController.getReportById,
);

// user own reports
router.get(
  '/my/reports',
  auth('user', 'admin', 'superAdmin'),
  ReportController.getMyReports,
);

export const ReportRoutes = router;
