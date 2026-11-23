import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

import type { SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';

import type { UploadItem } from './manifest.js';

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
};

const THUMB_WIDTH = 480;

/** Crea el bucket público si no existe. */
export async function ensureBucket(supabase: SupabaseClient, bucket: string) {
  const { data } = await supabase.storage.getBucket(bucket);
  if (data) return;

  const { error } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: '50MB',
    allowedMimeTypes: Object.values(MIME),
  });
  if (error) throw new Error(`No se pudo crear el bucket "${bucket}": ${error.message}`);
  console.log(`🪣  Bucket "${bucket}" creado (público)`);
}

async function upload(supabase: SupabaseClient, bucket: string, path: string, body: Buffer, contentType: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, { contentType, upsert: true, cacheControl: '3600' });
  if (error) throw new Error(`Error subiendo ${path}: ${error.message}`);
}

/** Sube todos los archivos (y miniaturas) con concurrencia limitada. */
export async function uploadMedia(supabase: SupabaseClient, bucket: string, items: UploadItem[], concurrency = 4) {
  let done = 0;
  const queue = [...items];

  async function worker() {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const body = await readFile(item.localPath);
      const type = MIME[extname(item.localPath).toLowerCase()] ?? 'application/octet-stream';
      await upload(supabase, bucket, item.storagePath, body, type);

      if (item.thumbnailPath) {
        const thumb = await sharp(body).resize({ width: THUMB_WIDTH }).jpeg({ quality: 75, mozjpeg: true }).toBuffer();
        await upload(supabase, bucket, item.thumbnailPath, thumb, 'image/jpeg');
      }

      done += 1;
      process.stdout.write(`\r📤 Subiendo archivos: ${done}/${items.length}`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write('\n');
}
