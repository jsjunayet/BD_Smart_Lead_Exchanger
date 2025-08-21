import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { DepositRoutes } from '../modules/deposit/deposit.route';
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
