import { toMedia, toOptionalMedia } from '../lib/storage.js';
import type { LevelMediaRow, LevelRow } from '../types/db.js';
import type { GalleryItemDto, LevelDto, LevelSummaryDto, MediaItemDto } from '../types/dto.js';

export function toLevelSummary(row: LevelRow): LevelSummaryDto {
  return {
    id: row.id,
    order: row.sort_order,
    name: row.name,
    title: row.title,
    summary: row.summary,
    islandImage: toMedia(row.island_image),
    coverImage: toMedia(row.cover_image),
  };
}

export function toMediaItem(row: LevelMediaRow): MediaItemDto {
  return {
    id: row.id,
    title: row.title,
    image: toMedia(row.image),
    thumbnail: toOptionalMedia(row.thumbnail),
  };
}

export function toLevel(row: LevelRow, media: LevelMediaRow[]): LevelDto {
  return {
    ...toLevelSummary(row),
    description: row.description,
    hazards: row.hazards,
    bossId: row.boss_id ?? undefined,
    gallery: [...media].sort((a, b) => a.sort_order - b.sort_order).map(toMediaItem),
  };
}

export function toGalleryItem(row: LevelMediaRow, levelName: string): GalleryItemDto {
  return { ...toMediaItem(row), levelId: row.level_id, levelName };
}
