import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { SubscriptionService } from '../services/subscription.service.js';

export const createSubscriptionHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await SubscriptionService.create(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscriptions = await SubscriptionService.getAllByUser(req.user!.userId);
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await SubscriptionService.getById(Number(req.params.id), req.user!.userId);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await SubscriptionService.update(
      Number(req.params.id),
      req.user!.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriptionHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await SubscriptionService.delete(Number(req.params.id), req.user!.userId);
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
};
