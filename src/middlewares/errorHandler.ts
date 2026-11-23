import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/** 404 para rutas que no existen. */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, 'NOT_FOUND', `Ruta ${req.method} ${req.originalUrl} no encontrada`));
};

/**
 * Formato único de error: { error: { code, message, details? } }.
 * Express 5 envía aquí también los errores lanzados en controladores async.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const error =
    err instanceof ApiError
      ? err
      : err instanceof ZodError
        ? ApiError.badRequest('Parámetros inválidos', err.issues)
        : new ApiError(500, 'INTERNAL_ERROR', 'Error interno del servidor');

  if (error.status >= 500) console.error(err);

  // Los errores nunca se cachean (el middleware de caché ya pudo poner la cabecera).
  res.set('Cache-Control', 'no-store');
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined && { details: error.details }),
      ...(!env.isProduction && error.status === 500 && err instanceof Error && { stack: err.stack }),
    },
  });
};
