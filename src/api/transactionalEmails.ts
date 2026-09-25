import { FunctionsHttpError } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import type {
  AbandonedCartEmailInput,
  AdminNewOrderEmailInput,
  OrderConfirmationEmailInput,
  ShippingEmailInput,
  WelcomeEmailInput,
} from '../lib/emails/templates'
import { EMAIL_SUPPORT } from '../lib/emails/brand'

export type TransactionalEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string }

async function readFunctionErrorMessage(error: FunctionsHttpError): Promise<string | null> {
  try {
    const payload = (await error.context.json()) as { error?: string; message?: string } | null
    return payload?.error ?? payload?.message ?? null
  } catch {
    return null
  }
}

async function invokeTransactionalEmail(
  body: Record<string, unknown>,
): Promise<TransactionalEmailResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato.' }
  }

  const { data, error } = await supabase.functions.invoke('send-transactional-email', {
    body,
  })

  if (error) {
    console.warn('[email] Edge Function error:', error)
    if (error instanceof FunctionsHttpError) {
      const detail = await readFunctionErrorMessage(error)
      return { ok: false, error: detail ?? error.message }
    }
    return { ok: false, error: error.message || 'Invio email non riuscito.' }
  }

  const payload = data as { ok?: boolean; id?: string; error?: string } | null
  if (payload?.error) return { ok: false, error: payload.error }
  return { ok: true, id: payload?.id }
}

/** Fire-and-forget safe wrapper: non propaga errori al flusso principale. */
export async function sendWelcomeEmailSafe(input: WelcomeEmailInput): Promise<void> {
  try {
    const result = await invokeTransactionalEmail({
      type: 'welcome',
      to: input.email,
      firstName: input.firstName,
    })
    if (!result.ok) console.warn('[email] welcome fallita:', result.error)
  } catch (err) {
    console.warn('[email] welcome exception:', err)
  }
}

export async function sendOrderConfirmationEmailSafe(
  input: OrderConfirmationEmailInput,
): Promise<void> {
  try {
    const result = await invokeTransactionalEmail({
      type: 'order_confirmation',
      to: input.email,
      customerName: input.customerName,
      orderRef: input.orderRef,
      items: input.items,
      taxableTotal: input.taxableTotal,
      vatAmount: input.vatAmount,
      shippingFee: input.shippingFee,
      totalWithVat: input.totalWithVat,
      deliveryMethod: input.deliveryMethod,
      shippingAddress: input.shippingAddress,
    })
    if (!result.ok) console.warn('[email] order_confirmation fallita:', result.error)
  } catch (err) {
    console.warn('[email] order_confirmation exception:', err)
  }
}

export async function sendShippingEmail(
  input: ShippingEmailInput,
): Promise<TransactionalEmailResult> {
  return invokeTransactionalEmail({
    type: 'shipping',
    to: input.email,
    customerName: input.customerName,
    orderRef: input.orderRef,
    trackingNumber: input.trackingNumber,
    shippingAddress: input.shippingAddress,
  })
}

export async function sendShippingEmailSafe(input: ShippingEmailInput): Promise<void> {
  try {
    const result = await sendShippingEmail(input)
    if (!result.ok) console.warn('[email] shipping fallita:', result.error)
  } catch (err) {
    console.warn('[email] shipping exception:', err)
  }
}

export async function sendAbandonedCartEmailSafe(input: AbandonedCartEmailInput): Promise<void> {
  try {
    const result = await invokeTransactionalEmail({
      type: 'abandoned_cart',
      to: input.email,
      customerName: input.customerName,
      items: input.items,
      cartUrl: input.cartUrl,
    })
    if (!result.ok) console.warn('[email] abandoned_cart fallita:', result.error)
  } catch (err) {
    console.warn('[email] abandoned_cart exception:', err)
  }
}

/** Notifica nuovo ordine a info@astro-forniture.it (Resend via Edge Function). */
export async function sendAdminNewOrderEmailSafe(
  input: AdminNewOrderEmailInput,
): Promise<boolean> {
  try {
    const result = await invokeTransactionalEmail({
      type: 'admin_new_order',
      to: EMAIL_SUPPORT,
      orderRef: input.orderRef,
      firstName: input.firstName,
      lastName: input.lastName,
      customerName: input.customerName,
      customerEmail: input.email,
      phone: input.phone,
      billingAddress: input.billingAddress,
      shippingAddress: input.shippingAddress,
      items: input.items,
      taxableTotal: input.taxableTotal,
      vatAmount: input.vatAmount,
      shippingFee: input.shippingFee,
      totalWithVat: input.totalWithVat,
      paymentMethod: input.paymentMethod ?? 'Stripe / Carta',
      orderNotes: input.orderNotes,
      deliveryMethod: input.deliveryMethod,
    })
    if (!result.ok) {
      console.warn('[email] admin_new_order fallita:', result.error)
      return false
    }
    return true
  } catch (err) {
    console.warn('[email] admin_new_order exception:', err)
    return false
  }
}
