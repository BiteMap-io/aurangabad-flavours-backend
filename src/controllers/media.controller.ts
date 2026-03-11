import { Request, Response } from 'express';
import mediaService from '../services/media.service';
import s3Service from '../services/s3.service';
import config from '../config';

class MediaController {
  /**
   * Handle media upload
   * @param req - Express request
   * @param res - Express response
   */
  uploadMedia = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const key = `media/${Date.now()}-${req.file.originalname}`;
      const { bucket } = await s3Service.uploadBuffer(key, req.file.buffer, req.file.mimetype);
      const url = `https://${bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;

      const media = await mediaService.createMedia({
        name: req.file.originalname,
        url,
        type: req.file.mimetype,
        size: req.file.size,
      });

      res.status(201).json(media);
    } catch (error) {
      console.error('Media upload error:', error);
      res.status(500).json({ error: 'Failed to upload media' });
    }
  };

  /**
   * Handle getting all media
   * @param _req - Express request
   * @param res - Express response
   */
  getAllMedia = async (_req: Request, res: Response): Promise<void> => {
    try {
      const media = await mediaService.getAllMedia();
      res.status(200).json(media);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve media' });
    }
  };

  /**
   * Handle deleting media
   * @param req - Express request
   * @param res - Express response
   */
  deleteMedia = async (req: Request, res: Response): Promise<void> => {
    try {
      const media = await mediaService.getMediaById(req.params.id);
      if (!media) {
        res.status(404).json({ error: 'Media not found' });
        return;
      }

      // Extract S3 key from URL
      const urlObj = new URL(media.url);
      const key = urlObj.pathname.substring(1); // Remove leading slash

      await s3Service.deleteObject(key);
      await mediaService.deleteMedia(req.params.id);

      res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
      console.error('Media delete error:', error);
      res.status(500).json({ error: 'Failed to delete media' });
    }
  };
}

export default new MediaController();
