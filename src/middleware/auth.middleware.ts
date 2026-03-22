import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import config from '../config';

export interface AuthRequest extends Request {
  user?: Partial<IUser>;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as Partial<IUser>;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
