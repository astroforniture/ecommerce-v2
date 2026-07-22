import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'

/** Hub Cancelleria → Shopper (livello intermedio). */
export const CANCELLERIA_VIEW_SHOPPER = 'shopper' as const
export const CANCELLERIA_VIEW_SHOPPER_CARTA = 'shopper-carta' as const
export const CANCELLERIA_VIEW_SHOPPER_PLASTICA = 'shopper-plastica' as const

export type ShopperCancelleriaViewId =
  | typeof CANCELLERIA_VIEW_SHOPPER
  | typeof CANCELLERIA_VIEW_SHOPPER_CARTA
  | typeof CANCELLERIA_VIEW_SHOPPER_PLASTICA

export const CANCELLERIA_SUB_SHOPPER = 'Shopper'
export const CANCELLERIA_SUB_SHOPPER_CARTA = 'Shopper in Carta'
export const CANCELLERIA_SUB_SHOPPER_PLASTICA = 'Shopper in Plastica'

/** Cover tile Cancelleria → Shopper (carta + plastica affiancate, 1:1). */
export const SHOPPER_HUB_COVER_IMAGE_URL = '/images/shopper-category.png'
export const SHOPPER_CARTA_COVER_IMAGE_URL = '/shopper-carta-cover.jpg'
export const SHOPPER_PLASTICA_COVER_IMAGE_URL = '/shopper-plastica-cover.jpg'

export const SHOPPER_CARTA_DESCRIPTION =
  'Buste e shopper in carta ideali per negozi, boutique e confezioni regalo.'
export const SHOPPER_PLASTICA_DESCRIPTION =
  'Sacchetti e shopper compostabili e in plastica per la spesa, ortofrutta e attività commerciali.'

/** SKU prodotti base (uno per sottocategoria). */
export const SHOPPER_PLASTICA_BASE_SKU = 'AF-SHOPPER-PLASTICA-MATERBI'
export const SHOPPER_CARTA_BASE_SKU = 'AF-SHOPPER-CARTA-MAINETTI'

export const SHOPPER_CARTA_ID_PREFIX = 'AF-SHOPPER-CARTA-'
export const SHOPPER_PLASTICA_ID_PREFIX = 'AF-SHOPPER-PLASTICA-'

export function cancelleriaShopperHubPath(): string {
  return `/office-products?category=Cancelleria&cancelleriaView=${CANCELLERIA_VIEW_SHOPPER}`
}

export function cancelleriaShopperCartaPath(): string {
  return `/office-products?category=Cancelleria&cancelleriaView=${CANCELLERIA_VIEW_SHOPPER_CARTA}`
}

export function cancelleriaShopperPlasticaPath(): string {
  return `/office-products?category=Cancelleria&cancelleriaView=${CANCELLERIA_VIEW_SHOPPER_PLASTICA}`
}

export function isShopperCancelleriaViewId(raw: string): raw is ShopperCancelleriaViewId {
  return (
    raw === CANCELLERIA_VIEW_SHOPPER ||
    raw === CANCELLERIA_VIEW_SHOPPER_CARTA ||
    raw === CANCELLERIA_VIEW_SHOPPER_PLASTICA
  )
}

export function isShopperIntermediateHub(view: string | null | undefined): boolean {
  return (view ?? '') === CANCELLERIA_VIEW_SHOPPER
}

export function isShopperLeafListingView(view: string | null | undefined): boolean {
  const v = view ?? ''
  return v === CANCELLERIA_VIEW_SHOPPER_CARTA || v === CANCELLERIA_VIEW_SHOPPER_PLASTICA
}

export type ShopperChildTile = {
  id: typeof CANCELLERIA_VIEW_SHOPPER_CARTA | typeof CANCELLERIA_VIEW_SHOPPER_PLASTICA
  title: string
  description: string
  imageUrl: string
}

