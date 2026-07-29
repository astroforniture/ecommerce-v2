import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search, X } from 'lucide-react'
import { useOfficeSearchSuggestions } from '../../hooks/useOfficeSearchSuggestions'
import { productDetailPath } from '../../lib/productRoutes'
import { ProductThumb } from '../crosssell/ProductThumb'
import type { OfficeSearchSuggestion } from '../../api/officeProductsSupabase'

const SUGGEST_DEBOUNCE_MS = 120
const MIN_CHARS = 2

type AstroMedicalSearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Ricerca dedicata al catalogo GIMA / Astro Medical (scope medical only).
 */
export function AstroMedicalSearchBar({
  value,
  onChange,
  className = '',
}: AstroMedicalSearchBarProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState(value)
  const [debounced, setDebounced] = useState(value.trim())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(draft.trim()), SUGGEST_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [draft])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const { suggestions, isFetching, isIndexLoading } = useOfficeSearchSuggestions({
    query: draft.trim(),
    debouncedQuery: debounced,
    minChars: MIN_CHARS,
    limit: 8,
    scope: 'medical',
  })

  const showSuggestions =
    open && draft.trim().length >= MIN_CHARS && (suggestions.length > 0 || isFetching || isIndexLoading)

  const euro = useMemo(
    () => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }),
    [],
  )

  function commit(next: string) {
    const v = next.trim()
    setDraft(v)
    onChange(v)
    setOpen(false)
  }

  function handleSuggestion(item: OfficeSearchSuggestion) {
    commit(item.name)
  }

  return (
    <div ref={rootRef} className={['relative w-full max-w-xl', className].filter(Boolean).join(' ')}>
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Cerca nel catalogo GIMA / Astro Medical
      </label>
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 size-4 text-medical-600"
          aria-hidden
        />
        <input
          id={`${listboxId}-input`}
          type="search"
          value={draft}
          placeholder="Cerca prodotti GIMA / Astro Medical…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className="w-full rounded-xl border border-medical-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-medical-400 focus:ring-2 focus:ring-medical-500/25"
          onChange={(e) => {
            const next = e.target.value
            setDraft(next)
            setOpen(true)
            onChange(next)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit(draft)
            }
            if (e.key === 'Escape') {
              setOpen(false)
              if (draft) {
                setDraft('')
                onChange('')
              }
            }
          }}
        />
        {draft ? (
          <button
            type="button"
            className="absolute right-2 inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-medical-50 hover:text-medical-800"
            aria-label="Cancella ricerca"
            onClick={() => {
              setDraft('')
              onChange('')
              setOpen(false)
            }}
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-medical-100 bg-white py-1 shadow-lg"
        >
          {isFetching || isIndexLoading ? (
            <li className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin text-medical-600" aria-hidden />
              Ricerca in corso…
            </li>
          ) : suggestions.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500">Nessun articolo GIMA trovato.</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id} role="option">
                <Link
                  to={productDetailPath({
                    id: item.id,
                    name: item.name,
                    producerCode: item.producerCode,
                  })}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-medical-50"
                  onClick={() => handleSuggestion(item)}
                >
                  <ProductThumb
                    imageUrl={item.imageUrl}
                    alt=""
                    className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50"
                    imgClassName="max-h-full max-w-full object-contain p-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {[item.brand, item.producerCode].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {typeof item.price === 'number' && item.price > 0 ? (
                    <span className="shrink-0 text-sm font-bold tabular-nums text-medical-800">
                      {euro.format(item.price)}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
