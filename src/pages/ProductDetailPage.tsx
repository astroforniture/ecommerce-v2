import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, FileText, Loader2, Mail } from 'lucide-react'
import {
  STABILO_OHPEN_TIP_MM,
  BIG_SEI_ROTA_COLOR_LABELS,
  BIG_SEI_ROTA_DORSO_CM,
  fetchBigSeiRotaVariantBySelection,
  detectStarboxColorLabel,
  bigSeiRotaPriceForThicknessCm,
  detectSoftSeiRotaFormatLabel,
  EUROBOX_ESSELTE_DORSO_CM,
  fetchBigSeiRotaVariants,
  fetchEuroboxEsselteVariants,
  fetchOfficeProductByIdentifier,
  fetchOxfordG85Variants,
  fetchPunchedEnvelopeModelVariants,
  fetchStabiloOhpenVariantBySelection,
  fetchStabiloOhpenVariants,
  fetchStarlineArchiveBoxProductByVariant,
  fetchStarlineArchiveBoxVariants,
  fetchStarlinePunchedEnvelopeVariantBySelection,
  fetchStarboxColorVariants,
  fetchBicCristal50ColorVariants,
  fetchPilotHiTecpointVariants,
  fetchStaedtlerNorisVariants,
  fetchFermagliZincatiVariants,
  fetchStarlineCartellinaVariants,
  fetchDeskStaplerPinzaVariants,
  fetchEuroCartLacciVariants,
  fetchImballoProTapeVariants,
  fetchTrattoVideoHighlighterColorVariants,
  fetchSoftSeiRotaVariantByFormat,
  fetchSoftSeiRotaVariants,
  fetchBlasettiMailpackVariantByFormat,
  fetchBlasettiMailpackVariants,
  fetchPentelMarkerVariantByColor,
  fetchPentelMarkerVariants,
  fetchProductFamilyByParentSku,
  fetchRelatedOfficeProducts,
  isStabiloOhpenCatalogProduct,
  isBigSeiRotaCatalogProduct,
  isEuroboxEsselteCatalogProduct,
  isSoftSeiRotaCatalogProduct,
  isBlasettiMailpackCatalogProduct,
  isPentelMarkerCatalogProduct,
  isBicCristal50CatalogProduct,
  isPilotHiTecpointCatalogProduct,
  isStaedtlerNorisCatalogProduct,
  isZenithPointsCatalogProduct,
  isDeskStaplerPinzaCatalogProduct,
  isFermagliZincatiCatalogProduct,
  isImballoProTapeCatalogProduct,
  detectPilotHiTecpointTipMm,
  PILOT_HI_TECPOINT_TIP_MM,
  detectStaedtlerNorisGradeLabel,
  detectFermagliZincatiNumberLabel,
  isTrattoVideoHighlighterCatalogProduct,
  isStarlineArchiveBoxCatalogProduct,
  OFFICE_CATALOG_DATA_REVISION,
  BIG_SEI_ROTA_HD_IMAGE_BY_COLOR,
  SOFT_SEI_ROTA_FORMAT_LABELS,
  BLASETTI_MAILPACK_FORMAT_LABELS,
  blasettiMailpackFixedPriceForFormat,
  blasettiMailpackFormatDisplayCm,
  blasettiMailpackLineKey,
  detectBlasettiMailpackFormatLabel,
  pentelMarkerBaseTitleFromName,
  pentelMarkerFamilyKey,
  softSeiRotaPriceForFormat,
  STAEDTLER_NORIS_GRADE_LABELS,
  FERMAGLI_ZINCATI_NUMBER_LABELS,
  IMBALLO_PRO_TAPE_VARIANT_LABELS,
  detectImballoProTapeVariantLabel,
  STABILO_OHPEN_COLOR_LABELS,
  STARLINE_ARCHIVE_BOX_COLOR_LABELS,
  STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT,
  starlineArchiveBoxImageForVariant,
  starlineArchiveVariantKeyFromProducerCode,
} from '../api/officeProductsSupabase'
import { useCart } from '../context/CartContext'
import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'
import { withOfficeImageCacheBust } from '../lib/officeImageCacheBust'
import {
  effectiveUnitPrice,
  isQuantityInDiscountTier,
  lineImponible,
  quantityDiscountRowsDetailed,
} from '../lib/quantityPricing'
import {
  decodeProductPathParam,
  productDetailPath,
  productDetailUrlSegment,
} from '../lib/productRoutes'
import {
  modelFinishFromProduct,
  modelFinishFromVariant,
  modelQualityFromProduct,
  modelQualityFromVariant,
} from '../lib/officeProductModelMeta'
import { isPunchedEnvelopeProduct } from '../lib/punchedEnvelope'
import { isTimbroAziendeFarmacieProduct } from '../lib/timbroAziendeFarmacieProduct'
import { TimbroAziendeFarmacieDetail } from '../components/product/TimbroAziendeFarmacieDetail'
import { OfficeProductDetailPurchasePanel } from '../components/product/OfficeProductDetailPurchasePanel'
import {
  OfficeProductDetailDescriptionSection,
  OfficeProductDetailRelatedSection,
} from '../components/product/OfficeProductDetailMetaSections'
import {
  isStaticSyntheticOfficeProduct,
  staticSyntheticOfficeListingPath,
} from '../lib/syntheticOfficeCatalogProducts'
import {
  buildCasseDitronOfficeProducts,
  isCasseDitronOfficeProductId,
  isQuoteOnlyOfficeProduct,
} from '../data/casseDitronProducts'
import {
  buildShopperCartaOfficeProducts,
  buildShopperPlasticaOfficeProducts,
  isShopperSizeVariantProduct,
  matchesShopperCartaProduct,
  matchesShopperPlasticaProduct,
} from '../data/shopperCancelleria'
import {
  buildDistruggidocumentiOfficeProducts,
  isDistruggidocumentiOfficeProductId,
} from '../data/distruggidocumentiProducts'
import { buildCartucceTonerOfficeProducts, isCartucceTonerOfficeProductId } from '../data/cartucceTonerProducts'
import {
  buildEtichettatriciOfficeProducts,
  isEtichettatriciOfficeProductId,
} from '../data/macchineEtichettatrici'
import { buildPileOfficeProducts, isPileOfficeProductId } from '../data/pileProducts'
import { buildQuaderniOfficeProducts, isQuaderniOfficeProductId } from '../data/quaderniProducts'
import {
  buildIHealthAstroMedicalOfficeProducts,
  iHealthAstroMedicalRelatedIdsForProductId,
  isIHealthOfficeProductId,
} from '../data/iHealthAstroMedicalProducts'
import {
  buildLineaAstroMedicalAllOfficeProducts,
} from '../data/lineaAstroMedicalCombined'
import {
  buildProfessionalDiagnosticAstroMedicalOfficeProducts,
  isProfessionalDiagnosticOfficeProductId,
  professionalDiagnosticRelatedIdsForProductId,
} from '../data/professionalDiagnosticAstroMedicalProducts'
import {
  buildEthiconSuturesAstroMedicalOfficeProducts,
  isEthiconSuturesAstroMedicalOfficeProductId,
  ethiconSuturesRelatedIdsForProductId,
} from '../data/ethiconSuturesAstroMedicalProducts'
import {
  buildLaboratoryBagsAstroMedicalOfficeProducts,
  isLaboratoryBagsAstroMedicalOfficeProductId,
  laboratoryBagsRelatedIdsForProductId,
} from '../data/laboratoryBagsAstroMedicalProducts'
import {
  buildWellnessBagsScalesAstroMedicalOfficeProducts,
  isWellnessBagsScalesAstroMedicalOfficeProductId,
  wellnessBagsScalesRelatedIdsForProductId,
} from '../data/wellnessBagsScalesAstroMedicalProducts'
import {
  buildProfessionalInstrumentationAstroMedicalOfficeProducts,
  isProfessionalInstrumentationAstroMedicalOfficeProductId,
  professionalInstrumentationRelatedIdsForProductId,
} from '../data/professionalInstrumentationAstroMedicalProducts'
import {
  buildIvCannulaAstroMedicalOfficeProducts,
  isIvCannulaAstroMedicalOfficeProductId,
  ivCannulaRelatedIdsForProductId,
} from '../data/ivCannulaAstroMedicalProducts'
import {
  buildSurgicalInstrumentsAstroMedicalOfficeProducts,
  isSurgicalInstrumentsOfficeProductId,
  surgicalInstrumentsRelatedIdsForProductId,
} from '../data/surgicalInstrumentsAstroMedicalProducts'
import { isLegacyAstroMedicalOfficeProductId } from '../data/legacyAstroMedicalOfficeProducts'
import {
  IMPULSE_75_A4_BASE_PRICE,
  IMPULSE_75_A4_QUANTITY_TIERS,
  isImpulse75A4OfficeProduct,
} from '../data/featuredImpulseOffer'

const STARBOX_BASE_PRICE = 4.15
const STARBOX_QUANTITY_TIERS = [
  { minQuantity: 6, unitPrice: 3.95 },
  { minQuantity: 13, unitPrice: 3.75 },
] as const
const PUNCHED_ENVELOPE_TOP_BASE_PRICE = 5.6
const PUNCHED_ENVELOPE_TOP_TIERS = [{ minQuantity: 3, unitPrice: 5.09 }] as const
const PUNCHED_ENVELOPE_MEDIUM_BASE_PRICE = 4.5
const PUNCHED_ENVELOPE_MEDIUM_TIERS = [{ minQuantity: 3, unitPrice: 4.09 }] as const
const EUROCART_LACCI_BASE_PRICE = 2.8
const EUROCART_LACCI_QUANTITY_TIERS = [
  { minQuantity: 25, unitPrice: 2.4 },
  { minQuantity: 51, unitPrice: 2.2 },
] as const
const STARBOX_FORBIDDEN_5CM_COLORS = new Set(['Lilla', 'Arancio'])
const OXFORD_5CM_ALLOWED_COLORS = new Set(['Blu', 'Rosso', 'Verde', 'Giallo'])
const binderDorsoRowClass = 'mt-2.5 flex flex-row items-center gap-2'
/** Selettore dorso Big Sei Rota: pulsanti grandi, touch-friendly (Rev). */
const bigSeiRotaDorsoRowClass =
  'mt-2.5 flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden'
const softSeiRotaFormatGridClass = 'mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3'
const binderColorRowClass = 'mt-2 flex flex-row flex-nowrap items-center justify-start gap-2'
const binderColorTileClass = 'inline-flex outline-none'
const binderColorThumbBaseClass =
  'relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white transition'
const selectorRowClass = 'mt-2.5 flex flex-row items-center gap-3'
const selectorButtonClass =
  'inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150'

/** Stessi selettori delle Buste Forate, pulsanti più grandi (Rev 58). */
const archiveVariantRowClass = `${selectorRowClass} flex-wrap gap-4`
const archiveVariantButtonClass =
  `${selectorButtonClass} min-h-[2.85rem] px-6 py-3 text-base font-semibold`

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const SHOPPER_PERSONALIZZATE_MAILTO =
  'mailto:info@astro-forniture.it?subject=Richiesta%20preventivo%20Shopper%20Personalizzate'
const SEO_META_DESCRIPTION_NAME = 'description'
const SEO_CANONICAL_REL = 'canonical'
const SEO_JSONLD_ID = 'seo-product-jsonld'
const SEO_BREADCRUMB_JSONLD_ID = 'seo-breadcrumb-jsonld'

function setMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function setMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function setMetaDescription(content: string) {
  let meta = document.querySelector(
    `meta[name="${SEO_META_DESCRIPTION_NAME}"]`,
  ) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', SEO_META_DESCRIPTION_NAME)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function setCanonical(href: string) {
  let canonical = document.querySelector(
    `link[rel="${SEO_CANONICAL_REL}"]`,
  ) as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', SEO_CANONICAL_REL)
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', href)
}

function upsertProductJsonLd(payload: Record<string, unknown>) {
  let script = document.getElementById(SEO_JSONLD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = SEO_JSONLD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(payload)
}

function upsertJsonLdById(id: string, payload: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(payload)
}

function colorToneClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (!c) return 'border-slate-300'
  if (c.includes('assortit')) return 'border-slate-400'
  if (c.includes('ciclamino')) return 'border-fuchsia-500'
  if (c.includes('bianco') || c.includes('white')) return 'border-slate-200'
  if (c.includes('azzurro') || c.includes('cyan')) return 'border-[#00FFFF]'
  if (c.includes('fucsia') || c.includes('magenta')) return 'border-[#FF00FF]'
  if (c.includes('lilla') || c.includes('viola')) return 'border-violet-400'
  if (c.includes('arancio') || c.includes('orange')) return 'border-orange-400'
  if (c.includes('rosa') || c.includes('fucsia')) return 'border-pink-400'
  if (c.includes('rosso')) return 'border-red-400'
  if (c.includes('lime')) return 'border-lime-500'
  if (c.includes('verde')) return 'border-emerald-400'
  if (c.includes('blu') || c.includes('azzurro') || c.includes('celeste')) return 'border-sky-400'
  if (c.includes('giallo')) return 'border-yellow-400'
  if (c.includes('nero')) return 'border-slate-700'
  if (c.includes('bianco')) return 'border-slate-300'
  if (c.includes('grigio') || c.includes('grey')) return 'border-slate-400'
  if (c.includes('marrone')) return 'border-amber-700'
  return 'border-slate-300'
}

function colorSelectedGlowClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (c.includes('assortit')) return 'shadow-slate-400/60'
  if (c.includes('ciclamino')) return 'shadow-fuchsia-300/70'
  if (c.includes('bianco') || c.includes('white')) return 'shadow-slate-200/70'
  if (c.includes('azzurro') || c.includes('cyan')) return 'shadow-cyan-300/70'
  if (c.includes('fucsia') || c.includes('magenta')) return 'shadow-fuchsia-300/70'
  if (c.includes('lilla') || c.includes('viola')) return 'shadow-violet-300/70'
  if (c.includes('arancio') || c.includes('orange')) return 'shadow-orange-300/70'
  if (c.includes('rosso')) return 'shadow-red-300/70'
  if (c.includes('lime')) return 'shadow-lime-300/70'
  if (c.includes('verde')) return 'shadow-emerald-300/70'
  if (c.includes('blu') || c.includes('azzurro') || c.includes('celeste')) return 'shadow-sky-300/70'
  if (c.includes('giallo')) return 'shadow-yellow-300/70'
  if (c.includes('nero')) return 'shadow-slate-400/70'
  return 'shadow-slate-300/70'
}

function staedtlerGradeBorderClasses(grade: string): string {
  const g = String(grade ?? '').toUpperCase()
  if (g === '2B') return 'border-red-400'
  if (g === 'B') return 'border-orange-400'
  if (g === 'HB') return 'border-sky-400'
  if (g === 'H') return 'border-emerald-400'
  if (g === '2H') return 'border-violet-400'
  return 'border-slate-300'
}

function fermagliNumberBorderClasses(numberLabel: string): string {
  const n = String(numberLabel ?? '').toLowerCase()
  if (n.includes('1')) return 'border-red-400'
  if (n.includes('2')) return 'border-orange-400'
  if (n.includes('3')) return 'border-sky-400'
  if (n.includes('4')) return 'border-emerald-400'
  if (n.includes('5')) return 'border-violet-400'
  if (n.includes('6')) return 'border-slate-500'
  return 'border-slate-300'
}

function imballoProTapeBorderClasses(variantLabel: string): string {
  const v = String(variantLabel ?? '').toLowerCase()
  if (v.includes('avana')) return 'border-amber-700'
  if (v.includes('trasparente')) return 'border-sky-200'
  return 'border-slate-300'
}

function euroboxColorToneClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (c.includes('rosso')) return 'border-red-500'
  if (c.includes('blu')) return 'border-sky-500'
  if (c.includes('verde')) return 'border-emerald-500'
  if (c.includes('giallo')) return 'border-[#f59e0b]'
  return 'border-slate-300'
}

function trattovideoColorToneClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (c.includes('giallo')) return 'border-[#f59e0b]'
  if (c.includes('lime')) return 'border-lime-500'
  if (c.includes('viola')) return 'border-violet-500'
  if (c.includes('fucsia') || c.includes('magenta')) return 'border-fuchsia-500'
  return colorToneClasses(colorName)
}

function bicColorToneClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (c.includes('nero')) return 'border-slate-800'
  if (c.includes('blu')) return 'border-sky-500'
  if (c.includes('rosso')) return 'border-red-500'
  if (c.includes('verde')) return 'border-emerald-500'
  if (c.includes('marrone')) return 'border-amber-900'
  if (c.includes('arancio') || c.includes('arancione')) return 'border-orange-500'
  if (c.includes('viola')) return 'border-violet-600'
  if (c.includes('lilla')) return 'border-violet-300'
  return colorToneClasses(colorName)
}

/** Riempimento selettore Pentel (Rev 197). */
function pentelMarkerSwatchFill(colorName: string): string {
  const c = colorName.toLowerCase()
  if (c.includes('nero')) return 'bg-slate-900'
  if (c.includes('blu')) return 'bg-sky-600'
  if (c.includes('rosso')) return 'bg-red-600'
  if (c.includes('verde')) return 'bg-emerald-600'
  if (c.includes('marrone')) return 'bg-amber-900'
  if (c.includes('giallo')) return 'bg-amber-400'
  if (c.includes('arancio') || c.includes('arancione')) return 'bg-orange-500'
  if (c.includes('lilla')) return 'bg-violet-300'
  if (c.includes('viola')) return 'bg-violet-600'
  if (c.includes('azzurro')) return 'bg-cyan-500'
  if (c.includes('lime')) return 'bg-lime-500'
  if (c.includes('bianco')) return 'bg-white'
  if (c.includes('fucsia')) return 'bg-fuchsia-600'
  return 'bg-slate-400'
}

function euroboxSelectedGlowClasses(colorName?: string): string {
  const c = (colorName ?? '').toLowerCase()
  if (c.includes('rosso')) return 'shadow-red-400/70'
  if (c.includes('blu')) return 'shadow-sky-400/70'
  if (c.includes('verde')) return 'shadow-emerald-400/70'
  if (c.includes('giallo')) return 'shadow-amber-400/70'
  return 'shadow-slate-300/70'
}

function detectThicknessCmFromName(name: string): number | null {
  const n = (name ?? '').toLowerCase()
  const m = n.match(/(\d{1,2})\s*cm\b/)
  if (!m) return null
  const value = Number.parseInt(m[1], 10)
  return Number.isFinite(value) ? value : null
}

function detectStabiloTipMmFromName(name: string): number | null {
  const n = (name ?? '').toLowerCase().replace(',', '.')
  const m = n.match(/\b(0\.[47]|1\.0)\s*mm\b/)
  if (!m) return null
  const value = Number.parseFloat(m[1])
  return Number.isFinite(value) ? value : null
}

function normalizeOxfordModelNameByThickness(name: string, thicknessCm: number | null): string {
  const raw = String(name ?? '')
  if (thicknessCm === 5) return raw.replace(/\bG85\b/gi, 'G84')
  if (thicknessCm === 8) return raw.replace(/\bG84\b/gi, 'G85')
  return raw
}

function prettifySoftSeiRotaFormatLabel(label: string): string {
  return String(label ?? '')
    .trim()
    .replace(/(\d{2})\s*[x×]\s*(\d{2})\s*cm/i, '$1 x $2 cm')
}

function detectSoftSeiRotaPackLabel(name: string): string | null {
  const raw = String(name ?? '')
  const conf = raw.match(/conf\.?\s*(?:da\s*)?(\d+)\s*pz/i)
  if (conf) return `conf. ${conf[1]} pz`
  const pack = raw.match(/\b(?:da\s*)?(\d+)\s*pz\b/i)
  if (pack) return `conf. ${pack[1]} pz`
  return null
}

function detectStarlineCartellinaModelKind(
  name: string,
  brand?: string | null,
): 'semplice' | '3lembi' | null {
  const n = (name ?? '').toLowerCase()
  const b = String(brand ?? '').toLowerCase()
  if (!n.includes('cartellin')) return null
  if (!n.includes('starline') && !b.includes('starline')) return null
  if (/\b3\s*lembi\b/.test(n) || /\btre\s*lembi\b/.test(n)) return '3lembi'
  if (n.includes('25 pz') || n.includes('25 pez')) return '3lembi'
  if (n.includes('semplice')) return 'semplice'
  if (n.includes('50 pz') || n.includes('50 pez')) return 'semplice'
  return null
}

/** Catalogo ufficiale Rev. 162 — solo queste varianti in griglia. */
const STARLINE_CARTELLINA_ASSORTITI_LABEL = 'Colori Assortiti (5 colori)' as const

const STARLINE_CARTELLINA_OFFICIAL_COLORS: readonly string[] = [
  'Giallo',
  'Rosso',
  'Verde',
  'Arancio',
  'Blu',
  'Azzurro',
  'Ciclamino',
  'Bianco',
  STARLINE_CARTELLINA_ASSORTITI_LABEL,
]

/** Anteprima confezione mista se manca `image_url` / varianti con foto. */
function starlineCartellinaAssortitiPreviewDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="#f8fafc"/><text x="48" y="20" text-anchor="middle" font-size="8" fill="#64748b">5 colori</text><rect x="8" y="30" width="24" height="24" fill="#facc15" rx="3"/><rect x="36" y="30" width="24" height="24" fill="#ef4444" rx="3"/><rect x="64" y="30" width="24" height="24" fill="#22c55e" rx="3"/><rect x="22" y="60" width="24" height="24" fill="#3b82f6" rx="3"/><rect x="50" y="60" width="24" height="24" fill="#c026d3" rx="3"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Mappa nome/`color_name` DB sull’etichetta ufficiale di griglia, oppure null se colore non catalogato (Rev. 162).
 */
