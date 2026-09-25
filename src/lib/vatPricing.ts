/**
 * Calcolo e formattazione prezzi IVA esclusa / inclusa.
 * Aliquota di default 22%; supporta 4% / 10% (o altro) se impostata sul prodotto.
 */

export const DEFAULT_VAT_RATE = 0.22
/** @deprecated Usa DEFAULT_VAT_RATE — mantenuto per compatibilità. */
export const VAT_RATE = DEFAULT_VAT_RATE

export function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Normalizza aliquota IVA da DB/FE:
 * - frazione (0.22, 0.04, 0.1)
 * - percentuale (22, 4, 10)
 */
export function resolveVatRate(raw?: number | string | null): number {
  if (raw == null || raw === '') return DEFAULT_VAT_RATE
  const n = typeof raw === 'number' ? raw : Number.parseFloat(String(raw).replace(',', '.'))
  if (!Number.isFinite(n) || n < 0) return DEFAULT_VAT_RATE
  if (n === 0) return 0
  // Percentuale tipica IT (4 / 5 / 10 / 22) o valori 1–100.
  if (n > 1) return Math.min(n / 100, 1)
  return n
}

export function priceWithVat(imponibile: number, vatRate?: number | string | null): number {
  const net = Number.isFinite(imponibile) ? imponibile : 0
  return roundMoney2(net * (1 + resolveVatRate(vatRate)))
}

export function vatAmountFromNet(imponibile: number, vatRate?: number | string | null): number {
  const net = Number.isFinite(imponibile) ? imponibile : 0
  return roundMoney2(net * resolveVatRate(vatRate))
}

export function formatEuroIt(amount: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(
    Number.isFinite(amount) ? amount : 0,
  )
}

/** Prezzo feed Merchant / Trovaprezzi: "12.50 EUR" con IVA inclusa. */
export function formatGrossPriceFeed(imponibile: number, vatRate?: number | string | null): string {
  return `${priceWithVat(imponibile, vatRate).toFixed(2)} EUR`
}

/** Percentuale intera per etichette (es. 22). */
export function vatPercentLabel(vatRate?: number | string | null): number {
  return Math.round(resolveVatRate(vatRate) * 100)
}