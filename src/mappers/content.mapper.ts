import { toMedia, toOptionalMedia } from '../lib/storage.js';
import type { AppContentRow, CharacterRow, GameplayControlRow, GameplaySectionRow } from '../types/db.js';
import type { GameplayGuideDto, HomeContentDto } from '../types/dto.js';
import { toCharacterSummary } from './character.mapper.js';

export function toHomeContent(content: AppContentRow, featured: CharacterRow): HomeContentDto {
  return {
    hero: {
      ...toCharacterSummary(featured),
      heroImage: toMedia(content.hero_image),
      description: content.hero_description,
    },
    chapter: {
      label: content.chapter_label,
      title: content.chapter_title,
      current: content.chapter_current,
      total: content.chapter_total,
      image: toMedia(content.chapter_image),
    },
  };
}

export function toGameplayGuide(
  controls: GameplayControlRow[],
  sections: GameplaySectionRow[],
  previewVideo: string | null | undefined,
): GameplayGuideDto {
  return {
    controls: controls.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      illustrationId: c.illustration_id,
      keyId: c.key_id,
    })),
    sections: sections.map((s) => ({
      id: s.id,
      title: s.title,
      paragraphs: s.paragraphs,
      bulletsTitle: s.bullets_title ?? undefined,
      bullets: s.bullets ?? undefined,
    })),
    previewVideo: toOptionalMedia(previewVideo),
  };
}