function officialStarlineCartellinaColor(name: string, colorName?: string | null): string | null {
  const blob = `${String(colorName ?? '')} ${String(name ?? '')}`.toLowerCase()
  if (/(assortit|assorted)/i.test(blob) || (/\b5\b/.test(blob) && /(color|colour|colore)/i.test(blob))) {
    return STARLINE_CARTELLINA_ASSORTITI_LABEL
  }
  if (/\bnero\b|\bblack\b/.test(blob)) return null
  if (/\blime\b/.test(blob)) return null
  if (/\bfucsia\b|\bfuchsia\b|\bmagenta\b/.test(blob)) return null
  if (/\blill\w*\b|\blilac\b|\bviola\b/.test(blob)) return null
  if (/\bciclamino\b/.test(blob)) return 'Ciclamino'
  if (/\bazzurr\w*\b|\bceleste\b/.test(blob)) return 'Azzurro'
  if (/\bblu\b/.test(blob)) return 'Blu'
  if (/\bross\w*\b/.test(blob)) return 'Rosso'
  if (/\bverd\w*\b/.test(blob)) return 'Verde'
  if (/\bgiall\w*\b/.test(blob)) return 'Giallo'
  if (/\baranci\w*\b|\borange\b/.test(blob)) return 'Arancio'
  if (/\bbianc\w*\b|\bwhite\b/.test(blob)) return 'Bianco'
  const star = detectStarboxColorLabel(name)
  if (star && (STARLINE_CARTELLINA_OFFICIAL_COLORS as readonly string[]).includes(star)) return star
  return null
}

function isOfficialCartellinaGridColor(c: string | null | undefined): boolean {
  if (!c?.trim()) return false
  const t = c.trim().toLowerCase()
  return STARLINE_CARTELLINA_OFFICIAL_COLORS.some((x) => x.toLowerCase() === t)
}

/** Normalizza `color_name` / titolo verso un’etichetta griglia ufficiale (anche se il blob principale non matcha). */
function canonicalCartellinaColorForProduct(name: string, colorName?: string | null): string | null {
  const fromBlob = officialStarlineCartellinaColor(name, colorName)
  if (fromBlob) return fromBlob
  const raw = String(colorName ?? '').trim()
  if (raw) {
    const lower = raw.toLowerCase()
    const exact = STARLINE_CARTELLINA_OFFICIAL_COLORS.find((o) => o.toLowerCase() === lower)
    if (exact) return exact
  }
  const blob = `${String(colorName ?? '')} ${String(name ?? '')}`.toLowerCase()
  const longFirst = [...STARLINE_CARTELLINA_OFFICIAL_COLORS].sort((a, b) => b.length - a.length)
  for (const official of longFirst) {
    if (official === STARLINE_CARTELLINA_ASSORTITI_LABEL) {
      if (/(assortit|assorted)/i.test(blob) || (/\b5\b/.test(blob) && /(color|colour|colore)/i.test(blob))) {
        return STARLINE_CARTELLINA_ASSORTITI_LABEL
      }
      continue
    }
    const o = official.toLowerCase()
    if (o.length >= 4 && blob.includes(o)) return official
  }
  const shortMap: Record<string, string> = {
    azzurro: 'Azzurro',
    arancio: 'Arancio',
    arancione: 'Arancio',
    ciclamino: 'Ciclamino',
    rosso: 'Rosso',
    verde: 'Verde',
    giallo: 'Giallo',
    bianco: 'Bianco',
    blu: 'Blu',
  }
  for (const [needle, label] of Object.entries(shortMap)) {
    if (blob.includes(needle) && (STARLINE_CARTELLINA_OFFICIAL_COLORS as readonly string[]).includes(label)) {
      return label
    }
  }
  return null
}

function normalizeCartellinaImageSrc(url: string): string {
  const t = String(url ?? '').trim()
  if (!t) return ''
  if (t.startsWith('//')) return `https:${t}`
  return t
}

function resolveCartellinaThumbnailUrl(
  p: OfficeProduct | null | undefined,
  gridColorLabel: string,
  revision: number,
): string {
  if (!p) return ''
  const want = gridColorLabel.trim().toLowerCase()
  const main = normalizeCartellinaImageSrc(p.imageUrl ?? '')
  if (main) return withOfficeImageCacheBust(main, revision)
  for (const v of p.variants ?? []) {
    const raw = v as ProductVariantOption & { imageUrl?: string }
    const u = normalizeCartellinaImageSrc((raw.image_url ?? raw.imageUrl ?? '').trim())
    if (!u) continue
    const lab = (v.label ?? '').trim().toLowerCase()
    if (lab && (lab.includes(want) || want.includes(lab))) {
      return withOfficeImageCacheBust(u, revision)
    }
  }
  for (const v of p.variants ?? []) {
    const raw = v as ProductVariantOption & { imageUrl?: string }
    const u = normalizeCartellinaImageSrc((raw.image_url ?? raw.imageUrl ?? '').trim())
    if (u) return withOfficeImageCacheBust(u, revision)
  }
  if (gridColorLabel === STARLINE_CARTELLINA_ASSORTITI_LABEL) return starlineCartellinaAssortitiPreviewDataUrl()
  return ''
}

type DeskStaplerModel = 'pastel' | 'antibacterial' | 'grigia' | 'base'
const EUROCART_LACCI_DORSI_CM = [5, 8, 10, 12, 15, 18, 20] as const

function detectEuroCartLacciDorsoCm(name: string): number | null {
  const n = String(name ?? '').toLowerCase().replace(',', '.')
  const m = n.match(/(?:dorso\s*)?(\d{1,2})(?:\s*cm)?\b/)
  if (!m) return null
  const value = Number.parseInt(m[1], 10)
  return Number.isFinite(value) ? value : null
}

function isEuroCartLacciFamilyProduct(product: OfficeProduct | null | undefined): boolean {
  if (!product) return false
  const n = String(product.name ?? '').toLowerCase()
  const b = String(product.brand ?? '').toLowerCase()
  const c = String(product.category ?? '').toLowerCase()
  const sub = String(product.subcategory ?? '').toLowerCase()
  const euroBrand = b.includes('euro-cart') || b.includes('eurocart') || b.includes('euro cart')
  const cartella = n.includes('cartell')
  const archivio = n.includes('archivio') || c.includes('archivio')
  const lacci = n.includes('lacci') || sub.includes('lacci')
  // Keep this intentionally permissive to avoid hiding the selector when data fields are inconsistent.
  return (euroBrand && (lacci || (archivio && cartella))) || (cartella && archivio && lacci)
}

function detectDeskStaplerModel(name: string): DeskStaplerModel {
  const n = String(name ?? '').toLowerCase()
  if (n.includes('pastel')) return 'pastel'
  if (n.includes('antibacterial') || n.includes('anti bacterial')) return 'antibacterial'
  if (n.includes('grigia') || n.includes('grigio') || n.includes('grey') || n.includes('gray')) return 'grigia'
  return 'base'
}

function detectDeskStaplerColor(name: string, colorName?: string): string {
  const explicit = String(colorName ?? '').trim()
  if (explicit) return explicit
  const known = detectStarboxColorLabel(name)
  if (known) return known
  const n = String(name ?? '').toLowerCase()
  if (n.includes('rosa')) return 'Rosa'
  if (n.includes('grig')) return 'Grigia'
  if (n.includes('assortit')) return 'Assortiti'
  return 'Colore'
}

function cleanSoftSeiRotaVariantName(name: string): string {
  return String(name ?? '')
    .trim()
    .replace(/(\d{2})\s*[x×]\s*(\d{2})\s*cm/i, '$1 x $2 cm')
}

/** Tile variante: colonna fissa, etichette a capo sotto l’icona senza sovrapporsi. */
const variantTileMinHeight = 'min-h-[6.25rem]'
const variantTileLinkClass = `flex w-full min-w-[4.75rem] max-w-[6rem] flex-col items-center gap-1.5 ${variantTileMinHeight} rounded-md py-0.5 text-center outline-none`
const variantCaptionStack = 'mt-auto flex w-full min-w-0 flex-col items-stretch gap-1'
const variantCaptionPrimary =
  'w-full min-w-0 break-words px-1 text-center text-[10px] font-semibold leading-snug text-balance sm:text-[11px]'
const variantCaptionSecondary =
  'w-full min-w-0 break-words px-1 text-center text-[10px] font-normal leading-snug text-balance text-slate-600 sm:text-[11px]'
const variantGridClass =
  'mt-2.5 flex flex-wrap content-start justify-start gap-x-4 gap-y-5 sm:gap-x-5'

const COLOR_COPY_A3_GRAMMAGE_OPTIONS = [
  { key: '100g', grammage: 100, packSheets: 500, price: 24.9 },
  { key: '120g', grammage: 120, packSheets: 500, price: 28.9 },
  { key: '160g', grammage: 160, packSheets: 250, price: 32.5 },
  { key: '200g', grammage: 200, packSheets: 250, price: 39.9 },
  { key: '250g', grammage: 250, packSheets: 125, price: 49.5 },
  { key: '280g', grammage: 280, packSheets: 125, price: 56.9 },
  { key: '300g', grammage: 300, packSheets: 125, price: 63.5 },
  { key: '350g', grammage: 350, packSheets: 125, price: 74.9 },
] as const

const COLOR_COPY_A4_GRAMMAGE_OPTIONS = [
  { key: '100g', grammage: 100, packSheets: 500, price: 16.9 },
  { key: '120g', grammage: 120, packSheets: 500, price: 19.9 },
  { key: '160g', grammage: 160, packSheets: 250, price: 24.9 },
  { key: '200g', grammage: 200, packSheets: 250, price: 30.9 },
  { key: '250g', grammage: 250, packSheets: 125, price: 38.9 },
  { key: '280g', grammage: 280, packSheets: 125, price: 44.9 },
  { key: '300g', grammage: 300, packSheets: 125, price: 49.9 },
  { key: '350g', grammage: 350, packSheets: 125, price: 57.9 },
] as const

