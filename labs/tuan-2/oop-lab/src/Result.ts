export type Result<T, E extends string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function unwrap<T, E extends string>(result: Result<T, E>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
