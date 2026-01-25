import mongoose from 'mongoose';
import config from '../config';

export async function connectDB() {
  const uri = config.mongodbUri;
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
}

export default mongoose;
