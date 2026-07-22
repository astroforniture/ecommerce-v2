import type {
  OfficeProduct,
  ProductVariantOption,
  QuantityPriceTier,
} from '../types/officeProduct'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import { escapeIlikePattern } from '../lib/ilike'
import { decodeProductPathParam } from '../lib/productRoutes'
import { normalizeOfficeProductCategory } from '../lib/officeCategories'
import {
  fetchQuantityPriceTiersByProductId,
  normalizeQuantityPriceProductKey,
} from './productQuantityPricesSupabase'
import {
  buildTimbroAziendeFarmacieOfficeProduct,
  getInjectedLocalCatalogProducts,
  timbroMatchesUrlKey,
} from '../lib/timbroAziendeFarmacieProduct'
import { resolveSyntheticOfficeProductByCatalogKey } from '../lib/syntheticOfficeCatalogProducts'
import { searchOfficeProductsClient, setOfficeSearchIndexFromProducts, shouldUseLocalSearchOnly } from '../lib/officeClientSearch'
import { isGeneralOfficeShopCatalogProduct } from '../lib/isGeneralOfficeShopCatalogProduct'
import { isExcludedFromOfficeSearchSuggestions } from '../lib/isOfficeProductAstroMedicalLine'
import {
  officeProductToSearchFields,
  scoreSearchableProduct,
  searchableProductMatchesAllTerms,
} from '../lib/officeSearchRelevance'
import { buildSupabaseIlikePatterns } from '../lib/supabaseSearchPatterns'
import { debugLogVetrinaProdottiNomi } from '../lib/debugShowcaseCatalog'

/**
 * Catalogo lista/vetrina: unisce `public.office_products` (solo colonne base presenti sul DB) e
 * `public.products` (shop). Chiave catalogo: `id` legacy allineato a `sku` shop ove possibile.
 * I listini su `product_quantity_prices` sono opzionali: se la tabella o le colonne mancano, si prosegue senza.
 */

/**
 * Aumenta dopo pulizie massicce su `public.products` (es. titoli): nuove `queryKey` in React Query
 * così il client non riusa dati serializzati vecchi con titoli obsoleti.
 */
export const OFFICE_CATALOG_DATA_REVISION = 226

const SUPPRESSED_PRODUCTS_BY_ID = new Set([
  '55acce14-88cd-4b12-807d-cd2753894639', // Starbox dorso 5 cm arancio (rimozione richiesta)
  '5e783362-fb42-4415-9481-c973388aaafb', // Starbox dorso 5 cm lilla (rimozione richiesta)
])

const SHOP_PRODUCTS_TABLE = 'products' as const

const LEGACY_OFFICE_TABLE = 'office_products' as const
/** Allineato allo schema corrente su Supabase (niente producer_code / main_features / brand). */
const LEGACY_OFFICE_LIST_COLUMNS =
  'id,name,description,price,category,image_url' as const

type OfficeProductsLegacyRow = {
  id: string
  name: string
  description: string | null
  price: number | string | null
  category: string | null
  image_url: string | null
}

/**
 * `public.products`: select allineati allo schema reale su Supabase.
 * Ordine = più completo → minimale: colonne assenti (es. description, category) non devono bloccare il catalogo con 400.
 * Non includere `parent_sku` / `main_features` nel select catalogo finché non sono garantiti nello schema.
 */
const PRODUCT_SHOP_SELECT_FALLBACKS: readonly string[] = [
  'id, name, sku, brand, description, price, category, subcategory, image_url, format, color_name, variants',
  'id, name, sku, brand, description, price, category, subcategory, image_url, format, color_name',
  'id, name, description, price, category, subcategory, image_url, format',
  'id, name, description, price, category, subcategory, image_url',
  'id, name, price, category, subcategory, image_url',
  'id, name, description, price, category, image_url',
  'id, name, price, category, image_url',
  'id, name, image_url',
  'id, name',
]

/** Fetch scheda prodotto: prova prima con `variants` (JSONB misure/colori). */
const PRODUCT_DETAIL_SELECT_FALLBACKS: readonly string[] = [
  'id, name, sku, brand, description, price, category, subcategory, image_url, format, color_name, variants',
  'id, name, sku, brand, description, price, category, subcategory, image_url, format, color_name',
  'id, name, description, price, category, subcategory, image_url, format',
  'id, name, description, price, category, subcategory, image_url',
  'id, name, price, category, subcategory, image_url',
  'id, name, description, price, category, image_url',
  'id, name, price, category, image_url',
  'id, name, image_url',
  'id, name',
]

/** Famiglia `parent_sku`: select minimi; il filtro `.eq('parent_sku')` non impone colonne extra nel select. */
const FAMILY_SELECT_FALLBACKS = PRODUCT_SHOP_SELECT_FALLBACKS

/** Cache in-memory correlati (TTL): integra React Query quando si torna indietro alla pagina. */
const RELATED_MEM_TTL_MS = 10 * 60 * 1000
const RELATED_MEM_MAX_KEYS = 48
const SHOWCASE_MEM_TTL_MS = 5 * 60 * 1000
const relatedProductsMemoryCache = new Map<
  string,
  { fetchedAt: number; data: OfficeProduct[] }
>()
const showcaseMemoryCache = new Map<string, { fetchedAt: number; data: OfficeProduct[] }>()

const STARBOX_BASE_PRICE = 4.15
const STARBOX_QUANTITY_TIERS: QuantityPriceTier[] = [
  { minQuantity: 6, unitPrice: 3.95 },
  { minQuantity: 13, unitPrice: 3.75 },
]
const OXFORD_BASE_PRICE = 6.99
const OXFORD_QUANTITY_TIERS: QuantityPriceTier[] = [
  { minQuantity: 6, unitPrice: 6.55 },
  { minQuantity: 13, unitPrice: 5.99 },
]
const PUNCHED_ENVELOPE_TOP_BASE_PRICE = 5.6
const PUNCHED_ENVELOPE_TOP_QUANTITY_TIERS: QuantityPriceTier[] = [{ minQuantity: 3, unitPrice: 5.09 }]
const PUNCHED_ENVELOPE_MEDIUM_BASE_PRICE = 4.5
const PUNCHED_ENVELOPE_MEDIUM_QUANTITY_TIERS: QuantityPriceTier[] = [{ minQuantity: 3, unitPrice: 4.09 }]
const STARBOX_5CM_IMAGE_BY_COLOR: Record<string, string> = {
  Nero: 'https://odmultimedia.eu/immagini/HD/STL4016.jpg',
  Giallo: 'https://odmultimedia.eu/immagini/HD/STL4007S.jpg',
  Verde: 'https://odmultimedia.eu/immagini/HD/STL4006.jpg',
  Rosso: 'https://odmultimedia.eu/immagini/HD/STL4005S.jpg',
  Blu: 'https://odmultimedia.eu/immagini/HD/STL4004S.jpg',
}
const OXFORD_G84_5CM_IMAGE_BY_COLOR: Record<string, string> = {
  Giallo: 'https://odmultimedia.eu/immagini/LD/63415.jpg',
  Verde: 'https://odmultimedia.eu/immagini/LD/50919.jpg',
  Rosso: 'https://odmultimedia.eu/immagini/LD/50918.jpg',
  Blu: 'https://odmultimedia.eu/immagini/LD/50917.jpg',
}

/** Scatola archivio con maniglia Starline — immagini per dorso (cm) × colore. */
const STARLINE_ARCHIVE_BOX_IMAGE_BY_KEY: Record<string, string> = {
  '16:Rosso': 'https://odmultimedia.eu/immagini/MD/STL5091.jpg',
  '16:Blu': 'https://odmultimedia.eu/immagini/MD/STL5090.jpg',
  '16:Nero': 'https://odmultimedia.eu/immagini/MD/STL5092.jpg',
  '20:Rosso': 'https://odmultimedia.eu/immagini/MD/STL5094.jpg',
  '20:Blu': 'https://odmultimedia.eu/immagini/MD/STL5093.jpg',
  '20:Nero': 'https://odmultimedia.eu/immagini/MD/STL5095.jpg',
}

export function starlineArchiveBoxImageForVariant(thicknessCm: 16 | 20, color: string): string {
  return STARLINE_ARCHIVE_BOX_IMAGE_BY_KEY[`${thicknessCm}:${color.trim()}`] ?? ''
}

/** SKU shop per combinazione dorso × colore (DB aggiornato). */
export const STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT: Record<string, string> = {
  '16:Rosso': 'STL5091',
  '16:Blu': 'STL5090',
  '16:Nero': 'STL5092',
  '20:Rosso': 'STL5094',
  '20:Blu': 'STL5093',
  '20:Nero': 'STL5095',
}

const STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT).map(([variantKey, sku]) => [
    sku.toUpperCase(),
    variantKey,
  ]),
)

const STARLINE_ARCHIVE_BOX_SKUS_LIST = Object.values(STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT)

/** Es. `STL5091` → `16:Rosso` per UI e navigazione. */
export function starlineArchiveVariantKeyFromProducerCode(producerCode: string): string | null {
  const code = producerCode.trim().toUpperCase()
  if (!code) return null
  return STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[code] ?? null
}

/** Colori varianti scatola archivio Starline (ordine UI). */
export const STARLINE_ARCHIVE_BOX_COLOR_LABELS = ['Nero', 'Rosso', 'Blu'] as const
const STARLINE_ARCHIVE_BOX_DORSO_CM = [16, 20] as const
export const STABILO_OHPEN_COLOR_LABELS = ['Rosso', 'Verde', 'Blu', 'Nero'] as const
export const STABILO_OHPEN_TIP_MM = [0.4, 0.7, 1.0] as const
export const EUROBOX_ESSELTE_DORSO_CM = [4, 6, 8, 10, 12, 15] as const
export const EUROBOX_ESSELTE_COLOR_LABELS = ['Rosso', 'Blu', 'Verde', 'Giallo'] as const
export const BIG_SEI_ROTA_DORSO_CM = [12, 16, 20] as const
export const BIG_SEI_ROTA_COLOR_LABELS = ['Blu', 'Rosso'] as const
export const BIG_SEI_ROTA_HD_IMAGE_BY_COLOR: Record<string, string> = {
  Blu: 'https://odmultimedia.eu/immagini/HD/25630.jpg',
  Rosso: 'https://odmultimedia.eu/immagini/HD/25631.jpg',
}
export const SOFT_SEI_ROTA_FORMAT_LABELS = [
  '15x21 cm',
  '18x24 cm',
  '22x30 cm',
  '23x33 cm',
  '25x35 cm',
  '30x42 cm',
] as const
export const TRATTO_VIDEO_HIGHLIGHTER_COLOR_LABELS = [
  'Giallo',
  'Verde',
  'Viola',
  'Azzurro',
  'Fucsia',
  'Lime',
  'Arancio',
] as const
export const BIC_CRISTAL_COLOR_LABELS = ['Nero', 'Blu', 'Rosso', 'Verde'] as const
export const PILOT_V5_COLOR_LABELS = ['Nero', 'Blu', 'Rosso', 'Verde', 'Azzurro', 'Viola'] as const
export const PILOT_HI_TECPOINT_TIP_MM = [0.5, 0.7] as const
export const STAEDTLER_NORIS_GRADE_LABELS = ['2B', 'B', 'HB', 'H', '2H'] as const
export const FERMAGLI_ZINCATI_NUMBER_LABELS = ['n. 1', 'n. 2', 'n. 3', 'n. 4', 'n. 5', 'n. 6'] as const
export const IMBALLO_PRO_TAPE_VARIANT_LABELS = ['Avana (PVC)', 'Trasparente (PP)'] as const

/** Svuota cache in-memory (vetrina home, correlati). Utile dopo aggiornamenti massivi a `products`. */
export function clearOfficeProductsMemoryCaches(): void {
  relatedProductsMemoryCache.clear()
  showcaseMemoryCache.clear()
}

function relatedMemKey(category: string, excludeId: string) {
  return `${OFFICE_CATALOG_DATA_REVISION}::${category}::${excludeId}`
}

function isStarboxRaccoglitoreName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('raccoglitore') && n.includes('starbox')
}

function applyStarboxPricing(product: OfficeProduct): OfficeProduct {
  if (!isStarboxRaccoglitoreName(product.name)) return product
  const thicknessCm = detectStarboxThicknessCm(product.name)
  const color = detectStarboxColorLabel(product.name)
  const overrideImage =
    thicknessCm === 5 && color ? STARBOX_5CM_IMAGE_BY_COLOR[color] : undefined
  return {
    ...product,
    price: STARBOX_BASE_PRICE,
    imageUrl: overrideImage ?? product.imageUrl,
    quantityPriceTiers: STARBOX_QUANTITY_TIERS.map((t) => ({ ...t })),
  }
}

function isOxfordBinderName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return (
    n.includes('registratore') &&
    n.includes('oxford') &&
    (n.includes('g85') || n.includes('g84'))
  )
}

function normalizeOxfordModelNameByThickness(name: string, thicknessCm: number | null): string {
  const raw = String(name ?? '')
  if (thicknessCm === 5) return raw.replace(/\bG85\b/gi, 'G84')
  if (thicknessCm === 8) return raw.replace(/\bG84\b/gi, 'G85')
  return raw
}

function applyOxfordPricing(product: OfficeProduct): OfficeProduct {
  if (!isOxfordBinderName(product.name)) return product
  const thicknessCm = detectStarboxThicknessCm(product.name)
  const color = detectStarboxColorLabel(product.name)
  const overrideImage =
    thicknessCm === 5 && color ? OXFORD_G84_5CM_IMAGE_BY_COLOR[color] : undefined
  return {
    ...product,
    name: normalizeOxfordModelNameByThickness(product.name, thicknessCm),
    price: OXFORD_BASE_PRICE,
    imageUrl: overrideImage ?? product.imageUrl,
    quantityPriceTiers: OXFORD_QUANTITY_TIERS.map((t) => ({ ...t })),
  }
}

function isStarlinePunchedEnvelopeName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('buste') && n.includes('forate') && n.includes('starline')
}

function detectStarlinePunchedEnvelopeThickness(name: string): 'medio' | 'pesante' | null {
  const n = String(name ?? '').toLowerCase()
  if (/\btop\b/.test(n)) return 'pesante'
  if (/\bmedium\b/.test(n)) return 'medio'
  return null
}

function applyStarlinePunchedEnvelopePricing(product: OfficeProduct): OfficeProduct {
  if (!isStarlinePunchedEnvelopeName(product.name)) return product
  const thickness = detectStarlinePunchedEnvelopeThickness(product.name)
  if (thickness === 'pesante') {
    return {
      ...product,
      price: PUNCHED_ENVELOPE_TOP_BASE_PRICE,
      quantityPriceTiers: PUNCHED_ENVELOPE_TOP_QUANTITY_TIERS.map((t) => ({ ...t })),
    }
  }
  if (thickness === 'medio') {
    return {
      ...product,
      price: PUNCHED_ENVELOPE_MEDIUM_BASE_PRICE,
      quantityPriceTiers: PUNCHED_ENVELOPE_MEDIUM_QUANTITY_TIERS.map((t) => ({ ...t })),
    }
  }
  return product
}

function isAlteaT3042SeiRotaName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return (
    n.includes('buste') &&
    n.includes('forate') &&
    n.includes('altea') &&
    n.includes('30') &&
    n.includes('42') &&
    n.includes('rota')
  )
}

function applyAlteaT3042SeiRotaPricing(product: OfficeProduct): OfficeProduct {
  if (!isAlteaT3042SeiRotaName(product.name)) return product
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    subcategory: normalizeArchivioSubcategoryLabel('Archivio', product.subcategory),
    price: 8.5,
    quantityPriceTiers: [],
  }
}

function isStarlineArchiveBoxName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  /** Schede «Scatola archivio …» (con o senza Starline/maniglia nel titolo). */
  return n.includes('scatola') && n.includes('archivio')
}

/** Scheda catalogo scatole archivio Starline: titolo tipico oppure SKU STL5090–5095 (su `producerCode` o `id`). */
export function isStarlineArchiveBoxCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'producerCode' | 'id'>,
): boolean {
  if (isStarlineArchiveBoxName(product.name)) return true
  for (const raw of [product.producerCode, product.id]) {
    const code = String(raw ?? '').trim().toUpperCase()
    if (code.length > 0 && STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[code]) return true
  }
  return false
}

function applyStarlineArchiveBoxCatalog(product: OfficeProduct): OfficeProduct {
  const sku = (product.producerCode ?? '').trim().toUpperCase()
  const keyFromSku = sku ? STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[sku] : ''
  if (keyFromSku) {
    const imgOverride = STARLINE_ARCHIVE_BOX_IMAGE_BY_KEY[keyFromSku]
    return {
      ...product,
      category: normalizeOfficeProductCategory('Archivio'),
      imageUrl: (imgOverride ?? product.imageUrl).trim(),
    }
  }
  if (!isStarlineArchiveBoxName(product.name)) return product
  const cm = detectStarboxThicknessCm(product.name)
  const color = detectStarboxColorLabel(product.name)
  const key =
    cm != null &&
    color &&
    (STARLINE_ARCHIVE_BOX_COLOR_LABELS as readonly string[]).includes(color)
      ? `${cm}:${color}`
      : ''
  const imgOverride = key ? STARLINE_ARCHIVE_BOX_IMAGE_BY_KEY[key] : undefined
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    imageUrl: (imgOverride ?? product.imageUrl).trim(),
  }
}

function isStabiloOhpenName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('stabilo') && (n.includes('ohpen') || n.includes('oh pen'))
}

export function isStabiloOhpenCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  if (!isStabiloOhpenName(n) && !(b.includes('stabilo') && (n.includes('ohpen') || n.includes('oh pen')))) {
    return false
  }
  const color = detectStarboxColorLabel(product.name)
  return Boolean(
    color && (STABILO_OHPEN_COLOR_LABELS as readonly string[]).includes(color),
  )
}

function applyStabiloOhpenCatalog(product: OfficeProduct): OfficeProduct {
  if (!isStabiloOhpenCatalogProduct(product)) return product
  const color = detectStarboxColorLabel(product.name)
  const mappedColor = color && (STABILO_OHPEN_COLOR_LABELS as readonly string[]).includes(color) ? color : ''
  return {
    ...product,
    brand: (product.brand ?? '').trim() || 'Stabilo',
    colorName: mappedColor || product.colorName,
    category: normalizeOfficeProductCategory('Cancelleria'),
  }
}

function isTrattoVideoHighlighterName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return (
    (n.includes('tratto') && n.includes('video')) &&
    (n.includes('evidenzi') || n.includes('highlighter'))
  )
}

function isBicCristal50Name(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  const isBic = n.includes('bic')
  const isCristal = n.includes('cristal')
  const isPen =
    n.includes('penna') ||
    n.includes('penne') ||
    n.includes('sfera') ||
    n.includes('a sfera') ||
    n.includes('a-sfera')
  // Attivazione varianti: basta “Penna a sfera Bic Cristal” (anche se non contiene “50/conf”).
  const isAnchorPhrase = n.includes('penna') && n.includes('bic') && n.includes('cristal') && n.includes('sfera')
  return (isBic && isCristal && isPen) || isAnchorPhrase
}

function isPilotV5Name(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  const isPilot = n.includes('pilot')
  const isV5 = n.includes('v5') || /\bv[\s-]*5\b/.test(n)
  const isPen = n.includes('penna') || n.includes('penne') || n.includes('roller')
  return isPilot && isV5 && isPen
}

function isPilotV7Name(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  const isPilot = n.includes('pilot')
  const isV7 = n.includes('v7') || /\bv[\s-]*7\b/.test(n)
  const isPen = n.includes('penna') || n.includes('penne') || n.includes('roller')
  return isPilot && isV7 && isPen
}

function isStaedtlerNorisName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('staedtler') && n.includes('noris') && (n.includes('matita') || n.includes('matite') || n.includes('pencil'))
}

