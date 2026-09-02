import { useEffect, useState } from 'react'
import { Filter, RotateCcw } from 'lucide-react'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { cn } from '../../lib/utils'

export type CatalogPriceBounds = {
  min: number
  max: number
}

export type CatalogAdvancedFiltersProps = {
  brands: readonly string[]
  selectedBrands: readonly string[]
  onToggleBrand: (brand: string, checked: boolean) => void
  formats?: readonly string[]
  selectedFormats?: readonly string[]
  onToggleFormat?: (format: string, checked: boolean) => void
  showFormats?: boolean
  minPrice: number | null
  maxPrice: number | null
  priceBounds: CatalogPriceBounds | null
  onPriceRangeChange: (min: number | null, max: number | null) => void
  inStockOnly: boolean
  onInStockOnlyChange: (value: boolean) => void
  activeCount: number
  onClear: () => void
  className?: string
}

function formatPriceInput(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return ''
  return String(value)
}

function parsePriceInput(raw: string): number | null {
  const trimmed = raw.trim().replace(',', '.')
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100) / 100
}

/** Pannello filtri: prezzo, marca, disponibilita (+ formato opzionale). */
export function CatalogAdvancedFiltersPanel({
  brands,
  selectedBrands,
  onToggleBrand,
  formats = [],
  selectedFormats = [],
  onToggleFormat,
  showFormats = false,
  minPrice,
  maxPrice,
  priceBounds,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  activeCount,
  onClear,
  className,
}: CatalogAdvancedFiltersProps) {
  const [draftMin, setDraftMin] = useState(formatPriceInput(minPrice))
  const [draftMax, setDraftMax] = useState(formatPriceInput(maxPrice))

  useEffect(() => {
    setDraftMin(formatPriceInput(minPrice))
  }, [minPrice])

  useEffect(() => {
    setDraftMax(formatPriceInput(maxPrice))
  }, [maxPrice])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextMin = parsePriceInput(draftMin)
      const nextMax = parsePriceInput(draftMax)
      const sameMin = nextMin === minPrice || (nextMin == null && minPrice == null)
      const sameMax = nextMax === maxPrice || (nextMax == null && maxPrice == null)
      if (sameMin && sameMax) return
      onPriceRangeChange(nextMin, nextMax)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [draftMin, draftMax, minPrice, maxPrice, onPriceRangeChange])

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Filtri</h3>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset ({activeCount})
          </button>
        ) : null}
      </div>

      <section className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prezzo</h4>
        {priceBounds ? (
          <p className="text-[11px] text-slate-500">
            Range catalogo: {priceBounds.min.toFixed(2)} - {priceBounds.max.toFixed(2)} EUR
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="filter-min-price" className="text-xs text-slate-600">
              Prezzo min
            </Label>
            <Input
              id="filter-min-price"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="0"
              value={draftMin}
              onChange={(e) => setDraftMin(e.target.value)}
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label htmlFor="filter-max-price" className="text-xs text-slate-600">
              Prezzo max
            </Label>
            <Input
              id="filter-max-price"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Max"
              value={draftMax}
              onChange={(e) => setDraftMax(e.target.value)}
              className="mt-1 h-10"
            />
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Disponibilita
            </h4>
            <p className="mt-0.5 text-xs text-slate-500">Solo prodotti disponibili</p>
          </div>
          <Switch
            checked={inStockOnly}
            onCheckedChange={onInStockOnlyChange}
            aria-label="Solo prodotti disponibili"
          />
        </div>
      </section>

      <section className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Marca / Produttore
          {selectedBrands.length > 0 ? (
            <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800">
              {selectedBrands.length}
            </span>
          ) : null}
        </h4>
        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {brands.length ? (
            brands.map((brand) => {
              const checked = selectedBrands.includes(brand)
              const id = `filter-brand-${brand}`
              return (
                <label
                  key={brand}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggleBrand(brand, e.target.checked)}
                    className="size-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                  />
                  <span className="min-w-0 truncate">{brand}</span>
                </label>
              )
            })
          ) : (
            <p className="text-sm text-slate-500">Nessuna marca disponibile</p>
          )}
        </div>
      </section>

      {showFormats && onToggleFormat ? (
        <section className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Formato
            {selectedFormats.length > 0 ? (
              <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                {selectedFormats.length}
              </span>
            ) : null}
          </h4>
          <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
            {formats.length ? (
              formats.map((format) => {
                const checked = selectedFormats.includes(format)
                const id = `filter-format-${format}`
                return (
                  <label
                    key={format}
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onToggleFormat(format, e.target.checked)}
                      className="size-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                    />
                    <span className="min-w-0 truncate">{format}</span>
                  </label>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Nessun formato disponibile</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}

type MobileFiltersDialogProps = CatalogAdvancedFiltersProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Pulsante Filtra + modal (mobile / tablet). */
export function CatalogAdvancedFiltersMobileTrigger(props: MobileFiltersDialogProps) {
  const { open, onOpenChange, activeCount, ...panelProps } = props
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="inline-flex h-11 items-center gap-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 lg:hidden"
        >
          <Filter className="size-4" aria-hidden />
          Filtra
          {activeCount > 0 ? (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto p-0 sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4 text-left">
          <DialogTitle className="text-base font-bold text-slate-900">Filtri prodotti</DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-4 sm:px-3">
          <CatalogAdvancedFiltersPanel
            {...panelProps}
            activeCount={activeCount}
            className="border-0 shadow-none"
          />
          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-3 py-3">
            <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
              Mostra risultati
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function parseOptionalPriceParam(raw: string | null): number | null {
  return parsePriceInput(raw ?? '')
}

export function computeCatalogPriceBounds(
  products: ReadonlyArray<{ price?: number | null }>,
): CatalogPriceBounds | null {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const p of products) {
    if (typeof p.price !== 'number' || !Number.isFinite(p.price)) continue
    min = Math.min(min, p.price)
    max = Math.max(max, p.price)
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  return {
    min: Math.floor(min * 100) / 100,
    max: Math.ceil(max * 100) / 100,
  }
}
