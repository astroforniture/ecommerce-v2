import type { OfficeProduct } from '../types/officeProduct'
import { buildCartucceTonerOfficeProducts } from '../data/cartucceTonerProducts'
import { cartucceTonerCategoryHref } from './officeCategories'
import {
  buildCasseDitronOfficeProducts,
  macchineUfficioCasseDitronListingPath,
} from '../data/casseDitronProducts'
import {
  buildDistruggidocumentiOfficeProducts,
  macchineUfficioDistruggiDocumentiListingPath,
} from '../data/distruggidocumentiProducts'
import {
  buildEtichettatriciOfficeProducts,
  macchineUfficioEtichettatriciListingPath,
} from '../data/macchineEtichettatrici'
import {
  buildPileOfficeProducts,
  cancelleriaPileListingPath,
} from '../data/pileProducts'
import { buildQuaderniOfficeProducts, cancelleriaQuaderniListingPath } from '../data/quaderniProducts'
import {
  cancelleriaShopperCartaPath,
  cancelleriaShopperPlasticaPath,
  resolveShopperProductByCatalogKey,
} from '../data/shopperCancelleria'
import {
  buildIHealthAstroMedicalOfficeProducts,
  iHealthCanonicalProductId,
  lineaAstroMedicalIHealthListingPath,
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
    id.startsWith('AF-PILE-') ||
    id.startsWith('AF-QUAD-') ||
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
  if (k.startsWith('AF-PILE-')) {
    return buildPileOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-QUAD-')) {
    return buildQuaderniOfficeProducts().find((p) => p.id === k || p.producerCode === k) ?? null
  }
  if (k.startsWith('AF-SHOPPER-')) {
    return resolveShopperProductByCatalogKey(k)
  }
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
  if (id.startsWith('AF-PILE-')) {
    return cancelleriaPileListingPath()
  }
  if (id.startsWith('AF-QUAD-')) {
    return cancelleriaQuaderniListingPath()
  }
  if (id.startsWith('AF-SHOPPER-CARTA-') || id === 'AF-SHOPPER-CARTA-MAINETTI') {
    return cancelleriaShopperCartaPath()
  }
  if (id.startsWith('AF-SHOPPER-PLASTICA-') || id === 'AF-SHOPPER-PLASTICA-MATERBI') {
    return cancelleriaShopperPlasticaPath()
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
    return lineaAstroMedicalIHealthListingPath()
  }
  return '/office-products?category=Cancelleria'
}
