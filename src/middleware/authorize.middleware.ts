import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware to authorize users based on allowed roles
 * @param allowedRoles - Array of allowed user types
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.userType) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};
