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
  /** Indirizzo di fatturazione (profilo, non modificabile in checkout se loggato). */
  addressStreet: string
  addressCity: string
  addressZip: string
  addressProvince: string
  /** Indirizzo di consegna definitivo (profilo oppure override). */
  shippingStreet: string
  shippingCity: string
  shippingZip: string
  shippingProvince: string
  /** Presso / C.o. (opzionale). */
  shippingCareOf: string
  /** Note destinatario / consegna (opzionale). */
  shippingNotes: string
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

/** Rimuove undefined, null e stringhe vuote: PostgREST rifiuta colonne assenti / valori inutili. */
export function sanitizeOrderPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) return false
      if (typeof value === 'string' && value.trim() === '') return false
      return true
    }),
  )
}

function extractMissingColumn(message: string): string | null {
  const match = message.match(/Could not find the ['"]?([a-zA-Z0-9_]+)['"]? column/i)
  return match?.[1] ?? null
}

function buildOrdersInsertPayload(input: CheckoutOrderInput): Record<string, unknown> {
  const isBusiness = isBusinessCustomerType(input.customerType)
  const billingName = resolveCheckoutBillingName(input)
  const shippingAmount = Number(input.shippingFee.toFixed(2))
  const email = input.customerEmail.trim()

  const billingStreet = input.addressStreet.trim()
  const billingCity = input.addressCity.trim()
  const billingZip = input.addressZip.trim()
  const billingProvince = input.addressProvince.trim().toUpperCase()

  const shippingStreetRaw = input.shippingStreet.trim() || billingStreet
  const shippingCity = input.shippingCity.trim() || billingCity
  const shippingZip = input.shippingZip.trim() || billingZip
  const shippingProvince = input.shippingProvince.trim().toUpperCase() || billingProvince
  const careOf = input.shippingCareOf.trim()
  const shippingStreet = careOf
    ? `c/o ${careOf} — ${shippingStreetRaw}`
    : shippingStreetRaw

  const combinedNotes = [
    careOf ? `Presso/C.o.: ${careOf}` : '',
    input.orderNotes.trim(),
    input.shippingNotes.trim(),
  ]
    .filter(Boolean)
    .join('\n')

  // Fatturazione (billing_*) e spedizione (shipping_*) restano campi distinti.
  const payload: Record<string, unknown> = {
    customer_name: billingName,
    customer_email: email || undefined,
    total_amount: Number(input.totalWithVat.toFixed(2)),
    taxable_total: Number(input.taxableTotal.toFixed(2)),
    vat_amount: Number(input.vatAmount.toFixed(2)),
    shipping_cost: shippingAmount,
    shipping_address: shippingStreet,
    shipping_city: shippingCity,
    shipping_zip: shippingZip,
    shipping_province: shippingProvince || undefined,
    delivery_method: input.deliveryLabel,
    status: input.stripePaymentIntentId ? 'Pagato' : 'Ricevuto',
    billing_name: billingName,
    billing_street: billingStreet,
    billing_zip: billingZip,
    billing_city: billingCity,
    billing_province: billingProvince || undefined,
    billing_email: email || undefined,
    billing_phone: input.billingPhone.trim() || undefined,
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
    customer_type: input.customerType,
    pec: input.pec.trim() || undefined,
    billing_company_name: isBusiness ? input.companyName.trim() || undefined : undefined,
    billing_vat: isBusiness ? input.vatNumber.trim() || undefined : undefined,
    billing_sdi: isBusiness ? input.sdiCode.trim() || undefined : undefined,
    billing_tax_code: input.taxCode.trim() || undefined,
    wants_electronic_invoice: input.wantsElectronicInvoice || undefined,
    e_invoice_company_name: input.wantsElectronicInvoice
      ? input.invoiceCompanyName.trim() || undefined
      : undefined,
    e_invoice_vat: input.wantsElectronicInvoice
      ? input.invoiceVatNumber.trim() || undefined
      : undefined,
    e_invoice_tax_code: input.wantsElectronicInvoice
      ? input.invoiceTaxCode.trim() || undefined
      : undefined,
    e_invoice_sdi_or_pec: input.wantsElectronicInvoice
      ? input.invoiceSdiOrPec.trim() || undefined
      : undefined,
    order_notes: combinedNotes || undefined,
    stripe_payment_intent_id: input.stripePaymentIntentId?.trim() || undefined,
    payment_method: input.stripePaymentIntentId ? 'stripe' : undefined,
  }

  return sanitizeOrderPayload(payload)
}

export async function persistCheckoutOrder(
  supabase: SupabaseClient,
  input: CheckoutOrderInput,
): Promise<{ ok: true; orderId: string; orderRef: string } | { ok: false; error: string }> {
  let orderPayload = buildOrdersInsertPayload(input)
  console.log('[Supabase][/orders] payload sanitizzato:', {
    keys: Object.keys(orderPayload),
    payload: orderPayload,
  })

  let data: { id?: string } | null = null
  let error: { message: string; code?: string; details?: string; hint?: string } | null = null
  const strippedColumns: string[] = []

  // Se lo schema remoto non ha ancora alcune colonne opzionali, le togliamo e ritentiamo.
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const result = await supabase.from('orders').insert(orderPayload).select('id').single()
    data = (result.data as { id?: string } | null) ?? null
    error = result.error
    if (!error) break

    const missing = extractMissingColumn(error.message)
    if (!missing || !(missing in orderPayload)) break

    console.warn(
      `[Supabase][/orders] colonna assente nello schema, rimossa dal payload: ${missing}`,
      error,
    )
    const removedValue = orderPayload[missing]
    const { [missing]: _removed, ...rest } = orderPayload
    orderPayload = rest

    // Alias comuni: se manca shipping_cost ma esiste shipping_fee (o viceversa).
    if (missing === 'shipping_cost' && removedValue != null && !('shipping_fee' in orderPayload)) {
      orderPayload.shipping_fee = removedValue
    } else if (
      missing === 'shipping_fee' &&
      removedValue != null &&
      !('shipping_cost' in orderPayload)
    ) {
      orderPayload.shipping_cost = removedValue
    } else if (
      missing === 'shipping_province' &&
      removedValue != null &&
      typeof removedValue === 'string'
    ) {
      // Se manca shipping_province, la provincia resta in billing; non blocchiamo l'ordine.
    }

    strippedColumns.push(missing)
  }

  if (!error && strippedColumns.length > 0) {
    console.log('[Supabase][/orders] insert ok dopo rimozione colonne assenti:', strippedColumns)
  }

  if (error) {
    console.error('[Supabase][/orders] insert fallito — oggetto errore completo:', error)
    console.error('[Supabase][/orders] dettaglio:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      strippedColumns,
      payloadKeys: Object.keys(orderPayload),
      payloadSample: {
        customer_name: orderPayload.customer_name,
        customer_email: orderPayload.customer_email,
        total_amount: orderPayload.total_amount,
        stripe_payment_intent_id: orderPayload.stripe_payment_intent_id,
        wants_electronic_invoice: orderPayload.wants_electronic_invoice,
      },
    })
    return {
      ok: false,
      error: `Invio ordine non riuscito. Verifica i dati e riprova. Dettaglio: ${error.message}`,
    }
  }

  const orderId = (data as { id?: string } | null)?.id ?? ''
  if (!orderId) {
    console.error('[Supabase][/orders] insert ok ma id assente — data:', data)
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
    console.error('[Supabase][/order_items] insert fallito — oggetto errore completo:', itemsError)
    console.error('[Supabase][/order_items] dettaglio:', {
      message: itemsError.message,
      code: itemsError.code,
      details: itemsError.details,
      hint: itemsError.hint,
      orderId,
      itemsCount: orderItemsPayload.length,
    })
    const rollbackRes = await supabase.from('orders').delete().eq('id', orderId)
    if (rollbackRes.error) {
      console.error('[Supabase][/orders] rollback fallito:', rollbackRes.error)
    }
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
