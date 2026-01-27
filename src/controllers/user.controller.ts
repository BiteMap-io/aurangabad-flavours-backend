import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Handle creating a new user
   * @param req - Express request object
   * @param res - Express response object
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  /**
   * Handle retrieving a user by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  }

  /**
   * Handle updating a user by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
}
