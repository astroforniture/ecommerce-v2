import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

/** Chiave pubblica Stripe (pk_test_… o pk_live_…). */
export function getStripePublishableKey(): string | undefined {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
  if (!key) return undefined
  if (key.startsWith('sk_')) {
    if (import.meta.env.DEV) {
      console.error(
        'VITE_STRIPE_PUBLISHABLE_KEY contiene una Secret key (sk_…). ' +
          'Usa la Publishable key (pk_test_… o pk_live_…) in .env.local.',
      )
    }
    return undefined
  }
  if (!key.startsWith('pk_')) return undefined
  return key
}

/** Modalità chiave pubblica senza esporre il valore completo. */
export function getStripePublishableKeyMode(): 'test' | 'live' | 'unknown' | 'missing' {
  const key = getStripePublishableKey()
  if (!key) return 'missing'
  if (key.startsWith('pk_test_')) return 'test'
  if (key.startsWith('pk_live_')) return 'live'
  return 'unknown'
}

export function logStripeKeyDiagnostics(context: string): void {
  const mode = getStripePublishableKeyMode()
  const key = getStripePublishableKey()
  console.log(`[Stripe][${context}] chiave frontend`, {
    mode,
    prefix: key ? `${key.slice(0, 12)}…` : null,
    expected:
      mode === 'test'
        ? 'Backend Supabase deve usare STRIPE_SECRET_KEY=sk_test_…'
        : mode === 'live'
          ? 'Backend Supabase deve usare STRIPE_SECRET_KEY=sk_live_…'
          : 'Configura VITE_STRIPE_PUBLISHABLE_KEY (pk_test_… o pk_live_…)',
    note:
      'Carta 4242 funziona solo con chiavi TEST (pk_test_ + sk_test_). Con pk_live_/sk_live_ Stripe risponde 400.',
  })
}

/** Serializza errori Stripe / Supabase / generici per la console. */
export function logCheckoutError(context: string, error: unknown): void {
  console.error(`[Checkout][${context}] errore grezzo:`, error)
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    console.error(`[Checkout][${context}] dettaglio:`, {
      type: e.type,
      code: e.code,
      decline_code: e.decline_code,
      message: e.message,
      status: e.status,
      statusCode: e.statusCode,
      requestId: e.requestId ?? e.request_id,
      payment_intent: e.payment_intent,
      paymentIntent: e.paymentIntent,
      source: e.source,
      details: e.details,
      hint: e.hint,
      name: e.name,
      stack: e.stack,
      context: e.context,
      raw: (() => {
        try {
          return JSON.parse(JSON.stringify(error))
        } catch {
          return String(error)
        }
      })(),
    })
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripePublishableKey())
}

/** Stripe live (pk_live) richiede HTTPS: su localhost HTTP il PaymentElement non si carica. */
export function isStripeLiveOnLocalHttp(): boolean {
  if (typeof window === 'undefined') return false
  const key = getStripePublishableKey()
  if (!key?.startsWith('pk_live_')) return false
  const { protocol, hostname } = window.location
  if (protocol !== 'http:') return false
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

export function stripeLocalDevBlockMessage(): string {
  return (
    'Stai usando una chiave Stripe LIVE (pk_live_…) su http://localhost. ' +
    'Stripe non mostra i campi carta in HTTP con chiavi live. ' +
    'Per testare in locale usa pk_test_… in .env.local e sk_test_… su Supabase, oppure avvia Vite con HTTPS.'
  )
}

/** Messaggio se la env contiene una chiave non valida per il frontend. */
export function getStripeFrontendConfigError(): string | null {
  const raw = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
  if (!raw) {
    return 'Aggiungi VITE_STRIPE_PUBLISHABLE_KEY (pk_test_… o pk_live_…) in .env.local e riavvia npm run dev.'
  }
  if (raw.startsWith('sk_')) {
    return (
      'VITE_STRIPE_PUBLISHABLE_KEY contiene una Secret key (sk_…). ' +
      'Nel frontend va solo la Publishable key (pk_test_…). La sk_test_… resta su Supabase secrets.'
    )
  }
  if (!raw.startsWith('pk_')) {
    return 'VITE_STRIPE_PUBLISHABLE_KEY non valida: deve iniziare con pk_test_ o pk_live_.'
  }
  return null
}

export function getStripePromise(): Promise<Stripe | null> | null {
  const key = getStripePublishableKey()
  if (!key) return null
  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

/** Importo in centesimi EUR (Stripe richiede interi). */
export function eurosToStripeCents(amountIvato: number): number {
  return Math.max(50, Math.round(roundMoney(amountIvato) * 100))
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export const stripeElementsAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#b91c1c',
    colorBackground: '#ffffff',
    colorText: '#0f172a',
    colorDanger: '#b91c1c',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    borderRadius: '8px',
    spacingUnit: '3px',
  },
  rules: {
    '.Input': {
      border: '1px solid #cbd5e1',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #b91c1c',
      boxShadow: '0 0 0 2px rgba(185, 28, 28, 0.15)',
    },
    '.Label': {
      fontWeight: '500',
    },
  },
}
