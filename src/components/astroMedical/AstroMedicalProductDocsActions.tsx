import { useEffect, useId, useState } from 'react'
import { Download, ExternalLink, FileText, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import type { OfficeProduct } from '../../types/officeProduct'

type DocKind = 'brochure' | 'manual'

type Props = {
  product: Pick<
    OfficeProduct,
    'name' | 'brochureUrl' | 'brochureLinkLabel' | 'catalogPagePdfUrl' | 'catalogPagePdfLabel'
  >
  compact?: boolean
}

/**
 * Azioni rapide scheda tecnica / manuale PDF sulle card Astro Medical + Quick View.
 */
export function AstroMedicalProductDocsActions({ product, compact = false }: Props) {
  const titleId = useId()
  const brochureUrl = (product.brochureUrl ?? '').trim()
  const manualUrl = (product.catalogPagePdfUrl ?? '').trim()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<DocKind>(brochureUrl ? 'brochure' : 'manual')

  useEffect(() => {
    if (!open) return
    setActive(brochureUrl ? 'brochure' : 'manual')
  }, [open, brochureUrl])

  if (!brochureUrl && !manualUrl) return null

  const previewUrl = active === 'brochure' ? brochureUrl : manualUrl
  const brochureLabel = product.brochureLinkLabel?.trim() || 'Scheda tecnica'
  const manualLabel = product.catalogPagePdfLabel?.trim() || 'Manuale PDF'

  const btnBase = compact
    ? 'inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition'
    : 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition'

  return (
    <>
      <div className={compact ? 'mt-2 flex gap-1.5' : 'mt-3 flex gap-2'}>
        {brochureUrl ? (
          <button
            type="button"
            className={[
              btnBase,
              'border-medical-200 bg-medical-50 text-medical-900 hover:border-medical-400 hover:bg-medical-100',
            ].join(' ')}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActive('brochure')
              setOpen(true)
            }}
          >
            <FileText className={compact ? 'size-3' : 'size-3.5'} aria-hidden />
            Scheda
          </button>
        ) : null}
        {manualUrl ? (
          <button
            type="button"
            className={[
              btnBase,
              'border-slate-200 bg-white text-slate-800 hover:border-medical-300 hover:bg-medical-50',
            ].join(' ')}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActive('manual')
              setOpen(true)
            }}
          >
            <BookOpen className={compact ? 'size-3' : 'size-3.5'} aria-hidden />
            PDF
          </button>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[92vh] w-[min(96vw,56rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
          <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-4 pr-12 text-left">
            <DialogTitle id={titleId} className="line-clamp-2 text-base text-slate-900 sm:text-lg">
              {product.name.trim()}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Anteprima documenti tecnici del prodotto
            </DialogDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              {brochureUrl ? (
                <button
                  type="button"
                  aria-pressed={active === 'brochure'}
                  className={[
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    active === 'brochure'
                      ? 'bg-medical-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                  onClick={() => setActive('brochure')}
                >
                  {brochureLabel}
                </button>
              ) : null}
              {manualUrl ? (
                <button
                  type="button"
                  aria-pressed={active === 'manual'}
                  className={[
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    active === 'manual'
                      ? 'bg-medical-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                  onClick={() => setActive('manual')}
                >
                  {manualLabel}
                </button>
              ) : null}
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 bg-slate-100">
            {previewUrl ? (
              <iframe
                key={previewUrl}
                title={`Anteprima - ${active === 'brochure' ? brochureLabel : manualLabel}`}
                src={previewUrl}
                className="h-[min(62vh,720px)] w-full border-0 bg-white"
              />
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-white px-4 py-3">
            {previewUrl ? (
              <>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  Apri in nuova scheda
                </a>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-medical-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-medical-800"
                >
                  <Download className="size-3.5" aria-hidden />
                  Scarica / Apri PDF
                </a>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
