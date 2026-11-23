export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'UPSTREAM_ERROR' | 'INTERNAL_ERROR';

/** Error controlado que el errorHandler convierte en respuesta JSON. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static notFound(resource: string, id: string) {
    return new ApiError(404, 'NOT_FOUND', `${resource} "${id}" no encontrado`);
  }

  /** Fallo al consultar Supabase */
  static upstream(message: string) {
    return new ApiError(502, 'UPSTREAM_ERROR', message);
  }
}
