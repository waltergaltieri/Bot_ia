export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T) {
  return { success: true, data } as const;
}

export function fail<E>(error: E) {
  return { success: false, error } as const;
}