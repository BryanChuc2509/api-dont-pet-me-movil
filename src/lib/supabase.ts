import { createClient } from '@supabase/supabase-js';

import { env } from '../config/env.js';

/**
 * Cliente de Supabase del servidor (clave secreta).
 * Salta las políticas RLS, por eso NUNCA debe exponerse fuera de la API.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
