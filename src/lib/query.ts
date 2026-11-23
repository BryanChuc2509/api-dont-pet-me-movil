import type { PostgrestError } from '@supabase/supabase-js';

import { ApiError } from '../utils/ApiError.js';

interface QueryResult<T> {
  data: T | null;
  error: PostgrestError | null;
}

/** Devuelve los datos de una consulta de Supabase o lanza un ApiError. */
export function unwrap<T>({ data, error }: QueryResult<unknown>, context: string): T {
  if (error) throw ApiError.upstream(`Error al consultar ${context}: ${error.message}`);
  return data as T;
}

/** Igual que unwrap, pero 404 si la fila no existe (para consultas con maybeSingle). */
export function unwrapOne<T>(result: QueryResult<unknown>, resource: string, id: string): T {
  const row = unwrap<T | null>(result, resource);
  if (!row) throw ApiError.notFound(resource, id);
  return row;
}
