import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  AGENDE_CATEGORY_HERO_IMAGE_URL,
  agendeCategoryHref,
} from '../../lib/agendeCatalog'

const STORAGE_KEY = 'af:agende-2027-welcome-modal:v1'
const OPEN_DELAY_MS = 2500

const TITLE = 'Siamo i primi! Scopri la nuova collezione Agende 2027'
const SUBTITLE =
  'Organizza al meglio il tuo nuovo anno con le nostre agende giornaliere, settimanali e planning.'
const CTA_LABEL = 'Scopri le Agende 2027'
const HERO_IMAGE = AGENDE_CATEGORY_HERO_IMAGE_URL || 'https://www.bernispa.com/storage/media/51569/alfa.jpg'

function wasDismissedThisSession(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markDismissedThisSession() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Pop-up promozionale Agende 2027 — storefront (homepage e landing).
 * Ritardo ~2.5s; non riproposto nella stessa sessione dopo chiusura.
 */
export function Agende2027WelcomeModal() {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  const onAgendeRoute =
    location.pathname === '/agende' || location.pathname.startsWith('/agende/')

  useEffect(() => {
    if (onAgendeRoute || wasDismissedThisSession()) {
      setReady(true)
      setOpen(false)
      return
    }
    setReady(true)
    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [onAgendeRoute, location.pathname])

  function closeModal() {
    markDismissedThisSession()
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onEsc)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!ready || !open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agende-2027-welcome-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]"
        onClick={closeModal}
        aria-label="Chiudi popup Agende 2027"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-4xl">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900 sm:right-4 sm:top-4"
          aria-label="Chiudi"
        >
          <X className="size-6" strokeWidth={2.25} aria-hidden />
        </button>

        <div className="grid min-h-0 flex-1 md:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[200px] overflow-hidden bg-slate-900 sm:min-h-[260px] md:min-h-[420px]">
            <img
              src={HERO_IMAGE}
              alt="Collezione Agende 2027"
              className="absolute inset-0 size-full object-cover object-[center_28%]"
              loading="eager"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-slate-950/25"
              aria-hidden
            />
          </div>

          <div className="flex flex-col justify-center overflow-y-auto p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Novità 2027
            </p>
            <h2
              id="agende-2027-welcome-title"
              className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-[2rem]"
            >
              {TITLE}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {SUBTITLE}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8">
              <Link
                to={agendeCategoryHref()}
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 sm:px-8 sm:py-4 sm:text-lg"
              >
                {CTA_LABEL}
              </Link>
              <button
                type="button"
                onClick={closeModal}
                className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
              >
                Continua a navigare
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
