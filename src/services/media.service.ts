import Media, { IMedia } from '../models/media.model';

class MediaService {
  /**
   * Create a new media record
   * @param mediaData - Media data
   * @returns The created media record
   */
  async createMedia(mediaData: Partial<IMedia>): Promise<IMedia> {
    const media = new Media(mediaData);
    return media.save();
  }

  /**
   * Get all media records
   * @returns List of all media
   */
  async getAllMedia(): Promise<IMedia[]> {
    return Media.find().sort({ createdAt: -1 });
  }

  /**
   * Get media by ID
   * @param id - Media ID
   * @returns The media record
   */
  async getMediaById(id: string): Promise<IMedia | null> {
    return Media.findById(id);
  }

  /**
   * Delete media record
   * @param id - Media ID
   * @returns The deleted media record
   */
  async deleteMedia(id: string): Promise<IMedia | null> {
    return Media.findByIdAndDelete(id);
  }
}

export default new MediaService();
