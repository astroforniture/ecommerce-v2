import type { OfficeProduct } from '../types/officeProduct'
import { buildCartucceTonerOfficeProducts } from '../data/cartucceTonerProducts'
import { buildPileOfficeProducts } from '../data/pileProducts'
import { buildQuaderniOfficeProducts } from '../data/quaderniProducts'
import { buildCasseDitronOfficeProducts } from '../data/casseDitronProducts'
import { buildDistruggidocumentiOfficeProducts } from '../data/distruggidocumentiProducts'
import { buildEtichettatriciOfficeProducts } from '../data/macchineEtichettatrici'
import { buildIHealthAstroMedicalOfficeProducts } from '../data/iHealthAstroMedicalProducts'
import { buildLegacyAstroMedicalOfficeProducts } from '../data/legacyAstroMedicalOfficeProducts'
import { buildProfessionalDiagnosticAstroMedicalOfficeProducts } from '../data/professionalDiagnosticAstroMedicalProducts'
import { buildEthiconSuturesAstroMedicalOfficeProducts } from '../data/ethiconSuturesAstroMedicalProducts'
import { buildLaboratoryBagsAstroMedicalOfficeProducts } from '../data/laboratoryBagsAstroMedicalProducts'
import { buildWellnessBagsScalesAstroMedicalOfficeProducts } from '../data/wellnessBagsScalesAstroMedicalProducts'
import { buildProfessionalInstrumentationAstroMedicalOfficeProducts } from '../data/professionalInstrumentationAstroMedicalProducts'
import { buildIvCannulaAstroMedicalOfficeProducts } from '../data/ivCannulaAstroMedicalProducts'
import { buildSurgicalInstrumentsAstroMedicalOfficeProducts } from '../data/surgicalInstrumentsAstroMedicalProducts'

export const TIMBRO_AZIENDE_FARMACIE_ID = 'AF-TIMBRO-AZIENDE'
export const TIMBRO_AZIENDE_FARMACIE_SKU = 'AF-TIMBRO-AZIENDE'

export type TrodatModelSpec = {
  code: string
  sizeLabel: string
  lines: number
}

export const TRODAT_STAMP_MODELS: readonly TrodatModelSpec[] = [
  { code: '4910', sizeLabel: '26×9 mm', lines: 1 },
  { code: '4911', sizeLabel: '38×14 mm', lines: 2 },
  { code: '4912', sizeLabel: '47×18 mm', lines: 3 },
  { code: '4913', sizeLabel: '58×22 mm', lines: 4 },
  { code: '4915', sizeLabel: '70×25 mm', lines: 5 },
] as const

export type TrodatInkColorSpec = {
  id: string
  label: string
  imageUrl: string
}

export const TRODAT_INK_COLORS: readonly TrodatInkColorSpec[] = [
  { id: 'nero', label: 'Nero', imageUrl: '/trodat_nero.jpg' },
  { id: 'rosso', label: 'Rosso', imageUrl: '/trodat_rosso.jpg' },
  { id: 'verde', label: 'Verde', imageUrl: '/trodat_verde.jpg' },
  { id: 'blu', label: 'Blu', imageUrl: '/trodat_blu.jpg' },
] as const

export function buildTimbroAziendeFarmacieOfficeProduct(): OfficeProduct {
  return {
    id: TIMBRO_AZIENDE_FARMACIE_ID,
    name: 'Timbro per Aziende e Farmacie',
    brand: 'Trodat',
    producerCode: TIMBRO_AZIENDE_FARMACIE_SKU,
    category: 'Cancelleria',
    subcategory: 'Timbri',
    mainFeatures: {
      Tipologia: 'Timbro personalizzabile Trodat',
    },
    imageUrl: '/timbri.jpg',
    description:
      'Timbro autoinchiostrante personalizzabile. Scegli il modello Trodat, il colore dell’inchiostro e il testo per ogni riga disponibile. Prezzo su preventivo.',
    price: 0,
  }
}

export function isTimbroAziendeFarmacieProduct(
  p: Pick<OfficeProduct, 'id' | 'producerCode'> | undefined | null,
): boolean {
  if (!p) return false
  const id = String(p.id ?? '').trim().toUpperCase()
  const sku = String(p.producerCode ?? '').trim().toUpperCase()
  return id === TIMBRO_AZIENDE_FARMACIE_ID || sku === TIMBRO_AZIENDE_FARMACIE_SKU
}

