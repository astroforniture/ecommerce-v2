import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'

/** Hub Cancelleria → Buste. */
export const CANCELLERIA_VIEW_BUSTE = 'buste' as const
export const CANCELLERIA_SUB_BUSTE = 'Buste' as const

export const BUSTE_HUB_COVER_IMAGE_URL = '/images/sacboll/sacboll-cover.jpg'

/** SKU articolo principale (varianti formato in JSONB). */
export const SACBOLL_BASE_SKU = 'AF-SACBOLL-BLASETTI'
export const SACBOLL_ID_PREFIX = 'AF-SACBOLL-'

/** Alias legacy (migrazione da Avana/Bianco). */
export const SACBOLL_AVANA_BASE_SKU = 'AF-SACBOLL-AVANA'
export const SACBOLL_BIANCO_BASE_SKU = 'AF-SACBOLL-BIANCO'

export const SACBOLL_PRODUCT_NAME = 'Busta imbottita Sacboll - Blasetti (conf. 10 pezzi)'

export const SACBOLL_DESCRIPTION =
  'Busta imbottita Sacboll Blasetti in carta FSC avana con imbottitura a bolle d’aria e chiusura a strip adesiva. Ideale per spedizioni di oggetti fragili. Scegli il formato: ogni confezione contiene 10 pezzi.'

export function cancelleriaBusteListingPath(): string {
  return `/office-products?category=Cancelleria&cancelleriaView=${CANCELLERIA_VIEW_BUSTE}`
}

export type SacbollFormatCode =
  | 'A'
  | 'B'
  | 'C'
  | 'CD'
  | 'D'
  | 'E'
  | 'FG'
  | 'H'
  | 'J'
  | 'K'

export type SacbollFormatDef = {
  code: SacbollFormatCode
  /** Codice produttore Blasetti (MPN). */
  blasettiCode: string
  /** EAN-13 confezione termoretratta (10 pz). */
  ean: string
  outerCm: string
  innerCm: string
  price: number
  imagePath: string
}

/**
 * 10 formati Sacboll avana (ordine UI: A → K).
 * EAN confezione: 80077580 + MPN + check digit.
 */
export const SACBOLL_FORMATS: readonly SacbollFormatDef[] = [
  {
    code: 'A',
    blasettiCode: '0710',
    ean: '8007758007109',
    outerCm: '13 x 20 cm',
    innerCm: '11 x 16 cm',
    price: 1.66,
    imagePath: '/images/sacboll/sacboll-a.jpg',
  },
  {
    code: 'B',
    blasettiCode: '0711',
    ean: '8007758007116',
    outerCm: '14 x 27 cm',
    innerCm: '12 x 21 cm',
    price: 1.8,
    imagePath: '/images/sacboll/sacboll-b.jpg',
  },
  {
    code: 'C',
    blasettiCode: '0712',
    ean: '8007758007123',
    outerCm: '17 x 27 cm',
    innerCm: '15 x 21 cm',
    price: 1.96,
    imagePath: '/images/sacboll/sacboll-c.jpg',
  },
  {
    code: 'CD',
    blasettiCode: '0709',
    ean: '8007758007093',
    outerCm: '20 x 22 cm',
    innerCm: '16 x 18 cm',
    price: 1.7,
    imagePath: '/images/sacboll/sacboll-cd.jpg',
  },
  {
    code: 'D',
    blasettiCode: '0713',
    ean: '8007758007130',
    outerCm: '20 x 32 cm',
    innerCm: '18 x 26 cm',
    price: 2.54,
    imagePath: '/images/sacboll/sacboll-d.jpg',
  },
  {
    code: 'E',
    blasettiCode: '0717',
    ean: '8007758007178',
    outerCm: '24 x 32 cm',
    innerCm: '21 x 26 cm',
    price: 2.8,
    imagePath: '/images/sacboll/sacboll-e.jpg',
  },
  {
    code: 'FG',
    blasettiCode: '0714',
    ean: '8007758007147',
    outerCm: '25 x 39 cm',
    innerCm: '22 x 33 cm',
    price: 3.2,
    imagePath: '/images/sacboll/sacboll-fg.jpg',
  },
  {
    code: 'H',
    blasettiCode: '0715',
    ean: '8007758007154',
    outerCm: '29 x 42 cm',
    innerCm: '26 x 36 cm',
    price: 3.6,
    imagePath: '/images/sacboll/sacboll-h.jpg',
  },
  {
    code: 'J',
    blasettiCode: '0716',
    ean: '8007758007161',
    outerCm: '32 x 50 cm',
    innerCm: '29 x 44 cm',
    price: 4.6,
    imagePath: '/images/sacboll/sacboll-j.jpg',
  },
  {
    code: 'K',
    blasettiCode: '0718',
    ean: '8007758007185',
    outerCm: '37 x 55 cm',
    innerCm: '34 x 48 cm',
    price: 5.8,
    imagePath: '/images/sacboll/sacboll-k.jpg',
  },
] as const

export function sacbollVariantSku(code: SacbollFormatCode): string {
  return `${SACBOLL_BASE_SKU}-${code}`
}

