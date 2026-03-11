import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMedia>('Media', MediaSchema);
