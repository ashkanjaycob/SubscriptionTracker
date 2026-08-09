import { Router } from 'express';
import { ChannelService } from '../services/channel.service.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createChannelSchema } from '@sub-tracker/shared';

const router = Router();
router.use(authenticate);

router.post('/', validate(createChannelSchema), async (req, res, next) => {
  try {
    const channel = await ChannelService.create(req.body);
    res.status(201).json({ success: true, data: channel });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const channels = await ChannelService.getAll();
    res.status(200).json({ success: true, data: channels });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await ChannelService.delete(Number(req.params.id));
    res.status(200).json({ success: true, message: 'Channel deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
