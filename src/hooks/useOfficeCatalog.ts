import { useMemo } from 'react'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import {
  fetchOfficeProductsFromSupabase,
  OFFICE_CATALOG_DATA_REVISION,
} from '../api/officeProductsSupabase'
import type { OfficeProduct } from '../types/officeProduct'
import { isSupabaseConfigured } from '../lib/supabaseClient'

/**
 * Cache React Query per il catalogo: bilanciata tra velocità (navigazione / tornare indietro)
 * e aggiornamenti (focus finestra dopo staleTime).
 * Nota: app Vite + SPA — niente Server Components; TanStack Query è lo strumento adatto.
 */
export const OFFICE_CATALOG_STALE_MS = 0

export function officeCatalogQueryKey(
  categoryFromUrl?: string | null,
  searchFromUrl?: string | null,
) {
  return [
    'office-products',
    OFFICE_CATALOG_DATA_REVISION,
    'supabase',
    categoryFromUrl ?? '',
    searchFromUrl ?? '',
  ] as const
}

/** Prefetch al hover su link verso `/office-products` (e query string category/search). */
export function prefetchOfficeCatalogForHref(queryClient: QueryClient, href: string) {
  if (!isSupabaseConfigured()) return Promise.resolve()
  if (!href.includes('office-products')) return Promise.resolve()

  let pathname = href
  let search = ''
  const q = href.indexOf('?')
  if (q >= 0) {
    pathname = href.slice(0, q)
    search = href.slice(q + 1)
  }
  if (!pathname.includes('office-products')) return Promise.resolve()

  let searchQs = search
  const params = new URLSearchParams(searchQs)
  const category = params.get('category')
  const isMedicalCategory =
    (category ?? '').trim().toLowerCase() === 'linea specializzata astro medical'
  if (
    !isMedicalCategory &&
    !params.get('catalog') &&
    !category?.trim()
  ) {
    const merged = new URLSearchParams(searchQs)
    merged.set('catalog', 'ufficio')
    searchQs = merged.toString()
  }
  const prefetchParams = new URLSearchParams(searchQs)
  const prefetchCategory = prefetchParams.get('category')
  const rawSearch = prefetchParams.get('search') ?? prefetchParams.get('q') ?? ''

  return queryClient.prefetchQuery({
    queryKey: officeCatalogQueryKey(prefetchCategory, rawSearch),
    queryFn: () => fetchOfficeProductsFromSupabase(prefetchCategory, rawSearch || null),
    staleTime: OFFICE_CATALOG_STALE_MS,
  })
}

/** Catalogo da Supabase: `public.office_products` + `public.products` (vedi officeProductsSupabase). */
export type OfficeCatalogSource = 'supabase'

export function useOfficeCatalog(
  categoryFromUrl?: string | null,
  searchFromUrl?: string | null,
) {
  const useRemote = isSupabaseConfigured()

  const query = useQuery({
    queryKey: officeCatalogQueryKey(categoryFromUrl, searchFromUrl),
    queryFn: () => fetchOfficeProductsFromSupabase(categoryFromUrl, searchFromUrl),
    enabled: useRemote,
    staleTime: OFFICE_CATALOG_STALE_MS,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const products: OfficeProduct[] = useMemo(() => query.data ?? [], [query.data])
  const source: OfficeCatalogSource = 'supabase'

  return {
    source,
    useRemote,
    products,
    /** Con `enabled: false` la query non parte: senza `useRemote &&` lo spinner resterebbe attivo (RQ v5). */
    isLoading: useRemote && query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