export function buildSacbollFormatVariants(): ProductVariantOption[] {
  return SACBOLL_FORMATS.map((def) => ({
    label: def.code,
    sku: sacbollVariantSku(def.code),
    ean: def.ean,
    formatCode: def.code,
    outerCm: def.outerCm,
    innerCm: def.innerCm,
    packQty: 10,
    packLabel: 'Conf. 10 pz',
    price: def.price,
    image_url: def.imagePath,
    quality: def.blasettiCode,
    finish: def.innerCm,
  }))
}

export const SACBOLL_SIZE_VARIANTS = buildSacbollFormatVariants()

export function buildSacbollOfficeProducts(): OfficeProduct[] {
  const variants = SACBOLL_SIZE_VARIANTS
  const first = variants[0]!
  return [
    {
      id: SACBOLL_BASE_SKU,
      name: SACBOLL_PRODUCT_NAME,
      brand: 'Blasetti',
      producerCode: SACBOLL_BASE_SKU,
      category: 'Cancelleria',
      subcategory: CANCELLERIA_SUB_BUSTE,
      colorName: 'Avana',
      mainFeatures: {
        Tipologia: 'Buste imbottite Sacboll',
        Colore: 'Avana',
        Varianti: `${variants.length} formati`,
        Confezione: '10 pezzi',
        Chiusura: 'Strip adesiva',
      },
      imageUrl: first.image_url ?? BUSTE_HUB_COVER_IMAGE_URL,
      description: SACBOLL_DESCRIPTION,
      price: typeof first.price === 'number' ? first.price : 0,
      format: first.formatCode,
      variants: [...variants],
    },
  ]
}

export function isSacbollBaseProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (
    id === SACBOLL_BASE_SKU ||
    sku === SACBOLL_BASE_SKU ||
    id === SACBOLL_AVANA_BASE_SKU ||
    sku === SACBOLL_AVANA_BASE_SKU ||
    id === SACBOLL_BIANCO_BASE_SKU ||
    sku === SACBOLL_BIANCO_BASE_SKU
  ) {
    return true
  }
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('sacboll') && n.includes('blasetti')
}

/** PDP: selettore formati Sacboll. */
export function isSacbollSizeVariantProduct(
  product:
    | Pick<OfficeProduct, 'id' | 'producerCode' | 'name' | 'brand' | 'subcategory' | 'variants'>
    | null
    | undefined,
): boolean {
  if (!product) return false
  if ((product.variants?.length ?? 0) === 0) return false
  if (isSacbollBaseProduct(product)) return true
  const id = String(product.id ?? '')
  const sku = String(product.producerCode ?? '')
  if (id.startsWith(SACBOLL_ID_PREFIX) || sku.startsWith(SACBOLL_ID_PREFIX)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  const sacboll = n.includes('sacboll')
  const blas = n.includes('blasetti') || b.includes('blasetti')
  return sacboll && blas && (sub === 'buste' || sub === '')
}

export function matchesSacbollProduct(product: OfficeProduct): boolean {
  if (isSacbollBaseProduct(product)) return true
  if (String(product.id ?? '').startsWith(SACBOLL_ID_PREFIX)) return true
  if (String(product.producerCode ?? '').startsWith(SACBOLL_ID_PREFIX)) return true
  return String(product.name ?? '').toLowerCase().includes('sacboll')
}

export function matchesBusteHubProduct(product: OfficeProduct): boolean {
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  if (sub === 'buste') return true
  if (matchesSacbollProduct(product)) return true
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  if (n.includes('mailpack') && (n.includes('blasetti') || b.includes('blasetti'))) return true
  return n.includes('busta imbottita') || n.includes('buste imbottite')
}

export function resolveSacbollProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim().toUpperCase()
  if (!k) return null
  const product = buildSacbollOfficeProducts()[0]
  if (!product) return null
  if (product.id === k || product.producerCode === k) return product
  if (
    k === SACBOLL_AVANA_BASE_SKU ||
    k === SACBOLL_BIANCO_BASE_SKU ||
    k.startsWith('AF-SACBOLL-AVANA') ||
    k.startsWith('AF-SACBOLL-BIANCO')
  ) {
    return product
  }
  if ((product.variants ?? []).some((v) => String(v.sku ?? '').toUpperCase() === k)) return product
  return null
}

export function sacbollDisplayNameForVariant(
  variant: Pick<ProductVariantOption, 'label' | 'formatCode' | 'outerCm'> | null | undefined,
): string {
  const code = (variant?.formatCode ?? variant?.label ?? '').trim()
  const outer = (variant?.outerCm ?? '').trim()
  if (code && outer) return `Busta imbottita Sacboll ${code} (${outer}) - Blasetti`
  if (code) return `Busta imbottita Sacboll ${code} - Blasetti (conf. 10 pezzi)`
  return SACBOLL_PRODUCT_NAME
}

/** Unisce Sacboll sintetico + prodotti Buste in catalogo (es. Mailpack), senza duplicare Sacboll. */
export function mergeBusteListingProducts(fromCatalog: OfficeProduct[]): OfficeProduct[] {
  const sacboll = buildSacbollOfficeProducts()
  const catalogHasSacboll = fromCatalog.some(matchesSacbollProduct)
  const missingSacboll = catalogHasSacboll ? [] : sacboll
  const busteFromDb = fromCatalog.filter(matchesBusteHubProduct)
  const out = [...missingSacboll, ...busteFromDb]
  const seen = new Set<string>()
  return out.filter((p) => {
    const key = String(p.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
