import { Request, Response } from 'express';
import FoodTrailService from '../services/foodTrail.service';

/**
 * @author Denizuh
 * @description Controller for food trail-related operations
 * @date 2026-01-27
 */
class FoodTrailController {
  private foodTrailService: FoodTrailService;

  constructor() {
    this.foodTrailService = new FoodTrailService();
  }

  /**
   * Handle creating a new food trail
   * @param req - Express request object
   * @param res - Express response object
   */
  createFoodTrail = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodTrail = await this.foodTrailService.createFoodTrail(req.body);
      res.status(201).json(foodTrail);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create food trail' });
    }
  };

  /**
   * Handle retrieving a food trail by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getFoodTrailById = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodTrail = await this.foodTrailService.getFoodTrailById(req.params.id);
      if (foodTrail) {
        res.status(200).json(foodTrail);
      } else {
        res.status(404).json({ error: 'Food trail not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve food trail' });
    }
  };

  /**
   * Handle retrieving all food trails
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllFoodTrails = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodTrails = await this.foodTrailService.getAllFoodTrails();
      res.status(200).json(foodTrails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve food trails' });
    }
  };

  /**
   * Handle updating a food trail by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateFoodTrail = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodTrail = await this.foodTrailService.updateFoodTrail(
        req.params.id,
        req.body
      );
      if (foodTrail) {
        res.status(200).json(foodTrail);
      } else {
        res.status(404).json({ error: 'Food trail not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update food trail' });
    }
  };

  /**
   * Handle deleting a food trail by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteFoodTrail = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodTrail = await this.foodTrailService.deleteFoodTrail(req.params.id);
      if (foodTrail) {
        res.status(200).json(foodTrail);
      } else {
        res.status(404).json({ error: 'Food trail not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete food trail' });
    }
  };
}

export default new FoodTrailController();
