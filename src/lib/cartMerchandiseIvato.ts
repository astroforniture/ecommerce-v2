import type { CartItem } from '../context/CartContext'
import { lineImponible } from './quantityPricing'

export const FREE_SHIPPING_THRESHOLD_IVATO = 50
export const VAT_RATE = 0.22

export function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100
}

export type CartMerchandiseBreakdown = {
  taxableTotal: number
  vatAmount: number
  merchandiseIvato: number
}

/** Imponibile, IVA e totale merce IVA inclusa (22%) — allineato a carrello / checkout. */
export function cartMerchandiseBreakdown(items: readonly CartItem[]): CartMerchandiseBreakdown {
  const taxableTotal = roundMoney2(
    items.reduce(
      (sum, item) => sum + lineImponible(item.price, item.quantityPriceTiers, item.quantity),
      0,
    ),
  )
  const vatAmount = roundMoney2(taxableTotal * VAT_RATE)
  const merchandiseIvato = roundMoney2(taxableTotal + vatAmount)
  return { taxableTotal, vatAmount, merchandiseIvato }
}
