/** Filas de las tablas de Supabase (snake_case, como en supabase/schema.sql). */
import type { CharacterRole } from './dto.js';

export interface LevelRow {
  id: string;
  sort_order: number;
  name: string;
  title: string;
  summary: string;
  description: string[];
  hazards: string[];
  island_image: string;
  cover_image: string;
  boss_id: string | null;
}

export interface CharacterRow {
  id: string;
  sort_order: number;
  name: string;
  species: string;
  role: CharacterRole;
  tagline: string;
  description: string;
  image: string;
  video: string | null;
  accent: string;
  level_id: string | null;
  facts: string[];
}

export interface CharacterStatRow {
  character_id: string;
  label: string;
  value: number;
  sort_order: number;
}

export interface CharacterPoseRow {
  id: string;
  character_id: string;
  title: string;
  image: string;
  sort_order: number;
}

export interface LevelMediaRow {
  id: string;
  level_id: string;
  title: string;
  image: string;
  thumbnail: string | null;
  in_gallery: boolean;
  sort_order: number;
}

export interface GameplayControlRow {
  id: string;
  title: string;
  description: string;
  illustration_id: string;
  key_id: string;
  sort_order: number;
}

export interface GameplaySectionRow {
  id: string;
  title: string;
  paragraphs: string[];
  bullets_title: string | null;
  bullets: string[] | null;
  sort_order: number;
}

export interface AppContentRow {
  id: number;
  featured_character_id: string;
  hero_image: string;
  hero_description: string;
  chapter_label: string;
  chapter_title: string;
  chapter_current: number;
  chapter_total: number;
  chapter_image: string;
  gameplay_preview_video: string | null;
}
