import { FunctionsHttpError } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'

export type FinalizeStripeOrderResult =
  | {
      ok: true
      orderId?: string
      orderRef?: string
      pending?: boolean
      paymentMethod?: string
      created?: boolean
      updated?: boolean
    }
  | { ok: false; error: string }

/**
 * Dopo redirect Stripe (Klarna / 3DS): verifica PI e crea/aggiorna ordine lato server.
 */
export async function finalizeStripeOrder(
  paymentIntentId: string,
): Promise<FinalizeStripeOrderResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato.' }
  }

  const pi = paymentIntentId.trim()
  if (!pi.startsWith('pi_')) {
    return { ok: false, error: 'PaymentIntent non valido.' }
  }

  const { data, error } = await supabase.functions.invoke('finalize-stripe-order', {
    body: { paymentIntentId: pi },
  })

  if (error) {
    let detail = error.message
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = (await error.context.json()) as { error?: string } | null
        detail = payload?.error ?? detail
      } catch {
        /* ignore */
      }
    }
    return { ok: false, error: detail || 'Finalizzazione ordine non riuscita.' }
  }

  const payload = data as {
    ok?: boolean
    error?: string
    orderId?: string
    orderRef?: string
    pending?: boolean
    paymentMethod?: string
    created?: boolean
    updated?: boolean
  } | null

  if (payload?.error) {
    return { ok: false, error: payload.error }
  }

  return {
    ok: true,
    orderId: payload?.orderId,
    orderRef: payload?.orderRef,
    pending: payload?.pending,
    paymentMethod: payload?.paymentMethod,
    created: payload?.created,
    updated: payload?.updated,
  }
}
