import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, ImageUp, Mail, PackagePlus, ReceiptText, UserRound, X } from 'lucide-react'
import { fetchOrdersForAdmin, type AdminOrder, updateOrderStatus } from '../api/ordersSupabase'
import { logoutAdmin } from '../lib/adminAuth'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

const STATUS_OPTIONS = [
  'In Elaborazione',
  'Pronto per il ritiro',
  'Spedito',
  'Completato',
  'Annullato',
] as const

export function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [pickupReadyQueue, setPickupReadyQueue] = useState<string[]>([])

  const ordersQuery = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrdersForAdmin,
    staleTime: 30_000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  const orders = ordersQuery.data ?? []
  const queuedSet = useMemo(() => new Set(pickupReadyQueue), [pickupReadyQueue])

  function handleStatusChange(order: AdminOrder, nextStatus: string) {
    updateMutation.mutate({ id: order.id, status: nextStatus })
    if (nextStatus === 'Pronto per il ritiro') {
      setPickupReadyQueue((prev) => (prev.includes(order.id) ? prev : [...prev, order.id]))
    }
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <ClipboardList className="size-6 text-brand-700" />
            Dashboard Gestionale
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-100"
            >
              <PackagePlus className="size-4" />
              Nuovo prodotto office
            </Link>
            <Link
              to="/admin/products/images"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <ImageUp className="size-4" />
              Immagini prodotti
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                window.location.href = '/admin/login'
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </header>

        {pickupReadyQueue.length > 0 ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="inline-flex items-center gap-2 font-semibold">
              <Mail className="size-4" />
              Email ritiro da inviare: {pickupReadyQueue.length}
            </p>
            <p className="mt-1 text-xs">
              Gli ordini segnati come "Pronto per il ritiro" sono in coda per notifica cliente.
            </p>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Totale</th>
                  <th className="px-4 py-3 font-semibold">Metodo Consegna</th>
                  <th className="px-4 py-3 font-semibold">Stato</th>
                  <th className="px-4 py-3 font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersQuery.isPending
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-4 py-3">
                          <div className="h-8 animate-pulse rounded bg-slate-100" aria-hidden />
                        </td>
                      </tr>
                    ))
                  : orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                        <td className="px-4 py-3 text-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            aria-label={`Apri dettaglio cliente ${order.customer}`}
                            className="font-semibold text-brand-700 hover:text-brand-900 hover:underline"
                          >
                            {order.customer}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{eur.format(order.total)}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {order.deliveryMethod.toLowerCase().includes('ritiro') ? 'Ritiro Mantova' : 'Spedizione'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Cambia stato ordine ${order.id}`}
                            defaultValue={order.status}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                            className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {queuedSet.has(order.id) ? (
                            <p className="mt-1 text-[11px] font-medium text-amber-700">
                              In coda per email ritiro
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            aria-label={`Apri dettagli fatturazione ordine ${order.id}`}
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Dettagli
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <ReceiptText className="size-5 text-brand-700" />
                Ordine {selectedOrder.id}
              </h2>
              <button
                type="button"
                aria-label="Chiudi modale dettaglio ordine"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-5">
              <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <UserRound className="size-4 text-slate-600" />
                  Dati di Fatturazione
                </h3>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Row label="Cliente" value={selectedOrder.customer} />
                  <Row label="Ragione Sociale" value={selectedOrder.billingCompanyName} />
                  <Row label="P.IVA" value={selectedOrder.billingVat} />
                  <Row label="Codice SDI" value={selectedOrder.billingSdi} />
                  <Row label="Codice Fiscale" value={selectedOrder.billingTaxCode} />
                  <Row label="Email" value={selectedOrder.billingEmail} />
                  <Row label="Telefono" value={selectedOrder.billingPhone} />
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
                </dl>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">Prodotti ordinati</h3>
                </div>
                {selectedOrder.items.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-500">Nessun dettaglio prodotto disponibile.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-sm">
                      <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Nome</th>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">SKU</th>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Variante</th>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Quantita</th>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Prezzo unitario</th>
                          <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Subtotale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={`${item.sku}-${idx}`}>
                            <td className="max-w-[280px] px-4 py-2.5 text-slate-900">
                              <p className="truncate whitespace-nowrap" title={item.name || 'Prodotto'}>
                                {item.name || 'Prodotto'}
                              </p>
                            </td>
                            <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{item.sku || '—'}</td>
                            <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                              {item.variant ?? '—'}
                            </td>
                            <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{eur.format(item.unitImponibile)}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                              {eur.format(item.unitImponibile * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Totale Imponibile</span>
                    <span className="font-semibold">{eur.format(selectedOrder.taxableTotal)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm text-slate-700">
                    <span>Spese di Spedizione</span>
                    <span className="font-semibold">{eur.format(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm text-slate-700">
                    <span>IVA (22%)</span>
                    <span className="font-semibold">{eur.format(selectedOrder.vatTotal)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5">
                    <span className="text-sm font-semibold text-brand-900">Totale Finale (IVA inclusa)</span>
                    <span className="text-lg font-bold text-brand-900">{eur.format(selectedOrder.total)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
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
