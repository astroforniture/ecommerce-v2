/**
 * Raccolta catalogo completo per Google Merchant feed:
 * Supabase `public.products` + prodotti sintetici FE buyable.
 */

import { createClient } from '@supabase/supabase-js'
import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'
import { applyAgendeImmediateAvailability } from './agendeCatalog'
import { productCatalogKey } from './productRoutes'
import { SITE_ORIGIN } from './siteSeo'
import {
  mapOfficeProductToMerchantItem,
  normalizeMerchantOfferId,
  renderGoogleMerchantRssXml,
  stableMerchantIdHash,
  type GoogleMerchantFeedItem,
} from './googleMerchantFeed'
import { resolveMerchantImageLink } from './googleMerchantImages'
import { isSuppressedCatalogSku } from './suppressedCatalogSkus'
import { buildCartucceTonerOfficeProducts } from '../data/cartucceTonerProducts'
import { buildPileOfficeProducts } from '../data/pileProducts'
import { buildQuaderniOfficeProducts } from '../data/quaderniProducts'
import { buildAgendaAlfaGiornaliereOfficeProducts } from '../data/agendeAlfaGiornaliereProducts'
import { buildAgendaAlfaSettimanaliOfficeProducts } from '../data/agendeAlfaSettimanaliProducts'
import { buildAgendaDeltaGiornaliereOfficeProducts } from '../data/agendeDeltaGiornaliereProducts'
import { buildAgendaDeltaSettimanaliOfficeProducts } from '../data/agendeDeltaSettimanaliProducts'
import { buildAgendaTextGiornaliereOfficeProducts } from '../data/agendeTextGiornaliereProducts'
import { buildAgendaWpSettimanaliOfficeProducts } from '../data/agendeWeeklyPatternSettimanaliProducts'
import { buildAgendaPlanningOfficeProducts } from '../data/agendePlanningProducts'
import { buildDistruggidocumentiOfficeProducts } from '../data/distruggidocumentiProducts'
import { buildEtichettatriciOfficeProducts } from '../data/macchineEtichettatrici'
import { buildVerificaBanconoteOfficeProducts } from '../data/verificaBanconoteProducts'
import { buildPlastificatriciOfficeProducts } from '../data/plastificatriciProducts'
import {
  buildShopperCartaOfficeProducts,
  buildShopperPlasticaOfficeProducts,
} from '../data/shopperCancelleria'
import { buildSacbollOfficeProducts } from '../data/sacbollBuste'
import { buildIHealthAstroMedicalOfficeProducts } from '../data/iHealthAstroMedicalProducts'
import { buildLegacyAstroMedicalOfficeProducts } from '../data/legacyAstroMedicalOfficeProducts'
import { buildProfessionalDiagnosticAstroMedicalOfficeProducts } from '../data/professionalDiagnosticAstroMedicalProducts'
import { buildEthiconSuturesAstroMedicalOfficeProducts } from '../data/ethiconSuturesAstroMedicalProducts'
import { buildLaboratoryBagsAstroMedicalOfficeProducts } from '../data/laboratoryBagsAstroMedicalProducts'
import { buildWellnessBagsScalesAstroMedicalOfficeProducts } from '../data/wellnessBagsScalesAstroMedicalProducts'
import { buildProfessionalInstrumentationAstroMedicalOfficeProducts } from '../data/professionalInstrumentationAstroMedicalProducts'
import { buildIvCannulaAstroMedicalOfficeProducts } from '../data/ivCannulaAstroMedicalProducts'
import { buildSurgicalInstrumentsAstroMedicalOfficeProducts } from '../data/surgicalInstrumentsAstroMedicalProducts'

export type MerchantDbProductRow = {
  id: string | number
  sku?: string | null
  name?: string | null
  brand?: string | null
  price?: number | string | null
  image_url?: string | null
  description?: string | null
  category?: string | null
  subcategory?: string | null
  ean?: string | null
  stock?: number | string | null
  variants?: unknown
  subtitle?: string | null
}

export type BuildMerchantFeedOptions = {
  supabaseUrl?: string
  supabaseKey?: string
  origin?: string
}

const PAGE_SIZE = 1000

function parseVariants(raw: unknown): ProductVariantOption[] | undefined {
  if (!raw) return undefined
  let value = raw
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return undefined
    }
  }
  if (Array.isArray(value)) return value as ProductVariantOption[]
  if (value && typeof value === 'object' && Array.isArray((value as { options?: unknown }).options)) {
    return (value as { options: ProductVariantOption[] }).options
  }
  return undefined
}

