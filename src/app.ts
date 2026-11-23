import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { apiRouter } from './routes/index.js';

/** Construye la app de Express (separada de server.ts para poder testearla). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('etag', 'strong');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.corsOrigins.includes('*') ? true : env.corsOrigins,
      methods: ['GET', 'HEAD', 'OPTIONS'],
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  app.get('/', (_req, res) => {
    res.json({ name: "Don't Pet Me API", version: 'v1', docs: '/api/v1', health: '/health' });
  });
  app.use('/health', healthRouter);
  app.use('/api/v1', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
