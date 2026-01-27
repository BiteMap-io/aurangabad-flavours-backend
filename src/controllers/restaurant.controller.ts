import { Request, Response } from 'express';
import RestaurantService from '../services/restaurant.service';

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
      const restaurant = await this.restaurantService.createRestaurant(req.body);
      res.status(201).json(restaurant);
    } catch (error) {
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
      const restaurant = await this.restaurantService.updateRestaurant(
        req.params.id,
        req.body
      );
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error) {
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
}

export default new RestaurantController();
