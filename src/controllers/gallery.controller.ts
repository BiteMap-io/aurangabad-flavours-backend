import { Request, Response } from 'express';
import galleryService from '../services/gallery.service';
import s3Service from '../services/s3.service';

const decodeBase64 = (base64String: string) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      type: matches[1],
      buffer: Buffer.from(matches[2], 'base64'),
    };
  }
  // Fallback for raw base64
  try {
    const buffer = Buffer.from(base64String.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    return { type: 'image/png', buffer };
  } catch {
    return null;
  }
};

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
        const key = `gallery/${Date.now()}-${originalName}`;
        const { url } = await s3Service.uploadBuffer(key, f.buffer, f.mimetype);
        imageUrl = url;
        fileType = f.mimetype;
        fileSize = f.size;
        console.log(`successfully stored gallery item: ${url}`);
      } else if (typeof req.body.image === 'string' && (req.body.image.startsWith('data:image/') || req.body.image.length > 500)) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const extension = decoded.type.split('/')[1] || 'png';
          originalName = `gallery-item-${Date.now()}.${extension}`;
          const key = `gallery/${Date.now()}-${originalName}`;
          const { url } = await s3Service.uploadBuffer(key, decoded.buffer, decoded.type);
          imageUrl = url;
          fileType = decoded.type;
          fileSize = decoded.buffer.length;
          console.log(`successfully stored gallery base64 item: ${url}`);
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
