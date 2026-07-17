import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from '../data/iHealthAstroMedicalProducts'
import { CARTUCCE_TONER_CATEGORY } from './officeCategories'
import { MACCHINE_UFFICIO_BASE_PATH } from './macchineUfficioRoutes'

export type CategoryPageContext = {
  categoryLabel: string
  categoryQueryParam: string
  subcategory: string | null
}

const SLUG_CATEGORY_MAP: Record<string, string> = {
  carta: 'Carta',
  cancelleria: 'Cancelleria',
  archivio: 'Archivio',
  'archivio-ufficio': 'Archivio',
  toner: CARTUCCE_TONER_CATEGORY,
  'cartucce-toner': CARTUCCE_TONER_CATEGORY,
  'cartucce-e-toner': CARTUCCE_TONER_CATEGORY,
  'macchine-per-ufficio': 'Macchine per Ufficio',
  'macchine-ufficio': 'Macchine per Ufficio',
  distruggidocumenti: 'Macchine per Ufficio',
  'astro-medical': LINEA_ASTRO_MEDICAL_CATEGORY,
}

function contextFromCategoryParam(
  category: string,
  subcategory: string | null,
): CategoryPageContext {
  return {
    categoryLabel: category,
    categoryQueryParam: category,
    subcategory,
  }
}

/** True se la route corrente è una pagina catalogo per macro-categoria. */
export function useCategoryPageContext(): CategoryPageContext | null {
  const location = useLocation()
  const { slug = '' } = useParams<{ slug?: string }>()

  return useMemo(() => {
    const pathname = location.pathname

    if (pathname === '/office-products' || pathname === '/office') {
      const params = new URLSearchParams(location.search)
      const category = params.get('category')?.trim()
      if (!category) return null
      return contextFromCategoryParam(category, params.get('subcategory')?.trim() || null)
    }

    if (
      pathname.startsWith(MACCHINE_UFFICIO_BASE_PATH) ||
      pathname.startsWith('/macchine-ufficio')
    ) {
      return contextFromCategoryParam('Macchine per Ufficio', null)
    }

    if (pathname === '/cartucce-toner') {
      return contextFromCategoryParam(CARTUCCE_TONER_CATEGORY, null)
    }

    if (pathname === '/distruggidocumenti') {
      return contextFromCategoryParam('Macchine per Ufficio', null)
    }

    if (pathname.startsWith('/categoria/')) {
      const mapped = SLUG_CATEGORY_MAP[slug.trim().toLowerCase()]
      if (mapped) return contextFromCategoryParam(mapped, null)
    }

    return null
  }, [location.pathname, location.search, slug])
}
