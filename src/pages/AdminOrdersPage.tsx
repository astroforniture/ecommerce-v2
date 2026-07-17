import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ReceiptText, X } from 'lucide-react'
import { fetchOrdersForAdmin, type AdminOrder } from '../api/ordersSupabase'

const dtf = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' })
const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

function formatDate(value?: string): string {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : dtf.format(d)
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('completato')) return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
  if (s.includes('ricevuto')) return 'bg-sky-100 text-sky-800 ring-sky-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const query = useQuery({
    queryKey: ['admin-orders-table'],
    queryFn: fetchOrdersForAdmin,
    staleTime: 30_000,
  })

  const orders = query.data ?? []

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <ReceiptText className="size-6 text-brand-700" />
            Backoffice Ordini
          </h1>
          <Link
            to="/admin"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Vai al Pannello Admin
          </Link>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID Ordine</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Nome Cliente</th>
                  <th className="px-4 py-3 font-semibold">Metodo Consegna</th>
                  <th className="px-4 py-3 font-semibold">Stato Ordine</th>
                  <th className="px-4 py-3 font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {query.isPending
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-4 py-3">
                          <div className="h-8 animate-pulse rounded bg-slate-100" aria-hidden />
                        </td>
                      </tr>
                    ))
                  : orders.map((order) => {
                      const isPickup = order.deliveryMethod.toLowerCase().includes('ritiro')
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-4 text-slate-400" />
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-800">{order.customer}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                                isPickup
                                  ? 'bg-orange-100 text-orange-800 ring-orange-200'
                                  : 'bg-slate-100 text-slate-700 ring-slate-200'
                              }`}
                            >
                              {isPickup ? 'Ritiro a Mantova' : 'Spedizione'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusBadgeClass(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              aria-label={`Apri dettagli ordine ${order.id}`}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Dettagli
                            </button>
                          </td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder ? (
        <aside className="fixed inset-y-0 right-0 z-[120] w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Dati di Fatturazione</h2>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Chiudi dettagli fatturazione"
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Ordine ID" value={selectedOrder.id} />
            <Row label="Cliente" value={selectedOrder.customer} />
            <Row label="Ragione Sociale" value={selectedOrder.billingCompanyName} />
            <Row label="P.IVA" value={selectedOrder.billingVat} />
            <Row label="Codice SDI" value={selectedOrder.billingSdi} />
            <Row label="Codice Fiscale" value={selectedOrder.billingTaxCode} />
            <Row
              label="Indirizzo"
              value={[
                selectedOrder.billingStreet,
                selectedOrder.billingZip,
                selectedOrder.billingCity,
                selectedOrder.billingProvince,
              ]
                .filter(Boolean)
                .join(', ')}
            />
            <Row label="Email" value={selectedOrder.billingEmail} />
            <Row label="Telefono" value={selectedOrder.billingPhone} />
          </dl>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">Prodotti acquistati</h3>
            {selectedOrder.items.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">Nessun dettaglio prodotto disponibile.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <li key={`${item.sku}-${idx}`} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                    <p className="text-xs font-semibold text-slate-500">
                      {item.sku ? `SKU: ${item.sku}` : 'SKU non indicato'}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-900">{item.name || 'Prodotto'}</p>
                    {item.variant ? (
                      <p className="mt-0.5 text-xs font-medium text-brand-800">Variante: {item.variant}</p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-slate-700">
                      Quantita: {item.quantity} · Prezzo unitario: {eur.format(item.unitImponibile)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      ) : null}
    </main>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value && value.trim() !== '' ? value : '—'}</dd>
    </div>
  )
}
