import mongoose, { Document, Schema } from 'mongoose';

/**
 * @description Mongoose model for restaurant-owner-created Offers.
 * An offer applies within a date/time window and can be scoped to students only.
 * `offerType` picks which shape carries the actual deal:
 *  - 'percentage': `tiers` — spend ₹1000 -> 10% off, spend ₹2000 -> 20% off, etc.
 *  - 'flat':       `flatTiers` — spend ₹1000 -> ₹200 off, etc.
 *  - 'custom':     free-form — BOGO, a free side, a happy-hour window, anything
 *    that doesn't reduce to a spend/discount table. `highlightText` is the short
 *    badge shown on cards (e.g. "Buy 1 Get 1 Free"); `title`/`description` carry
 *    the rest.
 */

export interface IOfferTier {
  minSpend: number;
  discountPercent: number;
}

export interface IFlatTier {
  minSpend: number;
  amount: number;
}

export type OfferType = 'percentage' | 'flat' | 'custom';

export interface IOffer extends Document {
  id: string;
  restaurantId: string;
  offerType: OfferType;
  title: string;
  description: string;
  highlightText?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string; // "HH:mm", optional — omitted means all-day
  endTime?: string;
  tiers: IOfferTier[];
  flatTiers: IFlatTier[];
  audience: 'all' | 'student';
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    restaurantId: { type: String, required: true },
    offerType: { type: String, enum: ['percentage', 'flat', 'custom'], default: 'percentage' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    highlightText: { type: String },
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
    flatTiers: {
      type: [
        {
          minSpend: { type: Number, required: true },
          amount: { type: Number, required: true },
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
