import type { OfficeProduct } from '../types/officeProduct'

/** Rileva buste forate dalla scheda (nome o categoria). */
export function isPunchedEnvelopeProduct(
  p: Pick<OfficeProduct, 'name' | 'category'> | undefined,
): boolean {
  if (!p) return false
  const blob = `${p.name} ${p.category}`.toLowerCase()
  return blob.includes('busta') && blob.includes('forat')
}
