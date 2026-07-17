import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  bucketMedicalProductsByMacro,
  fetchMedicalProductsFromSupabase,
} from '../api/medicalProductsSupabase'
import {
  bucketStaticMedicalProductsByMacro,
  getAllMedicalProducts,
  medicalMacroIds,
  type MedicalProduct,
} from '../data/medicalProducts'
import { isSupabaseConfigured } from '../lib/supabaseClient'

const STALE_MS = 10 * 60 * 1000

export type MedicalCatalogSource = 'supabase' | 'static'

export function useMedicalCatalog() {
  const staticByMacro = useMemo(() => bucketStaticMedicalProductsByMacro(), [])

  const useRemote = isSupabaseConfigured()

  const query = useQuery({
    queryKey: ['medical-products', 'supabase'],
    queryFn: async () => {
      try {
        return await fetchMedicalProductsFromSupabase()
      } catch {
        return [] as MedicalProduct[]
      }
    },
    enabled: useRemote,
    staleTime: STALE_MS,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const productsByMacro = useMemo(() => {
    const remote = query.data
    if (useRemote && remote && remote.length > 0) {
      return bucketMedicalProductsByMacro(remote, medicalMacroIds)
    }
    return staticByMacro
  }, [useRemote, query.data, staticByMacro])

  const totalCount = useMemo(() => {
    let n = 0
    productsByMacro.forEach((arr) => {
      n += arr.length
    })
    return n
  }, [productsByMacro])

  const source: MedicalCatalogSource = useMemo(() => {
    if (!useRemote) return 'static'
    if (query.data && query.data.length > 0) return 'supabase'
    return 'static'
  }, [useRemote, query.data])

  const staticTotalCount = useMemo(() => getAllMedicalProducts().length, [])

  const remoteFailedOrEmpty = useRemote && query.isFetched && (!query.data || query.data.length === 0)

  return {
    source,
    useRemote,
    isLoading: false,
    isError: false,
    error: undefined as Error | undefined,
    refetch: query.refetch,
    productsByMacro,
    totalCount,
    staticTotalCount,
    remoteFailedOrEmpty,
  }
}
