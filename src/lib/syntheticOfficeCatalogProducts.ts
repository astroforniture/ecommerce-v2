import type { OfficeProduct } from '../types/officeProduct'
import { buildCartucceTonerOfficeProducts } from '../data/cartucceTonerProducts'
import { cartucceTonerCategoryHref } from './officeCategories'
import {
  buildCasseDitronOfficeProducts,
  macchineUfficioCasseDitronListingPath,
} from '../data/casseDitronProducts'
import { resolveCrossSellCatalogProductById } from '../data/crossSellCatalog'
import {
  buildDistruggidocumentiOfficeProducts,
  macchineUfficioDistruggiDocumentiListingPath,
} from '../data/distruggidocumentiProducts'
import {
  buildEtichettatriciOfficeProducts,
  macchineUfficioEtichettatriciListingPath,
} from '../data/macchineEtichettatrici'
import {
  buildVerificaBanconoteOfficeProducts,
  macchineUfficioVerificaBanconoteListingPath,
} from '../data/verificaBanconoteProducts'
import {
  macchineUfficioPlastificatriciListingPath,
  resolvePlastificatriciProductByCatalogKey,
} from '../data/plastificatriciProducts'
import {
  buildPileOfficeProducts,
  cancelleriaPileListingPath,
} from '../data/pileProducts'
import { buildQuaderniOfficeProducts, cancelleriaQuaderniListingPath } from '../data/quaderniProducts'
import {
  agendeCategoryHref,
  applyAgendeImmediateAvailability,
  AGENDE_SUBCATEGORY_GIORNALIERE,
  AGENDE_SUBCATEGORY_PLANNING,
  AGENDE_SUBCATEGORY_SETTIMANALI,
} from './agendeCatalog'
import {
  isAgendaAlfaOfficeProductId,
  resolveAgendaAlfaProductByCatalogKey,
} from '../data/agendeAlfaGiornaliereProducts'
import {
  isAgendaAlfaSettOfficeProductId,
  resolveAgendaAlfaSettProductByCatalogKey,
} from '../data/agendeAlfaSettimanaliProducts'
import {
  isAgendaDeltaOfficeProductId,
  resolveAgendaDeltaProductByCatalogKey,
} from '../data/agendeDeltaGiornaliereProducts'
import {
  isAgendaDeltaSettOfficeProductId,
  resolveAgendaDeltaSettProductByCatalogKey,
} from '../data/agendeDeltaSettimanaliProducts'
import {
  isAgendaTextOfficeProductId,
  resolveAgendaTextProductByCatalogKey,
} from '../data/agendeTextGiornaliereProducts'
import {
  isAgendaWpSettOfficeProductId,
  resolveAgendaWpSettProductByCatalogKey,
} from '../data/agendeWeeklyPatternSettimanaliProducts'
import {
  isAgendaPlanningOfficeProductId,
  resolveAgendaPlanningProductByCatalogKey,
} from '../data/agendePlanningProducts'
import {
  cancelleriaShopperCartaPath,
  cancelleriaShopperPlasticaPath,
  resolveShopperProductByCatalogKey,
} from '../data/shopperCancelleria'
import {
  cancelleriaBusteListingPath,
  resolveSacbollProductByCatalogKey,
} from '../data/sacbollBuste'
import {
  buildHorten2LightOfficeProduct,
  buildLulea2SoftshellOfficeProduct,
  buildMoonlight2SoftshellOfficeProduct,
  buildMoonlight2ArancioSoftshellOfficeProduct,
  buildMikySoftshellOfficeProduct,
  buildMikyArancioSoftshellOfficeProduct,
  buildRenoHvGialloOfficeProduct,
  buildRenoHvArancioOfficeProduct,
  buildMySen2SoftshellOfficeProduct,
  buildPortwestTexpelSplashEcoOfficeProduct,
  buildSocciaSoftshellOfficeProduct,
  buildSpaceLadySoftshellOfficeProduct,
} from '../data/sicurezzaApparelCatalog'
import {
  sicurezzaCategoryHref,
} from './sicurezzaCatalog'
import {
  modulisticaCategoryHref,
  resolveModulisticaProductByCatalogKey,
} from '../data/modulisticaCatalog'
import {
  cartaTermicaListingPath,
  resolveCartaTermicaProductByCatalogKey,
} from '../data/cartaTermicaCatalog'
import {
  buildIHealthAstroMedicalOfficeProducts,
  iHealthCanonicalProductId,
  lineaAstroMedicalCatalogPath,
} from '../data/iHealthAstroMedicalProducts'
import {
  buildLegacyAstroMedicalOfficeProducts,
  legacyAstroMedicalCanonicalId,
} from '../data/legacyAstroMedicalOfficeProducts'
import {
  buildProfessionalDiagnosticAstroMedicalOfficeProducts,
  diagnosticCanonicalProductId,
} from '../data/professionalDiagnosticAstroMedicalProducts'
import {
  buildEthiconSuturesAstroMedicalOfficeProducts,
  ethiconSuturesCanonicalProductId,
} from '../data/ethiconSuturesAstroMedicalProducts'
import {
  buildLaboratoryBagsAstroMedicalOfficeProducts,
  laboratoryBagsCanonicalProductId,
} from '../data/laboratoryBagsAstroMedicalProducts'
import {
  buildWellnessBagsScalesAstroMedicalOfficeProducts,
  wellnessBagsScalesCanonicalProductId,
} from '../data/wellnessBagsScalesAstroMedicalProducts'
import {
  buildIvCannulaAstroMedicalOfficeProducts,
  ivCannulaCanonicalProductId,
} from '../data/ivCannulaAstroMedicalProducts'
import {
  buildSurgicalInstrumentsAstroMedicalOfficeProducts,
  surgicalCanonicalProductId,
} from '../data/surgicalInstrumentsAstroMedicalProducts'
import {
  buildProfessionalInstrumentationAstroMedicalOfficeProducts,
  professionalInstrumentationCanonicalProductId,
} from '../data/professionalInstrumentationAstroMedicalProducts'

