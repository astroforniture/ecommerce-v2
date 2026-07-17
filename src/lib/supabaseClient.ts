import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

/** Evita risposte servite dalla cache HTTP del browser (listini, prodotti aggiornati). */
function fetchNoStore(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    cache: 'no-store',
  })
}

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  return Boolean(url && key)
}

/**
 * Distrugge il singleton client (nuova istanza al prossimo `getSupabaseBrowserClient`).
 * Utile dopo modifiche schema/dati se si vogliono evitare stati vecchi lato client.
 */
export function clearSupabaseBrowserClientCache(): void {
  browserClient = null
}

/** Client singleton per il browser; null se mancano le env. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!browserClient) {
    const hasWindow = typeof window !== 'undefined'
    browserClient = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'astro-forniture-auth',
          ...(hasWindow ? { storage: window.localStorage } : {}),
        },
        global: {
          fetch: fetchNoStore,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        },
      },
    )
  }
  return browserClient
}
