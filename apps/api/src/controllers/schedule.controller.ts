import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { ScheduleService } from '../services/schedule.service.js';

export const createScheduleHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schedule = await ScheduleService.create(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export const getSchedulesHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const schedules = await ScheduleService.getAllByUser(req.user!.userId);
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};

export const getScheduleByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schedule = await ScheduleService.getById(Number(req.params.id), req.user!.userId);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export const updateScheduleHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schedule = await ScheduleService.update(
      Number(req.params.id),
      req.user!.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export const deleteScheduleHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await ScheduleService.delete(Number(req.params.id), req.user!.userId);
    res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};
