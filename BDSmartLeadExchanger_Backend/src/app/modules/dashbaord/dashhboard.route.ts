import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  getAdminDashboardStats,
  getStatsWithFilter,
} from './dashboard.controller';

const router = Router();

router.get('/stats', auth('admin', 'superAdmin'), getAdminDashboardStats);

router.get('/filtered-stats', auth('admin', 'superAdmin'), getStatsWithFilter);
export const dashboardRouter = router;
