import { Router } from 'express';
import subscriptionRoutes from './subscription.routes.js';
import channelRoutes from './channel.routes.js';
import scheduleRoutes from './schedule.routes.js';

const router = Router();

router.use('/subscriptions', subscriptionRoutes);
router.use('/channels', channelRoutes);
router.use('/schedules', scheduleRoutes);

export default router;
