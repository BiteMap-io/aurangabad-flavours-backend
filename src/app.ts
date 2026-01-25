import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/v1', routes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
