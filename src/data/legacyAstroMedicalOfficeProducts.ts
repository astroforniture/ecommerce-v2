import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
import type { MedicalProduct } from './medicalProducts'
import { getAllMedicalProducts } from './medicalProducts'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'
import { gimaImageStemFromUrl, gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'

/** Prefisso legacy PDP / carrello quando manca URL Gima. */
export const LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX = 'AF-AMED-'

let legacyAstroMedicalGimaIdSet: ReadonlySet<string> | null = null

export function legacyAstroMedicalCanonicalId(key: string): string {
  const k = String(key ?? '').trim()
  if (!k.startsWith(LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX)) return k
  const sku = k.slice(LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX.length)
  const m = getAllMedicalProducts().find((x) => x.sku === sku)
  if (!m) return k
  return gimaOfficeProductIdFromImageUrl(m.imageUrl) ?? k
}

export function isLegacyAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  legacyAstroMedicalGimaIdSet ??= new Set(
    buildLegacyAstroMedicalOfficeProducts().map((p) => p.id),
  )
  return legacyAstroMedicalGimaIdSet.has(s)
}

function officeDescription(m: MedicalProduct): string {
  const path = m.categoryPath.join(' › ')
  const base = (m.fullDescription ?? m.name).trim()
  return `${base}\n\nLinea: ${path}. Prezzo unitario imponibile IVA esclusa.`
}

type GimaElectrodeOverride = {
  gimaSku: string
  name: string
  price: number
  packLabel: string
  diameter: string
  extraFeatures?: Record<string, string>
  galleryUrls?: string[]
  description: string
  /** Vuoto = prezzo fisso per confezione (niente tabella scaglioni). */
  quantityPriceTiers: QuantityPriceTier[]
  /** Mostra la tabella listino quantità anche con un solo scaglione (prezzo base). */
  showQuantityDiscountTable?: boolean
}

const GIMA_ELECTRODE_OVERRIDES: readonly GimaElectrodeOverride[] = [
  {
    gimaSku: '33371',
    name: 'ELETTRODI PE-FOAM MONOUSO 48-50 mm - Conf. 50 pz.',
    price: 6.7,
    packLabel: '50 pz',
    diameter: '48-50 mm',
    description:
      'Elettrodi PE-Foam monouso diametro 48-50 mm, confezione da 50 pezzi. Codice GIMA 33371. ' +
      'Prezzo fisso per confezione da 50 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '33314',
    name: 'ELETTRODI MONOUSO FOAM 36-40 mm - Conf. 2000 pz.',
    price: 200,
    packLabel: '2000 pz',
    diameter: '36-40 mm',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/33314_a.jpg'],
    description:
      'Elettrodi monouso foam diametro 36-40 mm, confezione da 2000 pezzi. Codice GIMA 33314. ' +
      'Prezzo riferito alla confezione da 2000 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 200 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '33344',
    name: 'ELETTRODI FOAM MONOUSO 48-50mm - gel - Conf. 1200 pz.',
    price: 170,
    packLabel: '1200 pz',
    diameter: '48-50 mm',
    extraFeatures: { Gel: 'Sì' },
    description:
      'Elettrodi foam monouso diametro 48-50 mm con gel, confezione da 1200 pezzi. Codice GIMA 33344. ' +
      'Prezzo riferito alla confezione da 1200 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 170 }],
    showQuantityDiscountTable: true,
  },
]

const GIMA_ELECTRODE_BY_SKU = new Map(GIMA_ELECTRODE_OVERRIDES.map((row) => [row.gimaSku, row]))

function numericGimaSku(value: string): string | null {
  const s = String(value ?? '').trim().toLowerCase()
  const m = s.match(/^(?:gima-)?(\d{5})(?:[_-].*)?$/)
  return m?.[1] ?? null
}

function gimaElectrodeOverrideForProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name' | 'imageUrl'>,
): GimaElectrodeOverride | null {
  const fromId = numericGimaSku(product.id)
  if (fromId && GIMA_ELECTRODE_BY_SKU.has(fromId)) return GIMA_ELECTRODE_BY_SKU.get(fromId) ?? null
  const fromSku = numericGimaSku(product.producerCode)
  if (fromSku && GIMA_ELECTRODE_BY_SKU.has(fromSku)) return GIMA_ELECTRODE_BY_SKU.get(fromSku) ?? null
  const fromImage = numericGimaSku(gimaImageStemFromUrl(product.imageUrl) ?? '')
  if (fromImage && GIMA_ELECTRODE_BY_SKU.has(fromImage)) {
    return GIMA_ELECTRODE_BY_SKU.get(fromImage) ?? null
  }
  const name = String(product.name ?? '').trim().toLowerCase()
  if (!name.includes('elettrod')) return null
  if (name.includes('gel') && name.includes('48-50')) return GIMA_ELECTRODE_BY_SKU.get('33344') ?? null
  if (name.includes('36-40')) return GIMA_ELECTRODE_BY_SKU.get('33314') ?? null
  if (name.includes('pe-foam') && name.includes('48-50')) return GIMA_ELECTRODE_BY_SKU.get('33371') ?? null
  return null
}

/** Listino, documenti e galleria GIMA elettrodi (anche dopo merge DB). */
export function applyLegacyAstroMedicalProductOverrides(product: OfficeProduct): OfficeProduct {
  const spec = gimaElectrodeOverrideForProduct(product)
  if (!spec) return product
  return {
    ...product,
    name: spec.name,
    price: spec.price,
    description: spec.description,
    brochureUrl: `https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=${spec.gimaSku}`,
    brochureLinkLabel: 'Scheda Tecnica',
    catalogPagePdfUrl: `https://www.gimaitaly.com/Download/158480/${spec.gimaSku}`,
    catalogPagePdfLabel: 'Manuale / Documento PDF',
    quantityPriceTiers: spec.quantityPriceTiers.map((t) => ({ ...t })),
    showQuantityDiscountTable: spec.showQuantityDiscountTable === true,
    imageGalleryUrls: spec.galleryUrls?.length
      ? spec.galleryUrls.filter((url) => url !== product.imageUrl)
      : product.imageGalleryUrls,
    mainFeatures: {
      ...(product.mainFeatures ?? {}),
      'Codice GIMA': spec.gimaSku,
      Confezione: spec.packLabel,
      Diametro: spec.diameter,
      ...(spec.extraFeatures ?? {}),
    },
  }
}

export function buildLegacyAstroMedicalOfficeProducts(): OfficeProduct[] {
  return getAllMedicalProducts().map((m) => {
    const id =
      gimaOfficeProductIdFromImageUrl(m.imageUrl) ??
      `${LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX}${m.sku}`
    return applyLegacyAstroMedicalProductOverrides({
      id,
      name: m.name.trim(),
      brand: 'Gima',
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: (m.categoryPath[0] ?? 'Medical').trim(),
      mainFeatures: {},
      imageUrl: (m.imageUrl ?? '').trim(),
      price: m.price,
      description: officeDescription(m),
    })
  })
}
