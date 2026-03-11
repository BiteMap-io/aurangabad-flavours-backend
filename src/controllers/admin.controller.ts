import { Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  /**
   * Handle getting dashboard stats
   */
  getStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  };

  /**
   * Handle getting recent activity
   */
  getRecentActivity = async (_req: Request, res: Response): Promise<void> => {
    try {
      const activity = await adminService.getRecentActivity();
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve recent activity' });
    }
  };
}

export default new AdminController();
