import { unwrap, unwrapOne } from '../lib/query.js';
import { supabase } from '../lib/supabase.js';
import { toLevel, toLevelSummary } from '../mappers/level.mapper.js';
import type { LevelMediaRow, LevelRow } from '../types/db.js';
import type { LevelDto, LevelSummaryDto } from '../types/dto.js';

export const levelsService = {
  async list(): Promise<LevelSummaryDto[]> {
    const rows = unwrap<LevelRow[]>(await supabase.from('levels').select('*').order('sort_order'), 'niveles');
    return rows.map(toLevelSummary);
  },

  async getById(id: string): Promise<LevelDto> {
    const [level, media] = await Promise.all([
      supabase.from('levels').select('*').eq('id', id).maybeSingle(),
      supabase.from('level_media').select('*').eq('level_id', id),
    ]);

    return toLevel(unwrapOne<LevelRow>(level, 'Nivel', id), unwrap<LevelMediaRow[]>(media, 'imágenes del nivel'));
  },
};
