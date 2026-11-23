import { unwrap, unwrapOne } from '../lib/query.js';
import { supabase } from '../lib/supabase.js';
import { toGameplayGuide, toHomeContent } from '../mappers/content.mapper.js';
import type { AppContentRow, GameplayControlRow, GameplaySectionRow } from '../types/db.js';
import type { GameplayGuideDto, HomeContentDto } from '../types/dto.js';
import { charactersService } from './characters.service.js';

async function getAppContent(): Promise<AppContentRow> {
  return unwrapOne<AppContentRow>(
    await supabase.from('app_content').select('*').eq('id', 1).maybeSingle(),
    'Contenido',
    'app_content',
  );
}

export const contentService = {
  async getHome(): Promise<HomeContentDto> {
    const content = await getAppContent();
    const featured = await charactersService.getRow(content.featured_character_id);
    return toHomeContent(content, featured);
  },

  async getGameplay(): Promise<GameplayGuideDto> {
    const [controls, sections, content] = await Promise.all([
      supabase.from('gameplay_controls').select('*').order('sort_order'),
      supabase.from('gameplay_sections').select('*').order('sort_order'),
      supabase.from('app_content').select('gameplay_preview_video').eq('id', 1).maybeSingle(),
    ]);

    return toGameplayGuide(
      unwrap<GameplayControlRow[]>(controls, 'controles'),
      unwrap<GameplaySectionRow[]>(sections, 'secciones'),
      unwrap<Pick<AppContentRow, 'gameplay_preview_video'> | null>(content, 'contenido')?.gameplay_preview_video,
    );
  },
};
