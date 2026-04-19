import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description: string;
  url: string;
  type: string;
  size: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', GallerySchema);
