import type { OfficeProduct } from '../types/officeProduct'
import { isStaticSyntheticOfficeProduct } from '../lib/syntheticOfficeCatalogProducts'
import {
  buildIHealthAstroMedicalOfficeProducts,
  isAstroMedicalProductCategory,
} from './iHealthAstroMedicalProducts'
import { buildLegacyAstroMedicalOfficeProducts } from './legacyAstroMedicalOfficeProducts'
import { buildProfessionalDiagnosticAstroMedicalOfficeProducts } from './professionalDiagnosticAstroMedicalProducts'
import { buildIvCannulaAstroMedicalOfficeProducts } from './ivCannulaAstroMedicalProducts'
import { buildEthiconSuturesAstroMedicalOfficeProducts } from './ethiconSuturesAstroMedicalProducts'
import { buildLaboratoryBagsAstroMedicalOfficeProducts } from './laboratoryBagsAstroMedicalProducts'
import { buildWellnessBagsScalesAstroMedicalOfficeProducts } from './wellnessBagsScalesAstroMedicalProducts'
import { buildProfessionalInstrumentationAstroMedicalOfficeProducts } from './professionalInstrumentationAstroMedicalProducts'
import { buildSurgicalInstrumentsAstroMedicalOfficeProducts } from './surgicalInstrumentsAstroMedicalProducts'
import { applyAstroMedicalSubcategoriesToCatalog } from '../lib/astroMedicalSubcategories'

/** Catalogo unificato linea Astro Medical (dedupe per `id`). */
export function buildLineaAstroMedicalAllOfficeProducts(): OfficeProduct[] {
  const byId = new Map<string, OfficeProduct>()
  for (const p of buildLegacyAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildIHealthAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildProfessionalDiagnosticAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildSurgicalInstrumentsAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildIvCannulaAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildEthiconSuturesAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildLaboratoryBagsAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildWellnessBagsScalesAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  for (const p of buildProfessionalInstrumentationAstroMedicalOfficeProducts()) byId.set(String(p.id), p)
  return applyAstroMedicalSubcategoriesToCatalog(
    Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }),
    ),
  )
}

/**
 * Unisce articoli già in catalogo office (DB) per la categoria linea con i prodotti integrati
 * (iHealth + seed medical + diagnostica professionale).
 * I prodotti sintetici statici (`gima-*`, prefissi `AF-*` legacy) hanno priorità su righe remote
 * con lo stesso id; inoltre si escludono righe remote con stesso titolo del listino integrato per
 * evitare duplicati con immagini errate dal DB.
 */
export function mergeLineaAstroMedicalCatalog(remoteNormalized: OfficeProduct[]): OfficeProduct[] {
  const fromRemote = remoteNormalized.filter((p) => isAstroMedicalProductCategory(p.category))
  const staticAll = buildLineaAstroMedicalAllOfficeProducts()
  const staticSyntheticNames = new Set(
    staticAll
      .filter((p) => isStaticSyntheticOfficeProduct(p))
      .map((p) => p.name.trim().toLowerCase()),
  )
  const byId = new Map<string, OfficeProduct>()
  for (const p of staticAll) {
    byId.set(String(p.id), p)
  }
  for (const p of fromRemote) {
    if (staticSyntheticNames.has(p.name.trim().toLowerCase())) {
      continue
    }
    const id = String(p.id)
    const existing = byId.get(id)
    if (existing && isStaticSyntheticOfficeProduct(existing)) {
      continue
    }
    byId.set(id, p)
  }
  return applyAstroMedicalSubcategoriesToCatalog(
    Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }),
    ),
  )
}
