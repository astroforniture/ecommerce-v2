import { FunctionsHttpError } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import type { CheckoutOrderInput } from '../lib/checkoutOrder'
import {
  isBusinessCustomerType,
  resolveCheckoutBillingName,
} from '../lib/checkoutOrder'
import { effectiveUnitPrice, lineImponible } from '../lib/quantityPricing'
import { buildCartSessionItemsJson } from '../lib/cartSession'

export type PrepareCheckoutOrderResult =
  | { ok: true; orderId: string; orderRef: string; paymentIntentId: string }
  | { ok: false; error: string }

/**
 * Crea orders (pending) + order_items lato server e collega l'ID ordine
 * ai metadata/description del PaymentIntent Stripe.
 */
export async function prepareCheckoutOrder(input: {
  paymentIntentId: string
  checkout: CheckoutOrderInput
}): Promise<PrepareCheckoutOrderResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato.' }
  }

  const pi = input.paymentIntentId.trim()
  if (!pi.startsWith('pi_')) {
    return { ok: false, error: 'PaymentIntent non valido.' }
  }

  const c = input.checkout
  const isBusiness = isBusinessCustomerType(c.customerType)
  const billingName = resolveCheckoutBillingName(c)
  const email = c.customerEmail.trim()

  const billingStreet = c.addressStreet.trim()
  const billingCity = c.addressCity.trim()
  const billingZip = c.addressZip.trim()
  const billingProvince = c.addressProvince.trim().toUpperCase()
  const shippingStreetRaw = c.shippingStreet.trim() || billingStreet
  const careOf = c.shippingCareOf.trim()
  const shippingStreet = careOf ? `c/o ${careOf} — ${shippingStreetRaw}` : shippingStreetRaw

  const items = buildCartSessionItemsJson(c.items).map((item, idx) => {
    const src = c.items[idx]
    const unit = src
      ? Number(effectiveUnitPrice(src.price, src.quantityPriceTiers, src.quantity).toFixed(2))
      : item.unit_imponibile
    const row = src
      ? Number(lineImponible(src.price, src.quantityPriceTiers, src.quantity).toFixed(2))
      : item.row_imponibile
    return {
      ...item,
      unit_imponibile: unit,
      row_imponibile: row,
      total: row,
    }
  })

  const body = {
    paymentIntentId: pi,
    customerEmail: email || undefined,
    customerName: billingName,
    userId: c.userId?.trim() || undefined,
    taxableTotal: c.taxableTotal,
    vatAmount: c.vatAmount,
    shippingFee: c.shippingFee,
    totalWithVat: c.totalWithVat,
    items,
    order: {
      customer_name: billingName,
      customer_email: email || undefined,
      billing_name: billingName,
      billing_email: email || undefined,
      billing_street: billingStreet,
      billing_city: billingCity,
      billing_zip: billingZip,
      billing_province: billingProvince || undefined,
      billing_phone: c.billingPhone.trim() || undefined,
      billing_company_name: isBusiness ? c.companyName.trim() || undefined : undefined,
      billing_vat: isBusiness ? c.vatNumber.trim() || undefined : undefined,
      billing_sdi: isBusiness ? c.sdiCode.trim() || undefined : undefined,
      billing_tax_code: c.taxCode.trim() || undefined,
      shipping_address: shippingStreet,
      shipping_city: c.shippingCity.trim() || billingCity,
      shipping_zip: c.shippingZip.trim() || billingZip,
      shipping_province:
        c.shippingProvince.trim().toUpperCase() || billingProvince || undefined,
      delivery_method: c.deliveryLabel,
      total_amount: Number(c.totalWithVat.toFixed(2)),
      taxable_total: Number(c.taxableTotal.toFixed(2)),
      vat_amount: Number(c.vatAmount.toFixed(2)),
      shipping_cost: Number(c.shippingFee.toFixed(2)),
      customer_type: c.customerType,
      pec: c.pec.trim() || undefined,
      is_company: isBusiness,
      wants_electronic_invoice: true,
      e_invoice_company_name: c.invoiceCompanyName.trim() || undefined,
      e_invoice_vat: c.invoiceVatNumber.trim() || undefined,
      e_invoice_tax_code: c.invoiceTaxCode.trim() || undefined,
      e_invoice_sdi_or_pec: c.invoiceSdiOrPec.trim() || undefined,
      order_notes: c.orderNotes.trim() || undefined,
      user_id: c.userId?.trim() || undefined,
    },
  }

  const { data, error } = await supabase.functions.invoke('prepare-checkout-order', {
    body,
  })

  if (error) {
    let detail = error.message
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = (await error.context.json()) as { error?: string } | null
        detail = payload?.error ?? detail
      } catch {
        /* ignore */
      }
    }
    return { ok: false, error: detail || 'Preparazione ordine non riuscita.' }
  }

  const payload = data as {
    ok?: boolean
    error?: string
    orderId?: string
    orderRef?: string
    paymentIntentId?: string
  } | null

  if (payload?.error || !payload?.orderId || !payload?.orderRef) {
    return {
      ok: false,
      error: payload?.error || 'Risposta preparazione ordine non valida.',
    }
  }

  return {
    ok: true,
    orderId: payload.orderId,
    orderRef: payload.orderRef,
    paymentIntentId: payload.paymentIntentId || pi,
  }
}
