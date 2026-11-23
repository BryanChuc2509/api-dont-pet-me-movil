import type { SupabaseClient } from '@supabase/supabase-js';

import {
  appContent,
  characterPoses,
  characters,
  characterStats,
  gameplayControls,
  gameplaySections,
  levels,
} from './content.js';
import type { LevelMediaSeed } from './manifest.js';

async function upsert(supabase: SupabaseClient, table: string, rows: object | object[], onConflict = 'id') {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`Error insertando en "${table}": ${error.message}`);
  console.log(`   ✔ ${table} (${Array.isArray(rows) ? rows.length : 1})`);
}

/** Inserta o actualiza todo el contenido. Es idempotente: se puede ejecutar varias veces. */
export async function seedData(supabase: SupabaseClient, levelMedia: LevelMediaSeed[]) {
  console.log('🗄️  Cargando contenido en la base de datos');

  // levels <-> characters se referencian entre sí: primero niveles sin jefe,
  // luego personajes y por último el jefe de cada nivel.
  await upsert(supabase, 'levels', levels.map((l) => ({ ...l, boss_id: null })));
  await upsert(supabase, 'characters', characters);
  await upsert(supabase, 'levels', levels);

  await upsert(supabase, 'character_stats', characterStats, 'character_id,label');
  await upsert(supabase, 'character_poses', characterPoses);
  await upsert(
    supabase,
    'level_media',
    levelMedia.map((m) => ({
      id: m.id,
      level_id: m.levelId,
      title: m.title,
      image: m.image,
      thumbnail: m.thumbnail,
      in_gallery: m.inGallery,
      sort_order: m.sortOrder,
    })),
  );
  await upsert(supabase, 'gameplay_controls', gameplayControls);
  await upsert(supabase, 'gameplay_sections', gameplaySections);
  await upsert(supabase, 'app_content', appContent);
}
