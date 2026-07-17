import { FileText, ShoppingCart } from 'lucide-react'
import type { OfficeSearchSuggestion } from '../../api/officeProductsSupabase'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { SearchHighlightText } from '../../lib/searchHighlight'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type SearchSuggestionRowProps = {
  item: OfficeSearchSuggestion
  query: string
  compact?: boolean
  onPick: (item: OfficeSearchSuggestion) => void
}

export function SearchSuggestionRow({
  item,
  query,
  compact,
  onPick,
}: SearchSuggestionRowProps) {
  const thumbSize = compact ? 'size-14' : 'size-16'
  const pad = compact ? 'px-3 py-2.5' : 'px-4 py-3.5'
  const titleCls = compact
    ? 'line-clamp-2 text-sm font-semibold text-slate-900'
    : 'line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900'
  const priceCls = compact
    ? 'mt-1 text-sm font-bold tabular-nums text-brand-800'
    : 'mt-1.5 text-base font-bold tabular-nums text-brand-800'
  const imageUrl = withOfficeImageCacheBust(item.imageUrl, OFFICE_CATALOG_DATA_REVISION)

  return (
    <li role="option" aria-selected={false}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onPick(item)}
        className={`group flex w-full gap-3 text-left transition hover:bg-brand-50 active:bg-brand-100 ${pad}`}
      >
        <div
          className={`relative ${thumbSize} shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50/40`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-brand-200">
              <FileText className={compact ? 'size-7' : 'size-8'} strokeWidth={1.25} aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          {item.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {item.brand}
            </p>
          ) : null}
          <p className={titleCls}>
            <SearchHighlightText text={item.name.trim()} query={query} />
          </p>
          {item.colorName ? (
            <p className="mt-0.5 text-xs text-slate-500">Colore: {item.colorName}</p>
          ) : null}
          <p className={priceCls}>
            {typeof item.price === 'number' ? `${eur.format(item.price)} + IVA` : '—'}
          </p>
        </div>
        <span
          className="mt-1 flex size-9 shrink-0 items-center justify-center self-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-brand-300 group-hover:bg-brand-600 group-hover:text-white"
          aria-hidden
        >
          <ShoppingCart className="size-4" />
        </span>
      </button>
    </li>
  )
}
