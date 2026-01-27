import { Request, Response } from 'express';
import DishService from '../services/dish.service';

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
   * Handle creating a new dish
   * @param req - Express request object
   * @param res - Express response object
   */
  createDish = async (req: Request, res: Response): Promise<void> => {
    try {
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
  getDishById = async (req: Request, res: Response): Promise<void> => {
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
   * Handle retrieving all dishes
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllDishes = async (req: Request, res: Response): Promise<void> => {
    try {
      const dishes = await this.dishService.getAllDishes();
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
  updateDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const dish = await this.dishService.updateDish(req.params.id, req.body);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({ error: 'Dish not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update dish' });
    }
  };

  /**
   * Handle deleting a dish by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const dish = await this.dishService.deleteDish(req.params.id);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({ error: 'Dish not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete dish' });
    }
  };
}

export default new DishController();
