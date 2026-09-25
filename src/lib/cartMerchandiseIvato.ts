import type { CartItem } from '../context/CartContext'
import { lineImponible } from './quantityPricing'
import {
  DEFAULT_VAT_RATE,
  resolveVatRate,
  roundMoney2,
  vatAmountFromNet,
} from './vatPricing'

export { DEFAULT_VAT_RATE, VAT_RATE, roundMoney2 } from './vatPricing'
export { resolveVatRate, priceWithVat, formatEuroIt } from './vatPricing'

export const FREE_SHIPPING_THRESHOLD_IVATO = 50

export type CartMerchandiseBreakdown = {
  taxableTotal: number
  vatAmount: number
  merchandiseIvato: number
}

/** Imponibile, IVA e totale merce IVA inclusa — aliquota per riga se presente. */
export function cartMerchandiseBreakdown(items: readonly CartItem[]): CartMerchandiseBreakdown {
  let taxableTotal = 0
  let vatAmount = 0
  for (const item of items) {
    const lineNet = roundMoney2(
      lineImponible(item.price, item.quantityPriceTiers, item.quantity),
    )
    taxableTotal = roundMoney2(taxableTotal + lineNet)
    vatAmount = roundMoney2(vatAmount + vatAmountFromNet(lineNet, item.vatRate))
  }
  const merchandiseIvato = roundMoney2(taxableTotal + vatAmount)
  return { taxableTotal, vatAmount, merchandiseIvato }
}

/** Alias storico: moltiplicatore 1.22 (solo aliquota standard). */
export function standardVatMultiplier(): number {
  return 1 + DEFAULT_VAT_RATE
}

export function lineGross(
  price: number | undefined,
  tiers: CartItem['quantityPriceTiers'],
  quantity: number,
  vatRate?: number | null,
): number {
  const net = lineImponible(price, tiers, quantity)
  return roundMoney2(net * (1 + resolveVatRate(vatRate)))
}
