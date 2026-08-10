import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'
import {
  SICUREZZA_SUBCATEGORY_GIACCHE,
  SICUREZZA_SUBCATEGORY_GIUBBOTTI,
  SICUREZZA_SUBCATEGORY_PANTALONI,
} from '../lib/sicurezzaCatalog'
import { applySicurezzaPromoDiscount } from '../lib/sicurezzaPromoDiscount'
import { SICUREZZA_CATEGORY } from '../lib/officeCategories'

/** Taglie standard abbigliamento da lavoro (default listing). */
export const SICUREZZA_APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'] as const
export type SicurezzaApparelSize = (typeof SICUREZZA_APPAREL_SIZES)[number] | 'XS'

export type SicurezzaTechnicalDocument = {
  id: string
  title: string
  href: string
  hint: string
}

type ApparelFamilyConfig = {
  sizes?: ProductVariantOption[]
  documents?: readonly SicurezzaTechnicalDocument[]
  /** Immagini aggiuntive galleria PDP (dopo `imageUrl`). */
  galleryUrls?: string[]
  /** Normalizza nome vetrina (senza taglia fissa nel titolo). */
  displayName?: string
  imageUrl?: string
}

/** PDF pubblici in `public/docs/safety/` — solo prodotti in allowlist. */
export const HORTEN2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/89931.pdf',
    hint: 'Scheda informativa e logistica (cod. 89931)',
  },
  {
    id: 'conformita-ce',
    title: '📜 Dichiarazione di Conformità CE',
    href: '/docs/safety/89931-1.pdf',
    hint: 'Certificazione CE e conformità EN ISO 13688:2013',
  },
  {
    id: 'scheda-tecnica',
    title: '📄 Scarica Scheda Tecnica del Produttore',
    href: '/docs/safety/89931-2.pdf',
    hint: 'Scheda tecnica Delta Plus Horten2 Light',
  },
] as const

export const PORTWEST_TEXPEL_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Fornitore / Prodotto',
    href: '/docs/safety/105192.pdf',
    hint: 'Scheda descrittiva e logistica Portwest (cod. 105192)',
  },
  {
    id: 'dichiarazione-qualita',
    title: '📜 Dichiarazione di Qualità',
    href: '/docs/safety/105192-1.pdf',
    hint: 'Dichiarazione di Qualità del produttore Portwest',
  },
  {
    id: 'scheda-tecnica',
    title: '📄 Scarica Scheda Tecnica del Produttore',
    href: '/docs/safety/105192-2.pdf',
    hint: 'Scheda tecnica dettagliata PW378 Texpel Splash Eco',
  },
] as const

export const LULEA2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/104546.pdf',
    hint: 'Scheda informativa, descrizione estesa e dati logistici (cod. 104546)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/104546-1.pdf',
    hint:
      'Scheda dettagliata Deltaplus Softshell 2 strati, stretch 4 direzioni, 280 g/m² e tabella EAN',
  },
] as const

export const MYSEN2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/86181.pdf',
    hint: 'Scheda descrittiva, dati logistici e specifiche di vendita (cod. 86181)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/86181-1.pdf',
    hint:
      'Scheda tecnica Deltaplus MySen 2:1 — maniche staccabili, Softshell 2 strati elasticizzato, campi d’impiego e tabella EAN/SKU',
  },
] as const

export const SOCCIA_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/104541.pdf',
    hint: 'Scheda informativa, descrizione estesa, dati logistici e specifiche di vendita (cod. 104541)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/104541-1.pdf',
    hint:
      'Scheda dettagliata Deltaplus Soccia Softshell 2 in 1 in poliestere riciclato, stretch 4 direzioni, 280 g/m² e tabella SKU/EAN',
  },
] as const

export const SPACE_LADY_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/97983.pdf',
    hint: 'Scheda descrittiva, dati logistici e commerciali (cod. 97983)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Dichiarazione di Conformità UE',
    href: '/docs/safety/97983-1.pdf',
    hint: 'Certificazione CE EN ISO 13688, EN 14058, DPI Cat. I',
  },
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Prodotto',
    href: '/docs/safety/97983-2.pdf',
    hint:
      'Dettagli Softshell 320 g/m², membrana U-Tex, tecnologia Free Sound e caratteristiche del capo',
  },
] as const

