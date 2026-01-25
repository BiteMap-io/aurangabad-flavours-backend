import mongoose, { Document } from 'mongoose';

/**
 * @author Denizuh
 * @description User model for admin and restaurent
 * @date 2026-01-26
 *
 * @notes
 * - This model defines the structure of user documents in the MongoDB database.
 * - It includes fields for user details, authentication, and metadata.
 */

enum UserType {
  ADMIN = 'admin',
  RESTAURANT_OWNER = 'restaurant_owner',
  CUSTOMER = 'customer',
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;

  password: string;
  userType: UserType;

  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    userType: {
      type: String,
      enum: Object.values(UserType),
      required: true,
      default: UserType.CUSTOMER,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
