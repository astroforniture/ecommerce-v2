import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { finalizeStripeOrder } from '../api/finalizeStripeOrder'
import { useCart } from '../context/CartContext'
import {
  readPendingGa4Purchase,
  trackGoogleAnalyticsPurchase,
  type Ga4PurchaseEcommerce,
} from '../lib/googleAnalytics'

type CheckoutSuccessState = {
  orderRef?: string
  purchase?: Ga4PurchaseEcommerce
}

export function CheckoutSuccessPage() {
  const location = useLocation()
  const { clearCart } = useCart()
  const state = (location.state ?? {}) as CheckoutSuccessState
  const pendingPurchase = readPendingGa4Purchase()
  const order = state.purchase ?? pendingPurchase
  const search = new URLSearchParams(location.search)
  const paymentIntentId = search.get('payment_intent')?.trim() || ''
  const redirectStatus = search.get('redirect_status')?.trim() || ''
  const orderFromQuery = search.get('order')?.trim() || undefined

  const [orderRef, setOrderRef] = useState(
    state.orderRef ?? order?.transaction_id ?? orderFromQuery,
  )
  const [finalizeError, setFinalizeError] = useState('')
  const [finalizing, setFinalizing] = useState(Boolean(paymentIntentId && !orderRef))
  const finalizeOnce = useRef(false)

  useLayoutEffect(() => {
    const payload = state.purchase ?? readPendingGa4Purchase()
    if (!payload) return
    trackGoogleAnalyticsPurchase(payload)
  }, [state.purchase])

  useEffect(() => {
    if (!paymentIntentId || finalizeOnce.current) return
    if (redirectStatus && redirectStatus !== 'succeeded' && redirectStatus !== 'pending') {
      setFinalizing(false)
      setFinalizeError(`Pagamento non completato (stato: ${redirectStatus}).`)
      return
    }

    finalizeOnce.current = true
    setFinalizing(true)
    void finalizeStripeOrder(paymentIntentId)
      .then((result) => {
        if (!result.ok) {
          setFinalizeError(result.error)
          return
        }
        if (result.orderRef) setOrderRef(result.orderRef)
        clearCart()
      })
      .catch((err) => {
        setFinalizeError(err instanceof Error ? err.message : 'Errore finalizzazione ordine.')
      })
      .finally(() => setFinalizing(false))
  }, [paymentIntentId, redirectStatus, clearCart])

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
          <CheckCircle2 className="mx-auto size-12 text-emerald-600" aria-hidden />
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Ordine inviato con successo</h1>
          <p className="mt-2 text-slate-600">
            Grazie per il tuo ordine! Se hai scelto il ritiro in sede, ti aspettiamo in Largo di
            Porta Pradella, 2 a Mantova appena riceverai la mail di conferma.
          </p>
          {finalizing ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Conferma pagamento in corso…
            </p>
          ) : null}
          {orderRef ? (
            <p className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
              Numero ordine: {orderRef}
            </p>
          ) : null}
          {paymentIntentId ? (
            <p className="mt-2 text-xs text-slate-500">
              Riferimento pagamento Stripe: <code className="rounded bg-slate-100 px-1">{paymentIntentId}</code>
            </p>
          ) : null}
          {finalizeError ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {finalizeError} Se hai già pagato, l’ordine sarà comunque registrato a breve.
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/office-products?catalog=ufficio"
              className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Torna allo shopping
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
