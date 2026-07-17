/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Chiave pubblica Stripe (pk_test_… / pk_live_…). */
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  /** Stesso token della riga in `office_product_insert_tokens` (migrazione 008). */
  readonly VITE_OFFICE_INSERT_TOKEN?: string
}
