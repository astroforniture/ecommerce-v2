import type { OfficeProduct } from '../types/officeProduct'
import { buildEtichettatriciOfficeProducts } from '../data/macchineEtichettatrici'
import { isExcludedFromOfficeSearchSuggestions } from './isOfficeProductAstroMedicalLine'
import { isGeneralOfficeShopCatalogProduct } from './isGeneralOfficeShopCatalogProduct'

function hasEtichettaToken(text: string): boolean {
  return /etichett/i.test(text)
}

/**
 * Log DEV: elenco nomi vetrina Supabase + confronto con etichettatrici statiche (solo frontend).
 * Chiamato da `fetchOfficeProductsShowcase` dopo ogni fetch remoto.
 */
export function debugLogVetrinaProdottiNomi(prodotti: readonly OfficeProduct[]): void {
  if (!import.meta.env.DEV) return
  if (typeof window === 'undefined') return

  const rows = prodotti.map((p, index) => ({
    '#': index + 1,
    id: p.id,
    nome: p.name,
    categoria: p.category,
    sottocategoria: p.subcategory ?? '',
    esclusoRicercaGlobale: isExcludedFromOfficeSearchSuggestions({
      id: p.id,
      producerCode: p.producerCode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      description: p.description,
      mainFeatures: p.mainFeatures ?? {},
    }),
    esclusoCatalogoShop: !isGeneralOfficeShopCatalogProduct(p),
    matchEtichett: hasEtichettaToken(`${p.name} ${p.description ?? ''}`),
  }))

  const staticEtichettatrici = buildEtichettatriciOfficeProducts()
  const staticRows = staticEtichettatrici.map((p, index) => ({
    '#': index + 1,
    id: p.id,
    nome: p.name,
    categoria: p.category,
    sottocategoria: p.subcategory ?? '',
    soloFrontend: true,
    esclusoRicercaGlobale: isExcludedFromOfficeSearchSuggestions(p),
  }))

  const conEtichettaInDb = rows.filter((r) => r.matchEtichett)

  console.group(
    `[DEBUG vetrina] Prodotti recuperati (Supabase): ${prodotti.length} righe — nomi completi`,
  )
  console.table(rows)
  console.log(
    'Nomi (lista):',
    prodotti.map((p) => p.name),
  )
  console.log(
    `Con "etichett*" in nome/descrizione (DB): ${conEtichettaInDb.length}`,
    conEtichettaInDb.map((r) => r.nome),
  )
  console.groupEnd()

  console.group(
    `[DEBUG vetrina] Etichettatrici statiche (frontend, NON in Supabase): ${staticRows.length}`,
  )
  console.table(staticRows)
  console.log(
    'Nomi statici:',
    staticEtichettatrici.map((p) => p.name),
  )
  console.groupEnd()

  if (conEtichettaInDb.length === 0) {
    console.warn(
      '[DEBUG vetrina] Nessuna etichettatrice nel database remoto. ' +
        'La ricerca Supabase con "eti" restituirà 0 righe grezze finché non inserisci prodotti ' +
        'o finché l’indice locale non include le etichettatrici statiche.',
    )
  }
}

/** Prodotti definiti solo in frontend ma ricercabili nell’autocomplete. */
export function getSearchableSyntheticOfficeProducts(): OfficeProduct[] {
  return [...buildEtichettatriciOfficeProducts()]
}
