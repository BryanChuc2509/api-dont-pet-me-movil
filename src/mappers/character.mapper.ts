import { toMedia, toOptionalMedia } from '../lib/storage.js';
import type { CharacterPoseRow, CharacterRow, CharacterStatRow } from '../types/db.js';
import type { CharacterDto, CharacterSummaryDto } from '../types/dto.js';

const bySortOrder = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order;

export function toCharacterSummary(row: CharacterRow): CharacterSummaryDto {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    role: row.role,
    tagline: row.tagline,
    image: toMedia(row.image),
    accent: row.accent,
  };
}

export function toCharacter(
  row: CharacterRow,
  stats: CharacterStatRow[],
  poses: CharacterPoseRow[],
): CharacterDto {
  return {
    ...toCharacterSummary(row),
    description: row.description,
    video: toOptionalMedia(row.video),
    levelId: row.level_id ?? undefined,
    facts: row.facts,
    stats: [...stats].sort(bySortOrder).map(({ label, value }) => ({ label, value })),
    poses: poses.length
      ? [...poses].sort(bySortOrder).map((p) => ({ id: p.id, title: p.title, image: toMedia(p.image) }))
      : undefined,
  };
}
