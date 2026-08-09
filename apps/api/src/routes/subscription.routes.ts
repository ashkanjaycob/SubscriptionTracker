import { Router } from 'express';
import {
  createSubscriptionHandler,
  getSubscriptionsHandler,
  getSubscriptionByIdHandler,
  updateSubscriptionHandler,
  deleteSubscriptionHandler,
} from '../controllers/subscription.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createSubscriptionSchema, updateSubscriptionSchema } from '@sub-tracker/shared';

const router = Router();

router.use(authenticate);

router.post('/', validate(createSubscriptionSchema), createSubscriptionHandler);
router.get('/', getSubscriptionsHandler);
router.get('/:id', getSubscriptionByIdHandler);
router.put('/:id', validate(updateSubscriptionSchema), updateSubscriptionHandler);
router.delete('/:id', deleteSubscriptionHandler);

export default router;
