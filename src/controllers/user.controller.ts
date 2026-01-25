import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import s3Service from '../services/s3.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;
    let avatarKey;

    if (req.file && req.file.buffer) {
      const key = `avatars/${Date.now()}-${req.file.originalname}`;
      await s3Service.uploadBuffer(key, req.file.buffer, req.file.mimetype);
      avatarKey = key;
    }

    const user = await userService.createUser({ name, email, avatarKey });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}