function normalizeStaedtlerNorisBaseName(name: string): string {
  let out = String(name ?? '').toUpperCase()
  for (const grade of STAEDTLER_NORIS_GRADE_LABELS) {
    out = out.replace(new RegExp(`\\b${grade}\\b`, 'g'), ' ')
  }
  return out
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function detectStaedtlerNorisGradeLabel(name: string): '2B' | 'B' | 'HB' | 'H' | '2H' | null {
  const n = String(name ?? '').toUpperCase()
  if (/\b2H\b/.test(n)) return '2H'
  if (/\bHB\b/.test(n)) return 'HB'
  if (/\b2B\b/.test(n)) return '2B'
  if (/\bH\b/.test(n)) return 'H'
  if (/\bB\b/.test(n)) return 'B'
  return null
}

function isZenithPointsName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('zenith') && (n.includes('punti') || n.includes('point') || n.includes('points'))
}

function isFermagliZincatiName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('fermagli') && n.includes('zincat')
}

function isImballoProTapeName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  const isTape = n.includes('nastro') && n.includes('adesiv')
  if (!isTape) return false
  const isPvcAvana = n.includes('pvc') && n.includes('avana')
  const isPpTransparent = (n.includes('pp36nn') || n.includes('pp')) && n.includes('trasparent')
  const isSize = n.includes('5 cm') && n.includes('66 m')
  return isSize && (isPvcAvana || isPpTransparent)
}

export function detectImballoProTapeVariantLabel(name: string): 'Avana (PVC)' | 'Trasparente (PP)' | null {
  const n = String(name ?? '').toLowerCase()
  if (n.includes('pvc') && n.includes('avana')) return 'Avana (PVC)'
  if (n.includes('pp36nn') || (n.includes('pp') && n.includes('trasparent'))) return 'Trasparente (PP)'
  return null
}

export function detectFermagliZincatiNumberLabel(name: string): 'n. 1' | 'n. 2' | 'n. 3' | 'n. 4' | 'n. 5' | 'n. 6' | null {
  const n = String(name ?? '').toLowerCase()
  const m = n.match(/\bn\.?\s*([1-6])\b/)
  if (!m) return null
  return `n. ${m[1]}` as 'n. 1' | 'n. 2' | 'n. 3' | 'n. 4' | 'n. 5' | 'n. 6'
}

export function detectPilotHiTecpointTipMm(name: string): 0.5 | 0.7 | null {
  const n = String(name ?? '').toLowerCase().replace(',', '.')
  if (n.includes('v5') || /\bv[\s-]*5\b/.test(n)) return 0.5
  if (n.includes('v7') || /\bv[\s-]*7\b/.test(n)) return 0.7
  const mm = n.match(/\b0\.[57]\s*mm\b/)
  if (!mm) return null
  return mm[0].includes('0.5') ? 0.5 : 0.7
}

function normalizePilotV5BaseName(name: string): string {
  let out = String(name ?? '').toLowerCase()
  for (const color of PILOT_V5_COLOR_LABELS) {
    out = out.replace(new RegExp(`\\b${color.toLowerCase()}\\b`, 'gi'), ' ')
  }
  return out
    .replace(/[()]/g, ' ')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isBicCristal50CatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isBicCristal50Name(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return (
    n.includes('cristal') &&
    (n.includes('penna') || n.includes('sfera') || n.includes('a sfera')) &&
    (b.includes('bic') || n.includes('bic'))
  )
}

export function isPilotHiTecpointCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isPilotV5Name(product.name) || isPilotV7Name(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('pilot') && (n.includes('v5') || /\bv[\s-]*5\b/.test(n) || n.includes('v7') || /\bv[\s-]*7\b/.test(n))
}

export function isStaedtlerNorisCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isStaedtlerNorisName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('staedtler') && n.includes('noris')
}

export function isZenithPointsCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isZenithPointsName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('zenith') && (n.includes('punti') || n.includes('point'))
}

export function isFermagliZincatiCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isFermagliZincatiName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('leone') && n.includes('fermagli')
}

export function isImballoProTapeCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isImballoProTapeName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const isSize = n.includes('5 cm') && n.includes('66 m')
  if (!isSize || !n.includes('nastro')) return false
  if (b.includes('comet') && n.includes('pvc') && n.includes('avana')) return true
  if (b.includes('eurocel') && (n.includes('pp36nn') || n.includes('trasparent'))) return true
  return false
}

export function isEuroCartLacciCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand' | 'subcategory'>,
): boolean {
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const sub = String(product.subcategory ?? '').trim().toLowerCase()
  const isLacciName = n.includes('cartell') && n.includes('lacci')
  const euroCartBrand =
    b.includes('euro-cart') || b.includes('eurocart') || b.includes('euro cart')
  const subNormalized = normalizeArchivioSubcategoryLabel('Archivio', sub) ?? sub
  return (
    euroCartBrand &&
    (subNormalized.toLowerCase() === ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY.toLowerCase() || isLacciName)
  )
}

export function isPilotV5CatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  return isPilotHiTecpointCatalogProduct(product)
}

function isPentelMarkerName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  const isMarker = n.includes('marcat') || n.includes('marker')
  return n.includes('pentel') && isMarker
}

export function isPentelMarkerCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isPentelMarkerName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return (b.includes('pentel') || n.includes('pentel')) && (n.includes('marcat') || n.includes('marker'))
}

/** Ordine pulsanti colore in scheda prodotto Pentel N50 (Rev 197). */
export const PENTEL_MARKER_COLOR_LABELS = [
  'Nero',
  'Rosso',
  'Blu',
  'Verde',
  'Marrone',
  'Arancio',
  'Giallo',
  'Viola',
  'Azzurro',
  'Lime',
  'Bianco',
  'Fucsia',
  'Lilla',
] as const

export function pentelMarkerBaseTitleFromName(name: string): string {
  const raw = String(name ?? '')
  const color = detectStarboxColorLabel(raw)
  let out = color ? raw.replace(new RegExp(`\\b${color}\\b`, 'gi'), '') : raw
  return out
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim() || raw.trim()
}

/** Chiave famiglia modello (stesso titolo base senza colore): Pentel N50 vs N60, ecc. */
export function pentelMarkerFamilyKey(product: Pick<OfficeProduct, 'name'>): string {
  return pentelMarkerBaseTitleFromName(String(product.name ?? ''))
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function extractPentelModelToken(name: string): string | null {
  const m = String(name ?? '').match(/\bN[°.\s]*(\d{1,3})\b/i)
  return m ? `N${m[1]}` : null
}

function applyPentelMarkerCatalog(product: OfficeProduct): OfficeProduct {
  if (!isPentelMarkerCatalogProduct(product)) return product
  const base = pentelMarkerBaseTitleFromName(product.name)
  return {
    ...product,
    name: base || product.name,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: (product.subcategory ?? '').trim() || 'Scrittura',
    price: 1.8,
    quantityPriceTiers: [],
  }
}

function applyBicCristal50Catalog(product: OfficeProduct): OfficeProduct {
  if (!isBicCristal50CatalogProduct(product)) return product
  const color = detectStarboxColorLabel(product.name)
  const baseNameRaw = color
    ? String(product.name).replace(new RegExp(`\\b${color}\\b`, 'i'), '')
    : product.name
  const baseName = String(baseNameRaw)
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\bconf\.?\b/gi, 'conf.')
    .replace(/\b50\s*(pz|pezzi)?\b/gi, '50 pezzi')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim()

  const baseDescription = String(product.description ?? '').trim()
  const packHint =
    baseDescription.toLowerCase().includes('50') && baseDescription.toLowerCase().includes('pez')
      ? baseDescription
      : [
          baseDescription,
          'Prezzo riferito alla confezione da 50 pezzi.',
        ]
          .filter(Boolean)
          .join(baseDescription ? '\n\n' : '')

  return {
    ...product,
    name: baseName || product.name,
    description: packHint || product.description,
    category: normalizeOfficeProductCategory('Cancelleria'),
    // Prezzo coerente su tutte le varianti colore (pack 50 pz)
    price: 12.5,
    quantityPriceTiers: [],
  }
}

function applyPilotHiTecpointCatalog(product: OfficeProduct): OfficeProduct {
  if (!isPilotHiTecpointCatalogProduct(product)) return product
  const color = detectStarboxColorLabel(product.name)
  const tipMm = detectPilotHiTecpointTipMm(product.name)
  let name = String(product.name ?? '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim()
  if (color) {
    const lower = name.toLowerCase()
    if (!lower.includes(color.toLowerCase())) name = `${name} - ${color}`
  }
  if (tipMm != null && !name.toLowerCase().includes(`punta ${String(tipMm).replace('.', ',')}`)) {
    name = `${name} - punta ${String(tipMm).replace('.', ',')} mm`
  }
  return {
    ...product,
    name: name || product.name,
    colorName: color || product.colorName,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: 'Scrittura',
    price: 2.5,
    quantityPriceTiers: [],
  }
}

function applyStaedtlerNorisCatalog(product: OfficeProduct): OfficeProduct {
  if (!isStaedtlerNorisCatalogProduct(product)) return product
  const grade = detectStaedtlerNorisGradeLabel(product.name)
  let name = String(product.name ?? '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim()
  if (grade && !name.toUpperCase().includes(grade)) name = `${name} - ${grade}`
  return {
    ...product,
    name: name || product.name,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: 'Scrittura',
    price: 4.5,
    quantityPriceTiers: [],
  }
}

function applyZenithPointsCatalog(product: OfficeProduct): OfficeProduct {
  if (!isZenithPointsCatalogProduct(product)) return product
  return {
    ...product,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: 'Accessori Scrivania',
    price: 0.8,
    quantityPriceTiers: [],
  }
}

function applyFermagliZincatiCatalog(product: OfficeProduct): OfficeProduct {
  if (!isFermagliZincatiCatalogProduct(product)) return product
  const number = detectFermagliZincatiNumberLabel(product.name)
  let name = String(product.name ?? '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim()
  if (number && !name.toLowerCase().includes(number)) name = `${name} - ${number}`
  return {
    ...product,
    name: name || product.name,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: 'Accessori Scrivania',
    price: 0.6,
    quantityPriceTiers: [],
  }
}

function applyImballoProTapeCatalog(product: OfficeProduct): OfficeProduct {
  if (!isImballoProTapeCatalogProduct(product)) return product
  const label = detectImballoProTapeVariantLabel(product.name)
  return {
    ...product,
    name: (product.name ?? '').trim(),
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: 'Imballaggio',
    colorName: label || product.colorName,
    quantityPriceTiers: [],
  }
}

function applyEuroCartLacciCatalog(product: OfficeProduct): OfficeProduct {
  if (!isEuroCartLacciCatalogProduct(product)) return product
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    subcategory: ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY,
    price: 2.8,
    quantityPriceTiers: [],
  }
}

export function isTrattoVideoHighlighterCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isTrattoVideoHighlighterName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('tratto') && b.includes('video') && (n.includes('evidenzi') || n.includes('highlighter'))
}

function applyTrattoVideoHighlighterCatalog(product: OfficeProduct): OfficeProduct {
  if (!isTrattoVideoHighlighterCatalogProduct(product)) return product
  const rawColor = detectStarboxColorLabel(product.name)
  const color = rawColor === 'Lilla' ? 'Viola' : rawColor
  // Mantieni il titolo completo (con colore) per coerenza in ricerca.
  // La versione “raggruppata” (senza colore) viene gestita in `mergeCatalogLists` quando non c’è ricerca attiva.
  let name = String(product.name ?? '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*-\s*/g, '')
    .replace(/\s*-\s*$/g, '')
    .trim()
  // Se il DB ha lasciato il titolo senza colore (es. "Evidenziatore Tratto Video -"),
  // completa usando il colore rilevato dal nome (o da `colorName` se già disponibile).
  if (name.endsWith('-')) {
    name = name.replace(/\s*-\s*$/g, '').trim()
  }
  const effectiveColor = (color || product.colorName || '').trim()
  if (effectiveColor) {
    const lower = name.toLowerCase()
    const colLower = effectiveColor.toLowerCase()
    const hasColorInTitle =
      lower.includes(`- ${colLower}`) || lower.endsWith(colLower) || lower.includes(colLower)
    if (!hasColorInTitle && !name.endsWith('-')) {
      name = `${name} - ${effectiveColor}`
    }
  }
  return {
    ...product,
    name: name || product.name,
    colorName: color || product.colorName,
    category: normalizeOfficeProductCategory('Cancelleria'),
    price: 0.9,
    quantityPriceTiers: [],
  }
}

function detectStabiloOhpenTipMm(name: string): number | null {
  const n = String(name ?? '').toLowerCase().replace(',', '.')
  const m = n.match(/\b(0\.[47]|1\.0)\s*mm\b/)
  if (!m) return null
  const value = Number.parseFloat(m[1])
  return Number.isFinite(value) ? value : null
}

function isEuroboxEsselteName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return (
    n.includes('scatola') &&
    n.includes('progetto') &&
    n.includes('eurobox')
  )
}

export function isEuroboxEsselteCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isEuroboxEsselteName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return n.includes('eurobox') && (b.includes('esselte') || b.includes('eurobox'))
}

function applyEuroboxEsselteCatalog(product: OfficeProduct): OfficeProduct {
  if (!isEuroboxEsselteCatalogProduct(product)) return product
  const thicknessCm = detectStarboxThicknessCm(product.name)
  const currentPrice = typeof product.price === 'number' ? product.price : null
  let normalizedPrice = currentPrice
  // Guardrail post-reset: evita residui prezzo vecchio (es. 3,90) sulle Eurobox.
  if (thicknessCm != null && Number.isFinite(thicknessCm)) {
    if (thicknessCm >= 4 && thicknessCm <= 10) normalizedPrice = 6.2
    else if (thicknessCm >= 12 && thicknessCm <= 15) normalizedPrice = 6.7
  }
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    price: normalizedPrice ?? product.price,
  }
}

function isBigSeiRotaName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return n.includes('scatol') && n.includes('archivio') && n.includes('big') && n.includes('rota')
}

function isSoftSeiRotaName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  if (n.startsWith('buste a sacco soft')) return true
  if (n.includes('buste a sacco soft')) return true
  return (
    n.includes('buste') &&
    n.includes('sacco') &&
    n.includes('soft') &&
    n.includes('sei') &&
    n.includes('rota')
  )
}

function normalizeStarlineThreeFlapsName(rawName: string): string {
  const raw = String(rawName ?? '').trim()
  const n = raw.toLowerCase()
  if (!n.includes('cartellin') || !/\b3\s*lembi\b/.test(n)) return raw
  // Rev 144: DB titles no longer include "elastico".
  return raw
    .replace(/\s*[-–—]?\s*elastico\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .trim()
}

export function isBigSeiRotaCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isBigSeiRotaName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return (
    (n.includes('big') && n.includes('rota') && (b.includes('big') || b.includes('rota'))) ||
    (b.includes('sei rota') && n.includes('scatol') && n.includes('archivio'))
  )
}

export function isSoftSeiRotaCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isSoftSeiRotaName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  if (n.startsWith('buste a sacco soft')) return true
  if (n.includes('buste a sacco soft')) return true
  return (
    (n.includes('buste') && n.includes('sacco') && n.includes('soft') && n.includes('rota')) ||
    (b.includes('sei rota') && n.includes('buste') && n.includes('sacco') && n.includes('soft'))
  )
}

export function detectSoftSeiRotaFormatLabel(name: string): string | null {
  const n = String(name ?? '').toLowerCase()
  const m = n.match(/(\d{2})\s*[x×]\s*(\d{2})/)
  if (!m) return null
  const label = `${m[1]}x${m[2]} cm`
  return (SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).includes(label) ? label : null
}

function normalizeBigSeiRotaImageUrl(rawUrl: string, color: string | null): string {
  const c = (color ?? '').trim()
  const mapped = c ? BIG_SEI_ROTA_HD_IMAGE_BY_COLOR[c] : ''
  if (mapped) return mapped

  let url = String(rawUrl ?? '').trim()
  if (!url) return ''

  // Se il DB ha ancora path "MD", prova a salire a "HD" (stesso filename).
  url = url.replace(/\/immagini\/md\//i, '/immagini/HD/')

  // Se conosciamo colore Blu/Rosso, preferisci i filename HD noti (25630/25631).
  const cl = c.toLowerCase()
  if (cl.includes('blu')) {
    url = url.replace(/25631\.jpg/i, '25630.jpg')
    if (!/25630\.jpg/i.test(url) && /odmultimedia\.eu\/immagini\//i.test(url)) {
      url = 'https://odmultimedia.eu/immagini/HD/25630.jpg'
    }
  } else if (cl.includes('rosso')) {
    url = url.replace(/25630\.jpg/i, '25631.jpg')
    if (!/25631\.jpg/i.test(url) && /odmultimedia\.eu\/immagini\//i.test(url)) {
      url = 'https://odmultimedia.eu/immagini/HD/25631.jpg'
    }
  }

  return url
}

export function bigSeiRotaPriceForThicknessCm(thicknessCm: number | null): number | undefined {
  if (thicknessCm === 12) return 18.5
  if (thicknessCm === 16) return 19.5
  if (thicknessCm === 20) return 20.5
  return undefined
}

export function softSeiRotaPriceForFormat(formatLabel: string | null): number | undefined {
  if (formatLabel === '15x21 cm') return 3.5
  if (formatLabel === '18x24 cm') return 4.0
  if (formatLabel === '22x30 cm') return 4.2
  if (formatLabel === '23x33 cm') return 4.9
  if (formatLabel === '25x35 cm') return 5.9
  if (formatLabel === '30x42 cm') return 4.5
  return undefined
}

function applyBigSeiRotaCatalog(product: OfficeProduct): OfficeProduct {
  if (!isBigSeiRotaCatalogProduct(product)) return product
  const color = detectStarboxColorLabel(product.name)
  const thicknessCm = detectStarboxThicknessCm(product.name)
  const nextImage = normalizeBigSeiRotaImageUrl(product.imageUrl, color)
  const nextPrice = bigSeiRotaPriceForThicknessCm(thicknessCm) ?? product.price
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    imageUrl: nextImage || product.imageUrl,
    colorName: color || product.colorName,
    price: nextPrice,
    quantityPriceTiers: [],
  }
}

function applySoftSeiRotaCatalog(product: OfficeProduct): OfficeProduct {
  if (!isSoftSeiRotaCatalogProduct(product)) return product
  const formatLabel = detectSoftSeiRotaFormatLabel(product.name)
  const nextPrice = softSeiRotaPriceForFormat(formatLabel) ?? product.price
  return {
    ...product,
    category: normalizeOfficeProductCategory('Archivio'),
    subcategory: normalizeArchivioSubcategoryLabel('Archivio', product.subcategory),
    price: nextPrice,
    quantityPriceTiers: [],
  }
}

/** Formati buste Mailpack Blasetti (Rev 188): allineati a DB `format` o al titolo. */
export const BLASETTI_MAILPACK_FORMAT_LABELS = [
  '16x23',
  '19x26',
  '23x33',
  '25x35',
  '30x40',
] as const

/**
 * Chiave “linea” Mailpack (stesso articolo, misure diverse): usa `name` + `format` e toglie le misure note.
 * Così non si mischiano famiglie diverse recuperate dalla stessa query ilike.
 */
export function blasettiMailpackLineKey(product: Pick<OfficeProduct, 'name' | 'format'>): string {
  let n = `${String(product.name ?? '')} ${String(product.format ?? '')}`.toLowerCase()
  const orderedFormats = [...BLASETTI_MAILPACK_FORMAT_LABELS].sort((a, b) => b.length - a.length)
  for (const fmt of orderedFormats) {
    const escaped = fmt.replace(/x/g, '\\s*x\\s*')
    n = n.replace(new RegExp(escaped, 'gi'), ' ')
  }
  n = n.replace(/\d{2}\s*[x×]\s*\d{2}(?:\s*[.,]\s*\d)?/gi, ' ')
  return n.replace(/\s+/g, ' ').trim()
}

