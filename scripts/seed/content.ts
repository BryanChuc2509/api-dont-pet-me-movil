/**
 * Contenido inicial de la base de datos (mismo texto que los mocks de la app).
 * Las imágenes son rutas dentro del bucket de Storage.
 */
import type {
  AppContentRow,
  CharacterPoseRow,
  CharacterRow,
  CharacterStatRow,
  GameplayControlRow,
  GameplaySectionRow,
  LevelRow,
} from '../../src/types/db.js';

type CharacterSeed = Omit<CharacterRow, 'sort_order'> & {
  stats: [label: string, value: number][];
  poses?: [id: string, title: string, image: string][];
};

const characterSeeds: CharacterSeed[] = [
  {
    id: 'mochi',
    name: 'MOCHI',
    species: 'Hámster dorado',
    role: 'protagonista',
    tagline: 'Pequeño hámster. Grandes problemas.',
    description:
      'Capturado durante un picnic familiar, Mochi solo quiere volver al bosque con sus hermanos. Es rápido, terco y odia que lo acaricien.',
    image: 'characters/mochi.webp',
    video: 'videos/characters/mochi-360.mp4',
    accent: '#F2D2B6',
    level_id: null,
    facts: [
      'Cualquier golpe lo deja fuera: caídas, aplastamientos o tocar algo letal.',
      'Las semillas le marcan el camino a seguir.',
      'Vuelve al último punto de control al perder una vida.',
    ],
    stats: [['Velocidad', 82], ['Salto', 74], ['Resistencia', 18], ['Astucia', 90]],
    poses: [
      ['mochi-festejo', 'Festejo', 'characters/mochi-festejo.webp'],
      ['mochi-salto', 'Salto', 'characters/mochi-salto.webp'],
      ['mochi-sixseven', 'Six Seven', 'characters/mochi-sixseven.webp'],
    ],
  },
  {
    id: 'reo',
    name: 'REO',
    species: 'Humano',
    role: 'humano',
    tagline: 'El dueño que no sabe cuándo parar.',
    description:
      'Reo encontró a Mochi en el picnic y se lo llevó a casa. Lo quiere muchísimo, y justo por eso no deja de intentar acariciarlo.',
    image: 'characters/reo.webp',
    video: null,
    accent: '#F4C9BE',
    level_id: null,
    facts: ['Deja juguetes por todas partes: obstáculos perfectos.', 'Su habitación es el segundo mundo del juego.'],
    stats: [['Energía', 95], ['Paciencia', 12], ['Cariño', 100], ['Orden', 8]],
  },
  {
    id: 'asper',
    name: 'ASPER',
    species: 'Robot aspiradora',
    role: 'jefe',
    tagline: 'Todo lo que toca, desaparece.',
    description:
      'La aspiradora robot patrulla el pasillo sin descanso. Sigue rutas que parecen predecibles... hasta que deja de hacerlo.',
    image: 'characters/aspiradora.webp',
    video: 'videos/characters/aspiradora-360.mp4',
    accent: '#D9D4D2',
    level_id: 'pasillo',
    facts: ['Guardiana del pasillo.', 'Cambia de ruta cuando escucha a Mochi.'],
    stats: [['Velocidad', 60], ['Alcance', 85], ['Ruido', 100], ['Piedad', 0]],
  },
  {
    id: 'ciemp',
    name: 'CIEMP',
    species: 'Ciempiés espinoso',
    role: 'jefe',
    tagline: 'Cien patas, cero amigos.',
    description:
      'Vive en el fondo de la jaula y no comparte su territorio. Sus espinas convierten cada pasillo estrecho en una trampa.',
    image: 'characters/ciempies.webp',
    video: 'videos/characters/ciempies-360.mp4',
    accent: '#F3DFA2',
    level_id: 'jaula',
    facts: ['Primer gran obstáculo del juego.', 'Tocar sus espinas es perder una vida.'],
    stats: [['Velocidad', 55], ['Defensa', 90], ['Agresividad', 70], ['Sigilo', 40]],
  },
  {
    id: 'spidy',
    name: 'SPIDY',
    species: 'Tarántula',
    role: 'jefe',
    tagline: 'Teje la trampa y espera.',
    description:
      'Se esconde entre los libros y muebles de la habitación. Cuando Mochi se confía, baja desde el techo sin avisar.',
    image: 'characters/arania.webp',
    video: 'videos/characters/arania-360.mp4',
    accent: '#D7CCE6',
    level_id: 'habitacion',
    facts: ['Guardiana de la habitación del caos.', 'Sus telarañas frenan a Mochi.'],
    stats: [['Velocidad', 70], ['Sigilo', 95], ['Paciencia', 88], ['Fuerza', 50]],
  },
  {
    id: 'poison',
    name: 'POISON',
    species: 'Hormiga venenosa',
    role: 'enemigo',
    tagline: 'Pequeña, verde y letal.',
    description:
      'Una hormiga con mala actitud y peor picadura. Aparece donde menos la esperas y no perdona errores.',
    image: 'characters/hormiga-venenosa.webp',
    video: 'videos/characters/hormiga-venenosa-360.mp4',
    accent: '#CFE3B8',
    level_id: null,
    facts: ['Un solo contacto es letal.'],
    stats: [['Velocidad', 78], ['Veneno', 100], ['Tamaño', 10], ['Sigilo', 65]],
  },
  {
    id: 'ant',
    name: 'ANT',
    species: 'Hormiga obrera',
    role: 'enemigo',
    tagline: 'Siempre en fila, siempre en tu camino.',
    description:
      'Las obreras recorren el escenario en columnas. Solas no son gran cosa, pero juntas bloquean cualquier ruta.',
    image: 'characters/hormiga.webp',
    video: 'videos/characters/hormiga-360.mp4',
    accent: '#F1D3C4',
    level_id: null,
    facts: ['Marchan en grupos.', 'Siguen rastros de migas.'],
    stats: [['Velocidad', 50], ['Número', 100], ['Fuerza', 35], ['Orden', 90]],
  },
  {
    id: 'reina',
    name: 'REINA',
    species: 'Hormiga reina',
    role: 'jefe',
    tagline: 'La colonia obedece.',
    description:
      'Desde su trono dirige a todas las hormigas de la casa. Si Mochi quiere salir, tarde o temprano tendrá que enfrentarla.',
    image: 'characters/hormiga-reina.webp',
    video: 'videos/characters/hormiga-reina-360.mp4',
    accent: '#F2C6A8',
    level_id: null,
    facts: ['Controla a las obreras y a Poison.'],
    stats: [['Mando', 100], ['Defensa', 80], ['Velocidad', 30], ['Ego', 95]],
  },
];

