import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  ChevronDown,
  FileText,
  Folder,
  Loader2,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { OfficeProductCard } from '../components/office/OfficeProductCard'
import {
  OfficeSubcategoryTile,
  OFFICE_SUBCATEGORY_TILE_GRID_CLASS,
} from '../components/office/OfficeSubcategoryTile'
import { useOfficeCatalog } from '../hooks/useOfficeCatalog'
import {
  normalizeOfficeProductCategory,
  officeCategoryFilterFromUrlParam,
  CARTUCCE_TONER_CATEGORY,
  CARTUCCE_TONER_CATEGORY_NORM,
  cartucceTonerCategoryHref,
  matchesCartaSubcategoryFilter,
} from '../lib/officeCategories'
import {
  ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY,
  isArchivioBusteTrasparentiHubExtraProduct,
  matchesArchivioSubcategoryFilter,
  normalizeArchivioSubcategoryLabel,
  OFFICE_CATALOG_DATA_REVISION,
  pickBusteTrasparentiTilePreviewUrl,
} from '../api/officeProductsSupabase'
import { withOfficeImageCacheBust } from '../lib/officeImageCacheBust'
import { productDetailPath } from '../lib/productRoutes'
import type { OfficeProduct } from '../types/officeProduct'
import { buildPileOfficeProducts, PILE_HUB_COVER_IMAGE_URL } from '../data/pileProducts'
import { buildQuaderniOfficeProducts, QUADERNI_HUB_COVER_IMAGE_URL } from '../data/quaderniProducts'
import { buildDistruggidocumentiOfficeProducts } from '../data/distruggidocumentiProducts'
import { mergeLineaAstroMedicalCatalog } from '../data/lineaAstroMedicalCombined'
import {
  LINEA_ASTRO_MEDICAL_CATEGORY,
  LINEA_ASTRO_MEDICAL_CATEGORY_NORM,
} from '../data/iHealthAstroMedicalProducts'
import {
  isGeneralOfficeShopCatalogProduct,
  isOfficeGeneralShopCatalogUrl,
  OFFICE_GENERAL_SHOP_PATH,
} from '../lib/isGeneralOfficeShopCatalogProduct'
import { AstroMedicalSubcategoryNav } from '../components/astroMedical/AstroMedicalSubcategoryNav'
import { matchesAstroMedicalSubcategoryFilter } from '../lib/astroMedicalSubcategories'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  collectOfficeProductFormatOptions,
  matchesOfficeProductFormatFilter,
} from '../lib/officeProductFormat'
import { compareOfficeProductsByPopularity } from '../lib/officeProductPopularity'

type SortBy = 'price-asc' | 'price-desc' | 'bestsellers'
type CancelleriaHubId =
  | 'nastri'
  | 'scrittura'
  | 'cucitrici'
  | 'evidenziatori'
  | 'pile'
  | 'quaderni'

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'price-asc', label: 'Prezzo crescente' },
  { value: 'price-desc', label: 'Prezzo decrescente' },
  { value: 'bestsellers', label: 'Più venduti' },
]

function parseSortByParam(raw: string | null | undefined): SortBy {
  if (raw === 'price-desc') return 'price-desc'
  if (raw === 'bestsellers') return 'bestsellers'
  return 'price-asc'
}

const ARCHIVIO_SUBCATEGORY_ORDER = [
  'Scatole Archivio',
  'Raccoglitori',
  'Scatole Progetto',
  'Cartelle',
  'Cartelle archivio con lacci',
  'Cartelline in carta',
  'Buste Trasparenti',
  'Porta Documenti',
  'Registri',
  'Etichette',
  'Classificatori',
  'Divisori',
  'Faldoni',
  'Altro Archivio',
] as const

const CANCELLERIA_HUB_CARDS: Array<{
  id: CancelleriaHubId
  title: string
  imageUrl: string
}> = [
  {
    id: 'nastri',
    title: 'Nastri adesivi',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/STL6301.jpg',
  },
  {
    id: 'scrittura',
    title: 'Penne, Pennarelli e Matite',
    imageUrl: '/cancelleria-penne.jpg',
  },
  {
    id: 'cucitrici',
    title: 'Cucitrici',
    imageUrl: 'https://zenickstorage.blob.core.windows.net/zenick-images/400_7838027_0cL7poMpSR.avif?v=7838027',
  },
  {
    id: 'evidenziatori',
    title: 'Evidenziatori',
    imageUrl: 'https://m.media-amazon.com/images/I/61ht53VWetL.AC_SX679.jpg',
  },
  {
    id: 'pile',
    title: 'Pile',
    imageUrl: PILE_HUB_COVER_IMAGE_URL,
  },
  {
    id: 'quaderni',
    title: 'Quaderni',
    imageUrl: QUADERNI_HUB_COVER_IMAGE_URL,
  },
]

const VARIANT_COLOR_TOKENS = [
  'nero',
  'nera',
  'blu',
  'azzurro',
  'celeste',
  'rosso',
  'rossa',
  'verde',
  'giallo',
  'gialla',
  'lilla',
  'viola',
  'arancio',
  'arancione',
  'rosa',
  'bianco',
  'bianca',
  'grigio',
  'grigia',
  'marrone',
  'trasparente',
  'assortiti',
  'assortite',
] as const

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

