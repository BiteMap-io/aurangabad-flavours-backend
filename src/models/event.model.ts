import mongoose, { Document, Schema } from 'mongoose';

/**
 * @author Denizuh
 * @description Mongoose model for Events
 * @date 2026-01-28
 */

export interface IEvent extends Document {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  image: string;
  organizer: string;
  price: string;
  capacity: number;

  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    organizer: { type: String, required: true }, // Ideally ref to User, but keeping simple string as per plan/other models for now
    price: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
