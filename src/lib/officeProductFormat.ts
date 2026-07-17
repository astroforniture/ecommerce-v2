import type { OfficeProduct } from '../types/officeProduct'

const FORMATO_CARTA_A4 = 'Formato Carta A4'
const FORMATO_CARTA_A3 = 'Formato Carta A3'

/** Etichetta formato per filtri catalogo (A4, A3, oppure valore `format` dal DB). */
export function resolveOfficeProductFormatLabel(
  product: Pick<OfficeProduct, 'name' | 'format' | 'subcategory'>,
): string | null {
  const sub = (product.subcategory ?? '').trim()
  if (sub.localeCompare(FORMATO_CARTA_A4, 'it', { sensitivity: 'base' }) === 0) return 'A4'
  if (sub.localeCompare(FORMATO_CARTA_A3, 'it', { sensitivity: 'base' }) === 0) return 'A3'

  const rawFormat = (product.format ?? '').trim()
  if (rawFormat) return rawFormat

  const name = String(product.name ?? '').toLowerCase()
  if (/\ba4\b/.test(name)) return 'A4'
  if (/\ba3\b/.test(name)) return 'A3'

  return null
}

export function matchesOfficeProductFormatFilter(
  product: Pick<OfficeProduct, 'name' | 'format' | 'subcategory'>,
  selectedFormats: readonly string[],
): boolean {
  if (!selectedFormats.length) return true

  const label = resolveOfficeProductFormatLabel(product)
  const sub = (product.subcategory ?? '').trim()

  return selectedFormats.some((selected) => {
    const s = selected.trim()
    if (!s) return false
    if (label && label.localeCompare(s, 'it', { sensitivity: 'base' }) === 0) return true
    if (sub.localeCompare(s, 'it', { sensitivity: 'base' }) === 0) return true
    if (s === 'A4' && sub.localeCompare(FORMATO_CARTA_A4, 'it', { sensitivity: 'base' }) === 0) {
      return true
    }
    if (s === 'A3' && sub.localeCompare(FORMATO_CARTA_A3, 'it', { sensitivity: 'base' }) === 0) {
      return true
    }
    return false
  })
}

export function collectOfficeProductFormatOptions(
  products: readonly Pick<OfficeProduct, 'name' | 'format' | 'subcategory'>[],
): string[] {
  const set = new Set<string>()
  for (const product of products) {
    const label = resolveOfficeProductFormatLabel(product)
    if (label) set.add(label)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
}