export const characters: CharacterRow[] = characterSeeds.map(({ stats: _s, poses: _p, ...row }, i) => ({
  ...row,
  sort_order: i,
}));

export const characterStats: Omit<CharacterStatRow, never>[] = characterSeeds.flatMap((c) =>
  c.stats.map(([label, value], i) => ({ character_id: c.id, label, value, sort_order: i })),
);

export const characterPoses: CharacterPoseRow[] = characterSeeds.flatMap((c) =>
  (c.poses ?? []).map(([id, title, image], i) => ({ id, character_id: c.id, title, image, sort_order: i })),
);

export const levels: LevelRow[] = [
  {
    id: 'jaula',
    sort_order: 0,
    name: 'Jaula',
    title: 'La jaula del comienzo',
    summary: 'Escapa de la jaula y aprende a moverte entre rampas, tubos y ventiladores.',
    description: [
      'Todo empieza aquí. Mochi despierta encerrado en una jaula llena de rampas, tubos y un ventilador que no deja de girar.',
      'Es el capítulo tutorial: aprenderás a moverte, saltar y presionar botones para abrir caminos. Pero cuidado, ni el agua ni el yunque perdonan.',
    ],
    hazards: ['Charcos con electricidad', 'Yunque que aplasta', 'Aspas del ventilador'],
    island_image: 'islands/jaula.webp',
    cover_image: 'levels/jaula/vista-general-1.jpg',
    boss_id: 'ciemp',
  },
  {
    id: 'habitacion',
    sort_order: 1,
    name: 'Habitación',
    title: 'La habitación del caos',
    summary: 'Libros que caen, café que quema y una araña que acecha desde arriba.',
    description: [
      'La habitación de Reo es un desastre: libros apilados, tazas de café y juguetes por todas partes. Para Mochi es una montaña imposible.',
      'Las semillas indican el camino, pero no todo es lo que parece. Algunas plataformas caen al pisarlas y los libros se desploman en el peor momento.',
    ],
    hazards: ['Café que quema', 'Libros que caen', 'Plataformas falsas'],
    island_image: 'islands/habitacion.webp',
    cover_image: 'levels/habitacion/vista-general-1.jpg',
    boss_id: 'spidy',
  },
  {
    id: 'pasillo',
    sort_order: 2,
    name: 'Pasillo',
    title: 'El pasillo sin fin',
    summary: 'Cruza el pasillo hasta la gatera sin que la aspiradora te atrape.',
    description: [
      'El último tramo antes de la libertad. Un pasillo larguísimo lleno de cajas, muebles y una gatera que lleva directo al jardín.',
      'Asper, la aspiradora robot, patrulla el suelo. Muévete por las alturas y elige bien cuándo bajar.',
    ],
    hazards: ['Aspiradora en patrulla', 'Caídas largas', 'La gatera'],
    island_image: 'islands/pasillo.webp',
    cover_image: 'levels/pasillo/vista-general-1.jpg',
    boss_id: 'asper',
  },
];

