import type { OfficeProduct } from '../types/officeProduct'

export type PurchaseQuantityRule = {
  minOrderQuantity: number
  orderQuantityStep: number
}

/** Vincoli quantità d'acquisto per SKU (es. multipli di 24). */
export const PURCHASE_QUANTITY_RULES_BY_SKU: Record<string, PurchaseQuantityRule> = {
  '100195': { minOrderQuantity: 24, orderQuantityStep: 24 },
}

export function purchaseQuantityRuleForSku(
  sku: string | null | undefined,
): PurchaseQuantityRule | null {
  const key = String(sku ?? '')
    .trim()
    .toUpperCase()
  if (!key) return null
  return PURCHASE_QUANTITY_RULES_BY_SKU[key] ?? null
}

export function purchaseQuantityRuleForProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'minOrderQuantity' | 'orderQuantityStep'> | null | undefined,
): PurchaseQuantityRule | null {
  if (!product) return null
  const fromMap =
    purchaseQuantityRuleForSku(product.producerCode) ?? purchaseQuantityRuleForSku(product.id)
  const min =
    typeof product.minOrderQuantity === 'number' && product.minOrderQuantity > 1
      ? Math.floor(product.minOrderQuantity)
      : fromMap?.minOrderQuantity
  const step =
    typeof product.orderQuantityStep === 'number' && product.orderQuantityStep > 1
      ? Math.floor(product.orderQuantityStep)
      : fromMap?.orderQuantityStep
  if ((!min || min <= 1) && (!step || step <= 1)) return fromMap
  return {
    minOrderQuantity: Math.max(1, min ?? 1),
    orderQuantityStep: Math.max(1, step ?? 1),
  }
}

/** Arrotonda la quantità al multiplo consentito (non sotto il minimo). */
export function snapPurchaseQuantity(
  quantity: number,
  rule: PurchaseQuantityRule | null | undefined,
): number {
  const q = Math.floor(Number(quantity))
  if (!Number.isFinite(q)) return rule?.minOrderQuantity ?? 1
  if (!rule) return Math.max(1, q)
  const min = Math.max(1, Math.floor(rule.minOrderQuantity))
  const step = Math.max(1, Math.floor(rule.orderQuantityStep))
  if (q < min) return min
  const steps = Math.round((q - min) / step)
  return min + Math.max(0, steps) * step
}

export function nextPurchaseQuantity(
  current: number,
  deltaSteps: number,
  rule: PurchaseQuantityRule | null | undefined,
): number {
  const step = Math.max(1, Math.floor(rule?.orderQuantityStep ?? 1))
  const min = Math.max(1, Math.floor(rule?.minOrderQuantity ?? 1))
  const next = Math.floor(current) + deltaSteps * step
  if (next < min) return 0
  return snapPurchaseQuantity(next, rule)
}
