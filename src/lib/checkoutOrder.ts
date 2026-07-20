import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartItem } from '../context/CartContext'
import { effectiveUnitPrice, lineImponible } from './quantityPricing'

export type CustomerType = 'privato' | 'azienda' | 'ente'

export type CheckoutOrderInput = {
  items: CartItem[]
  customerType: CustomerType
  firstName: string
  lastName: string
  companyName: string
  addressStreet: string
  addressCity: string
  addressZip: string
  addressProvince: string
  vatNumber: string
  sdiCode: string
  taxCode: string
  pec: string
  billingEmail: string
  billingPhone: string
  customerEmail: string
  deliveryLabel: string
  taxableTotal: number
  vatAmount: number
  shippingFee: number
  totalWithVat: number
  stripePaymentIntentId?: string
  wantsElectronicInvoice: boolean
  invoiceCompanyName: string
  invoiceVatNumber: string
  invoiceTaxCode: string
  invoiceSdiOrPec: string
  orderNotes: string
}

export function isBusinessCustomerType(customerType: CustomerType): boolean {
  return customerType !== 'privato'
}

export function resolveCheckoutBillingName(input: CheckoutOrderInput): string {
  if (isBusinessCustomerType(input.customerType)) {
    return input.companyName.trim()
  }
  return [input.firstName.trim(), input.lastName.trim()].filter(Boolean).join(' ')
}

export function buildOrderReference(rawId: string | null | undefined): string {
  const year = new Date().getFullYear()
  const clean = (rawId ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const tail = clean.slice(-6).padStart(6, '0')
  return `AF-${year}-${tail || '000000'}`
}

export async function persistCheckoutOrder(
  supabase: SupabaseClient,
  input: CheckoutOrderInput,
): Promise<{ ok: true; orderId: string; orderRef: string } | { ok: false; error: string }> {
  const isBusiness = isBusinessCustomerType(input.customerType)
  const billingName = resolveCheckoutBillingName(input)

  const orderPayload: Record<string, unknown> = {
    customer_name: billingName,
    customer_type: input.customerType,
    pec: input.pec.trim() || null,
    total_amount: Number(input.totalWithVat.toFixed(2)),
    taxable_total: Number(input.taxableTotal.toFixed(2)),
    vat_amount: Number(input.vatAmount.toFixed(2)),
    shipping_fee: Number(input.shippingFee.toFixed(2)),
    shipping_cost: Number(input.shippingFee.toFixed(2)),
    shipping_address: input.addressStreet.trim(),
    shipping_city: input.addressCity.trim(),
    shipping_zip: input.addressZip.trim(),
    delivery_method: input.deliveryLabel,
    status: input.stripePaymentIntentId ? 'Pagato' : 'Ricevuto',
    billing_company_name: isBusiness ? input.companyName.trim() : null,
    billing_name: billingName,
    billing_vat: isBusiness ? input.vatNumber.trim() : null,
    billing_sdi: isBusiness ? input.sdiCode.trim() : null,
    billing_tax_code: input.taxCode.trim() || null,
    billing_street: input.addressStreet.trim(),
    billing_zip: input.addressZip.trim(),
    billing_city: input.addressCity.trim(),
    billing_province: input.addressProvince.trim().toUpperCase(),
    billing_email: input.customerEmail || null,
    customer_email: input.customerEmail || null,
    billing_phone: input.billingPhone.trim() || null,
    is_company: isBusiness,
    items_json: input.items.map((i) => ({
      id: i.id,
      sku: i.sku,
      name: i.name,
      ...(i.variantLabel ? { variant: i.variantLabel } : {}),
      quantity: i.quantity,
      unit_imponibile: Number(
        effectiveUnitPrice(i.price, i.quantityPriceTiers, i.quantity).toFixed(2),
      ),
      row_imponibile: Number(
        lineImponible(i.price, i.quantityPriceTiers, i.quantity).toFixed(2),
      ),
    })),
    wants_electronic_invoice: input.wantsElectronicInvoice,
    e_invoice_company_name: input.wantsElectronicInvoice
      ? input.invoiceCompanyName.trim()
      : null,
    e_invoice_vat: input.wantsElectronicInvoice ? input.invoiceVatNumber.trim() : null,
    e_invoice_tax_code: input.wantsElectronicInvoice ? input.invoiceTaxCode.trim() : null,
    e_invoice_sdi_or_pec: input.wantsElectronicInvoice ? input.invoiceSdiOrPec.trim() : null,
    order_notes: input.orderNotes.trim() || null,
  }

  if (input.stripePaymentIntentId) {
    orderPayload.stripe_payment_intent_id = input.stripePaymentIntentId
    orderPayload.payment_method = 'stripe'
  }

  const { data, error } = await supabase.from('orders').insert(orderPayload).select('id').single()

  if (error) {
    return {
      ok: false,
      error: `Invio ordine non riuscito. Verifica i dati e riprova. Dettaglio: ${error.message}`,
    }
  }

  const orderId = (data as { id?: string } | null)?.id ?? ''
  if (!orderId) {
    return { ok: false, error: 'Ordine creato ma ID ordine non disponibile.' }
  }

  const orderItemsPayload = input.items.map((item) => ({
    order_id: orderId,
    product_name: item.name,
    quantity: item.quantity,
    price: Number(
      effectiveUnitPrice(item.price, item.quantityPriceTiers, item.quantity).toFixed(2),
    ),
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)
  if (itemsError) {
    const rollbackRes = await supabase.from('orders').delete().eq('id', orderId)
    const rollbackHint = rollbackRes.error
      ? ` Rollback fallito: ${rollbackRes.error.message}`
      : ' Ordine annullato automaticamente.'
    return {
      ok: false,
      error: `Salvataggio articoli fallito: ${itemsError.message}.${rollbackHint}`,
    }
  }

  return {
    ok: true,
    orderId,
    orderRef: buildOrderReference(orderId),
  }
}