export const SHOPPER_CHILD_TILES: readonly ShopperChildTile[] = [
  {
    id: CANCELLERIA_VIEW_SHOPPER_CARTA,
    title: CANCELLERIA_SUB_SHOPPER_CARTA,
    description: SHOPPER_CARTA_DESCRIPTION,
    imageUrl: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    id: CANCELLERIA_VIEW_SHOPPER_PLASTICA,
    title: CANCELLERIA_SUB_SHOPPER_PLASTICA,
    description: SHOPPER_PLASTICA_DESCRIPTION,
    imageUrl: SHOPPER_PLASTICA_COVER_IMAGE_URL,
  },
] as const

/** Varianti misura: ordinate dalla più piccola alla più grande. */
export const SHOPPER_PLASTICA_SIZE_VARIANTS: readonly ProductVariantOption[] = [
  {
    label: 'Mini - 22 x 40 cm (Scatola 500 pz)',
    sku: 'AF-SHOPPER-PLASTICA-MINI-22X40',
    packQty: 500,
    packLabel: 'Scatola 500 pz',
    price: 0,
    image_url: SHOPPER_PLASTICA_COVER_IMAGE_URL,
  },
  {
    label: 'Midi - 28 x 50 cm (Scatola 500 pz)',
    sku: 'AF-SHOPPER-PLASTICA-MIDI-28X50',
    packQty: 500,
    packLabel: 'Scatola 500 pz',
    price: 0,
    image_url: SHOPPER_PLASTICA_COVER_IMAGE_URL,
  },
  {
    label: 'Maxi - 30 x 60 cm (Scatola 500 pz)',
    sku: 'AF-SHOPPER-PLASTICA-MAXI-30X60',
    packQty: 500,
    packLabel: 'Scatola 500 pz',
    price: 0,
    image_url: SHOPPER_PLASTICA_COVER_IMAGE_URL,
  },
]

export const SHOPPER_CARTA_SIZE_VARIANTS: readonly ProductVariantOption[] = [
  {
    label: '14 x 9 x 21 cm (Conf. 25 pz)',
    sku: 'AF-SHOPPER-CARTA-14X9X21',
    packQty: 25,
    packLabel: 'Conf. 25 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    label: '18 x 8 x 24 cm (Conf. 25 pz)',
    sku: 'AF-SHOPPER-CARTA-18X8X24',
    packQty: 25,
    packLabel: 'Conf. 25 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    label: '22 x 10 x 29 cm (Conf. 25 pz)',
    sku: 'AF-SHOPPER-CARTA-22X10X29',
    packQty: 25,
    packLabel: 'Conf. 25 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    label: '36 x 12 x 41 cm (Conf. 25 pz)',
    sku: 'AF-SHOPPER-CARTA-36X12X41',
    packQty: 25,
    packLabel: 'Conf. 25 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    label: '45 x 15 x 50 cm (Conf. 25 pz)',
    sku: 'AF-SHOPPER-CARTA-45X15X50',
    packQty: 25,
    packLabel: 'Conf. 25 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
  {
    label: '54 x 14 x 45 cm (Conf. 10 pz)',
    sku: 'AF-SHOPPER-CARTA-54X14X45',
    packQty: 10,
    packLabel: 'Conf. 10 pz',
    price: 0,
    image_url: SHOPPER_CARTA_COVER_IMAGE_URL,
  },
]

function buildShopperBaseProduct(input: {
  id: string
  name: string
  brand: string
  subcategory: string
  imageUrl: string
  description: string
  variants: readonly ProductVariantOption[]
}): OfficeProduct {
  const first = input.variants[0]
  return {
    id: input.id,
    name: input.name,
    brand: input.brand,
    producerCode: input.id,
    category: 'Cancelleria',
    subcategory: input.subcategory,
    mainFeatures: {
      Tipologia: input.subcategory,
      Varianti: `${input.variants.length} misure`,
    },
    imageUrl: input.imageUrl,
    description: input.description,
    price: typeof first?.price === 'number' ? first.price : 0,
    variants: [...input.variants],
  }
}

export function buildShopperPlasticaOfficeProducts(): OfficeProduct[] {
  return [
    buildShopperBaseProduct({
      id: SHOPPER_PLASTICA_BASE_SKU,
      name: 'Shopper Bio / Plastica Mater-Bi',
      brand: 'Mater-Bi',
      subcategory: CANCELLERIA_SUB_SHOPPER_PLASTICA,
      imageUrl: SHOPPER_PLASTICA_COVER_IMAGE_URL,
      description: `${SHOPPER_PLASTICA_DESCRIPTION} Materiale Mater-Bi compostabile, colore bianco. Scegli la misura (Mini, Midi o Maxi); ogni confezione è una scatola da 500 pezzi.`,
      variants: SHOPPER_PLASTICA_SIZE_VARIANTS,
    }),
  ]
}

export function buildShopperCartaOfficeProducts(): OfficeProduct[] {
  return [
    buildShopperBaseProduct({
      id: SHOPPER_CARTA_BASE_SKU,
      name: 'Shopper in Carta Kraft Bianca - Mainetti Bags',
      brand: 'Mainetti Bags',
      subcategory: CANCELLERIA_SUB_SHOPPER_CARTA,
      imageUrl: SHOPPER_CARTA_COVER_IMAGE_URL,
      description: `${SHOPPER_CARTA_DESCRIPTION} Carta kraft bianca con maniglie a cordino. Scegli la misura; la confezione varia in base al formato selezionato.`,
      variants: SHOPPER_CARTA_SIZE_VARIANTS,
    }),
  ]
}

export function allShopperCatalogSkus(): string[] {
  return [SHOPPER_PLASTICA_BASE_SKU, SHOPPER_CARTA_BASE_SKU]
}

export function isShopperBaseProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  return (
    id === SHOPPER_PLASTICA_BASE_SKU ||
    id === SHOPPER_CARTA_BASE_SKU ||
    sku === SHOPPER_PLASTICA_BASE_SKU ||
    sku === SHOPPER_CARTA_BASE_SKU
  )
}

