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

app.use(helmet());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, Accept, Origin'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Swagger documentation - Localhost only
app.use('/api-docs', localhostOnly, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