function detectFirstCmFromName(name: string): number | null {
  const n = normNameLite(name)
  const m = n.match(/(\d{1,2})\s*cm\b/)
  if (!m) return null
  const value = Number.parseInt(m[1], 10)
  return Number.isFinite(value) ? value : null
}

function listingFamilySortKey(product: OfficeProduct): string {
  const base = normNameLite(
    (product.parentSku ?? '').trim() || `${product.brand} ${product.name}`,
  )
  const cm = detectFirstCmFromName(product.name)
  const cmPart = cm != null ? String(cm).padStart(2, '0') : '99'
  const variant = normNameLite(
    `${product.colorName ?? ''} ${product.format ?? ''} ${product.producerCode ?? ''}`,
  )
  return `${base}::${cmPart}::${variant}`
}

function withVariantInListingName(product: OfficeProduct): OfficeProduct {
  const name = product.name.trim()
  const n = normNameLite(name)
  const color = (product.colorName ?? '').trim()
  const format = (product.format ?? '').trim()
  const colorMissing = color ? !n.includes(normNameLite(color)) : false
  const formatMissing = format ? !n.includes(normNameLite(format)) : false
  if (!colorMissing && !formatMissing) return product
  const extras = [colorMissing ? color : '', formatMissing ? format : ''].filter(Boolean)
  return { ...product, name: `${name} - ${extras.join(' - ')}` }
}

function isCancelleriaSyntheticListingView(view: CancelleriaHubId | null): boolean {
  return view === 'pile' || view === 'quaderni'
}

function isStaticSyntheticListingView(
  categoryNorm: string,
  cancelleriaView: CancelleriaHubId | null,
): boolean {
  return (
    categoryNorm === 'macchine per ufficio' ||
    categoryNorm === LINEA_ASTRO_MEDICAL_CATEGORY_NORM ||
    (categoryNorm === 'cancelleria' && isCancelleriaSyntheticListingView(cancelleriaView))
  )
}

function isCancelleriaHubId(raw: string): raw is CancelleriaHubId {
  return (
    raw === 'nastri' ||
    raw === 'scrittura' ||
    raw === 'cucitrici' ||
    raw === 'evidenziatori' ||
    raw === 'pile' ||
    raw === 'quaderni'
  )
}

function matchesCancelleriaHubProduct(product: OfficeProduct, hub: CancelleriaHubId): boolean {
  if (hub === 'pile') {
    return product.id.startsWith('AF-PILE-')
  }
  if (hub === 'quaderni') {
    return product.id.startsWith('AF-QUAD-')
  }
  const n = normNameLite(product.name)
  if (hub === 'nastri') return n.includes('nastro')
  if (hub === 'cucitrici') return n.includes('cucitrice')
  if (hub === 'evidenziatori') return n.includes('evidenziatore')
  return (
    n.includes('roller hi') ||
    n.includes('penna a sfera bic cristal') ||
    n.includes('marcatore') ||
    n.includes('pennarello stabilo') ||
    n.includes('matita in grafite noris')
  )
}

function resolveVariantColor(product: OfficeProduct): string {
  const byColumn = (product.colorName ?? '').trim()
  if (byColumn) return normNameLite(byColumn)

  const features = product.mainFeatures ?? {}
  const featureKey = Object.keys(features).find((k) => normNameLite(k).includes('color'))
  const byFeature = featureKey ? String(features[featureKey] ?? '').trim() : ''
  if (byFeature) return normNameLite(byFeature)

  const n = normNameLite(product.name)
  const match = VARIANT_COLOR_TOKENS.find((token) =>
    new RegExp(`(?:^|\\s|-|/)${token}(?:$|\\s|-|/)`).test(n),
  )
  return match ?? ''
}

function baseNameWithoutResolvedColor(name: string, resolvedColor: string): string {
  const n = normNameLite(name)
  if (!resolvedColor) return n
  return n.replace(new RegExp(`\\s*-\\s*${resolvedColor}$`), '').trim()
}

function isLikelyNewerId(nextId: string, prevId: string): boolean {
  const nNum = Number.parseInt(nextId, 10)
  const pNum = Number.parseInt(prevId, 10)
  const hasNumeric = Number.isFinite(nNum) && Number.isFinite(pNum)
  if (hasNumeric) return nNum > pNum
  // Fallback deterministico per id string (uuid/codici): ordine lessicografico decrescente.
  return nextId.localeCompare(prevId, 'it', { sensitivity: 'base' }) > 0
}

/**
 * Mantiene tutte le varianti (colore/formato), ma rimuove i duplicati identici
 * su brand + nome + colore, scegliendo la riga con id più "recente".
 */
