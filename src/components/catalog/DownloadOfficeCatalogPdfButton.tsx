import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import {
  downloadOfficeCatalogPdf,
  type OfficeCatalogPdfProgress,
} from '../../lib/officeCatalogPdf'

type Props = {
  /** Variante stile bottone. */
  variant?: 'header' | 'admin'
  className?: string
}

export function DownloadOfficeCatalogPdfButton({
  variant = 'header',
  className = '',
}: Props) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<OfficeCatalogPdfProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    setError(null)
    setProgress({ phase: 'loading', current: 0, total: 0 })
    try {
      await downloadOfficeCatalogPdf(setProgress)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error('[catalog-pdf]', err)
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }

  const label =
    progress?.phase === 'loading'
      ? 'Carico catalogo...'
      : progress?.phase === 'rendering' && progress.total > 0
        ? `PDF ${progress.current}/${progress.total}`
        : 'Scarica Catalogo PDF'

  if (variant === 'admin') {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => void handleClick()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Download className="size-4" aria-hidden />
          )}
          {label}
        </button>
        <p className="mt-2 text-xs text-slate-500">
          Catalogo ufficio/cancelleria (esclusa linea Astro Medical / GIMA). Puo richiedere
          qualche minuto.
        </p>
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy}
        title="Scarica catalogo PDF (ufficio, senza GIMA/medical)"
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs"
      >
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <Download className="size-3.5" aria-hidden />
        )}
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{busy ? 'PDF...' : 'PDF'}</span>
      </button>
      {error ? (
        <p className="absolute left-0 top-full z-10 mt-1 max-w-[220px] rounded-md bg-red-50 px-2 py-1 text-[10px] text-red-700 shadow">
          {error}
        </p>
      ) : null}
    </div>
  )
}
