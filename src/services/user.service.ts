import User, { IUser } from '../models/user.model';

/**
 * @author Denizuh
 * @description Service for user-related operations
 * @date 2026-01-26
 *
 * @notes
 * - This service provides functions to interact with user data in the database.
 * - It includes methods for creating, retrieving, updating, and deleting users.
 */
class UserService {
  /**
   * Create a new user
   * @param userData - Data for the new user
   * @returns The created user document
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new User(userData);
    return newUser.save();
  }

  /**
   * Get a user by ID
   * @param userId - The ID of the user to retrieve
   * @returns The user document or null if not found
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  /**
   * Get a user by email
   * @param email - The email of the user to retrieve
   * @returns The user document or null if not found
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  /**
   * Update a user by ID
   * @param userId - The ID of the user to update
   * @param updateData - Data to update the user with
   * @returns The updated user document or null if not found
   */
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  /**
   * Delete a user by ID
   * @param userId - The ID of the user to delete
   * @returns The deleted user document or null if not found
   */
  async deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId).exec();
  }
}

export default UserService;
