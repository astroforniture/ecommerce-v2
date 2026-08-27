/** SKU nascosti dal catalogo pubblico (temporaneo: non cancellati dal DB). */
export const SUPPRESSED_CATALOG_SKUS: readonly string[] = [
  'AF-CALC-OLIB4646',
  'AF-CALC-OLIB5896',
  'AF-LEBEZ-3039',
  'AF-LEBEZ-80328',
  'AF-CALC-SHAEL1901',
  'AF-CALC-LBZ-81913',
  'AF-CALC-LBZ-81914',
  'AF-CALC-81499',
  'AF-CALC-LBZ-81917',
  'AF-CALC-80344',
  'AF-CALC-CANMP1211LTSC',
  'AF-CALC-CANP1DTSC',
  'AF-CALC-CANAS8HB',
  'AF-TOMB-60484',
  'AF-TOMB-29072',
  'AF-LEBEZ-1303',
  'AF-LEBEZ-1303B',
  'AF-PENT-105426',
  'AF-PENT-105424',
  'AF-PENT-105425',
  '3039',
  '80328',
  '1303',
  '1303B',
  '81913',
  '81914',
  '81499',
  '81917',
  '80344',
  'SHAEL1901',
  'EL1901',
  'CANAS8HB',
  'AS8HB',
  'CANP1DTSC',
  'P1DTSC',
  '2304C001',
  'CANMP1211LTSC',
  'MP1211LTSC',
  '60484',
  '29072',
  '105424',
  '105425',
  '105426',
]

const SUPPRESSED_SKU_SET = new Set(SUPPRESSED_CATALOG_SKUS.map((s) => s.toUpperCase()))

function normalizeSkuToken(skuOrId?: string | number | null): string {
  return String(skuOrId ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

function skuAliasTokens(skuOrId?: string | number | null): string[] {
  const raw = normalizeSkuToken(skuOrId)
  if (!raw) return []
  const tokens = new Set<string>([raw])
  const stripped = raw
    .replace(/^AF-CALC-LBZ-/, '')
    .replace(/^AF-CALC-/, '')
    .replace(/^AF-LEBEZ-/, '')
    .replace(/^AF-TOMB-/, '')
    .replace(/^AF-PENT-/, '')
  if (stripped) tokens.add(stripped)
  const last = raw.split('-').pop()
  if (last) tokens.add(last)
  return [...tokens]
}

export function isSuppressedCatalogSku(skuOrId?: string | number | null): boolean {
  return skuAliasTokens(skuOrId).some((token) => SUPPRESSED_SKU_SET.has(token))
}

function normalizeProductName(name?: string | null): string {
  return String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isSuppressedCatalogName(name?: string | null): boolean {
  const n = normalizeProductName(name)
  if (!n) return false
  if (n.includes('barattolo') && n.includes('matita') && n.includes('lebez') && n.includes('100')) {
    return true
  }
  if (n.includes('barattolo') && n.includes('matita') && n.includes('lebez') && n.includes('neon')) {
    return true
  }
  if ((n.includes('el 1901') || n.includes('el1901')) && n.includes('calcolatrice')) return true
  if (n.includes('calcolatrice') && n.includes('maxi') && n.includes('81913')) return true
  if (n.includes('calcolatrice') && n.includes('maxi') && n.includes('81914')) return true
  if (n.includes('fx cg50') || n.includes('fxcg50')) return true
  if (n.includes('calcolatrice scientifica') && n.includes('lebez')) return true
  if (n.includes('hr 8rce') || n.includes('hr8rce')) return true
  if (n.includes('mp 1211') || n.includes('mp1211')) return true
  if (n.includes('p1 dtsc') || n.includes('p1dtsc') || n.includes('2304c001')) return true
  if (n.includes('as8hb')) return true
  if (n.includes('correttore a nastro') && n.includes('tombow') && n.includes('ricaricabile')) {
    return true
  }
  if (n.includes('mono correction') && n.includes('tombow')) return true
  if (
    n.includes('matita hb') &&
    n.includes('lebez') &&
    !n.includes('barattolo') &&
    (n.includes('12 pz') || n.includes('12 pezzi'))
  ) {
    return true
  }
  if (
    n.includes('matita hb') &&
    n.includes('lebez') &&
    !n.includes('barattolo') &&
    (n.includes('4 pz') || n.includes('4 pezzi'))
  ) {
    return true
  }
  if (n.includes('floatune') && n.includes('pentel')) return true
  return false
}

/** True se l'articolo non deve comparire a catalogo, ricerca o scheda pubblica. */
export function isHiddenFromCustomerCatalog(fields: {
  id?: string | number | null
  sku?: string | number | null
  producerCode?: string | null
  name?: string | null
}): boolean {
  if (isSuppressedCatalogSku(fields.sku)) return true
  if (isSuppressedCatalogSku(fields.producerCode)) return true
  if (isSuppressedCatalogSku(fields.id)) return true
  if (isSuppressedCatalogName(fields.name)) return true
  return false
}
