import type { OfficeProduct } from '../types/officeProduct'

export type RelatedSeed = {
  id?: string
  name?: string | null
  description?: string | null
  subtitle?: string | null
  category?: string | null
  subcategory?: string | null
  brand?: string | null
}

const STOPWORDS = new Set([
  'a',
  'al',
  'alla',
  'alle',
  'agli',
  'con',
  'da',
  'dal',
  'dalla',
  'dei',
  'del',
  'della',
  'delle',
  'di',
  'e',
  'ed',
  'il',
  'in',
  'la',
  'le',
  'lo',
  'per',
  'pz',
  'conf',
  'set',
  'mm',
  'cm',
  'ml',
  'lt',
  'pack',
  'the',
  'and',
  'of',
  'x',
])

/**
 * Cluster semantici: se il seed contiene un termine, valorizziamo i correlati del cluster
 * (es. lettino -> lenzuolino / guanti / coprilettino).
 */
const SYNONYM_CLUSTERS: readonly (readonly string[])[] = [
  ['lettino', 'lenzuolino', 'lenzuola', 'coprilettino', 'materassino', 'traverse', 'guanti'],
  ['siringa', 'ago', 'aghi', 'cannula', 'catetere', 'medicazione'],
  ['mascherina', 'guanti', 'cuffia', 'camice', 'dpi', 'visiera'],
  ['cassa', 'registratore', 'ditron', 'cassetto', 'barcode', 'termica', 'rotoli'],
  ['toner', 'cartuccia', 'cartucce', 'stampante', 'ink'],
  ['etichettatrice', 'etichette', 'nastro', 'label'],
  ['distruggi', 'distruggidocumenti', 'trituratore', 'shredder'],
  ['agenda', 'planner', 'diario', 'calendario'],
  ['busta', 'buste', 'shopper', 'cartellina', 'archivio'],
  ['carta', 'risma', 'fotocopie', 'a4', 'a3'],
  ['penna', 'penne', 'biro', 'evidenziatore', 'matita', 'marker'],
  ['cucitrice', 'punti', 'spillatrice', 'fermagli'],
  ['timbro', 'tampone', 'inchiostro'],
]

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenizeRelatedText(value: string | null | undefined): string[] {
  if (!value) return []
  return normalizeText(value)
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t))
}

function seedHaystack(seed: RelatedSeed): string {
  return normalizeText(
    [seed.name, seed.subtitle, seed.description, seed.category, seed.subcategory, seed.brand]
      .filter(Boolean)
      .join(' '),
  )
}

function candidateHaystack(
  p: Pick<
    OfficeProduct,
    'name' | 'subtitle' | 'description' | 'category' | 'subcategory' | 'brand'
  >,
): string {
  return normalizeText(
    [p.name, p.subtitle, p.description, p.category, p.subcategory, p.brand]
      .filter(Boolean)
      .join(' '),
  )
}

function activeSynonymTerms(seedText: string): Set<string> {
  const out = new Set<string>()
  for (const cluster of SYNONYM_CLUSTERS) {
    if (cluster.some((term) => seedText.includes(term))) {
      for (const term of cluster) out.add(term)
    }
  }
  return out
}

/** Espande termini utili per query ILIKE / ricerca catalogo. */
export function expandRelatedSearchTerms(seed: RelatedSeed, maxTerms = 8): string[] {
  const seedText = seedHaystack(seed)
  const tokens = tokenizeRelatedText(seedText)
  const synonyms = [...activeSynonymTerms(seedText)]
  const merged: string[] = []
  const seen = new Set<string>()
  for (const term of [...synonyms, ...tokens]) {
    const t = term.trim().toLowerCase()
    if (t.length < 3 || seen.has(t)) continue
    seen.add(t)
    merged.push(t)
    if (merged.length >= maxTerms) break
  }
  return merged
}

export function scoreRelatedCandidate(seed: RelatedSeed, candidate: OfficeProduct): number {
  if (!candidate?.id) return -Infinity
  if (seed.id && String(candidate.id) === String(seed.id)) return -Infinity

  const seedCat = normalizeText(seed.category ?? '')
  const seedSub = normalizeText(seed.subcategory ?? '')
  const candCat = normalizeText(candidate.category ?? '')
  const candSub = normalizeText(candidate.subcategory ?? '')
  const seedText = seedHaystack(seed)
  const candText = candidateHaystack(candidate)
  const seedTokens = new Set(tokenizeRelatedText(seedText))
  const candTokens = tokenizeRelatedText(candText)
  const synonyms = activeSynonymTerms(seedText)

  let score = 0

  if (
    seedCat &&
    candCat &&
    (candCat === seedCat || candCat.includes(seedCat) || seedCat.includes(candCat))
  ) {
    score += 40
  }
  if (
    seedSub &&
    candSub &&
    (candSub === seedSub || candSub.includes(seedSub) || seedSub.includes(candSub))
  ) {
    score += 28
  }

  let overlap = 0
  for (const t of candTokens) {
    if (seedTokens.has(t)) overlap += 1
  }
  score += Math.min(36, overlap * 8)

  let synonymHits = 0
  for (const term of synonyms) {
    if (candText.includes(term) && !seedText.includes(term)) synonymHits += 1
    else if (candText.includes(term)) synonymHits += 0.35
  }
  score += Math.min(40, synonymHits * 12)

  const seedBrand = normalizeText(seed.brand ?? '')
  const candBrand = normalizeText(candidate.brand ?? '')
  if (seedBrand && candBrand && seedBrand === candBrand) score += 6

  if (typeof candidate.price === 'number' && candidate.price > 0) score += 4
  if ((candidate.imageUrl ?? '').trim()) score += 3

  return score
}

export function rankRelatedProducts(
  seeds: readonly RelatedSeed[],
  candidates: readonly OfficeProduct[],
  options?: {
    excludeIds?: ReadonlySet<string>
    limit?: number
    minScore?: number
  },
): OfficeProduct[] {
  const exclude = options?.excludeIds ?? new Set<string>()
  const limit = options?.limit ?? 4
  const minScore = options?.minScore ?? 12
  const scored = new Map<string, { product: OfficeProduct; score: number }>()

  for (const candidate of candidates) {
    const id = String(candidate.id)
    if (!id || exclude.has(id)) continue
    if (candidate.producerCode && exclude.has(candidate.producerCode)) continue

    let best = -Infinity
    for (const seed of seeds) {
      if (seed.id && String(seed.id) === id) {
        best = -Infinity
        break
      }
      best = Math.max(best, scoreRelatedCandidate(seed, candidate))
    }
    if (!Number.isFinite(best) || best < minScore) continue
    const prev = scored.get(id)
    if (!prev || best > prev.score) scored.set(id, { product: candidate, score: best })
  }

  return [...scored.values()]
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'it'))
    .slice(0, limit)
    .map((x) => x.product)
}
