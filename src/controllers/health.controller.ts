import { Request, Response } from 'express';

export function ping(_req: Request, res: Response) {
  res.json({ ok: true, time: new Date().toISOString() });
}