function parseStock(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim()) {
    const n = Number.parseFloat(raw)
    return Number.isFinite(n) ? n : null
  }
  return null
}

export function mapDbRowToOfficeProduct(row: MerchantDbProductRow): {
  product: OfficeProduct
  stock: number | null
} {
  const rawPrice =
    typeof row.price === 'string' ? Number.parseFloat(row.price) : Number(row.price)
  const price = Number.isFinite(rawPrice) ? rawPrice : undefined
  const id = typeof row.id === 'string' ? row.id : String(row.id)
  const sku = (row.sku ?? '').trim()
  const variants = parseVariants(row.variants)
  const gallery =
    variants
      ?.map((v) => (v.image_url ?? '').trim())
      .filter(Boolean)
      .filter((u, i, arr) => arr.indexOf(u) === i) ?? undefined

  const product: OfficeProduct = {
    id,
    name: (row.name ?? '').trim(),
    brand: (row.brand ?? '').trim(),
    producerCode: sku || id,
    category: (row.category ?? '').trim(),
    subcategory: (row.subcategory ?? '').trim() || undefined,
    mainFeatures: {},
    imageUrl: (row.image_url ?? '').trim(),
    description: (row.description ?? '').trim() || undefined,
    subtitle: (row.subtitle ?? '').trim() || undefined,
    price,
    ean: (row.ean ?? '').trim() || undefined,
    variants,
    imageGalleryUrls: gallery?.length ? gallery : undefined,
  }

  return { product, stock: parseStock(row.stock) }
}

/** Prodotti FE-only buyable (esclude Casse Ditron quote-only). */
export function collectSyntheticOfficeProductsForMerchant(): OfficeProduct[] {
  const list: OfficeProduct[] = [
    ...buildDistruggidocumentiOfficeProducts(),
    ...buildEtichettatriciOfficeProducts(),
    ...buildVerificaBanconoteOfficeProducts(),
    ...buildPlastificatriciOfficeProducts(),
    ...buildCartucceTonerOfficeProducts(),
    ...buildPileOfficeProducts(),
    ...buildQuaderniOfficeProducts(),
    ...buildShopperCartaOfficeProducts(),
    ...buildShopperPlasticaOfficeProducts(),
    ...buildSacbollOfficeProducts(),
    ...buildAgendaAlfaGiornaliereOfficeProducts(),
    ...buildAgendaAlfaSettimanaliOfficeProducts(),
    ...buildAgendaDeltaGiornaliereOfficeProducts(),
    ...buildAgendaDeltaSettimanaliOfficeProducts(),
    ...buildAgendaTextGiornaliereOfficeProducts(),
    ...buildAgendaWpSettimanaliOfficeProducts(),
    ...buildAgendaPlanningOfficeProducts(),
    ...buildIHealthAstroMedicalOfficeProducts(),
    ...buildLegacyAstroMedicalOfficeProducts(),
    ...buildProfessionalDiagnosticAstroMedicalOfficeProducts(),
    ...buildSurgicalInstrumentsAstroMedicalOfficeProducts(),
    ...buildIvCannulaAstroMedicalOfficeProducts(),
    ...buildEthiconSuturesAstroMedicalOfficeProducts(),
    ...buildLaboratoryBagsAstroMedicalOfficeProducts(),
    ...buildWellnessBagsScalesAstroMedicalOfficeProducts(),
    ...buildProfessionalInstrumentationAstroMedicalOfficeProducts(),
  ].map(applyAgendeImmediateAvailability)

  return list
}

