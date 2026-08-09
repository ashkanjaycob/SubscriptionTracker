import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  roleId?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super-secret-jwt-key-sub-tracker',
    ) as Record<string, unknown>;
    const userId = Number(decoded.userId);
    const roleId = Number(decoded.roleId);

    if (isNaN(userId)) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token payload. userId must be a number.' });
    }

    req.user = {
      ...decoded,
      userId,
      roleId: isNaN(roleId) ? undefined : roleId,
    };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
