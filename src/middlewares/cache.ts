import type { RequestHandler } from 'express';

import { env } from '../config/env.js';

/**
 * Cache-Control para respuestas GET. El contenido del juego cambia poco,
 * así que la app y los proxies pueden reutilizar respuestas unos segundos.
 * Express añade ETag automáticamente, lo que permite respuestas 304.
 */
export const cacheControl: RequestHandler = (req, res, next) => {
  if (req.method === 'GET' && env.CACHE_MAX_AGE > 0) {
    res.set('Cache-Control', `public, max-age=${env.CACHE_MAX_AGE}, stale-while-revalidate=${env.CACHE_MAX_AGE * 5}`);
  }
  next();
};