export function timbroMatchesUrlKey(raw: string): boolean {
  const k = raw.trim().toUpperCase()
  return k === TIMBRO_AZIENDE_FARMACIE_ID || k === TIMBRO_AZIENDE_FARMACIE_SKU
}

function normalizeColorKey(label: string): string {
  return label.trim().toLowerCase().normalize('NFC')
}

export type TimbroSpecialStampType = 'numeratore' | 'datario'

const TIMBRO_SPECIAL_LINE_COUNT = 3

export function timbroSpecialTypeLabel(t: TimbroSpecialStampType): string {
  return t === 'numeratore' ? 'Numeratore' : 'Datario'
}

export function buildTimbroCartVariant(
  input:
    | {
        mode: 'standard'
        model: TrodatModelSpec
        colorLabel: string
        textLines: string[]
      }
    | {
        mode: 'special'
        specialType: TimbroSpecialStampType
        colorLabel: string
        textLines: string[]
      },
): { label: string; sku: string; cartDisplayName: string } {
  const { colorLabel, textLines } = input
  const lineCount =
    input.mode === 'special' ? TIMBRO_SPECIAL_LINE_COUNT : input.model.lines
  const normalizedLines = textLines.slice(0, lineCount).map((t) => String(t ?? '').trim())
  while (normalizedLines.length < lineCount) normalizedLines.push('')

  const textBlock = normalizedLines.map((t, i) => `Riga ${i + 1}: ${t || '—'}`).join('\n')

  if (input.mode === 'special') {
    const st = input.specialType
    const tipoLabel = timbroSpecialTypeLabel(st)
    const label = `TIMBRO|SPEC:${st}|${normalizeColorKey(colorLabel)}|${normalizedLines.join('¦')}`
    const cartDisplayName = [
      'Timbro per Aziende e Farmacie',
      '',
      `Tipo timbro: ${tipoLabel} (modello speciale)`,
      `Righe di personalizzazione: ${TIMBRO_SPECIAL_LINE_COUNT} (fisse)`,
      `Colore inchiostro: ${colorLabel}`,
      '',
      'Testo personalizzato:',
      textBlock,
    ].join('\n')
    return { label, sku: TIMBRO_AZIENDE_FARMACIE_SKU, cartDisplayName }
  }

  const model = input.model
  const label = `TIMBRO|${model.code}|${normalizeColorKey(colorLabel)}|${normalizedLines.join('¦')}`
  const cartDisplayName = [
    'Timbro per Aziende e Farmacie',
    '',
    `Modello: Trodat ${model.code} (${model.sizeLabel})`,
    `Colore inchiostro: ${colorLabel}`,
    '',
    'Testo personalizzato:',
    textBlock,
  ].join('\n')
  return {
    label,
    sku: TIMBRO_AZIENDE_FARMACIE_SKU,
    cartDisplayName,
  }
}

export function buildTimbroDefaultCartVariant(): {
  label: string
  sku: string
  cartDisplayName: string
} {
  return buildTimbroCartVariant({
    mode: 'standard',
    model: TRODAT_STAMP_MODELS[0],
    colorLabel: TRODAT_INK_COLORS[0].label,
    textLines: Array(TRODAT_STAMP_MODELS[0].lines).fill(''),
  })
}

export function getInjectedLocalCatalogProducts(): OfficeProduct[] {
  return [
    buildTimbroAziendeFarmacieOfficeProduct(),
    ...buildDistruggidocumentiOfficeProducts(),
    ...buildEtichettatriciOfficeProducts(),
    ...buildCasseDitronOfficeProducts(),
    ...buildCartucceTonerOfficeProducts(),
    ...buildPileOfficeProducts(),
    ...buildQuaderniOfficeProducts(),
    ...buildIHealthAstroMedicalOfficeProducts(),
    ...buildLegacyAstroMedicalOfficeProducts(),
    ...buildProfessionalDiagnosticAstroMedicalOfficeProducts(),
    ...buildSurgicalInstrumentsAstroMedicalOfficeProducts(),
    ...buildIvCannulaAstroMedicalOfficeProducts(),
    ...buildEthiconSuturesAstroMedicalOfficeProducts(),
    ...buildLaboratoryBagsAstroMedicalOfficeProducts(),
    ...buildWellnessBagsScalesAstroMedicalOfficeProducts(),
    ...buildProfessionalInstrumentationAstroMedicalOfficeProducts(),
  ]
}
