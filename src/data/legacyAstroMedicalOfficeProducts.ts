import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
import type { MedicalProduct } from './medicalProducts'
import { getAllMedicalProducts } from './medicalProducts'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'

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

const GIMA_33371_QUANTITY_TIERS: QuantityPriceTier[] = [
  { minQuantity: 1, unitPrice: 28.5 },
  { minQuantity: 5, unitPrice: 26 },
  { minQuantity: 10, unitPrice: 24 },
]

const GIMA_33371_NAME = 'ELETTRODI PE-FOAM MONOUSO 48-50 mm - Conf. 50 pz'
const GIMA_33371_DESCRIPTION =
  'Elettrodi PE-Foam monouso diametro 48-50 mm, confezione da 50 pezzi. Codice GIMA 33371. ' +
  'Prezzo riferito alla confezione da 50 pz, imponibile IVA esclusa.\n\n' +
  'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.'

export function isGima33371OfficeProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toLowerCase()
  const sku = String(product.producerCode ?? '').trim().toLowerCase()
  const name = String(product.name ?? '').trim().toLowerCase()
  return (
    id === 'gima-33371' ||
    sku === 'gima-33371' ||
    sku === '33371' ||
    sku.endsWith('ams-0018') ||
    (name.includes('elettrodi') && name.includes('pe-foam') && name.includes('48-50'))
  )
}

/** Listino e documenti ufficiali GIMA 33371 (anche dopo merge DB). */
export function applyLegacyAstroMedicalProductOverrides(product: OfficeProduct): OfficeProduct {
  if (!isGima33371OfficeProduct(product)) return product
  return {
    ...product,
    name: GIMA_33371_NAME,
    price: 28.5,
    description: GIMA_33371_DESCRIPTION,
    brochureUrl: 'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=33371',
    brochureLinkLabel: 'Scheda Tecnica',
    catalogPagePdfUrl: 'https://www.gimaitaly.com/Download/158480/33371',
    catalogPagePdfLabel: 'Manuale / Documento PDF',
    quantityPriceTiers: GIMA_33371_QUANTITY_TIERS.map((t) => ({ ...t })),
    mainFeatures: {
      ...(product.mainFeatures ?? {}),
      'Codice GIMA': '33371',
      Confezione: '50 pz',
      Diametro: '48-50 mm',
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
