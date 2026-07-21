import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, Settings2, X } from 'lucide-react'
import {
  acceptAllCookieConsent,
  hasCookieConsentDecision,
  readCookieConsent,
  rejectOptionalCookieConsent,
  saveCookieConsent,
  type CookieConsentPreferences,
} from '../../lib/cookieConsent'

type PanelMode = 'banner' | 'preferences'

const CATEGORY_INFO = [
  {
    key: 'necessary' as const,
    title: 'Cookie tecnici',
    description:
      'Necessari al funzionamento del sito (carrello, sessione, sicurezza). Non possono essere disattivati.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    title: 'Cookie analitici',
    description:
      'Ci aiutano a capire come viene usato il sito in forma aggregata, per migliorare servizi e contenuti.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    title: 'Cookie di marketing',
    description:
      'Usati per proporre contenuti e offerte più pertinenti, anche tramite strumenti di terzi.',
    locked: false,
  },
] as const

export function CookieConsentBanner() {
  const titleId = useId()
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<PanelMode>('banner')
  const [prefs, setPrefs] = useState<CookieConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = readCookieConsent()
    if (existing) {
      setPrefs(existing.preferences)
      setVisible(false)
    } else {
      setVisible(true)
      setMode('banner')
    }

    function onOpenPreferences() {
      const current = readCookieConsent()
      setPrefs(current?.preferences ?? { necessary: true, analytics: false, marketing: false })
      setMode('preferences')
      setVisible(true)
    }

    window.addEventListener('af:cookie-preferences-open', onOpenPreferences)
    return () => window.removeEventListener('af:cookie-preferences-open', onOpenPreferences)
  }, [])

  function dismissWith(next: CookieConsentPreferences) {
    saveCookieConsent(next)
    setPrefs(next)
    setVisible(false)
    setMode('banner')
  }

  function handleAcceptAll() {
    const record = acceptAllCookieConsent()
    setPrefs(record.preferences)
    setVisible(false)
    setMode('banner')
  }

  function handleReject() {
    const record = rejectOptionalCookieConsent()
    setPrefs(record.preferences)
    setVisible(false)
    setMode('banner')
  }

  function handleSavePreferences() {
    dismissWith({
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    })
  }

  if (!visible) {
    if (!hasCookieConsentDecision()) return null
    return (
      <button
        type="button"
        onClick={() => {
          setMode('preferences')
          setVisible(true)
        }}
        className="fixed bottom-4 left-4 z-[90] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-900"
        aria-label="Gestisci preferenze cookie"
      >
        <Cookie className="size-3.5 text-brand-700" aria-hidden />
        Cookie
      </button>
    )
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[95] p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/80 to-white px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <h2 id={titleId} className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <Cookie className="size-5 shrink-0 text-brand-700" aria-hidden />
              {mode === 'banner' ? 'Informativa sui cookie' : 'Preferenze cookie'}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Utilizziamo cookie tecnici e, solo con il tuo consenso, cookie analitici e di marketing.
              Consulta la{' '}
              <Link
                to="/privacy-policy"
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>{' '}
              e la{' '}
              <Link
                to="/cookie-policy"
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          {hasCookieConsentDecision() ? (
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Chiudi"
            >
              <X className="size-4.5" aria-hidden />
            </button>
          ) : null}
        </div>

        {mode === 'preferences' ? (
          <div className="max-h-[min(50vh,360px)] space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
            {CATEGORY_INFO.map((category) => {
              const checked =
                category.key === 'necessary' ? true : prefs[category.key]
              return (
                <label
                  key={category.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 ${
                    category.locked
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-brand-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    disabled={category.locked}
                    onChange={(e) => {
                      if (category.locked) return
                      setPrefs((prev) => ({
                        ...prev,
                        [category.key]: e.target.checked,
                      }))
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">
                      {category.title}
                      {category.locked ? (
                        <span className="ml-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Sempre attivi
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                      {category.description}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:px-5">
          {mode === 'banner' ? (
            <>
              <button
                type="button"
                onClick={() => setMode('preferences')}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:mr-auto"
              >
                <Settings2 className="size-4" aria-hidden />
                Personalizza
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Rifiuta
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Accetta tutti
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMode('banner')}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:mr-auto"
              >
                Indietro
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Solo tecnici
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Salva preferenze
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
