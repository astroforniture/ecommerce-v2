import { FunctionsHttpError } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'

/** Dati fatturazione/spedizione dal form carrello (guest o profilo parziale). Tutti opzionali. */
export type CheckoutBillingPayload = {
  billingName?: string
  customerType?: string
  addressStreet?: string
  addressCity?: string
  addressZip?: string
  addressProvince?: string
  billingPhone?: string
  deliveryMethod?: string
  isCompany?: boolean
  vatNumber?: string
  sdiCode?: string
  pec?: string
  checkoutMode?: 'guest' | 'logged_in'
}

export type CreatePaymentIntentInput = {
  amountCents: number
  currency?: 'eur'
  customerEmail?: string
  billing?: CheckoutBillingPayload
  metadata?: Record<string, string>
}

export type CreatePaymentIntentResult =
  | { ok: true; clientSecret: string; paymentIntentId: string }
  | { ok: false; error: string }

async function readFunctionErrorMessage(error: FunctionsHttpError): Promise<string | null> {
  try {
    const payload = (await error.context.json()) as { error?: string; message?: string } | null
    return payload?.error ?? payload?.message ?? null
  } catch {
    return null
  }
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}

/**
 * Crea un PaymentIntent tramite Supabase Edge Function `create-payment-intent`.
 * Non richiede profilo Supabase compilato: i dati arrivano dal carrello.
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato.' }
  }

  if (!Number.isFinite(input.amountCents) || input.amountCents < 50) {
    return { ok: false, error: 'Importo ordine non valido per Stripe (minimo 0,50 €).' }
  }

  const billing = input.billing ? stripUndefined(input.billing as Record<string, unknown>) : {}

  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: {
      amount: input.amountCents,
      currency: input.currency ?? 'eur',
      customerEmail: input.customerEmail?.trim() || undefined,
      billing,
      metadata: input.metadata ?? {},
    },
  })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const detail = await readFunctionErrorMessage(error)
      return {
        ok: false,
        error:
          detail ??
          'Edge Function create-payment-intent non disponibile o errore server (HTTP non OK).',
      }
    }
    return {
      ok: false,
      error: error.message || 'Impossibile avviare il pagamento Stripe.',
    }
  }

  const payload = data as {
    clientSecret?: string
    paymentIntentId?: string
    error?: string
  } | null

  if (payload?.error) {
    return { ok: false, error: payload.error }
  }

  if (!payload?.clientSecret) {
    return {
      ok: false,
      error:
        'Risposta pagamento non valida: clientSecret mancante. Verifica STRIPE_SECRET_KEY (sk_…) su Supabase.',
    }
  }

  return {
    ok: true,
    clientSecret: payload.clientSecret,
    paymentIntentId: payload.paymentIntentId ?? '',
  }
}
