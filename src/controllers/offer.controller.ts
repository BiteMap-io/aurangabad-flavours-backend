import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import OfferService from '../services/offer.service';
import Restaurant from '../models/restaurant.model';

/**
 * Confirms the acting user may manage offers for a given restaurant:
 * admins can manage any restaurant's offers, owners only their own.
 */
async function canManageRestaurant(req: AuthRequest, restaurantId: string): Promise<boolean> {
  if (req.user?.userType === 'admin') return true;
  const restaurant = await Restaurant.findById(restaurantId).exec();
  return !!restaurant && restaurant.ownerId === req.user?.id;
}

class OfferController {
  private offerService: OfferService;

  constructor() {
    this.offerService = new OfferService();
  }

  createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { restaurantId } = req.body;
      if (!restaurantId) {
        res.status(400).json({ error: 'restaurantId is required' });
        return;
      }
      if (!(await canManageRestaurant(req, restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      const offer = await this.offerService.createOffer(req.body);
      res.status(201).json(offer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create offer' });
    }
  };

  getAllOffers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const restaurantId = typeof req.query.restaurantId === 'string' ? req.query.restaurantId : undefined;
      const offers = await this.offerService.getAllOffers(restaurantId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve offers' });
    }
  };

  getOfferById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const offer = await this.offerService.getOfferById(req.params.id);
      if (offer) {
        res.status(200).json(offer);
      } else {
        res.status(404).json({ error: 'Offer not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve offer' });
    }
  };

  updateOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await this.offerService.getOfferById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }
      if (!(await canManageRestaurant(req, existing.restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      // restaurantId is the ownership anchor — never let a request body move an offer to a
      // restaurant the caller doesn't own.
      delete req.body.restaurantId;
      const offer = await this.offerService.updateOffer(req.params.id, req.body);
      res.status(200).json(offer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update offer' });
    }
  };

  deleteOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await this.offerService.getOfferById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }
      if (!(await canManageRestaurant(req, existing.restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      await this.offerService.deleteOffer(req.params.id);
      res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete offer' });
    }
  };
}

export default new OfferController();
