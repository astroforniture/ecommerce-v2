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
  /** Ordine salvato prima del redirect Stripe (Klarna / async). */
  pendingPayment?: boolean
  /** auth.users.id / profiles.id quando l'utente è loggato. */
  userId?: string
  /** Es. stripe | klarna */
  paymentMethod?: string
  /** Campi e-invoice: derivati dai dati di fatturazione (sempre richiesti a DB). */
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

function resolveOrderStatus(input: CheckoutOrderInput): string {
  if (!input.stripePaymentIntentId) return 'Ricevuto'
  if (input.pendingPayment) return 'pending'
  return 'Pagato'
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

  const paymentMethod =
    input.paymentMethod?.trim() ||
    (input.stripePaymentIntentId ? 'stripe' : undefined)

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
    status: resolveOrderStatus(input),
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
    wants_electronic_invoice: true,
    e_invoice_company_name: input.invoiceCompanyName.trim() || undefined,
    e_invoice_vat: input.invoiceVatNumber.trim() || undefined,
    e_invoice_tax_code: input.invoiceTaxCode.trim() || undefined,
    e_invoice_sdi_or_pec: input.invoiceSdiOrPec.trim() || undefined,
    order_notes: combinedNotes || undefined,
    stripe_payment_intent_id: input.stripePaymentIntentId?.trim() || undefined,
    payment_method: paymentMethod,
    user_id: input.userId?.trim() || undefined,
  }

  return sanitizeOrderPayload(payload)
}

function buildOrderItemsPayload(orderId: string, items: CartItem[]) {
  return items.map((item) => {
    const unit = Number(
      effectiveUnitPrice(item.price, item.quantityPriceTiers, item.quantity).toFixed(2),
    )
    const total = Number(
      lineImponible(item.price, item.quantityPriceTiers, item.quantity).toFixed(2),
    )
    return {
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      name: item.name,
      sku: item.sku,
      variant: item.variantLabel || null,
      quantity: item.quantity,
      price: unit,
      total,
      unit_imponibile: unit,
      unit_price: unit,
      image_url: item.imageUrl || null,
    }
  })
}

async function insertOrderItemsWithFallback(
  supabase: SupabaseClient,
  orderId: string,
  items: CartItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  let rows: Record<string, unknown>[] = buildOrderItemsPayload(orderId, items)

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { error } = await supabase.from('order_items').insert(rows)
    if (!error) return { ok: true }

    const missing = extractMissingColumn(error.message)
    if (!missing) {
      return { ok: false, error: error.message }
    }
    rows = rows.map((row) => {
      const { [missing]: _removed, ...rest } = row
      return rest
    })
  }

  return { ok: false, error: 'Salvataggio articoli fallito dopo retry colonne.' }
}

async function replaceOrderItems(
  supabase: SupabaseClient,
  orderId: string,
  items: CartItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { count } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', orderId)

  if ((count ?? 0) > 0) return { ok: true }
  return insertOrderItemsWithFallback(supabase, orderId, items)
}

async function insertOrderWithColumnFallback(
  supabase: SupabaseClient,
  input: CheckoutOrderInput,
): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  let orderPayload = buildOrdersInsertPayload(input)
  console.log('[Supabase][/orders] payload sanitizzato:', {
    keys: Object.keys(orderPayload),
    payload: orderPayload,
  })

  let data: { id?: string } | null = null
  let error: { message: string; code?: string; details?: string; hint?: string } | null = null
  const strippedColumns: string[] = []

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

    if (missing === 'shipping_cost' && removedValue != null && !('shipping_fee' in orderPayload)) {
      orderPayload.shipping_fee = removedValue
    } else if (
      missing === 'shipping_fee' &&
      removedValue != null &&
      !('shipping_cost' in orderPayload)
    ) {
      orderPayload.shipping_cost = removedValue
    }

    strippedColumns.push(missing)
  }

  if (!error && strippedColumns.length > 0) {
    console.log('[Supabase][/orders] insert ok dopo rimozione colonne assenti:', strippedColumns)
  }

  if (error) {
    // Ordine già creato (es. preventivo pre-Klarna): non trattarlo come fallimento bloccante.
    if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
      console.warn('[Supabase][/orders] insert duplicato PI — ordine già presente:', error.message)
      return {
        ok: false,
        error: `Ordine già presente per questo pagamento. Dettaglio: ${error.message}`,
      }
    }
    console.error('[Supabase][/orders] insert fallito — oggetto errore completo:', error)
    return {
      ok: false,
      error: `Invio ordine non riuscito. Verifica i dati e riprova. Dettaglio: ${error.message}`,
    }
  }

  const orderId = data?.id ?? ''
  if (!orderId) {
    return { ok: false, error: 'Ordine creato ma ID ordine non disponibile.' }
  }
  return { ok: true, orderId }
}

/**
 * Salva (o aggiorna) l'ordine checkout.
 * Se esiste già un ordine con lo stesso stripe_payment_intent_id, aggiorna lo stato
 * (es. da "In attesa di pagamento" → "Pagato") senza duplicare.
 */
export async function persistCheckoutOrder(
  supabase: SupabaseClient,
  input: CheckoutOrderInput,
): Promise<{ ok: true; orderId: string; orderRef: string } | { ok: false; error: string }> {
  const piId = input.stripePaymentIntentId?.trim()

  if (piId) {
    const { data: existing, error: lookupError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('stripe_payment_intent_id', piId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lookupError) {
      console.warn('[Supabase][/orders] lookup by PI:', lookupError.message)
    }

    if (existing?.id) {
      const orderId = existing.id as string
      const patch = buildOrdersInsertPayload(input)
      delete patch.stripe_payment_intent_id

      let updatePayload = { ...patch }
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const { error: updateError } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('id', orderId)
        if (!updateError) break
        const missing = extractMissingColumn(updateError.message)
        if (!missing || !(missing in updatePayload)) {
          console.error('[Supabase][/orders] update fallito:', updateError)
          return {
            ok: false,
            error: `Aggiornamento ordine non riuscito: ${updateError.message}`,
          }
        }
        const { [missing]: _r, ...rest } = updatePayload
        updatePayload = rest
      }

      const itemsResult = await replaceOrderItems(supabase, orderId, input.items)
      if (!itemsResult.ok) {
        console.warn('[Supabase][/order_items] ensure items:', itemsResult.error)
      }

      return {
        ok: true,
        orderId,
        orderRef: buildOrderReference(orderId),
      }
    }
  }

  const inserted = await insertOrderWithColumnFallback(supabase, input)
  if (!inserted.ok) return inserted

  const itemsResult = await insertOrderItemsWithFallback(supabase, inserted.orderId, input.items)
  if (!itemsResult.ok) {
    console.error('[Supabase][/order_items] insert fallito:', itemsResult.error)
    const rollbackRes = await supabase.from('orders').delete().eq('id', inserted.orderId)
    if (rollbackRes.error) {
      console.error('[Supabase][/orders] rollback fallito:', rollbackRes.error)
    }
    const rollbackHint = rollbackRes.error
      ? ` Rollback fallito: ${rollbackRes.error.message}`
      : ' Ordine annullato automaticamente.'
    return {
      ok: false,
      error: `Salvataggio articoli fallito: ${itemsResult.error}.${rollbackHint}`,
    }
  }

  return {
    ok: true,
    orderId: inserted.orderId,
    orderRef: buildOrderReference(inserted.orderId),
  }
}
