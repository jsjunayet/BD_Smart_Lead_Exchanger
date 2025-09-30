import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { BkashRoutes } from '../modules/Bkash/bkash.route';
import { dashboardRouter } from '../modules/dashbaord/dashhboard.route';
import { DepositRoutes } from '../modules/deposit/deposit.route';
import { jobRoutes } from '../modules/job/job.route';
import { JobSubmissionRoutes } from '../modules/JobSubmission/JobSubmission.route';
import { ReportRoutes } from '../modules/report/report.route';
import { StatsRoutes } from '../modules/stats/stats.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/deposit',
    route: DepositRoutes,
  },
  {
    path: '/job',
    route: jobRoutes,
  },
  {
    path: '/submition',
    route: JobSubmissionRoutes,
  },
  {
    path: '/reports',
    route: ReportRoutes,
  },
  {
    path: '/bkash',
    route: BkashRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRouter,
  },
  {
    path: '/home',
    route: StatsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
