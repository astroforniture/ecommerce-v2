import type { OfficeProduct } from '../types/officeProduct'
import {
  LINEA_ASTRO_MEDICAL_CATEGORY,
  isAstroMedicalProductCategory,
  lineaAstroMedicalIHealthListingPath,
} from '../data/iHealthAstroMedicalProducts'
import {
  lineaAstroMedicalMacroHref,
  resolveAstroMedicalMacro,
} from './astroMedicalSubcategories'
import {
  CANCELLERIA_VIEW_SHOPPER,
  isShopperLeafListingView,
} from '../data/shopperCancelleria'
import {
  CARTUCCE_TONER_CATEGORY,
  MODULISTICA_CATEGORY,
  normalizeOfficeProductCategory,
  OFFICE_CATEGORY_FALLBACK,
  PRODOTTI_IGIENE_CATEGORY,
  AGENDE_CATEGORY,
  SICUREZZA_CATEGORY,
} from './officeCategories'
import { macchineUfficioHubPath } from './macchineUfficioRoutes'
import { agendeCategoryHref } from './agendeCatalog'
import { sicurezzaCategoryHref } from './sicurezzaCatalog'
import {
  isStaticSyntheticOfficeProduct,
  staticSyntheticOfficeListingPath,
} from './syntheticOfficeCatalogProducts'

export type CatalogBackNav = {
  href: string
  label: string
}

const HOME_NAV: CatalogBackNav = { href: '/', label: 'Torna alla Home' }

/** Listing `/office-products` per categoria (+ sottocategoria opzionale). */
export function officeProductsListingHref(
  category: string,
  subcategory?: string | null,
  extraParams?: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams()
  const cat = category.trim()
  if (cat) params.set('category', cat)
  const sub = (subcategory ?? '').trim()
  if (sub) params.set('subcategory', sub)
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      const v = (value ?? '').trim()
      if (v) params.set(key, v)
      else params.delete(key)
    }
  }
  const qs = params.toString()
  return qs ? `/office-products?${qs}` : '/office-products?catalog=ufficio'
}

/**
 * Destinazione «Torna al catalogo» dalla scheda prodotto:
 * listing della stessa categoria (+ sottocategoria se presente).
 * Eccezione Sicurezza: sempre hub padre (mai sottocategoria Giubbotti/Giacche/…).
 */
export function catalogBackNavFromProduct(
  product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory'> | null | undefined,
): CatalogBackNav {
  if (!product) return { href: '/office-products?catalog=ufficio', label: 'Torna al catalogo' }

  const categoryNormalized = normalizeOfficeProductCategory(product.category)

  // DPI / abbigliamento Sicurezza: torna all’hub Sicurezza, non alla sottocategoria.
  if (categoryNormalized === SICUREZZA_CATEGORY) {
    return {
      href: sicurezzaCategoryHref(),
      label: `Torna a ${SICUREZZA_CATEGORY}`,
    }
  }

  // Agende: torna all’hub /agende (non alla sottocategoria).
  if (categoryNormalized === AGENDE_CATEGORY) {
    return {
      href: agendeCategoryHref(),
      label: `Torna a ${AGENDE_CATEGORY}`,
    }
  }

  if (isStaticSyntheticOfficeProduct(product)) {
    const href = staticSyntheticOfficeListingPath(product)
    const category = categoryNormalized
    return {
      href,
      label: category && category !== OFFICE_CATEGORY_FALLBACK
        ? `Torna a ${category}`
        : 'Torna al catalogo',
    }
  }

  if (isAstroMedicalProductCategory(product.category) || String(product.id).startsWith('gima-')) {
    const macro = resolveAstroMedicalMacro(product)
    if (macro) {
      return {
        href: lineaAstroMedicalMacroHref(macro),
        label: `Torna a ${macro}`,
      }
    }
    return {
      href: lineaAstroMedicalIHealthListingPath(),
      label: 'Torna ad Astro Medical',
    }
  }

  const category = categoryNormalized
  const subcategory = (product.subcategory ?? '').trim()

  if (category === 'Macchine per Ufficio') {
    return {
      href: macchineUfficioHubPath(),
      label: 'Torna a Macchine per Ufficio',
    }
  }

  if (!category || category === OFFICE_CATEGORY_FALLBACK) {
    return { href: '/office-products?catalog=ufficio', label: 'Torna al catalogo' }
  }

  if (subcategory) {
    return {
      href: officeProductsListingHref(category, subcategory),
      label: `Torna a ${subcategory}`,
    }
  }

  return {
    href: officeProductsListingHref(category),
    label: `Torna a ${category}`,
  }
}

