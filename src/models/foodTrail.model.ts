import mongoose, { Document, Schema } from 'mongoose';

/**
 * @author Denizuh
 * @description Mongoose model for food trails
 * @date 2026-01-26
 *
 * @notes
 * - This model defines the structure of food trail documents in the MongoDB database.
 * - It includes fields for food trail details, locations, and metadata.
 */

export interface IFoodTrail extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  estimatedTime: string;
  restaurantsId: string[];
  highlights: string[];

  createdAt: Date;
  updatedAt: Date;
}

const FoodTrailSchema = new Schema<IFoodTrail>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    restaurantsId: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IFoodTrail>('FoodTrail', FoodTrailSchema);
