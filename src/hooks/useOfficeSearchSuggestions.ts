import { useEffect, useMemo } from 'react'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import {
  fetchOfficeProductSearchSuggestions,
  fetchOfficeSearchCatalogIndex,
  OFFICE_CATALOG_DATA_REVISION,
  type OfficeSearchSuggestion,
} from '../api/officeProductsSupabase'
import {
  searchOfficeProductsClient,
  setOfficeSearchIndexFromProducts,
  shouldUseLocalSearchOnly,
} from '../lib/officeClientSearch'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { isLikelyCatalogConnectionError } from '../lib/catalogConnectionError'

const SUGGESTIONS_STALE_MS = 45_000
const INDEX_STALE_MS = 30 * 60_000

export function officeSearchIndexQueryKey() {
  return ['office-search-index', OFFICE_CATALOG_DATA_REVISION] as const
}

export function officeSearchSuggestionsQueryKey(query: string) {
  return ['office-search-suggestions', OFFICE_CATALOG_DATA_REVISION, query] as const
}

export function prefetchOfficeSearchIndex(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: officeSearchIndexQueryKey(),
    queryFn: fetchOfficeSearchCatalogIndex,
    staleTime: INDEX_STALE_MS,
  })
}

type UseOfficeSearchSuggestionsOptions = {
  /** Testo live nell'input (ricerca locale istantanea). */
  query: string
  /** Testo debounced (query Supabase). */
  debouncedQuery: string
  minChars?: number
  limit?: number
}

/**
 * Autocomplete header: indice locale (catalogo piccolo) o Supabase `.ilike` (catalogo grande).
 */
export function useOfficeSearchSuggestions({
  query,
  debouncedQuery,
  minChars = 2,
  limit = 8,
}: UseOfficeSearchSuggestionsOptions) {
  const trimmed = query.trim()
  const debouncedTrimmed = debouncedQuery.trim()
  const enabled = trimmed.length >= minChars

  const indexQuery = useQuery({
    queryKey: officeSearchIndexQueryKey(),
    queryFn: fetchOfficeSearchCatalogIndex,
    staleTime: INDEX_STALE_MS,
    gcTime: 60 * 60_000,
    retry: (failureCount, error) =>
      failureCount < 1 && !isLikelyCatalogConnectionError(error),
  })

  useEffect(() => {
    if (!indexQuery.data) return
    if (indexQuery.data.useLocalSearch) {
      setOfficeSearchIndexFromProducts(indexQuery.data.products, true)
    }
  }, [indexQuery.data])

  const useLocalSearch = useMemo(() => {
    if (!isSupabaseConfigured()) return true
    if (indexQuery.isError) return true
    if (indexQuery.data) return indexQuery.data.useLocalSearch
    return shouldUseLocalSearchOnly()
  }, [indexQuery.data, indexQuery.isError])

  const localSuggestions = useMemo((): OfficeSearchSuggestion[] => {
    if (!enabled || !useLocalSearch) return []
    return searchOfficeProductsClient(trimmed, limit)
  }, [enabled, useLocalSearch, trimmed, limit])

  const remoteQuery = useQuery({
    queryKey: officeSearchSuggestionsQueryKey(debouncedTrimmed),
    queryFn: () => fetchOfficeProductSearchSuggestions(debouncedTrimmed, limit),
    enabled:
      debouncedTrimmed.length >= minChars &&
      isSupabaseConfigured() &&
      !useLocalSearch &&
      indexQuery.isFetched &&
      !indexQuery.isError,
    staleTime: SUGGESTIONS_STALE_MS,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev,
    retry: (failureCount, error) =>
      failureCount < 1 && !isLikelyCatalogConnectionError(error),
  })

  const suggestions = useLocalSearch ? localSuggestions : (remoteQuery.data ?? [])
  const isFetching = useLocalSearch ? false : remoteQuery.isFetching

  const isCatalogConnectionError =
    isSupabaseConfigured() &&
    (indexQuery.isError ||
      (!useLocalSearch && remoteQuery.isError))

  return {
    suggestions,
    isFetching,
    isIndexLoading:
      indexQuery.isPending && !indexQuery.isFetched && !indexQuery.isError,
    isCatalogConnectionError,
    useLocalSearch,
    prefetchIndex: indexQuery.refetch,
  }
}