export type BlasettiMailpackFormatKey = (typeof BLASETTI_MAILPACK_FORMAT_LABELS)[number]

/** Listino unitario (EUR imponibile) per formato — Rev 192. */
export const BLASETTI_MAILPACK_FORMAT_FIXED_PRICES: Record<BlasettiMailpackFormatKey, number> = {
  '16x23': 4.5,
  '19x26': 5.2,
  '23x33': 6.8,
  '25x35': 7.5,
  '30x40': 9.9,
}

/** Etichetta UI «16 x 23 cm» … «25 x 35,3 cm» (Rev 192). */
export function blasettiMailpackFormatDisplayCm(formatLabel: string): string {
  const k = formatLabel.trim().replace(/\s/g, '').toLowerCase()
  const map: Record<BlasettiMailpackFormatKey, string> = {
    '16x23': '16 x 23 cm',
    '19x26': '19 x 26 cm',
    '23x33': '23 x 33 cm',
    '25x35': '25 x 35,3 cm',
    '30x40': '30 x 40 cm',
  }
  if ((BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(k))
    return map[k as BlasettiMailpackFormatKey]
  return formatLabel
}

export function blasettiMailpackFixedPriceForFormat(
  formatLabel: string | null | undefined,
): number | null {
  const k = (formatLabel ?? '').trim().replace(/\s/g, '').toLowerCase()
  if (!(BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(k)) return null
  return BLASETTI_MAILPACK_FORMAT_FIXED_PRICES[k as BlasettiMailpackFormatKey]
}

function parseBlasettiMailpackFormatKeyFromToken(token: string): string | null {
  const t = token
    .trim()
    .replace(/\s/g, '')
    .replace(/×/gi, 'x')
    .replace(/,/g, '.')
    .toLowerCase()
  if (!t) return null
  const labels = BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]
  const mDec = t.match(/^(\d{2})x(\d{2})\.(\d)$/)
  if (mDec && mDec[1] === '25' && mDec[2] === '35' && mDec[3] === '3') return '25x35'
  const m = t.match(/^(\d{2})x(\d{2})$/)
  if (!m) return null
  const key = `${m[1]}x${m[2]}`
  return labels.includes(key) ? key : null
}

export function isBlasettiMailpackCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const mail = n.includes('mailpack')
  const blas = n.includes('blasetti') || b.includes('blasetti')
  return mail && blas
}

export function detectBlasettiMailpackFormatLabel(
  product: Pick<OfficeProduct, 'name' | 'format'>,
): string | null {
  const rawFmt = String(product.format ?? '')
  const fromCol = parseBlasettiMailpackFormatKeyFromToken(rawFmt)
  if (fromCol) return fromCol

  const n = String(product.name ?? '')
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/×/gi, 'x')
    .replace(/,/g, '.')
  const mDec = n.match(/(\d{2})x(\d{2})\.(\d)/)
  if (mDec && mDec[1] === '25' && mDec[2] === '35' && mDec[3] === '3') return '25x35'
  const m = n.match(/(\d{2})x(\d{2})(?![.\d])/i)
  if (m) {
    const key = `${m[1]}x${m[2]}`
    if ((BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(key)) return key
  }
  return null
}

function applyBlasettiMailpackCatalog(product: OfficeProduct): OfficeProduct {
  if (!isBlasettiMailpackCatalogProduct(product)) return product
  const sub = (product.subcategory ?? '').trim()
  return {
    ...product,
    category: normalizeOfficeProductCategory('Cancelleria'),
    subcategory: sub || 'Buste',
    quantityPriceTiers: product.quantityPriceTiers?.length ? product.quantityPriceTiers : [],
  }
}

type ShopProductRow = {
  id: string
  sku: string | null
  name: string
  price: number | string | null
  image_url: string | null
}

/** Riga DB: campi opzionali se presenti in tabella (retrocompatibilità). */
type OfficeProductRow = ShopProductRow & {
  parent_sku?: string | null
  /** Alcuni DB usano `color` invece di `color_name`. */
  color?: string | null
  color_name?: string | null
  brand?: string | null
  category?: string | null
  subcategory?: string | null
  description?: string | null
  format?: string | null
  variants?: unknown
  main_features?: unknown
}

function jsonbToMainFeatures(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = String(k).trim()
    if (!key || v == null) continue
    out[key] = typeof v === 'string' ? v.trim() : String(v)
  }
  return out
}

function parseVariantOption(raw: unknown): ProductVariantOption | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const label = String(r.label ?? r.name ?? r.colore ?? r.color ?? '').trim()
  if (!label) return null
  const hexRaw = r.hex ?? r.color_hex
  const imgRaw = r.image_url ?? r.imageUrl ?? r.image
  const skuRaw = r.sku ?? r.code
  const qualityRaw = r.quality ?? r.qualità ?? r.livello
  const finishRaw = r.finish ?? r.finitura
  const packLabelRaw = r.packLabel ?? r.pack_label ?? r.confezione
  const packQtyRaw = r.packQty ?? r.pack_qty ?? r.quantity_per_pack
  const priceRaw = r.price ?? r.unit_price
  const packQtyNum =
    typeof packQtyRaw === 'number'
      ? packQtyRaw
      : typeof packQtyRaw === 'string'
        ? Number.parseInt(packQtyRaw, 10)
        : NaN
  const priceNum =
    typeof priceRaw === 'number'
      ? priceRaw
      : typeof priceRaw === 'string'
        ? Number.parseFloat(priceRaw)
        : NaN
  return {
    label,
    hex: typeof hexRaw === 'string' ? hexRaw.trim() || undefined : undefined,
    sku: typeof skuRaw === 'string' ? skuRaw.trim() || undefined : undefined,
    image_url: typeof imgRaw === 'string' ? imgRaw.trim() || undefined : undefined,
    quality: typeof qualityRaw === 'string' ? qualityRaw.trim() || undefined : undefined,
    finish: typeof finishRaw === 'string' ? finishRaw.trim() || undefined : undefined,
    packLabel: typeof packLabelRaw === 'string' ? packLabelRaw.trim() || undefined : undefined,
    packQty: Number.isFinite(packQtyNum) && packQtyNum > 0 ? packQtyNum : undefined,
    price: Number.isFinite(priceNum) ? priceNum : undefined,
  }
}

function parseVariantsJson(raw: unknown): ProductVariantOption[] | undefined {
  if (raw == null) return undefined
  if (Array.isArray(raw)) {
    const list = raw.map(parseVariantOption).filter((x): x is ProductVariantOption => x != null)
    return list.length ? list : undefined
  }
  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    const nested = o.options ?? o.colors ?? o.items
    if (Array.isArray(nested)) {
      const list = nested.map(parseVariantOption).filter((x): x is ProductVariantOption => x != null)
      return list.length ? list : undefined
    }
  }
  return undefined
}

