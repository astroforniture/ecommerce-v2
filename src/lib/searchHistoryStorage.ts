const STORAGE_KEY = 'astro-office-search-history-v1'
const MAX_ITEMS = 5

function readRaw(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x) => String(x ?? '').trim())
      .filter((x) => x.length > 0)
      .slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

function writeRaw(items: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {
    /* quota / privacy mode */
  }
}

export function getSearchHistory(): string[] {
  return readRaw()
}

export function pushSearchHistory(query: string): string[] {
  const q = query.trim()
  if (q.length < 2) return readRaw()
  const prev = readRaw().filter((x) => x.toLowerCase() !== q.toLowerCase())
  const next = [q, ...prev].slice(0, MAX_ITEMS)
  writeRaw(next)
  return next
}

export function removeSearchHistoryItem(query: string): string[] {
  const q = query.trim().toLowerCase()
  const next = readRaw().filter((x) => x.toLowerCase() !== q)
  writeRaw(next)
  return next
}

export function clearSearchHistory(): void {
  writeRaw([])
}
