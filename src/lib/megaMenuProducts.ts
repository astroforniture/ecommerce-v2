import {
  fetchOfficeProductsFromSupabase,
  matchesArchivioSubcategoryFilter,
} from '../api/officeProductsSupabase'
import { buildCasseDitronOfficeProducts } from '../data/casseDitronProducts'
import { buildDistruggidocumentiOfficeProducts } from '../data/distruggidocumentiProducts'
import { buildEtichettatriciOfficeProducts } from '../data/macchineEtichettatrici'
import { buildVerificaBanconoteOfficeProducts } from '../data/verificaBanconoteProducts'
import { buildPlastificatriciOfficeProducts } from '../data/plastificatriciProducts'
import type { MegaMenuPreviewSource } from '../data/megaMenuNav'
import { buildPileOfficeProducts } from '../data/pileProducts'
import { buildQuaderniOfficeProducts } from '../data/quaderniProducts'
import {
  CANCELLERIA_VIEW_BUSTE,
  matchesBusteHubProduct,
  mergeBusteListingProducts,
} from '../data/sacbollBuste'
import {
  CANCELLERIA_VIEW_SHOPPER,
  CANCELLERIA_VIEW_SHOPPER_CARTA,
  CANCELLERIA_VIEW_SHOPPER_PLASTICA,
  matchesShopperCartaProduct,
  matchesShopperPlasticaProduct,
  buildShopperCartaOfficeProducts,
  buildShopperPlasticaOfficeProducts,
} from '../data/shopperCancelleria'
import {
  matchesModulisticaSubcategoryFilter,
} from '../data/modulisticaCatalog'
import {
  matchesCartaSubcategoryFilter,
  normalizeOfficeProductCategory,
  officeCategoryFilterFromUrlParam,
} from '../lib/officeCategories'
import { matchesAstroMedicalSubcategoryFilter } from '../lib/astroMedicalSubcategories'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from '../data/iHealthAstroMedicalProducts'
import { buildLineaAstroMedicalAllOfficeProducts } from '../data/lineaAstroMedicalCombined'
import { isTimbroAziendeFarmacieProduct } from '../lib/timbroAziendeFarmacieProduct'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import type { QueryClient } from '@tanstack/react-query'
import type { OfficeProduct } from '../types/officeProduct'

function normNameLite(name: string): string {
  return String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’'`]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasDisplayableProduct(product: OfficeProduct): boolean {
  return Boolean((product.imageUrl ?? '').trim()) && typeof product.price === 'number'
}

/** Tutti i prodotti visualizzabili della sottocategoria (ordinati A–Z). */
function listPreviewProducts(products: OfficeProduct[]): OfficeProduct[] {
  return products
    .filter(hasDisplayableProduct)
    .sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))
}

function categoryNormMatches(product: OfficeProduct, categoryNorm: string): boolean {
  const productNorm = normalizeOfficeProductCategory(product.category).toLowerCase()
  if (productNorm === categoryNorm) return true
  return product.category.trim().toLowerCase() === categoryNorm
}

function matchesCancelleriaHub(product: OfficeProduct, hub: string): boolean {
  if (hub === 'pile') return product.id.startsWith('AF-PILE-')
  if (hub === 'quaderni') return product.id.startsWith('AF-QUAD-')
  if (hub === 'timbri') {
    if (isTimbroAziendeFarmacieProduct(product)) return true
    const sub = (product.subcategory ?? '').trim().toLowerCase()
    if (sub === 'timbri') return true
    return normNameLite(product.name).includes('timbro')
  }
  if (hub === CANCELLERIA_VIEW_BUSTE) return matchesBusteHubProduct(product)
  if (hub === CANCELLERIA_VIEW_SHOPPER) {
    return matchesShopperCartaProduct(product) || matchesShopperPlasticaProduct(product)
  }
  if (hub === CANCELLERIA_VIEW_SHOPPER_CARTA) return matchesShopperCartaProduct(product)
  if (hub === CANCELLERIA_VIEW_SHOPPER_PLASTICA) return matchesShopperPlasticaProduct(product)

  const n = normNameLite(product.name)
  if (hub === 'nastri') return n.includes('nastro')
  if (hub === 'cucitrici') return n.includes('cucitrice')
  if (hub === 'evidenziatori') return n.includes('evidenziatore')
  if (hub === 'calcolatrici') {
    const sub = (product.subcategory ?? '').trim().toLowerCase()
    if (sub.includes('calcolatrici') || sub === 'calcolatrice') return true
    return n.includes('calcolatrice') || n.includes('calcolatrici')
  }
  if (hub === 'scrittura') {
    const sub = (product.subcategory ?? '').trim().toLowerCase()
    if (
      sub === 'scrittura' ||
      sub.includes('penne') ||
      sub.includes('pennarelli') ||
      sub.includes('matite')
    ) {
      return true
    }
    return (
      n.includes('roller hi') ||
      n.includes('penna a sfera bic cristal') ||
      n.includes('marcatore') ||
      n.includes('pennarello stabilo') ||
      n.includes('matita in grafite noris') ||
      n.includes('matita') ||
      n.includes('matite') ||
      n.includes('pennarello') ||
      n.includes('floatune') ||
      n.includes('penna roller') ||
      /\bpenna\b/.test(n)
    )
  }
  return false
}

async function fetchCategoryProducts(category: string): Promise<OfficeProduct[]> {
  if (!isSupabaseConfigured()) return []
  return fetchOfficeProductsFromSupabase(category, null)
}

