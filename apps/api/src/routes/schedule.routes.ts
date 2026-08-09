import { Router } from 'express';
import {
  createScheduleHandler,
  getSchedulesHandler,
  getScheduleByIdHandler,
  updateScheduleHandler,
  deleteScheduleHandler,
} from '../controllers/schedule.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createScheduleSchema, updateScheduleSchema } from '@sub-tracker/shared';

const router = Router();

router.use(authenticate);

router.post('/', validate(createScheduleSchema), createScheduleHandler);
router.get('/', getSchedulesHandler);
router.get('/:id', getScheduleByIdHandler);
router.put('/:id', validate(updateScheduleSchema), updateScheduleHandler);
router.delete('/:id', deleteScheduleHandler);

export default router;
