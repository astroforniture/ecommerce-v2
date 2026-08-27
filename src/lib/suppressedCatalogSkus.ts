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
]

const SUPPRESSED_SKU_SET = new Set(SUPPRESSED_CATALOG_SKUS.map((s) => s.toUpperCase()))

export function isSuppressedCatalogSku(skuOrId?: string | number | null): boolean {
  const code = String(skuOrId ?? '')
    .trim()
    .toUpperCase()
  if (!code) return false
  return SUPPRESSED_SKU_SET.has(code)
}