/**
 * Horten2 Light (nero/giallo) — part number / EAN per taglia (Delta Plus).
 * Codici: HORT2NJTM (M), HORT2NJGT (L), HORT2NJXG (XL), HORT2NJXX (XXL).
 */
const HORTEN2_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'HORT2NJTS' },
  { label: 'M', sku: 'HORT2NJTM', ean: '3295249234782' },
  { label: 'L', sku: 'HORT2NJGT', ean: '3295249234799' },
  { label: 'XL', sku: 'HORT2NJXG' },
  { label: 'XXL', sku: 'HORT2NJXX' },
  { label: '3XL', sku: 'HORT2NJ3X' },
]

/** Portwest PW378 Texpel™ Splash Eco — part number per taglia. */
const PORTWEST_TEXPEL_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'PW378BZRS' },
  { label: 'M', sku: 'PW378BZRM' },
  { label: 'L', sku: 'PW378BZRL' },
  { label: 'XL', sku: 'PW378BZRXL' },
  { label: 'XXL', sku: 'PW378BZRXXL' },
  { label: '3XL', sku: 'PW378BZRXXXL' },
]

/** Deltaplus Lulea2 Softshell grigio/nero — part number / EAN per taglia. */
const LULEA2_GRIGIO_NERO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'LULE2GRPT', ean: '3295249200558' },
  { label: 'M', sku: 'LULE2GRTM', ean: '3295249200565' },
  { label: 'L', sku: 'LULE2GRGT', ean: '3295249200619' },
  { label: 'XL', sku: 'LULE2GRXG', ean: '3295249200589' },
  { label: 'XXL', sku: 'LULE2GRXX', ean: '3295249200596' },
  { label: '3XL', sku: 'LULE2GR3X', ean: '3295249200602' },
]

/** Deltaplus MySen 2 Softshell grigio/fucsia — part number / EAN per taglia (scheda 86181-1). */
const MYSEN2_GRIGIO_FUCSIA_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'XS', sku: 'MYSE2GFTPT', ean: '3295249222314' },
  { label: 'S', sku: 'MYSE2GFPT', ean: '3295249222307' },
  { label: 'M', sku: 'MYSE2GFTM', ean: '3295249222291' },
  { label: 'L', sku: 'MYSE2GFGT', ean: '3295249222284' },
  { label: 'XXL', sku: 'MYSE2GFXX', ean: '3295249222215' },
]

/** Deltaplus Soccia Softshell 2 in 1 nero/rosso — part number / EAN per taglia (scheda 104541-1). */
const SOCCIA_NERO_ROSSO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'SOCCINOPT', ean: '3295249301965' },
  { label: 'M', sku: 'SOCCINOTM', ean: '3295249302214' },
  { label: 'L', sku: 'SOCCINOGT', ean: '3295249302221' },
  { label: 'XL', sku: 'SOCCINOXG', ean: '3295249302238' },
  { label: 'XXL', sku: 'SOCCINOXX', ean: '3295249302245' },
  { label: '3XL', sku: 'SOCCINO3X', ean: '3295249302252' },
]

/** U-Power Space Lady Grey Fucsia — solo taglie disponibili a magazzino (M, L). */
const SPACE_LADY_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'M', sku: 'FU187GF-M' },
  { label: 'L', sku: 'FU187GF-L', ean: '8033546443934' },
]

const HORTEN2_GALLERY = ['https://odmultimedia.eu/immagini/MD/89930_1.jpg'] as const
const PORTWEST_TEXPEL_GALLERY = ['https://odmultimedia.eu/immagini/MD/105192_1.jpg'] as const
const SOCCIA_GALLERY = [
  'https://odmultimedia.eu/immagini/MD/104541_1.jpg',
  'https://odmultimedia.eu/immagini/MD/104541_3.jpg',
] as const
const SOCCIA_IMAGE_URL = 'https://odmultimedia.eu/immagini/MD/104541_2.jpg'

