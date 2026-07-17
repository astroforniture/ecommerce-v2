import type { QuantityPriceTier } from '../types/officeProduct'

/** Prezzo unitario applicato: sceglie il listino con soglia minima più alta ancora raggiunta dalla quantità. */
export function effectiveUnitPrice(
  basePrice: number | undefined,
  tiers: QuantityPriceTier[] | undefined,
  quantity: number,
): number {
  const base = typeof basePrice === 'number' && Number.isFinite(basePrice) ? basePrice : 0
  if (!tiers?.length || quantity < 1) return base

  const sorted = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity)
  const match = sorted.find((t) => quantity >= t.minQuantity)
  return match?.unitPrice ?? base
}

export function lineImponible(
  basePrice: number | undefined,
  tiers: QuantityPriceTier[] | undefined,
  quantity: number,
): number {
  const unit = effectiveUnitPrice(basePrice, tiers, quantity)
  return unit * quantity
}

function dedupeTiersByMinQuantity(tiers: QuantityPriceTier[]): QuantityPriceTier[] {
  const map = new Map<number, number>()
  for (const t of tiers) {
    const mq = Math.max(1, Math.floor(t.minQuantity))
    const up = typeof t.unitPrice === 'number' && Number.isFinite(t.unitPrice) ? t.unitPrice : 0
    map.set(mq, up)
  }
  return [...map.entries()]
    .map(([minQuantity, unitPrice]) => ({ minQuantity, unitPrice }))
    .sort((a, b) => a.minQuantity - b.minQuantity)
}

/** Riga tabella sconti quantità con intervallo per evidenziare la fascia attiva. */
export type QuantityDiscountRowDetail = {
  label: string
  unitPrice: number
  minQty: number
  maxQty: number | null
}

export function quantityDiscountRowsDetailed(
  basePrice: number,
  tiers: QuantityPriceTier[] | undefined,
): QuantityDiscountRowDetail[] {
  const base = typeof basePrice === 'number' && Number.isFinite(basePrice) ? basePrice : 0
  if (!tiers?.length) {
    return [
      {
        label: 'Tutte le quantità',
        unitPrice: base,
        minQty: 1,
        maxQty: null,
      },
    ]
  }

  const sorted = dedupeTiersByMinQuantity(tiers)
  const rows: QuantityDiscountRowDetail[] = []

  if (sorted[0].minQuantity > 1) {
    const hi = sorted[0].minQuantity - 1
    rows.push({
      label: hi === 1 ? '1 pezzo' : `1-${hi} pezzi`,
      unitPrice: base,
      minQty: 1,
      maxQty: hi,
    })
  }

  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i]
    const next = sorted[i + 1]
    let label: string
    if (next) {
      const hi = next.minQuantity - 1
      if (t.minQuantity === hi) {
        label = `${t.minQuantity} pezzi`
      } else {
        label = `${t.minQuantity}-${hi} pezzi`
      }
    } else {
      label = `${t.minQuantity}+ pezzi`
    }
    rows.push({
      label,
      unitPrice: t.unitPrice,
      minQty: t.minQuantity,
      maxQty: next ? next.minQuantity - 1 : null,
    })
  }

  return rows
}

/** La quantità `quantity` cade in questa fascia listino? */
export function isQuantityInDiscountTier(
  quantity: number,
  row: QuantityDiscountRowDetail,
): boolean {
  const q = Math.max(1, Math.floor(quantity))
  if (q < row.minQty) return false
  if (row.maxQty === null) return true
  return q <= row.maxQty
}

/** Righe per tabella "Sconti per quantità": fasce e prezzo unitario imponibile. */
export function quantityDiscountRows(
  basePrice: number,
  tiers: QuantityPriceTier[] | undefined,
): { label: string; unitPrice: number }[] {
  return quantityDiscountRowsDetailed(basePrice, tiers).map(({ label, unitPrice }) => ({
    label,
    unitPrice,
  }))
}
