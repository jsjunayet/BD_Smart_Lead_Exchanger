import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DepositController } from './deposit.controller';
import { depositeValidation } from './deposit.validation';

const router = express.Router();
router.get(
  '/get-all',
  auth('admin', 'superAdmin'),
  DepositController.getAllDepositsForAdmin,
);
router.get(
  '/get-own',
  auth('admin', 'superAdmin', 'user'),
  DepositController.getUserDeposits,
);
router.post(
  '/added',
  auth('admin', 'user', 'superAdmin'),
  validateRequest(depositeValidation.createDepositSchema),
  DepositController.createDepositSchema,
);
router.patch(
  '/admin/:id',
  auth('admin', 'superAdmin'),
  validateRequest(depositeValidation.updateDepositSchema),
  DepositController.updateDepositStatus,
);

export const DepositRoutes = router;