const HORTEN2_DISPLAY_NAME =
  'Giacca Softshell Horten2 Light - tessuto Softshell/poliestere/elastan - con cappuccio - nero/giallo - Deltaplus'

const PORTWEST_TEXPEL_DISPLAY_NAME =
  'Giacca da lavoro Softshell Texpel™ Splash Eco - nero/grigio - Portwest'

const LULEA2_DISPLAY_NAME =
  'Giacca Softshell Lulea2 - grigio/nero - Deltaplus'

const MYSEN2_DISPLAY_NAME =
  'Giacca Softshell MySen 2 - tessuto Softshell/poliestere/elastan - grigio/fucsia - Deltaplus'

const SOCCIA_DISPLAY_NAME =
  'Giacca Softshell 2 in 1 Soccia - nero/rosso - Deltaplus'

const SPACE_LADY_DISPLAY_NAME =
  'Giacca Softshell donna Space Lady - grigio/fucsia - U-Power'

const SPACE_LADY_IMAGE_URL = 'https://odmultimedia.eu/immagini/LD/97983.jpg'

const HORTEN2_FAMILY: ApparelFamilyConfig = {
  sizes: HORTEN2_SIZE_VARIANTS,
  documents: HORTEN2_TECHNICAL_DOCUMENTS,
  galleryUrls: [...HORTEN2_GALLERY],
  displayName: HORTEN2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/89931.jpg',
}

const PORTWEST_TEXPEL_FAMILY: ApparelFamilyConfig = {
  sizes: PORTWEST_TEXPEL_SIZE_VARIANTS,
  documents: PORTWEST_TEXPEL_TECHNICAL_DOCUMENTS,
  galleryUrls: [...PORTWEST_TEXPEL_GALLERY],
  displayName: PORTWEST_TEXPEL_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/105192.jpg',
}

const LULEA2_FAMILY: ApparelFamilyConfig = {
  sizes: LULEA2_GRIGIO_NERO_SIZE_VARIANTS,
  documents: LULEA2_TECHNICAL_DOCUMENTS,
  displayName: LULEA2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/104546.jpg',
}

const MYSEN2_FAMILY: ApparelFamilyConfig = {
  sizes: MYSEN2_GRIGIO_FUCSIA_SIZE_VARIANTS,
  documents: MYSEN2_TECHNICAL_DOCUMENTS,
  displayName: MYSEN2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/86181.jpg',
}

const SOCCIA_FAMILY: ApparelFamilyConfig = {
  sizes: SOCCIA_NERO_ROSSO_SIZE_VARIANTS,
  documents: SOCCIA_TECHNICAL_DOCUMENTS,
  galleryUrls: [...SOCCIA_GALLERY],
  displayName: SOCCIA_DISPLAY_NAME,
  imageUrl: SOCCIA_IMAGE_URL,
}

const SPACE_LADY_FAMILY: ApparelFamilyConfig = {
  sizes: SPACE_LADY_SIZE_VARIANTS,
  documents: SPACE_LADY_TECHNICAL_DOCUMENTS,
  displayName: SPACE_LADY_DISPLAY_NAME,
  imageUrl: SPACE_LADY_IMAGE_URL,
}

/** Famiglie con documentazione PDF dedicata (allowlist). */
const APPAREL_FAMILY_BY_SKU: Record<string, ApparelFamilyConfig> = {
  '89931': HORTEN2_FAMILY,
  '89930': HORTEN2_FAMILY,
  '89929': HORTEN2_FAMILY,
  '105192': PORTWEST_TEXPEL_FAMILY,
  '104546': LULEA2_FAMILY,
  '86181': MYSEN2_FAMILY,
  '104541': SOCCIA_FAMILY,
  '97983': SPACE_LADY_FAMILY,
}

/** SKU con certificazioni/PDF tecnici consentiti in categoria Sicurezza. */
const SICUREZZA_DOCS_ALLOWLIST = new Set(Object.keys(APPAREL_FAMILY_BY_SKU))

