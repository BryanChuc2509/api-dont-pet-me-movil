-- =====================================================================
-- Don't Pet Me — esquema de base de datos (Supabase / PostgreSQL)
-- Ejecútalo una vez en Supabase > SQL Editor (o con `supabase db push`).
-- Es idempotente: puedes volver a ejecutarlo sin perder datos.
--
-- Las columnas de imagen/video guardan la RUTA dentro del bucket de Storage
-- (p. ej. "characters/mochi.webp"); la API la convierte en URL pública.
-- =====================================================================

-- ---------- Niveles ----------
create table if not exists public.levels (
  id           text primary key,
  sort_order   integer not null,
  name         text not null,
  title        text not null,
  summary      text not null,
  description  text[] not null default '{}',
  hazards      text[] not null default '{}',
  island_image text not null,
  cover_image  text not null,
  boss_id      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Personajes ----------
create table if not exists public.characters (
  id          text primary key,
  sort_order  integer not null,
  name        text not null,
  species     text not null,
  role        text not null check (role in ('protagonista', 'humano', 'enemigo', 'jefe')),
  tagline     text not null,
  description text not null,
  image       text not null,
  video       text,
  accent      text not null check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  level_id    text references public.levels (id) on delete set null,
  facts       text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- El jefe de cada nivel es un personaje (FK añadida después por la referencia circular)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'levels_boss_id_fkey') then
    alter table public.levels
      add constraint levels_boss_id_fkey
      foreign key (boss_id) references public.characters (id) on delete set null;
  end if;
end $$;

create table if not exists public.character_stats (
  id           bigint generated always as identity primary key,
  character_id text not null references public.characters (id) on delete cascade,
  label        text not null,
  value        integer not null check (value between 0 and 100),
  sort_order   integer not null default 0,
  unique (character_id, label)
);

create table if not exists public.character_poses (
  id           text primary key,
  character_id text not null references public.characters (id) on delete cascade,
  title        text not null,
  image        text not null,
  sort_order   integer not null default 0
);

-- ---------- Imágenes de niveles (detalle + galería) ----------
create table if not exists public.level_media (
  id         text primary key,
  level_id   text not null references public.levels (id) on delete cascade,
  title      text not null,
  image      text not null,
  thumbnail  text,
  in_gallery boolean not null default true,
  sort_order integer not null default 0
);

-- ---------- Jugabilidad ----------
create table if not exists public.gameplay_controls (
  id              text primary key,
  title           text not null,
  description     text not null,
  illustration_id text not null,
  key_id          text not null,
  sort_order      integer not null default 0
);

create table if not exists public.gameplay_sections (
  id            text primary key,
  title         text not null,
  paragraphs    text[] not null default '{}',
  bullets_title text,
  bullets       text[],
  sort_order    integer not null default 0
);

-- ---------- Contenido general (una sola fila) ----------
create table if not exists public.app_content (
  id                     integer primary key default 1 check (id = 1),
  featured_character_id  text not null references public.characters (id),
  hero_image             text not null,
  hero_description       text not null,
  chapter_label          text not null,
  chapter_title          text not null,
  chapter_current        integer not null check (chapter_current >= 0),
  chapter_total          integer not null check (chapter_total > 0),
  chapter_image          text not null,
  gameplay_preview_video text,
  updated_at             timestamptz not null default now()
);

-- ---------- Índices ----------
create index if not exists levels_sort_idx            on public.levels (sort_order);
create index if not exists characters_sort_idx        on public.characters (sort_order);
create index if not exists character_stats_char_idx   on public.character_stats (character_id, sort_order);
create index if not exists character_poses_char_idx   on public.character_poses (character_id, sort_order);
create index if not exists level_media_level_idx      on public.level_media (level_id, sort_order);

-- ---------- updated_at automático ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists levels_touch on public.levels;
create trigger levels_touch before update on public.levels
  for each row execute function public.touch_updated_at();

drop trigger if exists characters_touch on public.characters;
create trigger characters_touch before update on public.characters
  for each row execute function public.touch_updated_at();

drop trigger if exists app_content_touch on public.app_content;
create trigger app_content_touch before update on public.app_content
  for each row execute function public.touch_updated_at();

-- ---------- Seguridad ----------
-- RLS activado SIN políticas públicas: nadie puede leer las tablas directamente
-- con la clave pública. Solo la API (con la clave secreta, en el servidor) accede.
alter table public.levels            enable row level security;
alter table public.characters        enable row level security;
alter table public.character_stats   enable row level security;
alter table public.character_poses   enable row level security;
alter table public.level_media       enable row level security;
alter table public.gameplay_controls enable row level security;
alter table public.gameplay_sections enable row level security;
alter table public.app_content       enable row level security;

-- Permisos explícitos para la clave secreta (por si el proyecto no expone
-- automáticamente las tablas nuevas a la Data API).
grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
