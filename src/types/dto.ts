/**
 * Contrato JSON de la API. Coincide 1:1 con `app-movil/src/types`,
 * así la app consume las respuestas sin transformarlas.
 */

export type MediaSource = { uri: string };

export interface MediaItemDto {
  id: string;
  title: string;
  image: MediaSource;
  thumbnail?: MediaSource;
}

export type CharacterRole = 'protagonista' | 'humano' | 'enemigo' | 'jefe';

export interface CharacterSummaryDto {
  id: string;
  name: string;
  species: string;
  role: CharacterRole;
  tagline: string;
  image: MediaSource;
  accent: string;
}

export interface CharacterDto extends CharacterSummaryDto {
  description: string;
  video?: MediaSource;
  levelId?: string;
  stats: { label: string; value: number }[];
  facts: string[];
  poses?: MediaItemDto[];
}

export interface LevelSummaryDto {
  id: string;
  order: number;
  name: string;
  title: string;
  summary: string;
  islandImage: MediaSource;
  coverImage: MediaSource;
}

export interface LevelDto extends LevelSummaryDto {
  description: string[];
  hazards: string[];
  bossId?: string;
  gallery: MediaItemDto[];
}

export interface GalleryItemDto extends MediaItemDto {
  levelId: string;
  levelName: string;
}

export interface GameplayGuideDto {
  controls: {
    id: string;
    title: string;
    description: string;
    illustrationId: string;
    keyId: string;
  }[];
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    bulletsTitle?: string;
    bullets?: string[];
  }[];
  previewVideo?: MediaSource;
}

export interface HomeContentDto {
  hero: CharacterSummaryDto & { heroImage: MediaSource; description: string };
  chapter: {
    label: string;
    title: string;
    current: number;
    total: number;
    image: MediaSource;
  };
}
