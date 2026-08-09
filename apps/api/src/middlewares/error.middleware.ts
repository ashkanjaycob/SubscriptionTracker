import { Request, Response, NextFunction } from 'express';

interface AppError {
  statusCode?: number;
  message?: string;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[Error] ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
