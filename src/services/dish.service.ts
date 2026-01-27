import Dish, { IDish } from '../models/dish.model';

/**
 * @author Denizuh
 * @description Service for dish-related operations
 * @date 2026-01-27
 *
 * @notes
 * - This service provides functions to interact with dish data in the database.
 * - It includes methods for creating, retrieving, updating, and deleting dishes.
 */
class DishService {
  /**
   * Create a new dish
   * @param dishData - Data for the new dish
   * @returns The created dish document
   */
  async createDish(dishData: Partial<IDish>): Promise<IDish> {
    const newDish = new Dish(dishData);
    return newDish.save();
  }

  /**
   * Get a dish by ID
   * @param dishId - The ID of the dish to retrieve
   * @returns The dish document or null if not found
   */
  async getDishById(dishId: string): Promise<IDish | null> {
    return Dish.findById(dishId).exec();
  }

  /**
   * Get all dishes
   * @returns List of all dishes
   */
  async getAllDishes(): Promise<IDish[]> {
    return Dish.find().exec();
  }

  /**
   * Update a dish by ID
   * @param dishId - The ID of the dish to update
   * @param updateData - Data to update the dish with
   * @returns The updated dish document or null if not found
   */
  async updateDish(dishId: string, updateData: Partial<IDish>): Promise<IDish | null> {
    return Dish.findByIdAndUpdate(dishId, updateData, { new: true }).exec();
  }

  /**
   * Delete a dish by ID
   * @param dishId - The ID of the dish to delete
   * @returns The deleted dish document or null if not found
   */
  async deleteDish(dishId: string): Promise<IDish | null> {
    return Dish.findByIdAndDelete(dishId).exec();
  }
}

export default DishService;
