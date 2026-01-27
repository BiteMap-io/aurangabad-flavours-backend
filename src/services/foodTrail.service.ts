import FoodTrail, { IFoodTrail } from '../models/foodTrail.model';

/**
 * @author Denizuh
 * @description Service for food trail-related operations
 * @date 2026-01-27
 *
 * @notes
 * - This service provides functions to interact with food trail data in the database.
 * - It includes methods for creating, retrieving, updating, and deleting food trails.
 */
class FoodTrailService {
  /**
   * Create a new food trail
   * @param foodTrailData - Data for the new food trail
   * @returns The created food trail document
   */
  async createFoodTrail(foodTrailData: Partial<IFoodTrail>): Promise<IFoodTrail> {
    const newFoodTrail = new FoodTrail(foodTrailData);
    return newFoodTrail.save();
  }

  /**
   * Get a food trail by ID
   * @param foodTrailId - The ID of the food trail to retrieve
   * @returns The food trail document or null if not found
   */
  async getFoodTrailById(foodTrailId: string): Promise<IFoodTrail | null> {
    return FoodTrail.findById(foodTrailId).exec();
  }

  /**
   * Get all food trails
   * @returns List of all food trails
   */
  async getAllFoodTrails(): Promise<IFoodTrail[]> {
    return FoodTrail.find().exec();
  }

  /**
   * Update a food trail by ID
   * @param foodTrailId - The ID of the food trail to update
   * @param updateData - Data to update the food trail with
   * @returns The updated food trail document or null if not found
   */
  async updateFoodTrail(foodTrailId: string, updateData: Partial<IFoodTrail>): Promise<IFoodTrail | null> {
    return FoodTrail.findByIdAndUpdate(foodTrailId, updateData, { new: true }).exec();
  }

  /**
   * Delete a food trail by ID
   * @param foodTrailId - The ID of the food trail to delete
   * @returns The deleted food trail document or null if not found
   */
  async deleteFoodTrail(foodTrailId: string): Promise<IFoodTrail | null> {
    return FoodTrail.findByIdAndDelete(foodTrailId).exec();
  }
}

export default FoodTrailService;
