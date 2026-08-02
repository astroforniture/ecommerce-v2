import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Loader2, Menu, X } from 'lucide-react'
import {
  MEGA_MENU_CATEGORIES,
  type MegaMenuCategory,
  type MegaMenuSubItem,
} from '../../data/megaMenuNav'
import {
  fetchMegaMenuPreviewProducts,
  megaMenuPreviewQueryKey,
  prefetchMegaMenuPreview,
} from '../../lib/megaMenuProducts'
import { prefetchOfficeCatalogForHref } from '../../hooks/useOfficeCatalog'
import { CompactOfficeProductCard } from '../office/CompactOfficeProductCard'
import type { OfficeProduct } from '../../types/officeProduct'

const OPEN_DELAY_MS = 80
const CLOSE_DELAY_MS = 240
const SUB_HOVER_DELAY_MS = 40

const HEADER_NAV_LINK_CLASS =
  'text-slate-900 transition hover:opacity-75 hover:underline hover:underline-offset-4'

export function MegaMenuNav() {
  const queryClient = useQueryClient()
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const [activeSubId, setActiveSubId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null)

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const subTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const openCategory =
    MEGA_MENU_CATEGORIES.find((c) => c.id === openCategoryId) ?? null
  const activeSub =
    openCategory?.subs.find((s) => s.id === activeSubId) ?? openCategory?.subs[0] ?? null

  function clearTimers() {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    if (subTimerRef.current) clearTimeout(subTimerRef.current)
    openTimerRef.current = null
    closeTimerRef.current = null
    subTimerRef.current = null
  }

  function scheduleOpen(category: MegaMenuCategory) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (openCategoryId === category.id) return
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      setOpenCategoryId(category.id)
      const firstSub = category.subs[0]
      setActiveSubId(firstSub?.id ?? null)
      void prefetchOfficeCatalogForHref(queryClient, category.href)
      if (firstSub) void prefetchMegaMenuPreview(queryClient, firstSub.preview)
      // Prefetch leggero delle altre sottocategorie per hover successivi fluidi.
      for (const sub of category.subs.slice(1, 4)) {
        void prefetchMegaMenuPreview(queryClient, sub.preview)
      }
    }, OPEN_DELAY_MS)
  }

  function scheduleClose() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setOpenCategoryId(null)
      setActiveSubId(null)
    }, CLOSE_DELAY_MS)
  }

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function scheduleSub(sub: MegaMenuSubItem) {
    if (subTimerRef.current) clearTimeout(subTimerRef.current)
    // Prefetch immediato al primo passaggio; lo switch UI resta debounced.
    void prefetchMegaMenuPreview(queryClient, sub.preview)
    void prefetchOfficeCatalogForHref(queryClient, sub.href)
    subTimerRef.current = setTimeout(() => {
      setActiveSubId(sub.id)
    }, SUB_HOVER_DELAY_MS)
  }

  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenCategoryId(null)
        setActiveSubId(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    function onDoc(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [mobileOpen])

  return (
    <nav ref={navRef} className="relative z-40 border-t border-slate-100 border-b border-slate-200 bg-white">
      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl px-4 sm:px-6 lg:block lg:px-8">
        <div
          className="flex min-h-12 items-center justify-center gap-x-10 whitespace-nowrap py-3 text-sm font-semibold tracking-[0.03em] sm:gap-x-12 sm:text-[15px]"
          onMouseLeave={scheduleClose}
        >
          {MEGA_MENU_CATEGORIES.map((category) => {
            const isOpen = openCategoryId === category.id
            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => scheduleOpen(category)}
                onMouseLeave={() => {
                  if (openTimerRef.current) {
                    clearTimeout(openTimerRef.current)
                    openTimerRef.current = null
                  }
                }}
              >
                <Link
                  to={category.href}
                  className={`inline-flex items-center gap-1 ${HEADER_NAV_LINK_CLASS} ${
                    isOpen ? 'opacity-75 underline underline-offset-4' : ''
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onFocus={() => scheduleOpen(category)}
                >
                  {category.label}
                  <ChevronDown
                    className={`size-4 opacity-70 transition ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {openCategory && activeSub ? (
        <div
          className="absolute inset-x-0 top-full z-50 hidden border-b border-slate-200 bg-white shadow-xl lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          role="region"
          aria-label={`Menu ${openCategory.label}`}
        >
          <div className="mx-auto grid max-h-[min(75vh,36rem)] max-w-7xl grid-cols-[minmax(14rem,18rem)_1fr] gap-0 px-4 sm:px-6 lg:px-8">
            <div className="max-h-[min(75vh,36rem)] overflow-y-auto overscroll-contain border-r border-slate-100 py-4 pr-3">
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {openCategory.label}
              </p>
              <ul className="space-y-0.5">
                {openCategory.subs.map((sub) => {
                  const selected = activeSub.id === sub.id
                  return (
                    <li key={sub.id}>
                      <Link
                        to={sub.href}
                        className={[
                          'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition',
                          selected
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                        ].join(' ')}
                        onMouseEnter={() => scheduleSub(sub)}
                        onFocus={() => {
                          setActiveSubId(sub.id)
                          void prefetchMegaMenuPreview(queryClient, sub.preview)
                          void prefetchOfficeCatalogForHref(queryClient, sub.href)
                        }}
                        onClick={() => {
                          setOpenCategoryId(null)
                          setActiveSubId(null)
                        }}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <Link
                to={openCategory.href}
                className="mt-3 block px-3 text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
                onClick={() => {
                  setOpenCategoryId(null)
                  setActiveSubId(null)
                }}
              >
                Vedi tutta la categoria
              </Link>
            </div>

            <MegaMenuPreviewPane
              categoryLabel={openCategory.label}
              sub={activeSub}
              onNavigate={() => {
                setOpenCategoryId(null)
                setActiveSubId(null)
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Mobile */}
      <div className="mx-auto max-w-7xl px-4 lg:hidden sm:px-6">
        <div className="flex min-h-12 items-center justify-between py-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
            aria-expanded={mobileOpen}
            aria-controls="mega-menu-mobile-panel"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            Categorie
          </button>
          <Link to="/office-products?catalog=ufficio" className={`text-sm font-semibold ${HEADER_NAV_LINK_CLASS}`}>
            Shop
          </Link>
        </div>

        {mobileOpen ? (
          <div id="mega-menu-mobile-panel" className="border-t border-slate-100 pb-4 pt-2">
            <ul className="divide-y divide-slate-100">
              {MEGA_MENU_CATEGORIES.map((category) => {
                const expanded = mobileExpandedId === category.id
                const panelId = `mega-acc-${category.id}`
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-slate-900"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() =>
                        setMobileExpandedId((prev) => (prev === category.id ? null : category.id))
                      }
                    >
                      {category.label}
                      <ChevronDown
                        className={`size-4 shrink-0 text-slate-500 transition ${expanded ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    {expanded ? (
                      <ul id={panelId} className="space-y-1 pb-3 pl-1">
                        <li>
                          <Link
                            to={category.href}
                            className="block rounded-md px-2 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                            onClick={() => setMobileOpen(false)}
                          >
                            Tutti · {category.label}
                          </Link>
                        </li>
                        {category.subs.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={sub.href}
                              className="block rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  )
}

function MegaMenuPreviewPane({
  categoryLabel,
  sub,
  onNavigate,
}: {
  categoryLabel: string
  sub: MegaMenuSubItem
  onNavigate: () => void
}) {
  const headingId = useId()
  const query = useQuery({
    queryKey: megaMenuPreviewQueryKey(sub.preview),
    queryFn: () => fetchMegaMenuPreviewProducts(sub.preview),
    enabled: sub.preview.kind !== 'none',
    staleTime: 60_000,
  })

  if (sub.preview.kind === 'none') {
    return (
      <div className="flex min-h-[14rem] flex-col justify-center gap-3 px-6 py-8">
        <h3 id={headingId} className="text-base font-semibold text-slate-900">
          {sub.label}
        </h3>
        <p className="max-w-md text-sm text-slate-600">
          Scopri il servizio dedicato di Astro Forniture: preventivi rapidi e assistenza
          personalizzata.
        </p>
        <Link
          to={sub.href}
          onClick={onNavigate}
          className="inline-flex w-fit items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Vai a {sub.label}
        </Link>
      </div>
    )
  }

  const products = query.data ?? []
  const showInitialSpinner = query.isPending && products.length === 0

  return (
    <div className="flex min-h-0 max-h-[min(75vh,36rem)] flex-col px-4 py-5 sm:px-6">
      <div className="mb-3 flex shrink-0 items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Catalogo · {categoryLabel}
          </p>
          <h3 id={headingId} className="text-base font-semibold text-slate-900">
            {sub.label}
            {products.length > 0 ? (
              <span className="ml-2 text-xs font-medium text-slate-500">
                {products.length} articol{products.length === 1 ? 'o' : 'i'}
              </span>
            ) : null}
          </h3>
        </div>
        <Link
          to={sub.href}
          onClick={onNavigate}
          className="shrink-0 text-xs font-semibold text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
        >
          Apri pagina
        </Link>
      </div>

      {showInitialSpinner ? (
        <div className="flex min-h-[10rem] flex-1 items-center justify-center text-slate-400">
          <Loader2 className="size-6 animate-spin" aria-label="Caricamento prodotti" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[10rem] flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-slate-500">Nessun prodotto disponibile.</p>
          <Link
            to={sub.href}
            onClick={onNavigate}
            className="text-sm font-semibold text-slate-800 underline-offset-2 hover:underline"
          >
            Apri la categoria
          </Link>
        </div>
      ) : (
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
          onWheel={(event) => event.stopPropagation()}
        >
          <ul className="grid grid-cols-2 gap-3 pb-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product: OfficeProduct) => (
              <li key={product.id} className="min-w-0" onClick={onNavigate}>
                <CompactOfficeProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
