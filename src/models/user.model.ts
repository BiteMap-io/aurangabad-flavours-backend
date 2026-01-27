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

import bcrypt from 'bcrypt';

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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;

  password: string;
  userType: UserType;
  comparePassword(password: string): Promise<boolean>;

  createdAt: Date;
  updatedAt: Date;
}

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