const APPAREL_SUBCATEGORIES = new Set([
  SICUREZZA_SUBCATEGORY_PANTALONI.toLowerCase(),
  SICUREZZA_SUBCATEGORY_GIUBBOTTI.toLowerCase(),
  SICUREZZA_SUBCATEGORY_GIACCHE.toLowerCase(),
])

const SIZE_LABEL_RE = /^(XS|S|M|L|XL|XXL|3XL|XXXL)$/i

export function isSicurezzaApparelSizeLabel(label: string): boolean {
  return SIZE_LABEL_RE.test(label.trim())
}

export function areSicurezzaApparelSizeVariants(
  variants: ProductVariantOption[] | null | undefined,
): boolean {
  const list = variants ?? []
  return list.length > 0 && list.every((v) => isSicurezzaApparelSizeLabel(v.label))
}

export function isSicurezzaCategoryProduct(
  product: Pick<OfficeProduct, 'category'> | null | undefined,
): boolean {
  if (!product) return false
  return (
    (product.category ?? '').trim().localeCompare(SICUREZZA_CATEGORY, 'it', {
      sensitivity: 'base',
    }) === 0
  )
}

export function isSicurezzaWorkwearProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory'> | null | undefined,
): boolean {
  if (!isSicurezzaCategoryProduct(product)) return false
  const sub = (product?.subcategory ?? '').trim().toLowerCase()
  return APPAREL_SUBCATEGORIES.has(sub)
}

function productSkuKey(product: Pick<OfficeProduct, 'id' | 'producerCode'>): string {
  return String(product.producerCode || product.id || '')
    .trim()
    .toLowerCase()
}

export function isSicurezzaDocsAllowlistedProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  return SICUREZZA_DOCS_ALLOWLIST.has(productSkuKey(product))
}

/** Estrae taglia da format / nome (es. "M · Softshell", "taglia XL"). */
export function extractApparelSizeFromProduct(
  product: Pick<OfficeProduct, 'name' | 'format' | 'mainFeatures'>,
): SicurezzaApparelSize | null {
  const fromFormat = String(product.format ?? '')
    .trim()
    .match(/^(XS|S|M|L|XL|XXL|3XL)\b/i)
  if (fromFormat) {
    const s = fromFormat[1].toUpperCase()
    return (s === 'XXXL' ? '3XL' : s) as SicurezzaApparelSize
  }
  const fromName = String(product.name ?? '').match(/\btaglia\s+(XS|S|M|L|XL|XXL|3XL|XXXL)\b/i)
  if (fromName) {
    const s = fromName[1].toUpperCase()
    return (s === 'XXXL' ? '3XL' : s) as SicurezzaApparelSize
  }
  const feat = product.mainFeatures?.Taglia ?? product.mainFeatures?.taglia ?? ''
  if (isSicurezzaApparelSizeLabel(feat)) {
    const s = feat.trim().toUpperCase()
    return (s === 'XXXL' ? '3XL' : s) as SicurezzaApparelSize
  }
  return null
}

function defaultSizeVariantsForSku(baseSku: string): ProductVariantOption[] {
  const sku = baseSku.trim()
  return SICUREZZA_APPAREL_SIZES.map((size) => ({
    label: size,
    sku: sku ? `${sku}-${size}` : size,
  }))
}

function mergeGalleryUrls(
  primary: string | undefined,
  existing: string[] | undefined,
  extra: string[] | undefined,
): string[] | undefined {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (u?: string) => {
    const t = (u ?? '').trim()
    if (!t || seen.has(t)) return
    seen.add(t)
    out.push(t)
  }
  // `imageGalleryUrls` è aggiuntivo rispetto a imageUrl (già in PDP).
  for (const u of existing ?? []) push(u)
  for (const u of extra ?? []) {
    if (primary && u === primary.trim()) continue
    push(u)
  }
  return out.length ? out : undefined
}

/**
 * Arricchisce prodotti Sicurezza:
 * - abbigliamento: varianti taglia
 * - allowlist: documenti tecnici + galleria dedicata
 * - tutti gli altri Sicurezza: nasconde PDF/certificazioni generiche
 */
