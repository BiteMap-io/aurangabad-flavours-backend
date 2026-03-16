import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { localhostOnly } from './middleware/localhostOnly.middleware';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Accept', 'Origin'],
  })
);

app.use(express.json());

// Custom morgan tokens for deeper logging in development
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
  morgan.token('body', (req: any) => JSON.stringify(req.body));
  morgan.token('query', (req: any) => JSON.stringify(req.query));
  app.use(morgan('🚀 :method :url :status :response-time ms - 📦 body: :body - 🔍 query: :query'));
} else {
  app.use(morgan('combined'));
}

// Swagger documentation - Localhost only
app.use('/api-docs', localhostOnly, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