export function ProductDetailPage() {
  const ENABLE_ARCHIVE_BOX_VARIANTS = false
  const { productId: rawProductId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  /** Stesso valore usato in fetch: decodifica sicura + NFC (deve coincidere con `producerCode` / id in DB). */
  const productKey = useMemo(() => decodeProductPathParam(rawProductId), [rawProductId])
  const { addOfficeProduct } = useCart()
  const [imgOk, setImgOk] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [syntheticGalleryIdx, setSyntheticGalleryIdx] = useState(0)
  const [selectedJsonVariant, setSelectedJsonVariant] = useState<ProductVariantOption | null>(null)
  const [selectedStarboxThickness, setSelectedStarboxThickness] = useState<number | null>(null)
  const [selectedSoftSeiRotaFormat, setSelectedSoftSeiRotaFormat] = useState<string | null>(null)
  const [selectedSoftSeiRotaProduct, setSelectedSoftSeiRotaProduct] = useState<OfficeProduct | null>(null)
  const [selectedCartellinaProduct, setSelectedCartellinaProduct] = useState<OfficeProduct | null>(
    null,
  )
  const [selectedCartellinaModel, setSelectedCartellinaModel] = useState<'semplice' | '3lembi' | null>(
    null,
  )
  const [selectedCartellinaColor, setSelectedCartellinaColor] = useState<string | null>(null)
  const [selectedDeskStaplerProduct, setSelectedDeskStaplerProduct] = useState<OfficeProduct | null>(null)
  const [selectedDeskStaplerModel, setSelectedDeskStaplerModel] = useState<DeskStaplerModel | null>(null)
  const [selectedDeskStaplerColor, setSelectedDeskStaplerColor] = useState<string | null>(null)
  const [selectedEuroCartLacciProduct, setSelectedEuroCartLacciProduct] = useState<OfficeProduct | null>(null)
  const [selectedEuroCartLacciDorsoCm, setSelectedEuroCartLacciDorsoCm] = useState<number | null>(null)
  const [selectedBlasettiMailpackFormat, setSelectedBlasettiMailpackFormat] = useState<string | null>(null)
  const [selectedBlasettiMailpackProduct, setSelectedBlasettiMailpackProduct] =
    useState<OfficeProduct | null>(null)
  const [selectedPentelColor, setSelectedPentelColor] = useState<string | null>(null)
  const [selectedPentelProduct, setSelectedPentelProduct] = useState<OfficeProduct | null>(null)
  const [selectedColorCopyA3Grammage, setSelectedColorCopyA3Grammage] = useState<string>('160g')

  const query = useQuery({
    queryKey: ['office-product', OFFICE_CATALOG_DATA_REVISION, productKey],
    queryFn: () => fetchOfficeProductByIdentifier(productKey),
    enabled: Boolean(productKey.trim()),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const product = query.data ?? undefined
  const isStaticSynthetic = useMemo(
    () => Boolean(product && isStaticSyntheticOfficeProduct(product)),
    [product],
  )
  const syntheticGalleryImageUrls = useMemo(() => {
    if (!product || !isStaticSynthetic) return [] as string[]
    const raw = [product.imageUrl, ...(product.imageGalleryUrls ?? [])]
    const seen = new Set<string>()
    const out: string[] = []
    for (const s of raw) {
      const t = (s ?? '').trim()
      if (!t || seen.has(t)) continue
      seen.add(t)
      out.push(t)
    }
    return out
  }, [product, isStaticSynthetic])
  const isColorCopyA3 = useMemo(() => {
    const n = String(product?.name ?? '').toLowerCase()
    return n.includes('carta color copy') && n.includes('a3')
  }, [product?.name])
  const isColorCopyA4 = useMemo(() => {
    const n = String(product?.name ?? '').toLowerCase()
    return n.includes('carta color copy') && n.includes('a4')
  }, [product?.name])
  const colorCopyGrammageOptions = isColorCopyA4
    ? COLOR_COPY_A4_GRAMMAGE_OPTIONS
    : COLOR_COPY_A3_GRAMMAGE_OPTIONS
  const selectedColorCopyA3Option = useMemo(
    () =>
      colorCopyGrammageOptions.find((opt) => opt.key === selectedColorCopyA3Grammage) ??
      (isColorCopyA4 ? COLOR_COPY_A4_GRAMMAGE_OPTIONS[0] : COLOR_COPY_A3_GRAMMAGE_OPTIONS[2]),
    [selectedColorCopyA3Grammage, colorCopyGrammageOptions, isColorCopyA4],
  )

  const relatedQuery = useQuery({
    queryKey: ['office-related', OFFICE_CATALOG_DATA_REVISION, product?.id, product?.category],
    queryFn: () =>
      fetchRelatedOfficeProducts(product!.category, product!.id, 4),
    enabled: Boolean(
      product?.id && product?.category && !isStaticSyntheticOfficeProduct(product),
    ),
    staleTime: 0,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const familyQuery = useQuery({
    queryKey: ['office-family', OFFICE_CATALOG_DATA_REVISION, product?.parentSku],
    queryFn: () => fetchProductFamilyByParentSku(product!.parentSku!),
    enabled: Boolean(product?.parentSku?.trim()),
    /** Listino e righe famiglia da DB: niente cache lunga così sconti allineati a `product_quantity_prices`. */
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const starlineCartellinaQuery = useQuery({
    queryKey: ['office-starline-cartellina-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchStarlineCartellinaVariants(product!),
    enabled: Boolean(product && detectStarlineCartellinaModelKind(product.name, product.brand) != null),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const deskStaplerVariantsQuery = useQuery({
    queryKey: ['office-desk-stapler-pinza-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchDeskStaplerPinzaVariants(product!),
    enabled: Boolean(product && isDeskStaplerPinzaCatalogProduct(product)),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const euroCartLacciVariantsQuery = useQuery({
    queryKey: ['office-eurocart-lacci-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchEuroCartLacciVariants(product!),
    enabled: Boolean(product && isEuroCartLacciFamilyProduct(product)),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const blasettiMailpackVariantsQuery = useQuery({
    queryKey: [
      'office-blasetti-mailpack-variants',
      OFFICE_CATALOG_DATA_REVISION,
      product && isBlasettiMailpackCatalogProduct(product)
        ? blasettiMailpackLineKey(product)
        : product?.id ?? '',
    ],
    queryFn: () => fetchBlasettiMailpackVariants(product!),
    enabled: Boolean(product && isBlasettiMailpackCatalogProduct(product)),
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: 'always',
  })
  const pentelMarkerColorsQuery = useQuery({
    queryKey: [
      'office-pentel-marker-colors',
      OFFICE_CATALOG_DATA_REVISION,
      product && isPentelMarkerCatalogProduct(product)
        ? pentelMarkerFamilyKey(product)
        : product?.id ?? '',
    ],
    queryFn: () => fetchPentelMarkerVariants(product!),
    enabled: Boolean(product && isPentelMarkerCatalogProduct(product)),
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: 'always',
  })

  const isBusteForate = useMemo(() => {
    if (isPunchedEnvelopeProduct(product)) return true
    const n = (product?.name ?? '').toLowerCase()
    return n.includes('buste') && n.includes('forate') && n.includes('starline')
  }, [product])
  const isStarboxRaccoglitore = useMemo(() => {
    const n = (product?.name ?? '').toLowerCase()
    return n.includes('raccoglitore') && n.includes('starbox')
  }, [product?.name])
  const isImpulse75A4 = useMemo(() => isImpulse75A4OfficeProduct(product), [product])
  const isShopperSizeVariant = useMemo(
    () => isShopperSizeVariantProduct(product),
    [product],
  )
  const isOxfordG85 = useMemo(() => {
    const n = (product?.name ?? '').toLowerCase()
    return (
      n.includes('registratore') &&
      n.includes('oxford') &&
      (n.includes('g85') || n.includes('g84'))
    )
  }, [product?.name])
  const isEuroboxEsselte = useMemo(() => {
    if (!product) return false
    return isEuroboxEsselteCatalogProduct(product)
  }, [product])
  const isBigSeiRota = useMemo(() => {
    if (!product) return false
    const n = (product.name ?? '').toLowerCase()
    const b = (product.brand ?? '').toLowerCase()
    if (b.includes('sei rota') && n.includes('scatol') && n.includes('archivio')) return true
    return isBigSeiRotaCatalogProduct(product)
  }, [product])
  const isSoftSeiRota = useMemo(() => {
    if (!product) return false
    return isSoftSeiRotaCatalogProduct(product)
  }, [product])
  const isBlasettiMailpack = useMemo(() => {
    if (!product) return false
    return isBlasettiMailpackCatalogProduct(product)
  }, [product])
  const isStarlineCartellina = useMemo(() => {
    if (!product) return false
    return detectStarlineCartellinaModelKind(product.name, product.brand) != null
  }, [product?.id, product?.name, product?.brand])
  const isDeskStaplerPinza = useMemo(() => {
    if (!product) return false
    return isDeskStaplerPinzaCatalogProduct(product)
  }, [product?.id, product?.name, product?.brand])
  const isEuroCartLacci = useMemo(() => {
    if (!product) return false
    if (isEuroCartLacciFamilyProduct(product)) return true
    return (euroCartLacciVariantsQuery.data?.length ?? 0) > 0
  }, [product?.id, product?.name, product?.brand, product?.subcategory, euroCartLacciVariantsQuery.data])
  const effectiveEuroCartLacciProduct = useMemo(() => {
    if (!isEuroCartLacci || !product) return null
    const pool = euroCartLacciVariantsQuery.data ?? [product]
    if (selectedEuroCartLacciDorsoCm != null) {
      const byDorso = pool.find((p) => detectEuroCartLacciDorsoCm(p.name) === selectedEuroCartLacciDorsoCm)
      if (byDorso) return byDorso
    }
    return selectedEuroCartLacciProduct ?? product
  }, [
    isEuroCartLacci,
    product,
    euroCartLacciVariantsQuery.data,
    selectedEuroCartLacciDorsoCm,
    selectedEuroCartLacciProduct,
  ])
  const effectiveEuroCartLacciDorsoCm = useMemo(() => {
    if (!isEuroCartLacci) return null
    return (
      selectedEuroCartLacciDorsoCm ??
      detectEuroCartLacciDorsoCm(effectiveEuroCartLacciProduct?.name ?? '') ??
      detectEuroCartLacciDorsoCm(product?.name ?? '') ??
      null
    )
  }, [
    isEuroCartLacci,
    selectedEuroCartLacciDorsoCm,
    effectiveEuroCartLacciProduct?.name,
    product?.name,
  ])
  /** Titolo «Scatola archivio…» oppure SKU noto archivio Starline. */
  const isStarlineArchiveBox = useMemo(() => {
    if (!ENABLE_ARCHIVE_BOX_VARIANTS) return false
    if (!product) return false
    const n = (product.name ?? '').toLowerCase()
    if (n.includes('scatola') && n.includes('archivio')) return true
    return isStarlineArchiveBoxCatalogProduct(product)
  }, [ENABLE_ARCHIVE_BOX_VARIANTS, product])
  const isStabiloOhpen = useMemo(() => {
    if (!product) return false
    return isStabiloOhpenCatalogProduct(product)
  }, [product])
  const isTrattoVideoHighlighter = useMemo(() => {
    if (!product) return false
    return isTrattoVideoHighlighterCatalogProduct(product)
  }, [product])
  const isBicCristal50 = useMemo(() => {
    if (!product) return false
    return isBicCristal50CatalogProduct(product)
  }, [product])
  const isPentelMarker = useMemo(() => {
    if (!product) return false
    return isPentelMarkerCatalogProduct(product)
  }, [product])
  const isPilotHiTecpoint = useMemo(() => {
    if (!product) return false
    return isPilotHiTecpointCatalogProduct(product)
  }, [product])
  const isStaedtlerNoris = useMemo(() => {
    if (!product) return false
    return isStaedtlerNorisCatalogProduct(product)
  }, [product])
  const isZenithPoints = useMemo(() => {
    if (!product) return false
    return isZenithPointsCatalogProduct(product)
  }, [product])
  const isFermagliZincati = useMemo(() => {
    if (!product) return false
    return isFermagliZincatiCatalogProduct(product)
  }, [product])
  const isImballoProTape = useMemo(() => {
    if (!product) return false
    return isImballoProTapeCatalogProduct(product)
  }, [product])
  const punchedEnvelopeThickness = useMemo<'medio' | 'pesante' | null>(() => {
    if (!isBusteForate || !product) return null
    const quality = (modelQualityFromProduct(product) ?? '').toLowerCase()
    const n = product.name.toLowerCase()
    if (quality.includes('top') || /\btop\b/.test(n)) return 'pesante'
    if (quality.includes('medium') || /\bmedium\b/.test(n)) return 'medio'
    return null
  }, [isBusteForate, product])

  const punchedEnvelopeQuery = useQuery({
    queryKey: ['office-punched-envelope-models', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchPunchedEnvelopeModelVariants(product!),
    enabled: Boolean(product && isBusteForate),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const punchedEnvelopeSlots = punchedEnvelopeQuery.data ?? []
  const showPunchedEnvelopeIcons =
    isBusteForate && punchedEnvelopeQuery.isSuccess && punchedEnvelopeSlots.length > 0
  const showPunchedEnvelopeLoading = isBusteForate && punchedEnvelopeQuery.isPending
  const punchedEnvelopeCurrentSlot = useMemo(
    () => punchedEnvelopeSlots.find((s) => String(s.product.id) === String(product?.id)),
    [punchedEnvelopeSlots, product?.id],
  )
  const punchedEnvelopeTargets = useMemo(() => {
    const targets = new Map<'goffrata-medio' | 'goffrata-pesante' | 'liscia-medio' | 'liscia-pesante', (typeof punchedEnvelopeSlots)[number]>()
    for (const slot of punchedEnvelopeSlots) {
      const label = slot.label.toLowerCase()
      const finish = label.includes('buccia') ? 'goffrata' : label.includes('liscio') ? 'liscia' : null
      const thickness = label.includes('top') ? 'pesante' : label.includes('medium') ? 'medio' : null
      if (!finish || !thickness) continue
      targets.set(`${finish}-${thickness}`, slot)
    }
    return targets
  }, [punchedEnvelopeSlots])
  const punchedCurrentFinish = useMemo(() => {
    const fromSlot = punchedEnvelopeCurrentSlot?.label.toLowerCase()
    if (fromSlot?.includes('buccia')) return 'goffrata'
    if (fromSlot?.includes('liscio')) return 'liscia'
    if (!product) return 'goffrata'
    const inferred = (modelFinishFromProduct(product) ?? '').toLowerCase()
    return inferred.includes('buccia') ? 'goffrata' : 'liscia'
  }, [punchedEnvelopeCurrentSlot?.label, product])
  const punchedCurrentThickness = useMemo(() => {
    const fromSlot = punchedEnvelopeCurrentSlot?.label.toLowerCase()
    if (fromSlot?.includes('medium')) return 'medio'
    if (fromSlot?.includes('top')) return 'pesante'
    if (!product) return 'medio'
    const inferred = (modelQualityFromProduct(product) ?? '').toLowerCase()
    return inferred.includes('top') ? 'pesante' : 'medio'
  }, [punchedEnvelopeCurrentSlot?.label, product])
  const resolvePunchedTarget = useMemo(() => {
    return (finish: 'goffrata' | 'liscia', thickness: 'medio' | 'pesante') => {
      const exact = punchedEnvelopeTargets.get(`${finish}-${thickness}` as const)
      if (exact) return exact
      const byFinish = punchedEnvelopeTargets.get(`${finish}-medio` as const) ?? punchedEnvelopeTargets.get(`${finish}-pesante` as const)
      if (byFinish) return byFinish
      const byThickness =
        punchedEnvelopeTargets.get(`goffrata-${thickness}` as const) ??
        punchedEnvelopeTargets.get(`liscia-${thickness}` as const)
      if (byThickness) return byThickness
      return punchedEnvelopeCurrentSlot ?? punchedEnvelopeSlots[0] ?? null
    }
  }, [punchedEnvelopeCurrentSlot, punchedEnvelopeSlots, punchedEnvelopeTargets])
  const [switchingPunchedVariant, setSwitchingPunchedVariant] = useState(false)
  const [archivePreview, setArchivePreview] = useState<OfficeProduct | null>(null)
  const [selectedArchiveDorsoCm, setSelectedArchiveDorsoCm] = useState<number | null>(null)
  const [archiveVariantBusy, setArchiveVariantBusy] = useState(false)

  const archiveBoxQuery = useQuery({
    queryKey: ['office-starline-archive-box', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchStarlineArchiveBoxVariants(product!),
    enabled: Boolean(product && isStarlineArchiveBox),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const archiveSlots = archiveBoxQuery.data ?? []
  const showArchiveBoxLoading = isStarlineArchiveBox && archiveBoxQuery.isPending

  const stabiloColorsQuery = useQuery({
    queryKey: ['office-stabilo-ohpen-colors', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchStabiloOhpenVariants(product!),
    enabled: Boolean(product && isStabiloOhpen),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const stabiloColorSlots = stabiloColorsQuery.data ?? []
  const showStabiloOhpenLoading = isStabiloOhpen && stabiloColorsQuery.isPending
  const currentStabiloOhpenColor = useMemo(() => {
    const fromSlot =
      stabiloColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    return detectStarboxColorLabel(product?.name ?? '') ?? ''
  }, [stabiloColorSlots, product?.id, product?.name])
  const currentStabiloOhpenTip = useMemo(() => {
    const fromSlot =
      stabiloColorSlots.find((s) => String(s.product.id) === String(product?.id))?.tipMm ?? null
    if (fromSlot != null) return fromSlot
    const fromName = detectStabiloTipMmFromName(product?.name ?? '')
    if (fromName != null) return fromName
    return 0.4
  }, [stabiloColorSlots, product?.id, product?.name])

  const trattoColorsQuery = useQuery({
    queryKey: ['office-tratto-video-colors', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchTrattoVideoHighlighterColorVariants(product!),
    enabled: Boolean(product && isTrattoVideoHighlighter),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const trattoColorSlots = trattoColorsQuery.data ?? []
  const showTrattoLoading = isTrattoVideoHighlighter && trattoColorsQuery.isPending
  const currentTrattoColor = useMemo(() => {
    const fromSlot =
      trattoColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ??
      ''
    if (fromSlot) return fromSlot
    return detectStarboxColorLabel(product?.name ?? '') ?? ''
  }, [trattoColorSlots, product?.id, product?.name])

  const bicColorsQuery = useQuery({
    queryKey: ['office-bic-cristal-50-colors', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchBicCristal50ColorVariants(product!),
    enabled: Boolean(product && isBicCristal50),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const bicColorSlots = bicColorsQuery.data ?? []
  const showBicLoading = isBicCristal50 && bicColorsQuery.isPending
  const currentBicColor = useMemo(() => {
    const fromSlot =
      bicColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    return detectStarboxColorLabel(product?.name ?? '') ?? ''
  }, [bicColorSlots, product?.id, product?.name])

  const pilotColorsQuery = useQuery({
    queryKey: ['office-pilot-hi-tecpoint-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchPilotHiTecpointVariants(product!),
    enabled: Boolean(product && isPilotHiTecpoint),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const pilotVariantSlots = pilotColorsQuery.data ?? []
  const showPilotLoading = isPilotHiTecpoint && pilotColorsQuery.isPending
  const currentPilotTipMm = useMemo(() => {
    const fromSlot = pilotVariantSlots.find((s) => String(s.product.id) === String(product?.id))?.tipMm ?? null
    if (fromSlot != null) return fromSlot
    return detectPilotHiTecpointTipMm(product?.name ?? '') ?? 0.5
  }, [pilotVariantSlots, product?.id, product?.name])
  const currentPilotColor = useMemo(() => {
    const fromSlot =
      pilotVariantSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    return detectStarboxColorLabel(product?.name ?? '') ?? ''
  }, [pilotVariantSlots, product?.id, product?.name])
  const pilotColorSlots = useMemo(() => {
    return pilotVariantSlots.filter((s) => s.tipMm === currentPilotTipMm)
  }, [pilotVariantSlots, currentPilotTipMm])

  const staedtlerVariantsQuery = useQuery({
    queryKey: ['office-staedtler-noris-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchStaedtlerNorisVariants(product!),
    enabled: Boolean(product && isStaedtlerNoris),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const staedtlerVariantSlots = staedtlerVariantsQuery.data ?? []
  const showStaedtlerLoading = isStaedtlerNoris && staedtlerVariantsQuery.isPending
  const currentStaedtlerGrade = useMemo(() => {
    const fromSlot =
      staedtlerVariantSlots.find((s) => String(s.product.id) === String(product?.id))?.gradeLabel ?? ''
    if (fromSlot) return fromSlot
    return detectStaedtlerNorisGradeLabel(product?.name ?? '') ?? ''
  }, [staedtlerVariantSlots, product?.id, product?.name])

  const fermagliVariantsQuery = useQuery({
    queryKey: ['office-fermagli-zincati-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchFermagliZincatiVariants(product!),
    enabled: Boolean(product && isFermagliZincati),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const fermagliVariantSlots = fermagliVariantsQuery.data ?? []
  const showFermagliLoading = isFermagliZincati && fermagliVariantsQuery.isPending
  const currentFermagliNumber = useMemo(() => {
    const fromSlot =
      fermagliVariantSlots.find((s) => String(s.product.id) === String(product?.id))?.numberLabel ?? ''
    if (fromSlot) return fromSlot
    return detectFermagliZincatiNumberLabel(product?.name ?? '') ?? ''
  }, [fermagliVariantSlots, product?.id, product?.name])

  const imballoProTapeQuery = useQuery({
    queryKey: ['office-imballo-pro-tape-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchImballoProTapeVariants(product!),
    enabled: Boolean(product && isImballoProTape),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const imballoProTapeSlots = imballoProTapeQuery.data ?? []
  const showImballoProTapeLoading = isImballoProTape && imballoProTapeQuery.isPending
  const currentImballoProTapeLabel = useMemo(() => {
    const fromSlot =
      imballoProTapeSlots.find((s) => String(s.product.id) === String(product?.id))?.variantLabel ?? ''
    if (fromSlot) return fromSlot
    return detectImballoProTapeVariantLabel(product?.name ?? '') ?? ''
  }, [imballoProTapeSlots, product?.id, product?.name])

  const effectiveArchiveColor = useMemo(() => {
    const pid = archivePreview?.id ?? product?.id
    const fromSlot =
      archiveSlots.find((s) => String(s.product.id) === String(pid))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    const skuKey = product
      ? starlineArchiveVariantKeyFromProducerCode(product.producerCode)
      : null
    if (skuKey) {
      const parts = skuKey.split(':')
      return parts[1] ?? ''
    }
    return detectStarboxColorLabel(product?.name ?? '') ?? ''
  }, [archivePreview, product, archiveSlots])

  const effectiveArchiveDorso = useMemo(() => {
    if (selectedArchiveDorsoCm === 16 || selectedArchiveDorsoCm === 20) return selectedArchiveDorsoCm
    const p = archivePreview ?? product
    const skuKey = p ? starlineArchiveVariantKeyFromProducerCode(p.producerCode) : null
    if (skuKey) {
      const cm = Number.parseInt(skuKey.split(':')[0] ?? '', 10)
      if (cm === 16 || cm === 20) return cm
    }
    const fromName = detectThicknessCmFromName(p?.name ?? '')
    if (fromName === 16 || fromName === 20) return fromName
    if (archiveSlots.some((s) => s.thicknessCm === 16)) return 16
    if (archiveSlots.some((s) => s.thicknessCm === 20)) return 20
    return 16
  }, [selectedArchiveDorsoCm, product, archivePreview, archiveSlots])

  const starboxColorsQuery = useQuery({
    queryKey: ['office-starbox-colors', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchStarboxColorVariants(product!),
    enabled: Boolean(product && isStarboxRaccoglitore),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const oxfordVariantsQuery = useQuery({
    queryKey: ['office-oxford-g85-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchOxfordG85Variants(product!),
    enabled: Boolean(product && isOxfordG85),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const euroboxVariantsQuery = useQuery({
    queryKey: ['office-eurobox-esselte-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchEuroboxEsselteVariants(product!),
    enabled: Boolean(product && isEuroboxEsselte),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const bigSeiRotaVariantsQuery = useQuery({
    queryKey: ['office-big-sei-rota-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchBigSeiRotaVariants(product!),
    enabled: Boolean(product && isBigSeiRota),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const softSeiRotaVariantsQuery = useQuery({
    queryKey: ['office-soft-sei-rota-variants', OFFICE_CATALOG_DATA_REVISION, product?.id],
    queryFn: () => fetchSoftSeiRotaVariants(product!),
    enabled: Boolean(product && isSoftSeiRota),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const softSeiRotaSlots = softSeiRotaVariantsQuery.data ?? []
  const currentSoftSeiRotaFormat = useMemo(() => {
    const fromSlot =
      softSeiRotaSlots.find((s) => String(s.product.id) === String(product?.id))?.formatLabel ?? ''
    if (fromSlot) return fromSlot
    const fromName = detectSoftSeiRotaFormatLabel(product?.name ?? '')
    if (fromName && (SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).includes(fromName))
      return fromName
    return SOFT_SEI_ROTA_FORMAT_LABELS[0]
  }, [softSeiRotaSlots, product?.id, product?.name])
  const effectiveSoftSeiRotaFormat = useMemo(() => {
    if (
      selectedSoftSeiRotaFormat &&
      (SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).includes(selectedSoftSeiRotaFormat)
    ) {
      return selectedSoftSeiRotaFormat
    }
    return currentSoftSeiRotaFormat
  }, [selectedSoftSeiRotaFormat, currentSoftSeiRotaFormat])
  const effectiveSoftSeiRotaSlot = useMemo(() => {
    return softSeiRotaSlots.find((s) => s.formatLabel === effectiveSoftSeiRotaFormat) ?? null
  }, [softSeiRotaSlots, effectiveSoftSeiRotaFormat])
  const effectiveSoftSeiRotaProduct =
    selectedSoftSeiRotaProduct ?? effectiveSoftSeiRotaSlot?.product ?? null
  const effectiveSoftSeiRotaPack = useMemo(() => {
    const fromSlotName = detectSoftSeiRotaPackLabel(effectiveSoftSeiRotaProduct?.name ?? '')
    if (fromSlotName) return fromSlotName
    return detectSoftSeiRotaPackLabel(product?.name ?? '')
  }, [effectiveSoftSeiRotaProduct?.name, product?.name])

  const blasettiMailpackSlots = blasettiMailpackVariantsQuery.data ?? []
  const currentBlasettiMailpackFormat = useMemo(() => {
    if (!product) return BLASETTI_MAILPACK_FORMAT_LABELS[0]
    const fromSlot =
      blasettiMailpackSlots.find((s) => String(s.product.id) === String(product.id))?.formatLabel ?? ''
    if (fromSlot) return fromSlot
    const fromProduct = detectBlasettiMailpackFormatLabel(product)
    if (fromProduct && (BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(fromProduct))
      return fromProduct
    return BLASETTI_MAILPACK_FORMAT_LABELS[0]
  }, [blasettiMailpackSlots, product?.id, product?.name, product?.format])
  const effectiveBlasettiMailpackFormat = useMemo(() => {
    if (
      selectedBlasettiMailpackFormat &&
      (BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(selectedBlasettiMailpackFormat)
    ) {
      return selectedBlasettiMailpackFormat
    }
    return currentBlasettiMailpackFormat
  }, [selectedBlasettiMailpackFormat, currentBlasettiMailpackFormat])
  const effectiveBlasettiMailpackSlot = useMemo(() => {
    return (
      blasettiMailpackSlots.find((s) => s.formatLabel === effectiveBlasettiMailpackFormat) ?? null
    )
  }, [blasettiMailpackSlots, effectiveBlasettiMailpackFormat])
  const effectiveBlasettiMailpackProduct = useMemo(() => {
    if (!isBlasettiMailpack || !product) return null
    return selectedBlasettiMailpackProduct ?? effectiveBlasettiMailpackSlot?.product ?? product
  }, [
    isBlasettiMailpack,
    product,
    selectedBlasettiMailpackProduct,
    effectiveBlasettiMailpackSlot?.product,
  ])

  const pentelColorSlots = pentelMarkerColorsQuery.data ?? []
  const currentPentelColor = useMemo(() => {
    const fromSlot =
      pentelColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    return (
      detectStarboxColorLabel(product?.name ?? '') ??
      detectStarboxColorLabel(product?.colorName ?? '') ??
      ''
    )
  }, [pentelColorSlots, product?.id, product?.name, product?.colorName])
  const effectivePentelColor = useMemo(() => {
    const s = (selectedPentelColor ?? '').trim()
    if (s) return s
    return currentPentelColor
  }, [selectedPentelColor, currentPentelColor])
  const effectivePentelProduct = useMemo(() => {
    if (!isPentelMarker || !product) return null
    if (selectedPentelProduct) return selectedPentelProduct
    const fromId = pentelColorSlots.find((s) => String(s.product.id) === String(product.id))?.product
    if (fromId) return fromId
    return product
  }, [isPentelMarker, product, selectedPentelProduct, pentelColorSlots])

  useEffect(() => {
    if (!product || !isPentelMarker) return
    if (pentelMarkerColorsQuery.isPending || pentelMarkerColorsQuery.isFetching) return
    if ((pentelMarkerColorsQuery.data ?? []).length > 0) return
    console.error('[Pentel variants] Nessuna variante trovata dopo fetch forzato', {
      productId: product.id,
      producerCode: product.producerCode,
      name: product.name,
      brand: product.brand,
      subcategory: product.subcategory,
      colorName: product.colorName,
      familyKey: pentelMarkerFamilyKey(product),
      queryError: pentelMarkerColorsQuery.isError ? pentelMarkerColorsQuery.error : undefined,
    })
  }, [
    product,
    isPentelMarker,
    pentelMarkerColorsQuery.isPending,
    pentelMarkerColorsQuery.isFetching,
    pentelMarkerColorsQuery.data,
    pentelMarkerColorsQuery.isError,
    pentelMarkerColorsQuery.error,
  ])

  useEffect(() => {
    if (!product || !isBlasettiMailpack) return
    if (blasettiMailpackVariantsQuery.isPending || blasettiMailpackVariantsQuery.isFetching) return
    if ((blasettiMailpackVariantsQuery.data ?? []).length > 0) return
    console.error('[Mailpack variants] Nessuna variante formato dopo fetch forzato', {
      productId: product.id,
      producerCode: product.producerCode,
      name: product.name,
      format: product.format,
      lineKey: blasettiMailpackLineKey(product),
      queryError: blasettiMailpackVariantsQuery.isError ? blasettiMailpackVariantsQuery.error : undefined,
    })
  }, [
    product,
    isBlasettiMailpack,
    blasettiMailpackVariantsQuery.isPending,
    blasettiMailpackVariantsQuery.isFetching,
    blasettiMailpackVariantsQuery.data,
    blasettiMailpackVariantsQuery.isError,
    blasettiMailpackVariantsQuery.error,
  ])

  const binderColorSlots = isStarboxRaccoglitore
    ? starboxColorsQuery.data ?? []
    : isOxfordG85
      ? oxfordVariantsQuery.data ?? []
      : isEuroboxEsselte
        ? euroboxVariantsQuery.data ?? []
        : isBigSeiRota
          ? bigSeiRotaVariantsQuery.data ?? []
      : []
  const safeBinderColorSlots = Array.isArray(binderColorSlots) ? binderColorSlots : []
  const showBinderColorIcons =
    (isStarboxRaccoglitore || isOxfordG85 || isEuroboxEsselte || isBigSeiRota) &&
    safeBinderColorSlots.length > 0
  const showBinderColorLoading =
    (isStarboxRaccoglitore && starboxColorsQuery.isPending) ||
    (isOxfordG85 && oxfordVariantsQuery.isPending) ||
    (isEuroboxEsselte && euroboxVariantsQuery.isPending) ||
    (isBigSeiRota && bigSeiRotaVariantsQuery.isPending)
  const currentStarboxColor =
    safeBinderColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color ?? null
  const currentStarboxThickness = detectThicknessCmFromName(product?.name ?? '')
  const effectiveCurrentThickness = currentStarboxThickness ?? selectedStarboxThickness
  const surfaceProduct =
    archivePreview ?? (isPentelMarker ? effectivePentelProduct ?? product : product)
  const effectiveBigSeiColor = useMemo(() => {
    const fromSlot =
      safeBinderColorSlots.find((s) => String(s.product.id) === String(product?.id))?.color?.trim() ?? ''
    if (fromSlot) return fromSlot
    const inferred = detectStarboxColorLabel(product?.name ?? '')
    if (inferred && (BIG_SEI_ROTA_COLOR_LABELS as readonly string[]).includes(inferred)) return inferred
    return 'Blu'
  }, [safeBinderColorSlots, product?.id, product?.name])
  const displayProductName = useMemo(() => {
    if (!product) return ''
    const p = archivePreview ?? product
    if (isSoftSeiRota) {
      const fromSelected = cleanSoftSeiRotaVariantName(effectiveSoftSeiRotaProduct?.name ?? '')
      if (fromSelected) return fromSelected
      const fmt = prettifySoftSeiRotaFormatLabel(effectiveSoftSeiRotaFormat)
      return `Buste a sacco Soft - ${fmt}${effectiveSoftSeiRotaPack ? ` - ${effectiveSoftSeiRotaPack}` : ''}`
    }
    if (isPentelMarker) {
      const base = pentelMarkerBaseTitleFromName(effectivePentelProduct?.name ?? product.name)
      const col =
        (effectivePentelColor ?? '').trim() ||
        detectStarboxColorLabel(effectivePentelProduct?.name ?? product.name) ||
        ''
      return col ? `${base} - ${col}` : (effectivePentelProduct?.name ?? product.name).trim()
    }
    if (isBlasettiMailpack) {
      return `Busta a sacco Mailpack - ${blasettiMailpackFormatDisplayCm(effectiveBlasettiMailpackFormat)}`
    }
    if (isStarlineCartellina) {
      const model =
        selectedCartellinaModel ??
        detectStarlineCartellinaModelKind(
          (selectedCartellinaProduct ?? product).name,
          (selectedCartellinaProduct ?? product).brand,
        )
      const colorRaw =
        (selectedCartellinaColor && selectedCartellinaColor.trim()) ||
        canonicalCartellinaColorForProduct(
          (selectedCartellinaProduct ?? product).name,
          (selectedCartellinaProduct ?? product).colorName,
        ) ||
        ''
      const brand = ((selectedCartellinaProduct ?? product).brand ?? '').trim() || 'Starline'
      if (model && colorRaw && isOfficialCartellinaGridColor(colorRaw)) {
        const modelPart = model === '3lembi' ? 'Cartellina 3 lembi' : 'Cartellina Semplice'
        return `${modelPart} - ${colorRaw.trim().toLowerCase()} - ${brand}`
      }
      return ((selectedCartellinaProduct ?? product).name ?? '').trim()
    }
    if (isDeskStaplerPinza) {
      return (selectedDeskStaplerProduct?.name ?? product.name).trim()
    }
    if (isEuroCartLacci) {
      const cm =
        effectiveEuroCartLacciDorsoCm ??
        detectEuroCartLacciDorsoCm(selectedEuroCartLacciProduct?.name ?? product.name) ??
        EUROCART_LACCI_DORSI_CM[0]
      return `Cartella archivio con lacci - dorso ${cm} cm - grigio - Euro-cart`
    }
    if (isBigSeiRota) {
      const thicknessCm =
        selectedStarboxThickness ?? currentStarboxThickness ?? BIG_SEI_ROTA_DORSO_CM[0] ?? 12
      return `Scatola Progetto Big Sei Rota - ${thicknessCm} cm - ${effectiveBigSeiColor}`
    }
    if (isStarlineArchiveBox) {
      const cm = detectThicknessCmFromName(p.name)
      const color =
        archiveSlots.find((s) => String(s.product.id) === String(p.id))?.color?.trim() ?? ''
      const base = p.name
        .replace(/\s*[-–—]\s*Dorso\s*\d+\s*cm.*$/i, '')
        .replace(/\s*·\s*(Rosso|Blu|Nero)\s*$/i, '')
        .trim()
      if (cm === 16 || cm === 20) {
        return `${base} — Dorso ${cm} cm${color ? ` · ${color}` : ''}`
      }
      return p.name
    }
    if (isColorCopyA3 || isColorCopyA4) {
      const format = isColorCopyA4 ? 'A4' : 'A3'
      return `Carta Color Copy - ${format} - ${selectedColorCopyA3Option.grammage} gr - bianco - Mondi - conf. ${selectedColorCopyA3Option.packSheets} fogli`
    }
    if (!isOxfordG85) return product.name
    return normalizeOxfordModelNameByThickness(product.name, effectiveCurrentThickness)
  }, [
    product,
    archivePreview,
    isSoftSeiRota,
    effectiveSoftSeiRotaFormat,
    effectiveSoftSeiRotaPack,
    effectiveSoftSeiRotaProduct?.name,
    isPentelMarker,
    effectivePentelProduct?.name,
    effectivePentelColor,
    isBlasettiMailpack,
    effectiveBlasettiMailpackFormat,
    isStarlineCartellina,
    selectedCartellinaProduct?.name,
    selectedCartellinaProduct?.brand,
    selectedCartellinaProduct?.colorName,
    selectedCartellinaModel,
    selectedCartellinaColor,
    isDeskStaplerPinza,
    selectedDeskStaplerProduct?.name,
    isEuroCartLacci,
    selectedEuroCartLacciProduct?.name,
    isBigSeiRota,
    isStarlineArchiveBox,
    isColorCopyA3,
    isColorCopyA4,
    isOxfordG85,
    selectedColorCopyA3Option.grammage,
    selectedColorCopyA3Option.packSheets,
    effectiveCurrentThickness,
    archiveSlots,
    selectedStarboxThickness,
    currentStarboxThickness,
    effectiveBigSeiColor,
  ])
  const isBinderColorAllowedAtThickness = (
    color: string,
    thickness: number | null,
  ): boolean => {
    if (thickness !== 5) return true
    if (isOxfordG85) return OXFORD_5CM_ALLOWED_COLORS.has(color)
    if (isStarboxRaccoglitore) return !STARBOX_FORBIDDEN_5CM_COLORS.has(color)
    return true
  }
  const availableStarboxThicknesses = useMemo(() => {
    const values = [...new Set(safeBinderColorSlots.map((s) => s.thicknessCm).filter((v) => v != null))]
    return values.sort((a, b) => Number(a) - Number(b)) as number[]
  }, [safeBinderColorSlots])
  const starboxThicknessTargets = useMemo(() => {
    const map = new Map<number, (typeof safeBinderColorSlots)[number]>()
    for (const thickness of availableStarboxThicknesses) {
      const thicknessSlots = safeBinderColorSlots.filter((s) => {
        if (s.thicknessCm !== thickness) return false
        if (!isBinderColorAllowedAtThickness(s.color, thickness)) return false
        return true
      })
      if (thicknessSlots.length === 0) continue
      const withSameColor = safeBinderColorSlots.find(
        (s) =>
          s.thicknessCm === thickness &&
          currentStarboxColor &&
          s.color === currentStarboxColor &&
          isBinderColorAllowedAtThickness(s.color, thickness),
      )
      const fallbackPreferred =
        thickness === 5 && isOxfordG85
          ? thicknessSlots.find((s) => s.color === 'Blu')
          : thicknessSlots.find((s) => s.color === 'Nero')
      const fallback = thicknessSlots[0]
      const pick = withSameColor ?? fallbackPreferred ?? fallback
      if (pick) map.set(thickness, pick)
    }
    return map
  }, [
    availableStarboxThicknesses,
    safeBinderColorSlots,
    currentStarboxColor,
    isOxfordG85,
    isStarboxRaccoglitore,
    isEuroboxEsselte,
    isBigSeiRota,
  ])
  const displayedStarboxColorSlots = useMemo(() => {
    const source =
      selectedStarboxThickness == null
        ? safeBinderColorSlots
        : safeBinderColorSlots.filter((s) => s.thicknessCm === selectedStarboxThickness)
    const filtered = source.filter((s) => {
      return isBinderColorAllowedAtThickness(s.color, selectedStarboxThickness)
    })
    return filtered.length > 0 ? filtered : source
  }, [selectedStarboxThickness, safeBinderColorSlots, isOxfordG85, isStarboxRaccoglitore])
  const suppressFamilyJsonVariants =
    showPunchedEnvelopeIcons ||
    showPunchedEnvelopeLoading ||
    showBinderColorIcons ||
    showBinderColorLoading ||
    isSoftSeiRota ||
    isBlasettiMailpack ||
    isPentelMarker ||
    isStarlineCartellina ||
    isDeskStaplerPinza ||
    isEuroCartLacci ||
    isPilotHiTecpoint ||
    isStaedtlerNoris ||
    isFermagliZincati ||
    isImballoProTape ||
    isStabiloOhpen ||
    isStarlineArchiveBox ||
    showArchiveBoxLoading ||
    isStaticSynthetic

  useEffect(() => {
    setQuantity(1)
    setImgOk(true)
    setJustAdded(false)
    setSelectedJsonVariant(null)
    setSelectedStarboxThickness(null)
    setSelectedSoftSeiRotaFormat(null)
    setSelectedSoftSeiRotaProduct(null)
    setSelectedCartellinaProduct(null)
    setSelectedCartellinaModel(null)
    setSelectedCartellinaColor(null)
    setSelectedDeskStaplerProduct(null)
    setSelectedDeskStaplerModel(null)
    setSelectedDeskStaplerColor(null)
    setSelectedEuroCartLacciProduct(null)
    setSelectedEuroCartLacciDorsoCm(null)
    setSelectedBlasettiMailpackFormat(null)
    setSelectedBlasettiMailpackProduct(null)
    setSelectedPentelColor(null)
    setSelectedPentelProduct(null)
    setSelectedColorCopyA3Grammage('100g')
    setArchivePreview(null)
    setSelectedArchiveDorsoCm(null)
    setSyntheticGalleryIdx(0)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [productKey])

  useEffect(() => {
    if (!(isColorCopyA3 || isColorCopyA4) || !product?.name) return
    const g = product.name.match(/(\d{2,3})\s*gr/i)?.[1]
    const key = g ? `${Number(g)}g` : ''
    const found = colorCopyGrammageOptions.find((opt) => opt.key === key)
    setSelectedColorCopyA3Grammage(found?.key ?? '100g')
  }, [isColorCopyA3, isColorCopyA4, product?.name, colorCopyGrammageOptions])

  useEffect(() => {
    if (!isStarlineArchiveBox || !product) return
    const cm = detectThicknessCmFromName(product.name)
    if (cm === 16 || cm === 20) setSelectedArchiveDorsoCm(cm)
  }, [isStarlineArchiveBox, product?.id, product?.name])

  useEffect(() => {
    if (!showBinderColorIcons) return
    if (isBigSeiRota) {
      if (selectedStarboxThickness == null) {
        setSelectedStarboxThickness(currentStarboxThickness ?? availableStarboxThicknesses[0] ?? 12)
      }
      return
    }
    if (
      currentStarboxThickness != null &&
      availableStarboxThicknesses.includes(currentStarboxThickness) &&
      selectedStarboxThickness !== currentStarboxThickness
    ) {
      setSelectedStarboxThickness(currentStarboxThickness)
      return
    }
    if (selectedStarboxThickness == null && availableStarboxThicknesses.length > 0) {
      setSelectedStarboxThickness(availableStarboxThicknesses[0])
    }
  }, [
    showBinderColorIcons,
    isBigSeiRota,
    currentStarboxThickness,
    availableStarboxThicknesses,
    selectedStarboxThickness,
  ])

  useEffect(() => {
    if (!isSoftSeiRota) return
    if (
      selectedSoftSeiRotaFormat &&
      (SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).includes(selectedSoftSeiRotaFormat)
    ) {
      return
    }
    setSelectedSoftSeiRotaFormat(currentSoftSeiRotaFormat)
  }, [isSoftSeiRota, selectedSoftSeiRotaFormat, currentSoftSeiRotaFormat])

  useEffect(() => {
    if (!isSoftSeiRota) return
    if (!selectedSoftSeiRotaFormat) return
    const local = softSeiRotaSlots.find((s) => s.formatLabel === selectedSoftSeiRotaFormat)?.product ?? null
    if (local) setSelectedSoftSeiRotaProduct(local)
  }, [isSoftSeiRota, selectedSoftSeiRotaFormat, softSeiRotaSlots])

  useEffect(() => {
    if (!isBlasettiMailpack) return
    if (
      selectedBlasettiMailpackFormat &&
      (BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(selectedBlasettiMailpackFormat)
    ) {
      return
    }
    setSelectedBlasettiMailpackFormat(currentBlasettiMailpackFormat)
  }, [isBlasettiMailpack, selectedBlasettiMailpackFormat, currentBlasettiMailpackFormat])

  useEffect(() => {
    if (!isBlasettiMailpack) return
    if (!selectedBlasettiMailpackFormat) return
    const local =
      blasettiMailpackSlots.find((s) => s.formatLabel === selectedBlasettiMailpackFormat)?.product ??
      null
    if (local) setSelectedBlasettiMailpackProduct(local)
  }, [isBlasettiMailpack, selectedBlasettiMailpackFormat, blasettiMailpackSlots])

  useEffect(() => {
    if (!isBlasettiMailpack) return
    setImgOk(true)
  }, [isBlasettiMailpack, effectiveBlasettiMailpackProduct?.id, effectiveBlasettiMailpackProduct?.imageUrl])

  useEffect(() => {
    if (!isPentelMarker) return
    setImgOk(true)
  }, [isPentelMarker, effectivePentelProduct?.id, effectivePentelProduct?.imageUrl])

  useEffect(() => {
    if (!isStaticSynthetic) return
    setImgOk(true)
  }, [isStaticSynthetic, syntheticGalleryIdx])

  useEffect(() => {
    if (!isPentelMarker) return
    if ((selectedPentelColor ?? '').trim()) return
    if (currentPentelColor) setSelectedPentelColor(currentPentelColor)
  }, [isPentelMarker, selectedPentelColor, currentPentelColor])

  useEffect(() => {
    if (!isPentelMarker) return
    if (!selectedPentelColor?.trim()) return
    const local =
      pentelColorSlots.find(
        (s) => s.color.trim().toLowerCase() === selectedPentelColor.trim().toLowerCase(),
      )?.product ?? null
    if (local) setSelectedPentelProduct(local)
  }, [isPentelMarker, selectedPentelColor, pentelColorSlots])

  useEffect(() => {
    const list = product?.variants
    if (list && list.length > 0) {
      setSelectedJsonVariant(list[0])
    } else {
      setSelectedJsonVariant(null)
    }
  }, [product?.id, product?.variants])

  useEffect(() => {
    setImgOk(true)
  }, [selectedJsonVariant?.label, selectedJsonVariant?.image_url])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    if (isStaticSyntheticOfficeProduct(product)) {
      if (isDistruggidocumentiOfficeProductId(product.id)) {
        return buildDistruggidocumentiOfficeProducts()
          .filter((p) => p.id !== product.id)
          .slice(0, 12)
      }
      if (isCartucceTonerOfficeProductId(product.id)) {
        return buildCartucceTonerOfficeProducts()
          .filter((p) => p.id !== product.id)
          .slice(0, 12)
      }
      if (isEtichettatriciOfficeProductId(product.id)) {
        return buildEtichettatriciOfficeProducts().filter((p) => p.id !== product.id)
      }
      if (isCasseDitronOfficeProductId(product.id)) {
        return buildCasseDitronOfficeProducts().filter((p) => p.id !== product.id)
      }
      if (matchesShopperCartaProduct(product) || matchesShopperPlasticaProduct(product)) {
        const siblings = [
          ...buildShopperCartaOfficeProducts(),
          ...buildShopperPlasticaOfficeProducts(),
        ]
        return siblings.filter((p) => p.id !== product.id).slice(0, 4)
      }
      if (isPileOfficeProductId(product.id)) {
        return buildPileOfficeProducts()
          .filter((p) => p.id !== product.id)
          .slice(0, 12)
      }
      if (isQuaderniOfficeProductId(product.id)) {
        return buildQuaderniOfficeProducts()
          .filter((p) => p.id !== product.id)
          .slice(0, 12)
      }
      if (isIHealthOfficeProductId(product.id)) {
        const byId = new Map(buildIHealthAstroMedicalOfficeProducts().map((p) => [p.id, p]))
        return iHealthAstroMedicalRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isProfessionalDiagnosticOfficeProductId(product.id)) {
        const byId = new Map(
          buildProfessionalDiagnosticAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return professionalDiagnosticRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isSurgicalInstrumentsOfficeProductId(product.id)) {
        const byId = new Map(
          buildSurgicalInstrumentsAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return surgicalInstrumentsRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isIvCannulaAstroMedicalOfficeProductId(product.id)) {
        const byId = new Map(
          buildIvCannulaAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return ivCannulaRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isEthiconSuturesAstroMedicalOfficeProductId(product.id)) {
        const byId = new Map(
          buildEthiconSuturesAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return ethiconSuturesRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isLaboratoryBagsAstroMedicalOfficeProductId(product.id)) {
        const byId = new Map(
          buildLaboratoryBagsAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return laboratoryBagsRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isWellnessBagsScalesAstroMedicalOfficeProductId(product.id)) {
        const byId = new Map(
          buildWellnessBagsScalesAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return wellnessBagsScalesRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isProfessionalInstrumentationAstroMedicalOfficeProductId(product.id)) {
        const byId = new Map(
          buildProfessionalInstrumentationAstroMedicalOfficeProducts().map((p) => [p.id, p]),
        )
        return professionalInstrumentationRelatedIdsForProductId(product.id)
          .map((rid) => byId.get(rid))
          .filter((p): p is OfficeProduct => Boolean(p))
      }
      if (isLegacyAstroMedicalOfficeProductId(product.id)) {
        return buildLineaAstroMedicalAllOfficeProducts()
          .filter((p) => p.id !== product.id)
          .slice(0, 12)
      }
      return []
    }
    return relatedQuery.data ?? []
  }, [product, relatedQuery.data])

  const jsonVariants = product?.variants ?? []
  const hasJsonVariants = jsonVariants.length > 0

  const familyMembers = useMemo(() => {
    if (!product?.parentSku?.trim()) return []
    const rows = familyQuery.data ?? []
    if (rows.length > 0) {
      const byId = new Map(rows.map((r) => [String(r.id), r]))
      const pid = String(product.id)
      if (!byId.has(pid)) byId.set(pid, product)
      return [...byId.values()].sort((a, b) =>
        (a.colorName || a.name).localeCompare(b.colorName || b.name, 'it'),
      )
    }
    return [product]
  }, [familyQuery.data, product])
  const scopedFamilyMembers = useMemo(() => {
    if (!product || familyMembers.length === 0) return familyMembers
    if (isStarlineCartellina) {
      const fromQuery = starlineCartellinaQuery.data ?? []
      if (fromQuery.length > 0) return fromQuery
      return familyMembers
    }
    const currentKind = detectStarlineCartellinaModelKind(product.name, product.brand)
    if (!currentKind) return familyMembers
    const sameKind = familyMembers.filter(
      (m) => detectStarlineCartellinaModelKind(m.name, m.brand) === currentKind,
    )
    return sameKind.length > 0 ? sameKind : familyMembers
  }, [familyMembers, product?.id, product?.name, isStarlineCartellina, starlineCartellinaQuery.data])

  const cartellinaVariantSlots = useMemo(() => {
    if (!isStarlineCartellina || !product) return []
    const all = [...scopedFamilyMembers]
    if (!all.some((m) => String(m.id) === String(product.id))) all.push(product)
    const raw = all
      .map((m) => {
        const model = detectStarlineCartellinaModelKind(m.name, m.brand)
        if (!model) return null
        const color = canonicalCartellinaColorForProduct(m.name, m.colorName)
        if (!color) return null
        return { model, color, product: m }
      })
      .filter((v): v is { model: 'semplice' | '3lembi'; color: string; product: OfficeProduct } => v != null)
    const byKey = new Map<string, (typeof raw)[number]>()
    for (const slot of raw) {
      const key = `${slot.model}|${slot.color.trim().toLowerCase()}`
      if (!byKey.has(key)) byKey.set(key, slot)
    }
    return [...byKey.values()]
  }, [isStarlineCartellina, product, scopedFamilyMembers])

  const effectiveCartellinaProduct = isStarlineCartellina
    ? selectedCartellinaProduct ?? product
    : null

  const effectiveCartellinaModel = useMemo(() => {
    if (!isStarlineCartellina) return null
    return (
      selectedCartellinaModel ??
      detectStarlineCartellinaModelKind(
        effectiveCartellinaProduct?.name ?? '',
        effectiveCartellinaProduct?.brand,
      ) ??
      detectStarlineCartellinaModelKind(product?.name ?? '', product?.brand) ??
      null
    )
  }, [
    isStarlineCartellina,
    selectedCartellinaModel,
    effectiveCartellinaProduct?.name,
    product?.name,
  ])

  const effectiveCartellinaColor = useMemo(() => {
    if (!isStarlineCartellina) return ''
    const fromState = selectedCartellinaColor?.trim()
    if (fromState && isOfficialCartellinaGridColor(fromState)) return fromState
    const fromProduct = canonicalCartellinaColorForProduct(
      effectiveCartellinaProduct?.name ?? '',
      effectiveCartellinaProduct?.colorName,
    )
    if (fromProduct) return fromProduct
    const slot = cartellinaVariantSlots.find((s) => s.model === effectiveCartellinaModel)
    return slot?.color ?? STARLINE_CARTELLINA_OFFICIAL_COLORS[0]
  }, [
    isStarlineCartellina,
    selectedCartellinaColor,
    effectiveCartellinaProduct?.name,
    effectiveCartellinaProduct?.colorName,
    effectiveCartellinaModel,
    cartellinaVariantSlots,
  ])

  const cartellinaModelOptions = useMemo(() => {
    const hasSemplice = cartellinaVariantSlots.some((s) => s.model === 'semplice')
    const hasTreLembi = cartellinaVariantSlots.some((s) => s.model === '3lembi')
    return [
      ...(hasSemplice ? (['semplice'] as const) : []),
      ...(hasTreLembi ? (['3lembi'] as const) : []),
    ]
  }, [cartellinaVariantSlots])

  const cartellinaColorOptions = useMemo(() => {
    if (!effectiveCartellinaModel) return []
    return [...STARLINE_CARTELLINA_OFFICIAL_COLORS]
  }, [effectiveCartellinaModel])

  const deskStaplerVariantSlots = useMemo(() => {
    if (!isDeskStaplerPinza || !product) return []
    const pool = deskStaplerVariantsQuery.data ?? [product]
    const out = pool
      .filter((p) => String(p.brand ?? '').trim().toLowerCase() === String(product.brand ?? '').trim().toLowerCase())
      .map((p) => {
        const model = detectDeskStaplerModel(p.name)
        const color = detectDeskStaplerColor(p.name, p.colorName)
        return { model, color, product: p }
      })
    const byKey = new Map<string, (typeof out)[number]>()
    for (const s of out) {
      const key = `${s.model}|${s.color.trim().toLowerCase()}`
      if (!byKey.has(key)) byKey.set(key, s)
    }
    return [...byKey.values()]
  }, [isDeskStaplerPinza, product, deskStaplerVariantsQuery.data])

  const effectiveDeskStaplerProduct = isDeskStaplerPinza
    ? selectedDeskStaplerProduct ?? product
    : null

  const effectiveDeskStaplerModel = useMemo(() => {
    if (!isDeskStaplerPinza) return null
    return (
      selectedDeskStaplerModel ??
      detectDeskStaplerModel(effectiveDeskStaplerProduct?.name ?? product?.name ?? '')
    )
  }, [isDeskStaplerPinza, selectedDeskStaplerModel, effectiveDeskStaplerProduct?.name, product?.name])

  const effectiveDeskStaplerColor = useMemo(() => {
    if (!isDeskStaplerPinza) return ''
    return (
      selectedDeskStaplerColor ??
      detectDeskStaplerColor(effectiveDeskStaplerProduct?.name ?? '', effectiveDeskStaplerProduct?.colorName)
    )
  }, [
    isDeskStaplerPinza,
    selectedDeskStaplerColor,
    effectiveDeskStaplerProduct?.name,
    effectiveDeskStaplerProduct?.colorName,
  ])

  const deskStaplerModelOptions = useMemo(() => {
    const found = new Set<DeskStaplerModel>()
    for (const s of deskStaplerVariantSlots) found.add(s.model)
    return [...found]
  }, [deskStaplerVariantSlots])

  const deskStaplerColorOptions = useMemo(() => {
    if (!effectiveDeskStaplerModel) return []
    const labels = deskStaplerVariantSlots
      .filter((s) => s.model === effectiveDeskStaplerModel)
      .map((s) => s.color.trim())
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b, 'it'))
  }, [deskStaplerVariantSlots, effectiveDeskStaplerModel])

  const euroCartLacciVariantSlots = useMemo(() => {
    if (!isEuroCartLacci || !product) return []
    const pool = euroCartLacciVariantsQuery.data ?? [product]
    const out = pool
      .filter((p) => String(p.brand ?? '').trim().toLowerCase() === String(product.brand ?? '').trim().toLowerCase())
      .map((p) => {
        const dorsoCm = detectEuroCartLacciDorsoCm(p.name)
        if (dorsoCm == null) return null
        return { dorsoCm, product: p }
      })
      .filter((v): v is { dorsoCm: number; product: OfficeProduct } => v != null)
    const byDorso = new Map<number, { dorsoCm: number; product: OfficeProduct }>()
    for (const slot of out) {
      if (!byDorso.has(slot.dorsoCm)) byDorso.set(slot.dorsoCm, slot)
    }
    return [...byDorso.values()].sort((a, b) => a.dorsoCm - b.dorsoCm)
  }, [isEuroCartLacci, product, euroCartLacciVariantsQuery.data])

  useEffect(() => {
    if (!isStarlineCartellina || !product) return
    const inferredModel = detectStarlineCartellinaModelKind(product.name, product.brand)
    if (!selectedCartellinaModel && inferredModel) setSelectedCartellinaModel(inferredModel)
    const o = canonicalCartellinaColorForProduct(product.name, product.colorName)
    if (!isOfficialCartellinaGridColor(selectedCartellinaColor)) {
      const model = selectedCartellinaModel ?? inferredModel
      const first =
        (model ? cartellinaVariantSlots.find((s) => s.model === model)?.color : null) ?? null
      setSelectedCartellinaColor(o ?? first ?? STARLINE_CARTELLINA_OFFICIAL_COLORS[0])
    }
  }, [
    isStarlineCartellina,
    product?.id,
    product?.name,
    product?.colorName,
    selectedCartellinaModel,
    selectedCartellinaColor,
    cartellinaVariantSlots,
  ])

  useEffect(() => {
    if (!isDeskStaplerPinza || !product) return
    if (!selectedDeskStaplerModel) {
      setSelectedDeskStaplerModel(detectDeskStaplerModel(product.name))
    }
    if (!selectedDeskStaplerColor) {
      setSelectedDeskStaplerColor(detectDeskStaplerColor(product.name, product.colorName))
    }
    if (!selectedDeskStaplerProduct) {
      setSelectedDeskStaplerProduct(product)
    }
  }, [
    isDeskStaplerPinza,
    product?.id,
    product?.name,
    product?.colorName,
    selectedDeskStaplerModel,
    selectedDeskStaplerColor,
    selectedDeskStaplerProduct,
  ])

  useEffect(() => {
    if (!isEuroCartLacci || !product) return
    if (!selectedEuroCartLacciProduct) setSelectedEuroCartLacciProduct(product)
    if (!selectedEuroCartLacciDorsoCm) {
      const fromName = detectEuroCartLacciDorsoCm(product.name)
      const first = euroCartLacciVariantSlots[0]?.dorsoCm ?? null
      setSelectedEuroCartLacciDorsoCm(fromName ?? first)
    }
  }, [
    isEuroCartLacci,
    product?.id,
    product?.name,
    selectedEuroCartLacciProduct,
    selectedEuroCartLacciDorsoCm,
    euroCartLacciVariantSlots,
  ])

  const displayProductDescription = useMemo(() => {
    if (!product) return ''
    if (isStarlineCartellina) {
      return (effectiveCartellinaProduct?.description ?? product.description ?? '').trim()
    }
    if (isDeskStaplerPinza) {
      return (effectiveDeskStaplerProduct?.description ?? product.description ?? '').trim()
    }
    if (isPentelMarker) {
      return (effectivePentelProduct?.description ?? product.description ?? '').trim()
    }
    if (isBlasettiMailpack) {
      return (effectiveBlasettiMailpackProduct?.description ?? product.description ?? '').trim()
    }
    if (isEuroCartLacci) {
      const raw = (effectiveEuroCartLacciProduct?.description ?? product.description ?? '').trim()
      const cm =
        effectiveEuroCartLacciDorsoCm ??
        detectEuroCartLacciDorsoCm(effectiveEuroCartLacciProduct?.name ?? product.name) ??
        null
      if (!cm) return raw
      if (!raw) return `Cartella archivio con lacci Euro-cart, dorso ${cm} cm.`
      const normalized = raw.replace(/dorso\s*\d{1,2}(?:\s*cm)?/gi, `dorso ${cm} cm`)
      return normalized
    }
    return (product.description ?? '').trim()
  }, [
    product,
    isStarlineCartellina,
    effectiveCartellinaProduct?.description,
    isDeskStaplerPinza,
    effectiveDeskStaplerProduct?.description,
    isEuroCartLacci,
    effectiveEuroCartLacciProduct?.description,
    effectiveEuroCartLacciDorsoCm,
    effectiveEuroCartLacciProduct?.name,
    isPentelMarker,
    effectivePentelProduct?.description,
    isBlasettiMailpack,
    effectiveBlasettiMailpackProduct?.description,
  ])

  /** Listino quantità: righe proprie o, in famiglia, stesso schema del primo SKU che ha tier in DB. */
  const effectiveQuantityTiers = useMemo(() => {
    if (isImpulse75A4) {
      return IMPULSE_75_A4_QUANTITY_TIERS.map((t) => ({ ...t }))
    }
    if (isStarboxRaccoglitore) {
      return STARBOX_QUANTITY_TIERS.map((t) => ({ ...t }))
    }
    if (isBusteForate && punchedEnvelopeThickness === 'pesante') {
      return PUNCHED_ENVELOPE_TOP_TIERS.map((t) => ({ ...t }))
    }
    if (isBusteForate && punchedEnvelopeThickness === 'medio') {
      return PUNCHED_ENVELOPE_MEDIUM_TIERS.map((t) => ({ ...t }))
    }
    if (isEuroCartLacci) {
      return EUROCART_LACCI_QUANTITY_TIERS.map((t) => ({ ...t }))
    }
    if (isPentelMarker) return []
    if (isBlasettiMailpack) {
      // Rev 192: listino unitario fisso per formato — niente tier da altre righe SKU.
      return []
    }
    const own = product?.quantityPriceTiers
    if (own && own.length > 0) return own.map((t) => ({ ...t }))
    if (isStarlineCartellina) {
      const fromSelected = effectiveCartellinaProduct?.quantityPriceTiers
      if (fromSelected && fromSelected.length > 0) return fromSelected.map((t) => ({ ...t }))
      const donorCart = starlineCartellinaQuery.data?.find(
        (m) => (m.quantityPriceTiers?.length ?? 0) > 0,
      )
      const tiersCart = donorCart?.quantityPriceTiers
      if (tiersCart?.length) return tiersCart.map((t) => ({ ...t }))
    }
    const donor = familyQuery.data?.find((m) => (m.quantityPriceTiers?.length ?? 0) > 0)
    const fromFamily = donor?.quantityPriceTiers
    return fromFamily?.length ? fromFamily.map((t) => ({ ...t })) : undefined
  }, [
    isImpulse75A4,
    isBigSeiRota,
    isStarboxRaccoglitore,
    isBusteForate,
    punchedEnvelopeThickness,
    isEuroCartLacci,
    isPentelMarker,
    isBlasettiMailpack,
    product?.quantityPriceTiers,
    isStarlineCartellina,
    effectiveCartellinaProduct?.quantityPriceTiers,
    starlineCartellinaQuery.data,
    familyQuery.data,
  ])

  const effectiveBasePrice = useMemo(() => {
    if (isImpulse75A4) return IMPULSE_75_A4_BASE_PRICE
    if (isStarboxRaccoglitore) return STARBOX_BASE_PRICE
    if (isBusteForate && punchedEnvelopeThickness === 'pesante') return PUNCHED_ENVELOPE_TOP_BASE_PRICE
    if (isBusteForate && punchedEnvelopeThickness === 'medio') return PUNCHED_ENVELOPE_MEDIUM_BASE_PRICE
    if (isPentelMarker) return 1.8
    if (isBlasettiMailpack) {
      const fixed = blasettiMailpackFixedPriceForFormat(effectiveBlasettiMailpackFormat)
      if (fixed != null) return fixed
      return effectiveBlasettiMailpackProduct?.price ?? product?.price
    }
    if (isSoftSeiRota) {
      return softSeiRotaPriceForFormat(effectiveSoftSeiRotaFormat) ?? product?.price
    }
    if (isStarlineCartellina) return effectiveCartellinaProduct?.price ?? product?.price
    if (isDeskStaplerPinza) return effectiveDeskStaplerProduct?.price ?? product?.price
    if (isEuroCartLacci) return EUROCART_LACCI_BASE_PRICE
    if (isBigSeiRota) {
      const cm =
        selectedStarboxThickness ??
        detectThicknessCmFromName(product?.name ?? '') ??
        BIG_SEI_ROTA_DORSO_CM[0] ??
        null
      return bigSeiRotaPriceForThicknessCm(cm) ?? product?.price
    }
    if (isColorCopyA3 || isColorCopyA4) return selectedColorCopyA3Option.price
    if (
      isShopperSizeVariant &&
      selectedJsonVariant &&
      typeof selectedJsonVariant.price === 'number'
    ) {
      return selectedJsonVariant.price
    }
    return product?.price
  }, [
    isImpulse75A4,
    isStarboxRaccoglitore,
    isBusteForate,
    punchedEnvelopeThickness,
    isPentelMarker,
    isBlasettiMailpack,
    effectiveBlasettiMailpackFormat,
    effectiveBlasettiMailpackProduct?.price,
    isSoftSeiRota,
    effectiveSoftSeiRotaFormat,
    isStarlineCartellina,
    effectiveCartellinaProduct?.price,
    isDeskStaplerPinza,
    effectiveDeskStaplerProduct?.price,
    isEuroCartLacci,
    effectiveEuroCartLacciProduct?.price,
    isBigSeiRota,
    isColorCopyA3,
    isColorCopyA4,
    selectedColorCopyA3Option.price,
    selectedStarboxThickness,
    isShopperSizeVariant,
    selectedJsonVariant,
    product?.name,
    product?.price,
  ])

  const showParentSkuFamily =
    Boolean(product?.parentSku?.trim()) &&
    scopedFamilyMembers.length > 0 &&
    !suppressFamilyJsonVariants
  // Rev 165: Cartelle archivio con lacci restano sul flusso "famiglia parent_sku",
  // già pronto per miniature varianti (colore/dorso) appena i nuovi SKU verranno aggiunti.
  const showJsonVariants =
    hasJsonVariants && !product?.parentSku?.trim() && !suppressFamilyJsonVariants

  const representativeId = useMemo(() => {
    const ids = scopedFamilyMembers.map((m) => m.id).filter(Boolean)
    if (ids.length === 0 && product?.id) return product.id
    return [...ids].sort((a, b) => a.localeCompare(b, 'it'))[0] ?? product?.id ?? ''
  }, [scopedFamilyMembers, product?.id])

  const unitForQty = useMemo(
    () => effectiveUnitPrice(effectiveBasePrice, effectiveQuantityTiers, quantity),
    [effectiveBasePrice, effectiveQuantityTiers, quantity],
  )

  const lineTotal = useMemo(
    () => lineImponible(effectiveBasePrice, effectiveQuantityTiers, quantity),
    [effectiveBasePrice, effectiveQuantityTiers, quantity],
  )

  const discountRowsDetailed = useMemo(
    () => quantityDiscountRowsDetailed(effectiveBasePrice ?? 0, effectiveQuantityTiers),
    [effectiveBasePrice, effectiveQuantityTiers],
  )
  const showQuantityDiscountTable =
    ((effectiveQuantityTiers?.length ?? 0) > 1 || isImpulse75A4) &&
    !isPilotHiTecpoint &&
    !isStaedtlerNoris &&
    !isZenithPoints &&
    !isDeskStaplerPinza &&
    !isFermagliZincati &&
    !isImballoProTape

  const quantityDiscountTableNode = showQuantityDiscountTable ? (
    <div className="mt-3.5">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          SCONTI PER QUANTITA
        </h2>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          PREZZI UNITARI + IVA
        </p>
        <div className="mt-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2.5 pr-2 font-semibold">QUANTITA</th>
                <th className="py-2.5 text-right font-semibold">PREZZO UNIT. (IMPON.)</th>
              </tr>
            </thead>
            <tbody>
              {discountRowsDetailed.map((row, rowIdx) => {
                const active = isQuantityInDiscountTier(quantity, row)
                const isBaseRow = rowIdx === 0
                return (
                  <tr
                    key={`tier-${row.minQty}-${row.maxQty ?? 'x'}-${row.unitPrice}-${rowIdx}`}
                    className={
                      active
                        ? 'border-l-4 border-brand-700 bg-brand-50/70 font-medium'
                        : 'border-l-2 border-transparent'
                    }
                  >
                    <td
                      className={`py-2.5 pr-2 ${active ? 'text-slate-900' : 'text-slate-700'}`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={[
                        'py-2.5 text-right tabular-nums',
                        active ? 'text-brand-800' : 'text-brand-900',
                        isBaseRow ? 'text-base font-semibold text-brand-700' : '',
                      ].join(' ')}
                    >
                      {eur.format(row.unitPrice)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null

  const heroImageUrl = useMemo(() => {
    const bust = (u: string) => withOfficeImageCacheBust(u, OFFICE_CATALOG_DATA_REVISION)
    if (product && isStaticSyntheticOfficeProduct(product)) {
      const raw = (
        syntheticGalleryImageUrls[syntheticGalleryIdx] ??
        product.imageUrl ??
        ''
      ).trim()
      if (raw) return bust(raw)
      return ''
    }
    const p = surfaceProduct
    if (!p) return ''
    if (product && isPentelMarker) {
      const fromSlot = (effectivePentelProduct?.imageUrl ?? '').trim()
      if (fromSlot) return bust(fromSlot)
    }
    const useJson =
      (p.variants?.length ?? 0) > 0 && !(p.parentSku && p.parentSku.trim())
    if (useJson && selectedJsonVariant?.image_url?.trim()) {
      return bust(selectedJsonVariant.image_url.trim())
    }
    if (product && isBlasettiMailpack) {
      const fromSlot = (effectiveBlasettiMailpackProduct?.imageUrl ?? '').trim()
      if (fromSlot) return bust(fromSlot)
    }
    if (product && isSoftSeiRota) {
      const fromSlot = (effectiveSoftSeiRotaProduct?.imageUrl ?? '').trim()
      if (fromSlot) return bust(fromSlot)
    }
    if (product && isStarlineCartellina) {
      const fromSelected = (effectiveCartellinaProduct?.imageUrl ?? '').trim()
      if (fromSelected) return bust(fromSelected)
    }
    if (product && isDeskStaplerPinza) {
      const fromSelected = (effectiveDeskStaplerProduct?.imageUrl ?? '').trim()
      if (fromSelected) return bust(fromSelected)
    }
    if (product && isEuroCartLacci) {
      const fromSelected = (effectiveEuroCartLacciProduct?.imageUrl ?? '').trim()
      if (fromSelected) return bust(fromSelected)
    }
    if (product && isBigSeiRota) {
      const mapped = BIG_SEI_ROTA_HD_IMAGE_BY_COLOR[effectiveBigSeiColor]
      if (mapped) return bust(mapped)
    }
    if (product && isStarlineArchiveBox) {
      const cm: 16 | 20 =
        effectiveArchiveDorso === 16 || effectiveArchiveDorso === 20
          ? effectiveArchiveDorso
          : 16
      const col = (effectiveArchiveColor ?? '').trim()
      if ((STARLINE_ARCHIVE_BOX_COLOR_LABELS as readonly string[]).includes(col)) {
        const mapped = starlineArchiveBoxImageForVariant(cm, col)
        if (mapped) return bust(mapped)
      }
    }
    return bust(p.imageUrl)
  }, [
    surfaceProduct,
    syntheticGalleryImageUrls,
    syntheticGalleryIdx,
    selectedJsonVariant,
    product,
    isPentelMarker,
    effectivePentelProduct?.imageUrl,
    isBlasettiMailpack,
    effectiveBlasettiMailpackProduct?.imageUrl,
    isSoftSeiRota,
    effectiveSoftSeiRotaProduct?.imageUrl,
    isStarlineCartellina,
    effectiveCartellinaProduct?.imageUrl,
    isDeskStaplerPinza,
    effectiveDeskStaplerProduct?.imageUrl,
    isEuroCartLacci,
    effectiveEuroCartLacciProduct?.imageUrl,
    isBigSeiRota,
    effectiveBigSeiColor,
    isStarlineArchiveBox,
    effectiveArchiveDorso,
    effectiveArchiveColor,
  ])

  useEffect(() => {
    if (!product) return

    const quoteOnly = isQuoteOnlyOfficeProduct(product)
    const title = quoteOnly
      ? `${displayProductName} — Richiedi preventivo | Astro Forniture`
      : `Acquista ${displayProductName} al miglior prezzo su Astro Forniture`
    const skuForMeta =
      isStarlineCartellina && effectiveCartellinaProduct?.producerCode
        ? effectiveCartellinaProduct.producerCode
        : product.producerCode
    const metaDescription = quoteOnly
      ? `Scopri ${displayProductName} (${skuForMeta}) di ${product.brand} su Astro Forniture. Configurazione e listino su preventivo.`
      : `Scopri ${displayProductName} (${skuForMeta}) di ${product.brand} su Astro Forniture. Prezzo imponibile e acquisto rapido online.`
    const representativeMember =
      scopedFamilyMembers.find((m) => m.id === representativeId) ?? product
    const canonicalSegment = productDetailUrlSegment(representativeMember)
    const canonicalUrl = `${window.location.origin}/product/${encodeURIComponent(canonicalSegment)}`

    document.title = title
    setMetaDescription(metaDescription)
    setCanonical(canonicalUrl)
    setMetaProperty('og:type', 'product')
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', metaDescription)
    setMetaProperty('og:url', canonicalUrl)
    const surf = archivePreview ?? product
    const useJson =
      (surf.variants?.length ?? 0) > 0 && !(surf.parentSku && surf.parentSku.trim())
    const previewImage = isStaticSynthetic
      ? (syntheticGalleryImageUrls[syntheticGalleryIdx] ?? product.imageUrl ?? '').trim()
      : useJson && selectedJsonVariant?.image_url?.trim()
        ? selectedJsonVariant.image_url.trim()
        : isBlasettiMailpack
          ? (effectiveBlasettiMailpackProduct?.imageUrl ?? '').trim() || surf.imageUrl
          : isSoftSeiRota
            ? (effectiveSoftSeiRotaProduct?.imageUrl ?? '').trim() || surf.imageUrl
            : isStarlineCartellina
              ? (effectiveCartellinaProduct?.imageUrl ?? '').trim() || surf.imageUrl
              : isEuroCartLacci
                ? (effectiveEuroCartLacciProduct?.imageUrl ?? '').trim() || surf.imageUrl
                : isDeskStaplerPinza
                  ? (effectiveDeskStaplerProduct?.imageUrl ?? '').trim() || surf.imageUrl
                  : isBigSeiRota
                    ? BIG_SEI_ROTA_HD_IMAGE_BY_COLOR[effectiveBigSeiColor] || surf.imageUrl
                    : surf.imageUrl
    if (previewImage)
      setMetaProperty(
        'og:image',
        withOfficeImageCacheBust(previewImage, OFFICE_CATALOG_DATA_REVISION),
      )
    setMetaName('twitter:card', 'summary_large_image')
    setMetaName('twitter:title', title)
    setMetaName('twitter:description', metaDescription)
    if (previewImage)
      setMetaName(
        'twitter:image',
        withOfficeImageCacheBust(previewImage, OFFICE_CATALOG_DATA_REVISION),
      )

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: displayProductName,
      description:
        displayProductDescription || `${displayProductName} - ${product.brand}`,
      sku: skuForMeta,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      image: previewImage
        ? [withOfficeImageCacheBust(previewImage, OFFICE_CATALOG_DATA_REVISION)]
        : undefined,
      offers: quoteOnly
        ? {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
            description: 'Prezzo su preventivo',
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price:
              typeof effectiveBasePrice === 'number' ? effectiveBasePrice.toFixed(2) : '0.00',
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
          },
    }
    upsertProductJsonLd(jsonLd)

    const categoryLabel = (product.category ?? '').trim() || 'Catalogo Office'
    const subcategoryLabel = (product.subcategory ?? '').trim()
    const categoryHref =
      categoryLabel.toLowerCase() === 'archivio'
        ? `${window.location.origin}/office-products?category=Archivio`
        : `${window.location.origin}/office-products`
    const subcategoryHref =
      categoryLabel.toLowerCase() === 'archivio' && subcategoryLabel
        ? `${window.location.origin}/office-products?category=Archivio&subcategory=${encodeURIComponent(subcategoryLabel)}`
        : ''
    const breadcrumbItems: Array<Record<string, unknown>> = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel.toLowerCase() === 'archivio' ? 'Archivio' : 'Catalogo Office',
        item: categoryHref,
      },
    ]
    if (subcategoryHref) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: subcategoryLabel,
        item: subcategoryHref,
      })
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 4,
        name: displayProductName,
        item: canonicalUrl,
      })
    } else {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: displayProductName,
        item: canonicalUrl,
      })
    }

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    }
    upsertJsonLdById(SEO_BREADCRUMB_JSONLD_ID, breadcrumbLd)
  }, [
    product,
    archivePreview,
    representativeId,
    scopedFamilyMembers,
    selectedJsonVariant,
    isStaticSynthetic,
    syntheticGalleryImageUrls,
    syntheticGalleryIdx,
    isBlasettiMailpack,
    effectiveBlasettiMailpackProduct?.imageUrl,
    isSoftSeiRota,
    effectiveSoftSeiRotaProduct?.imageUrl,
    isStarlineCartellina,
    effectiveCartellinaProduct?.imageUrl,
    isEuroCartLacci,
    effectiveEuroCartLacciProduct?.imageUrl,
    isDeskStaplerPinza,
    effectiveDeskStaplerProduct?.imageUrl,
    effectiveCartellinaProduct?.producerCode,
    isBigSeiRota,
    effectiveBigSeiColor,
    effectiveBasePrice,
    displayProductName,
    displayProductDescription,
  ])

  function bumpQuantity(delta: number) {
    setQuantity((q) => Math.max(1, q + delta))
  }

  function handleAddToCart() {
    if (!product) return
    if (isQuoteOnlyOfficeProduct(product)) return
    if (isShopperSizeVariant && !selectedJsonVariant) return
    if (showJsonVariants && !selectedJsonVariant && !isStaticSynthetic) return
    const cartBaseProduct = isPentelMarker
      ? effectivePentelProduct ?? product
      : isBlasettiMailpack
      ? effectiveBlasettiMailpackProduct ?? product
      : isSoftSeiRota
      ? effectiveSoftSeiRotaProduct ?? product
      : isStarlineCartellina
        ? effectiveCartellinaProduct ?? product
        : isEuroCartLacci
          ? effectiveEuroCartLacciProduct ?? product
        : isDeskStaplerPinza
          ? effectiveDeskStaplerProduct ?? product
        : product
    const productForCart = isBigSeiRota
      ? {
          ...cartBaseProduct,
          price:
            typeof effectiveBasePrice === 'number' ? effectiveBasePrice : cartBaseProduct.price,
          quantityPriceTiers: effectiveQuantityTiers,
        }
      : isPentelMarker
        ? {
            ...cartBaseProduct,
            price: 1.8,
            quantityPriceTiers: [],
          }
      : isBlasettiMailpack
        ? {
            ...cartBaseProduct,
            price:
              typeof effectiveBasePrice === 'number' ? effectiveBasePrice : cartBaseProduct.price,
            quantityPriceTiers: effectiveQuantityTiers ?? [],
          }
      : isSoftSeiRota
        ? {
            ...cartBaseProduct,
            price:
              typeof effectiveBasePrice === 'number' ? effectiveBasePrice : cartBaseProduct.price,
            quantityPriceTiers: [],
          }
      : isStarlineCartellina
        ? {
            ...cartBaseProduct,
            price:
              typeof effectiveBasePrice === 'number' ? effectiveBasePrice : cartBaseProduct.price,
          }
      : isDeskStaplerPinza
        ? {
            ...cartBaseProduct,
            price:
              typeof effectiveBasePrice === 'number' ? effectiveBasePrice : cartBaseProduct.price,
            quantityPriceTiers: [],
          }
      : isEuroCartLacci
        ? {
            ...cartBaseProduct,
            price: EUROCART_LACCI_BASE_PRICE,
            quantityPriceTiers: EUROCART_LACCI_QUANTITY_TIERS.map((t) => ({ ...t })),
          }
      : effectiveQuantityTiers && effectiveQuantityTiers.length > 0
        ? { ...cartBaseProduct, price: effectiveBasePrice, quantityPriceTiers: effectiveQuantityTiers }
        : cartBaseProduct
    const euroCartVariantForCart =
      isEuroCartLacci && effectiveEuroCartLacciDorsoCm != null
        ? {
            label: `Dorso ${effectiveEuroCartLacciDorsoCm} cm`,
            sku: (effectiveEuroCartLacciProduct?.producerCode ?? productForCart.producerCode ?? '').trim(),
          }
        : undefined
    const blasettiVariantForCart =
      isBlasettiMailpack && effectiveBlasettiMailpackFormat
        ? {
            label: effectiveBlasettiMailpackFormat,
            sku: (effectiveBlasettiMailpackProduct?.producerCode ?? productForCart.producerCode ?? '').trim(),
          }
        : undefined
    const pentelVariantForCart =
      isPentelMarker && (effectivePentelColor ?? '').trim()
        ? {
            label: effectivePentelColor.trim(),
            sku: (effectivePentelProduct?.producerCode ?? productForCart.producerCode ?? '').trim(),
          }
        : undefined
    const colorCopyVariantForCart =
      (isColorCopyA3 || isColorCopyA4) && selectedColorCopyA3Option
        ? {
            label: `${isColorCopyA4 ? 'A4' : 'A3'} ${selectedColorCopyA3Option.grammage} gr`,
            sku: `${(productForCart.producerCode ?? productForCart.id).trim()}-${selectedColorCopyA3Option.key}`,
          }
        : undefined
    const cartPayloadProduct =
      isEuroCartLacci && effectiveEuroCartLacciDorsoCm != null
        ? {
            ...productForCart,
            name: displayProductName,
            description: displayProductDescription || productForCart.description,
            price: EUROCART_LACCI_BASE_PRICE,
            quantityPriceTiers: EUROCART_LACCI_QUANTITY_TIERS.map((t) => ({ ...t })),
          }
        : isPentelMarker
          ? {
              ...productForCart,
              name: displayProductName,
              description: displayProductDescription || productForCart.description,
              price: 1.8,
              quantityPriceTiers: [],
            }
        : isBlasettiMailpack
          ? {
              ...productForCart,
              name: displayProductName,
              description: displayProductDescription || productForCart.description,
              price:
                typeof effectiveBasePrice === 'number' ? effectiveBasePrice : productForCart.price,
              quantityPriceTiers: effectiveQuantityTiers ?? [],
            }
        : isColorCopyA3 || isColorCopyA4
          ? {
              ...productForCart,
              name: displayProductName,
              description: displayProductDescription || productForCart.description,
              price: typeof effectiveBasePrice === 'number' ? effectiveBasePrice : productForCart.price,
              quantityPriceTiers: effectiveQuantityTiers ?? [],
            }
          : isShopperSizeVariant
            ? {
                ...productForCart,
                price:
                  typeof effectiveBasePrice === 'number'
                    ? effectiveBasePrice
                    : productForCart.price,
              }
          : productForCart
    addOfficeProduct(
      cartPayloadProduct,
      quantity,
      selectedJsonVariant
        ? { label: selectedJsonVariant.label, sku: selectedJsonVariant.sku }
        : euroCartVariantForCart ??
            blasettiVariantForCart ??
            pentelVariantForCart ??
            colorCopyVariantForCart,
    )
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
  }

  function prefetchVariantImage(src?: string) {
    const safeSrc = (src ?? '').trim()
    if (!safeSrc) return
    const img = new Image()
    img.src = safeSrc
  }

  /** Stessa logica buste forate: prima slot locale, poi fetch DB / SKU. */
  async function handleArchiveSelection(cm: 16 | 20, colorLabel: string) {
    if (!product) return
    const col = colorLabel.trim()
    const local = archiveSlots.find((s) => s.thicknessCm === cm && s.color === col)?.product
    if (local) {
      navigate(productDetailPath(local))
      return
    }
    try {
      setArchiveVariantBusy(true)
      const target = await fetchStarlineArchiveBoxProductByVariant(product, cm, col)
      if (target) {
        navigate(productDetailPath(target))
        return
      }
      const sku = STARLINE_ARCHIVE_BOX_SKU_BY_VARIANT[`${cm}:${col}`]
      if (sku) navigate(productDetailPath({ id: sku, producerCode: sku }))
    } finally {
      setArchiveVariantBusy(false)
    }
  }

  async function handlePunchedSelection(finish: 'goffrata' | 'liscia', thickness: 'medio' | 'pesante') {
    if (!product) return
    const local = resolvePunchedTarget(finish, thickness)?.product
    if (local) {
      navigate(productDetailPath(local))
      return
    }
    try {
      setSwitchingPunchedVariant(true)
      const target = await fetchStarlinePunchedEnvelopeVariantBySelection(product, {
        finish,
        thickness,
      })
      if (target) navigate(productDetailPath(target))
    } finally {
      setSwitchingPunchedVariant(false)
    }
  }

  async function handleStabiloOhpenVariantSelection(tipMm: number, color: string) {
    if (!product) return
    const wanted = color.trim()
    const local = stabiloColorSlots.find(
      (s) => s.color.trim() === wanted && s.tipMm === tipMm,
    )?.product
    if (local) {
      navigate(productDetailPath(local))
      return
    }
    const target = await fetchStabiloOhpenVariantBySelection(product, { color: wanted, tipMm })
    if (target) navigate(productDetailPath(target))
  }

  async function handleBigSeiRotaSelection(thicknessCm: number, color: string) {
    if (!product) return
    if (!Number.isFinite(thicknessCm)) return
    if (!(BIG_SEI_ROTA_DORSO_CM as readonly number[]).includes(thicknessCm)) return
    const wantedColor = color.trim()
    if (!(BIG_SEI_ROTA_COLOR_LABELS as readonly string[]).includes(wantedColor)) return
    const local = safeBinderColorSlots.find(
      (s) =>
        s.thicknessCm === thicknessCm &&
        s.color.trim().toLowerCase() === wantedColor.toLowerCase(),
    )?.product
    if (local) {
      navigate(productDetailPath(local))
      return
    }
    const hit = await fetchBigSeiRotaVariantBySelection(product, {
      thicknessCm,
      color: wantedColor,
    })
    if (hit) navigate(productDetailPath(hit))
  }

  async function handleSoftSeiRotaSelection(formatLabel: string) {
    if (!product) return
    const wanted = formatLabel.trim()
    if (!(SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).includes(wanted)) return
    setSelectedSoftSeiRotaFormat(wanted)
    const local = softSeiRotaSlots.find(
      (s) => s.formatLabel.trim().toLowerCase() === wanted.toLowerCase(),
    )?.product
    if (local) {
      setSelectedSoftSeiRotaProduct(local)
      return
    }
    const hit = await fetchSoftSeiRotaVariantByFormat(product, wanted)
    if (hit) {
      setSelectedSoftSeiRotaProduct(hit)
    }
  }

  async function handleBlasettiMailpackFormatSelection(formatLabel: string) {
    if (!product) return
    const wanted = formatLabel.trim()
    if (!(BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).includes(wanted)) return
    setSelectedBlasettiMailpackFormat(wanted)
    const local = blasettiMailpackSlots.find((s) => s.formatLabel === wanted)?.product ?? null
    if (local) {
      setSelectedBlasettiMailpackProduct(local)
      return
    }
    const hit = await fetchBlasettiMailpackVariantByFormat(product, wanted)
    if (hit) setSelectedBlasettiMailpackProduct(hit)
  }

  async function handlePentelColorSelection(colorLabel: string) {
    if (!product) return
    const wanted = colorLabel.trim()
    if (!wanted) return
    setSelectedPentelColor(wanted)
    const local =
      pentelColorSlots.find((s) => s.color.trim().toLowerCase() === wanted.toLowerCase())?.product ??
      null
    if (local) {
      setSelectedPentelProduct(local)
      return
    }
    const hit = await fetchPentelMarkerVariantByColor(product, wanted)
    if (hit) setSelectedPentelProduct(hit)
  }

  function pickCartellinaVariantTarget(
    model: 'semplice' | '3lembi',
    color: string,
  ): OfficeProduct | null {
    const wantedColor = color.trim().toLowerCase()
    const exact = cartellinaVariantSlots.find(
      (s) => s.model === model && s.color.trim().toLowerCase() === wantedColor,
    )?.product
    if (exact) return exact
    const pool: OfficeProduct[] = [...(starlineCartellinaQuery.data ?? [])]
    if (product && !pool.some((p) => String(p.id) === String(product.id))) pool.push(product)
    for (const p of pool) {
      if (detectStarlineCartellinaModelKind(p.name, p.brand) !== model) continue
      const oc = canonicalCartellinaColorForProduct(p.name, p.colorName)
      if (oc && oc.trim().toLowerCase() === wantedColor) return p
    }
    return cartellinaVariantSlots.find((s) => s.model === model)?.product ?? null
  }

  function handleCartellinaModelSelection(model: 'semplice' | '3lembi') {
    if (!isStarlineCartellina) return
    setSelectedCartellinaModel(model)
    const target = pickCartellinaVariantTarget(model, effectiveCartellinaColor)
    if (target) {
      setSelectedCartellinaProduct(target)
      const oc = canonicalCartellinaColorForProduct(target.name, target.colorName)
      const first = cartellinaVariantSlots.find((s) => s.model === model)?.color
      setSelectedCartellinaColor(oc ?? first ?? STARLINE_CARTELLINA_OFFICIAL_COLORS[0])
    }
  }

  function handleCartellinaColorSelection(color: string) {
    if (!isStarlineCartellina) return
    const model =
      selectedCartellinaModel ??
      detectStarlineCartellinaModelKind(
        effectiveCartellinaProduct?.name ?? product?.name ?? '',
        effectiveCartellinaProduct?.brand ?? product?.brand,
      )
    if (!model) return
    setSelectedCartellinaColor(color)
    const target = pickCartellinaVariantTarget(model, color)
    if (target) {
      setSelectedCartellinaProduct(target)
    }
  }

  function handleDeskStaplerModelSelection(model: DeskStaplerModel) {
    if (!isDeskStaplerPinza) return
    setSelectedDeskStaplerModel(model)
    const keepColor = selectedDeskStaplerColor?.trim().toLowerCase() ?? ''
    const exact = deskStaplerVariantSlots.find(
      (s) => s.model === model && s.color.trim().toLowerCase() === keepColor,
    )?.product
    const fallback = deskStaplerVariantSlots.find((s) => s.model === model)?.product ?? null
    const target = exact ?? fallback
    if (!target) return
    setSelectedDeskStaplerProduct(target)
    setSelectedDeskStaplerColor(detectDeskStaplerColor(target.name, target.colorName))
  }

  function handleDeskStaplerColorSelection(color: string) {
    if (!isDeskStaplerPinza) return
    setSelectedDeskStaplerColor(color)
    const model = effectiveDeskStaplerModel ?? detectDeskStaplerModel(product?.name ?? '')
    const target = deskStaplerVariantSlots.find(
      (s) => s.model === model && s.color.trim().toLowerCase() === color.trim().toLowerCase(),
    )?.product
    if (target) setSelectedDeskStaplerProduct(target)
  }

  function handleEuroCartLacciDorsoSelection(dorsoCm: number) {
    if (!isEuroCartLacci) return
    setSelectedEuroCartLacciDorsoCm(dorsoCm)
    const pool = euroCartLacciVariantsQuery.data ?? (product ? [product] : [])
    const target =
      euroCartLacciVariantSlots.find((s) => s.dorsoCm === dorsoCm)?.product ??
      pool.find((p) => detectEuroCartLacciDorsoCm(p.name) === dorsoCm) ??
      effectiveEuroCartLacciProduct ??
      product ??
      null
    if (target) setSelectedEuroCartLacciProduct(target)
  }

  if (!productKey) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-slate-700">Parametro prodotto mancante.</p>
        <Link to="/office-products" className="mt-4 inline-block text-brand-700">
          Torna al catalogo
        </Link>
      </main>
    )
  }

  if (query.isPending) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-slate-100" aria-hidden />
          <div className="space-y-3">
            <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" aria-hidden />
            <div className="h-8 w-11/12 animate-pulse rounded bg-slate-100" aria-hidden />
            <div className="h-24 animate-pulse rounded bg-slate-100" aria-hidden />
            <div className="h-40 animate-pulse rounded bg-slate-100" aria-hidden />
          </div>
        </div>
      </main>
    )
  }

  if (query.isError || !product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-lg font-semibold text-slate-900">Prodotto non trovato</p>
        <p className="mt-2 text-muted">
          {query.isError && query.error instanceof Error
            ? query.error.message
            : `Nessun articolo in catalogo con codice «${productKey}» (tabella public.products, colonne sku / id).`}
        </p>
        <Link
          to="/office-products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna al catalogo
        </Link>
      </main>
    )
  }

  if (isTimbroAziendeFarmacieProduct(product)) {
    return <TimbroAziendeFarmacieDetail product={product} />
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to={
            product && isStaticSyntheticOfficeProduct(product)
              ? staticSyntheticOfficeListingPath(product)
              : '/office-products'
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna al catalogo
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {imgOk && heroImageUrl ? (
              <img
                key={`pdp-hero-${product.id}-${heroImageUrl}`}
                src={heroImageUrl}
                alt={`${displayProductName} — SKU ${
                  isStarlineCartellina
                    ? (effectiveCartellinaProduct?.producerCode ?? product.producerCode)
                    : isPentelMarker
                      ? (effectivePentelProduct?.producerCode ?? product.producerCode)
                      : isBlasettiMailpack
                        ? (effectiveBlasettiMailpackProduct?.producerCode ?? product.producerCode)
                        : (surfaceProduct?.producerCode ?? product.producerCode)
                }`}
                loading="lazy"
                decoding="async"
                className="size-full object-contain p-6"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-brand-200">
                <FileText className="size-32" strokeWidth={1} aria-hidden />
              </div>
            )}
            </div>

            {isStaticSynthetic && syntheticGalleryImageUrls.length > 1 ? (
              <div
                className="mt-4 flex flex-wrap gap-2"
                role="tablist"
                aria-label="Galleria immagini prodotto"
              >
                {syntheticGalleryImageUrls.map((url, idx) => {
                  const thumb = withOfficeImageCacheBust(url, OFFICE_CATALOG_DATA_REVISION)
                  const active = idx === syntheticGalleryIdx
                  return (
                    <button
                      key={`synthetic-gallery-${url}-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={idx === 0 ? 'Immagine principale' : `Immagine ${idx + 1}`}
                      onClick={() => setSyntheticGalleryIdx(idx)}
                      className={[
                        'relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition sm:size-20',
                        active
                          ? 'border-brand-600 ring-2 ring-brand-400/40'
                          : 'border-slate-200 hover:border-slate-300',
                      ].join(' ')}
                    >
                      <img
                        src={thumb}
                        alt=""
                        className="size-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  )
                })}
              </div>
            ) : null}

            {isShopperSizeVariant ? (
              <aside
                className="mt-4 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50 via-white to-white p-4 shadow-sm ring-1 ring-sky-100/70 sm:p-5"
                aria-label="Shopper personalizzate con logo"
              >
                <p className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                  Ti servono shopper personalizzate con il tuo logo?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Mandaci una mail a{' '}
                  <a
                    href={SHOPPER_PERSONALIZZATE_MAILTO}
                    className="font-semibold text-brand-800 underline-offset-2 transition hover:text-brand-900 hover:underline"
                  >
                    info@astro-forniture.it
                  </a>
                </p>
                <a
                  href={SHOPPER_PERSONALIZZATE_MAILTO}
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand-800 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-900/15 transition hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 sm:text-[0.9375rem]"
                >
                  <Mail className="size-5 shrink-0" aria-hidden />
                  Richiedi preventivo via email
                </a>
              </aside>
            ) : null}

            <dl className="mt-3 space-y-1.5 text-xs text-slate-500">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 font-medium text-slate-500">Categoria</dt>
                <dd className="text-slate-700">{product.category}</dd>
              </div>
            </dl>
          </div>

          <div className="relative z-10 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {(isStarlineCartellina ? effectiveCartellinaProduct?.brand : undefined) ||
                (isPentelMarker ? effectivePentelProduct?.brand : undefined) ||
                (isBlasettiMailpack ? effectiveBlasettiMailpackProduct?.brand : undefined) ||
                product.brand}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {displayProductName}
            </h1>

            {isShopperSizeVariant && jsonVariants.length > 0 ? (
              <section className="mt-4" aria-label="Scegli la misura">
                <h2 className="text-sm font-semibold text-slate-900">Scegli la Misura:</h2>
                <p className="mt-1 text-xs text-slate-600">
                  Seleziona il formato: prezzo e confezione si aggiornano automaticamente.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {jsonVariants.map((opt) => {
                    const selected = selectedJsonVariant?.label === opt.label
                    return (
                      <button
                        key={`${opt.label}-${opt.sku ?? ''}`}
                        type="button"
                        onClick={() => setSelectedJsonVariant(opt)}
                        aria-pressed={selected}
                        className={[
                          'rounded-full border px-3.5 py-2 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                          selected
                            ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                            : 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50',
                        ].join(' ')}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm text-slate-700">
                  <p>
                    Misura:{' '}
                    <span className="font-semibold text-slate-900">
                      {selectedJsonVariant?.label ?? '—'}
                    </span>
                  </p>
                  <p className="mt-1">
                    Confezione:{' '}
                    <span className="font-semibold text-slate-900">
                      {selectedJsonVariant?.packLabel ??
                        (selectedJsonVariant?.packQty
                          ? `${selectedJsonVariant.packQty} pz`
                          : '—')}
                    </span>
                  </p>
                </div>
              </section>
            ) : null}

            {!isStaticSynthetic ? (
              <>
            {isColorCopyA3 || isColorCopyA4 ? (
              <section className="mt-4" aria-label="Seleziona Grammatura">
                <h2 className="text-sm font-semibold text-slate-900">Seleziona Grammatura</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorCopyGrammageOptions.map((opt) => {
                    const active = selectedColorCopyA3Option.key === opt.key
                    return (
                      <button
                        key={`color-copy-a3-grammage-${opt.key}`}
                        type="button"
                        onClick={() => setSelectedColorCopyA3Grammage(opt.key)}
                        className={[
                          'inline-flex min-h-[2.35rem] items-center justify-center rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/60',
                        ].join(' ')}
                        aria-pressed={active}
                      >
                        {opt.key}
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {isBlasettiMailpack ? (
              <section
                className="relative z-10 mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                aria-labelledby="mailpack-format-heading"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id="mailpack-format-heading" className="text-base font-semibold text-slate-900">
                    Scegli formato
                  </h2>
                  {blasettiMailpackVariantsQuery.isPending ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                  ) : null}
                </div>
                <div className="mt-3 flex max-w-full flex-nowrap gap-2.5 overflow-x-auto pb-1">
                  {(BLASETTI_MAILPACK_FORMAT_LABELS as readonly string[]).map((fmt) => {
                    const active = effectiveBlasettiMailpackFormat === fmt
                    const slot = blasettiMailpackSlots.find((s) => s.formatLabel === fmt)
                    const loaded = Boolean(slot)
                    const thumb = (slot?.product.imageUrl ?? '').trim()
                    const bustThumb = thumb
                      ? withOfficeImageCacheBust(thumb, OFFICE_CATALOG_DATA_REVISION)
                      : ''
                    return (
                      <button
                        key={`blasetti-mailpack-fmt-top-${fmt}`}
                        type="button"
                        onMouseEnter={() => prefetchVariantImage(slot?.product.imageUrl)}
                        onClick={() => void handleBlasettiMailpackFormatSelection(fmt)}
                        className={[
                          'flex w-[4.75rem] shrink-0 flex-col items-stretch rounded-xl border bg-white p-1.5 text-left shadow-sm outline-none transition',
                          active
                            ? 'border-2 border-brand-600 shadow-sm'
                            : 'border border-slate-200 hover:border-brand-400',
                          !loaded && !active ? 'opacity-90' : '',
                        ].join(' ')}
                        aria-pressed={active}
                        title={blasettiMailpackFormatDisplayCm(fmt)}
                      >
                        <div className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                          {bustThumb ? (
                            <img
                              src={bustThumb}
                              alt=""
                              className="max-h-full max-w-full object-contain p-1"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span className="px-1 text-center text-[9px] font-medium text-slate-400">
                              {fmt}
                            </span>
                          )}
                        </div>
                        <span className="mt-1.5 text-center text-[11px] font-semibold tabular-nums text-slate-800">
                          {fmt}
                        </span>
                        <span className="text-center text-[9px] leading-tight text-slate-500">
                          {blasettiMailpackFormatDisplayCm(fmt)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {isPentelMarker &&
            (pentelMarkerColorsQuery.isPending || pentelColorSlots.length > 0) ? (
              <section
                className="relative z-10 mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                aria-labelledby="pentel-scegli-colore-heading"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id="pentel-scegli-colore-heading" className="text-base font-semibold text-slate-900">
                    Scegli Colore
                  </h2>
                  {pentelMarkerColorsQuery.isPending ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                  ) : null}
                </div>
                <div className="mt-3 flex max-w-full flex-nowrap gap-2.5 overflow-x-auto pb-1">
                  {pentelColorSlots.map((slot) => {
                    const active =
                      (effectivePentelColor ?? '').trim().toLowerCase() ===
                      slot.color.trim().toLowerCase()
                    const thumb = (slot.product.imageUrl ?? '').trim()
                    const bustThumb = thumb
                      ? withOfficeImageCacheBust(thumb, OFFICE_CATALOG_DATA_REVISION)
                      : ''
                    return (
                      <button
                        key={`pentel-color-${slot.color}-${slot.product.id}`}
                        type="button"
                        onMouseEnter={() => prefetchVariantImage(slot.product.imageUrl)}
                        onClick={() => void handlePentelColorSelection(slot.color)}
                        className={[
                          'flex w-[4.85rem] shrink-0 flex-col items-stretch rounded-xl border bg-white p-1.5 text-left shadow-sm outline-none transition',
                          active
                            ? 'border-2 border-brand-600 bg-brand-50/60 shadow-sm'
                            : 'border border-slate-200 hover:border-brand-400',
                        ].join(' ')}
                        title={slot.color}
                        aria-label={`Colore ${slot.color}`}
                        aria-pressed={active}
                      >
                        <div className="relative flex h-[3.25rem] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                          {bustThumb ? (
                            <img
                              src={bustThumb}
                              alt=""
                              className="max-h-full max-w-full object-contain p-0.5"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span
                              className={[
                                'size-9 rounded-md border-2',
                                pentelMarkerSwatchFill(slot.color),
                                bicColorToneClasses(slot.color),
                              ].join(' ')}
                              aria-hidden
                            />
                          )}
                        </div>
                        <span className="mt-1.5 text-center text-[11px] font-semibold leading-snug text-slate-800">
                          {slot.color}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {(isEuroCartLacci || (euroCartLacciVariantsQuery.data?.length ?? 0) > 0) ? (
              <section className="relative z-10 mt-4" aria-label="Selettore dorso cartelle archivio con lacci">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">Dorso:</span>
                  {EUROCART_LACCI_DORSI_CM.map((dorsoCm) => {
                    const active = effectiveEuroCartLacciDorsoCm === dorsoCm
                    return (
                      <button
                        key={`eurocart-lacci-dorso-top-${dorsoCm}`}
                        type="button"
                        onClick={() => handleEuroCartLacciDorsoSelection(dorsoCm)}
                        className={[
                          'inline-flex min-h-[2.3rem] items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                        ].join(' ')}
                        title={`${dorsoCm} cm`}
                        aria-pressed={active}
                      >
                        {dorsoCm} cm
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {isBusteForate ? (
              <section className="mt-4" aria-label="Seleziona finitura e spessore buste forate">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Variante</h2>
                {showPunchedEnvelopeLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento modelli…
                  </p>
                ) : (
                  <>
                    <div className={selectorRowClass} aria-label="Seleziona finitura">
                      <span className="text-xs font-semibold text-slate-700">Finitura:</span>
                      {(['goffrata', 'liscia'] as const).map((finish) => {
                        const active = punchedCurrentFinish === finish
                        const label = finish === 'goffrata' ? 'Goffrata (Buccia)' : 'Liscia'
                        return (
                          <button
                            key={`punched-finish-${finish}`}
                            type="button"
                            onClick={() => handlePunchedSelection(finish, punchedCurrentThickness)}
                            className={[
                              selectorButtonClass,
                              active
                                ? 'border-2 border-brand-600 bg-brand-50 text-brand-800'
                                : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                            ].join(' ')}
                            disabled={switchingPunchedVariant}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    <div className={selectorRowClass} aria-label="Seleziona spessore">
                      <span className="text-xs font-semibold text-slate-700">Spessore:</span>
                      {(['medio', 'pesante'] as const).map((thickness) => {
                        const active = punchedCurrentThickness === thickness
                        const label = thickness === 'medio' ? 'Medio' : 'Pesante'
                        return (
                          <button
                            key={`punched-thickness-${thickness}`}
                            type="button"
                            onClick={() => handlePunchedSelection(punchedCurrentFinish, thickness)}
                            className={[
                              selectorButtonClass,
                              active
                                ? 'border-2 border-brand-600 bg-brand-50 text-brand-800'
                                : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                            ].join(' ')}
                            disabled={switchingPunchedVariant}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {switchingPunchedVariant ? (
                      <p className="mt-2 text-xs text-slate-500">Aggiornamento variante…</p>
                    ) : null}
                  </>
                )}
                {!showPunchedEnvelopeLoading && showPunchedEnvelopeIcons ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Variante selezionata:{' '}
                    <span className="font-semibold text-slate-900">
                      {(punchedCurrentFinish === 'goffrata' ? 'Goffrata (Buccia)' : 'Liscia') +
                        ' · ' +
                        (punchedCurrentThickness === 'medio' ? 'Medio' : 'Pesante')}
                    </span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isSoftSeiRota ? (
              <section className="mt-4" aria-label="Seleziona misura buste a sacco Soft Sei Rota">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Variante</h2>
                {softSeiRotaVariantsQuery.isPending ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento misure…
                  </p>
                ) : null}
                <div className={softSeiRotaFormatGridClass} aria-label="Seleziona misura">
                  {(SOFT_SEI_ROTA_FORMAT_LABELS as readonly string[]).map((formatLabel) => {
                    const active = effectiveSoftSeiRotaFormat === formatLabel
                    const loaded = softSeiRotaSlots.some((s) => s.formatLabel === formatLabel)
                    const price = softSeiRotaPriceForFormat(formatLabel)
                    const note = formatLabel === '30x42 cm' ? ' (conf. da 10 pezzi)' : ''
                    const label = `${formatLabel} - ${price != null ? eur.format(price) : '—'} + IVA${note}`
                    return (
                      <button
                        key={`soft-sei-rota-format-${formatLabel}`}
                        type="button"
                        onClick={() => void handleSoftSeiRotaSelection(formatLabel)}
                        className={[
                          'inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-lg border-2 px-2.5 py-2.5 text-[13px] font-semibold shadow-sm transition sm:min-h-[3rem] sm:px-3 sm:py-3 sm:text-sm',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white'
                            : loaded
                              ? 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50/80 hover:shadow'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/80 hover:shadow',
                        ].join(' ')}
                        title={label}
                      >
                        <span className="text-center leading-tight">
                          <span className="block">{formatLabel}</span>
                          <span className="mt-0.5 block text-[11px] font-medium opacity-90 sm:text-xs">
                            {price != null ? `${eur.format(price)} + IVA` : '—'}
                            {formatLabel === '30x42 cm' ? ' · conf. 10 pz' : ''}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {isStarlineCartellina ? (
              <section
                className="relative z-10 mt-4"
                aria-label="Selettore varianti cartelline Starline"
              >
                <h2 className="text-sm font-semibold text-slate-900">Scegli Modello</h2>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {([
                    { model: 'semplice' as const, label: 'Cartellina Semplice (50 pz)' },
                    { model: '3lembi' as const, label: 'Cartellina 3 Lembi (25 pz)' },
                  ] as const).map((entry) => {
                    const active = effectiveCartellinaModel === entry.model
                    const available = cartellinaModelOptions.includes(entry.model)
                    return (
                      <button
                        key={`cartellina-model-${entry.model}`}
                        type="button"
                        onClick={() => handleCartellinaModelSelection(entry.model)}
                        className={[
                          'inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg border-2 px-3 py-3 text-sm font-semibold shadow-sm transition',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white'
                            : available
                              ? 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50/80 hover:shadow'
                              : 'border-slate-200 bg-slate-100/90 text-slate-500 hover:border-slate-300 hover:bg-slate-100',
                        ].join(' ')}
                      >
                        {entry.label}
                      </button>
                    )
                  })}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">Scegli Colore</h3>
                <ul
                  className="pointer-events-auto relative z-20 mt-2 flex max-w-full flex-row flex-wrap items-start justify-start gap-x-2 gap-y-2.5"
                  aria-label="Seleziona colore cartellina"
                >
                  {cartellinaColorOptions.map((color) => {
                    const active = effectiveCartellinaColor.trim().toLowerCase() === color.trim().toLowerCase()
                    const thumbProduct =
                      effectiveCartellinaModel != null
                        ? pickCartellinaVariantTarget(effectiveCartellinaModel, color)
                        : null
                    const available = Boolean(thumbProduct)
                    const colorKey = color.trim().toLowerCase()
                    const thumbUrl = resolveCartellinaThumbnailUrl(
                      thumbProduct,
                      color,
                      OFFICE_CATALOG_DATA_REVISION,
                    )
                    const title = available
                      ? `${color} — SKU ${thumbProduct!.producerCode}`
                      : `${color} (non disponibile in questo modello)`
                    const selected = active && available
                    const borderTone = available ? colorToneClasses(color) : 'border-slate-200'
                    return (
                      <li key={`cartellina-color-${colorKey}`} className="pointer-events-auto relative z-20 flex w-[3.25rem] shrink-0 flex-col items-center sm:w-14">
                        <button
                          type="button"
                          disabled={!available}
                          onClick={() => handleCartellinaColorSelection(color)}
                          onMouseEnter={() => {
                            if (thumbUrl.startsWith('http')) prefetchVariantImage(thumbUrl)
                          }}
                          title={title}
                          aria-label={available ? `Seleziona colore ${color}` : `${color}, non disponibile`}
                          className={[
                            binderColorTileClass,
                            'relative z-30 flex w-full flex-col items-center gap-1 rounded-md p-0.5 outline-none transition pointer-events-auto',
                            available ? 'cursor-pointer hover:bg-slate-50/90' : 'cursor-not-allowed opacity-50',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white transition sm:size-12',
                              selected
                                ? 'z-10 scale-110 border-[3px] border-red-600 opacity-100 shadow-md ring-2 ring-red-500/70'
                                : `border-2 ${borderTone}`,
                              available && !selected ? 'hover:brightness-105' : '',
                              !available ? 'bg-slate-100' : '',
                            ].join(' ')}
                          >
                            {thumbUrl ? (
                              <img
                                src={thumbUrl}
                                alt=""
                                className="pointer-events-none size-full object-contain p-0.5 select-none"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : null}
                          </span>
                          <span className="block w-full max-w-[3.25rem] truncate text-center text-[10px] font-medium leading-tight text-slate-600 sm:text-[11px]">
                            {color}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ) : null}

            {isDeskStaplerPinza ? (
              <section className="relative z-10 mt-4" aria-label="Selettore varianti cucitrici a pinza">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Modello</h2>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {([
                    { model: 'pastel' as const, label: 'Pastel' },
                    { model: 'antibacterial' as const, label: 'Antibacterial' },
                    { model: 'grigia' as const, label: 'Grigia' },
                    { model: 'base' as const, label: 'Base' },
                  ] as const).map((entry) => {
                    const available = deskStaplerModelOptions.includes(entry.model)
                    const active = effectiveDeskStaplerModel === entry.model
                    return (
                      <button
                        key={`desk-stapler-model-${entry.model}`}
                        type="button"
                        disabled={!available}
                        onClick={() => handleDeskStaplerModelSelection(entry.model)}
                        className={[
                          'inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border-2 px-2 py-2 text-xs font-semibold shadow-sm transition',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white'
                            : available
                              ? 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50/80'
                              : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60',
                        ].join(' ')}
                      >
                        {entry.label}
                      </button>
                    )
                  })}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Scegli Colore</h3>
                <ul className="mt-2 flex flex-wrap gap-2.5">
                  {deskStaplerColorOptions.map((color) => {
                    const slot =
                      deskStaplerVariantSlots.find(
                        (s) =>
                          s.model === effectiveDeskStaplerModel &&
                          s.color.trim().toLowerCase() === color.trim().toLowerCase(),
                      ) ?? null
                    const thumb = slot?.product
                    const active =
                      effectiveDeskStaplerColor.trim().toLowerCase() === color.trim().toLowerCase()
                    const img = withOfficeImageCacheBust((thumb?.imageUrl ?? '').trim(), OFFICE_CATALOG_DATA_REVISION)
                    return (
                      <li key={`desk-stapler-color-${color.toLowerCase()}`} className="flex w-14 flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleDeskStaplerColorSelection(color)}
                          disabled={!thumb}
                          className={[
                            'pointer-events-auto flex w-full flex-col items-center gap-1 rounded-md p-0.5',
                            thumb ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'relative flex size-12 items-center justify-center overflow-hidden rounded-lg bg-white transition',
                              active
                                ? 'scale-105 border-[3px] border-red-600 shadow-md ring-2 ring-red-500/60'
                                : `${colorToneClasses(color)} border-2`,
                            ].join(' ')}
                          >
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                className="pointer-events-none size-full select-none object-contain p-0.5"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : null}
                          </span>
                          <span className="w-full truncate text-center text-[10px] font-medium text-slate-600">
                            {color}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ) : null}

            {showBinderColorLoading || showBinderColorIcons || isBigSeiRota ? (
              <section className="mt-4" aria-label="Scegli colore raccoglitore">
                <h2 className="text-sm font-semibold text-slate-900">
                  {isBigSeiRota ? 'Scegli Variante' : 'Scegli Colore'}
                </h2>
                {showBinderColorLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento colori…
                  </p>
                ) : (
                  <>
                    {availableStarboxThicknesses.length > 1 || isBigSeiRota ? (
                      <div
                        className={isBigSeiRota ? bigSeiRotaDorsoRowClass : binderDorsoRowClass}
                        aria-label="Seleziona dorso"
                      >
                        <span
                          className={
                            isBigSeiRota
                              ? 'text-sm font-semibold text-slate-800'
                              : 'text-xs font-medium text-slate-700'
                          }
                        >
                          Dorso:
                        </span>
                        {(isEuroboxEsselte
                          ? EUROBOX_ESSELTE_DORSO_CM.filter((cm) =>
                              availableStarboxThicknesses.includes(cm),
                            )
                          : isBigSeiRota
                            ? BIG_SEI_ROTA_DORSO_CM
                          : availableStarboxThicknesses
                        ).map((thickness) => {
                          const target = starboxThicknessTargets.get(thickness)
                          const active = selectedStarboxThickness === thickness
                          if (isBigSeiRota) {
                            const available = binderColorSlots.some(
                              (s) =>
                                s.thicknessCm === thickness &&
                                s.color.trim().toLowerCase() === effectiveBigSeiColor.trim().toLowerCase(),
                            )
                            return (
                              <button
                                key={`big-sei-thickness-${thickness}`}
                                type="button"
                                onClick={() =>
                                  void handleBigSeiRotaSelection(
                                    thickness,
                                    effectiveBigSeiColor,
                                  )
                                }
                                className={[
                                  'inline-flex min-h-[3rem] min-w-[6.25rem] shrink-0 items-center justify-center rounded-lg border-2 px-6 py-3 text-base font-semibold shadow-sm transition sm:min-h-[3.25rem] sm:min-w-[7rem] sm:px-7 sm:py-3.5 sm:text-[1.0625rem]',
                                  active
                                    ? 'border-brand-600 bg-brand-600 text-white shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white'
                                    : available
                                      ? 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50/80 hover:shadow'
                                      : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-75',
                                ].join(' ')}
                                disabled={!available}
                              >
                                {thickness} cm
                              </button>
                            )
                          }
                          if (!target) return null
                          return (
                            <Link
                              key={`starbox-thickness-${thickness}`}
                              to={productDetailPath(target.product)}
                              onClick={() => setSelectedStarboxThickness(thickness)}
                              className={[
                                'inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold transition',
                                active
                                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                                  : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400',
                              ].join(' ')}
                            >
                              {thickness} cm
                            </Link>
                          )
                        })}
                      </div>
                    ) : null}
                    <ul className={binderColorRowClass}>
                    {(isBigSeiRota
                      ? (BIG_SEI_ROTA_COLOR_LABELS as readonly string[]).map((label) => {
                          const slot = displayedStarboxColorSlots.find((s) => s.color === label)
                          if (slot) return slot
                          return {
                            color: label,
                            thicknessCm: selectedStarboxThickness ?? 12,
                            product,
                          }
                        })
                      : displayedStarboxColorSlots
                    ).map((slot) => {
                      const m = slot.product
                      const selected = String(m.id) === String(product.id)
                      const to = productDetailPath(m)
                      const thumbUrl = isBigSeiRota
                        ? BIG_SEI_ROTA_HD_IMAGE_BY_COLOR[slot.color] ||
                          (m.imageUrl ?? '').trim() ||
                          (product.imageUrl ?? '').trim()
                        : (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                      const thumbTitle = `${slot.color} — SKU ${m.producerCode}`
                      if (isBigSeiRota) {
                        return (
                          <li
                            key={`big-sei-color-${String(slot.thicknessCm ?? 'x')}-${slot.color.toLowerCase()}-${m.id}`}
                            className="shrink-0"
                          >
                            <button
                              type="button"
                              title={thumbTitle}
                              aria-label={`Apri colore ${thumbTitle}`}
                              onClick={() =>
                                void handleBigSeiRotaSelection(
                                  slot.thicknessCm ?? 12,
                                  slot.color,
                                )
                              }
                              onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                              className={binderColorTileClass}
                            >
                              <span
                                className={[
                                  binderColorThumbBaseClass,
                                  selected
                                    ? `${euroboxColorToneClasses(slot.color)} border-4 shadow-md ${euroboxSelectedGlowClasses(slot.color)}`
                                    : `${euroboxColorToneClasses(slot.color)} border-2 hover:brightness-105`,
                                ].join(' ')}
                              >
                                {thumbUrl ? (
                                  <img
                                    src={thumbUrl}
                                    alt=""
                                    className="size-full object-contain"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <FileText
                                    className="size-5 text-slate-300"
                                    strokeWidth={1.25}
                                    aria-hidden
                                  />
                                )}
                              </span>
                            </button>
                          </li>
                        )
                      }
                      return (
                        <li
                          key={`starbox-color-${String(slot.thicknessCm ?? 'x')}-${slot.color.toLowerCase()}-${m.id}`}
                          className="shrink-0"
                        >
                          <Link
                            to={to}
                            title={thumbTitle}
                            aria-label={`Apri colore ${thumbTitle}`}
                            aria-current={selected ? 'page' : undefined}
                            onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                            className={binderColorTileClass}
                          >
                            <span
                              className={[
                                binderColorThumbBaseClass,
                                isEuroboxEsselte || isBigSeiRota
                                  ? selected
                                    ? `${euroboxColorToneClasses(slot.color)} border-4 shadow-md ${euroboxSelectedGlowClasses(slot.color)}`
                                    : `${euroboxColorToneClasses(slot.color)} border-2 hover:brightness-105`
                                  : selected
                                    ? `${colorToneClasses(slot.color)} shadow-sm ${colorSelectedGlowClasses(slot.color)}`
                                    : `${colorToneClasses(slot.color)} hover:brightness-105`,
                              ].join(' ')}
                            >
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt=""
                                  className="size-full object-contain"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <FileText
                                  className="size-5 text-slate-300"
                                  strokeWidth={1.25}
                                  aria-hidden
                                />
                              )}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                    </ul>
                  </>
                )}
                {!showBinderColorLoading && showBinderColorIcons ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Colore selezionato:{' '}
                    <span className="font-semibold text-slate-900">
                      {binderColorSlots.find((s) => String(s.product.id) === String(product.id))
                        ?.color ?? '—'}
                    </span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {showParentSkuFamily && !isStarlineCartellina ? (
              <section className="mt-4" aria-label="Scegli modello">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Modello</h2>
                <ul className={variantGridClass}>
                  {scopedFamilyMembers.map((m) => {
                    const selected = String(m.id) === String(product.id)
                    const colorLabel = (m.colorName ?? m.name ?? '').trim() || 'Modello'
                    const to = productDetailPath(m)
                    const thumbTitle = `${colorLabel} — SKU ${m.producerCode}`
                    const q = modelQualityFromProduct(m)
                    const f = modelFinishFromProduct(m)
                    return (
                      <li
                        key={`${String(m.id)}-${m.producerCode}`}
                        className="w-[min(100%,7.25rem)] shrink-0 basis-[6.75rem] sm:basis-[7.25rem]"
                      >
                        <Link
                          to={to}
                          title={thumbTitle}
                          aria-label={`Apri modello ${thumbTitle}`}
                          onMouseEnter={() => prefetchVariantImage(m.imageUrl)}
                          className={variantTileLinkClass}
                          aria-current={selected ? 'page' : undefined}
                        >
                          <span
                            className={[
                              'relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white shadow-sm transition',
                              selected
                                ? 'border-brand-600 ring-2 ring-brand-400/80 ring-offset-2 ring-offset-slate-50'
                                : `${colorToneClasses(m.colorName)} border-slate-200 hover:border-brand-400`,
                            ].join(' ')}
                          >
                            {m.imageUrl ? (
                              <img
                                src={m.imageUrl}
                                alt={`Anteprima SKU ${m.producerCode}`}
                                className="size-full object-contain"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <FileText className="size-5 text-slate-300" strokeWidth={1.25} aria-hidden />
                            )}
                          </span>
                          <div className={variantCaptionStack}>
                            <span
                              className={`${variantCaptionPrimary} ${
                                selected ? 'text-slate-900' : 'text-slate-700'
                              }`}
                            >
                              {q ?? '—'}
                            </span>
                            <span
                              className={`${variantCaptionSecondary} ${
                                selected ? 'text-slate-800' : 'text-slate-600'
                              }`}
                            >
                              {f ?? '—'}
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Modello selezionato:{' '}
                  <span className="font-semibold text-slate-900">
                    {(product.colorName ?? product.name).trim() || '—'}
                  </span>
                  {(modelQualityFromProduct(product) || modelFinishFromProduct(product)) && (
                    <span className="mt-1 block text-xs font-normal text-slate-600">
                      {[modelQualityFromProduct(product) ?? '—', modelFinishFromProduct(product) ?? '—'].join(
                        ' · ',
                      )}
                    </span>
                  )}
                </p>
              </section>
            ) : null}

            {showJsonVariants && !isShopperSizeVariant ? (
              <div className="mt-3.5">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Modello</h2>
                <div className={variantGridClass}>
                  {jsonVariants.map((opt) => {
                    const selected = selectedJsonVariant?.label === opt.label
                    const q = modelQualityFromVariant(opt)
                    const f = modelFinishFromVariant(opt)
                    return (
                      <div
                        key={`${opt.label}-${opt.sku ?? ''}`}
                        className="w-[min(100%,7.25rem)] shrink-0 basis-[6.75rem] sm:basis-[7.25rem]"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedJsonVariant(opt)}
                          onMouseEnter={() => prefetchVariantImage(opt.image_url)}
                          className={`group ${variantTileLinkClass} ${
                            selected ? 'rounded-lg ring-1 ring-brand-200/80' : ''
                          }`}
                          aria-label={`Modello ${opt.label}`}
                          aria-pressed={selected}
                          title={opt.label}
                        >
                          <span
                            className={`relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white shadow-sm transition ${
                              selected
                                ? 'border-brand-500 ring-2 ring-brand-200'
                                : `border-slate-200 hover:border-brand-300 ${colorToneClasses(opt.label)}`
                            }`}
                          >
                            {opt.hex ? (
                              <span
                                className="block size-8 rounded-md border border-black/10 shadow-inner"
                                style={{ backgroundColor: opt.hex }}
                              />
                            ) : opt.image_url ? (
                              <img
                                src={opt.image_url}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="size-full object-contain"
                              />
                            ) : (
                              <span className="px-1 text-center text-[9px] font-bold uppercase leading-tight text-slate-700">
                                {opt.label.slice(0, 4)}
                              </span>
                            )}
                          </span>
                          <div className={variantCaptionStack}>
                            <span
                              className={`${variantCaptionPrimary} ${
                                selected ? 'text-slate-900' : 'text-slate-700'
                              }`}
                            >
                              {q ?? '—'}
                            </span>
                            <span
                              className={`${variantCaptionSecondary} ${
                                selected ? 'text-slate-800' : 'text-slate-600'
                              }`}
                            >
                              {f ?? '—'}
                            </span>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Modello selezionato:{' '}
                  <span className="font-semibold text-slate-900">
                    {selectedJsonVariant?.label ?? '—'}
                  </span>
                  {selectedJsonVariant &&
                    (modelQualityFromVariant(selectedJsonVariant) ||
                      modelFinishFromVariant(selectedJsonVariant)) && (
                      <span className="mt-1 block text-xs font-normal text-slate-600">
                        {[
                          modelQualityFromVariant(selectedJsonVariant) ?? '—',
                          modelFinishFromVariant(selectedJsonVariant) ?? '—',
                        ].join(' · ')}
                      </span>
                    )}
                </p>
              </div>
            ) : null}

            {isStarlineArchiveBox ? (
              <section className="mt-4" aria-label="Scatola archivio: misura e colore">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Variante</h2>
                {showArchiveBoxLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento varianti…
                  </p>
                ) : null}
                <>
                  <div className={archiveVariantRowClass} aria-label="Seleziona misura">
                    <span className="text-xs font-semibold text-slate-700">Misura:</span>
                    {([16, 20] as const).map((cm) => {
                      const active = effectiveArchiveDorso === cm
                      return (
                        <button
                          key={`archive-misura-${cm}`}
                          type="button"
                          onClick={() =>
                            void handleArchiveSelection(
                              cm,
                              effectiveArchiveColor ||
                                detectStarboxColorLabel(product.name) ||
                                'Blu',
                            )
                          }
                          className={[
                            archiveVariantButtonClass,
                            active
                              ? 'border-2 border-brand-600 bg-brand-50 text-brand-800'
                              : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                          ].join(' ')}
                          disabled={archiveVariantBusy}
                          aria-pressed={active}
                        >
                          {cm} cm
                        </button>
                      )
                    })}
                  </div>
                  <div className={archiveVariantRowClass} aria-label="Seleziona colore">
                    <span className="text-xs font-semibold text-slate-700">Colore:</span>
                    {STARLINE_ARCHIVE_BOX_COLOR_LABELS.map((colorLabel) => {
                      const dorsoNav: 16 | 20 =
                        effectiveArchiveDorso === 16 || effectiveArchiveDorso === 20
                          ? effectiveArchiveDorso
                          : 16
                      const slot = archiveSlots.find(
                        (s) => s.thicknessCm === dorsoNav && s.color === colorLabel,
                      )
                      const m = slot?.product
                      const active = effectiveArchiveColor === colorLabel
                      const thumbUrl =
                        (m?.imageUrl ?? '').trim() ||
                        starlineArchiveBoxImageForVariant(dorsoNav, colorLabel) ||
                        (product.imageUrl ?? '').trim()
                      return (
                        <button
                          key={`archive-colore-${colorLabel}`}
                          type="button"
                          onClick={() => void handleArchiveSelection(dorsoNav, colorLabel)}
                          onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                          className={[
                            archiveVariantButtonClass,
                            active
                              ? 'border-2 border-brand-600 bg-brand-50 text-brand-800'
                              : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                          ].join(' ')}
                          disabled={archiveVariantBusy}
                          aria-pressed={active}
                        >
                          {colorLabel}
                        </button>
                      )
                    })}
                  </div>
                  {archiveVariantBusy ? (
                    <p className="mt-2 text-xs text-slate-500">Aggiornamento variante…</p>
                  ) : null}
                </>
                <p className="mt-3 text-sm text-slate-600">
                  Variante selezionata:{' '}
                  <span className="font-semibold text-slate-900">
                    {effectiveArchiveDorso} cm · {effectiveArchiveColor || '—'}
                  </span>
                </p>
              </section>
            ) : null}

            {isStabiloOhpen ? (
              <section className="mt-4" aria-label="Seleziona colore pennarello Stabilo OHPen">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Variante</h2>
                {showStabiloOhpenLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento colori…
                  </p>
                ) : null}
                <div className={selectorRowClass} aria-label="Seleziona punta">
                  <span className="text-xs font-semibold text-slate-700">Punta:</span>
                  {STABILO_OHPEN_TIP_MM.map((tipMm) => {
                    const active = currentStabiloOhpenTip === tipMm
                    const available = stabiloColorSlots.some(
                      (s) =>
                        s.tipMm === tipMm &&
                        s.color.trim().toLowerCase() === currentStabiloOhpenColor.trim().toLowerCase(),
                    )
                    return (
                      <button
                        key={`stabilo-tip-${tipMm}`}
                        type="button"
                        disabled={!available}
                        onClick={() => void handleStabiloOhpenVariantSelection(tipMm, currentStabiloOhpenColor)}
                        className={[
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition',
                          active
                            ? 'border-2 border-brand-600 bg-brand-600 text-white shadow-sm'
                            : available
                              ? 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/30'
                              : 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400 opacity-70',
                        ].join(' ')}
                      >
                        {tipMm.toFixed(1)} mm
                      </button>
                    )
                  })}
                </div>
                <div className={archiveVariantRowClass} aria-label="Seleziona colore">
                  <span className="text-xs font-semibold text-slate-700">Colore:</span>
                  {STABILO_OHPEN_COLOR_LABELS.map((colorLabel) => {
                    const active = currentStabiloOhpenColor === colorLabel
                    const slot = stabiloColorSlots.find(
                      (s) => s.color === colorLabel && s.tipMm === currentStabiloOhpenTip,
                    )
                    const previewUrl = slot?.product.imageUrl ?? product.imageUrl
                    return (
                      <button
                        key={`stabilo-ohpen-${colorLabel}`}
                        type="button"
                        onClick={() =>
                          void handleStabiloOhpenVariantSelection(currentStabiloOhpenTip, colorLabel)
                        }
                        onMouseEnter={() => prefetchVariantImage(previewUrl)}
                        className={[
                          'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition',
                          active
                            ? 'border-2 border-brand-600 bg-brand-600 text-white shadow-sm'
                            : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                        ].join(' ')}
                        aria-pressed={active}
                      >
                        <span
                          className={[
                            'mr-2 inline-block size-3 rounded-full border border-black/20',
                            colorLabel === 'Nero'
                              ? 'bg-slate-900'
                              : colorLabel === 'Rosso'
                                ? 'bg-red-600'
                                : colorLabel === 'Verde'
                                  ? 'bg-emerald-600'
                                  : 'bg-sky-600',
                          ].join(' ')}
                        />
                        {colorLabel}
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {isTrattoVideoHighlighter ? (
              <section className="mt-4" aria-label="Evidenziatore Tratto Video: seleziona colore">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Colore</h2>
                {showTrattoLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento colori…
                  </p>
                ) : null}
                <div className={selectorRowClass}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Colore:
                  </p>
                  <div className="flex flex-row flex-wrap items-center gap-2">
                    {(trattoColorSlots ?? []).map((slot) => {
                      const m = slot.product
                      const selected = String(m.id) === String(product.id)
                      const to = productDetailPath(m)
                      const previewUrl = slot.product.imageUrl ?? product.imageUrl
                      const title = `${slot.color} — SKU ${m.producerCode}`
                      return (
                        <Link
                          key={`tratto-video-color-${slot.color.toLowerCase()}-${m.id}`}
                          to={to}
                          title={title}
                          aria-label={`Apri colore ${title}`}
                          aria-current={selected ? 'page' : undefined}
                          onMouseEnter={() => prefetchVariantImage(previewUrl)}
                          className={[
                            'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition',
                            selected
                              ? 'border-2 border-brand-600 bg-brand-600 text-white shadow-sm'
                              : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50/40',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'mr-2 inline-block size-3 rounded-sm border-2 bg-white',
                              trattovideoColorToneClasses(slot.color),
                            ].join(' ')}
                            aria-hidden
                          />
                          {slot.color}
                        </Link>
                      )
                    })}
                  </div>
                </div>
                {!showTrattoLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Colore selezionato:{' '}
                    <span className="font-semibold text-slate-900">
                      {currentTrattoColor || '—'}
                    </span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isBicCristal50 ? (
              <section className="mt-4" aria-label="Penna a sfera Bic Cristal: seleziona colore">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Colore</h2>
                {showBicLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento colori…
                  </p>
                ) : null}
                <div className={selectorRowClass}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Colore:
                  </p>
                  <ul className={binderColorRowClass}>
                    {(bicColorSlots ?? []).map((slot) => {
                      const m = slot.product
                      const selected = String(m.id) === String(product.id)
                      const to = productDetailPath(m)
                      const thumbUrl = (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                      const thumbTitle = `${slot.color} — SKU ${m.producerCode}`
                      return (
                        <li
                          key={`bic-cristal-50-color-${slot.color.toLowerCase()}-${m.id}`}
                          className="shrink-0"
                        >
                          <Link
                            to={to}
                            title={thumbTitle}
                            aria-label={`Apri colore ${thumbTitle}`}
                            aria-current={selected ? 'page' : undefined}
                            onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                            className={binderColorTileClass}
                          >
                            <span
                              className={[
                                binderColorThumbBaseClass,
                                selected
                                  ? `${bicColorToneClasses(slot.color)} border-4 shadow-md ${colorSelectedGlowClasses(slot.color)}`
                                  : `${bicColorToneClasses(slot.color)} border-2 hover:brightness-105`,
                              ].join(' ')}
                            >
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt=""
                                  className="size-full object-contain"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <FileText
                                  className="size-5 text-slate-300"
                                  strokeWidth={1.25}
                                  aria-hidden
                                />
                              )}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                {!showBicLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Colore selezionato:{' '}
                    <span className="font-semibold text-slate-900">{currentBicColor || '—'}</span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isPilotHiTecpoint ? (
              <section className="mt-4" aria-label="Penna Pilot Hi Tecpoint: seleziona punta e colore">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Punta</h2>
                {showPilotLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento colori…
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(PILOT_HI_TECPOINT_TIP_MM as readonly number[]).map((tipMm) => {
                    const active = currentPilotTipMm === tipMm
                    const preferred = pilotVariantSlots.find(
                      (s) => s.tipMm === tipMm && s.color.trim().toLowerCase() === currentPilotColor.trim().toLowerCase(),
                    )
                    const fallback = pilotVariantSlots.find((s) => s.tipMm === tipMm)
                    const target = preferred ?? fallback
                    const to = target ? productDetailPath(target.product) : null
                    const label = `Punta ${String(tipMm).replace('.', ',')} mm (${tipMm === 0.5 ? 'V5' : 'V7'})`
                    if (!to) return null
                    return (
                      <Link
                        key={`pilot-tip-${tipMm}`}
                        to={to}
                        className={[
                          'inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg border-2 px-3 py-3 text-sm font-semibold shadow-sm transition',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white'
                            : 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50/80 hover:shadow',
                        ].join(' ')}
                        aria-current={active ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Scegli Colore</h3>
                <div className={selectorRowClass}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Colore:
                  </p>
                  <ul className={binderColorRowClass}>
                    {(pilotColorSlots ?? []).map((slot) => {
                      const m = slot.product
                      const selected = String(m.id) === String(product.id)
                      const to = productDetailPath(m)
                      const thumbUrl = (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                      const thumbTitle = `${slot.color} — SKU ${m.producerCode}`
                      return (
                        <li
                          key={`pilot-v5-color-${slot.color.toLowerCase()}-${m.id}`}
                          className="shrink-0"
                        >
                          <Link
                            to={to}
                            title={thumbTitle}
                            aria-label={`Apri colore ${thumbTitle}`}
                            aria-current={selected ? 'page' : undefined}
                            onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                            className={binderColorTileClass}
                          >
                            <span
                              className={[
                                binderColorThumbBaseClass,
                                selected
                                  ? `${colorToneClasses(slot.color)} border-4 shadow-md ${colorSelectedGlowClasses(slot.color)}`
                                  : `${colorToneClasses(slot.color)} border-2 hover:brightness-105`,
                              ].join(' ')}
                            >
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt=""
                                  className="size-full object-contain"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <FileText
                                  className="size-5 text-slate-300"
                                  strokeWidth={1.25}
                                  aria-hidden
                                />
                              )}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                {!showPilotLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Colore selezionato:{' '}
                    <span className="font-semibold text-slate-900">{currentPilotColor || '—'}</span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isStaedtlerNoris ? (
              <section className="mt-4" aria-label="Matite Staedtler Noris: seleziona gradazione">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Gradazione</h2>
                {showStaedtlerLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento gradazioni…
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
                  {(STAEDTLER_NORIS_GRADE_LABELS as readonly string[]).map((gradeLabel) => {
                    const slot = staedtlerVariantSlots.find((s) => s.gradeLabel === gradeLabel)
                    if (!slot) return null
                    const m = slot.product
                    const selected = String(m.id) === String(product.id)
                    const to = productDetailPath(m)
                    const thumbUrl = (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                    const thumbTitle = `${gradeLabel} — SKU ${m.producerCode}`
                    return (
                      <Link
                        key={`staedtler-grade-${gradeLabel}-${m.id}`}
                        to={to}
                        title={thumbTitle}
                        aria-label={`Apri gradazione ${thumbTitle}`}
                        aria-current={selected ? 'page' : undefined}
                        onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                        className="inline-flex min-h-[6rem] w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow"
                      >
                        <span
                          className={[
                            'flex size-12 items-center justify-center overflow-hidden rounded-md border-2 bg-white',
                            selected
                              ? `${staedtlerGradeBorderClasses(gradeLabel)} shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white`
                              : `${staedtlerGradeBorderClasses(gradeLabel)} hover:brightness-105`,
                          ].join(' ')}
                        >
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt=""
                              className="size-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <FileText className="size-5 text-slate-300" strokeWidth={1.25} aria-hidden />
                          )}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{gradeLabel}</span>
                      </Link>
                    )
                  })}
                </div>
                {!showStaedtlerLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Gradazione selezionata:{' '}
                    <span className="font-semibold text-slate-900">{currentStaedtlerGrade || '—'}</span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isFermagliZincati ? (
              <section className="mt-4" aria-label="Fermagli zincati: seleziona numero">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Numero</h2>
                {showFermagliLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento misure…
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
                  {(FERMAGLI_ZINCATI_NUMBER_LABELS as readonly string[]).map((numberLabel) => {
                    const slot = fermagliVariantSlots.find((s) => s.numberLabel === numberLabel)
                    if (!slot) return null
                    const m = slot.product
                    const selected = String(m.id) === String(product.id)
                    const to = productDetailPath(m)
                    const thumbUrl = (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                    const thumbTitle = `${numberLabel} — SKU ${m.producerCode}`
                    return (
                      <Link
                        key={`fermagli-numero-${numberLabel}-${m.id}`}
                        to={to}
                        title={thumbTitle}
                        aria-label={`Apri variante ${thumbTitle}`}
                        aria-current={selected ? 'page' : undefined}
                        onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                        className="inline-flex min-h-[6rem] w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow"
                      >
                        <span
                          className={[
                            'flex size-12 items-center justify-center overflow-hidden rounded-md border-2 bg-white',
                            selected
                              ? `${fermagliNumberBorderClasses(numberLabel)} shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white`
                              : `${fermagliNumberBorderClasses(numberLabel)} hover:brightness-105`,
                          ].join(' ')}
                        >
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt=""
                              className="size-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <FileText className="size-5 text-slate-300" strokeWidth={1.25} aria-hidden />
                          )}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{numberLabel}</span>
                      </Link>
                    )
                  })}
                </div>
                {!showFermagliLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Numero selezionato:{' '}
                    <span className="font-semibold text-slate-900">{currentFermagliNumber || '—'}</span>
                  </p>
                ) : null}
              </section>
            ) : null}

            {isImballoProTape ? (
              <section className="mt-4" aria-label="Nastro da imballo professionale: seleziona tipologia">
                <h2 className="text-sm font-semibold text-slate-900">Scegli Tipologia</h2>
                {showImballoProTapeLoading ? (
                  <p className="mt-2.5 flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />
                    Caricamento varianti…
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  {(IMBALLO_PRO_TAPE_VARIANT_LABELS as readonly string[]).map((variantLabel) => {
                    const slot = imballoProTapeSlots.find((s) => s.variantLabel === variantLabel)
                    if (!slot) return null
                    const m = slot.product
                    const selected = String(m.id) === String(product.id)
                    const to = productDetailPath(m)
                    const thumbUrl = (m.imageUrl ?? '').trim() || (product.imageUrl ?? '').trim()
                    const thumbTitle = `${variantLabel} — SKU ${m.producerCode}`
                    return (
                      <Link
                        key={`imballo-pro-${variantLabel}-${m.id}`}
                        to={to}
                        title={thumbTitle}
                        aria-label={`Apri variante ${thumbTitle}`}
                        aria-current={selected ? 'page' : undefined}
                        onMouseEnter={() => prefetchVariantImage(thumbUrl)}
                        className="inline-flex min-h-[6rem] w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow"
                      >
                        <span
                          className={[
                            'flex size-12 items-center justify-center overflow-hidden rounded-md border-2 bg-white',
                            selected
                              ? `${imballoProTapeBorderClasses(variantLabel)} shadow-md ring-2 ring-brand-300/70 ring-offset-2 ring-offset-white`
                              : `${imballoProTapeBorderClasses(variantLabel)} hover:brightness-105`,
                          ].join(' ')}
                        >
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt=""
                              className="size-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <FileText className="size-5 text-slate-300" strokeWidth={1.25} aria-hidden />
                          )}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{variantLabel}</span>
                      </Link>
                    )
                  })}
                </div>
                {!showImballoProTapeLoading ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Variante selezionata:{' '}
                    <span className="font-semibold text-slate-900">
                      {currentImballoProTapeLabel || '—'}
                    </span>
                  </p>
                ) : null}
              </section>
            ) : null}

              </>
            ) : null}

            <OfficeProductDetailPurchasePanel
              priceLineLabel={
                isShopperSizeVariant
                  ? selectedJsonVariant?.label
                    ? `Prezzo — ${selectedJsonVariant.label}`
                    : 'Prezzo confezione'
                  : showQuantityDiscountTable
                    ? 'Per la quantità selezionata'
                    : 'Prezzo unitario'
              }
              unitForQty={unitForQty}
              lineTotal={lineTotal}
              quantity={quantity}
              onBumpQuantity={bumpQuantity}
              onAddToCart={handleAddToCart}
              justAdded={justAdded}
              productName={displayProductName}
              quoteOnly={isQuoteOnlyOfficeProduct(product)}
              priceUnitSuffix={isShopperSizeVariant ? '/ confezione' : '/ pezzo'}
              rootClassName={isStaticSynthetic ? 'mt-6 sm:mt-8' : undefined}
              quantityDiscountTable={
                isQuoteOnlyOfficeProduct(product) ? undefined : quantityDiscountTableNode
              }
            />
          </div>
        </div>

        <OfficeProductDetailDescriptionSection description={displayProductDescription ?? ''} />

        <OfficeProductDetailRelatedSection
          products={relatedProducts}
          layout={isStaticSynthetic ? 'grid-4' : undefined}
          relatedCardHideCategory={isStaticSynthetic}
          relatedCompactGrid={isStaticSynthetic}
        />
      </div>
    </main>
  )
}
