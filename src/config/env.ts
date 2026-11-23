import 'dotenv/config';

import { z } from 'zod';

/** Variables de entorno validadas al arrancar: si falta algo, la API no inicia. */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  SUPABASE_URL: z.url({ message: 'SUPABASE_URL debe ser la URL del proyecto (https://<ref>.supabase.co)' }),
  SUPABASE_SECRET_KEY: z
    .string({ error: 'SUPABASE_SECRET_KEY es obligatoria (clave secreta del proyecto)' })
    .min(20, 'SUPABASE_SECRET_KEY parece incompleta'),
  SUPABASE_BUCKET: z.string().min(1).default('media'),
  CORS_ORIGINS: z.string().default('*'),
  CACHE_MAX_AGE: z.coerce.number().int().nonnegative().default(60),
  MEDIA_SOURCE_DIR: z.string().default('../app-movil/assets'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`\n❌ Configuración inválida. Revisa tu archivo .env:\n${details}\n`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
