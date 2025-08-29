import express from 'express';
import auth from '../../middlewares/auth';
import { BkashController } from './bkash.controller';

const router = express.Router();

// user creates Bkash
router.post('/', auth('admin', 'superAdmin'), BkashController.createBkash);
router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  BkashController.updateBkashStatus,
);

// admin view all Bkashs
router.get('/', auth('admin', 'superAdmin'), BkashController.getAllBkashs);

// single Bkash
router.get('/:id', auth('admin', 'superAdmin'), BkashController.getBkashById);
router.delete(
  '/:id',
  auth('admin', 'superAdmin'),
  BkashController.DeletedBkashById,
);

// user own Bkashs

export const BkashRoutes = router;
