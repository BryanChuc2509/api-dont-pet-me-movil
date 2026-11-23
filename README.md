# Don't Pet Me — API

API REST de solo lectura para la app móvil de Don't Pet Me.
**Node.js + Express 5 + TypeScript**, con **Supabase** como base de datos (PostgreSQL) y almacenamiento de imágenes y videos (Storage).

> Sequelize no se usa: `@supabase/supabase-js` ya consulta PostgreSQL y además gestiona Storage, así que un ORM extra solo añadiría una segunda conexión.

## Stack

| Pieza | Uso |
|---|---|
| Express 5 | Servidor HTTP (errores async sin try/catch) |
| TypeScript (ESM) | Tipado estricto; `tsx` en desarrollo |
| @supabase/supabase-js | Consultas a PostgreSQL y URLs públicas de Storage |
| zod | Validación del `.env` y de parámetros |
| morgan | Logs de peticiones |
| cors · helmet · compression | CORS, cabeceras de seguridad y gzip |
| sharp | Miniaturas de la galería (solo en el seed) |

## Puesta en marcha

### Requisitos previos

Usa **Node.js 22 o superior** (Node.js 20 ya no está soportado por las versiones actuales de `@supabase/supabase-js`).

### 1. Crear el proyecto en Supabase
1. Entra en <https://supabase.com>, crea una cuenta y un **New project** (elige región cercana y guarda la contraseña de la base de datos).
2. En **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo (**Run**). Crea las tablas, índices y la seguridad (RLS).

### 2. Configurar variables
```bash
cp .env.example .env
```
En Supabase → **Project Settings → API Keys** copia:
- **Project URL** → `SUPABASE_URL`
- **Secret key** (`sb_secret_...`, o la `service_role` en proyectos antiguos) → `SUPABASE_SECRET_KEY`

> La clave secreta salta la seguridad de la base de datos: solo va en el `.env` del servidor, **nunca** en la app móvil ni en Git.

### 3. Instalar y cargar los datos
```bash
npm install
npm run seed
```
El seed (idempotente, se puede repetir):
- crea el bucket público `media` en Storage,
- sube imágenes y videos desde `../app-movil/assets` (y genera miniaturas de 480 px para la galería),
- inserta niveles, personajes, estadísticas, galería, jugabilidad y contenido de inicio.

`npm run seed:media` o `npm run seed:data` ejecutan solo una de las dos partes.

### 4. Arrancar
```bash
npm run dev        # desarrollo con recarga
npm run build && npm start   # producción
```
Al iniciar muestra las URLs local y de **red local**. Comprueba `http://localhost:3000/health` → `{"status":"ok","database":"ok"}`.

### 5. Conectar la app móvil
En `app-movil/.env` (ver `app-movil/.env.example`):
```
EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:3000/api/v1
```
Usa la IP de **Red local** que imprime la API (en un teléfono, `localhost` es el propio teléfono). El PC y el teléfono deben estar en la misma Wi-Fi y el firewall de Windows debe permitir Node en redes privadas. Reinicia Expo con `npx expo start --clear`.

## Endpoints

Base: `/api/v1` · Todas las respuestas son JSON · Imágenes y videos como `{ "uri": "https://..." }`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/home` | Personaje destacado y capítulo actual |
| GET | `/levels` | Lista de niveles (mapa de mundos) |
| GET | `/levels/:id` | Nivel con descripción, peligros, jefe y galería |
| GET | `/characters` | Lista de personajes (carrusel) |
| GET | `/characters/:id` | Personaje con estadísticas, datos curiosos, poses y video 360° |
| GET | `/gallery?levelId=` | Imágenes de la galería (filtro opcional por nivel) |
| GET | `/gameplay` | Controles, secciones de la guía y video del HUD |
| GET | `/health` | Estado de la API y de la conexión con Supabase |

### Errores
```json
{ "error": { "code": "NOT_FOUND", "message": "Nivel \"bosque\" no encontrado" } }
```
| Código | HTTP | Cuándo |
|---|---|---|
| `BAD_REQUEST` | 400 | id o parámetros inválidos (incluye `details`) |
| `NOT_FOUND` | 404 | recurso o ruta inexistente |
| `UPSTREAM_ERROR` | 502 | Supabase no respondió o devolvió error |
| `INTERNAL_ERROR` | 500 | error inesperado |

Las respuestas correctas llevan `Cache-Control` (configurable con `CACHE_MAX_AGE`) y `ETag`; los errores, `no-store`.

## Estructura

```
src/
  app.ts              Express: middlewares y rutas
  server.ts           arranque y cierre ordenado
  config/env.ts       variables de entorno validadas con zod
  lib/                cliente de Supabase, URLs de Storage, helpers de consulta
  routes/             /api/v1 y /health
  controllers/        validan la entrada y responden
  services/           consultas a Supabase
  mappers/            filas (snake_case) → DTO de la app (camelCase + URLs)
  middlewares/        caché, 404 y manejador de errores
  types/              filas de la BD (db.ts) y contrato JSON (dto.ts)
scripts/
  seed.ts             carga inicial
  seed/               contenido, inventario de archivos, subida a Storage
supabase/schema.sql   tablas, índices, triggers y RLS
```

## Modelo de datos

`levels` ⇄ `characters` (jefe del nivel / nivel del personaje) · `character_stats` · `character_poses` · `level_media` (detalle + galería) · `gameplay_controls` · `gameplay_sections` · `app_content` (una fila: inicio y video de jugabilidad).

Las columnas de imagen guardan la **ruta dentro del bucket** (`characters/mochi.webp`); la API la convierte en URL pública. Para editar contenido basta con modificar las tablas desde el **Table Editor** de Supabase.
