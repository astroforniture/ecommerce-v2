import { getSupabaseBrowserClient } from '../lib/supabaseClient'

export type AdminOrder = {
  id: string
  createdAt?: string
  customer: string
  total: number
  taxableTotal: number
  shippingFee: number
  vatTotal: number
  deliveryMethod: string
  status: string
  billingCompanyName?: string
  billingVat?: string
  billingSdi?: string
  billingTaxCode?: string
  billingStreet?: string
  billingZip?: string
  billingCity?: string
  billingProvince?: string
  billingEmail?: string
  billingPhone?: string
  wantsElectronicInvoice?: boolean
  eInvoiceCompanyName?: string
  eInvoiceVat?: string
  eInvoiceTaxCode?: string
  eInvoiceSdiOrPec?: string
  orderNotes?: string
  items: Array<{
    sku: string
    name: string
    variant?: string
    quantity: number
    unitImponibile: number
  }>
}

export type AdminOrderDetailItem = {
  id: string
  productId?: string
  sku: string
  name: string
  variant?: string
  quantity: number
  unitImponibile: number
  imageUrl?: string
}

export type AdminOrderDetail = AdminOrder & {
  detailedItems: AdminOrderDetailItem[]
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const n = Number.parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function asItems(value: unknown): AdminOrder['items'] {
  if (!Array.isArray(value)) return []
  return value
    .map((raw) => {
      const row = (raw ?? {}) as Record<string, unknown>
      return {
        sku: asString(row.sku),
        name: asString(row.name),
        variant:
          asString(row.variant) ||
          asString(row.variante) ||
          asString(row.colore) ||
          undefined,
        quantity: Math.max(0, Math.floor(asNumber(row.quantity))),
        unitImponibile: asNumber(row.unit_imponibile ?? row.unit_price ?? row.price),
      }
    })
    .filter((i) => i.name !== '' || i.sku !== '')
}

function asDetailItems(value: unknown): AdminOrderDetailItem[] {
  if (!Array.isArray(value)) return []
  return value
    .map((raw) => {
      const row = (raw ?? {}) as Record<string, unknown>
      const productRaw = (row.products ?? {}) as Record<string, unknown>
      const sku = asString(row.sku) || asString(productRaw.sku)
      const name = asString(row.name) || asString(productRaw.name)
      return {
        id: asString(row.id) || `${asString(row.order_id)}:${sku}:${name}`,
        productId: asString(row.product_id) || asString(productRaw.id) || undefined,
        sku,
        name,
        variant:
          asString(row.variant) ||
          asString(row.variante) ||
          asString(row.colore) ||
          undefined,
        quantity: Math.max(0, Math.floor(asNumber(row.quantity))),
        unitImponibile: asNumber(row.unit_imponibile ?? row.unit_price ?? row.price ?? productRaw.price),
        imageUrl: asString(row.image_url) || asString(productRaw.image_url) || undefined,
      }
    })
    .filter((i) => i.name !== '' || i.sku !== '')
}

function fromRow(row: Record<string, unknown>): AdminOrder {
  return {
    id: asString(row.id) || asString(row.order_id),
    createdAt: asString(row.created_at) || asString(row.order_date) || asString(row.createdAt),
    customer:
      asString(row.customer_name) ||
      asString(row.billing_name) ||
      asString(row.customer) ||
      'Cliente non indicato',
    total: asNumber(row.total_amount ?? row.total ?? row.grand_total),
    taxableTotal: asNumber(row.taxable_total ?? row.subtotal ?? row.imponibile),
    shippingFee: asNumber(row.shipping_fee ?? row.shipping_total),
    vatTotal: asNumber(row.vat_total ?? row.vat_amount ?? row.iva_total),
    deliveryMethod:
      asString(row.delivery_method) || asString(row.shipping_method) || 'Spedizione',
    status: asString(row.status) || 'In Elaborazione',
    billingCompanyName:
      asString(row.billing_company_name) || asString(row.billing_name) || asString(row.company_name),
    billingVat: asString(row.billing_vat) || asString(row.vat_number),
    billingSdi: asString(row.billing_sdi) || asString(row.sdi_code),
    billingTaxCode: asString(row.billing_tax_code) || asString(row.tax_code),
    billingStreet:
      asString(row.billing_street) || asString(row.billing_address_street) || asString(row.address_street),
    billingZip: asString(row.billing_zip) || asString(row.billing_cap) || asString(row.address_zip),
    billingCity: asString(row.billing_city) || asString(row.address_city),
    billingProvince: asString(row.billing_province) || asString(row.address_province),
    billingEmail: asString(row.billing_email) || asString(row.email),
    billingPhone: asString(row.billing_phone) || asString(row.phone),
    wantsElectronicInvoice: row.wants_electronic_invoice === true,
    eInvoiceCompanyName: asString(row.e_invoice_company_name),
    eInvoiceVat: asString(row.e_invoice_vat),
    eInvoiceTaxCode: asString(row.e_invoice_tax_code),
    eInvoiceSdiOrPec: asString(row.e_invoice_sdi_or_pec),
    orderNotes: asString(row.order_notes),
    items: asItems(row.items_json),
  }
}

export async function fetchOrdersForAdmin(): Promise<AdminOrder[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const result = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (result.error) throw result.error
  const rows = (result.data ?? []) as Record<string, unknown>[]
  return rows.map(fromRow).filter((o) => o.id !== '')
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) throw new Error('Supabase non configurato')

  const payload: Record<string, unknown> = { status }
  if (status.toLowerCase().includes('ritiro')) {
    payload.pickup_notification_pending = true
  }

  const res = await supabase.from('orders').update(payload).eq('id', orderId)
  if (res.error) throw res.error
}

export async function fetchOrderDetailForAdmin(orderId: string): Promise<AdminOrderDetail | null> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) throw new Error('Supabase non configurato')

  const cleanId = orderId.trim()
  if (!cleanId) return null

  const [orderRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('*').eq('id', cleanId).maybeSingle(),
    supabase
      .from('order_items')
      .select(
        'id, order_id, product_id, sku, name, variant, variante, colore, quantity, unit_imponibile, unit_price, price, image_url, products:products(id, sku, name, price, image_url)',
      )
      .eq('order_id', cleanId),
  ])

  if (orderRes.error) throw orderRes.error
  if (!orderRes.data) return null

  const order = fromRow(orderRes.data as Record<string, unknown>)
  const joinedItems = itemsRes.error
    ? []
    : asDetailItems((itemsRes.data ?? []) as unknown[])

  return {
    ...order,
    detailedItems: joinedItems.length ? joinedItems : order.items.map((i, idx) => ({
      id: `${order.id}:${idx}`,
      sku: i.sku,
      name: i.name,
      variant: i.variant,
      quantity: i.quantity,
      unitImponibile: i.unitImponibile,
    })),
  }
}
