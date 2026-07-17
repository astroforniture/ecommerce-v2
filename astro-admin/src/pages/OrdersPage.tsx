import { useEffect, useMemo, useState } from 'react'
import { OrderDetailsModal } from '../components/OrderDetailsModal'
import { supabase } from '../lib/supabaseClient'

type OrderRow = {
  id: string
  status: string
  total: number
  createdAt: string
  customer: string
}

const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const STATUS_OPTIONS = ['Da evadere', 'Evaso', 'Consegnato'] as const

function normalizeStatus(value: string) {
  const status = value.trim().toLowerCase()
  if (status === 'evaso') return 'Evaso'
  if (status === 'consegnato') return 'Consegnato'
  return 'Da evadere'
}

function statusClassName(status: string) {
  const normalized = normalizeStatus(status)
  if (normalized === 'Consegnato') return 'order-status order-status-consegnato'
  if (normalized === 'Evaso') return 'order-status order-status-evaso'
  return 'order-status order-status-da-evadere'
}

function asText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : 0
}

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [savingStatusByOrder, setSavingStatusByOrder] = useState<Record<string, boolean>>({})

  const openDetails = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDetailsOpen(true)
  }

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      setError('')
      const { data, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        setError("Impossibile caricare gli ordini dalla tabella 'orders'.")
        setOrders([])
        setIsLoading(false)
        return
      }

      const parsed = (data ?? []).map((row) => {
        const record = row as Record<string, unknown>
        return {
          id: asText(record.id),
          status: asText(record.status) || 'n/d',
          total: asNumber(record.total_amount) || asNumber(record.total),
          createdAt: asText(record.created_at),
          customer:
            asText(record.customer_name) ||
            asText(record.billing_name) ||
            asText(record.email) ||
            'Cliente',
        }
      })

      setOrders(parsed.filter((order) => order.id))
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return orders
    return orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized) ||
        order.status.toLowerCase().includes(normalized)
      )
    })
  }, [orders, query])

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    const previousOrder = orders.find((order) => order.id === orderId)
    if (!previousOrder) return

    const previousStatus = previousOrder.status
    const normalizedNextStatus = normalizeStatus(nextStatus)

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: normalizedNextStatus } : order,
      ),
    )
    setSavingStatusByOrder((current) => ({ ...current, [orderId]: true }))

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: normalizedNextStatus })
      .eq('id', orderId)

    if (updateError) {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status: previousStatus } : order,
        ),
      )
      setError(`Aggiornamento stato non riuscito: ${updateError.message}`)
      setSavingStatusByOrder((current) => ({ ...current, [orderId]: false }))
      return
    }

    window.dispatchEvent(new Event('orders-status-changed'))
    setSavingStatusByOrder((current) => ({ ...current, [orderId]: false }))
  }

  return (
    <section className="clients-page">
      <header className="page-header">
        <div>
          <h1>Ordini</h1>
          <p>Gestione ordini dal database Supabase.</p>
        </div>
      </header>

      <article className="card">
        <div className="clients-toolbar">
          <input
            type="search"
            value={query}
            placeholder="Cerca ordine, cliente o stato"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {error ? <p className="auth-error">{error}</p> : null}
        {isLoading ? <p className="table-empty">Caricamento ordini in corso...</p> : null}

        {!isLoading && (
          <div className="table-wrap">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID Ordine</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Stato</th>
                  <th>Totale</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openDetails(order.id)}
                      >
                        {order.id}
                      </button>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('it-IT') : 'n/d'}</td>
                    <td>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openDetails(order.id)}
                      >
                        {order.customer}
                      </button>
                    </td>
                    <td>{order.status}</td>
                    <td>{currency.format(order.total)}</td>
                    <td>
                      <button type="button" onClick={() => openDetails(order.id)}>
                        Dettaglio
                      </button>
                      <select
                        className={statusClassName(order.status)}
                        value={normalizeStatus(order.status)}
                        disabled={savingStatusByOrder[order.id] === true}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                        aria-label={`Stato ordine ${order.id}`}
                      >
                        {STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 ? (
          <p className="table-empty">Nessun ordine trovato.</p>
        ) : null}
      </article>

      <OrderDetailsModal
        isOpen={isDetailsOpen}
        orderId={selectedOrderId}
        onClose={() => setIsDetailsOpen(false)}
      />
    </section>
  )
}
