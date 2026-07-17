import { useEffect, useRef, useState } from 'react'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { CreditCard, Loader2 } from 'lucide-react'
import { createPaymentIntent, type CheckoutBillingPayload } from '../../api/createPaymentIntent'
import {
  eurosToStripeCents,
  getStripePromise,
  isStripeConfigured,
  isStripeLiveOnLocalHttp,
  stripeElementsAppearance,
  stripeLocalDevBlockMessage,
  getStripeFrontendConfigError,
} from '../../lib/stripe'

type StripePaymentFormProps = {
  amountIvato: number
  customerEmail: string
  checkoutBilling?: CheckoutBillingPayload
  /** true = fatturazione/termini incompleti (validato al click, non disabilita il pulsante). */
  disabled: boolean
  attemptedCheckout: boolean
  isSubmitting: boolean
  onAttempt: () => void
  onSubmittingChange: (value: boolean) => void
  onError: (message: string) => void
  onPaymentSucceeded: (paymentIntentId: string) => Promise<void>
}

function PaymentFormInner({
  amountIvato,
  customerEmail,
  disabled: billingIncomplete,
  attemptedCheckout,
  isSubmitting,
  onAttempt,
  onSubmittingChange,
  onError,
  onPaymentSucceeded,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [elementReady, setElementReady] = useState(false)
  const [elementLoadError, setElementLoadError] = useState('')
  const [payError, setPayError] = useState('')

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (import.meta.env.DEV) console.log('[Stripe] handlePay: start')

    onAttempt()
    setPayError('')
    onError('')

    if (billingIncomplete) {
      const msg =
        'Compila tutti i dati di fatturazione e accetta i Termini e Condizioni prima di pagare.'
      if (import.meta.env.DEV) console.warn('[Stripe] handlePay: billing incomplete')
      setPayError(msg)
      onError(msg)
      return
    }

    if (!stripe) {
      const msg = 'Stripe non è ancora pronto. Attendi qualche secondo e riprova.'
      if (import.meta.env.DEV) console.warn('[Stripe] handlePay: stripe null')
      setPayError(msg)
      onError(msg)
      return
    }

    if (!elements) {
      const msg = 'Modulo pagamento non pronto. Ricarica la pagina e riprova.'
      if (import.meta.env.DEV) console.warn('[Stripe] handlePay: elements null')
      setPayError(msg)
      onError(msg)
      return
    }

    onSubmittingChange(true)
    try {
      if (import.meta.env.DEV) console.log('[Stripe] handlePay: elements.submit()')
      const { error: submitError } = await elements.submit()
      if (submitError) {
        const msg = submitError.message ?? 'Dati di pagamento non validi.'
        if (import.meta.env.DEV) console.warn('[Stripe] elements.submit error:', submitError)
        setPayError(msg)
        onError(msg)
        return
      }

      if (import.meta.env.DEV) console.log('[Stripe] handlePay: confirmPayment()')
      const confirmParams: {
        return_url: string
        receipt_email?: string
      } = {
        return_url: `${window.location.origin}/checkout/success`,
      }
      if (customerEmail.includes('@')) {
        confirmParams.receipt_email = customerEmail
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams,
      })

      if (error) {
        if (import.meta.env.DEV) console.warn('[Stripe] confirmPayment error:', error)
        const msg = error.message ?? 'Pagamento non riuscito.'
        setPayError(msg)
        onError(msg)
        return
      }

      if (import.meta.env.DEV) console.log('[Stripe] confirmPayment result:', paymentIntent?.status)

      if (paymentIntent?.status === 'succeeded') {
        if (import.meta.env.DEV) console.log('[Stripe] handlePay: success', paymentIntent.id)
        await onPaymentSucceeded(paymentIntent.id)
        return
      }

      if (paymentIntent?.status === 'processing') {
        const msg = 'Pagamento in elaborazione. Riceverai conferma a breve.'
        setPayError(msg)
        onError(msg)
        return
      }

      if (paymentIntent?.status === 'requires_action') {
        const msg = 'Completa la verifica richiesta dalla banca (3D Secure) e riprova.'
        setPayError(msg)
        onError(msg)
        return
      }

      const msg = `Pagamento non completato (stato: ${paymentIntent?.status ?? 'sconosciuto'}).`
      setPayError(msg)
      onError(msg)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore imprevisto durante il pagamento.'
      if (import.meta.env.DEV) console.error('[Stripe] handlePay exception:', err)
      setPayError(msg)
      onError(msg)
    } finally {
      onSubmittingChange(false)
      if (import.meta.env.DEV) console.log('[Stripe] handlePay: end')
    }
  }

  const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
  const payButtonDisabled = isSubmitting || !elementReady || !stripe || !elements

  return (
    <form onSubmit={handlePay} className="space-y-4" noValidate>
      <PaymentElement
        options={{ layout: 'tabs' }}
        onReady={() => {
          setElementReady(true)
          setElementLoadError('')
          if (import.meta.env.DEV) console.log('[Stripe] PaymentElement ready')
        }}
        onLoadError={(event) => {
          setElementReady(false)
          setElementLoadError(
            event.error?.message ??
              'Impossibile caricare il modulo carta. Verifica chiavi Stripe test/live e HTTPS.',
          )
        }}
      />

      {!elementReady && !elementLoadError ? (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Caricamento modulo sicuro Stripe…
        </p>
      ) : null}

      {elementLoadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {elementLoadError}
        </p>
      ) : null}

      {payError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {payError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={payButtonDisabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Elaborazione pagamento…
          </>
        ) : (
          <>
            <CreditCard className="size-4" aria-hidden />
            Paga {eur.format(amountIvato)}
          </>
        )}
      </button>

      {attemptedCheckout && billingIncomplete ? (
        <p className="text-xs font-medium text-amber-800">
          Compila i dati di fatturazione e accetta i termini prima di pagare.
        </p>
      ) : null}

      <p className="text-xs text-slate-500">
        Pagamento protetto da Stripe. In modalità test usa la carta{' '}
        <code className="rounded bg-slate-100 px-1">4242 4242 4242 4242</code>.
      </p>
    </form>
  )
}

