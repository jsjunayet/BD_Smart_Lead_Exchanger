import express from 'express';
import auth from '../../middlewares/auth';
import { BkashController } from './bkash.controller';

const router = express.Router();

// user creates Bkash
router.post('/', auth('superAdmin'), BkashController.createBkash);
router.patch('/:id', auth('superAdmin'), BkashController.updateBkashStatus);

// admin view all Bkashs
router.get(
  '/',
  auth('admin', 'superAdmin', 'user'),
  BkashController.getAllBkashs,
);

// single Bkash
router.get('/:id', auth('admin', 'superAdmin'), BkashController.getBkashById);
router.delete(
  '/:id',
  auth( 'superAdmin'),
  BkashController.DeletedBkashById,
);

// user own Bkashs

export const BkashRoutes = router;