export const gameplayControls: GameplayControlRow[] = [
  { id: 'move', title: 'Movimiento', description: 'Usa W, A, S y D para moverte', illustration_id: 'mochi-movement', key_id: 'key-wasd', sort_order: 0 },
  { id: 'jump', title: 'Salto', description: 'Presiona Espacio para saltar', illustration_id: 'mochi-jumping', key_id: 'key-space', sort_order: 1 },
  { id: 'run', title: 'Correr', description: 'Mantén Shift para correr', illustration_id: 'mochi-running', key_id: 'key-shift', sort_order: 2 },
];

export const gameplaySections: GameplaySectionRow[] = [
  {
    id: 'unexpected',
    title: 'Lo inesperado',
    paragraphs: [
      'A lo largo de los niveles aparecen eventos aleatorios que intentan impedir que el jugador avance. Algunos no ocurren siempre en el mismo lugar ni de la misma forma, así que nadie puede confiarse del todo, aunque ya conozca el nivel.',
    ],
    bullets_title: 'Ejemplos:',
    bullets: [
      'Una plataforma que parecía segura cae o desaparece al pisarla',
      'Un libro cae de un estante en el peor momento',
      'Un elemento aparece donde no había nada',
      'Un objeto inofensivo resulta ser una trampa',
    ],
    sort_order: 0,
  },
  {
    id: 'progression',
    title: 'Progresión',
    paragraphs: [
      'La progresión es lineal, y las semillas y la estructura del recorrido indican el camino. Como Mochi es pequeño y frágil, casi cualquier peligro lo mata al instante: caer al vacío, que lo aplaste un objeto o tocar elementos letales. Al perder una vida, el jugador vuelve al último punto de control, sin repetir todo el nivel.',
    ],
    bullets_title: null,
    bullets: null,
    sort_order: 1,
  },
];

export const appContent: AppContentRow = {
  id: 1,
  featured_character_id: 'mochi',
  hero_image: 'characters/mochi-hero.webp',
  hero_description: 'Capturado durante un picnic familiar, Mochi solo quiere volver al bosque con sus hermanos',
  chapter_label: 'Capítulo tutorial',
  chapter_title: 'El bosque',
  chapter_current: 1,
  chapter_total: 3,
  chapter_image: 'levels/jaula/vista-general-1.jpg',
  gameplay_preview_video: 'videos/gameplay/hud-preview.mp4',
};
