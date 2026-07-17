import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export function CheckoutSuccessPage() {
  const location = useLocation() as { state?: { orderRef?: string } }
  const orderRef = location.state?.orderRef

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
          {orderRef ? (
            <p className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
              Numero ordine: {orderRef}
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
