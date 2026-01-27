import Restaurant, { IRestaurant } from '../models/restaurant.model';

/**
 * @author Denizuh
 * @description Service for restaurant-related operations
 * @date 2026-01-27
 *
 * @notes
 * - This service provides functions to interact with restaurant data in the database.
 * - It includes methods for creating, retrieving, updating, and deleting restaurants.
 */
class RestaurantService {
  /**
   * Create a new restaurant
   * @param restaurantData - Data for the new restaurant
   * @returns The created restaurant document
   */
  async createRestaurant(restaurantData: Partial<IRestaurant>): Promise<IRestaurant> {
    const newRestaurant = new Restaurant(restaurantData);
    return newRestaurant.save();
  }

  /**
   * Get a restaurant by ID
   * @param restaurantId - The ID of the restaurant to retrieve
   * @returns The restaurant document or null if not found
   */
  async getRestaurantById(restaurantId: string): Promise<IRestaurant | null> {
    return Restaurant.findById(restaurantId).populate('dishes').exec();
  }

  /**
   * Get all restaurants
   * @returns List of all restaurants
   */
  async getAllRestaurants(): Promise<IRestaurant[]> {
    return Restaurant.find().populate('dishes').exec();
  }

  /**
   * Update a restaurant by ID
   * @param restaurantId - The ID of the restaurant to update
   * @param updateData - Data to update the restaurant with
   * @returns The updated restaurant document or null if not found
   */
  async updateRestaurant(restaurantId: string, updateData: Partial<IRestaurant>): Promise<IRestaurant | null> {
    return Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true }).exec();
  }

  /**
   * Delete a restaurant by ID
   * @param restaurantId - The ID of the restaurant to delete
   * @returns The deleted restaurant document or null if not found
   */
  async deleteRestaurant(restaurantId: string): Promise<IRestaurant | null> {
    return Restaurant.findByIdAndDelete(restaurantId).exec();
  }
}

export default RestaurantService;