function filterByPreviewSource(
  products: OfficeProduct[],
  source: MegaMenuPreviewSource,
): OfficeProduct[] {
  if (source.kind === 'none') return []

  if (source.kind === 'category') {
    const categoryNorm = officeCategoryFilterFromUrlParam(source.category)
    if (!categoryNorm) return []
    return products.filter((p) => categoryNormMatches(p, categoryNorm))
  }

  if (source.kind === 'office-subcategory') {
    const categoryNorm = officeCategoryFilterFromUrlParam(source.category)
    if (!categoryNorm) return []
    return products.filter((p) => {
      if (!categoryNormMatches(p, categoryNorm)) return false
      if (categoryNorm === 'carta') {
        return matchesCartaSubcategoryFilter(p, source.subcategory)
      }
      if (categoryNorm === 'archivio') {
        return matchesArchivioSubcategoryFilter(p, source.subcategory)
      }
      if (categoryNorm === 'modulistica') {
        return matchesModulisticaSubcategoryFilter(p, source.subcategory)
      }
      if (
        categoryNorm === LINEA_ASTRO_MEDICAL_CATEGORY.toLowerCase() ||
        source.category.localeCompare(LINEA_ASTRO_MEDICAL_CATEGORY, 'it', {
          sensitivity: 'base',
        }) === 0
      ) {
        return matchesAstroMedicalSubcategoryFilter(p, source.subcategory)
      }
      const sub = (p.subcategory ?? '').trim()
      return sub.localeCompare(source.subcategory, 'it', { sensitivity: 'base' }) === 0
    })
  }

  if (source.kind === 'cancelleria-hub') {
    return products.filter((p) => matchesCancelleriaHub(p, source.hub))
  }

  return []
}

function syncMacchinePreview(
  catalog: 'distruggi' | 'etichettatrici' | 'casse' | 'verifica-banconote' | 'plastificatrici' | 'hub',
): OfficeProduct[] {
  if (catalog === 'distruggi') return listPreviewProducts(buildDistruggidocumentiOfficeProducts())
  if (catalog === 'etichettatrici') return listPreviewProducts(buildEtichettatriciOfficeProducts())
  if (catalog === 'casse') return listPreviewProducts(buildCasseDitronOfficeProducts())
  if (catalog === 'verifica-banconote') {
    return listPreviewProducts(buildVerificaBanconoteOfficeProducts())
  }
  if (catalog === 'plastificatrici') {
    return listPreviewProducts(buildPlastificatriciOfficeProducts())
  }
  return listPreviewProducts([
    ...buildDistruggidocumentiOfficeProducts(),
    ...buildEtichettatriciOfficeProducts(),
    ...buildCasseDitronOfficeProducts(),
    ...buildVerificaBanconoteOfficeProducts(),
    ...buildPlastificatriciOfficeProducts(),
  ])
}

function syncCancelleriaHubPreview(hub: string): OfficeProduct[] | null {
  if (hub === 'pile') return listPreviewProducts(buildPileOfficeProducts())
  if (hub === 'quaderni') return listPreviewProducts(buildQuaderniOfficeProducts())
  if (hub === CANCELLERIA_VIEW_SHOPPER) {
    return listPreviewProducts([
      ...buildShopperCartaOfficeProducts(),
      ...buildShopperPlasticaOfficeProducts(),
    ])
  }
  if (hub === CANCELLERIA_VIEW_SHOPPER_CARTA) {
    return listPreviewProducts(buildShopperCartaOfficeProducts())
  }
  if (hub === CANCELLERIA_VIEW_SHOPPER_PLASTICA) {
    return listPreviewProducts(buildShopperPlasticaOfficeProducts())
  }
  return null
}

export async function fetchMegaMenuPreviewProducts(
  source: MegaMenuPreviewSource,
): Promise<OfficeProduct[]> {
  if (source.kind === 'none') return []

  if (source.kind === 'macchine') {
    return syncMacchinePreview(source.catalog)
  }

  if (source.kind === 'cancelleria-hub') {
    const sync = syncCancelleriaHubPreview(source.hub)
    if (sync) return sync
    const products = await fetchCategoryProducts('Cancelleria')
    if (source.hub === CANCELLERIA_VIEW_BUSTE) {
      return listPreviewProducts(mergeBusteListingProducts(products))
    }
    return listPreviewProducts(filterByPreviewSource(products, source))
  }

  if (source.kind === 'category') {
    if (
      source.category.localeCompare(LINEA_ASTRO_MEDICAL_CATEGORY, 'it', {
        sensitivity: 'base',
      }) === 0
    ) {
      return listPreviewProducts(buildLineaAstroMedicalAllOfficeProducts())
    }
    const products = await fetchCategoryProducts(source.category)
    return listPreviewProducts(filterByPreviewSource(products, source))
  }

  if (source.kind === 'office-subcategory') {
    if (
      source.category.localeCompare(LINEA_ASTRO_MEDICAL_CATEGORY, 'it', {
        sensitivity: 'base',
      }) === 0
    ) {
      const products = buildLineaAstroMedicalAllOfficeProducts()
      return listPreviewProducts(filterByPreviewSource(products, source))
    }
    const products = await fetchCategoryProducts(source.category)
    return listPreviewProducts(filterByPreviewSource(products, source))
  }

  return []
}

export function megaMenuPreviewQueryKey(source: MegaMenuPreviewSource) {
  return ['mega-menu-preview', 'full', source] as const
}

/** Prefetch anteprima completa al hover sottocategoria. */
export function prefetchMegaMenuPreview(
  queryClient: QueryClient,
  source: MegaMenuPreviewSource,
) {
  if (source.kind === 'none') return Promise.resolve()
  return queryClient.prefetchQuery({
    queryKey: megaMenuPreviewQueryKey(source),
    queryFn: () => fetchMegaMenuPreviewProducts(source),
    staleTime: 60_000,
  })
}
