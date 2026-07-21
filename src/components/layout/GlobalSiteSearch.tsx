import { type FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock, Loader2, Search, X } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useAnchoredDropdownPosition } from '../../hooks/useAnchoredDropdownPosition'
import {
  prefetchOfficeSearchIndex,
  useOfficeSearchSuggestions,
} from '../../hooks/useOfficeSearchSuggestions'
import { productDetailPath } from '../../lib/productRoutes'
import { OFFICE_GENERAL_SHOP_PATH } from '../../lib/isGeneralOfficeShopCatalogProduct'
import {
  getSearchHistory,
  pushSearchHistory,
  removeSearchHistoryItem,
} from '../../lib/searchHistoryStorage'
import { isExcludedFromOfficeSearchSuggestions } from '../../lib/isOfficeProductAstroMedicalLine'
import { useCart } from '../../context/CartContext'
import { officeSearchSuggestionToProduct } from '../../lib/officeSearchSuggestionToProduct'
import {
  buildTimbroDefaultCartVariant,
  isTimbroAziendeFarmacieProduct,
} from '../../lib/timbroAziendeFarmacieProduct'
import type { OfficeSearchSuggestion } from '../../api/officeProductsSupabase'
import { SearchSuggestionRow } from './SearchSuggestionRow'
import { CATALOG_CONNECTION_ERROR_MESSAGE } from '../../lib/catalogConnectionError'

const PLACEHOLDER_ROTATE = ['Cerca tra migliaia di prodotti...'] as const

const PLACEHOLDER_INTERVAL_MS = 3200
const SUGGEST_DEBOUNCE_MS = 80
const CATALOG_URL_DEBOUNCE_MS = 300
const MIN_CHARS_SUGGEST = 2

function applySearchToParams(prev: URLSearchParams, raw: string) {
  const next = new URLSearchParams(prev)
  next.delete('q')
  const v = raw.trim()
  if (v) next.set('search', v)
  else next.delete('search')
  const category = (next.get('category') ?? '').trim()
  if (!category || category.toLowerCase() !== 'linea specializzata astro medical') {
    next.set('catalog', 'ufficio')
  }
  return next
}

