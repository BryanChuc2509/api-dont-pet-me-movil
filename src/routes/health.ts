import { Router } from 'express';

import { supabase } from '../lib/supabase.js';

/** GET /health: estado de la API y de la conexión con Supabase. */
export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const started = Date.now();
  const { error } = await supabase.from('levels').select('id', { count: 'exact', head: true });
  const database = error ? 'error' : 'ok';

  res.status(error ? 503 : 200).json({
    status: error ? 'degraded' : 'ok',
    database,
    latencyMs: Date.now() - started,
    uptimeSeconds: Math.round(process.uptime()),
    ...(error && { message: error.message }),
  });
});
