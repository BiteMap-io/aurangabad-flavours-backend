import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import DishService from '../services/dish.service';
import Restaurant from '../models/restaurant.model';

/**
 * @author Denizuh
 * @description Controller for dish-related operations
 * @date 2026-01-27
 */
class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  /**
   * Confirms the acting user may manage dishes for a given restaurant: admins
   * can manage any restaurant's dishes, owners only their own.
   */
  private async canManageRestaurant(req: AuthRequest, restaurantId: string): Promise<boolean> {
    if (req.user?.userType === 'admin') return true;
    const restaurant = await Restaurant.findById(restaurantId).exec();
    return !!restaurant && restaurant.ownerId === req.user?.id;
  }

  /**
   * Handle creating a new dish
   * @param req - Express request object
   * @param res - Express response object
   */
  createDish = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { restaurantId } = req.body;
      if (!restaurantId) {
        res.status(400).json({ error: 'restaurantId is required' });
        return;
      }
      if (!(await this.canManageRestaurant(req, restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      const dish = await this.dishService.createDish(req.body);
      res.status(201).json(dish);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create dish' });
    }
  };

  /**
   * Handle retrieving a dish by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getDishById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dish = await this.dishService.getDishById(req.params.id);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({ error: 'Dish not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve dish' });
    }
  };

  /**
   * Handle retrieving all dishes, optionally filtered by restaurant
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllDishes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const restaurantId = typeof req.query.restaurantId === 'string' ? req.query.restaurantId : undefined;
      const dishes = await this.dishService.getAllDishes(restaurantId);
      res.status(200).json(dishes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve dishes' });
    }
  };

  /**
   * Handle updating a dish by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateDish = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await this.dishService.getDishById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }
      if (!(await this.canManageRestaurant(req, existing.restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      // restaurantId is the ownership anchor — never let a request body move a dish
      // to a restaurant the caller doesn't own.
      delete req.body.restaurantId;
      const dish = await this.dishService.updateDish(req.params.id, req.body);
      res.status(200).json(dish);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update dish' });
    }
  };

  /**
   * Handle deleting a dish by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteDish = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await this.dishService.getDishById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }
      if (!(await this.canManageRestaurant(req, existing.restaurantId))) {
        res.status(403).json({ error: 'Access denied: you do not own this restaurant' });
        return;
      }
      await this.dishService.deleteDish(req.params.id);
      res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete dish' });
    }
  };
}

export default new DishController();
