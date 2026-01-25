import mongoose, { Document } from 'mongoose';
import { IDish } from './dish.model';
/**
 * @author Denizuh
 * @description Mongoose model for Restaurants
 * @date 2026-01-26
 *
 * @notes
 * - This model defines the structure of restaurant documents in the MongoDB database.
 * - It includes fields for restaurant details, location, and metadata.
 */

export interface IRestaurant extends Document {
  id: string;
  name: string;
  estabilishmentType: string;
  priceRange: string;
  rating: number;
  image: string;
  gallery: string[];
  description: string;
  location: { type: string; coordinates: number[] };
  verified: boolean;

  views: [{ date: Date; count: number }];

  ihmRecommended: boolean;
  area: string;
  dishes: IDish[];
  menu: string[];
  reviews: string[];

  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    estabilishmentType: { type: String, required: true },
    priceRange: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    description: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    verified: { type: Boolean, default: false },

    ihmRecommended: { type: Boolean, default: false },
    area: { type: String, required: true },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
    menu: { type: [String], default: [] },
    reviews: { type: [String], default: [] },
  },
  { timestamps: true }
);

RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