function tokenizeSearchTerms(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

/** Oxford nel DB: spesso solo "G85" + dorso 5 cm → la ricerca "G84" deve trovarli. */
function rowMatchesOxfordG84SearchAlias(rawName: string): boolean {
  if (!isOxfordBinderName(rawName)) return false
  const cm = detectStarboxThicknessCm(rawName)
  if (cm === 5) return true
  if (cm === 8) return false
  const n = String(rawName).toLowerCase()
  if (/\b5\s*cm\b/i.test(String(rawName))) return true
  return n.includes('g84') && !n.includes('g85')
}

function rowMatchesOxfordG85SearchAlias(rawName: string): boolean {
  if (!isOxfordBinderName(rawName)) return false
  const cm = detectStarboxThicknessCm(rawName)
  if (cm === 5) return false
  if (cm === 8) return true
  if (/\b8\s*cm\b/i.test(String(rawName))) return true
  const n = String(rawName).toLowerCase()
  return n.includes('g85') && !/\b5\s*cm\b/i.test(String(rawName))
}

function searchWantsOxfordModelAlias(terms: string[]): boolean {
  return terms.includes('g84') || terms.includes('g85')
}

function oxfordModelAliasNameIlikePattern(): string {
  return `%${escapeIlikePattern('Oxford')}%`
}

function rowMatchesAllTerms(row: OfficeProductRow, terms: string[], suggestAutocomplete = false): boolean {
  const rawName = String(row.name ?? '')
  const fields = suggestionRowSearchFields(row)
  const matchOptions = suggestAutocomplete ? { suggestAutocomplete: true as const } : undefined
  const synthetic = terms.filter((t) => t !== 'g84' && t !== 'g85')
  if (synthetic.length > 0 && !searchableProductMatchesAllTerms(fields, synthetic, matchOptions)) {
    return false
  }
  if (terms.includes('g84') && !rowMatchesOxfordG84SearchAlias(rawName)) return false
  if (terms.includes('g85') && !rowMatchesOxfordG85SearchAlias(rawName)) return false
  return terms.length > 0
}

/** Sottocategoria «hub» in dashboard Archivio (Buste Trasparenti + articoli correlati). */
export const ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY = 'Buste Trasparenti' as const
export const ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY = 'Cartelle archivio con lacci' as const

const BUSTE_HUB_STARLINE_CARTELLINA_L_SKUS = new Set(['STL7416', 'STL7417'])

function busteHubStarlineCartellinaLSku(
  product: Pick<OfficeProduct, 'producerCode' | 'id'>,
): boolean {
  for (const raw of [product.producerCode, product.id]) {
    const c = String(raw ?? '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '')
    if (BUSTE_HUB_STARLINE_CARTELLINA_L_SKUS.has(c)) return true
  }
  return false
}

/** Archivio: normalizza sottocategorie legacy verso l'etichetta ufficiale in dashboard (Rev 115). */
export function normalizeArchivioSubcategoryLabel(
  category: string,
  subcategory?: string | null,
): string | undefined {
  const c = category.trim().toLowerCase()
  const s = String(subcategory ?? '').trim()
  if (!s) return undefined
  if (c !== 'archivio') return s
  if (
    s.localeCompare('Cartelle con lacci', 'it', { sensitivity: 'base' }) === 0 ||
    s.localeCompare('Cartelle archivio con lacci', 'it', { sensitivity: 'base' }) === 0
  )
    return ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY
  if (s.localeCompare('Cartelline', 'it', { sensitivity: 'base' }) === 0)
    return ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY
  return s
}

/**
 * Righe Archivio mostrate sotto la mattonella «Buste Trasparenti» pur con altra `subcategory` in DB:
 * cartelline a L Starline (liscia/buccia), SKU STL7416/7417, buste forate Sei Rota.
 */
export function isArchivioBusteTrasparentiHubExtraProduct(
  product: Pick<OfficeProduct, 'name' | 'brand' | 'category' | 'subcategory' | 'producerCode' | 'id'>,
): boolean {
  if (product.category.trim().toLowerCase() !== 'archivio') return false
  const sub = (product.subcategory ?? '').trim()
  if (sub === ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY) return false

  if (busteHubStarlineCartellinaLSku(product)) return true

  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const hay = `${n} ${b}`

  const starline = hay.includes('starline')
  const cartell = n.includes('cartellin') || n.includes('cartelline') || /\bcartelle\b/.test(n)
  const adL = /\ba\s*l\b/.test(n) || /\bad\s*l\b/.test(n) || n.includes(' adl')
  if (starline && cartell && adL) return true

  const busteForate = n.includes('bust') && (n.includes('forat') || n.includes('forate'))
  const seiRota = hay.includes('sei rota') || hay.includes('sei-rota') || hay.includes('seirota')
  if (busteForate && seiRota) return true

  return false
}

/** Badge griglia / coerenza percorso: articolo appartenente all'hub Buste Trasparenti. */
export function isOfficeProductInBusteTrasparentiHub(product: OfficeProduct): boolean {
  if (product.category.trim().toLowerCase() !== 'archivio') return false
  const sub = (product.subcategory ?? '').trim()
  if (sub === ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY) return true
  return isArchivioBusteTrasparentiHubExtraProduct(product)
}

export function matchesArchivioSubcategoryFilter(
  product: OfficeProduct,
  activeSubcategory: string,
): boolean {
  const sub =
    normalizeArchivioSubcategoryLabel('Archivio', (product.subcategory ?? '').trim()) ??
    (product.subcategory ?? '').trim()
  const active =
    normalizeArchivioSubcategoryLabel('Archivio', activeSubcategory) ?? activeSubcategory
  if (activeSubcategory === ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY) {
    if (sub.localeCompare(ARCHIVIO_CARTELLE_LACCI_SUBCATEGORY, 'it', { sensitivity: 'base' }) !== 0) {
      return false
    }
    // Rev 172: fallback robusto su subcategory esatta; escludi eventuali residui Starline.
    const nameLower = String(product.name ?? '').toLowerCase()
    const brandLower = String(product.brand ?? '').toLowerCase()
    if (brandLower.includes('starline') || nameLower.includes('starline')) return false
    return true
  }
  if (active === ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY) {
    return sub === ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY || isArchivioBusteTrasparentiHubExtraProduct(product)
  }
  return sub.localeCompare(active, 'it', { sensitivity: 'base' }) === 0
}

/** Copertina mattonella: preferisci articoli «busta trasparente» / HD tra i candidati hub. */
export function pickBusteTrasparentiTilePreviewUrl(
  candidates: Pick<OfficeProduct, 'name' | 'imageUrl' | 'description'>[],
): string | null {
  const withUrl = candidates.filter((p) => (p.imageUrl ?? '').trim() !== '')
  if (!withUrl.length) return null
  const score = (p: Pick<OfficeProduct, 'name' | 'imageUrl' | 'description'>) => {
    let s = 0
    const blob = `${p.name ?? ''} ${p.description ?? ''}`.toLowerCase()
    if (blob.includes('soft') && blob.includes('sei rota')) s += 16
    if (blob.includes('sacco')) s += 8
    if (blob.includes('trasparent')) s += 14
    if (blob.includes('bust') && blob.includes('trasparent')) s += 10
    if (blob.includes('poli') || blob.includes('cristall')) s += 5
    const u = (p.imageUrl ?? '').toLowerCase()
    if (u.includes('/hd/') || u.includes('/immagini/hd')) s += 4
    return s
  }
  return [...withUrl].sort((a, b) => score(b) - score(a))[0]?.imageUrl?.trim() ?? null
}

/**
 * Se la colonna `image_url` è vuota ma in `variants` (JSON) c’è un’anteprima per colore, usa quella.
 * Utile per cartelline Starline e altri SKU con immagini solo nel JSON.
 */
export function enrichOfficeProductImageFromVariants(product: OfficeProduct): OfficeProduct {
  const main = (product.imageUrl ?? '').trim()
  if (main) return product
  const opts = product.variants ?? []
  for (const opt of opts) {
    const raw = opt as ProductVariantOption & { imageUrl?: string }
    const u = (raw.image_url ?? raw.imageUrl ?? '').trim()
    if (u) return { ...product, imageUrl: u }
  }
  return product
}

function mapRowToOfficeProduct(row: OfficeProductRow): OfficeProduct {
  const rawPriceSource = row.price
  const rawPrice =
    typeof rawPriceSource === 'string'
      ? Number.parseFloat(rawPriceSource)
      : rawPriceSource
  const description = (row.description ?? undefined)
    ?.replace('Dati estratti letteralmente da screenshot prodotto office.', '')
    .trim()
  const name = normalizeStarlineThreeFlapsName(row.name != null ? String(row.name) : '')
  const category = normalizeOfficeProductCategory(row.category ?? '')

  const mapped: OfficeProduct = {
    id: typeof row.id === 'string' ? row.id : String(row.id),
    name,
    brand: (row.brand ?? '').trim(),
    producerCode:
      (row.sku ?? '').trim() ||
      (typeof row.id === 'string' ? row.id : String(row.id)),
    parentSku: (row.parent_sku ?? '').trim() || undefined,
    colorName: String((row.color ?? row.color_name ?? '') as string).trim() || undefined,
    category,
    subcategory: normalizeArchivioSubcategoryLabel(category, row.subcategory),
    mainFeatures: jsonbToMainFeatures(row.main_features),
    imageUrl: String(
      row.image_url ??
        (row as OfficeProductRow & { imageUrl?: string | null }).imageUrl ??
        '',
    ).trim(),
    description: description || undefined,
    price: Number.isFinite(rawPrice) ? Number(rawPrice) : undefined,
    format: String((row as OfficeProductRow).format ?? '').trim() || undefined,
    variants: parseVariantsJson(row.variants),
  }
  return applyEuroboxEsselteCatalog(
    applyBigSeiRotaCatalog(
      applySoftSeiRotaCatalog(
        applyAlteaT3042SeiRotaPricing(
          applyTrattoVideoHighlighterCatalog(
            applyPilotHiTecpointCatalog(
              applyStaedtlerNorisCatalog(
                applyFermagliZincatiCatalog(
                  applyImballoProTapeCatalog(
                    applyZenithPointsCatalog(
                      applyBicCristal50Catalog(
                        applyPentelMarkerCatalog(
                          applyStabiloOhpenCatalog(
                            applyEuroCartLacciCatalog(
                              applyStarlineArchiveBoxCatalog(
                                applyStarlinePunchedEnvelopePricing(
                                  applyOxfordPricing(
                                    applyStarboxPricing(applyBlasettiMailpackCatalog(mapped)),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}

/** Risultato compatto per autocomplete header (no listini quantità). */
export type OfficeSearchSuggestion = {
  id: string
  /** Allineato a OfficeProduct.producerCode (sku o id). */
  producerCode: string
  name: string
  brand: string
  colorName?: string
  imageUrl: string
  price?: number
  category?: string
  subcategory?: string
}

function suggestionDisplayNameFromRow(row: OfficeProductRow): string {
  const raw = row.name != null ? String(row.name) : ''
  if (!isOxfordBinderName(raw)) return raw
  return normalizeOxfordModelNameByThickness(raw, detectStarboxThicknessCm(raw))
}

function mapRowToSuggestion(row: OfficeProductRow): OfficeSearchSuggestion {
  const rawPriceSource = row.price
  const rawPrice =
    typeof rawPriceSource === 'string'
      ? Number.parseFloat(rawPriceSource)
      : rawPriceSource
  const idStr = typeof row.id === 'string' ? row.id : String(row.id)
  return {
    id: idStr,
    producerCode: (row.sku ?? '').trim() || idStr,
    name: suggestionDisplayNameFromRow(row),
    brand: (row.brand ?? '').trim(),
    colorName: (row.color_name ?? '').trim() || undefined,
    imageUrl: (row.image_url ?? '').trim(),
    price: Number.isFinite(rawPrice) ? Number(rawPrice) : undefined,
    category: (row.category ?? '').trim() || undefined,
    subcategory: (row.subcategory ?? '').trim() || undefined,
  }
}

function suggestionRowSearchFields(row: OfficeProductRow) {
  const idStr = typeof row.id === 'string' ? row.id : String(row.id)
  return {
    name: String(row.name ?? ''),
    brand: String(row.brand ?? ''),
    sku: (row.sku ?? '').trim() || idStr,
    category: String(row.category ?? ''),
    subcategory: (row.subcategory ?? '').trim() || undefined,
    colorName: (row.color_name ?? '').trim() || undefined,
    description: (row.description ?? '').trim() || undefined,
    id: idStr,
  }
}

function rankSuggestionRow(row: OfficeProductRow, terms: string[], rawQuery: string): number {
  const nameRaw = String(row.name ?? '')
  let score = scoreSearchableProduct(suggestionRowSearchFields(row), terms, rawQuery)
  for (const t of terms) {
    if (t === 'g84' && rowMatchesOxfordG84SearchAlias(nameRaw)) score += 48
    else if (t === 'g85' && rowMatchesOxfordG85SearchAlias(nameRaw)) score += 48
  }
  return score
}

function mergeRowsById(rows: OfficeProductRow[]): OfficeProductRow[] {
  const byId = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    byId.set(row.id, row)
  }
  return Array.from(byId.values())
}

function mergeLegacyRowsById(rows: OfficeProductsLegacyRow[]): OfficeProductsLegacyRow[] {
  const byId = new Map<string, OfficeProductsLegacyRow>()
  for (const row of rows) {
    byId.set(row.id, row)
  }
  return Array.from(byId.values())
}

function mapLegacyOfficeRowToOfficeProduct(row: OfficeProductsLegacyRow): OfficeProduct {
  const rawPriceSource = row.price
  const rawPrice =
    typeof rawPriceSource === 'string'
      ? Number.parseFloat(rawPriceSource)
      : rawPriceSource
  const mapped: OfficeProduct = {
    id: row.id,
    name: normalizeStarlineThreeFlapsName(row.name != null ? String(row.name) : ''),
    brand: '',
    producerCode: row.id,
    category: normalizeOfficeProductCategory(row.category ?? ''),
    mainFeatures: {},
    imageUrl: (row.image_url ?? '').trim(),
    description: row.description?.trim() || undefined,
    price: Number.isFinite(rawPrice) ? Number(rawPrice) : undefined,
  }
  return applyEuroboxEsselteCatalog(
    applyBigSeiRotaCatalog(
      applySoftSeiRotaCatalog(
        applyAlteaT3042SeiRotaPricing(
          applyTrattoVideoHighlighterCatalog(
            applyPilotHiTecpointCatalog(
              applyStaedtlerNorisCatalog(
                applyFermagliZincatiCatalog(
                  applyImballoProTapeCatalog(
                    applyZenithPointsCatalog(
                      applyBicCristal50Catalog(
                        applyPentelMarkerCatalog(
                          applyStabiloOhpenCatalog(
                            applyEuroCartLacciCatalog(
                              applyStarlineArchiveBoxCatalog(
                                applyStarlinePunchedEnvelopePricing(
                                  applyOxfordPricing(
                                    applyStarboxPricing(applyBlasettiMailpackCatalog(mapped)),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}

function catalogProducerKey(p: OfficeProduct): string {
  return (p.producerCode || p.id).trim().toLowerCase()
}

function isRemovedEuroboxSingletonName(name: string): boolean {
  const n = normName(name).replace(/\s+/g, ' ').trim()
  return (
    n.includes('scatola progetto eurobox') &&
    n.includes('dorso 10 cm') &&
    n.includes('rosso')
  )
}

function isRemovedStarboxArancioDorso5(name: string): boolean {
  const n = normName(name).replace(/\s+/g, ' ').trim()
  return (
    n.includes('raccoglitore registratore starbox') &&
    n.includes('dorso 5 cm') &&
    n.includes('arancio')
  )
}

function isRemovedStarboxLillaDorso5(name: string): boolean {
  const n = normName(name).replace(/\s+/g, ' ').trim()
  return (
    n.includes('raccoglitore registratore starbox') &&
    n.includes('dorso 5 cm') &&
    n.includes('lilla')
  )
}

function isSuppressedCatalogProduct(p: OfficeProduct): boolean {
  const id = String(p.id ?? '').trim().toLowerCase()
  return (
    SUPPRESSED_PRODUCTS_BY_ID.has(id) ||
    isRemovedEuroboxSingletonName(p.name) ||
    isRemovedStarboxArancioDorso5(p.name) ||
    isRemovedStarboxLillaDorso5(p.name)
  )
}

function isSuppressedShopRow(row: OfficeProductRow): boolean {
  const id = String(row.id ?? '').trim().toLowerCase()
  const name = String(row.name ?? '')
  return (
    SUPPRESSED_PRODUCTS_BY_ID.has(id) ||
    isRemovedStarboxArancioDorso5(name) ||
    isRemovedStarboxLillaDorso5(name)
  )
}

function isExcludedSearchSuggestionRow(row: OfficeProductRow): boolean {
  const idStr = typeof row.id === 'string' ? row.id : String(row.id)
  return isExcludedFromOfficeSearchSuggestions({
    id: idStr,
    producerCode: (row.sku ?? '').trim() || idStr,
    name: String(row.name ?? ''),
    brand: String(row.brand ?? ''),
    category: String(row.category ?? ''),
    subcategory: (row.subcategory ?? '').trim() || undefined,
    mainFeatures: {},
  })
}

const COLOR_COPY_GRAMMAGE_BY_FORMAT: Record<'A3' | 'A4', ReadonlyArray<{
  key: string
  grammage: number
  packSheets: number
  price: number
}>> = {
  A3: [
    { key: '100g', grammage: 100, packSheets: 500, price: 24.9 },
    { key: '120g', grammage: 120, packSheets: 500, price: 28.9 },
    { key: '160g', grammage: 160, packSheets: 250, price: 32.5 },
    { key: '200g', grammage: 200, packSheets: 250, price: 39.9 },
    { key: '250g', grammage: 250, packSheets: 250, price: 49.5 },
    { key: '280g', grammage: 280, packSheets: 250, price: 56.9 },
    { key: '300g', grammage: 300, packSheets: 250, price: 63.5 },
    { key: '350g', grammage: 350, packSheets: 250, price: 74.9 },
  ],
  A4: [
    { key: '100g', grammage: 100, packSheets: 500, price: 16.9 },
    { key: '120g', grammage: 120, packSheets: 500, price: 19.9 },
    { key: '160g', grammage: 160, packSheets: 250, price: 24.9 },
    { key: '200g', grammage: 200, packSheets: 250, price: 30.9 },
    { key: '250g', grammage: 250, packSheets: 250, price: 38.9 },
    { key: '280g', grammage: 280, packSheets: 250, price: 44.9 },
    { key: '300g', grammage: 300, packSheets: 250, price: 49.9 },
    { key: '350g', grammage: 350, packSheets: 250, price: 57.9 },
  ],
}

function detectColorCopyFormat(name: string): 'A3' | 'A4' | null {
  const n = normName(name)
  if (!n.includes('color copy') || !n.includes('mondi')) return null
  if (/\ba3\b/.test(n)) return 'A3'
  if (/\ba4\b/.test(n)) return 'A4'
  return null
}

function colorCopyBaseName(name: string): string {
  return String(name ?? '')
    .replace(/\s*-\s*\d{2,3}\s*gr\b/gi, '')
    .replace(/\s*-\s*conf\.\s*\d+\s*fogli\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function expandColorCopyVariants(products: OfficeProduct[]): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const p of products) {
    const format = detectColorCopyFormat(p.name)
    if (!format) {
      out.push(p)
      continue
    }
    const baseName = colorCopyBaseName(p.name)
    const variants = COLOR_COPY_GRAMMAGE_BY_FORMAT[format]
    for (const v of variants) {
      out.push({
        ...p,
        id: `${p.id}::${format}-${v.key}`,
        // Manteniamo producerCode originale per aprire la scheda prodotto reale.
        producerCode: p.producerCode,
        name: `${baseName} - ${v.grammage} gr - conf. ${v.packSheets} fogli`,
        price: v.price,
        mainFeatures: {
          ...(p.mainFeatures ?? {}),
          Formato: format,
          Grammatura: `${v.grammage} gr`,
          Confezione: `${v.packSheets} fogli`,
        },
      })
    }
  }
  return out
}

/** Legacy prima (features complete); poi righe `products` senza stessa chiave produttore. */
function mergeCatalogLists(
  legacy: OfficeProduct[],
  shop: OfficeProduct[],
  searchTerms?: string[],
): OfficeProduct[] {
  const shopByKey = new Map<string, OfficeProduct>()
  for (const p of shop) {
    const key = catalogProducerKey(p)
    if (key) shopByKey.set(key, p)
  }

  const mergedLegacy = legacy.map((p) => {
    const key = catalogProducerKey(p)
    const fromShop = key ? shopByKey.get(key) : undefined
    if (!fromShop) return p

    // Se il DB shop non ha categoria utile (→ `Altro` dopo normalizzazione), non sovrascrivere Carta/Archivio legacy.
    const shopLabel = fromShop.category.trim()
    const legacyLabel = p.category.trim()
    const preferLegacyCanonical =
      shopLabel === 'Altro' && (legacyLabel === 'Carta' || legacyLabel === 'Archivio')
    const raw = preferLegacyCanonical
      ? p.category
      : shopLabel
        ? fromShop.category
        : p.category

    const nextCategory = normalizeOfficeProductCategory(raw)
    const mergedSubRaw = (p.subcategory ?? fromShop.subcategory ?? '').trim() || undefined
    return {
      ...p,
      category: nextCategory,
      // La tabella legacy non ha `subcategory`: se disponibile nello shop, propagala.
      subcategory: normalizeArchivioSubcategoryLabel(nextCategory, mergedSubRaw),
    }
  })

  const keys = new Set(mergedLegacy.map(catalogProducerKey).filter((k) => k.length > 0))
  const extra = shop.filter((p) => {
    const k = catalogProducerKey(p)
    return k.length > 0 && !keys.has(k)
  })

  const combined = expandColorCopyVariants(
    [...mergedLegacy, ...extra].filter((p) => !isSuppressedCatalogProduct(p)),
  )

  const termsLower = (searchTerms ?? []).map((t) => t.toLowerCase())
  const hasActiveSearch = termsLower.length > 0
  const isBicSearch = termsLower.some((t) => t === 'bic' || t.includes('bic') || t.includes('cristal'))
  const isPentelSearch = termsLower.some(
    (t) => t.includes('pentel') || t.includes('marcat') || t.includes('marker'),
  )

  // Evidenziatori Tratto Video: mostrali come un unico prodotto in lista (le varianti colore sono nella pagina prodotto).
  // NOTA: dopo pulizia DB, vogliamo 1 card per colore (no deduplica in lista né in ricerca).
  // Penne Bic Cristal 50 pz: mostrale come un unico prodotto in lista.
  // Marcatori Pentel: una card in griglia Cancelleria (varianti colore in scheda).
  // Penne Pilot V5: mantenere SEMPRE card separate per colore in griglia.
  let bicCristalKept = false
  let pentelMarkerKept = false
  const deduped: OfficeProduct[] = []
  for (const p of combined) {
    if (isBicCristal50CatalogProduct(p)) {
      // In ricerca mostra TUTTE le varianti colore (card separate). Fuori ricerca deduplica.
      if (!hasActiveSearch && !isBicSearch) {
        if (bicCristalKept) continue
        bicCristalKept = true
      }
    }
    if (isPentelMarkerCatalogProduct(p)) {
      if (!hasActiveSearch && !isPentelSearch) {
        if (pentelMarkerKept) continue
        pentelMarkerKept = true
      }
    }
    deduped.push(p)
  }

  const injected = getInjectedLocalCatalogProducts()
  const existingKeys = new Set(
    deduped.map((p) => catalogProducerKey(p)).filter((k) => k.length > 0),
  )
  for (const p of injected) {
    const k = catalogProducerKey(p)
    if (k.length > 0 && existingKeys.has(k)) continue
    if (hasActiveSearch && searchTerms && !officeProductMatchesSearchTerms(p, searchTerms)) continue
    deduped.push(p)
    if (k.length > 0) existingKeys.add(k)
  }

  if (hasActiveSearch && searchTerms?.length) {
    const query = searchTerms.join(' ')
    return deduped
      .filter((p) => officeProductMatchesSearchTerms(p, searchTerms))
      .sort(
        (a, b) =>
          scoreSearchableProduct(officeProductToSearchFields(b), searchTerms, query) -
          scoreSearchableProduct(officeProductToSearchFields(a), searchTerms, query),
      )
  }

  return deduped.sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))
}

export async function fetchBicCristal50ColorVariants(
  anchor: OfficeProduct,
): Promise<StarboxColorVariantSlot[]> {
  if (!isBicCristal50CatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Penna%a%sfera%Bic%Cristal%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Bic%Cristal%', 340),
    ])
    rows = mergeRowsById([...a, ...b])
  } catch {
    rows = []
  }

  const byColor = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isBicCristal50Name(name)) continue
    const color = detectStarboxColorLabel(name)
    if (!color) continue
    if (!byColor.has(color)) byColor.set(color, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  if (anchorColor && !byColor.has(anchorColor)) {
    byColor.set(anchorColor, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: StarboxColorVariantSlot[] = []
  for (const color of BIC_CRISTAL_COLOR_LABELS) {
    const row = byColor.get(color)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

/** Cancelleria + brand Pentel (query larga: non dipende dalla sottocategoria). */
async function fetchCancelleriaRowsBrandPentel(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  limit: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .ilike('category', '%cancell%')
        .ilike('brand', '%pentel%')
        .order('name', { ascending: true })
        .limit(limit)
      if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
      if (isMissingColumnPostgrestError(res.error)) continue
      return []
    } catch {
      return []
    }
  }
  return []
}

/** Cancelleria + Mailpack nel titolo (varianti formato senza query troppo stretta). */
async function fetchCancelleriaRowsMailpackName(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  limit: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .ilike('category', '%cancell%')
        .ilike('name', '%Mailpack%')
        .order('name', { ascending: true })
        .limit(limit)
      if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
      if (isMissingColumnPostgrestError(res.error)) continue
      return []
    } catch {
      return []
    }
  }
  return []
}

function pentelMarkerRowSharesModel(anchor: Pick<OfficeProduct, 'name'>, rowName: string): boolean {
  if (pentelMarkerFamilyKey({ name: rowName }) === pentelMarkerFamilyKey(anchor as OfficeProduct)) {
    return true
  }
  const tok = extractPentelModelToken(String(anchor.name ?? ''))
  if (!tok) return false
  const rl = rowName.toLowerCase()
  if (!rl.includes(tok.toLowerCase())) return false
  const al = String(anchor.name ?? '').toLowerCase()
  const markerish = (s: string) =>
    s.includes('marcat') || s.includes('marker') || s.includes('pentel')
  return markerish(al) && markerish(rl)
}

function pentelColorLabelFromRow(row: OfficeProductRow, name: string): string | null {
  const rawColor = String(row.color ?? '').trim()
  const rawColorName = String(row.color_name ?? '').trim()
  const blob = [rawColor, rawColorName].filter(Boolean).join(' ')
  if (blob) {
    const d = detectStarboxColorLabel(blob) ?? detectStarboxColorLabel(`${blob} ${name}`)
    if (d) return d
    const piece = rawColorName || rawColor
    const pl = piece.toLowerCase()
    for (const lab of PENTEL_MARKER_COLOR_LABELS) {
      if (lab.toLowerCase() === pl) return lab
    }
    if (piece.length >= 2 && piece.length <= 32) {
      return piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()
    }
  }
  return detectStarboxColorLabel(name)
}

async function gatherPentelMarkerCandidateRows(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  anchor: OfficeProduct,
): Promise<OfficeProductRow[]> {
  const modelTok = extractPentelModelToken(anchor.name)
  const brandSubRows = await fetchPentelMarkersByBrandSubcategory(supabase, 400)
  const cancelleriaPentel = await fetchCancelleriaRowsBrandPentel(supabase, 560)
  const baseFetches = [
    fetchRowsByNameIlikeWithFallbacks(supabase, '%Pentel%Marcat%', 280),
    fetchRowsByNameIlikeWithFallbacks(supabase, '%Marcat%Pentel%', 280),
    fetchRowsByNameIlikeWithFallbacks(supabase, '%Pentel%Marker%', 240),
  ]
  const extraFetches: Promise<OfficeProductRow[]>[] = []
  if (modelTok) {
    const esc = escapeIlikePattern(modelTok)
    extraFetches.push(
      fetchRowsByNameIlikeWithFallbacks(supabase, `%${esc}%Marcat%`, 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, `%Marcat%${esc}%`, 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, `%Pentel%${esc}%`, 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, `%${esc}%Pentel%`, 220),
    )
  }
  const chunks = await Promise.all([...baseFetches, ...extraFetches])
  return mergeRowsById([...cancelleriaPentel, ...brandSubRows, ...chunks.flat()])
}

/** Marcatori Pentel: righe shop con brand e sottocategoria catalogo (Rev 199). */
async function fetchPentelMarkersByBrandSubcategory(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  limit: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .ilike('brand', 'Pentel')
        .ilike('subcategory', '%Marcatori%')
        .order('name', { ascending: true })
        .limit(limit)
      if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
      if (isMissingColumnPostgrestError(res.error)) continue
      return []
    } catch {
      return []
    }
  }
  return []
}

export async function fetchPentelMarkerColorVariants(
  anchor: OfficeProduct,
): Promise<StarboxColorVariantSlot[]> {
  if (!isPentelMarkerCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    rows = await gatherPentelMarkerCandidateRows(supabase, anchor)
  } catch {
    rows = []
  }

  const byColor = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    const mappedProbe = mapRowToOfficeProduct(row)
    if (!isPentelMarkerCatalogProduct(mappedProbe)) continue
    if (!pentelMarkerRowSharesModel(anchor, name)) continue
    const color = pentelColorLabelFromRow(row, name)
    if (!color) continue
    if (!byColor.has(color)) byColor.set(color, row)
  }

  const anchorColor =
    detectStarboxColorLabel(anchor.name) ?? detectStarboxColorLabel(String(anchor.colorName ?? ''))
  if (anchorColor && !byColor.has(anchorColor)) {
    byColor.set(anchorColor, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const orderIdx = new Map<string, number>(
    (PENTEL_MARKER_COLOR_LABELS as readonly string[]).map((c, i) => [c, i]),
  )
  const colors = [...byColor.keys()].sort((a, b) => {
    const ia = orderIdx.has(a) ? (orderIdx.get(a) as number) : 999
    const ib = orderIdx.has(b) ? (orderIdx.get(b) as number) : 999
    if (ia !== ib) return ia - ib
    return a.localeCompare(b, 'it')
  })

  const out: StarboxColorVariantSlot[] = []
  for (const color of colors) {
    const row = byColor.get(color)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

/** Alias esplicito per «fetch varianti» da scheda prodotto. */
export const fetchPentelMarkerVariants = fetchPentelMarkerColorVariants

export async function fetchPentelMarkerVariantByColor(
  anchor: OfficeProduct,
  colorLabel: string,
): Promise<OfficeProduct | null> {
  const wanted = colorLabel.trim().toLowerCase()
  const slots = await fetchPentelMarkerColorVariants(anchor)
  const hit = slots.find((s) => s.color.trim().toLowerCase() === wanted)
  if (hit) return hit.product

  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null
  try {
    const rows = await gatherPentelMarkerCandidateRows(supabase, anchor)
    const direct = rows.find((r) => {
      const name = String(r.name ?? '')
      const m = mapRowToOfficeProduct(r)
      if (!isPentelMarkerCatalogProduct(m)) return false
      if (!pentelMarkerRowSharesModel(anchor, name)) return false
      const col = pentelColorLabelFromRow(r, name)
      return (col ?? '').trim().toLowerCase() === wanted
    })
    if (!direct) return null
    return attachQuantityTiers(mapRowToOfficeProduct(direct), new Map())
  } catch {
    return null
  }
}

export async function fetchPilotV5ColorVariants(
  anchor: OfficeProduct,
): Promise<StarboxColorVariantSlot[]> {
  if (!isPilotHiTecpointCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const anchorBase = normalizePilotV5BaseName(anchor.name)
    const anchorPattern = anchorBase ? `%${escapeIlikePattern(anchorBase)}%` : '%Pilot%V5%'
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Roller Hi Tecpoint V5%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Pilot%V5%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, anchorPattern, 260),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const anchorBase = normalizePilotV5BaseName(anchor.name)
  const byColor = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    const brand = String(row.brand ?? '').toLowerCase()
    if (!isPilotV5Name(name) && !brand.includes('pilot')) continue
    const rowBase = normalizePilotV5BaseName(name)
    if (anchorBase && rowBase && !rowBase.includes(anchorBase) && !anchorBase.includes(rowBase)) {
      continue
    }
    const fromName = detectStarboxColorLabel(name)
    const fromRow = detectStarboxColorLabel(String(row.color_name ?? ''))
    const color = (fromName ?? fromRow) === 'Lilla' ? 'Viola' : (fromName ?? fromRow)
    if (!color) continue
    if (!byColor.has(color)) byColor.set(color, row)
  }

  const anchorDetected = detectStarboxColorLabel(anchor.name) ?? detectStarboxColorLabel(anchor.colorName ?? '')
  const anchorColor = anchorDetected === 'Lilla' ? 'Viola' : anchorDetected
  if (anchorColor && !byColor.has(anchorColor)) {
    byColor.set(anchorColor, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: StarboxColorVariantSlot[] = []
  for (const color of PILOT_V5_COLOR_LABELS) {
    const row = byColor.get(color)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  const tip = detectPilotHiTecpointTipMm(anchor.name)
  if (tip == null) return out
  return out.filter((slot) => detectPilotHiTecpointTipMm(slot.product.name) === tip)
}

export type PilotHiTecpointVariantSlot = {
  tipMm: 0.5 | 0.7
  color: string
  product: OfficeProduct
}

export type StaedtlerNorisVariantSlot = {
  gradeLabel: '2B' | 'B' | 'HB' | 'H' | '2H'
  product: OfficeProduct
}

export type FermagliZincatiVariantSlot = {
  numberLabel: 'n. 1' | 'n. 2' | 'n. 3' | 'n. 4' | 'n. 5' | 'n. 6'
  product: OfficeProduct
}

export type ImballoProTapeVariantSlot = {
  variantLabel: 'Avana (PVC)' | 'Trasparente (PP)'
  product: OfficeProduct
}

export async function fetchPilotHiTecpointVariants(
  anchor: OfficeProduct,
): Promise<PilotHiTecpointVariantSlot[]> {
  if (!isPilotHiTecpointCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []
  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Roller Hi Tecpoint V5%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Roller Hi Tecpoint V7%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Pilot%V%7%', 260),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byKey = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isPilotHiTecpointCatalogProduct({ name, brand: String(row.brand ?? '') })) continue
    const color = detectStarboxColorLabel(name) ?? detectStarboxColorLabel(String(row.color_name ?? ''))
    const tipMm = detectPilotHiTecpointTipMm(name)
    if (!color || tipMm == null) continue
    const normalizedColor = color === 'Lilla' ? 'Viola' : color
    const key = `${tipMm}:${normalizedColor}`
    if (!byKey.has(key)) byKey.set(key, row)
  }

  const anchorColorRaw = detectStarboxColorLabel(anchor.name) ?? detectStarboxColorLabel(anchor.colorName ?? '')
  const anchorColor = anchorColorRaw === 'Lilla' ? 'Viola' : anchorColorRaw
  const anchorTip = detectPilotHiTecpointTipMm(anchor.name)
  if (anchorColor && anchorTip != null && !byKey.has(`${anchorTip}:${anchorColor}`)) {
    byKey.set(`${anchorTip}:${anchorColor}`, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: PilotHiTecpointVariantSlot[] = []
  for (const tipMm of PILOT_HI_TECPOINT_TIP_MM) {
    for (const color of PILOT_V5_COLOR_LABELS) {
      const row = byKey.get(`${tipMm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        tipMm,
        color,
        product: attachQuantityTiers(mapped, tiersByProductId),
      })
    }
  }
  return out
}

export async function fetchStaedtlerNorisVariants(
  anchor: OfficeProduct,
): Promise<StaedtlerNorisVariantSlot[]> {
  if (!isStaedtlerNorisCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const anchorBase = normalizeStaedtlerNorisBaseName(anchor.name)
    const anchorPattern = anchorBase ? `%${escapeIlikePattern(anchorBase)}%` : '%Matita%grafite%Noris%'
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Matita in grafite Noris%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Staedtler%Noris%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, anchorPattern, 260),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const anchorBase = normalizeStaedtlerNorisBaseName(anchor.name)
  const byGrade = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    const brand = String(row.brand ?? '').toLowerCase()
    const lowerName = name.toLowerCase()
    if (!isStaedtlerNorisCatalogProduct({ name, brand: String(row.brand ?? '') })) {
      if (!brand.includes('staedtler') || !lowerName.includes('noris')) continue
    }
    const rowBase = normalizeStaedtlerNorisBaseName(name)
    if (anchorBase && rowBase && !rowBase.includes(anchorBase) && !anchorBase.includes(rowBase)) {
      continue
    }
    const grade = detectStaedtlerNorisGradeLabel(name)
    if (!grade) continue
    if (!byGrade.has(grade)) byGrade.set(grade, row)
  }

  const anchorGrade = detectStaedtlerNorisGradeLabel(anchor.name)
  if (anchorGrade && !byGrade.has(anchorGrade)) {
    byGrade.set(anchorGrade, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: StaedtlerNorisVariantSlot[] = []
  for (const gradeLabel of STAEDTLER_NORIS_GRADE_LABELS) {
    const row = byGrade.get(gradeLabel)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      gradeLabel,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

export async function fetchFermagliZincatiVariants(
  anchor: OfficeProduct,
): Promise<FermagliZincatiVariantSlot[]> {
  if (!isFermagliZincatiCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Fermagli zincati%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Fermagli%Leone%', 260),
    ])
    rows = mergeRowsById([...a, ...b])
  } catch {
    rows = []
  }

  const byNumber = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isFermagliZincatiCatalogProduct({ name, brand: String(row.brand ?? '') })) continue
    const numberLabel = detectFermagliZincatiNumberLabel(name)
    if (!numberLabel) continue
    if (!byNumber.has(numberLabel)) byNumber.set(numberLabel, row)
  }

  const anchorNumber = detectFermagliZincatiNumberLabel(anchor.name)
  if (anchorNumber && !byNumber.has(anchorNumber)) {
    byNumber.set(anchorNumber, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: FermagliZincatiVariantSlot[] = []
  for (const numberLabel of FERMAGLI_ZINCATI_NUMBER_LABELS) {
    const row = byNumber.get(numberLabel)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      numberLabel,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

function detectStarlineCartellinaModelKindFromNameAndBrand(
  name: string,
  brand?: string | null,
): 'semplice' | '3lembi' | null {
  const n = String(name ?? '').toLowerCase()
  const b = String(brand ?? '').toLowerCase()
  if (!n.includes('cartellin')) return null
  if (!n.includes('starline') && !b.includes('starline')) return null
  if (/\b3\s*lembi\b/.test(n) || /\btre\s*lembi\b/.test(n)) return '3lembi'
  if (n.includes('25 pz') || n.includes('25 pez')) return '3lembi'
  if (n.includes('semplice')) return 'semplice'
  if (n.includes('50 pz') || n.includes('50 pez')) return 'semplice'
  return null
}

function isDeskStaplerPinzaName(name: string): boolean {
  const n = String(name ?? '').toLowerCase()
  return (n.includes('cucitric') || n.includes('stapler')) && n.includes('pinza')
}

export function isDeskStaplerPinzaCatalogProduct(
  product: Pick<OfficeProduct, 'name' | 'brand'>,
): boolean {
  if (isDeskStaplerPinzaName(product.name)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  return b.includes('zenith') && (n.includes('cucitric') || n.includes('stapler'))
}

function rowIsStarlineCartellinaCandidate(row: OfficeProductRow): boolean {
  const name = String(row.name ?? '').toLowerCase()
  if (!name.includes('cartellin')) return false
  const brand = String(row.brand ?? '').toLowerCase()
  if (brand.includes('starline')) return true
  return name.includes('starline')
}

/**
 * Tutte le righe shop con nome che contiene «Cartellin…» e brand Starline (fallback su titolo se `brand` assente in select).
 */
async function fetchStarlineCartellinaRowsFromShop(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
): Promise<OfficeProductRow[]> {
  const namePat = '%Cartellin%'
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .ilike('name', namePat)
        .ilike('brand', '%Starline%')
        .order('name', { ascending: true })
        .limit(520)
      if (!res.error) {
        const data = (res.data ?? []) as unknown as OfficeProductRow[]
        return data.filter((row) => String(row.name ?? '').toLowerCase().includes('cartellin'))
      }
      if (!isMissingColumnPostgrestError(res.error)) {
        console.warn('[starline-cartellina] query brand+name:', res.error)
        return []
      }
    } catch {
      continue
    }
  }

  const broad = await fetchRowsByNameIlikeWithFallbacks(supabase, namePat, 520)
  return mergeRowsById(broad).filter(rowIsStarlineCartellinaCandidate)
}

export async function fetchStarlineCartellinaVariants(anchor: OfficeProduct): Promise<OfficeProduct[]> {
  const anchorKind = detectStarlineCartellinaModelKindFromNameAndBrand(anchor.name, anchor.brand)
  if (!anchorKind) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    rows = await fetchStarlineCartellinaRowsFromShop(supabase)
  } catch {
    rows = []
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const outMap = new Map<string, OfficeProduct>()
  for (const row of rows) {
    const mapped = enrichOfficeProductImageFromVariants(mapRowToOfficeProduct(row))
    const modelKind = detectStarlineCartellinaModelKindFromNameAndBrand(mapped.name, mapped.brand)
    if (!modelKind) continue
    outMap.set(String(mapped.id), attachQuantityTiers(mapped, tiersByProductId))
  }
  const fromRows = outMap.get(String(anchor.id))
  const anchorMerged: OfficeProduct = {
    ...anchor,
    imageUrl:
      (anchor.imageUrl ?? '').trim() ||
      (fromRows?.imageUrl ?? '').trim() ||
      anchor.imageUrl,
    variants:
      anchor.variants && anchor.variants.length > 0 ? anchor.variants : fromRows?.variants,
  }
  outMap.set(
    String(anchor.id),
    attachQuantityTiers(enrichOfficeProductImageFromVariants(anchorMerged), tiersByProductId),
  )

  return Array.from(outMap.values()).sort((a, b) =>
    (a.colorName || a.name).localeCompare(b.colorName || b.name, 'it', { sensitivity: 'base' }),
  )
}

export async function fetchDeskStaplerPinzaVariants(anchor: OfficeProduct): Promise<OfficeProduct[]> {
  if (!isDeskStaplerPinzaCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []
  const brand = String(anchor.brand ?? '').trim()

  let rows: OfficeProductRow[] = []
  try {
    const broad = await fetchRowsByNameIlikeWithFallbacks(supabase, '%Cucitri%Pinza%', 500)
    rows = mergeRowsById(broad).filter((row) => {
      const name = String(row.name ?? '')
      if (!isDeskStaplerPinzaName(name)) return false
      if (!brand) return true
      return String(row.brand ?? '').trim().toLowerCase() === brand.toLowerCase()
    })
  } catch {
    rows = []
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const outMap = new Map<string, OfficeProduct>()
  for (const row of rows) {
    let mapped = mapRowToOfficeProduct(row)
    mapped = enrichOfficeProductImageFromVariants(mapped)
    outMap.set(String(mapped.id), attachQuantityTiers(mapped, tiersByProductId))
  }
  outMap.set(String(anchor.id), attachQuantityTiers(enrichOfficeProductImageFromVariants(anchor), tiersByProductId))
  return Array.from(outMap.values()).sort((a, b) =>
    (a.colorName || a.name).localeCompare(b.colorName || b.name, 'it', { sensitivity: 'base' }),
  )
}

export async function fetchEuroCartLacciVariants(anchor: OfficeProduct): Promise<OfficeProduct[]> {
  if (!isEuroCartLacciCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Cartell%lacci%', 520),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Euro%cart%', 520),
    ])
    rows = mergeRowsById([...a, ...b]).filter((row) => {
      const mapped = mapRowToOfficeProduct(row)
      return isEuroCartLacciCatalogProduct(mapped)
    })
  } catch {
    rows = []
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const outMap = new Map<string, OfficeProduct>()
  for (const row of rows) {
    const mapped = attachQuantityTiers(enrichOfficeProductImageFromVariants(mapRowToOfficeProduct(row)), tiersByProductId)
    outMap.set(String(mapped.id), mapped)
  }
  outMap.set(String(anchor.id), attachQuantityTiers(enrichOfficeProductImageFromVariants(anchor), tiersByProductId))
  return Array.from(outMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))
}

export async function fetchImballoProTapeVariants(
  anchor: OfficeProduct,
): Promise<ImballoProTapeVariantSlot[]> {
  if (!isImballoProTapeCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Nastro%adesivo%PVC%5%66%avana%', 160),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Nastro%adesivo%PP36NN%5%66%trasparent%', 160),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Nastro%adesivo%5%66%', 260),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byVariant = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isImballoProTapeCatalogProduct({ name, brand: String(row.brand ?? '') })) continue
    const variantLabel = detectImballoProTapeVariantLabel(name)
    if (!variantLabel) continue
    if (!byVariant.has(variantLabel)) byVariant.set(variantLabel, row)
  }

  const anchorLabel = detectImballoProTapeVariantLabel(anchor.name)
  if (anchorLabel && !byVariant.has(anchorLabel)) {
    byVariant.set(anchorLabel, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: ImballoProTapeVariantSlot[] = []
  for (const variantLabel of IMBALLO_PRO_TAPE_VARIANT_LABELS) {
    const row = byVariant.get(variantLabel)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      variantLabel,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

function officeProductMatchesSearchTerms(p: OfficeProduct, terms: string[]): boolean {
  if (!terms.length) return true
  const fields = officeProductToSearchFields(p)
  const synthetic = terms.filter((t) => t !== 'g84' && t !== 'g85')
  if (synthetic.length > 0 && !searchableProductMatchesAllTerms(fields, synthetic)) {
    return false
  }
  if (terms.includes('g84') && !rowMatchesOxfordG84SearchAlias(p.name)) return false
  if (terms.includes('g85') && !rowMatchesOxfordG85SearchAlias(p.name)) return false
  return true
}

/**
 * Primi risultati per ricerca header (SKU/nome), senza listini — veloce.
 * Due query `.ilike` evitano problemi con virgole nel testo rispetto a `.or()`.
 */
function searchSuggestionsMinChars(terms: string[]): number {
  if (terms.some((t) => /^\d{3,6}$/.test(t))) return 2
  return 2
}

export type OfficeSearchCatalogIndex = {
  products: OfficeProduct[]
  useLocalSearch: boolean
}

/**
 * Scarica il catalogo shop per l'indice autocomplete fuzzy locale (una volta per sessione).
 * L'autocomplete resta istantaneo anche con cataloghi grandi: niente `.ilike` per keystroke.
 */
export async function fetchOfficeSearchCatalogIndex(): Promise<OfficeSearchCatalogIndex> {
  const supabase = getSupabaseBrowserClient()
  const injected = getInjectedLocalCatalogProducts().filter(isGeneralOfficeShopCatalogProduct)

  if (!supabase) {
    setOfficeSearchIndexFromProducts(injected, true)
    return { products: injected, useLocalSearch: true }
  }

  const rows = await fetchShopProductListOrdered(supabase)
  const shop = rows
    .map(mapRowToOfficeProduct)
    .filter(isGeneralOfficeShopCatalogProduct)

  const byId = new Map<string, OfficeProduct>()
  for (const p of shop) byId.set(String(p.id), p)
  for (const p of injected) {
    const id = String(p.id)
    if (!byId.has(id)) byId.set(id, p)
  }
  const products = Array.from(byId.values())
  setOfficeSearchIndexFromProducts(products, true)
  return { products, useLocalSearch: true }
}

export async function fetchOfficeProductSearchSuggestions(
  rawQuery: string,
  limit = 5,
): Promise<OfficeSearchSuggestion[]> {
  const trimmed = rawQuery.trim()
  const terms = tokenizeSearchTerms(trimmed)
  if (terms.length === 0 || trimmed.length < searchSuggestionsMinChars(terms)) {
    return []
  }

  if (shouldUseLocalSearchOnly()) {
    return searchOfficeProductsClient(trimmed, limit)
  }

  const clientHits = searchOfficeProductsClient(trimmed, limit)
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return clientHits

  const esc = escapeIlikePattern(trimmed)
  const pat = `%${esc}%`
  const cap = 24
  const wantsOxfordAlias = searchWantsOxfordModelAlias(terms)
  const oxfordPat = oxfordModelAliasNameIlikePattern()
  const searchPatterns = buildSupabaseIlikePatterns(trimmed)

  const patternFetches = searchPatterns.flatMap((pattern) => [
    fetchShopProductRowsSkuIlike(supabase, pattern, cap),
    fetchShopProductRowsNameIlike(supabase, pattern, cap),
    fetchShopProductRowsDescriptionIlike(supabase, pattern, cap),
    fetchShopProductRowsCategoryIlike(supabase, pattern, cap),
  ])

  const [skuSuggestionRows, nameRows, oxfordNameRows, ...patternRows] = await Promise.all([
    fetchShopProductRowsSkuIlike(supabase, pat, cap),
    fetchShopProductRowsNameIlike(supabase, pat, cap),
    wantsOxfordAlias
      ? fetchShopProductRowsNameIlike(supabase, oxfordPat, Math.max(cap, 80))
      : Promise.resolve([] as OfficeProductRow[]),
    ...patternFetches,
  ])

  const merged = mergeRowsById([
    ...skuSuggestionRows,
    ...nameRows,
    ...oxfordNameRows,
    ...patternRows.flat(),
  ])

  console.log('Prodotti trovati dalla ricerca:', {
    query: trimmed,
    pattern: pat,
    righeSupabaseGrezzo: merged.length,
    campioni: merged.slice(0, 8).map((row) => ({
      name: row.name,
      sku: row.sku,
      category: row.category,
      brand: row.brand,
    })),
  })

  const remoteHits = merged
    .filter((row) => rowMatchesAllTerms(row, terms, true))
    .filter((row) => !isSuppressedShopRow(row))
    .filter((row) => !isExcludedSearchSuggestionRow(row))
    .sort((a, b) => rankSuggestionRow(b, terms, trimmed) - rankSuggestionRow(a, terms, trimmed))
    .map(mapRowToSuggestion)

  console.log('Prodotti trovati dalla ricerca (dopo filtri):', {
    query: trimmed,
    remoteHits: remoteHits.length,
    clientHits: clientHits.length,
    risultati: remoteHits.slice(0, 8).map((s) => s.name),
  })

  const byId = new Map<string, OfficeSearchSuggestion>()
  for (const hit of clientHits) {
    if (
      !isExcludedFromOfficeSearchSuggestions({
        id: hit.id,
        producerCode: hit.producerCode,
        name: hit.name,
        brand: hit.brand,
        category: '',
        mainFeatures: {},
      })
    ) {
      byId.set(hit.id, hit)
    }
  }
  for (const hit of remoteHits) {
    if (!byId.has(hit.id)) byId.set(hit.id, hit)
  }
  return [...byId.values()]
    .sort(
      (a, b) =>
        scoreSearchableProduct(
          {
            name: b.name,
            brand: b.brand,
            sku: b.producerCode,
            id: b.id,
            category: b.category,
            subcategory: b.subcategory,
            colorName: b.colorName,
          },
          terms,
          trimmed,
        ) -
        scoreSearchableProduct(
          {
            name: a.name,
            brand: a.brand,
            sku: a.producerCode,
            id: a.id,
            category: a.category,
            subcategory: a.subcategory,
            colorName: a.colorName,
          },
          terms,
          trimmed,
        ),
    )
    .slice(0, limit)
}

function attachQuantityTiers(
  product: OfficeProduct,
  tiersByProductId: Map<string, QuantityPriceTier[]>,
): OfficeProduct {
  if (isOxfordBinderName(product.name)) {
    return applyOxfordPricing(product)
  }
  if (isStarlinePunchedEnvelopeName(product.name)) {
    return applyStarlinePunchedEnvelopePricing(product)
  }
  if (isStarboxRaccoglitoreName(product.name)) {
    return {
      ...product,
      price: STARBOX_BASE_PRICE,
      quantityPriceTiers: STARBOX_QUANTITY_TIERS.map((t) => ({ ...t })),
    }
  }
  const idKey = normalizeQuantityPriceProductKey(product.id)
  const skuKey = normalizeQuantityPriceProductKey(product.producerCode)
  const tiers =
    tiersByProductId.get(idKey) ??
    (skuKey !== idKey ? tiersByProductId.get(skuKey) : undefined) ??
    []
  if (!tiers.length) return product
  return { ...product, quantityPriceTiers: tiers.map((t) => ({ ...t })) }
}

/** Se un solo SKU della famiglia ha righe in `product_quantity_prices`, riusa lo stesso listino per gli altri. */
function propagateSharedQuantityTiersAmongFamily(products: OfficeProduct[]): OfficeProduct[] {
  const donor = products.find((p) => (p.quantityPriceTiers?.length ?? 0) > 0)
  const shared = donor?.quantityPriceTiers
  if (!shared?.length) return products
  const copy = shared.map((t) => ({ ...t }))
  return products.map((p) =>
    p.quantityPriceTiers?.length ? p : { ...p, quantityPriceTiers: copy },
  )
}

export async function fetchOfficeProductsFromSupabase(
  _categoryFromUrl?: string | null,
  searchFromUrl?: string | null,
): Promise<OfficeProduct[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    throw new Error(
      'Supabase non configurato (mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
    )
  }

  const trimmedSearch = searchFromUrl?.trim()

  if (trimmedSearch) {
    const terms = tokenizeSearchTerms(trimmedSearch)
    const searchPatterns = buildSupabaseIlikePatterns(trimmedSearch)
    const esc = escapeIlikePattern(trimmedSearch)
    const pat = `%${esc}%`
    const isUuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      trimmedSearch,
    )
    const wantsOxfordAlias = searchWantsOxfordModelAlias(terms)
    const oxfordPat = oxfordModelAliasNameIlikePattern()

    const patternFetches = searchPatterns.flatMap((pattern) => [
      fetchShopProductRowsSkuIlike(supabase, pattern, 80),
      fetchShopProductRowsNameIlike(supabase, pattern, 80),
      fetchShopProductRowsDescriptionIlike(supabase, pattern, 80),
      fetchShopProductRowsCategoryIlike(supabase, pattern, 80),
    ])

    const [skuRows, nameRows, legCode, legName, quantityFetch, legOxford, oxfordShopRows, ...extraPatternRows] =
      await Promise.all([
        fetchShopProductRowsSkuIlike(supabase, pat, 80),
        fetchShopProductRowsNameIlike(supabase, pat, 80),
        isUuidLike
          ? supabase
              .from(LEGACY_OFFICE_TABLE)
              .select(LEGACY_OFFICE_LIST_COLUMNS)
              .eq('id', trimmedSearch)
              .limit(1)
          : Promise.resolve({ data: [] as OfficeProductsLegacyRow[], error: null }),
        supabase
          .from(LEGACY_OFFICE_TABLE)
          .select(LEGACY_OFFICE_LIST_COLUMNS)
          .ilike('name', pat)
          .limit(80),
        fetchQuantityPriceTiersByProductId(),
        wantsOxfordAlias
          ? supabase
              .from(LEGACY_OFFICE_TABLE)
              .select(LEGACY_OFFICE_LIST_COLUMNS)
              .ilike('name', oxfordPat)
              .limit(80)
          : Promise.resolve({ data: [] as OfficeProductsLegacyRow[], error: null }),
        wantsOxfordAlias
          ? fetchShopProductRowsNameIlike(supabase, oxfordPat, 120)
          : Promise.resolve([] as OfficeProductRow[]),
        ...patternFetches,
      ])

    const { tiersByProductId } = quantityFetch

    const legacyRaw: OfficeProductsLegacyRow[] = []
    if (legCode.error) {
      console.error('Errore Supabase:', legCode.error)
      logSupabasePostgrestError('office_products ilike id', legCode.error)
    } else {
      legacyRaw.push(...((legCode.data ?? []) as OfficeProductsLegacyRow[]))
    }
    if (legName.error) {
      console.error('Errore Supabase:', legName.error)
      logSupabasePostgrestError('office_products ilike name', legName.error)
    } else {
      legacyRaw.push(...((legName.data ?? []) as OfficeProductsLegacyRow[]))
    }
    if (legOxford.error) {
      console.error('Errore Supabase:', legOxford.error)
      logSupabasePostgrestError('office_products ilike name (Oxford alias)', legOxford.error)
    } else {
      legacyRaw.push(...((legOxford.data ?? []) as OfficeProductsLegacyRow[]))
    }

    const legacyMapped = mergeLegacyRowsById(legacyRaw)
      .map(mapLegacyOfficeRowToOfficeProduct)
      .filter((p) => officeProductMatchesSearchTerms(p, terms))

    const merged = mergeRowsById([
      ...skuRows,
      ...nameRows,
      ...oxfordShopRows,
      ...extraPatternRows.flat(),
    ]).filter((row) => rowMatchesAllTerms(row, terms))

    const shopProducts = merged.map(mapRowToOfficeProduct)
    const combined = mergeCatalogLists(legacyMapped, shopProducts, terms)
    const withTiers = combined.map((p) => attachQuantityTiers(p, tiersByProductId))
    console.log('Prodotti caricati:', withTiers)
    return withTiers
  }

  const [legacyResult, quantityFetch] = await Promise.all([
    supabase.from(LEGACY_OFFICE_TABLE).select(LEGACY_OFFICE_LIST_COLUMNS).order('name'),
    fetchQuantityPriceTiersByProductId(),
  ])

  const { tiersByProductId } = quantityFetch

  const shopRows = await fetchShopProductListOrdered(supabase)

  let legacyList: OfficeProduct[] = []
  if (legacyResult.error) {
    console.error('Errore Supabase:', legacyResult.error)
    logSupabasePostgrestError('office_products order name', legacyResult.error)
  } else {
    legacyList = ((legacyResult.data ?? []) as OfficeProductsLegacyRow[]).map(
      mapLegacyOfficeRowToOfficeProduct,
    )
  }

  const shopProducts = shopRows.map(mapRowToOfficeProduct)
  const combined = mergeCatalogLists(legacyList, shopProducts)
  const withTiers = combined.map((p) => attachQuantityTiers(p, tiersByProductId))
  console.log('Prodotti caricati:', withTiers)
  return withTiers
}

/**
 * Vetrina home: pool remoto limitato (nome A-Z), senza scaricare i listini quantità
 * (evita il fetch completo di `product_quantity_prices` che può bloccare la UI).
 */
export async function fetchOfficeProductsShowcase(limit = 8): Promise<OfficeProduct[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const n = Math.min(96, Math.max(1, limit))
  /** Pool più ampio del risultato finale: così restano abbastanza prodotti dopo i filtri home. */
  const fetchPool = Math.min(180, Math.max(n * 2, 48))
  const now = Date.now()
  const showcaseKey = `${OFFICE_CATALOG_DATA_REVISION}:${n}`
  const cached = showcaseMemoryCache.get(showcaseKey)
  if (cached && now - cached.fetchedAt < SHOWCASE_MEM_TTL_MS) {
    return cached.data
  }

  const [legacyResult, shopRows] = await Promise.all([
    supabase
      .from(LEGACY_OFFICE_TABLE)
      .select(LEGACY_OFFICE_LIST_COLUMNS)
      .order('name')
      .limit(fetchPool),
    fetchShopProductListOrdered(supabase, fetchPool),
  ])

  let legacyList: OfficeProduct[] = []
  if (legacyResult.error) {
    console.error('Errore Supabase:', legacyResult.error)
    logSupabasePostgrestError('office_products showcase', legacyResult.error)
  } else {
    legacyList = ((legacyResult.data ?? []) as OfficeProductsLegacyRow[]).map(
      mapLegacyOfficeRowToOfficeProduct,
    )
  }

  const shopProducts = shopRows.map(mapRowToOfficeProduct)
  const combined = mergeCatalogLists(legacyList, shopProducts)
    .filter((p) => Boolean((p.imageUrl ?? '').trim()) && Boolean(p.name?.trim()))
    .slice(0, n)
  debugLogVetrinaProdottiNomi(combined)
  console.log('Prodotti recuperati (vetrina):', combined)
  showcaseMemoryCache.set(showcaseKey, { fetchedAt: now, data: combined })
  return combined
}

/**
 * Pool economico per upsell carrello: `products` con prezzo imponibile ≤ maxUnitImponibile
 * e immagine presente. Ordine per prezzo; lo shuffle resta al chiamante.
 */
export async function fetchCheapOfficeProductsForUpsell(
  maxUnitImponibile = 15,
  poolLimit = 80,
): Promise<OfficeProduct[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const cap = Math.min(120, Math.max(12, poolLimit))
  const maxPrice = Math.max(0.01, maxUnitImponibile)

  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    if (!cols.includes('price')) continue
    const hasImageCol = cols.includes('image_url')
    try {
      let q = supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .gt('price', 0)
        .lte('price', maxPrice)

      if (hasImageCol) {
        q = q.not('image_url', 'is', null)
      }

      const res = await q.order('price', { ascending: true }).limit(cap)
      if (res.error) {
        if (isMissingColumnPostgrestError(res.error)) continue
        console.warn('[officeProducts] upsell cheap pool:', res.error)
        return []
      }

      return ((res.data ?? []) as unknown as OfficeProductRow[])
        .map(mapRowToOfficeProduct)
        .filter((p) => {
          const price = Number(p.price)
          if (!Number.isFinite(price) || price <= 0 || price > maxPrice) return false
          return Boolean((p.imageUrl ?? '').trim()) && Boolean(p.name?.trim())
        })
    } catch (e) {
      console.warn('[officeProducts] upsell cheap pool (eccezione):', e)
    }
  }

  return []
}

/** Evita `.eq('id', …)` con SKU tipo `IMPULSE75-A4` su colonna `id` uuid (22P02 / 400). */
function looksLikePostgresUuid(s: string): boolean {
  const t = s.trim()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)
}

function shouldLookupProductByPrimaryId(key: string): boolean {
  const t = key.trim()
  return looksLikePostgresUuid(t) || /^\d+$/.test(t)
}

/** Log strutturato per debug (console del browser): messaggio PostgREST + oggetto originale. */
function logSupabasePostgrestError(context: string, error: unknown) {
  if (error == null) return
  const o =
    error && typeof error === 'object' ? (error as Record<string, unknown>) : {}
  console.error(
    `[${context}] Errore Supabase (PostgREST, JSON):`,
    JSON.stringify(
      {
        message: o.message,
        code: o.code,
        details: o.details,
        hint: o.hint,
      },
      null,
      2,
    ),
  )
  console.error(`[${context}] Oggetto errore completo:`, error)
}

/** Colonna / relazione assente nello schema (non bloccare: ripeti con select ridotto). */
function isMissingColumnPostgrestError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const o = error as { message?: string; details?: string; hint?: string; code?: string }
  const text = `${o.message ?? ''} ${o.details ?? ''} ${o.hint ?? ''}`.toLowerCase()
  const code = String(o.code ?? '')
  if (code === '42703') return true
  if (code.startsWith('PGRST') && (text.includes('column') || text.includes('schema'))) return true
  if (text.includes('does not exist')) {
    if (text.includes('column') || text.includes('relation')) return true
  }
  if (text.includes('could not find')) {
    if (text.includes('column') || text.includes("'")) return true
  }
  if (text.includes('unknown') && text.includes('column')) return true
  return false
}

type ShopSupabase = NonNullable<ReturnType<typeof getSupabaseBrowserClient>>

async function fetchShopProductRowsNameIlike(
  supabase: ShopSupabase,
  pat: string,
  cap: number,
): Promise<OfficeProductRow[]> {
  return fetchShopProductRowsColumnIlike(supabase, 'name', pat, cap)
}

async function fetchShopProductRowsDescriptionIlike(
  supabase: ShopSupabase,
  pat: string,
  cap: number,
): Promise<OfficeProductRow[]> {
  return fetchShopProductRowsColumnIlike(supabase, 'description', pat, cap)
}

async function fetchShopProductRowsCategoryIlike(
  supabase: ShopSupabase,
  pat: string,
  cap: number,
): Promise<OfficeProductRow[]> {
  return fetchShopProductRowsColumnIlike(supabase, 'category', pat, cap)
}

async function fetchShopProductRowsColumnIlike(
  supabase: ShopSupabase,
  column: 'name' | 'description' | 'category' | 'sku',
  pat: string,
  cap: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    const res = await supabase
      .from(SHOP_PRODUCTS_TABLE)
      .select(cols)
      .ilike(column, pat)
      .limit(cap)
    if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
    const msg = `${(res.error as { message?: string }).message ?? ''}`.toLowerCase()
    if (isMissingColumnPostgrestError(res.error)) {
      if (msg.includes(column)) return []
      continue
    }
    console.warn(`[officeProducts] ${column} ilike:`, res.error)
    return []
  }
  return []
}

/** Se `sku` non esiste in tabella, nessun tentativo con select diverso serve: restituisci []. */
async function fetchShopProductRowsSkuIlike(
  supabase: ShopSupabase,
  pat: string,
  cap: number,
): Promise<OfficeProductRow[]> {
  return fetchShopProductRowsColumnIlike(supabase, 'sku', pat, cap)
}

/** Lista `products` ordinata per nome, con select che si adatta alle colonne presenti. */
async function fetchShopProductListOrdered(
  supabase: ShopSupabase,
  maxRows?: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    let q = supabase.from(SHOP_PRODUCTS_TABLE).select(cols).order('name', { ascending: true })
    if (maxRows != null) q = q.limit(maxRows)
    const res = await q
    if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
    if (!isMissingColumnPostgrestError(res.error)) {
      console.warn('[officeProducts] lista shop:', res.error)
      return []
    }
  }
  return []
}

async function fetchShopProductsExcludeId(
  supabase: ShopSupabase,
  excludeId: string,
  limit: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    const res = await supabase
      .from(SHOP_PRODUCTS_TABLE)
      .select(cols)
      .neq('id', excludeId)
      .order('name', { ascending: true })
      .limit(limit)
    if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
    if (!isMissingColumnPostgrestError(res.error)) {
      console.warn('[officeProducts] correlati shop:', res.error)
      return []
    }
  }
  return []
}

async function fetchProductRowBySkuWithSelectFallbacks(
  supabase: ShopSupabase,
  skuPattern: string,
): Promise<OfficeProductRow | null> {
  let lastSchemaError: unknown
  for (const cols of PRODUCT_DETAIL_SELECT_FALLBACKS) {
    const res = await supabase
      .from(SHOP_PRODUCTS_TABLE)
      .select(cols)
      .ilike('sku', skuPattern)
      .limit(1)
      .maybeSingle()

    if (!res.error) {
      return (res.data as OfficeProductRow | null) ?? null
    }
    if (isMissingColumnPostgrestError(res.error)) {
      const msg = `${(res.error as { message?: string }).message ?? ''}`.toLowerCase()
      if (msg.includes('sku')) {
        console.warn(
          '[officeProducts] Colonna sku assente: ricerca per sku disabilitata.',
          res.error,
        )
        return null
      }
      lastSchemaError = res.error
      console.warn(
        '[officeProducts] Colonna assente nello schema, select ridotto (dettaglio sku):',
        (res.error as { message?: string }).message ?? res.error,
      )
      continue
    }
    logSupabasePostgrestError('fetchOfficeProductByIdentifier → sku ilike', res.error)
    throw res.error
  }
  if (lastSchemaError) {
    logSupabasePostgrestError(
      'fetchOfficeProductByIdentifier → sku ilike (ultimo tentativo)',
      lastSchemaError,
    )
    return null
  }
  return null
}

async function fetchProductRowByIdWithSelectFallbacks(
  supabase: ShopSupabase,
  idKey: string,
): Promise<OfficeProductRow | null> {
  let lastSchemaError: unknown
  for (const cols of PRODUCT_DETAIL_SELECT_FALLBACKS) {
    const res = await supabase
      .from(SHOP_PRODUCTS_TABLE)
      .select(cols)
      .eq('id', idKey)
      .limit(1)
      .maybeSingle()

    if (!res.error) {
      return (res.data as OfficeProductRow | null) ?? null
    }
    if (isMissingColumnPostgrestError(res.error)) {
      lastSchemaError = res.error
      console.warn(
        '[officeProducts] Colonna assente nello schema, select ridotto (dettaglio id):',
        (res.error as { message?: string }).message ?? res.error,
      )
      continue
    }
    logSupabasePostgrestError('fetchOfficeProductByIdentifier → id eq', res.error)
    throw res.error
  }
  if (lastSchemaError) {
    logSupabasePostgrestError(
      'fetchOfficeProductByIdentifier → id eq (ultimo tentativo)',
      lastSchemaError,
    )
    return null
  }
  return null
}

/**
 * Carica un prodotto da `public.products` senza filtri extra (nessun active/published).
 * Immagine: colonna `image_url` → `OfficeProduct.imageUrl`.
 * SKU: `.ilike` case-insensitive su `sku` (pattern letterale; `.limit(1)` se più match).
 * Fallback `id`: solo se la chiave sembra UUID (o intero), mai per codici tipo `IMPULSE75-A4`.
 */
export async function fetchOfficeProductByIdentifier(
  idOrSku: string,
): Promise<OfficeProduct | null> {
  const key = decodeProductPathParam(idOrSku)
  if (!key) return null

  const synthetic = resolveSyntheticOfficeProductByCatalogKey(key)
  if (synthetic) {
    return synthetic
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    throw new Error(
      'Supabase non configurato (mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
    )
  }

  let row: OfficeProductRow | null = null

  const skuPattern = escapeIlikePattern(key)
  row = await fetchProductRowBySkuWithSelectFallbacks(supabase, skuPattern)

  if (!row && shouldLookupProductByPrimaryId(key)) {
    row = await fetchProductRowByIdWithSelectFallbacks(supabase, key)
  }

  if (!row) {
    // Fallback solo se il SKU storico del configuratore non è ancora in DB.
    if (timbroMatchesUrlKey(key)) {
      return buildTimbroAziendeFarmacieOfficeProduct()
    }
    console.error(
      '[fetchOfficeProductByIdentifier] Nessun prodotto trovato (0 righe).',
      JSON.stringify(
        {
          chiaveRicerca: key,
          skuIlikePattern: skuPattern,
          note:
            'Le query hanno risposto senza errori bloccanti ma senza dati; controlla sku/id in public.products e RLS.',
        },
        null,
        2,
      ),
    )
    return null
  }

  let product = mapRowToOfficeProduct(row)
  if (detectStarlineCartellinaModelKindFromNameAndBrand(product.name, product.brand)) {
    product = enrichOfficeProductImageFromVariants(product)
  }
  const { tiersByProductId } = await fetchQuantityPriceTiersByProductId()
  return attachQuantityTiers(product, tiersByProductId)
}

/**
 * Tutti i prodotti con lo stesso `parent_sku` (famiglia colori / varianti),
 * incluso il prodotto corrente se presente in tabella.
 */
export async function fetchProductFamilyByParentSku(
  parentSku: string,
): Promise<OfficeProduct[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const key = parentSku.trim()
  if (!key) return []

  const familyRowsPromise = (async (): Promise<OfficeProductRow[]> => {
    let lastFamilySchemaError: unknown
    for (const cols of FAMILY_SELECT_FALLBACKS) {
      const productsResult = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .eq('parent_sku', key)
        .order('name', { ascending: true })

      if (!productsResult.error) {
        return ((productsResult.data ?? []) as unknown as OfficeProductRow[])
      }
      const famMsg = `${(productsResult.error as { message?: string }).message ?? ''}`.toLowerCase()
      if (
        famMsg.includes('parent_sku') &&
        (famMsg.includes('does not exist') ||
          famMsg.includes('could not find') ||
          famMsg.includes('unknown'))
      ) {
        console.warn(
          '[officeProducts] Colonna parent_sku assente: famiglia non caricata da DB.',
          productsResult.error,
        )
        return []
      }
      if (isMissingColumnPostgrestError(productsResult.error)) {
        lastFamilySchemaError = productsResult.error
        console.warn(
          '[officeProducts] Colonna assente nello schema, select ridotto (famiglia parent_sku):',
          (productsResult.error as { message?: string }).message ?? productsResult.error,
        )
        continue
      }
      console.warn('products famiglia parent_sku:', productsResult.error)
      return []
    }
    if (lastFamilySchemaError) {
      console.warn(
        '[officeProducts] Famiglia non caricata (schema):',
        (lastFamilySchemaError as { message?: string }).message ?? lastFamilySchemaError,
      )
    }
    return []
  })()

  const [rows, quantityFetch] = await Promise.all([
    familyRowsPromise,
    fetchQuantityPriceTiersByProductId(),
  ])
  const { tiersByProductId } = quantityFetch
  const mapped = rows.map(mapRowToOfficeProduct).map((p) => attachQuantityTiers(p, tiersByProductId))
  return propagateSharedQuantityTiersAmongFamily(mapped)
}

/** Pool candidati buste forate: abbastanza righe per coprire i 4 modelli dopo filtro lato client. */
const PUNCHED_ENVELOPE_KEYWORD_POOL_LIMIT = 150

export type PunchedEnvelopeVariantSlot = {
  patternNeedle: string
  label: string
  product: OfficeProduct
}

export type StarboxColorVariantSlot = {
  color: string
  thicknessCm: number | null
  product: OfficeProduct
}

export type OxfordG85VariantSlot = StarboxColorVariantSlot
export type StabiloOhpenVariantSlot = {
  color: string
  tipMm: number
  product: OfficeProduct
}

function normName(name: string): string {
  return String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function hasMediumToken(n: string): boolean {
  return /\bmedium\b/.test(n) || /\bmed\b/.test(n) || n.includes('medium')
}

function hasTopToken(n: string): boolean {
  return /\btop\b/.test(n)
}

function hasBucciaSurface(n: string): boolean {
  return n.includes('buccia') || n.includes('buce')
}

/** Liscio / liscia / lisce / abbreviazioni comuni (solo `name`, nessun filtro categoria). */
function hasLiscioSurface(n: string): boolean {
  return (
    n.includes('liscio') ||
    n.includes('liscia') ||
    n.includes('lisce') ||
    n.includes('lisci ') ||
    n.includes(' lisci') ||
    /\blisci\b/.test(n) ||
    /\blisc\b/.test(n)
  )
}

function hasMediumAndLiscioInName(n: string): boolean {
  return hasMediumToken(n) && hasLiscioSurface(n) && !hasTopToken(n)
}

/** Seconda chance per «Medium liscio» se il titolo usa varianti ortografiche. */
function matchMediumLiscioSoft(n: string): boolean {
  if (hasMediumAndLiscioInName(n)) return true
  const l =
    hasLiscioSurface(n) || n.includes('lisc') || n.includes('lisce') || n.includes('liscia')
  return (hasMediumToken(n) || /\bmed\b/.test(n)) && l && !hasTopToken(n)
}

function officeProductToPunchedRow(p: OfficeProduct): OfficeProductRow {
  return {
    id: p.id,
    sku: null,
    name: p.name,
    price: p.price ?? null,
    image_url: p.imageUrl || null,
    category: p.category,
    format: (p.format ?? '').trim() || null,
  }
}

/** Normalizza trattini/spazi così «Medium - liscio» e «Medium liscio» coincidono nel matching. */
function normNameForPunchedEnvelope(name: string): string {
  return normName(String(name ?? ''))
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STARBOX_COLOR_TERMS: Array<{ label: string; needles: string[] }> = [
  { label: 'Nero', needles: ['nero'] },
  { label: 'Blu', needles: ['blu'] },
  { label: 'Rosso', needles: ['rosso'] },
  { label: 'Lime', needles: ['lime'] },
  { label: 'Verde', needles: ['verde'] },
  { label: 'Marrone', needles: ['marrone', 'brown'] },
  { label: 'Giallo', needles: ['giallo'] },
  { label: 'Bianco', needles: ['bianco', 'white'] },
  { label: 'Azzurro', needles: ['azzurro', 'celeste', 'cyan'] },
  { label: 'Fucsia', needles: ['fucsia', 'magenta'] },
  { label: 'Arancio', needles: ['arancio', 'arancione', 'orange'] },
  { label: 'Viola', needles: ['viola'] },
  { label: 'Lilla', needles: ['lilla'] },
]
const OXFORD_5CM_ALLOWED_COLORS = new Set(['Blu', 'Rosso', 'Verde', 'Giallo'])

function isRaccoglitoreName(name: string): boolean {
  const n = normName(name)
  return n.includes('raccoglitore') || n.includes('raccoglitori')
}

export function detectStarboxColorLabel(name: string): string | null {
  const n = normName(name)
  for (const item of STARBOX_COLOR_TERMS) {
    if (item.needles.some((needle) => n.includes(needle))) return item.label
  }
  return null
}

function detectStarboxThicknessCm(name: string): number | null {
  const n = normName(name)
  const m = n.match(/(\d{1,2})\s*cm\b/)
  if (!m) return null
  const value = Number.parseInt(m[1], 10)
  return Number.isFinite(value) ? value : null
}

async function fetchRowsByNameIlikeWithFallbacks(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  pattern: string,
  limit: number,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .ilike('name', pattern)
        .order('name', { ascending: true })
        .limit(limit)
      if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
      if (isMissingColumnPostgrestError(res.error)) continue
      return []
    } catch {
      return []
    }
  }
  return []
}

/** Carica le 6 righe scatola archivio Starline per SKU noto (anche se il titolo non matcha il pattern). */
async function fetchStarlineArchiveRowsByKnownSkus(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
): Promise<OfficeProductRow[]> {
  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .in('sku', STARLINE_ARCHIVE_BOX_SKUS_LIST)
        .order('name', { ascending: true })
        .limit(32)
      if (!res.error) return (res.data ?? []) as unknown as OfficeProductRow[]
      if (isMissingColumnPostgrestError(res.error)) continue
      return []
    } catch {
      return []
    }
  }
  return []
}

/**
 * Candidati buste forate: `name` contiene almeno una tra Medium, Top, Buccia, Liscio (OR, case-insensitive).
 * Prova i select in cascade se una colonna opzionale manca; non blocca il caricamento.
 */
async function fetchPunchedEnvelopeCandidateRows(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
): Promise<OfficeProductRow[]> {
  const keywords = ['Medium', 'Top', 'Buccia', 'Liscio', 'Lisce', 'Liscia'] as const
  const orFilter = keywords
    .map((k) => `name.ilike.%${escapeIlikePattern(k)}%`)
    .join(',')

  for (const cols of PRODUCT_SHOP_SELECT_FALLBACKS) {
    try {
      const res = await supabase
        .from(SHOP_PRODUCTS_TABLE)
        .select(cols)
        .or(orFilter)
        .order('name', { ascending: true })
        .limit(PUNCHED_ENVELOPE_KEYWORD_POOL_LIMIT)

      if (!res.error) {
        return (res.data ?? []) as unknown as OfficeProductRow[]
      }
      if (isMissingColumnPostgrestError(res.error)) {
        console.warn('[punched-envelope] select ridotto (colonna assente):', res.error)
        continue
      }
      console.warn('[punched-envelope] query candidati:', res.error)
      return []
    } catch (e) {
      console.warn('[punched-envelope] query candidati (eccezione):', e)
    }
  }
  return []
}

function mergeAnchorPunchedRow(rows: OfficeProductRow[], anchor: OfficeProduct): OfficeProductRow[] {
  const aid = String(anchor.id)
  if (rows.some((r) => String(r.id) === aid)) return rows
  return [officeProductToPunchedRow(anchor), ...rows]
}

type PunchedModelKey = 'medium-buccia' | 'top-buccia' | 'medium-liscio' | 'top-liscio'

type PunchedModelSlotDef = {
  key: PunchedModelKey
  label: string
  match: (n: string) => boolean
  matchSoft?: (n: string) => boolean
}

/** I 4 modelli fissi (etichette sotto icona). */
const PUNCHED_ENVELOPE_MODEL_SLOTS: readonly PunchedModelSlotDef[] = [
  {
    key: 'medium-buccia',
    label: 'Medium - Buccia',
    match: (n) => hasMediumToken(n) && hasBucciaSurface(n) && !hasTopToken(n),
  },
  {
    key: 'top-buccia',
    label: 'Top - Buccia',
    match: (n) => hasTopToken(n) && hasBucciaSurface(n),
  },
  {
    key: 'medium-liscio',
    label: 'Medium - Liscio',
    match: (n) => hasMediumAndLiscioInName(n),
    matchSoft: matchMediumLiscioSoft,
  },
  {
    key: 'top-liscio',
    label: 'Top - Liscio',
    match: (n) => hasTopToken(n) && hasLiscioSurface(n),
  },
]

function anchorFitsSlot(anchor: OfficeProduct, def: PunchedModelSlotDef): boolean {
  const n = normNameForPunchedEnvelope(anchor.name)
  return def.match(n) || (def.matchSoft?.(n) ?? false)
}

/**
 * Variant buste forate: pool da `name` (OR Medium|Top|Buccia|Liscio) + slot fissi lato client.
 * Select solo colonne shop reali; errore su un tentativo di select ridotto non blocca il resto.
 */
export async function fetchPunchedEnvelopeModelVariants(
  anchor: OfficeProduct,
): Promise<PunchedEnvelopeVariantSlot[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const anchorImg = anchor.imageUrl?.trim() ?? ''
  const anchorId = String(anchor.id)

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId']
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch (e) {
    console.warn('[punched-envelope] listini quantità non caricati:', e)
    tiersByProductId = new Map()
  }

  let rawRows = await fetchPunchedEnvelopeCandidateRows(supabase)
  rawRows = mergeAnchorPunchedRow(rawRows, anchor)

  const varianti = rawRows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category ?? null,
  }))
  console.log('Varianti trovate nel DB:', varianti)

  const usedIds = new Set<string>()
  const slots: PunchedEnvelopeVariantSlot[] = []

  for (const def of PUNCHED_ENVELOPE_MODEL_SLOTS) {
    const rowNorm = (r: OfficeProductRow) => normNameForPunchedEnvelope(String(r.name ?? ''))

    const pickCandidates = (pred: (n: string) => boolean) =>
      rawRows
        .filter((r) => !usedIds.has(String(r.id)))
        .filter((r) => pred(rowNorm(r)))
        .sort((a, b) => String(a.name).localeCompare(String(b.name), 'it'))

    let candidates = pickCandidates(def.match)
    if (candidates.length === 0 && def.matchSoft) {
      candidates = pickCandidates(def.matchSoft)
    }

    let pick: OfficeProductRow | null = candidates[0] ?? null

    if (!pick && anchorFitsSlot(anchor, def)) {
      pick = officeProductToPunchedRow(anchor)
    }

    if (!pick) continue
    const pid = String(pick.id)
    if (usedIds.has(pid)) continue
    usedIds.add(pid)

    const mapped = pid === anchorId ? anchor : mapRowToOfficeProduct(pick)
    const merged: OfficeProduct = {
      ...mapped,
      imageUrl: (mapped.imageUrl ?? '').trim() || anchorImg,
    }

    slots.push({
      patternNeedle: def.key,
      label: def.label,
      product: attachQuantityTiers(merged, tiersByProductId),
    })
  }

  return slots
}

export async function fetchStarlinePunchedEnvelopeVariantBySelection(
  anchor: OfficeProduct,
  selection: { thickness: 'medio' | 'pesante'; finish: 'goffrata' | 'liscia' },
): Promise<OfficeProduct | null> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null

  const qualityToken = selection.thickness === 'medio' ? 'Medium' : 'Top'
  const finishToken = selection.finish === 'goffrata' ? 'Buccia' : 'Liscio'

  const patternA = `%Buste%Forate%${escapeIlikePattern(qualityToken)}%${escapeIlikePattern(finishToken)}%`
  const patternB = `%Starline%${escapeIlikePattern(qualityToken)}%${escapeIlikePattern(finishToken)}%`
  const patternC = `%${escapeIlikePattern(qualityToken)}%${escapeIlikePattern(finishToken)}%`

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, patternA, 60),
      fetchRowsByNameIlikeWithFallbacks(supabase, patternB, 60),
      fetchRowsByNameIlikeWithFallbacks(supabase, patternC, 80),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }
  if (!rows.length) return null

  const pick = rows.find((r) => {
    const n = normNameForPunchedEnvelope(String(r.name ?? ''))
    const isTargetQuality =
      selection.thickness === 'medio' ? hasMediumToken(n) && !hasTopToken(n) : hasTopToken(n)
    const isTargetFinish =
      selection.finish === 'goffrata' ? hasBucciaSurface(n) : hasLiscioSurface(n)
    return isTargetQuality && isTargetFinish
  })
  if (pick) return attachQuantityTiers(mapRowToOfficeProduct(pick), new Map())

  const fallback = rows.find((r) => {
    const n = normNameForPunchedEnvelope(String(r.name ?? ''))
    if (selection.thickness === 'medio' && hasTopToken(n)) return false
    if (selection.thickness === 'pesante' && hasMediumToken(n) && !hasTopToken(n)) return false
    if (selection.finish === 'goffrata' && !hasBucciaSurface(n)) return false
    if (selection.finish === 'liscia' && !hasLiscioSurface(n)) return false
    return true
  })

  if (fallback) return attachQuantityTiers(mapRowToOfficeProduct(fallback), new Map())
  return anchor
}

/**
 * Varianti colore raccoglitori Starbox:
 * - query base semplice su `name` con prefisso "Raccoglitore%"
 * - select pulita `id, name, description, price, category, image_url`
 * - in caso di errore: silent fail (nessun crash pagina)
 */
export async function fetchStarboxColorVariants(anchor: OfficeProduct): Promise<StarboxColorVariantSlot[]> {
  if (!isRaccoglitoreName(anchor.name)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    rows = await fetchRowsByNameIlikeWithFallbacks(supabase, 'Raccoglitore%', 120)
  } catch {
    return []
  }

  const byColorAndThickness = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const color = detectStarboxColorLabel(String(row.name ?? ''))
    if (!color) continue
    if (!isRaccoglitoreName(String(row.name ?? ''))) continue
    const thicknessCm = detectStarboxThicknessCm(String(row.name ?? ''))
    const key = `${thicknessCm ?? 0}:${color}`
    if (!byColorAndThickness.has(key)) byColorAndThickness.set(key, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  if (anchorColor) {
    const anchorThickness = detectStarboxThicknessCm(anchor.name)
    const anchorKey = `${anchorThickness ?? 0}:${anchorColor}`
    if (!byColorAndThickness.has(anchorKey)) {
      byColorAndThickness.set(anchorKey, officeProductToPunchedRow(anchor))
    }
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const orderedColors = STARBOX_COLOR_TERMS.map((c) => c.label)
  const out: StarboxColorVariantSlot[] = []
  for (const thicknessCm of [5, 8] as const) {
    for (const color of orderedColors) {
      const row = byColorAndThickness.get(`${thicknessCm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        color,
        thicknessCm,
        product: attachQuantityTiers(
          { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
          tiersByProductId,
        ),
      })
    }
  }

  // Fallback per righe senza spessore esplicito nel nome (mantiene compatibilità storica).
  for (const color of orderedColors) {
    const row = byColorAndThickness.get(`0:${color}`)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(
        { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
        tiersByProductId,
      ),
    })
  }
  return out
}

export async function fetchOxfordG85Variants(anchor: OfficeProduct): Promise<OxfordG85VariantSlot[]> {
  if (!isOxfordBinderName(anchor.name)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [baseG85Rows, baseG84Rows, rows5cmG84, rows5cmFallbackG85] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Registratore Oxford G85%', 160),
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Registratore Oxford G84%', 120),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Registratore Oxford G84%5 cm%', 120),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Registratore Oxford G85%5 cm%', 120),
    ])
    rows = mergeRowsById([...baseG85Rows, ...baseG84Rows, ...rows5cmG84, ...rows5cmFallbackG85])
  } catch {
    return []
  }

  const byColorAndThickness = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isOxfordBinderName(name)) continue
    const color = detectStarboxColorLabel(name)
    if (!color) continue
    const thicknessCm = detectStarboxThicknessCm(name)
    const key = `${thicknessCm ?? 0}:${color}`
    if (!byColorAndThickness.has(key)) byColorAndThickness.set(key, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  if (anchorColor) {
    const anchorThickness = detectStarboxThicknessCm(anchor.name)
    const anchorKey = `${anchorThickness ?? 0}:${anchorColor}`
    if (!byColorAndThickness.has(anchorKey)) {
      byColorAndThickness.set(anchorKey, officeProductToPunchedRow(anchor))
    }
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const orderedColors = STARBOX_COLOR_TERMS.map((c) => c.label)
  const out: OxfordG85VariantSlot[] = []
  for (const thicknessCm of [5, 8] as const) {
    for (const color of orderedColors) {
      if (thicknessCm === 5 && !OXFORD_5CM_ALLOWED_COLORS.has(color)) continue
      const row = byColorAndThickness.get(`${thicknessCm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        color,
        thicknessCm,
        product: attachQuantityTiers(
          { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
          tiersByProductId,
        ),
      })
    }
  }

  for (const color of orderedColors) {
    const row = byColorAndThickness.get(`0:${color}`)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(
        { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
        tiersByProductId,
      ),
    })
  }
  return out
}

export async function fetchEuroboxEsselteVariants(
  anchor: OfficeProduct,
): Promise<OxfordG85VariantSlot[]> {
  if (!isEuroboxEsselteCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%progetto%Eurobox%Esselte%', 180),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Eurobox%Esselte%', 180),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%progetto%Eurobox%', 220),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byColorAndThickness = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isEuroboxEsselteName(name)) continue
    const color = detectStarboxColorLabel(name)
    const thicknessCm = detectStarboxThicknessCm(name)
    if (!color || thicknessCm == null) continue
    if (!(EUROBOX_ESSELTE_COLOR_LABELS as readonly string[]).includes(color)) continue
    if (!(EUROBOX_ESSELTE_DORSO_CM as readonly number[]).includes(thicknessCm)) continue
    const key = `${thicknessCm}:${color}`
    if (!byColorAndThickness.has(key)) byColorAndThickness.set(key, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  const anchorThickness = detectStarboxThicknessCm(anchor.name)
  if (
    anchorColor &&
    anchorThickness != null &&
    (EUROBOX_ESSELTE_COLOR_LABELS as readonly string[]).includes(anchorColor) &&
    (EUROBOX_ESSELTE_DORSO_CM as readonly number[]).includes(anchorThickness)
  ) {
    const anchorKey = `${anchorThickness}:${anchorColor}`
    if (!byColorAndThickness.has(anchorKey)) {
      byColorAndThickness.set(anchorKey, officeProductToPunchedRow(anchor))
    }
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: OxfordG85VariantSlot[] = []
  for (const thicknessCm of EUROBOX_ESSELTE_DORSO_CM) {
    for (const color of EUROBOX_ESSELTE_COLOR_LABELS) {
      const row = byColorAndThickness.get(`${thicknessCm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        color,
        thicknessCm,
        product: attachQuantityTiers(
          { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
          tiersByProductId,
        ),
      })
    }
  }
  return out
}

export async function fetchEuroboxEsselteVariantBySelection(
  anchor: OfficeProduct,
  selection: { thicknessCm: number; color: string },
): Promise<OfficeProduct | null> {
  const slots = await fetchEuroboxEsselteVariants(anchor)
  const hit = slots.find(
    (s) =>
      s.thicknessCm === selection.thicknessCm &&
      s.color.trim() === selection.color.trim(),
  )
  return hit?.product ?? null
}

export async function fetchBigSeiRotaVariants(
  anchor: OfficeProduct,
): Promise<OxfordG85VariantSlot[]> {
  if (!isBigSeiRotaCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Scatola archivio Big Sei Rota%', 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%archivio%Big%Rota%', 180),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Big%Sei%Rota%', 180),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byColorAndThickness = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isBigSeiRotaName(name)) continue
    const color = detectStarboxColorLabel(name)
    const thicknessCm = detectStarboxThicknessCm(name)
    if (!color || thicknessCm == null) continue
    if (!(BIG_SEI_ROTA_COLOR_LABELS as readonly string[]).includes(color)) continue
    if (!(BIG_SEI_ROTA_DORSO_CM as readonly number[]).includes(thicknessCm)) continue
    const key = `${thicknessCm}:${color}`
    if (!byColorAndThickness.has(key)) byColorAndThickness.set(key, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  const anchorThickness = detectStarboxThicknessCm(anchor.name)
  if (
    anchorColor &&
    anchorThickness != null &&
    (BIG_SEI_ROTA_COLOR_LABELS as readonly string[]).includes(anchorColor) &&
    (BIG_SEI_ROTA_DORSO_CM as readonly number[]).includes(anchorThickness)
  ) {
    const anchorKey = `${anchorThickness}:${anchorColor}`
    if (!byColorAndThickness.has(anchorKey)) {
      byColorAndThickness.set(anchorKey, officeProductToPunchedRow(anchor))
    }
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: OxfordG85VariantSlot[] = []
  for (const thicknessCm of BIG_SEI_ROTA_DORSO_CM) {
    for (const color of BIG_SEI_ROTA_COLOR_LABELS) {
      const row = byColorAndThickness.get(`${thicknessCm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        color,
        thicknessCm,
        product: attachQuantityTiers(
          { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
          tiersByProductId,
        ),
      })
    }
  }
  return out
}

export async function fetchBigSeiRotaVariantBySelection(
  anchor: OfficeProduct,
  selection: { thicknessCm: number; color: string },
): Promise<OfficeProduct | null> {
  const slots = await fetchBigSeiRotaVariants(anchor)
  const normalizedColor = selection.color.trim().toLowerCase()
  const hit = slots.find(
    (s) =>
      s.thicknessCm === selection.thicknessCm &&
      s.color.trim().toLowerCase() === normalizedColor,
  )
  if (hit) return hit.product

  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%archivio%Big%Rota%', 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Big%Sei%Rota%', 220),
    ])
    const rows = mergeRowsById([...a, ...b])
    const direct = rows.find((r) => {
      const n = String(r.name ?? '')
      if (!isBigSeiRotaName(n)) return false
      const cm = detectStarboxThicknessCm(n)
      const color = detectStarboxColorLabel(n)?.toLowerCase() ?? ''
      return cm === selection.thicknessCm && color === normalizedColor
    })
    if (!direct) return null
    return attachQuantityTiers(mapRowToOfficeProduct(direct), new Map())
  } catch {
    return null
  }
}

export type SoftSeiRotaVariantSlot = {
  formatLabel: string
  product: OfficeProduct
}

export async function fetchSoftSeiRotaVariants(
  anchor: OfficeProduct,
): Promise<SoftSeiRotaVariantSlot[]> {
  if (!isSoftSeiRotaCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Buste a sacco Soft%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%a%sacco%Soft%Sei%Rota%', 240),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Soft%Sei%Rota%', 240),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%Sacco%Soft%', 240),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byFormat = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isSoftSeiRotaName(name)) continue
    const format = detectSoftSeiRotaFormatLabel(name)
    if (!format) continue
    if (!byFormat.has(format)) byFormat.set(format, row)
  }

  const anchorFormat = detectSoftSeiRotaFormatLabel(anchor.name)
  if (anchorFormat && !byFormat.has(anchorFormat)) {
    byFormat.set(anchorFormat, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: SoftSeiRotaVariantSlot[] = []
  for (const formatLabel of SOFT_SEI_ROTA_FORMAT_LABELS) {
    const row = byFormat.get(formatLabel)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      formatLabel,
      product: attachQuantityTiers(
        { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
        tiersByProductId,
      ),
    })
  }
  return out
}

export async function fetchSoftSeiRotaVariantByFormat(
  anchor: OfficeProduct,
  formatLabel: string,
): Promise<OfficeProduct | null> {
  const normalized = formatLabel.trim().toLowerCase()
  const slots = await fetchSoftSeiRotaVariants(anchor)
  const hit = slots.find((s) => s.formatLabel.trim().toLowerCase() === normalized)
  if (hit) return hit.product

  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Buste a sacco Soft%', 280),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%a%sacco%Soft%Sei%Rota%', 260),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%Sacco%Soft%', 260),
    ])
    const rows = mergeRowsById([...a, ...b])
    const direct = rows.find((r) => {
      const n = String(r.name ?? '')
      if (!isSoftSeiRotaName(n)) return false
      return (detectSoftSeiRotaFormatLabel(n) ?? '').toLowerCase() === normalized
    })
    if (!direct) return null
    return attachQuantityTiers(mapRowToOfficeProduct(direct), new Map())
  } catch {
    return null
  }
}

export type BlasettiMailpackVariantSlot = {
  formatLabel: string
  product: OfficeProduct
}

export async function fetchBlasettiMailpackVariants(
  anchor: OfficeProduct,
): Promise<BlasettiMailpackVariantSlot[]> {
  if (!isBlasettiMailpackCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const cancMail = await fetchCancelleriaRowsMailpackName(supabase, 360)
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Mailpack%Blasetti%', 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Blasetti%Mailpack%', 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%a%sacco%Mailpack%', 200),
    ])
    rows = mergeRowsById([...cancMail, ...a, ...b, ...c])
  } catch {
    rows = []
  }

  const anchorLine = blasettiMailpackLineKey(anchor)
  const byFormat = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const mappedProbe = mapRowToOfficeProduct(row)
    if (!isBlasettiMailpackCatalogProduct(mappedProbe)) continue
    const rowLine = blasettiMailpackLineKey({
      name: String(row.name ?? ''),
      format: String(row.format ?? ''),
    })
    if (rowLine !== anchorLine) continue
    const format = detectBlasettiMailpackFormatLabel(mappedProbe)
    if (!format) continue
    if (!byFormat.has(format)) byFormat.set(format, row)
  }

  if (byFormat.size === 0) {
    for (const row of rows) {
      const mappedProbe = mapRowToOfficeProduct(row)
      if (!isBlasettiMailpackCatalogProduct(mappedProbe)) continue
      const format = detectBlasettiMailpackFormatLabel(mappedProbe)
      if (!format) continue
      if (!byFormat.has(format)) byFormat.set(format, row)
    }
  }

  const anchorFormat = detectBlasettiMailpackFormatLabel(anchor)
  if (anchorFormat && !byFormat.has(anchorFormat)) {
    byFormat.set(anchorFormat, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: BlasettiMailpackVariantSlot[] = []
  for (const formatLabel of BLASETTI_MAILPACK_FORMAT_LABELS) {
    const row = byFormat.get(formatLabel)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      formatLabel,
      product: attachQuantityTiers(
        { ...mapped, imageUrl: (mapped.imageUrl ?? '').trim() || (anchor.imageUrl ?? '').trim() },
        tiersByProductId,
      ),
    })
  }
  return out
}

export async function fetchBlasettiMailpackVariantByFormat(
  anchor: OfficeProduct,
  formatLabel: string,
): Promise<OfficeProduct | null> {
  const normalized = formatLabel.trim().replace(/\s/g, '').toLowerCase()
  const slots = await fetchBlasettiMailpackVariants(anchor)
  const hit = slots.find(
    (s) => s.formatLabel.trim().replace(/\s/g, '').toLowerCase() === normalized,
  )
  if (hit) return hit.product

  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null
  try {
    const cancMail = await fetchCancelleriaRowsMailpackName(supabase, 360)
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Mailpack%Blasetti%', 240),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Blasetti%Mailpack%', 240),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Buste%a%sacco%Mailpack%', 220),
    ])
    const rows = mergeRowsById([...cancMail, ...a, ...b, ...c])
    const anchorLine = blasettiMailpackLineKey(anchor)
    let direct = rows.find((r) => {
      const m = mapRowToOfficeProduct(r)
      if (!isBlasettiMailpackCatalogProduct(m)) return false
      const line = blasettiMailpackLineKey({
        name: String(r.name ?? ''),
        format: String(r.format ?? ''),
      })
      if (line !== anchorLine) return false
      return (detectBlasettiMailpackFormatLabel(m) ?? '').toLowerCase() === normalized
    })
    if (!direct) {
      direct = rows.find((r) => {
        const m = mapRowToOfficeProduct(r)
        if (!isBlasettiMailpackCatalogProduct(m)) return false
        return (detectBlasettiMailpackFormatLabel(m) ?? '').toLowerCase() === normalized
      })
    }
    if (!direct) return null
    return attachQuantityTiers(mapRowToOfficeProduct(direct), new Map())
  } catch {
    return null
  }
}

export async function fetchTrattoVideoHighlighterColorVariants(
  anchor: OfficeProduct,
): Promise<StarboxColorVariantSlot[]> {
  if (!isTrattoVideoHighlighterCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, 'Evidenziatore Tratto Video%', 220),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Tratto%Video%Evidenzi%', 260),
    ])
    rows = mergeRowsById([...a, ...b])
  } catch {
    rows = []
  }

  const byColor = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isTrattoVideoHighlighterName(name)) continue
    const detected = detectStarboxColorLabel(name)
    const color = detected === 'Lilla' ? 'Viola' : detected
    if (!color) continue
    if (!byColor.has(color)) byColor.set(color, row)
  }

  const anchorDetected = detectStarboxColorLabel(anchor.name)
  const anchorColor = anchorDetected === 'Lilla' ? 'Viola' : anchorDetected
  if (anchorColor && !byColor.has(anchorColor)) {
    byColor.set(anchorColor, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: StarboxColorVariantSlot[] = []
  const orderedColors = [
    ...TRATTO_VIDEO_HIGHLIGHTER_COLOR_LABELS,
  ]
  for (const color of orderedColors) {
    const row = byColor.get(color)
    if (!row) continue
    const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
    out.push({
      color,
      thicknessCm: null,
      product: attachQuantityTiers(mapped, tiersByProductId),
    })
  }
  return out
}

/**
 * Varianti scatola archivio con maniglia Starline: dorso 16/20 cm × colori Rosso/Blu/Nero.
 */
export async function fetchStarlineArchiveBoxVariants(
  anchor: OfficeProduct,
): Promise<StarboxColorVariantSlot[]> {
  if (!isStarlineArchiveBoxCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c, skuRows] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%archivio%maniglia%Starline%', 80),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%archivio%Starline%maniglia%', 80),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Scatola%archivio%Starline%', 80),
      fetchStarlineArchiveRowsByKnownSkus(supabase),
    ])
    rows = mergeRowsById([...a, ...b, ...c, ...skuRows])
  } catch {
    rows = []
  }

  const byKey = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isStarlineArchiveBoxName(name)) continue
    const color = detectStarboxColorLabel(name)
    const cm = detectStarboxThicknessCm(name)
    if (!color || cm == null || (cm !== 16 && cm !== 20)) continue
    if (!(STARLINE_ARCHIVE_BOX_COLOR_LABELS as readonly string[]).includes(color)) continue
    const key = `${cm}:${color}`
    if (!byKey.has(key)) byKey.set(key, row)
  }

  for (const row of rows) {
    const sku = String(row.sku ?? '').trim().toUpperCase()
    if (!sku) continue
    const variantKey = STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[sku]
    if (!variantKey) continue
    if (!byKey.has(variantKey)) byKey.set(variantKey, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  const anchorCm = detectStarboxThicknessCm(anchor.name)
  const anchorKeyFromName =
    anchorColor &&
    anchorCm != null &&
    (anchorCm === 16 || anchorCm === 20) &&
    (STARLINE_ARCHIVE_BOX_COLOR_LABELS as readonly string[]).includes(anchorColor)
      ? `${anchorCm}:${anchorColor}`
      : ''
  const codeUp = [anchor.producerCode, anchor.id]
    .map((x) => String(x ?? '').trim().toUpperCase())
    .find((c) => c && STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[c])
  const anchorKeyFromSku = codeUp ? STARLINE_ARCHIVE_BOX_SKU_TO_VARIANT_KEY[codeUp] : ''
  const anchorVariantKey = anchorKeyFromName || anchorKeyFromSku
  if (anchorVariantKey && !byKey.has(anchorVariantKey)) {
    byKey.set(anchorVariantKey, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const anchorImg = anchor.imageUrl?.trim() ?? ''
  const out: StarboxColorVariantSlot[] = []
  for (const thicknessCm of STARLINE_ARCHIVE_BOX_DORSO_CM) {
    for (const color of STARLINE_ARCHIVE_BOX_COLOR_LABELS) {
      const row = byKey.get(`${thicknessCm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      const imgFromMap = STARLINE_ARCHIVE_BOX_IMAGE_BY_KEY[`${thicknessCm}:${color}`]
      out.push({
        color,
        thicknessCm,
        product: attachQuantityTiers(
          {
            ...mapped,
            imageUrl:
              imgFromMap ||
              (mapped.imageUrl ?? '').trim() ||
              anchorImg,
          },
          tiersByProductId,
        ),
      })
    }
  }
  return out
}

/**
 * Risolve la variante dorso×colore: prima SKU noto (DB), poi slot da nome/famiglia.
 * Utile per navigazione esplicita dopo aggiornamenti titolo.
 */
export async function fetchStarlineArchiveBoxProductByVariant(
  anchor: OfficeProduct,
  thicknessCm: 16 | 20,
  color: string,
): Promise<OfficeProduct | null> {
  if (!isStarlineArchiveBoxCatalogProduct(anchor)) return null
  const colorLabel = color.trim()
  const mapKey = `${thicknessCm}:${colorLabel}`
  const sku = STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT[mapKey]
  if (sku) {
    const direct = await fetchOfficeProductByIdentifier(sku)
    if (direct) return direct
  }
  const slots = await fetchStarlineArchiveBoxVariants(anchor)
  const hit = slots.find(
    (s) => s.thicknessCm === thicknessCm && s.color.trim() === colorLabel,
  )
  return hit?.product ?? null
}

export async function fetchStabiloOhpenVariants(
  anchor: OfficeProduct,
): Promise<StabiloOhpenVariantSlot[]> {
  if (!isStabiloOhpenCatalogProduct(anchor)) return []
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  let rows: OfficeProductRow[] = []
  try {
    const [a, b, c] = await Promise.all([
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Stabilo%OHPen%', 120),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Stabilo%OH Pen%', 120),
      fetchRowsByNameIlikeWithFallbacks(supabase, '%Pennarello%Stabilo%', 120),
    ])
    rows = mergeRowsById([...a, ...b, ...c])
  } catch {
    rows = []
  }

  const byTipAndColor = new Map<string, OfficeProductRow>()
  for (const row of rows) {
    const name = String(row.name ?? '')
    if (!isStabiloOhpenName(name)) continue
    const color = detectStarboxColorLabel(name)
    const tipMm = detectStabiloOhpenTipMm(name)
    if (!color || tipMm == null) continue
    if (!(STABILO_OHPEN_COLOR_LABELS as readonly string[]).includes(color)) continue
    if (!(STABILO_OHPEN_TIP_MM as readonly number[]).includes(tipMm)) continue
    const key = `${tipMm}:${color}`
    if (!byTipAndColor.has(key)) byTipAndColor.set(key, row)
  }

  const anchorColor = detectStarboxColorLabel(anchor.name)
  const anchorTip = detectStabiloOhpenTipMm(anchor.name)
  if (
    anchorColor &&
    anchorTip != null &&
    (STABILO_OHPEN_COLOR_LABELS as readonly string[]).includes(anchorColor) &&
    (STABILO_OHPEN_TIP_MM as readonly number[]).includes(anchorTip) &&
    !byTipAndColor.has(`${anchorTip}:${anchorColor}`)
  ) {
    byTipAndColor.set(`${anchorTip}:${anchorColor}`, officeProductToPunchedRow(anchor))
  }

  let tiersByProductId: Awaited<
    ReturnType<typeof fetchQuantityPriceTiersByProductId>
  >['tiersByProductId'] = new Map()
  try {
    ;({ tiersByProductId } = await fetchQuantityPriceTiersByProductId())
  } catch {
    tiersByProductId = new Map()
  }

  const out: StabiloOhpenVariantSlot[] = []
  for (const tipMm of STABILO_OHPEN_TIP_MM) {
    for (const color of STABILO_OHPEN_COLOR_LABELS) {
      const row = byTipAndColor.get(`${tipMm}:${color}`)
      if (!row) continue
      const mapped = String(row.id) === String(anchor.id) ? anchor : mapRowToOfficeProduct(row)
      out.push({
        color,
        tipMm,
        product: attachQuantityTiers(mapped, tiersByProductId),
      })
    }
  }
  return out
}

export async function fetchStabiloOhpenVariantBySelection(
  anchor: OfficeProduct,
  selection: { color: string; tipMm: number },
): Promise<OfficeProduct | null> {
  const wantedColor = selection.color.trim()
  if (!wantedColor) return null
  const slots = await fetchStabiloOhpenVariants(anchor)
  const hit = slots.find(
    (s) =>
      s.color.trim().toLowerCase() === wantedColor.toLowerCase() &&
      s.tipMm === selection.tipMm,
  )
  return hit?.product ?? null
}

/** @deprecated Usare fetchProductFamilyByParentSku; lasciato per compatibilità. */
export async function fetchProductVariantsByParentSku(
  parentSku: string,
  _excludeProductId: string,
): Promise<OfficeProduct[]> {
  const all = await fetchProductFamilyByParentSku(parentSku)
  return all.filter((p) => p.id !== _excludeProductId)
}

/**
 * Altri prodotti (escluso l’id corrente), con listini quantità.
 * Nessun filtro su category lato DB: la tabella `products` può non avere quella colonna;
 * il filtro per categoria resta lato UI sugli oggetti già mappati.
 */
export async function fetchRelatedOfficeProducts(
  _categoryLabel: string,
  excludeProductId: string,
  limit = 4,
): Promise<OfficeProduct[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    throw new Error(
      'Supabase non configurato (mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
    )
  }

  const memKey = relatedMemKey(_categoryLabel, excludeProductId)
  const cached = relatedProductsMemoryCache.get(memKey)
  const now = Date.now()
  if (cached && now - cached.fetchedAt < RELATED_MEM_TTL_MS) {
    return cached.data
  }

  const [shopRows, quantityFetch] = await Promise.all([
    fetchShopProductsExcludeId(supabase, excludeProductId, limit),
    fetchQuantityPriceTiersByProductId(),
  ])

  const { tiersByProductId } = quantityFetch

  const products = shopRows.map(mapRowToOfficeProduct)
  const withTiers = products.map((p) => attachQuantityTiers(p, tiersByProductId))

  if (relatedProductsMemoryCache.size >= RELATED_MEM_MAX_KEYS) {
    const oldest = relatedProductsMemoryCache.keys().next().value
    if (oldest) relatedProductsMemoryCache.delete(oldest)
  }
  relatedProductsMemoryCache.set(memKey, { fetchedAt: now, data: withTiers })

  return withTiers
}

/** Stock per tabella admin; fallback silenzioso se colonna assente nello schema. */
export async function fetchOfficeProductStocks(): Promise<Map<string, number>> {
  const supabase = getSupabaseBrowserClient()
  const stockById = new Map<string, number>()
  if (!supabase) return stockById

  const res = await supabase.from(SHOP_PRODUCTS_TABLE).select('id, stock')
  if (res.error && isMissingColumnPostgrestError(res.error)) {
    console.warn(
      '[officeProducts] select id, stock non valido, skip giacenze:',
      (res.error as { message?: string }).message ?? res.error,
    )
    return stockById
  }
  if (res.error) {
    console.warn('[officeProducts] Errore lettura stock prodotti:', res.error)
    return stockById
  }

  const rows = (res.data ?? []) as Array<{ id: string; stock: number | string | null }>
  for (const row of rows) {
    const raw = typeof row.stock === 'string' ? Number.parseInt(row.stock, 10) : row.stock
    if (typeof row.id === 'string' && Number.isFinite(raw)) {
      stockById.set(row.id, Number(raw))
    }
  }
  return stockById
}
