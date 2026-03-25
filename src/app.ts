import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { localhostOnly } from './middleware/localhostOnly.middleware';
import config from './config';

const app = express();

console.log('🌍 Allowed CORS Origins:', config.corsOrigin.join(', '));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://static.cloudflareinsights.com'],
        connectSrc: ["'self'", 'https://static.cloudflareinsights.com', ...config.corsOrigin],
        imgSrc: ["'self'", 'data:', 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", 'https:', 'data:'],
        frameSrc: ["'none'"],
      },
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (config.corsOrigin.indexOf(origin) !== -1 || config.corsOrigin.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
