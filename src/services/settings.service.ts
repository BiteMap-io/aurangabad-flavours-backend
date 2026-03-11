import Settings, { ISettings } from '../models/settings.model';

class SettingsService {
  /**
   * Get application settings
   * @returns The site settings
   */
  async getSettings(): Promise<ISettings | null> {
    return Settings.findOne();
  }

  /**
   * Update application settings
   * @param settingsData - New settings data
   * @returns The updated settings
   */
  async updateSettings(settingsData: Partial<ISettings>): Promise<ISettings | null> {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(settingsData);
    } else {
      Object.assign(settings, settingsData);
    }

    return settings.save();
  }
}

export default new SettingsService();
