import express from 'express';
import auth from '../../middlewares/auth';
import { StatsController } from './stats.controller';

const router = express.Router();

router.post('/', auth('superAdmin'), StatsController.createStats);
router.get('/', StatsController.getAllStats);
router.get('/:id', StatsController.getSingleStats);
router.patch('/:id', auth('superAdmin'), StatsController.updateStats);
router.delete('/:id', auth('superAdmin'), StatsController.deleteStats);

export const StatsRoutes = router;
