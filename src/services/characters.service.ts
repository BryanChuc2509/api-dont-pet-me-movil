import { unwrap, unwrapOne } from '../lib/query.js';
import { supabase } from '../lib/supabase.js';
import { toCharacter, toCharacterSummary } from '../mappers/character.mapper.js';
import type { CharacterPoseRow, CharacterRow, CharacterStatRow } from '../types/db.js';
import type { CharacterDto, CharacterSummaryDto } from '../types/dto.js';

export const charactersService = {
  async list(): Promise<CharacterSummaryDto[]> {
    const rows = unwrap<CharacterRow[]>(
      await supabase.from('characters').select('*').order('sort_order'),
      'personajes',
    );
    return rows.map(toCharacterSummary);
  },

  async getById(id: string): Promise<CharacterDto> {
    const [character, stats, poses] = await Promise.all([
      supabase.from('characters').select('*').eq('id', id).maybeSingle(),
      supabase.from('character_stats').select('*').eq('character_id', id),
      supabase.from('character_poses').select('*').eq('character_id', id),
    ]);

    return toCharacter(
      unwrapOne<CharacterRow>(character, 'Personaje', id),
      unwrap<CharacterStatRow[]>(stats, 'estadísticas'),
      unwrap<CharacterPoseRow[]>(poses, 'poses'),
    );
  },

  /** Fila cruda (la usa el servicio de inicio). */
  async getRow(id: string): Promise<CharacterRow> {
    return unwrapOne<CharacterRow>(
      await supabase.from('characters').select('*').eq('id', id).maybeSingle(),
      'Personaje',
      id,
    );
  },
};