function resolveLineaAstroMedicalSyntheticByGimaId(k: string): OfficeProduct | null {
  return (
    buildLegacyAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildIHealthAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildProfessionalDiagnosticAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildSurgicalInstrumentsAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildIvCannulaAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildEthiconSuturesAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildLaboratoryBagsAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildWellnessBagsScalesAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    buildProfessionalInstrumentationAstroMedicalOfficeProducts().find((p) => p.id === k) ??
    null
  )
}

/** Prodotti office definiti solo in frontend (non in `public.products`). */
export function isStaticSyntheticOfficeProduct(
  p: Pick<OfficeProduct, 'id'> | null | undefined,
): boolean {
  const id = String(p?.id ?? '')
  return (
    id.startsWith('AF-DIST-') ||
    id.startsWith('AF-TONER-') ||
    id.startsWith('AF-ETCH-') ||
    id.startsWith('AF-DITRON-') ||
    id.startsWith('AF-VB-') ||
    id.startsWith('AF-PLAST-') ||
    id.startsWith('AF-PILE-') ||
    id.startsWith('AF-QUAD-') ||
    id.startsWith('AF-AGENDA-ALFA') ||
    id.startsWith('AF-AGENDA-DELTA') ||
    id.startsWith('AF-AGENDA-TEXT') ||
    id.startsWith('AF-AGENDA-WP-') ||
    id.startsWith('AF-AGENDA-PLAN') ||
    id.startsWith('AF-IHEALTH-') ||
    id.startsWith('AF-AMED-') ||
    id.startsWith('AF-DIAG-') ||
    id.startsWith('AF-SURG-') ||
    id.startsWith('AF-IVCANN-') ||
    id.startsWith('AF-SUT-') ||
    id.startsWith('AF-LAB-') ||
    id.startsWith('AF-WELL-') ||
    id.startsWith('AF-PROINSTR-') ||
    id.startsWith('AF-SHOPPER-') ||
    id.startsWith('AF-SACBOLL-') ||
    id.startsWith('AF-XS-') ||
    id.startsWith('gima-')
  )
}

export function resolveSyntheticOfficeProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  if (k.startsWith('AF-DIST-')) {
    return (
      buildDistruggidocumentiOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
    )
  }
  if (k.startsWith('AF-TONER-')) {
    return buildCartucceTonerOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-ETCH-')) {
    return buildEtichettatriciOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-DITRON-')) {
    return buildCasseDitronOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-VB-')) {
    return (
      buildVerificaBanconoteOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
    )
  }
  if (k.startsWith('AF-PLAST-')) {
    return resolvePlastificatriciProductByCatalogKey(k)
  }
  if (k.startsWith('AF-XS-')) {
    return resolveCrossSellCatalogProductById(k)
  }
  if (k.startsWith('AF-PILE-')) {
    return buildPileOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-QUAD-')) {
    return buildQuaderniOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  {
    const alfaSett = resolveAgendaAlfaSettProductByCatalogKey(k)
    if (alfaSett) return applyAgendeImmediateAvailability(alfaSett)
  }
  {
    const deltaSett = resolveAgendaDeltaSettProductByCatalogKey(k)
    if (deltaSett) return applyAgendeImmediateAvailability(deltaSett)
  }
  {
    const text = resolveAgendaTextProductByCatalogKey(k)
    if (text) return applyAgendeImmediateAvailability(text)
  }
  {
    const wpSett = resolveAgendaWpSettProductByCatalogKey(k)
    if (wpSett) return applyAgendeImmediateAvailability(wpSett)
  }
  {
    const plan = resolveAgendaPlanningProductByCatalogKey(k)
    if (plan) return applyAgendeImmediateAvailability(plan)
  }
  {
    const delta = resolveAgendaDeltaProductByCatalogKey(k)
    if (delta) return applyAgendeImmediateAvailability(delta)
  }
  {
    const alfa = resolveAgendaAlfaProductByCatalogKey(k)
    if (alfa) return applyAgendeImmediateAvailability(alfa)
  }
  if (k.startsWith('AF-SHOPPER-')) {
    return resolveShopperProductByCatalogKey(k)
  }
  if (k.startsWith('AF-SACBOLL-')) {
    return resolveSacbollProductByCatalogKey(k)
  }
  const modulistica = resolveModulisticaProductByCatalogKey(k)
  if (modulistica) return modulistica
  const cartaTermica = resolveCartaTermicaProductByCatalogKey(k)
  if (cartaTermica) return cartaTermica
  if (k.startsWith('AF-IHEALTH-')) {
    const canon = iHealthCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-AMED-')) {
    const canon = legacyAstroMedicalCanonicalId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-DIAG-')) {
    const canon = diagnosticCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-SURG-')) {
    const canon = surgicalCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-IVCANN-')) {
    const canon = ivCannulaCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-SUT-')) {
    const canon = ethiconSuturesCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-LAB-')) {
    const canon = laboratoryBagsCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-WELL-')) {
    const canon = wellnessBagsScalesCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('AF-PROINSTR-')) {
    const canon = professionalInstrumentationCanonicalProductId(k)
    return resolveLineaAstroMedicalSyntheticByGimaId(canon)
  }
  if (k.startsWith('gima-')) {
    return resolveLineaAstroMedicalSyntheticByGimaId(k)
  }
  if (k === '89931' || k === '89930') {
    return buildHorten2LightOfficeProduct()
  }
  if (k === '105192') {
    return buildPortwestTexpelSplashEcoOfficeProduct()
  }
  if (k === '104546') {
    return buildLulea2SoftshellOfficeProduct()
  }
  if (k === '86181') {
    return buildMySen2SoftshellOfficeProduct()
  }
  if (k === '104541') {
    return buildSocciaSoftshellOfficeProduct()
  }
  if (k === '97983') {
    return buildSpaceLadySoftshellOfficeProduct()
  }
  if (k === '86492') {
    return buildMoonlight2SoftshellOfficeProduct()
  }
  if (k === '86494') {
    return buildMoonlight2ArancioSoftshellOfficeProduct()
  }
  if (k === '89950') {
    return buildMikySoftshellOfficeProduct()
  }
  if (k === '89955') {
    return buildMikyArancioSoftshellOfficeProduct()
  }
  if (k === '73755') {
    return buildRenoHvGialloOfficeProduct()
  }
  if (k === '73757') {
    return buildRenoHvArancioOfficeProduct()
  }
  if (/^\d{4,}$/.test(k)) {
    const gimaNumeric = resolveLineaAstroMedicalSyntheticByGimaId(`gima-${k}`)
    if (gimaNumeric) return gimaNumeric
  }
  const plastificatrici = resolvePlastificatriciProductByCatalogKey(k)
  if (plastificatrici) return plastificatrici
  return null
}

