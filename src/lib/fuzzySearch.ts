/** Normalizza per confronto (minuscolo, senza accenti). */
export function normalizeSearchText(raw: string): string {
  return String(raw ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function tokenizeSearchQuery(raw: string): string[] {
  return normalizeSearchText(raw)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const row = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) row[j] = j
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0] ?? 0
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j] ?? 0
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      row[j] = Math.min((row[j - 1] ?? 0) + 1, (row[j] ?? 0) + 1, prev + cost)
      prev = tmp
    }
  }
  return row[b.length] ?? 0
}

function maxEditDistanceForTerm(term: string): number {
  if (term.length <= 3) return 1
  if (term.length <= 6) return 1
  if (term.length <= 10) return 2
  return Math.max(2, Math.floor(term.length * 0.22))
}

/**
 * Match flessibile su singola parola: plurali italiani (etichettatrice/etichettatrici),
 * prefissi e piccole differenze ortografiche.
 */
export function flexibleItalianWordMatch(word: string, term: string): boolean {
  const w = normalizeSearchText(word)
  const t = normalizeSearchText(term)
  if (!w || !t) return false
  if (w === t) return true
  if (/^\d+$/.test(t)) return w.includes(t)

  if (w.startsWith(t) || (t.length >= 6 && t.startsWith(w) && w.length >= 5)) return true

  if (t.length >= 6) {
    if (w.includes(t) || (w.length >= 5 && t.includes(w))) return true
    const minLen = Math.min(w.length, t.length)
    let common = 0
    while (common < minLen && w[common] === t[common]) common++
    if (common >= 6 && common >= minLen - 2) return true
  }

  if (w.length >= 3 && t.length >= 4) {
    const maxDist = maxEditDistanceForTerm(t)
    if (Math.abs(w.length - t.length) <= maxDist + 1 && levenshtein(w, t) <= maxDist) return true
  }

  return false
}

/** Termine su testo normalizzato multi-campo (nome, descrizione, categoria…). */
export function flexibleTermMatchesInHaystack(haystackNormalized: string, term: string): boolean {
  const t = normalizeSearchText(term)
  if (!t) return true
  if (/^\d{3,6}$/.test(t)) return haystackNormalized.includes(t)

  if (t.length >= 6 && haystackNormalized.includes(t)) return true

  const words = haystackNormalized.split(/[^a-z0-9]+/).filter((w) => w.length > 0)
  for (const w of words) {
    if (flexibleItalianWordMatch(w, t)) return true
  }

  if (t.length >= 8) {
    return fuzzyTermMatches(haystackNormalized, term)
  }

  return false
}

/** Singolo termine: substring esatta o match fuzzy su parole del testo. */
export function fuzzyTermMatches(haystackNormalized: string, term: string): boolean {
  const t = normalizeSearchText(term)
  if (!t) return true
  if (haystackNormalized.includes(t)) return true

  if (/^\d{3,6}$/.test(t)) {
    return haystackNormalized.includes(t)
  }

  const words = haystackNormalized.split(/[^a-z0-9]+/).filter((w) => w.length > 0)
  const maxDist = maxEditDistanceForTerm(t)
  for (const w of words) {
    if (w.length < 3) continue
    if (w.includes(t) || (t.length >= 4 && t.includes(w))) return true
    if (Math.abs(w.length - t.length) > maxDist + 1) continue
    if (levenshtein(w, t) <= maxDist) return true
  }

  return false
}

export function fuzzyMatchesAllTerms(haystackNormalized: string, terms: string[]): boolean {
  if (!terms.length) return false
  return terms.every((term) => fuzzyTermMatches(haystackNormalized, term))
}