type OfficePageBackInput = {
  categoryFromUrl: string | null | undefined
  selectedSubcategory: string
  selectedCancelleriaView: string | null
  isGeneralShopCatalog: boolean
}

/**
 * Pulsante in alto a sinistra su OfficePage:
 * - sottocategoria / vista Cancelleria → categoria (o hub) padre
 * - categoria principale / hub / shop generale → Home
 */
export function catalogBackNavFromOfficePage(input: OfficePageBackInput): CatalogBackNav {
  if (input.isGeneralShopCatalog || !(input.categoryFromUrl ?? '').trim()) {
    return HOME_NAV
  }

  const categoryRaw = (input.categoryFromUrl ?? '').trim()
  const category = normalizeOfficeProductCategory(categoryRaw)
  const subcategory = (input.selectedSubcategory ?? '').trim()
  const view = input.selectedCancelleriaView

  if (category === 'Cancelleria' && view) {
    if (isShopperLeafListingView(view)) {
      return {
        href: officeProductsListingHref('Cancelleria', null, {
          cancelleriaView: CANCELLERIA_VIEW_SHOPPER,
        }),
        label: 'Torna a Shopper',
      }
    }
    if (view === CANCELLERIA_VIEW_SHOPPER) {
      return {
        href: officeProductsListingHref('Cancelleria'),
        label: 'Torna a Cancelleria',
      }
    }
    return {
      href: officeProductsListingHref('Cancelleria'),
      label: 'Torna a Cancelleria',
    }
  }

  if (subcategory) {
    const parentLabel =
      category === SICUREZZA_CATEGORY
        ? SICUREZZA_CATEGORY
        : category === AGENDE_CATEGORY
          ? AGENDE_CATEGORY
          : category === PRODOTTI_IGIENE_CATEGORY
            ? PRODOTTI_IGIENE_CATEGORY
            : category === MODULISTICA_CATEGORY
              ? MODULISTICA_CATEGORY
              : category === CARTUCCE_TONER_CATEGORY
                ? CARTUCCE_TONER_CATEGORY
                : category === LINEA_ASTRO_MEDICAL_CATEGORY
                  ? 'Astro Medical'
                  : category
    return {
      href:
        category === AGENDE_CATEGORY
          ? agendeCategoryHref()
          : officeProductsListingHref(
              category === LINEA_ASTRO_MEDICAL_CATEGORY
                ? LINEA_ASTRO_MEDICAL_CATEGORY
                : categoryRaw || category,
            ),
      label: `Torna a ${parentLabel}`,
    }
  }

  // Categoria principale (hub tile o listing senza sottocategoria)
  return HOME_NAV
}

/** Layout Macchine per Ufficio: hub → Home; sottocategoria → hub Macchine. */
export function catalogBackNavFromMacchineLayout(pathname: string): CatalogBackNav {
  const hub = macchineUfficioHubPath()
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const hubNormalized = hub.replace(/\/+$/, '')
  if (normalized === hubNormalized || normalized === '/macchine-ufficio') {
    return HOME_NAV
  }
  if (normalized.startsWith(`${hubNormalized}/`) || normalized.startsWith('/macchine-ufficio/')) {
    return { href: hub, label: 'Torna a Macchine per Ufficio' }
  }
  return HOME_NAV
}