function dedupeExactVariantDuplicates(rows: OfficeProduct[]): OfficeProduct[] {
  const byKey = new Map<string, OfficeProduct>()
  for (const p of rows) {
    const resolvedColor = resolveVariantColor(p)
    const key = `${normNameLite(p.brand)}::${baseNameWithoutResolvedColor(p.name, resolvedColor)}::${resolvedColor}`
    const prev = byKey.get(key)
    if (!prev) {
      byKey.set(key, p)
      continue
    }
    if (isLikelyNewerId(String(p.id ?? ''), String(prev.id ?? ''))) {
      byKey.set(key, p)
    }
  }
  return Array.from(byKey.values())
}

const HERO_TIP_ROTATE_MS = 10_000
const HERO_TIP_FADE_MS = 280

function pickRandomProduct(
  pool: readonly OfficeProduct[],
  excludeId?: string,
): OfficeProduct | null {
  if (pool.length === 0) return null
  if (pool.length === 1) return pool[0] ?? null
  let pick = pool[Math.floor(Math.random() * pool.length)]!
  let guard = 0
  while (excludeId && pick.id === excludeId && guard++ < 32) {
    pick = pool[Math.floor(Math.random() * pool.length)]!
  }
  return pick
}

/** Suggerimento prodotto casuale dal catalogo visibile (stessa query della pagina), rotazione ogni 10s. */
function OfficeHeroProductTip({ pool }: { pool: readonly OfficeProduct[] }) {
  const poolRef = useRef(pool)
  poolRef.current = pool

  const poolKey = useMemo(
    () =>
      pool.length ? `${pool.length}:${pool[0]!.id}:${pool[pool.length - 1]!.id}` : '0',
    [pool],
  )

  const [current, setCurrent] = useState<OfficeProduct | null>(null)
  const [opaque, setOpaque] = useState(true)

  useEffect(() => {
    if (pool.length === 0) {
      setCurrent(null)
      return
    }
    setCurrent(pickRandomProduct(pool))
    setOpaque(true)
  }, [poolKey, pool])

  useEffect(() => {
    if (pool.length === 0) return
    const id = window.setInterval(() => {
      setOpaque(false)
      window.setTimeout(() => {
        setCurrent((prev) => pickRandomProduct(poolRef.current, prev?.id))
        setOpaque(true)
      }, HERO_TIP_FADE_MS)
    }, HERO_TIP_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [poolKey, pool.length])

  if (!current) return null

  const thumbUrl = (current.imageUrl ?? '').trim()
  const thumbSrc = thumbUrl
    ? withOfficeImageCacheBust(thumbUrl, OFFICE_CATALOG_DATA_REVISION)
    : ''

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Consigliati per te</p>
      {/* Altezza fissa: evita salti del layout in griglia quando cambia immagine / testo */}
      <div className="mt-2 min-h-[4.75rem]">
        <Link
          to={productDetailPath(current)}
          aria-label={`Ti potrebbe servire: ${current.name}`}
          className={`flex min-h-[4.75rem] items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 pr-3 shadow-sm transition-opacity duration-300 ease-out hover:border-brand-200 hover:bg-brand-50/40 ${
            opaque ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="relative size-[50px] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-brand-50/30 shadow-inner">
            {thumbSrc ? (
              <img
                src={thumbSrc}
                alt=""
                width={50}
                height={50}
                className="size-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-brand-200" aria-hidden>
                <FileText className="size-6" strokeWidth={1.25} />
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1 text-left text-sm leading-snug text-slate-700 sm:text-base">
            <span className="text-slate-600">Ti potrebbe servire: </span>
            <span className="font-semibold text-brand-800 underline decoration-brand-300 underline-offset-2">
              {current.name}
            </span>
          </span>
        </Link>
      </div>
    </div>
  )
}

export function OfficePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const subcategoryFromUrl = searchParams.get('subcategory')
  const cancelleriaViewFromUrl = (searchParams.get('cancelleriaView') ?? '').trim().toLowerCase()
  const searchTerm = searchParams.get('search') ?? searchParams.get('q') ?? ''
  const searchTrim = searchTerm.trim()

  const { useRemote, products, isLoading, isError, error, refetch } =
    useOfficeCatalog(categoryFromUrl, searchTerm)
  const sortBy = parseSortByParam(searchParams.get('sort'))
  const selectedBrands = searchParams.getAll('brand')
  const selectedFormats = searchParams.getAll('format')
  const selectedCategoryNorm = officeCategoryFilterFromUrlParam(categoryFromUrl)
  const selectedSubcategory = useMemo(() => {
    const raw = (subcategoryFromUrl ?? '').trim()
    if (selectedCategoryNorm !== 'archivio') return raw
    return normalizeArchivioSubcategoryLabel('Archivio', raw) ?? raw
  }, [subcategoryFromUrl, selectedCategoryNorm])
  const selectedCancelleriaView: CancelleriaHubId | null = isCancelleriaHubId(cancelleriaViewFromUrl)
    ? cancelleriaViewFromUrl
    : null
  const selectedFeatureTokens = searchParams.getAll('ff')
  const isGeneralShopCatalog =
    selectedCategoryNorm !== LINEA_ASTRO_MEDICAL_CATEGORY_NORM &&
    (isOfficeGeneralShopCatalogUrl(searchParams) || !categoryFromUrl?.trim())

  const catalogProducts = useMemo(() => {
    if (!isGeneralShopCatalog) return products
    return products.filter(isGeneralOfficeShopCatalogProduct)
  }, [products, isGeneralShopCatalog])

  /** Shop generale: URL canonica con `catalog=ufficio` (esclude materiale sanitario). */
  useEffect(() => {
    if (selectedCategoryNorm === LINEA_ASTRO_MEDICAL_CATEGORY_NORM) return
    if (categoryFromUrl?.trim()) return
    if (isOfficeGeneralShopCatalogUrl(searchParams)) return
    const next = new URLSearchParams(searchParams)
    next.set('catalog', 'ufficio')
    setSearchParams(next, { replace: true })
  }, [categoryFromUrl, searchParams, selectedCategoryNorm, setSearchParams])

  /** Cancelleria (Rev 191): nessun filtro per sottocategoria in URL — rimuovi residui `subcategory=`. */
  useEffect(() => {
    if (selectedCategoryNorm !== 'cancelleria') return
    if (!(subcategoryFromUrl ?? '').trim()) return
    const next = new URLSearchParams(searchParams)
    next.delete('subcategory')
    setSearchParams(next, { replace: true })
  }, [selectedCategoryNorm, subcategoryFromUrl, searchParams, setSearchParams])

  /** URL legacy Cancelleria → Cartucce & Toner: reindirizza alla macro-categoria. */
  useEffect(() => {
    const raw = (searchParams.get('cancelleriaView') ?? '').trim().toLowerCase()
    if (raw !== 'cartucce-toner') return
    navigate(cartucceTonerCategoryHref(), { replace: true })
  }, [searchParams, navigate])

  const normalizedProducts = useMemo(
    () =>
      catalogProducts.map((p) => {
        const category = normalizeOfficeProductCategory(p.category)
        return {
          ...withVariantInListingName(p),
          category,
          subcategory: normalizeArchivioSubcategoryLabel(category, p.subcategory),
        }
      }),
    [catalogProducts],
  )

  const productsForListingFilter = useMemo(() => {
    if (selectedCategoryNorm === 'macchine per ufficio') {
      return buildDistruggidocumentiOfficeProducts()
    }
    if (selectedCategoryNorm === 'cancelleria' && selectedCancelleriaView === 'pile') {
      return buildPileOfficeProducts()
    }
    if (selectedCategoryNorm === 'cancelleria' && selectedCancelleriaView === 'quaderni') {
      return buildQuaderniOfficeProducts()
    }
    if (selectedCategoryNorm === LINEA_ASTRO_MEDICAL_CATEGORY_NORM) {
      return mergeLineaAstroMedicalCatalog(normalizedProducts)
    }
    return normalizedProducts
  }, [selectedCategoryNorm, selectedCancelleriaView, normalizedProducts])

  const selectedFeatures = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const token of selectedFeatureTokens) {
      const [key, value] = token.split('::')
      if (!key || !value) continue
      if (!map.has(key)) map.set(key, new Set<string>())
      map.get(key)!.add(value)
    }
    return map
  }, [selectedFeatureTokens])

  const filterOptionProducts = useMemo(() => {
    const activeCategory = selectedCategoryNorm
    return productsForListingFilter.filter((p) => {
      if (activeCategory && p.category.trim().toLowerCase() !== activeCategory) return false
      if (activeCategory === 'archivio' && selectedSubcategory) {
        if (!matchesArchivioSubcategoryFilter(p, selectedSubcategory)) return false
      }
      if (activeCategory === 'carta' && selectedSubcategory) {
        if (!matchesCartaSubcategoryFilter(p, selectedSubcategory)) return false
      }
      if (activeCategory === LINEA_ASTRO_MEDICAL_CATEGORY_NORM && selectedSubcategory) {
        if (!matchesAstroMedicalSubcategoryFilter(p, selectedSubcategory)) return false
      }
      if (activeCategory === 'cancelleria' && selectedCancelleriaView) {
        if (!matchesCancelleriaHubProduct(p, selectedCancelleriaView)) return false
      }
      return true
    })
  }, [
    productsForListingFilter,
    selectedCategoryNorm,
    selectedSubcategory,
    selectedCancelleriaView,
  ])

  const brands = useMemo(
    () =>
      Array.from(
        new Set(filterOptionProducts.map((p) => p.brand).filter((v) => v.trim() !== '')),
      ).sort((a, b) => a.localeCompare(b, 'it')),
    [filterOptionProducts],
  )

  const formats = useMemo(
    () => collectOfficeProductFormatOptions(filterOptionProducts),
    [filterOptionProducts],
  )

  const archivioSubcategories = useMemo(() => {
    if (selectedCategoryNorm !== 'archivio') return []
    const present = new Set(
      normalizedProducts
        .filter((p) => p.category.trim().toLowerCase() === 'archivio')
        .map((p) => (p.subcategory ?? '').trim())
        .filter((v) => v !== ''),
    )
    // Rev 136: sezione pronta anche senza articoli caricati.
    present.add('Cartelline in carta')
    // Rev 165: nuova sottocategoria Archivio sempre selezionabile da dashboard/filtri.
    present.add('Cartelle archivio con lacci')
    if (
      normalizedProducts.some(
        (p) =>
          p.category.trim().toLowerCase() === 'archivio' &&
          matchesArchivioSubcategoryFilter(p, ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY),
      )
    ) {
      present.add(ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY)
    }
    const ordered = ARCHIVIO_SUBCATEGORY_ORDER.filter((s) => present.has(s))
    const extra = Array.from(present)
      .filter((s) => !ordered.includes(s as (typeof ARCHIVIO_SUBCATEGORY_ORDER)[number]))
      .sort((a, b) => a.localeCompare(b, 'it'))
    return [...ordered, ...extra].filter(
      (s) => normalizeArchivioSubcategoryLabel('Archivio', s) === s,
    )
  }, [normalizedProducts, selectedCategoryNorm])

  const archivioSubcategoryPreview = useMemo(() => {
    if (selectedCategoryNorm !== 'archivio') return new Map<string, string>()
    const items = normalizedProducts
      .filter((p) => p.category.trim().toLowerCase() === 'archivio')
      .filter((p) => (p.subcategory ?? '').trim() !== '')
      .sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))

    const map = new Map<string, string>()

    // Copertina "Scatole Archivio": preferisci l'immagine HD richiesta (25630.jpg) se presente,
    // altrimenti una Big Sei Rota blu, altrimenti una Eurobox, altrimenti fallback generico.
    const scatoleArchivio = 'Scatole Archivio'
    const scatoleItems = items.filter((p) => (p.subcategory ?? '').trim() === scatoleArchivio)
    const pickScatolePreview = (): string | null => {
      const withUrl = scatoleItems.filter((p) => (p.imageUrl ?? '').trim() !== '')
      if (!withUrl.length) return null

      const byUrl = (pred: (url: string) => boolean) =>
        withUrl.find((p) => pred((p.imageUrl ?? '').toLowerCase()))?.imageUrl?.trim() ?? null

      const exact25630 =
        byUrl((u) => u.includes('25630.jpg')) ??
        byUrl((u) => u.includes('25630')) ??
        null
      if (exact25630) return exact25630

      const bigBlu = withUrl.find((p) => {
        const n = (p.name ?? '').toLowerCase()
        const u = (p.imageUrl ?? '').toLowerCase()
        return n.includes('big') && n.includes('rota') && (n.includes('blu') || u.includes('blu'))
      })
      if (bigBlu?.imageUrl?.trim()) return bigBlu.imageUrl.trim()

      const bigAny = withUrl.find((p) => {
        const n = (p.name ?? '').toLowerCase()
        return n.includes('big') && n.includes('rota')
      })
      if (bigAny?.imageUrl?.trim()) return bigAny.imageUrl.trim()

      const euro = withUrl.find((p) => (p.name ?? '').toLowerCase().includes('eurobox'))
      if (euro?.imageUrl?.trim()) return euro.imageUrl.trim()

      return withUrl[0]?.imageUrl?.trim() ?? null
    }

    const scatolePreview = pickScatolePreview()
    if (scatolePreview) {
      map.set(
        scatoleArchivio,
        withOfficeImageCacheBust(scatolePreview, OFFICE_CATALOG_DATA_REVISION),
      )
    }

    for (const p of items) {
      const sub = (p.subcategory ?? '').trim()
      if (!sub || map.has(sub)) continue
      const url = (p.imageUrl ?? '').trim()
      if (url) map.set(sub, withOfficeImageCacheBust(url, OFFICE_CATALOG_DATA_REVISION))
    }

    const busteCandidates = items.filter(
      (p) =>
        (p.subcategory ?? '').trim() === ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY ||
        isArchivioBusteTrasparentiHubExtraProduct(p),
    )
    const bustePick = pickBusteTrasparentiTilePreviewUrl(busteCandidates)
    if (bustePick) {
      map.set(
        ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY,
        withOfficeImageCacheBust(bustePick, OFFICE_CATALOG_DATA_REVISION),
      )
    }
    return map
  }, [normalizedProducts, selectedCategoryNorm])

  function updateParams(mutator: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams)
    mutator(next)
    setSearchParams(next)
  }

  function setSort(value: SortBy) {
    updateParams((next) => {
      if (value === 'price-asc') next.delete('sort')
      else next.set('sort', value)
    })
  }

  function toggleMultiParam(paramKey: string, value: string, checked: boolean) {
    updateParams((next) => {
      const current = new Set(next.getAll(paramKey))
      if (checked) current.add(value)
      else current.delete(value)
      next.delete(paramKey)
      Array.from(current)
        .sort((a, b) => a.localeCompare(b, 'it'))
        .forEach((v) => next.append(paramKey, v))
    })
  }

  function setSubcategoryFilter(value: string) {
    updateParams((next) => {
      const v = value.trim()
      if (!v) next.delete('subcategory')
      else next.set('subcategory', v)
    })
  }

  function setCancelleriaView(value: CancelleriaHubId | null) {
    updateParams((next) => {
      if (!value) next.delete('cancelleriaView')
      else next.set('cancelleriaView', value)
    })
  }

  function clearAllFilters() {
    const next = new URLSearchParams()
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const cancelleriaView = searchParams.get('cancelleriaView')
    const search = searchParams.get('search') ?? searchParams.get('q')
    if (category?.trim()) next.set('category', category.trim())
    if (subcategory?.trim()) next.set('subcategory', subcategory.trim())
    if (cancelleriaView?.trim()) next.set('cancelleriaView', cancelleriaView.trim())
    if (search?.trim()) next.set('search', search.trim())
    if (
      !category?.trim() &&
      (isGeneralShopCatalog || selectedCategoryNorm !== LINEA_ASTRO_MEDICAL_CATEGORY_NORM)
    ) {
      next.set('catalog', 'ufficio')
    }
    setSearchParams(next)
  }

  function showAllProducts() {
    navigate(OFFICE_GENERAL_SHOP_PATH)
  }

  const filteredProducts = useMemo(() => {
    const selectedBrandSet = new Set(selectedBrands)
    const activeCategory = selectedCategoryNorm
    const activeSubcategory = selectedSubcategory

    const filtered = productsForListingFilter.filter((p) => {
      if (selectedBrandSet.size > 0 && !selectedBrandSet.has(p.brand)) return false
      if (selectedFormats.length > 0 && !matchesOfficeProductFormatFilter(p, selectedFormats)) {
        return false
      }
      if (activeCategory) {
        if (p.category.trim().toLowerCase() !== activeCategory) return false
      }
      if (activeCategory === 'archivio' && activeSubcategory) {
        if (!matchesArchivioSubcategoryFilter(p, activeSubcategory)) return false
      }
      if (activeCategory === 'carta' && activeSubcategory) {
        if (!matchesCartaSubcategoryFilter(p, activeSubcategory)) return false
      }
      if (activeCategory === LINEA_ASTRO_MEDICAL_CATEGORY_NORM && activeSubcategory) {
        if (!matchesAstroMedicalSubcategoryFilter(p, activeSubcategory)) return false
      }
      if (activeCategory === 'cancelleria' && selectedCancelleriaView) {
        if (!matchesCancelleriaHubProduct(p, selectedCancelleriaView)) return false
      }
      if (
        isStaticSyntheticListingView(activeCategory, selectedCancelleriaView) &&
        searchTrim
      ) {
        const q = normNameLite(searchTrim)
        const hay = normNameLite(`${p.name} ${p.brand}`)
        if (!hay.includes(q)) return false
      }

      for (const [featureKey, values] of selectedFeatures.entries()) {
        const actual = p.mainFeatures?.[featureKey]
        if (!actual || !values.has(actual)) return false
      }

      return true
    })

    const distinct = dedupeExactVariantDuplicates(filtered)

    const sorted = distinct.sort((a, b) => {
      if (sortBy === 'bestsellers') {
        return compareOfficeProductsByPopularity(a, b)
      }
      if (sortBy === 'price-asc' || sortBy === 'price-desc') {
        const aPrice = typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY
        const bPrice = typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY
        if (sortBy === 'price-asc') return aPrice - bPrice
        return bPrice - aPrice
      }
      return listingFamilySortKey(a).localeCompare(listingFamilySortKey(b), 'it')
    })
    return sorted
  }, [
    productsForListingFilter,
    selectedBrands,
    selectedFormats,
    selectedCategoryNorm,
    selectedSubcategory,
    selectedCancelleriaView,
    selectedFeatures,
    sortBy,
    searchTrim,
  ])

  const showArchivioDashboard =
    selectedCategoryNorm === 'archivio' && !selectedSubcategory && !searchTrim
  const showCancelleriaDashboard =
    selectedCategoryNorm === 'cancelleria' && !selectedCancelleriaView && !searchTrim
  const isArchivioCategory = selectedCategoryNorm === 'archivio'
  const isMacchineUfficioCategory = selectedCategoryNorm === 'macchine per ufficio'
  const isCancelleriaCategory = selectedCategoryNorm === 'cancelleria'
  const isCartucceTonerCategory = selectedCategoryNorm === CARTUCCE_TONER_CATEGORY_NORM
  const isLineaAstroMedicalCategory = selectedCategoryNorm === LINEA_ASTRO_MEDICAL_CATEGORY_NORM

  const activeFiltersCount =
    (searchTrim ? 1 : 0) +
    (sortBy !== 'price-asc' ? 1 : 0) +
    selectedBrands.length +
    selectedFormats.length +
    (isLineaAstroMedicalCategory && selectedSubcategory ? 1 : 0)

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div
        className={[
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
          isArchivioCategory ||
          isCancelleriaCategory ||
          isCartucceTonerCategory ||
          isMacchineUfficioCategory ||
          isLineaAstroMedicalCategory
            ? 'py-6 sm:py-8'
            : 'py-16 sm:py-20',
        ].join(' ')}
      >
        {!showArchivioDashboard ? (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Torna alla home
          </Link>
        ) : null}

        {isArchivioCategory && !showArchivioDashboard ? (
          <nav className="mt-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="transition hover:text-brand-800">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  to="/office-products?category=Archivio"
                  className="font-medium text-slate-800 transition hover:text-brand-800"
                >
                  Archivio
                </Link>
              </li>
              {selectedSubcategory ? (
                <>
                  <li aria-hidden>/</li>
                  <li className="font-medium text-slate-800">{selectedSubcategory}</li>
                </>
              ) : null}
            </ol>
          </nav>
        ) : null}

        {categoryFromUrl && !showArchivioDashboard ? (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-brand-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Risultati per:{' '}
              <span className="text-brand-800">{categoryFromUrl}</span>
            </h2>
            <button
              type="button"
              onClick={() =>
                updateParams((next) => {
                  next.delete('category')
                })
              }
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-brand-100"
            >
              Mostra tutti i prodotti
            </button>
            {isCancelleriaCategory && selectedCancelleriaView ? (
              <button
                type="button"
                onClick={() => setCancelleriaView(null)}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                Mostra box Cancelleria
              </button>
            ) : null}
          </div>
        ) : null}

        {showArchivioDashboard ? (
          <header className="mt-2">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Archivio Ufficio
            </h1>
          </header>
        ) : isCancelleriaCategory ? (
          <header className="mt-2">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Cancelleria
            </h1>
          </header>
        ) : isCartucceTonerCategory ? (
          <header className="mt-2">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {CARTUCCE_TONER_CATEGORY}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Cartucce inkjet, toner laser e consumabili originali e compatibili per stampanti e
              multifunzione.
            </p>
          </header>
        ) : isLineaAstroMedicalCategory ? (
          <header className="mt-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">
              Linea specializzata
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {LINEA_ASTRO_MEDICAL_CATEGORY}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Elettromedicali iHealth: prezzi unitari imponibili IVA esclusa; scheda prodotto completa con
              acquisto, note e articoli correlati.
            </p>
          </header>
        ) : (
          <header
            className={`flex flex-col gap-4 border-b border-brand-100 pb-6 sm:flex-row sm:items-start sm:gap-6 ${categoryFromUrl ? 'mt-6' : 'mt-8'}`}
          >
            <span
              className="flex size-16 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/20"
              aria-hidden
            >
              <Briefcase className="size-8" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">
                {isArchivioCategory ? 'Archivio' : 'Catalogo Office'}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
                {isArchivioCategory ? 'Archivio Ufficio' : 'Carta e forniture ufficio'}
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Tutto il necessario per il tuo ufficio: dalla cancelleria di alta qualità ai sistemi di
                archiviazione più efficienti. Scopri la nostra selezione scelta per garantirti il massimo
                della produttività.
              </p>
              {useRemote && normalizedProducts.length > 0 ? (
                <OfficeHeroProductTip pool={normalizedProducts} />
              ) : null}
            </div>
          </header>
        )}

        {isError ? (
          <div
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">Errore caricamento catalogo office</p>
                <p className="mt-1">
                  {error instanceof Error ? error.message : 'Errore sconosciuto'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Riprova
            </button>
          </div>
        ) : null}

        {showArchivioDashboard ? (
          <section className="mt-3">
            <div className={OFFICE_SUBCATEGORY_TILE_GRID_CLASS}>
              {(archivioSubcategories.length ? archivioSubcategories : [...ARCHIVIO_SUBCATEGORY_ORDER]).map(
                (subcat) => (
                  <OfficeSubcategoryTile
                    key={`archivio-subcat-${subcat}`}
                    title={String(subcat)}
                    onClick={() => setSubcategoryFilter(String(subcat))}
                    media={(() => {
                      const preview = archivioSubcategoryPreview.get(String(subcat)) ?? ''
                      if (preview) {
                        return (
                          <div className="aspect-square w-full bg-slate-50">
                            <img
                              src={preview}
                              alt=""
                              className="size-full object-contain p-4"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )
                      }
                      return (
                        <div className="aspect-square w-full bg-gradient-to-br from-slate-50 via-brand-50/50 to-slate-100 p-5">
                          <div className="flex h-full items-center justify-center rounded-2xl border border-white/70 bg-white/70 shadow-inner">
                            <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-800 shadow-sm">
                              <Folder className="size-8" aria-hidden />
                              <span
                                className="pointer-events-none absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-white text-brand-700 shadow"
                                aria-hidden
                              >
                                <Sparkles className="size-4" />
                              </span>
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  />
                ),
              )}
            </div>
          </section>
        ) : null}

        {showCancelleriaDashboard ? (
          <section className="mt-3">
            <div className={OFFICE_SUBCATEGORY_TILE_GRID_CLASS}>
              {CANCELLERIA_HUB_CARDS.map((card) => (
                <OfficeSubcategoryTile
                  key={card.id}
                  title={card.title}
                  onClick={() => setCancelleriaView(card.id)}
                  media={
                    <div className="aspect-square w-full bg-slate-50">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="size-full object-contain p-4"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        ) : null}

        {!showArchivioDashboard && !showCancelleriaDashboard ? (
        <section className="py-12" aria-labelledby="office-catalog-heading">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label className="block max-w-md">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ordinamento
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSort(e.target.value as SortBy)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none ring-brand-500/20 focus:border-brand-400 focus:ring-2"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    Filtra per marca
                    {selectedBrands.length > 0 ? (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
                        {selectedBrands.length}
                      </span>
                    ) : null}
                    <ChevronDown className="size-4 text-slate-500" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-64 w-56 overflow-y-auto">
                  {brands.length ? (
                    brands.map((brand) => {
                      const checked = selectedBrands.includes(brand)
                      return (
                        <DropdownMenuCheckboxItem
                          key={brand}
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleMultiParam('brand', brand, value === true)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {brand}
                        </DropdownMenuCheckboxItem>
                      )
                    })
                  ) : (
                    <p className="px-2 py-1.5 text-sm text-slate-500">Nessuna marca disponibile</p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {!isCartucceTonerCategory ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/50"
                    >
                      Filtra per formato
                      {selectedFormats.length > 0 ? (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
                          {selectedFormats.length}
                        </span>
                      ) : null}
                      <ChevronDown className="size-4 text-slate-500" aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-64 w-56 overflow-y-auto">
                    {formats.length ? (
                      formats.map((format) => {
                        const checked = selectedFormats.includes(format)
                        return (
                          <DropdownMenuCheckboxItem
                            key={format}
                            checked={checked}
                            onCheckedChange={(value) =>
                              toggleMultiParam('format', format, value === true)
                            }
                            onSelect={(event) => event.preventDefault()}
                          >
                            {format}
                          </DropdownMenuCheckboxItem>
                        )
                      })
                    ) : (
                      <p className="px-2 py-1.5 text-sm text-slate-500">
                        Nessun formato disponibile
                      </p>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
              <span className="text-slate-600">Filtri attivi: {activeFiltersCount}</span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
              >
                <RotateCcw className="size-4" aria-hidden />
                Reset filtri
              </button>
            </div>
          </div>

          {isLineaAstroMedicalCategory && !isLoading ? (
            <AstroMedicalSubcategoryNav
              className="mb-6"
              products={productsForListingFilter}
              selectedSubcategory={selectedSubcategory || null}
              onSelect={(value) => setSubcategoryFilter(value ?? '')}
            />
          ) : null}

          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 id="office-catalog-heading" className="text-2xl font-bold text-slate-900">
              Prodotti
            </h2>
            {isLoading && !isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView) ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Loader2 className="size-4 animate-spin text-brand-600" aria-hidden />
                Caricamento...
              </span>
            ) : (
              <span className="text-sm text-muted">
                {filteredProducts.length} articol
                {filteredProducts.length === 1 ? 'o' : 'i'}
                {isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView)
                  ? null
                  : (
                    <>
                      {' '}
                      / {products.length} articol
                      {products.length === 1 ? 'o' : 'i'}
                    </>
                  )}
                {useRemote ? ' (database)' : ''}
              </span>
            )}
          </div>

          <div>
              {isLoading && !isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView) ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li
                      key={i}
                      className="h-80 animate-pulse rounded-2xl bg-brand-100/40"
                      aria-hidden
                    />
                  ))}
                </ul>
              ) : filteredProducts.length === 0 ? (
                products.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-5 py-10 text-center">
                    <p className="text-base font-medium text-slate-800">
                      Nessun prodotto trovato
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Il catalogo e vuoto oppure i dati non sono ancora disponibili.
                    </p>
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="mt-6 inline-flex rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
                    >
                      Riprova caricamento
                    </button>
                  </div>
                ) : searchTrim ? (
                  <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-5 py-10 text-center">
                    <p className="text-base font-medium text-slate-800">
                      Nessun prodotto trovato. Prova con una parola diversa o esplora le categorie
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Ricerca:{' '}
                      <span className="font-semibold text-slate-700">
                        &quot;{searchTrim}&quot;
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={showAllProducts}
                      className="mt-6 inline-flex rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
                    >
                      Mostra tutti i prodotti
                    </button>
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-5 py-8 text-sm text-muted">
                    Nessun prodotto corrisponde ai filtri correnti. Prova a rimuovere alcuni
                    vincoli o resetta i filtri.
                  </p>
                )
              ) : (
                <ul
                  className={
                    isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView)
                      ? 'grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
                  }
                >
                  {filteredProducts.map((p) => (
                    <li
                      key={p.id}
                      className={
                        isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView)
                          ? 'flex h-full min-h-0'
                          : undefined
                      }
                    >
                      {isStaticSyntheticListingView(selectedCategoryNorm, selectedCancelleriaView) ? (
                        <OfficeProductCard
                          product={p}
                          hideCategoryBadge
                          compactGrid
                          suppressQuantityTierHint
                        />
                      ) : (
                        <OfficeProductCard product={p} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </section>
        ) : null}
      </div>
    </main>
  )
}