export async function fetchAllMerchantDbRows(opts: {
  supabaseUrl: string
  supabaseKey: string
}): Promise<MerchantDbProductRow[]> {
  const supabase = createClient(opts.supabaseUrl, opts.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const rows: MerchantDbProductRow[] = []
  let from = 0
  for (;;) {
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from('products')
      .select(
        'id,sku,name,brand,price,image_url,description,category,subcategory,ean,stock,variants,subtitle',
      )
      .order('id', { ascending: true })
      .range(from, to)

    if (error) {
      throw new Error(`[merchant-feed] products fetch failed: ${error.message}`)
    }
    const batch = (data ?? []) as MerchantDbProductRow[]
    rows.push(...batch)
    if (batch.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return rows
}

export async function buildGoogleMerchantFeedItems(
  opts: BuildMerchantFeedOptions = {},
): Promise<{ items: GoogleMerchantFeedItem[]; dbCount: number; syntheticCount: number }> {
  const origin = (opts.origin ?? SITE_ORIGIN).replace(/\/$/, '')
  const supabaseUrl = (opts.supabaseUrl ?? '').replace(/\/$/, '')
  const supabaseKey = opts.supabaseKey ?? ''

  const byKey = new Map<string, { product: OfficeProduct; stock: number | null }>()

  let dbCount = 0
  if (supabaseUrl && supabaseKey) {
    try {
      const rows = await fetchAllMerchantDbRows({ supabaseUrl, supabaseKey })
      dbCount = rows.length
      for (const row of rows) {
        if (isSuppressedCatalogSku(row.sku) || isSuppressedCatalogSku(row.id)) continue
        const mapped = mapDbRowToOfficeProduct(row)
        const key = productCatalogKey(mapped.product)
        if (!key) continue
        byKey.set(key, mapped)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[merchant-feed] DB products skipped: ${message}`)
    }
  } else {
    console.warn('[merchant-feed] Supabase URL/key mancanti: solo cataloghi sintetici')
  }

  const synthetics = collectSyntheticOfficeProductsForMerchant()
  let syntheticCount = 0
  for (const product of synthetics) {
    const key = productCatalogKey(product)
    if (!key) continue
    if (isSuppressedCatalogSku(product.producerCode) || isSuppressedCatalogSku(product.id)) continue
    // I sintetici hanno priorit? sui duplicati DB (immagini/prezzi FE-canonici).
    byKey.set(key, { product, stock: product.inStock === false ? 0 : null })
    syntheticCount += 1
  }

  const items: GoogleMerchantFeedItem[] = []
  const usedIds = new Set<string>()
  const entries = Array.from(byKey.values())

  // Risolvi image_link in parallelo (GIMA 404 ? fallback sul nostro dominio).
  const resolvedImages = await Promise.all(
    entries.map(({ product }) =>
      resolveMerchantImageLink(product.imageUrl ?? '', {
        origin,
        categoryHint: `${product.category ?? ''} ${product.subcategory ?? ''} ${product.name ?? ''}`,
      }),
    ),
  )

  for (let i = 0; i < entries.length; i++) {
    const { product, stock } = entries[i]!
    const item = mapOfficeProductToMerchantItem(product, {
      origin,
      stock,
      imageLink: resolvedImages[i],
    })
    if (!item) continue
    let offerId = item.id
    if (usedIds.has(offerId)) {
      const catalogKey = productCatalogKey(product)
      const suffix = stableMerchantIdHash(`${catalogKey}#${offerId}`).slice(0, 6)
      offerId = normalizeMerchantOfferId(`${offerId.slice(0, 43)}-${suffix}`)
      item.id = offerId
    }
    if (usedIds.has(offerId)) continue
    usedIds.add(offerId)
    items.push(item)
  }

  items.sort((a, b) => a.id.localeCompare(b.id, 'en'))
  return { items, dbCount, syntheticCount }
}

export async function buildGoogleMerchantFeedXml(
  opts: BuildMerchantFeedOptions = {},
): Promise<{ xml: string; items: GoogleMerchantFeedItem[]; dbCount: number; syntheticCount: number }> {
  const { items, dbCount, syntheticCount } = await buildGoogleMerchantFeedItems(opts)
  const origin = (opts.origin ?? SITE_ORIGIN).replace(/\/$/, '')
  const xml = renderGoogleMerchantRssXml(items, { link: origin })
  return { xml, items, dbCount, syntheticCount }
}

/** Risolve URL/key Supabase e origin da env Node (script / Vercel API). */
export function resolveMerchantFeedEnv(env: Record<string, string | undefined> = {}): BuildMerchantFeedOptions {
  const origin = (env.VITE_SITE_URL || SITE_ORIGIN).replace(/\/$/, '')
  const supabaseUrl = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').replace(/\/$/, '')
  // Preferisci la anon key (tabella products pubblica): la service role pu? mancare/essere invalida in locale.
  const supabaseKey =
    env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY || ''
  return { origin, supabaseUrl: supabaseUrl || undefined, supabaseKey: supabaseKey || undefined }
}
