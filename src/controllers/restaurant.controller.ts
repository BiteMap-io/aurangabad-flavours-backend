import { Request, Response } from 'express';
import RestaurantService from '../services/restaurant.service';
import { decodeBase64, uploadImage } from '../utils/image';
import * as XLSX from 'xlsx';

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// Parse Excel/CSV buffer → menu items array
function parseMenuExcel(buffer: Buffer): { name: string; category: string; price: number; isVeg: boolean }[] {
  try {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
    return rows
      .filter(r => r.name || r.Name || r.ITEM || r.item || r['Item Name'])
      .map(r => ({
        name: String(r.name || r.Name || r.ITEM || r.item || r['Item Name'] || '').trim(),
        category: String(r.category || r.Category || r.CATEGORY || r.type || r.Type || '').trim(),
        price: parseFloat(String(r.price || r.Price || r.PRICE || r.rate || r.Rate || '0')) || 0,
        isVeg: String(r.isVeg || r.veg || r.Veg || r.type || '').toLowerCase().includes('veg')
          && !String(r.isVeg || r.veg || r.Veg || r.type || '').toLowerCase().includes('non'),
      }))
      .filter(item => item.name.length > 0);
  } catch {
    return [];
  }
}

/**
 * Build the final gallery URL list for a restaurant: kept existing URLs (sent by the client as
 * an `existingGallery` JSON array) plus any newly uploaded gallery files (compressed → WebP → CDN).
 */
async function buildGalleryUrls(
  galleryFiles: Express.Multer.File[] | undefined,
  existingGallery: unknown,
  folder: string
): Promise<string[]> {
  const urls: string[] = [];

  // 1. Existing images the user chose to keep
  if (existingGallery !== undefined) {
    let kept: unknown = existingGallery;
    if (typeof kept === 'string') {
      try { kept = JSON.parse(kept); } catch { kept = [kept]; }
    }
    if (Array.isArray(kept)) {
      urls.push(...kept.filter((u): u is string => typeof u === 'string' && u.length > 0));
    }
  }

  // 2. Newly uploaded files
  if (galleryFiles?.length) {
    for (const g of galleryFiles) {
      const { url } = await uploadImage(`restaurants/${folder}/gallery`, g.buffer, g.mimetype, g.originalname);
      urls.push(url);
    }
  }

  return urls;
}

/**
 * @author Denizuh
 * @description Controller for restaurant-related operations
 * @date 2026-01-27
 */
