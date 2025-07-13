import { logger } from ".";

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T) {
  return { success: true, data } as const;
}

export function fail<E>(error: E, title?: string) {
  logger.error(title ?? "Operation failed:", error);
  return { success: false, error } as const;
}

export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}

export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}