export function applySicurezzaApparelCatalog(product: OfficeProduct): OfficeProduct {
  if (!isSicurezzaCategoryProduct(product)) return product

  const skuKey = productSkuKey(product)
  const family = APPAREL_FAMILY_BY_SKU[skuKey] ?? APPAREL_FAMILY_BY_SKU[product.id.trim().toLowerCase()]
  const isWorkwear = isSicurezzaWorkwearProduct(product)

  let next: OfficeProduct = { ...product }

  // 1) Pulizia certificazioni/PDF generici fuori allowlist
  if (!family?.documents?.length) {
    next = {
      ...next,
      brochureUrl: undefined,
      catalogPagePdfUrl: undefined,
      technicalDocuments: undefined,
    }
  }

  if (!isWorkwear && !family) return applySicurezzaPromoDiscount(next)

  const existingAreSizes = areSicurezzaApparelSizeVariants(product.variants)

  if (family?.displayName) {
    next = { ...next, name: family.displayName }
  }
  if (family?.imageUrl?.trim()) {
    next = { ...next, imageUrl: family.imageUrl.trim() }
  }

  if (family?.sizes?.length) {
    next = { ...next, variants: family.sizes.map((v) => ({ ...v })) }
  } else if (isWorkwear && !existingAreSizes && !(product.variants?.length)) {
    const detected = extractApparelSizeFromProduct(product)
    const sizes = defaultSizeVariantsForSku(String(product.producerCode || product.id || ''))
    next = {
      ...next,
      variants: sizes.map((v) =>
        detected && v.label === detected
          ? { ...v, sku: String(product.producerCode || product.id || '').trim() || v.sku }
          : v,
      ),
    }
  }

  if (family?.galleryUrls?.length) {
    next = {
      ...next,
      // Galleria curata: sostituisce eventuali immagini DB non allineate.
      imageGalleryUrls: mergeGalleryUrls(next.imageUrl, undefined, family.galleryUrls),
    }
  }

  if (family?.documents?.length) {
    next = {
      ...next,
      technicalDocuments: family.documents.map((d) => ({ ...d })),
      brochureUrl: undefined,
      catalogPagePdfUrl: undefined,
    }
  }

  const defaultSize =
    extractApparelSizeFromProduct(product) ??
    (areSicurezzaApparelSizeVariants(next.variants) ? (next.variants?.[1]?.label as string) : null)
  if (defaultSize && next.variants) {
    const match = next.variants.find((v) => v.label === defaultSize)
    if (match?.ean && !next.ean) {
      next = {
        ...next,
        ean: match.ean,
        mainFeatures: { ...next.mainFeatures, EAN: match.ean },
      }
    }
    if (match?.sku) {
      next = {
        ...next,
        mainFeatures: {
          ...next.mainFeatures,
          'Cod. produttore': match.sku,
          Taglia: match.label,
        },
      }
    }
  }

  return applySicurezzaPromoDiscount(next)
}

/** Prodotto sintetico 89931 se ancora assente in DB (fallback PDP / listing). */
export function buildHorten2LightOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '89931',
    name: HORTEN2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '89931',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/giallo',
      Materiale: 'Softshell PE/elastan',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/89931.jpg',
    format: 'Softshell con cappuccio · taglie S–3XL',
    price: 60,
    description:
      'Giacca Softshell Delta Plus Horten2 Light con cappuccio, nero/giallo. Softshell a 3 strati laminati (poliestere/elastan): antivento, idrorepellente su pioggia fine e traspirante. Cappuccio fisso, zip sotto patta antipioggia, 4 tasche e piping catarifrangente decorativo. Conformità tipica EN ISO 13688:2013 / Regolamento UE 2016/425 (rischi minori). Selezionare la taglia prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Portwest Texpel Splash Eco (105192). */
export function buildPortwestTexpelSplashEcoOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '105192',
    name: PORTWEST_TEXPEL_DISPLAY_NAME,
    brand: 'Portwest',
    producerCode: '105192',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/grigio',
      Materiale: 'Texpel™ Splash Eco Softshell',
      'Part number': 'PW378BZRL',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/105192.jpg',
    format: 'L · Texpel Splash Eco Softshell · taglie S–3XL',
    price: 60,
    description:
      'Giacca da lavoro Softshell Portwest Texpel™ Splash Eco, nero/grigio. Softshell antivento e traspirante con trattamento Splash Eco orientato a idrorepellenza e resistenza agli schizzi. Vestibilità professionale Portwest; selezionare la taglia (codici PW378BZR*) prima dell’acquisto. Non è un capo alta visibilità EN ISO 20471. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus Lulea2 Softshell grigio/nero (104546). */
export function buildLulea2SoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '104546',
    name: LULEA2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '104546',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/nero',
      Materiale: 'Softshell 2 strati',
      'Part number': 'LULE2GRXG',
      EAN: '3295249200589',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/104546.jpg',
    format: 'XL · Softshell · taglie S–3XL',
    price: 60,
    ean: '3295249200589',
    description:
      'Giacca Softshell Deltaplus Lulea2, grigio/nero. Softshell a 2 strati con stretch a 4 direzioni (~280 g/m²): antivento, idrorepellente e traspirante per uso professionale. Vestibilità ampia adatta sopra pile o maglia. Selezionare la taglia (codici LULE2GR*) prima dell’acquisto. Non certificata EN ISO 20471. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus MySen 2 Softshell grigio/fucsia (86181). */
export function buildMySen2SoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '86181',
    name: MYSEN2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '86181',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/fucsia',
      Materiale: 'Softshell/poliestere/elastan',
      'Part number': 'MYSE2GFTM',
      Taglia: 'M',
      EAN: '3295249222291',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/86181.jpg',
    format: 'M · Softshell 2:1 · taglie XS–XXL',
    price: 60,
    ean: '3295249222291',
    description:
      'Giacca Softshell Deltaplus MySen 2, grigio/fucsia. Softshell a 2 strati elasticizzato (poliestere/elastan) con struttura 2 in 1 e maniche staccabili. Adatta ad ambienti professionali; selezionare la taglia (codici MYSE2GF*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus Soccia Softshell 2 in 1 nero/rosso (104541). */
export function buildSocciaSoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '104541',
    name: SOCCIA_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '104541',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/rosso',
      Materiale: 'Softshell 100% poliestere riciclato',
      'Part number': 'SOCCINOGT',
      Taglia: 'L',
      EAN: '3295249302221',
    },
    imageUrl: SOCCIA_IMAGE_URL,
    imageGalleryUrls: [...SOCCIA_GALLERY],
    format: 'L · Softshell 2 in 1 · taglie S–3XL',
    price: 60,
    ean: '3295249302221',
    description:
      'Giacca Softshell 2 in 1 Deltaplus Soccia, nero/rosso. Softshell in 100% poliestere riciclato con stretch a 4 direzioni (~280 g/m²): antivento, idrorepellente e traspirante. Selezionare la taglia (codici SOCCINO*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP U-Power Space Lady Softshell donna grigio/fucsia (97983). */
export function buildSpaceLadySoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '97983',
    name: SPACE_LADY_DISPLAY_NAME,
    brand: 'U-Power',
    producerCode: '97983',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/fucsia',
      Materiale: 'Softshell 320 g/m² · membrana U-Tex',
      'Cod. modello': 'FU187GF',
      'Part number': 'FU187GF-L',
      Taglia: 'L',
      EAN: '8033546443934',
    },
    imageUrl: SPACE_LADY_IMAGE_URL,
    format: 'L · Softshell donna · taglie M–L',
    price: 60,
    ean: '8033546443934',
    description:
      'Giacca Softshell donna U-Power Space Lady, grigio/fucsia (modello FU187GF). Softshell ~320 g/m² con membrana U-Tex e tecnologia Free Sound. Disponibile solo nelle taglie M e L a magazzino; selezionare la taglia (FU187GF-M / FU187GF-L) prima dell’acquisto. Conformità tipica EN ISO 13688 / EN 14058 (DPI Cat. I). Prezzo unitario imponibile IVA esclusa.',
  })
}
