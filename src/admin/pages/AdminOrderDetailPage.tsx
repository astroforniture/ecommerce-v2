import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays } from 'lucide-react'

import {
  fetchOrderDetailForAdmin,
  updateOrderStatus,
} from '../../api/ordersSupabase'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

const dtf = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const STATUS_OPTIONS = [
  'Ricevuto',
  'In Elaborazione',
  'Pronto per il ritiro',
  'Spedito',
  'Completato',
  'Annullato',
] as const

function formatDate(input?: string): string {
  if (!input) return '—'
  const d = new Date(input)
  return Number.isNaN(d.getTime()) ? '—' : dtf.format(d)
}

function statusVariant(status: string): 'default' | 'success' | 'warning' | 'brand' {
  const s = status.toLowerCase()
  if (s.includes('annull')) return 'warning'
  if (s.includes('complet') || s.includes('paid') || s.includes('pagat')) return 'success'
  if (s.includes('sped') || s.includes('shipped')) return 'brand'
  return 'default'
}

export function AdminOrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const orderId = id.trim()
  const queryClient = useQueryClient()

  const orderQuery = useQuery({
    queryKey: ['admin-order-detail', orderId],
    queryFn: () => fetchOrderDetailForAdmin(orderId),
    enabled: orderId.length > 0,
  })

  const updateMutation = useMutation({
    mutationFn: (nextStatus: string) => updateOrderStatus(orderId, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders-table'] })
    },
  })

  const order = orderQuery.data
  const productsTotal = useMemo(
    () => (order?.detailedItems ?? []).reduce((sum, item) => sum + item.unitImponibile * item.quantity, 0),
    [order?.detailedItems],
  )
  const shippingCost = useMemo(() => {
    const method = (order?.deliveryMethod ?? '').toLowerCase()
    if (method.includes('ritiro a mantova')) return 0
    return order?.shippingFee ?? 0
  }, [order?.deliveryMethod, order?.shippingFee])
  const totalOrder = order?.total ?? 0
  const taxableNoVat = totalOrder / 1.22
  const vatAmount = totalOrder - taxableNoVat

  if (!orderId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ID ordine mancante</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (orderQuery.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Caricamento ordine…</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (orderQuery.isError || !order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ordine non trovato</CardTitle>
          <CardDescription>
            {(orderQuery.error as Error)?.message ?? 'Nessun ordine trovato con questo ID.'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
            Torna agli ordini
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Ordine {order.id}</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
            <CalendarDays className="size-4 text-slate-400" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={statusVariant(order.status)}>{order.status || 'In Elaborazione'}</Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Stato ordine</CardTitle>
          <CardDescription>Modifica rapida stato e aggiornamento immediato su Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="text-sm font-medium text-slate-700" htmlFor="order-status">
            Stato
          </label>
          <select
            id="order-status"
            value={order.status}
            onChange={(e) => updateMutation.mutate(e.target.value)}
            disabled={updateMutation.isPending}
            className="mt-2 h-10 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {updateMutation.isError ? (
            <p className="mt-2 text-sm text-red-700">
              {(updateMutation.error as Error)?.message ?? 'Errore aggiornamento stato'}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli cliente</CardTitle>
          <CardDescription>
            {order.customer} · {order.billingEmail || 'email non disponibile'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Info label="Ragione Sociale" value={order.billingCompanyName} />
          <Info label="P.IVA" value={order.billingVat} />
          <Info label="Codice SDI" value={order.billingSdi} />
          <Info label="Codice Fiscale" value={order.billingTaxCode} />
          <Info
            label="Indirizzo"
            value={[order.billingStreet, order.billingZip, order.billingCity, order.billingProvince].filter(Boolean).join(', ')}
          />
          <Info label="Telefono" value={order.billingPhone} />
          <Info label="Consegna" value={order.deliveryMethod} />
          {order.wantsElectronicInvoice ? (
            <>
              <Info label="Fattura elettronica" value="Richiesta" />
              <Info label="Ragione sociale (fattura)" value={order.eInvoiceCompanyName} />
              <Info label="P.IVA (fattura)" value={order.eInvoiceVat} />
              <Info label="Codice fiscale (fattura)" value={order.eInvoiceTaxCode} />
              <Info label="SDI / PEC (fattura)" value={order.eInvoiceSdiOrPec} />
            </>
          ) : null}
          {order.orderNotes ? (
            <div className="sm:col-span-2">
              <Info label="Note ordine" value={order.orderNotes} />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riepilogo ordine</CardTitle>
          <CardDescription>Valori economici calcolati con IVA al 22%.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-slate-700">Costo Spedizione</span>
              <span className="font-semibold text-slate-900">{eur.format(shippingCost)}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-slate-700">Totale Imponibile (Senza IVA)</span>
              <span className="font-semibold text-slate-900">{eur.format(taxableNoVat)}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-slate-700">IVA (22%)</span>
              <span className="font-semibold text-slate-900">{eur.format(vatAmount)}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm">
              <span className="font-semibold text-brand-900">Totale Ordine (IVA inclusa)</span>
              <span className="text-base font-bold text-brand-900">{eur.format(totalOrder)}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prodotti ordinati</CardTitle>
          <CardDescription>
            {order.detailedItems.length} righe · Totale prodotti {eur.format(productsTotal)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Prodotto</th>
                  <th className="px-3 py-2.5 font-semibold">SKU</th>
                  <th className="px-3 py-2.5 font-semibold">Variante</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Qta</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Prezzo unit.</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Subtotale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.detailedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 text-slate-900">{item.name || 'Prodotto'}</td>
                    <td className="px-3 py-2.5 text-slate-700">{item.sku || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-700">{item.variant || '—'}</td>
                    <td className="px-3 py-2.5 text-right text-slate-900">{item.quantity}</td>
                    <td className="px-3 py-2.5 text-right text-slate-900">{eur.format(item.unitImponibile)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-900">
                      {eur.format(item.unitImponibile * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value?.trim() ? value : '—'}</p>
    </div>
  )
}
