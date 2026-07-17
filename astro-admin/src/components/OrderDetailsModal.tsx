import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

type OrderMeta = {
  customerName: string
  customerEmail: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCost: number
}

type LoadedOrder = {
  customer_email: string
  shipping_address: string
  shipping_city: string
  shipping_zip: string
}

type OrderDetailsModalProps = {
  isOpen: boolean
  orderId: string | null
  onClose: () => void
}

const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

function asText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  const quantity = asNumber(row.quantity)
  const price = asNumber(row.price)

  return {
    id: asText(row.id) || `item-${quantity}-${price}`,
    product_name: asText(row.product_name) || 'Prodotto senza nome',
    quantity,
    price,
    total: quantity * price,
  }
}

export function OrderDetailsModal({ isOpen, orderId, onClose }: OrderDetailsModalProps) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [orderMeta, setOrderMeta] = useState<OrderMeta | null>(null)
  const [order, setOrder] = useState<LoadedOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const resolvedOrderId = useMemo(() => (orderId ?? '').trim(), [orderId])

  useEffect(() => {
    if (!isOpen || !resolvedOrderId) {
      setItems([])
      setOrderMeta(null)
      setOrder(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    const loadItems = async () => {
      // Reset locale ad ogni apertura/cambio ordine per evitare dati stale.
      setItems([])
      setIsLoading(true)
      setError('')
      setOrderMeta(null)
      setOrder(null)
      console.log('[OrderDetailsModal] loading items for orderId:', resolvedOrderId)
      const [{ data, error: loadError }, { data: orderData, error: orderError }] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_id', resolvedOrderId),
        supabase
          .from('orders')
          .select(
            '*, customer_email, shipping_address, shipping_city, shipping_zip',
          )
          .eq('id', resolvedOrderId)
          .maybeSingle(),
      ])

      if (cancelled) return

      if (loadError) {
        setError(`Impossibile caricare il dettaglio ordine: ${loadError.message}`)
        setItems([])
        setIsLoading(false)
        return
      }

      console.log(data)
      if (orderError) {
        setError(`Impossibile caricare i dati cliente ordine: ${orderError.message}`)
      } else {
        const row = (orderData ?? {}) as Record<string, unknown>
        const profileLookupId = asText(row.user_id) || asText(row.profile_id)
        let profileRow: Record<string, unknown> | null = null
        if (profileLookupId) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select(
              'id, email, ragione_sociale, first_name, last_name, indirizzo, citta, cap, default_shipping_address, default_shipping_city, default_shipping_zip_code',
            )
            .eq('id', profileLookupId)
            .maybeSingle()
          profileRow = (profileData ?? null) as Record<string, unknown> | null
        }

        const customerName =
          asText(row.customer_name) ||
          asText(row.billing_name) ||
          asText(profileRow?.ragione_sociale) ||
          `${asText(profileRow?.first_name)} ${asText(profileRow?.last_name)}`.trim() ||
          'Cliente'
        const customerEmail =
          asText(row.customer_email) || asText(row.email) || asText(profileRow?.email)
        const shippingAddress =
          asText(row.shipping_address) ||
          asText(row.address_street) ||
          asText(row.billing_street) ||
          asText(profileRow?.default_shipping_address) ||
          asText(profileRow?.indirizzo)
        const shippingCity =
          asText(row.shipping_city) ||
          asText(row.address_city) ||
          asText(row.billing_city) ||
          asText(profileRow?.default_shipping_city) ||
          asText(profileRow?.citta)
        const shippingZip =
          asText(row.shipping_zip) ||
          asText(row.address_zip) ||
          asText(row.billing_zip) ||
          asText(profileRow?.default_shipping_zip_code) ||
          asText(profileRow?.cap)
        const shippingCost = asNumber(row.shipping_cost ?? row.shipping_fee ?? row.shipping_total)
        const loadedOrder: LoadedOrder = {
          customer_email: customerEmail,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_zip: shippingZip,
        }
        console.log('Dati ordine caricati:', loadedOrder)
        setOrder(loadedOrder)

        setOrderMeta({
          customerName,
          customerEmail,
          shippingAddress,
          shippingCity,
          shippingZip,
          shippingCost,
        })
      }

      const parsed = (data ?? []).map((row) => mapOrderItem(row as Record<string, unknown>))
      console.log('[OrderDetailsModal] order_items rows:', data ?? [])
      console.log('[OrderDetailsModal] parsed items length:', parsed.length)
      setItems(parsed)
      setIsLoading(false)
    }

    loadItems()

    return () => {
      cancelled = true
    }
  }, [isOpen, resolvedOrderId])

  const total = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items])
  const vat = useMemo(() => Math.round(total * 0.22 * 100) / 100, [total])
  const shipping = orderMeta?.shippingCost ?? 0
  const grandTotal = useMemo(
    () => Math.round((total + vat + shipping) * 100) / 100,
    [shipping, total, vat],
  )

  if (!isOpen || !resolvedOrderId) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={`Dettaglio ordine ${resolvedOrderId}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2>Dettaglio ordine</h2>
            <p>{resolvedOrderId}</p>
          </div>
          <button type="button" onClick={onClose}>
            Chiudi
          </button>
        </header>

        {error ? <p className="auth-error">{error}</p> : null}
        {isLoading ? <p className="table-empty">Caricamento articoli in corso...</p> : null}

        {!isLoading && !error && (
          <>
            <section className="order-customer-box">
              <p>
                <strong>Cliente:</strong> {orderMeta?.customerName || 'n/d'}
              </p>
              <p>
                <strong>Email:</strong> {order?.customer_email || 'Email non presente'}
              </p>
              <p>
                <strong>Spedizione:</strong>{' '}
                {order
                  ? `${order.shipping_address || ''} ${order.shipping_city || ''} (${order.shipping_zip || ''})`
                      .replace(/\s+\(\)$/, '')
                      .trim() || 'n/d'
                  : 'n/d'}
              </p>
            </section>

            {items.length > 0 ? (
              <div className="table-wrap">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Nome Prodotto</th>
                      <th>Quantita</th>
                      <th>Prezzo Unitario</th>
                      <th>Totale parziale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{currency.format(item.price)}</td>
                        <td>{currency.format(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="table-empty">Nessun articolo associato a questo ordine.</p>
            )}

            <section className="order-summary">
              <p>
                <span>Totale Imponibile (Senza IVA)</span>
                <strong>{currency.format(total)}</strong>
              </p>
              <p>
                <span>IVA (22%)</span>
                <strong>{currency.format(vat)}</strong>
              </p>
              <p>
                <span>Spedizione</span>
                <strong>{currency.format(shipping)}</strong>
              </p>
              <p className="order-summary-grand">
                <span>Totale Ordine</span>
                <strong>{currency.format(grandTotal)}</strong>
              </p>
            </section>
          </>
        )}
      </section>
    </div>
  )
}
