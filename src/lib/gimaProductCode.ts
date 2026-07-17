import type { OfficeProduct } from '../types/officeProduct'

/** Estrae codici numerici GIMA da id, SKU e titolo (es. gima-27110 → 27110). */
export function extractGimaNumericCodes(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name'>,
): string[] {
  const codes = new Set<string>()
  const scan = (raw: string) => {
    const s = String(raw ?? '').trim()
    if (!s) return
    for (const m of s.matchAll(/gima-(\d{4,6}(?:-[a-z0-9]+)?)/gi)) {
      const stem = m[1]?.split('-')[0]
      if (stem) codes.add(stem)
    }
    for (const m of s.matchAll(/\bGIMA\s*[#:]?\s*(\d{4,6})\b/gi)) {
      if (m[1]) codes.add(m[1])
    }
    if (/^\d{4,6}$/.test(s)) codes.add(s)
  }
  scan(product.id)
  scan(product.producerCode)
  scan(product.name)
  return [...codes]
}
