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
  establishmentType: string;
  cuisine: string;
  facilities: string[];
  priceRange: string;
  rating: number;
  image: string;
  gallery: string[];
  description: string;
  location: { type: string; coordinates: number[] };
  address: string;
  verified: boolean;
  foodType: string; // 'veg' | 'non-veg' | 'both'
  menuItems: { name: string; category: string; price: number; isVeg: boolean }[];
  seatingCapacity: number;
  extraFacilities: { ac: boolean; disabilityAccess: boolean; washroom: boolean; parking: boolean; parcel: boolean };
  food: { quality: number; hygiene: number; kitchenHygiene: number; menuVariety: number; valueForMoney: number; signatureDishes: string; specialtyDishes: string };
  staff: { friendliness: number; appearance: number; serviceType: string };
  environment: { outsideCleanliness: number; ambience: number; uniqueFeatures: string };
  avgPricePerPerson: number;
  sustainabilityPractices: string;

  views: [{ date: Date; count: number }];

  ihmRecommended: boolean;
  area: string;
  dishes: IDish[];
  menu: string[];
  reviews: { user: string; userName: string; rating: number; comment: string; createdAt: Date }[];

  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    establishmentType: { type: String, required: true },
    cuisine: { type: String, required: true },
    facilities: { type: [String], default: [] },
    priceRange: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    description: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    foodType: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'both' },
    menuItems: {
      type: [{
        name: { type: String, required: true },
        category: { type: String, default: '' },
        price: { type: Number, default: 0 },
        isVeg: { type: Boolean, default: true },
      }],
      default: [],
    },
    seatingCapacity: { type: Number, default: 0 },
    extraFacilities: {
      ac: { type: Boolean, default: false },
      disabilityAccess: { type: Boolean, default: false },
      washroom: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      parcel: { type: Boolean, default: false },
    },
    food: {
      quality: { type: Number, default: 0 },
      hygiene: { type: Number, default: 0 },
      kitchenHygiene: { type: Number, default: 0 },
      menuVariety: { type: Number, default: 0 },
      valueForMoney: { type: Number, default: 0 },
      signatureDishes: { type: String, default: '' },
      specialtyDishes: { type: String, default: '' },
    },
    staff: {
      friendliness: { type: Number, default: 0 },
      appearance: { type: Number, default: 0 },
      serviceType: { type: String, enum: ['dine-in', 'takeaway', 'both'], default: 'both' },
    },
    environment: {
      outsideCleanliness: { type: Number, default: 0 },
      ambience: { type: Number, default: 0 },
      uniqueFeatures: { type: String, default: '' },
    },
    avgPricePerPerson: { type: Number, default: 0 },
    sustainabilityPractices: { type: String, default: '' },
    views: [
      {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 0 },
      },
    ],
    ihmRecommended: { type: Boolean, default: false },
    area: { type: String, required: true },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
    menu: { type: [String], default: [] },
    reviews: {
      type: [{
        user: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      }],
      default: [],
    },
  },
  { timestamps: true }
);

RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
