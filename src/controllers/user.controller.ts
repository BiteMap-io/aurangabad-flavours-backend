import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Handle user signup
   * @param req - Express request object
   * @param res - Express response object
   */
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      // Generate token (omitted for brevity, usually done here or in a helper)
      // For now returning user. ideally return token.
      // Let's generate a token here for completeness
      const jwt = require('jsonwebtoken'); // Lazy load to avoid top level dependency if not strictly needed there
      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1d' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  /**
   * Handle user login
   * @param req - Express request object
   * @param res - Express response object
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1d' }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Handle creating a new user (admin only maybe? or same as signup)
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

export default new UserController();
