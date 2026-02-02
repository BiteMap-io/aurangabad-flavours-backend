import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './services/mongo.service';
import config from './config';

const port = config.port || 4000;

async function start() {
  await connectDB();
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port}`);
    });
  }
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

export default app;
