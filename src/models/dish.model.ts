import mongoose, { Document, Schema } from 'mongoose';

/**
 * @author Denizuh
 * @description Mongoose model for Dishes
 * @date 2026-01-26
 *
 * @notes
 * - This model defines the structure of dish documents in the MongoDB database.
 * - It includes fields for dish details, pricing, and metadata.
 */

export interface IDish extends Document {
  id: string;
  name: string;
  image: string;

  category: string;
  restaurantId: string;

  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },

    category: { type: String, required: true },
    restaurantId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDish>('Dish', DishSchema);