export function GlobalSiteSearch() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addOfficeProduct } = useCart()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const listboxId = useId()
  const hintId = `${listboxId}-hint`

  const isOfficeCatalog =
    location.pathname === '/office-products' || location.pathname === '/office'

  const urlSearch = searchParams.get('search') ?? searchParams.get('q') ?? ''
  const [draft, setDraft] = useState(urlSearch)
  const catalogDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [debouncedSuggest, setDebouncedSuggest] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const desktopInputWrapRef = useRef<HTMLDivElement>(null)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const desktopSearchRootRef = useRef<HTMLFormElement>(null)
  const mobileSearchRootRef = useRef<HTMLFormElement>(null)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => getSearchHistory())

  useEffect(() => {
    setDraft(urlSearch)
  }, [urlSearch])

  /**
   * Chiudi suggerimenti / mobile solo su cambio **pagina** (pathname o hash).
   * Non usare `location.search`: su `/office-products` i filtri categoria (es. rimozione
   * `subcategory` su Cancelleria) aggiornano l’URL senza navigazione e non devono rubare
   * il focus né azzerare la bozza mentre l’utente scrive nella barra.
   */
  useEffect(() => {
    setIsResultsOpen(false)
    setDebouncedSuggest('')
    desktopInputRef.current?.blur()
    mobileInputRef.current?.blur()
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
    suggestTimerRef.current = setTimeout(() => {
      setDebouncedSuggest(draft.trim())
    }, SUGGEST_DEBOUNCE_MS)
    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
    }
  }, [draft])

  useEffect(() => {
    if (draft.trim() !== '') return
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_ROTATE.length)
    }, PLACEHOLDER_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [draft])

  useEffect(() => {
    if (!mobileOpen) return
    const t = window.setTimeout(() => mobileInputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    void prefetchOfficeSearchIndex(queryClient)
  }, [queryClient])

  const suggestEnabled = debouncedSuggest.length >= MIN_CHARS_SUGGEST
  const draftTrim = draft.trim()
  const isDebouncingSuggest =
    draftTrim.length >= MIN_CHARS_SUGGEST && draftTrim !== debouncedSuggest

  const {
    suggestions: rawSuggestions,
    isFetching,
    isIndexLoading,
    isCatalogConnectionError,
    useLocalSearch,
  } = useOfficeSearchSuggestions({
      query: draftTrim,
      debouncedQuery: debouncedSuggest,
      minChars: MIN_CHARS_SUGGEST,
      limit: 8,
    })

  const suggestions = useMemo(
    () =>
      rawSuggestions.filter(
        (item) =>
          !isExcludedFromOfficeSearchSuggestions({
            id: item.id,
            producerCode: item.producerCode,
            name: item.name,
            brand: item.brand,
            category: '',
            mainFeatures: {},
          }),
      ),
    [rawSuggestions],
  )

  const showHistoryPanel =
    isResultsOpen && draftTrim === '' && searchHistory.length > 0

  const showSuggestionsPanel = draftTrim.length >= MIN_CHARS_SUGGEST && isResultsOpen

  const showPanel = showHistoryPanel || showSuggestionsPanel

  const showInputSpinner =
    !isCatalogConnectionError &&
    !useLocalSearch &&
    (isDebouncingSuggest || (suggestEnabled && (isFetching || isIndexLoading)))
  const suggestLoading =
    showSuggestionsPanel &&
    !isCatalogConnectionError &&
    suggestions.length === 0 &&
    (isIndexLoading ||
      isFetching ||
      (!useLocalSearch && isDebouncingSuggest))

  const showCatalogConnectionError =
    showSuggestionsPanel && isCatalogConnectionError && suggestions.length === 0

  const inputPadRight =
    showInputSpinner && draftTrim ? 'pr-[4.25rem]' : draftTrim ? 'pr-11' : showInputSpinner ? 'pr-10' : 'pr-4'

  const emptySuggestions =
    showSuggestionsPanel && !suggestLoading && suggestions.length === 0

  const desktopDropdownRect = useAnchoredDropdownPosition(
    desktopInputWrapRef,
    showPanel && !mobileOpen,
  )

  const refreshHistory = useCallback(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  const recordSearchQuery = useCallback(
    (raw: string) => {
      const v = raw.trim()
      if (v.length < MIN_CHARS_SUGGEST) return
      setSearchHistory(pushSearchHistory(v))
    },
    [],
  )

  const closeResultsPanel = useCallback(() => {
    setIsResultsOpen(false)
  }, [])

  useClickOutside(
    desktopSearchRootRef,
    closeResultsPanel,
    isResultsOpen && !mobileOpen,
    [desktopDropdownRef],
  )
  useClickOutside(mobileSearchRootRef, closeResultsPanel, mobileOpen)

  function commitSearch(raw: string) {
    const v = raw.trim()
    if (v.length >= MIN_CHARS_SUGGEST) {
      recordSearchQuery(v)
    }
    if (isOfficeCatalog) {
      setSearchParams((prev) => applySearchToParams(prev, raw), { replace: true })
    } else if (v) {
      navigate(`${OFFICE_GENERAL_SHOP_PATH}&search=${encodeURIComponent(v)}`)
    } else {
      navigate(OFFICE_GENERAL_SHOP_PATH)
    }
  }

  function scheduleCommitCatalog(raw: string) {
    if (!isOfficeCatalog) return
    if (catalogDebounceRef.current) clearTimeout(catalogDebounceRef.current)
    catalogDebounceRef.current = setTimeout(() => commitSearch(raw), CATALOG_URL_DEBOUNCE_MS)
  }

  function handleChange(value: string) {
    setDraft(value)
    const trimmed = value.trim()
    setIsResultsOpen(trimmed.length > 0)
    if (isOfficeCatalog) {
      scheduleCommitCatalog(value)
    }
  }

  function handleSearchFocus() {
    refreshHistory()
    void prefetchOfficeSearchIndex(queryClient)
    setIsResultsOpen(true)
  }

  function applyHistoryQuery(query: string) {
    setDraft(query)
    setIsResultsOpen(true)
    setDebouncedSuggest(query.trim())
    if (isOfficeCatalog) {
      scheduleCommitCatalog(query)
    }
  }

  function closeSearchUi(clearDraft = false) {
    setIsResultsOpen(false)
    setMobileOpen(false)
    if (clearDraft) {
      if (catalogDebounceRef.current) clearTimeout(catalogDebounceRef.current)
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
      setDraft('')
      setDebouncedSuggest('')
    }
    desktopInputRef.current?.blur()
    mobileInputRef.current?.blur()
  }

  function handleSuggestionPick(item: OfficeSearchSuggestion) {
    recordSearchQuery(draft)
    const product = officeSearchSuggestionToProduct(item)
    if (isTimbroAziendeFarmacieProduct(product)) {
      addOfficeProduct(product, 1, buildTimbroDefaultCartVariant())
    } else {
      addOfficeProduct(product)
    }
    closeSearchUi(true)
    navigate(productDetailPath(item))
  }

  function handleClear() {
    if (catalogDebounceRef.current) clearTimeout(catalogDebounceRef.current)
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
    setDraft('')
    setDebouncedSuggest('')
    setIsResultsOpen(false)
    if (isOfficeCatalog) {
      commitSearch('')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (catalogDebounceRef.current) clearTimeout(catalogDebounceRef.current)
    commitSearch(draft)
    setIsResultsOpen(false)
  }

  const rotatingPlaceholder = PLACEHOLDER_ROTATE[placeholderIdx]

  const historyList = useMemo(
    () => (
      <div className="py-1">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Ricerche recenti
        </p>
        <ul>
          {searchHistory.map((entry) => (
            <li key={entry} className="flex items-center gap-1">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHistoryQuery(entry)}
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-brand-50"
              >
                <Clock className="size-4 shrink-0 text-slate-400" aria-hidden />
                <span className="truncate">{entry}</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchHistory(removeSearchHistoryItem(entry))}
                className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={`Rimuovi «${entry}» dalla cronologia`}
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </div>
    ),
    [searchHistory],
  )

  function closeMobile() {
    closeSearchUi(false)
  }

  function handleSubmitWrapped(e: FormEvent) {
    handleSubmit(e)
    setMobileOpen(false)
  }

  function handleClearWrapped() {
    handleClear()
  }

  const autocompletePanelBody = (
    <>
      {showHistoryPanel ? (
        historyList
      ) : showCatalogConnectionError ? (
        <div className="px-4 py-5 text-center">
          <p className="text-sm font-medium leading-relaxed text-red-700">
            {CATALOG_CONNECTION_ERROR_MESSAGE}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Il database remoto non è raggiungibile. Controlla la configurazione in{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">.env</code> oppure
            riprova più tardi.
          </p>
        </div>
      ) : suggestLoading ? (
        <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin text-brand-600" aria-hidden />
          Ricerca in corso…
        </div>
      ) : emptySuggestions ? (
        <p className="px-4 py-5 text-center text-sm leading-relaxed text-slate-600">
          Nessun prodotto trovato. Prova con una parola diversa o esplora le categorie
        </p>
      ) : (
        <>
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Risultati rapidi{suggestions.length > 0 ? ` · ${suggestions.length}` : ''}
          </p>
          <ul className="divide-y divide-slate-100">
            {suggestions.map((item) => (
              <SearchSuggestionRow
                key={item.id}
                item={item}
                query={draftTrim}
                compact
                onPick={handleSuggestionPick}
              />
            ))}
          </ul>
        </>
      )}
      {showSuggestionsPanel ? (
        <p
          id={hintId}
          className="border-t border-slate-100 px-3 py-2 text-center text-[11px] text-slate-400"
        >
          Clic su un prodotto: aggiunta al carrello e scheda dettaglio · Invio per tutti i risultati
        </p>
      ) : null}
    </>
  )

  const desktopDropdownPortal =
    showPanel &&
    desktopDropdownRect &&
    !mobileOpen &&
    createPortal(
      <div
        ref={desktopDropdownRef}
        id={listboxId}
        role="listbox"
        style={{
          position: 'fixed',
          top: desktopDropdownRect.top,
          left: desktopDropdownRect.left,
          width: desktopDropdownRect.width,
          zIndex: 200,
        }}
        className="max-h-[min(420px,70vh)] overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5"
        onMouseDown={(e) => e.preventDefault()}
      >
        {autocompletePanelBody}
      </div>,
      document.body,
    )

  const mobileSuggestionsPanel = (
    <>
      {showPanel ? (
        <div
          id={`${listboxId}-mobile`}
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-slate-100 bg-slate-50/50"
          onMouseDown={(e) => e.preventDefault()}
        >
          {showHistoryPanel ? (
            historyList
          ) : showCatalogConnectionError ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium leading-relaxed text-red-700">
                {CATALOG_CONNECTION_ERROR_MESSAGE}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Il database remoto non è raggiungibile. Controlla{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">.env</code> oppure
                riprova più tardi.
              </p>
            </div>
          ) : suggestLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500">
              <Loader2 className="size-5 animate-spin text-brand-600" aria-hidden />
              Ricerca in corso…
            </div>
          ) : emptySuggestions ? (
            <p className="px-4 py-10 text-center text-sm leading-relaxed text-slate-600">
              Nessun prodotto trovato. Prova con una parola diversa o esplora le categorie
            </p>
          ) : (
            <>
              <p className="border-b border-slate-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Risultati rapidi{suggestions.length > 0 ? ` · ${suggestions.length}` : ''}
              </p>
              <ul className="divide-y divide-slate-100 bg-white">
                {suggestions.map((item) => (
                  <SearchSuggestionRow
                    key={item.id}
                    item={item}
                    query={draftTrim}
                    onPick={handleSuggestionPick}
                  />
                ))}
              </ul>
            </>
          )}
          {showSuggestionsPanel ? (
            <p
              id={`${hintId}-mobile`}
              className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-400"
            >
              Clic su un prodotto: aggiunta al carrello e scheda dettaglio · Invio per tutti i risultati
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )

  const mobileShell =
    mobileOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Cerca prodotti"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-2 pb-3">
          <button
            type="button"
            onClick={closeMobile}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:bg-slate-200"
            aria-label="Chiudi ricerca"
          >
            <ArrowLeft className="size-6" aria-hidden />
          </button>
          <h2 className="min-w-0 flex-1 text-lg font-semibold text-slate-900">Cerca</h2>
        </div>

        <form
          ref={mobileSearchRootRef}
          className="flex min-h-0 flex-1 flex-col px-3 pt-3"
          role="search"
          onSubmit={handleSubmitWrapped}
        >
          <label htmlFor="site-search-mobile" className="sr-only">
            Cerca prodotti
          </label>
          <div className="relative shrink-0">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              ref={mobileInputRef}
              id="site-search-mobile"
              type="search"
              enterKeyHint="search"
              value={draft}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder={draft.trim() === '' ? rotatingPlaceholder : ''}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-expanded={showPanel}
              aria-controls={showPanel ? `${listboxId}-mobile` : undefined}
              aria-describedby={showPanel ? `${hintId}-mobile` : undefined}
              aria-autocomplete="list"
              role="combobox"
              className={`min-h-[52px] w-full rounded-2xl border border-slate-200 bg-surface py-3 pl-12 text-base text-slate-800 shadow-inner outline-none ring-brand-500/20 placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 ${inputPadRight}`}
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
              {showInputSpinner ? (
                <Loader2
                  className="size-5 shrink-0 animate-spin text-brand-600"
                  aria-hidden
                />
              ) : null}
              {draft ? (
                <button
                  type="button"
                  onClick={handleClearWrapped}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200"
                  aria-label="Cancella ricerca"
                >
                  <X className="size-5" aria-hidden />
                </button>
              ) : null}
            </div>
          </div>

          {mobileSuggestionsPanel}
        </form>
      </div>,
      document.body,
    )

  return (
    <>
      <div className="flex w-full min-w-0 flex-1 justify-end lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 lg:hidden"
          aria-label="Apri ricerca"
        >
          <Search className="size-5.5" aria-hidden />
        </button>
      </div>

      <form
        ref={desktopSearchRootRef}
        className="relative z-[60] hidden min-w-0 w-full max-w-none flex-1 lg:block"
        role="search"
        onSubmit={handleSubmit}
      >
        <label htmlFor="site-search" className="sr-only">
          Cerca prodotti
        </label>
        <div ref={desktopInputWrapRef} className="relative">
          <Search
            className="pointer-events-none absolute left-4.5 top-1/2 size-5.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            ref={desktopInputRef}
            id="site-search"
            type="search"
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder={draft.trim() === '' ? rotatingPlaceholder : ''}
            autoComplete="off"
            aria-expanded={showPanel}
            aria-controls={showPanel ? listboxId : undefined}
            aria-describedby={showPanel ? hintId : undefined}
            aria-autocomplete="list"
            role="combobox"
            className={`h-11 w-full rounded-full border border-slate-300 bg-white py-2.5 pl-12 text-sm text-slate-800 outline-none placeholder:text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-300/50 ${inputPadRight}`}
          />
          <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            {showInputSpinner ? (
              <Loader2
                className="size-4 shrink-0 animate-spin text-brand-600"
                aria-hidden
              />
            ) : null}
            {draft ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Cancella ricerca"
              >
                <X className="size-4.5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {desktopDropdownPortal}

      {mobileShell}
    </>
  )
}