export function StripePaymentSection(props: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentError, setIntentError] = useState('')
  const [loadingIntent, setLoadingIntent] = useState(false)
  const intentRequestId = useRef(0)

  const stripePromise = getStripePromise()
  const amountCents = eurosToStripeCents(props.amountIvato)
  const liveOnHttp = isStripeLiveOnLocalHttp()
  const canPrepareIntent =
    isStripeConfigured() && !liveOnHttp && props.amountIvato > 0

  // PaymentIntent legato al totale — non ricrearlo ad ogni keystroke della fatturazione.
  useEffect(() => {
    if (!canPrepareIntent) {
      setClientSecret(null)
      setIntentError('')
      setLoadingIntent(false)
      return
    }

    const requestId = ++intentRequestId.current
    setLoadingIntent(true)
    setIntentError('')

    if (import.meta.env.DEV) {
      console.log('[Stripe] createPaymentIntent request', { amountCents })
    }

    void createPaymentIntent({
      amountCents,
      customerEmail: props.customerEmail,
      billing: props.checkoutBilling,
      metadata: { source: 'astro-forniture-checkout' },
    })
      .then((result) => {
        if (requestId !== intentRequestId.current) return
        if (!result.ok) {
          setClientSecret(null)
          setIntentError(result.error)
          if (import.meta.env.DEV) console.warn('[Stripe] createPaymentIntent failed:', result.error)
          return
        }
        if (import.meta.env.DEV) console.log('[Stripe] clientSecret received')
        setClientSecret(result.clientSecret)
      })
      .finally(() => {
        if (requestId === intentRequestId.current) setLoadingIntent(false)
      })
  }, [amountCents, props.customerEmail, canPrepareIntent])

  if (!isStripeConfigured()) {
    const configError = getStripeFrontendConfigError()
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {configError ?? 'Stripe non configurato.'}
      </div>
    )
  }

  if (liveOnHttp) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold text-amber-950">
          <CreditCard className="size-5" aria-hidden />
          Pagamento con carta non disponibile in locale (chiave LIVE)
        </h3>
        <p className="mt-2 text-sm text-amber-900">{stripeLocalDevBlockMessage()}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
        <CreditCard className="size-5 text-brand-700" aria-hidden />
        Pagamento con carta
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Inserisci i dati della carta nel modulo sicuro Stripe.
      </p>

      {loadingIntent ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Preparazione pagamento…
        </p>
      ) : null}

      {intentError ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {intentError}
        </p>
      ) : null}

      {!loadingIntent && !intentError && !clientSecret ? (
        <p className="mt-4 text-sm text-slate-500">
          Impossibile inizializzare il pagamento. Controlla la Edge Function e STRIPE_SECRET_KEY su
          Supabase.
        </p>
      ) : null}

      {clientSecret && stripePromise ? (
        <div className="mt-4 min-h-[12rem]">
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: stripeElementsAppearance,
              locale: 'it',
            }}
          >
            <PaymentFormInner {...props} />
          </Elements>
        </div>
      ) : null}
    </div>
  )
}
