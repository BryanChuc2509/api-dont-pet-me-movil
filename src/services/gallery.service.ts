import { unwrap } from '../lib/query.js';
import { supabase } from '../lib/supabase.js';
import { toGalleryItem } from '../mappers/level.mapper.js';
import type { LevelMediaRow, LevelRow } from '../types/db.js';
import type { GalleryItemDto } from '../types/dto.js';

type GalleryRow = LevelMediaRow & { levels: Pick<LevelRow, 'name' | 'sort_order'> | null };

export const galleryService = {
  /** Imágenes marcadas para la galería, ordenadas por nivel y por posición. */
  async list(levelId?: string): Promise<GalleryItemDto[]> {
    let query = supabase
      .from('level_media')
      .select('*, levels!inner(name, sort_order)')
      .eq('in_gallery', true);
    if (levelId) query = query.eq('level_id', levelId);

    const rows = unwrap<GalleryRow[]>(await query, 'galería');

    return rows
      .sort((a, b) => (a.levels?.sort_order ?? 0) - (b.levels?.sort_order ?? 0) || a.sort_order - b.sort_order)
      .map((row) => toGalleryItem(row, row.levels?.name ?? ''));
  },
};
