import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, Search, X } from 'lucide-react'
import { useOfficeSearchSuggestions } from '../../hooks/useOfficeSearchSuggestions'
import { productDetailPath } from '../../lib/productRoutes'
import { ProductThumb } from '../crosssell/ProductThumb'
import type { OfficeSearchSuggestion } from '../../api/officeProductsSupabase'
import { SearchHighlightText } from '../../lib/searchHighlight'

const SUGGEST_DEBOUNCE_MS = 120
const MIN_CHARS = 2

type AstroMedicalSearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  /** Stile hero: piena larghezza, input più alto e bordo/ombra più evidenti. */
  variant?: 'default' | 'hero'
}

/**
 * Ricerca dedicata al catalogo GIMA / Astro Medical:
 * nome/descrizione + codice articolo, autocomplete live, filtro griglia su Invio.
 */
export function AstroMedicalSearchBar({
  value,
  onChange,
  className = '',
  variant = 'default',
}: AstroMedicalSearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const listboxId = useId()
  const rootRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(value)
  const [debounced, setDebounced] = useState(value.trim())
  const [open, setOpen] = useState(false)
  const isHero = variant === 'hero'

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(draft.trim()), SUGGEST_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [draft])

  // Chiudi tendina e ripristina interattività al rientro (history back / remount).
  useEffect(() => {
    setOpen(false)
    const input = inputRef.current
    if (input) {
      input.disabled = false
      input.removeAttribute('readonly')
    }
  }, [location.key, location.pathname])

  useEffect(() => {
    function onPageShow() {
      setOpen(false)
      const input = inputRef.current
      if (input) {
        input.disabled = false
        input.removeAttribute('readonly')
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

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
    limit: 10,
    scope: 'medical',
  })

  const showSuggestions =
    open && draft.trim().length >= MIN_CHARS && (suggestions.length > 0 || isFetching || isIndexLoading)

  const euro = useMemo(
    () => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }),
    [],
  )

  function goToSuggestion(item: OfficeSearchSuggestion) {
    setOpen(false)
    onChange('')
    setDraft('')
    navigate(
      productDetailPath({
        id: item.id,
        name: item.name,
        producerCode: item.producerCode,
      }),
    )
  }

  function commitListingFilter(next: string) {
    const v = next.trim()
    setDraft(v)
    onChange(v)
    setOpen(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    // Invio: applica sempre il filtro sulla griglia catalogo (non naviga alla scheda).
    commitListingFilter(draft)
  }

  return (
    <form
      ref={rootRef}
      className={[
        'relative z-20 w-full pointer-events-auto',
        isHero ? 'mx-auto max-w-3xl' : 'max-w-xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Cerca per nome, descrizione o codice GIMA
      </label>
      <div className="relative z-20 flex items-center">
        <Search
          className={[
            'pointer-events-none absolute text-medical-600',
            isHero ? 'left-4 size-5' : 'left-3 size-4',
          ].join(' ')}
          aria-hidden
        />
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="search"
          value={draft}
          placeholder="Cerca per nome, descrizione o codice GIMA / SKU…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={false}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className={[
            'relative z-20 w-full bg-white text-slate-900 outline-none transition placeholder:text-slate-400',
            'focus:border-medical-500 focus:ring-2 focus:ring-medical-500/30',
            isHero
              ? 'rounded-2xl border-2 border-medical-300 py-4 pl-12 pr-12 text-base shadow-lg shadow-medical-700/10 sm:py-[1.15rem] sm:text-lg'
              : 'rounded-xl border border-medical-200 py-3 pl-10 pr-10 text-sm shadow-sm focus:border-medical-400 focus:ring-medical-500/25',
          ].join(' ')}
          onChange={(e) => {
            const next = e.target.value
            setDraft(next)
            setOpen(true)
            onChange(next)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
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
            className={[
              'absolute z-30 inline-flex items-center justify-center rounded-lg text-slate-500 transition hover:bg-medical-50 hover:text-medical-800',
              isHero ? 'right-3 size-10' : 'right-2 size-8',
            ].join(' ')}
            aria-label="Cancella ricerca"
            onClick={() => {
              setDraft('')
              onChange('')
              setOpen(false)
              inputRef.current?.focus()
            }}
          >
            <X className={isHero ? 'size-5' : 'size-4'} aria-hidden />
          </button>
        ) : null}
      </div>

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          className={[
            'absolute z-40 mt-2 max-h-80 w-full overflow-auto border border-medical-100 bg-white py-1 shadow-lg',
            isHero ? 'rounded-2xl' : 'rounded-xl',
          ].join(' ')}
        >
          {isFetching || isIndexLoading ? (
            <li className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin text-medical-600" aria-hidden />
              Ricerca in corso…
            </li>
          ) : suggestions.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500">Nessun articolo GIMA trovato.</li>
          ) : (
            suggestions.map((item) => {
              const code = (item.producerCode || item.id || '').trim()
              return (
                <li key={item.id} role="option">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-medical-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToSuggestion(item)}
                  >
                    <ProductThumb
                      imageUrl={item.imageUrl}
                      alt=""
                      className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50"
                      imgClassName="max-h-full max-w-full object-contain p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        <SearchHighlightText text={item.name} query={draft.trim()} />
                      </p>
                      <p className="truncate text-[11px] tabular-nums text-slate-500">
                        {[item.brand, code ? `Cod. ${code}` : ''].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {typeof item.price === 'number' && item.price > 0 ? (
                      <span className="shrink-0 text-sm font-bold tabular-nums text-medical-800">
                        {euro.format(item.price)}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </form>
  )
}