export function staticSyntheticOfficeListingPath(product: Pick<OfficeProduct, 'id'>): string {
  const id = String(product.id ?? '')
  if (id.startsWith('AF-DIST-')) {
    return macchineUfficioDistruggiDocumentiListingPath()
  }
  if (id.startsWith('AF-TONER-')) {
    return cartucceTonerCategoryHref()
  }
  if (id.startsWith('AF-ETCH-')) {
    return macchineUfficioEtichettatriciListingPath()
  }
  if (id.startsWith('AF-DITRON-')) {
    return macchineUfficioCasseDitronListingPath()
  }
  if (id.startsWith('AF-VB-')) {
    return macchineUfficioVerificaBanconoteListingPath()
  }
  if (id.startsWith('AF-PLAST-')) {
    return macchineUfficioPlastificatriciListingPath()
  }
  if (id.startsWith('AF-XS-')) {
    return macchineUfficioCasseDitronListingPath()
  }
  if (id.startsWith('AF-PILE-')) {
    return cancelleriaPileListingPath()
  }
  if (id.startsWith('AF-QUAD-')) {
    return cancelleriaQuaderniListingPath()
  }
  if (isAgendaAlfaSettOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_SETTIMANALI)
  }
  if (isAgendaDeltaSettOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_SETTIMANALI)
  }
  if (isAgendaTextOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_GIORNALIERE)
  }
  if (isAgendaWpSettOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_SETTIMANALI)
  }
  if (isAgendaPlanningOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_PLANNING)
  }
  if (isAgendaDeltaOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_GIORNALIERE)
  }
  if (isAgendaAlfaOfficeProductId(id)) {
    return agendeCategoryHref(AGENDE_SUBCATEGORY_GIORNALIERE)
  }
  if (id.startsWith('AF-SHOPPER-CARTA-') || id === 'AF-SHOPPER-CARTA-MAINETTI') {
    return cancelleriaShopperCartaPath()
  }
  if (id.startsWith('AF-SHOPPER-PLASTICA-') || id === 'AF-SHOPPER-PLASTICA-MATERBI') {
    return cancelleriaShopperPlasticaPath()
  }
  if (id.startsWith('AF-SACBOLL-')) {
    return cancelleriaBusteListingPath()
  }
  if (resolveModulisticaProductByCatalogKey(id)) {
    return modulisticaCategoryHref()
  }
  if (resolveCartaTermicaProductByCatalogKey(id)) {
    return cartaTermicaListingPath()
  }
  if (
    id.startsWith('AF-IHEALTH-') ||
    id.startsWith('AF-AMED-') ||
    id.startsWith('AF-DIAG-') ||
    id.startsWith('AF-SURG-') ||
    id.startsWith('AF-IVCANN-') ||
    id.startsWith('AF-SUT-') ||
    id.startsWith('AF-LAB-') ||
    id.startsWith('AF-WELL-') ||
    id.startsWith('AF-PROINSTR-') ||
    id.startsWith('gima-')
  ) {
    return lineaAstroMedicalCatalogPath()
  }
  if (
    id === '89931' ||
    id === '89930' ||
    id === '89929' ||
    id === '105192' ||
    id === '104546' ||
    id === '86181' ||
    id === '104541' ||
    id === '97983' ||
    id === '86492' ||
    id === '86494' ||
    id === '89950' ||
    id === '89955' ||
    id === '73755' ||
    id === '73757'
  ) {
    return sicurezzaCategoryHref()
  }
  return '/office-products?category=Cancelleria'
}
