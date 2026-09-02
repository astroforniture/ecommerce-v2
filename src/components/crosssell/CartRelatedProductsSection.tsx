import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchRelatedOfficeProductsForCart,
  OFFICE_CATALOG_DATA_REVISION,
} from '../../api/officeProductsSupabase'
import { useCart } from '../../context/CartContext'
import { getCrossSellForCart } from '../../data/crossSellCatalog'
import type { RelatedSeed } from '../../lib/relatedProductSuggestions'
import { RelatedProductsMiniGrid } from './RelatedProductsMiniGrid'

type CartRelatedProductsSectionProps = {
  className?: string
  limit?: number
  title?: string
  subtitle?: string
  /** Chiude drawer al click su scheda. */
  onNavigate?: () => void
  /** `cards` in pagina carrello; `list` nel drawer. */
  layout?: 'cards' | 'list'
}

function enrichCartSeeds(
  items: ReadonlyArray<{ id: string; name: string; sku: string }>,
): RelatedSeed[] {
  return items.map((item) => {
    const n = item.name.toLowerCase()
    let category = ''
    let subcategory: string | undefined
    if (/ditron|registratore|cassa/i.test(n) || item.id.includes('DITRON')) category = 'Casse'
    else if (/etichettatric/i.test(n)) {
      category = 'Macchine per Ufficio'
      subcategory = 'Etichettatrici'
    } else if (/toner|cartucc/i.test(n)) category = 'Cartucce & Toner'
    else if (/lettino|lenzuol|guanti|medic|siring|mascher/i.test(n)) category = 'Medicale'
    else if (/carta|rism/i.test(n) && /termic/i.test(n)) {
      category = 'Carta'
      subcategory = 'Carta Termica'
    } else if (/carta|rism|a4|a3|navigator|fabriano/i.test(n)) {
      category = 'Carta'
      subcategory = 'Formato Carta A4'
    } else if (/buste?\s*(forate|trasparent)|shopper/i.test(n)) {
      category = 'Archivio'
      subcategory = 'Buste Trasparenti'
    } else if (/distrugg/i.test(n)) {
      category = 'Macchine per Ufficio'
      subcategory = 'Distruggi Documenti'
    } else if (/comand|alberghi|ristorant/i.test(n)) {
      category = 'Modulistica'
      subcategory = 'Alberghi e Ristoranti'
    } else if (/penna|cucitric|evidenziat|fermagli|nastro|marcat/i.test(n)) {
      category = 'Cancelleria'
    } else if (/registratore|cartellin|archivio|classificator/i.test(n)) {
      category = 'Archivio'
    } else if (/agenda|planner|diario/i.test(n)) {
      category = 'Agende'
    }
    return {
      id: item.id,
      name: item.name,
      category,
      subcategory,
    }
  })
}

/**
 * Cross-selling carrello: correlati per categoria + keyword, con fallback catalogo statico.
 */
export function CartRelatedProductsSection({
  className = '',
  limit = 4,
  title = 'Potrebbero interessarti anche',
  subtitle = 'Completa il tuo acquisto',
  onNavigate,
  layout = 'cards',
}: CartRelatedProductsSectionProps) {
  const { items } = useCart()
  const cartProductIdSet = useMemo(() => new Set(items.map((i) => i.id)), [items])
  const seeds = useMemo(
    () => enrichCartSeeds(items.map((i) => ({ id: i.id, name: i.name, sku: i.sku }))),
    [items],
  )

  const seedKey = useMemo(
    () =>
      seeds
        .map((s) => `${s.id}:${s.name}:${s.category ?? ''}`)
        .join('|'),
    [seeds],
  )

  const relatedQuery = useQuery({
    queryKey: ['cart-related-products', OFFICE_CATALOG_DATA_REVISION, seedKey, limit],
    queryFn: () => fetchRelatedOfficeProductsForCart(seeds, cartProductIdSet, limit),
    enabled: items.length > 0 && seeds.length > 0,
    staleTime: 2 * 60 * 1000,
  })

  const fallbackProducts = useMemo(() => {
    const enriched = seeds.map((s) => ({
      id: s.id ?? '',
      name: s.name ?? '',
      category: s.category ?? '',
      subcategory: s.subcategory ?? undefined,
      relatedProductIds: undefined as string[] | undefined,
    }))
    return getCrossSellForCart(enriched, cartProductIdSet, limit)
  }, [seeds, cartProductIdSet, limit])

  const products = useMemo(() => {
    const dynamic = relatedQuery.data ?? []
    if (dynamic.length >= limit) return dynamic.slice(0, limit)
    const seen = new Set(dynamic.map((p) => p.id))
    const merged = [...dynamic]
    for (const p of fallbackProducts) {
      if (seen.has(p.id) || cartProductIdSet.has(p.id)) continue
      seen.add(p.id)
      merged.push(p)
      if (merged.length >= limit) break
    }
    return merged.slice(0, limit)
  }, [relatedQuery.data, fallbackProducts, cartProductIdSet, limit])

  if (items.length === 0 || products.length === 0) return null

  return (
    <RelatedProductsMiniGrid
      products={products}
      title={title}
      subtitle={subtitle}
      className={className}
      onNavigate={onNavigate}
      layout={layout}
    />
  )
}
