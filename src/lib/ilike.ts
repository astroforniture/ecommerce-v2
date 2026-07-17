/** Escape `%`, `_` e `\` per pattern usati in PostgREST `.ilike()`. */
export function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}
