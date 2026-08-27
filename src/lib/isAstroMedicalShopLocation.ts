import { isAstroMedicalProductCategory } from '../data/iHealthAstroMedicalProducts'

/**
 * True se l'utente e' nello shop Astro Medical (listing dedicato o catalogo office
 * con categoria medica attiva). Usato per limitare la ricerca globale.
 */
export function isAstroMedicalShopLocation(pathname: string, search = ''): boolean {
  const path = String(pathname ?? '').toLowerCase()
  if (path.includes('astro-medical')) return true
  if (path === '/medical' || path.startsWith('/medical/')) return true
  if (/(^|\/)medical(\/|$)/.test(path) && path.includes('categoria')) return true

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const category = (params.get('category') ?? '').trim()
  return isAstroMedicalProductCategory(category)
}
