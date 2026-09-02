import type { CartItem } from '../context/CartContext'
import { effectiveUnitPrice, lineImponible } from './quantityPricing'

/** Snapshot carrello per `cart_sessions.items_json` (allineato a orders.items_json). */
export type CartSessionItemJson = {
  id: string
  sku: string
  name: string
  variant?: string
  quantity: number
  unit_imponibile: number
  row_imponibile: number
  imageUrl?: string
}

export function buildCartSessionItemsJson(items: readonly CartItem[]): CartSessionItemJson[] {
  return items.map((i) => ({
    id: i.id,
    sku: i.sku,
    name: i.name,
    ...(i.variantLabel ? { variant: i.variantLabel } : {}),
    quantity: i.quantity,
    unit_imponibile: Number(
      effectiveUnitPrice(i.price, i.quantityPriceTiers, i.quantity).toFixed(2),
    ),
    row_imponibile: Number(lineImponible(i.price, i.quantityPriceTiers, i.quantity).toFixed(2)),
    ...(i.imageUrl ? { imageUrl: i.imageUrl } : {}),
  }))
}
