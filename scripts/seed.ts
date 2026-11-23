/**
 * Carga inicial de Supabase:
 *   npm run seed          → sube archivos a Storage + inserta el contenido
 *   npm run seed:media    → solo archivos
 *   npm run seed:data     → solo base de datos
 *
 * Requiere haber ejecutado antes supabase/schema.sql en el proyecto.
 */
import { env } from '../src/config/env.js';
import { supabase } from '../src/lib/supabase.js';
import { seedData } from './seed/data.js';
import { buildManifest } from './seed/manifest.js';
import { ensureBucket, uploadMedia } from './seed/media.js';

const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const runMedia = !only || only === 'media';
const runData = !only || only === 'data';

async function main() {
  console.log(`\n🐹 Seed de Don't Pet Me → ${env.SUPABASE_URL}\n`);
  const { uploads, levelMedia } = buildManifest(env.MEDIA_SOURCE_DIR);

  if (runMedia) {
    await ensureBucket(supabase, env.SUPABASE_BUCKET);
    await uploadMedia(supabase, env.SUPABASE_BUCKET, uploads);
  }
  if (runData) await seedData(supabase, levelMedia);

  console.log('\n✅ Listo\n');
}

main().catch((err: unknown) => {
  console.error(`\n❌ ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
