import {
  FREE_SHIPPING_THRESHOLD_IVATO,
  roundMoney2,
  VAT_RATE,
} from './cartMerchandiseIvato'

/** Spese di spedizione a domicilio (IVA inclusa) sotto soglia merce gratuita. */
export const SHIPPING_FEE_IVATO = 5.99

export type DeliveryMethod = 'shipping' | 'pickup'

export function computeShippingFeeIvato(
  merchandiseIvato: number,
  deliveryMethod: DeliveryMethod = 'shipping',
): number {
  if (deliveryMethod === 'pickup') return 0
  if (merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO) return 0
  return SHIPPING_FEE_IVATO
}

export type OrderCostBreakdownValues = {
  taxableTotal: number
  vatAmount: number
  merchandiseIvato: number
  shippingFee: number
  totalDue: number
  hasFreeShipping: boolean
}

/** Riepilogo costi per UI: imponibile scorporato da totale ivato merce. */
export function orderCostBreakdown(
  merchandiseIvato: number,
  deliveryMethod: DeliveryMethod = 'shipping',
): OrderCostBreakdownValues {
  const taxableTotal = roundMoney2(merchandiseIvato / (1 + VAT_RATE))
  const vatAmount = roundMoney2(merchandiseIvato - taxableTotal)
  const shippingFee = computeShippingFeeIvato(merchandiseIvato, deliveryMethod)
  const totalDue = roundMoney2(merchandiseIvato + shippingFee)
  const hasFreeShipping =
    deliveryMethod === 'pickup' || merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO

  return {
    taxableTotal,
    vatAmount,
    merchandiseIvato,
    shippingFee,
    totalDue,
    hasFreeShipping,
  }
}
