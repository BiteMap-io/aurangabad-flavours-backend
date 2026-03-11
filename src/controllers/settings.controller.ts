import { Request, Response } from 'express';
import settingsService from '../services/settings.service';

class SettingsController {
  /**
   * Handle getting settings
   * @param _req - Express request
   * @param res - Express response
   */
  getSettings = async (_req: Request, res: Response): Promise<void> => {
    try {
      const settings = await settingsService.getSettings();
      res.status(200).json(settings || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve settings' });
    }
  };

  /**
   * Handle updating settings
   * @param req - Express request
   * @param res - Express response
   */
  updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await settingsService.updateSettings(req.body);
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  };
}

export default new SettingsController();
