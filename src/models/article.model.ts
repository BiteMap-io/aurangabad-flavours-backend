import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
/**
 * @author Denizuh
 * @description Mongoose model for Articles
 * @date 2026-01-26
 *
 * @notes
 * - This model defines the structure of article documents in the MongoDB database.
 * - It includes fields for article details, content, and metadata.
 */

export interface IArticle extends Document {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: IUser;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedDate: Date;
  readTime: string;
  featured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedDate: { type: Date, required: true },
    readTime: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IArticle>('Article', ArticleSchema);