/** PDP: prodotto con selettore misure a pillole. */
export function isShopperSizeVariantProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'subcategory' | 'variants'> | null | undefined,
): boolean {
  if (!product) return false
  if (isShopperBaseProduct(product)) return true
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  if (
    sub === CANCELLERIA_SUB_SHOPPER_CARTA.toLowerCase() ||
    sub === CANCELLERIA_SUB_SHOPPER_PLASTICA.toLowerCase()
  ) {
    return (product.variants?.length ?? 0) > 0
  }
  const id = String(product.id ?? '')
  const sku = String(product.producerCode ?? '')
  return id.startsWith('AF-SHOPPER-') || sku.startsWith('AF-SHOPPER-')
}

export function matchesShopperCartaProduct(product: OfficeProduct): boolean {
  if (product.id === SHOPPER_CARTA_BASE_SKU) return true
  if ((product.producerCode ?? '') === SHOPPER_CARTA_BASE_SKU) return true
  if (product.id.startsWith(SHOPPER_CARTA_ID_PREFIX)) return true
  if ((product.producerCode ?? '').startsWith(SHOPPER_CARTA_ID_PREFIX)) return true
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  return sub === CANCELLERIA_SUB_SHOPPER_CARTA.toLowerCase()
}

export function matchesShopperPlasticaProduct(product: OfficeProduct): boolean {
  if (product.id === SHOPPER_PLASTICA_BASE_SKU) return true
  if ((product.producerCode ?? '') === SHOPPER_PLASTICA_BASE_SKU) return true
  if (product.id.startsWith(SHOPPER_PLASTICA_ID_PREFIX)) return true
  if ((product.producerCode ?? '').startsWith(SHOPPER_PLASTICA_ID_PREFIX)) return true
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  return sub === CANCELLERIA_SUB_SHOPPER_PLASTICA.toLowerCase()
}

/** Resolve prodotto shopper da URL (SKU base o SKU variante legacy). */
export function resolveShopperProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim().toUpperCase()
  if (!k) return null
  const plastica = buildShopperPlasticaOfficeProducts()[0]
  const carta = buildShopperCartaOfficeProducts()[0]
  if (!plastica || !carta) return null

  if (k === SHOPPER_PLASTICA_BASE_SKU || k.startsWith(SHOPPER_PLASTICA_ID_PREFIX)) {
    return plastica
  }
  if (k === SHOPPER_CARTA_BASE_SKU || k.startsWith(SHOPPER_CARTA_ID_PREFIX)) {
    return carta
  }
  return null
}
