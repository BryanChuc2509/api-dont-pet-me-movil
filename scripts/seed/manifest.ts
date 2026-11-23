import { existsSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

/**
 * Inventario de archivos a subir: relaciona cada archivo local de la app
 * con su ruta dentro del bucket de Storage.
 */

/** Carpeta nivel-N de la app → id del nivel en la base de datos */
export const LEVEL_FOLDERS: Record<string, string> = {
  'nivel-0': 'jaula',
  'nivel-1': 'habitacion',
  'nivel-2': 'pasillo',
};

/** Títulos legibles por zona (el orden define el orden en la galería) */
export const ZONE_TITLES: Record<string, Record<string, string>> = {
  jaula: {
    'vista-general': 'Vista general',
    'zona-a': 'Zona A',
    'zona-b': 'Zona B',
    'zona-c': 'Zona C',
    'zona-d': 'Zona D',
    'zona-ef': 'Zona E-F',
    'zona-g': 'Zona G',
    final: 'Final',
  },
  habitacion: {
    'vista-general': 'Vista general',
    'zona-ab': 'Zona A-B',
    'zona-c': 'Zona C',
    'zona-d': 'Zona D',
    'zona-e': 'Zona E',
    'zona-f': 'Zona F',
    'zona-g': 'Zona G',
    salida: 'Salida',
  },
  pasillo: {
    'vista-general': 'Vista general',
    'tramo-1': 'Tramo 1',
    'tramo-2-3': 'Tramos 2-3',
    'tramo-4': 'Tramo 4',
    'tramo-5': 'Tramo 5',
    'tramo-6': 'Tramo 6',
  },
};

export interface UploadItem {
  localPath: string;
  storagePath: string;
  /** Generar miniatura (solo capturas de niveles) */
  thumbnailPath?: string;
}

export interface LevelMediaSeed {
  id: string;
  levelId: string;
  title: string;
  image: string;
  thumbnail: string;
  inGallery: boolean;
  sortOrder: number;
}

const list = (dir: string, ext: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => extname(f).toLowerCase() === ext).sort() : [];

export function buildManifest(sourceDir: string) {
  const root = resolve(sourceDir);
  if (!existsSync(root)) throw new Error(`No existe la carpeta de assets: ${root} (revisa MEDIA_SOURCE_DIR)`);

  const uploads: UploadItem[] = [];
  const levelMedia: LevelMediaSeed[] = [];
  const add = (dir: string, ext: string, prefix: string) =>
    list(join(root, dir), ext).forEach((f) => uploads.push({ localPath: join(root, dir, f), storagePath: `${prefix}/${f}` }));

  add('images/characters', '.webp', 'characters');
  add('images/levels/islands', '.webp', 'islands');
  // terreno.webp es un recurso de diseño que la app no muestra
  const terreno = uploads.findIndex((u) => u.storagePath === 'islands/terreno.webp');
  if (terreno >= 0) uploads.splice(terreno, 1);
  add('videos/gameplay', '.mp4', 'videos/gameplay');
  list(join(root, 'videos/characters'), '.mp4')
    .filter((f) => f.endsWith('-360.mp4'))
    .forEach((f) => uploads.push({ localPath: join(root, 'videos/characters', f), storagePath: `videos/characters/${f}` }));

  for (const [folder, levelId] of Object.entries(LEVEL_FOLDERS)) {
    const titles = ZONE_TITLES[levelId] ?? {};
    const order = Object.keys(titles);

    for (const file of list(join(root, 'images/levels', folder), '.jpg')) {
      const name = basename(file, '.jpg'); // p. ej. "zona-a-1"
      const zone = name.replace(/-\d+$/, '');
      const variant = Number(name.match(/-(\d+)$/)?.[1] ?? 1);
      const image = `levels/${levelId}/${file}`;
      const thumbnail = `levels/${levelId}/thumbs/${file}`;

      uploads.push({ localPath: join(root, 'images/levels', folder, file), storagePath: image, thumbnailPath: thumbnail });
      levelMedia.push({
        id: `${levelId}-${name}`,
        levelId,
        title: titles[zone] ?? zone,
        image,
        thumbnail,
        inGallery: variant === 1, // la variante 2 solo aparece en el detalle del nivel
        sortOrder: Math.max(order.indexOf(zone), 0) * 10 + variant,
      });
    }
  }

  return { uploads, levelMedia };
}