class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  /**
   * Handle creating a new restaurant
   * @param req - Express request object
   * @param res - Express response object
   */
  createRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const restaurantName = req.body.name || 'unknown';
      const folder = slugify(restaurantName);

      if (files?.image?.[0]) {
        const f = files.image[0];
        const { url } = await uploadImage(`restaurants/${folder}`, f.buffer, f.mimetype, f.originalname);
        req.body.image = url;
      } else if (typeof req.body.image === 'string' && (req.body.image.startsWith('data:image/') || req.body.image.length > 500)) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const { url } = await uploadImage(`restaurants/${folder}`, decoded.buffer, decoded.type);
          req.body.image = url;
        }
      }


      // Parse menu Excel if uploaded
      if (files?.menu?.[0]) {
        req.body.menuItems = parseMenuExcel(files.menu[0].buffer);
      }

      // Gallery images (multiple) — kept existing URLs + newly uploaded files
      if (files?.gallery?.length || req.body.existingGallery !== undefined) {
        req.body.gallery = await buildGalleryUrls(files?.gallery, req.body.existingGallery, folder);
      }
      delete req.body.existingGallery;

      // Parse location coordinates from FormData strings → numbers
      if (req.body['location[coordinates][0]'] !== undefined) {
        req.body.location = {
          type: req.body['location[type]'] || 'Point',
          coordinates: [
            parseFloat(req.body['location[coordinates][0]']),
            parseFloat(req.body['location[coordinates][1]']),
          ],
        };
        delete req.body['location[type]'];
        delete req.body['location[coordinates][0]'];
        delete req.body['location[coordinates][1]'];
      } else if (req.body.location && typeof req.body.location === 'string') {
        try { req.body.location = JSON.parse(req.body.location); } catch {}
      }

      if (req.body.rating !== undefined) req.body.rating = parseFloat(req.body.rating);
      if (req.body.seatingCapacity !== undefined) req.body.seatingCapacity = parseFloat(req.body.seatingCapacity) || 0;
      if (req.body.avgPricePerPerson !== undefined) req.body.avgPricePerPerson = parseFloat(req.body.avgPricePerPerson) || 0;

      // Parse JSON-stringified nested objects from FormData
      for (const key of ['extraFacilities', 'food', 'staff', 'environment']) {
        if (req.body[key] && typeof req.body[key] === 'string') {
          try { req.body[key] = JSON.parse(req.body[key]); } catch {}
        }
      }

      const restaurant = await this.restaurantService.createRestaurant(req.body);
      res.status(201).json(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      res.status(500).json({ error: 'Failed to create restaurant' });
    }
  };

  /**
   * Handle retrieving a restaurant by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getRestaurantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(req.params.id);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve restaurant' });
    }
  };

  /**
   * Handle retrieving all restaurants
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurants = await this.restaurantService.getAllRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve restaurants' });
    }
  };

  /**
   * Handle updating a restaurant by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const restaurantName = req.body.name || 'updated-restaurant';
      const folder = slugify(restaurantName);

      if (files?.image?.[0]) {
        const f = files.image[0];
        const { url } = await uploadImage(`restaurants/${folder}`, f.buffer, f.mimetype, f.originalname);
        req.body.image = url;
      } else if (typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const { url } = await uploadImage(`restaurants/${folder}`, decoded.buffer, decoded.type);
          req.body.image = url;
        }
      }


      // Parse menu Excel if uploaded
      if (files?.menu?.[0]) {
        req.body.menuItems = parseMenuExcel(files.menu[0].buffer);
      }

      // Gallery images (multiple) — kept existing URLs + newly uploaded files
      if (files?.gallery?.length || req.body.existingGallery !== undefined) {
        req.body.gallery = await buildGalleryUrls(files?.gallery, req.body.existingGallery, folder);
      }
      delete req.body.existingGallery;

      // Parse location coordinates from FormData strings → numbers
      if (req.body['location[coordinates][0]'] !== undefined) {
        req.body.location = {
          type: req.body['location[type]'] || 'Point',
          coordinates: [
            parseFloat(req.body['location[coordinates][0]']),
            parseFloat(req.body['location[coordinates][1]']),
          ],
        };
        delete req.body['location[type]'];
        delete req.body['location[coordinates][0]'];
        delete req.body['location[coordinates][1]'];
      } else if (req.body.location && typeof req.body.location === 'string') {
        try { req.body.location = JSON.parse(req.body.location); } catch {}
      }

      // Strip Mongoose read-only / internal fields that cause cast errors
      const { _id, __v, createdAt, updatedAt, dishes, reviews, views, ...updateData } = req.body;

      // Ensure numeric types
      if (updateData.rating !== undefined) updateData.rating = parseFloat(updateData.rating);
      if (updateData.seatingCapacity !== undefined) updateData.seatingCapacity = parseFloat(updateData.seatingCapacity) || 0;
      if (updateData.avgPricePerPerson !== undefined) updateData.avgPricePerPerson = parseFloat(updateData.avgPricePerPerson) || 0;

      // Parse JSON-stringified nested objects from FormData
      for (const key of ['extraFacilities', 'food', 'staff', 'environment']) {
        if (updateData[key] && typeof updateData[key] === 'string') {
          try { updateData[key] = JSON.parse(updateData[key]); } catch {}
        }
      }

      const restaurant = await this.restaurantService.updateRestaurant(req.params.id, updateData);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      res.status(500).json({ error: 'Failed to update restaurant' });
    }
  };

  /**
   * Handle deleting a restaurant by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.deleteRestaurant(req.params.id);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete restaurant' });
    }
  };

  /**
   * Handle toggling featured status (ihmRecommended)
   * @param req - Express request object
   * @param res - Express response object
   */
  toggleFeatured = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(req.params.id);
      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }

      restaurant.ihmRecommended = !restaurant.ihmRecommended;
      await restaurant.save();
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle featured status' });
    }
  };

  addReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rating, comment } = req.body;
      const user = (req as any).user;

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5' });
        return;
      }

      const restaurant = await this.restaurantService.getRestaurantById(req.params.id);
      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }

      const review = {
        user: user.id,
        userName: user.name || user.email,
        rating: Number(rating),
        comment: comment || '',
        createdAt: new Date(),
      };

      restaurant.reviews.push(review as any);

      // Recalculate average rating
      const total = restaurant.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      restaurant.rating = Math.round((total / restaurant.reviews.length) * 10) / 10;

      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Failed to add review' });
    }
  };
}

export default new RestaurantController();
