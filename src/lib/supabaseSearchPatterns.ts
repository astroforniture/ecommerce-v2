import { escapeIlikePattern } from './ilike'
import { normalizeSearchText, tokenizeSearchQuery } from './fuzzySearch'

/** Pattern `.ilike` per Supabase: query intera, token e varianti radice (plurali). */
export function buildSupabaseIlikePatterns(rawQuery: string): string[] {
  const patterns = new Set<string>()
  const add = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length < 2) return
    patterns.add(`%${escapeIlikePattern(trimmed)}%`)
  }

  const query = rawQuery.trim()
  add(query)

  const norm = normalizeSearchText(query)
  if (norm.length >= 6) {
    add(norm.slice(0, -1))
    add(norm.slice(0, -2))
  }
  if (norm.length >= 8) {
    add(norm.slice(0, Math.max(6, norm.length - 3)))
  }

  for (const token of tokenizeSearchQuery(query)) {
    add(token)
    const tokenNorm = normalizeSearchText(token)
    if (tokenNorm.length >= 6) {
      add(tokenNorm.slice(0, -1))
    }
  }

  return [...patterns].slice(0, 6)
}
