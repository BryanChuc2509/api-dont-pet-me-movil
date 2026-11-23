import { env } from '../config/env.js';
import type { MediaSource } from '../types/dto.js';
import { supabase } from './supabase.js';

/** Convierte una ruta del bucket ("characters/mochi.webp") en { uri } público para la app. */
export function toMedia(path: string): MediaSource {
  // Si ya es una URL completa (contenido externo), se respeta tal cual.
  if (/^https?:\/\//i.test(path)) return { uri: path };
  const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);
  return { uri: data.publicUrl };
}

export function toOptionalMedia(path: string | null | undefined): MediaSource | undefined {
  return path ? toMedia(path) : undefined;
}
