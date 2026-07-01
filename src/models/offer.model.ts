import mongoose, { Document, Schema } from 'mongoose';

/**
 * @description Mongoose model for restaurant-owner-created Offers.
 * An offer is a discount that applies within a date/time window once a minimum
 * bill amount is reached, with optional higher discounts at higher spend tiers
 * (e.g. spend ₹1000 -> 10% off, spend ₹2000 -> 20% off), and can be scoped to
 * students only.
 */

export interface IOfferTier {
  minSpend: number;
  discountPercent: number;
}

export interface IOffer extends Document {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime?: string; // "HH:mm", optional — omitted means all-day
  endTime?: string;
  tiers: IOfferTier[];
  audience: 'all' | 'student';
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    restaurantId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    tiers: {
      type: [
        {
          minSpend: { type: Number, required: true },
          discountPercent: { type: Number, required: true },
        },
      ],
      default: [],
    },
    audience: { type: String, enum: ['all', 'student'], default: 'all' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOffer>('Offer', OfferSchema);
