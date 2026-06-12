import { Request, Response } from 'express';
import galleryService from '../services/gallery.service';
import s3Service from '../services/s3.service';
import { decodeBase64, uploadImage } from '../utils/image';

class GalleryController {
  /**
   * Handle gallery item upload
   */
  uploadItem = async (req: Request, res: Response): Promise<void> => {
    try {
      let imageUrl = '';
      let fileType = '';
      let fileSize = 0;
      let originalName = '';

      if (req.file) {
        const f = req.file;
        originalName = f.originalname;
        const { url, type, size } = await uploadImage('gallery', f.buffer, f.mimetype, originalName);
        imageUrl = url;
        fileType = type;
        fileSize = size;
      } else if (typeof req.body.image === 'string' && (req.body.image.startsWith('data:image/') || req.body.image.length > 500)) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          originalName = `gallery-item-${Date.now()}`;
          const { url, type, size } = await uploadImage('gallery', decoded.buffer, decoded.type, originalName);
          imageUrl = url;
          fileType = type;
          fileSize = size;
        }
      }

      if (!imageUrl) {
        res.status(400).json({ error: 'No image provided' });
        return;
      }

      let tags = [];
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        // Handle comma separated strings or stringified JSON arrays
        if (req.body.tags.startsWith('[') && req.body.tags.endsWith(']')) {
          try { tags = JSON.parse(req.body.tags); } catch { tags = [req.body.tags]; }
        } else {
          tags = req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }

      const galleryItem = await galleryService.createGalleryItem({
        title: req.body.title || originalName,
        description: req.body.description || '',
        url: imageUrl,
        type: fileType,
        size: fileSize,
        tags: tags,
      });

      res.status(201).json(galleryItem);
    } catch (error) {
      console.error('Gallery upload error:', error);
      res.status(500).json({ error: 'Failed to upload gallery item' });
    }
  };

  /**
   * Get all gallery items
   */
  getAllItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tag } = req.query;
      const items = await galleryService.getAllItems(tag as string);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve gallery' });
    }
  };

  /**
   * Delete gallery item
   */
  deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await galleryService.getItemById(req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      // Extract S3 key from URL
      const urlObj = new URL(item.url);
      const key = urlObj.pathname.substring(1); // Remove leading slash

      await s3Service.deleteObject(key);
      await galleryService.deleteItem(req.params.id);

      res.status(200).json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
      console.error('Gallery delete error:', error);
      res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  };
}

export default new GalleryController();
