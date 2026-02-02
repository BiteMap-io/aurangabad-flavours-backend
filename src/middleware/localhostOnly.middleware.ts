import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict access to localhost only
 */
export const localhostOnly = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress;

  // Check if IP is localhost (127.0.0.1 or ::1)
  const isLocal =
    ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || req.hostname === 'localhost';

  if (isLocal) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Documentation available on localhost only.' });
  }
};
