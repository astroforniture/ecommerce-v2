import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, FileText } from 'lucide-react'
import type { OfficeProduct } from '../../types/officeProduct'
import { useCart } from '../../context/CartContext'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import {
  buildTimbroCartVariant,
  TRODAT_INK_COLORS,
  TRODAT_STAMP_MODELS,
  type TimbroSpecialStampType,
  timbroSpecialTypeLabel,
} from '../../lib/timbroAziendeFarmacieProduct'
import { OfficeProductDetailTrustStrip } from './OfficeProductDetailTrustStrip'

const TIMBRO_WHATSAPP_HREF =
  'https://wa.me/393756139937?text=Ciao,%20vorrei%20informazioni%20per%20un%20timbro%20personalizzato'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type Props = {
  product: OfficeProduct
}

export function TimbroAziendeFarmacieDetail({ product }: Props) {
  const { addOfficeProduct } = useCart()
  const [imgOk, setImgOk] = useState(true)
  const [modelCode, setModelCode] = useState<string | null>(null)
  const [specialType, setSpecialType] = useState<TimbroSpecialStampType | null>(null)
  const [colorId, setColorId] = useState<string | null>(null)
  const [lineValues, setLineValues] = useState<string[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const selectedModel = useMemo(
    () => (!specialType ? TRODAT_STAMP_MODELS.find((m) => m.code === modelCode) ?? null : null),
    [modelCode, specialType],
  )

  const effectiveLineCount = specialType ? 3 : selectedModel?.lines ?? 0

  useEffect(() => {
    const n = effectiveLineCount
    if (n <= 0) {
      setLineValues([])
      return
    }
    setLineValues((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ''))
  }, [effectiveLineCount, specialType, modelCode])

  const heroUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const hasStandardModel = Boolean(selectedModel)
  const hasConfig = Boolean(specialType || hasStandardModel)
  const canSubmit = Boolean(colorId && hasConfig)
  const selectedColor = TRODAT_INK_COLORS.find((c) => c.id === colorId)

  function selectTrodatModel(code: string) {
    setSpecialType(null)
    setModelCode(code)
  }

  function selectSpecialType(t: TimbroSpecialStampType) {
    setSpecialType((prev) => {
      if (prev === t) return null
      return t
    })
    setModelCode(null)
  }

  function handleAddQuote() {
    setSubmitAttempted(true)
    if (!selectedColor) return
    if (specialType) {
      const v = buildTimbroCartVariant({
        mode: 'special',
        specialType,
        colorLabel: selectedColor.label,
        textLines: lineValues,
      })
      addOfficeProduct(product, 1, v)
    } else if (selectedModel) {
      const v = buildTimbroCartVariant({
        mode: 'standard',
        model: selectedModel,
        colorLabel: selectedColor.label,
        textLines: lineValues,
      })
      addOfficeProduct(product, 1, v)
    } else {
      return
    }
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  const modelTileClass = (active: boolean, disabled: boolean) =>
    [
      'inline-flex min-h-[2.5rem] flex-col items-start rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
      disabled
        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
        : active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-slate-300 bg-white text-slate-800 hover:border-brand-400',
    ].join(' ')

  const tipoTileClass = (active: boolean) =>
    [
      'inline-flex min-h-[2.5rem] flex-1 flex-col items-center justify-center rounded-xl border px-3 py-2 text-center text-sm font-semibold transition',
      active
        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
        : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400',
    ].join(' ')

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/office-products?category=Cancelleria"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna a Cancelleria
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {imgOk && heroUrl ? (
                <img
                  src={heroUrl}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-contain p-6"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-brand-200">
                  <FileText className="size-32" strokeWidth={1} aria-hidden />
                </div>
              )}
            </div>

            <aside
              className="mt-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 via-white to-white p-4 shadow-sm ring-1 ring-emerald-100/70 sm:p-5"
              aria-label="Assistenza WhatsApp per timbri speciali"
            >
              <p className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                Devi fare un timbro rotondo o fisso? Scrivici su WhatsApp
              </p>
              <a
                href={TIMBRO_WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 sm:text-[0.9375rem]"
              >
                <WhatsAppIcon className="size-5 shrink-0" />
                Scrivici su WhatsApp (375 613 9937)
              </a>
            </aside>

            <dl className="mt-3 space-y-1.5 text-xs text-slate-500">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 font-medium text-slate-500">Categoria</dt>
                <dd className="text-slate-700">{product.category}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.brand}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.description}</p>
            ) : null}

            <p className="mt-5 text-base font-semibold text-slate-800">Prezzo su preventivo (0,00 € + IVA)</p>

            <section className="mt-6" aria-labelledby="timbro-model-heading">
              <h2 id="timbro-model-heading" className="text-sm font-semibold text-slate-900">
                Modello Trodat (misure)
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Scegli una misura oppure, più sotto, Numeratore o Datario come modello speciale (3 righe fisse).
              </p>
              {specialType ? (
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                  Modello speciale attivo ({timbroSpecialTypeLabel(specialType)}): le misure standard non sono
                  applicabili. Tocca di nuovo il tipo selezionato per tornare alle misure Trodat.
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {TRODAT_STAMP_MODELS.map((m) => {
                  const active = !specialType && modelCode === m.code
                  const disabled = Boolean(specialType)
                  return (
                    <button
                      key={m.code}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectTrodatModel(m.code)}
                      className={modelTileClass(active, disabled)}
                      aria-pressed={active}
                    >
                      <span>{m.code}</span>
                      <span
                        className={
                          active
                            ? 'text-xs font-normal text-white/90'
                            : disabled
                              ? 'text-xs font-normal text-slate-400'
                              : 'text-xs font-normal text-slate-600'
                        }
                      >
                        {m.sizeLabel} · {m.lines} {m.lines === 1 ? 'riga' : 'righe'}
                      </span>
                    </button>
                  )
                })}
              </div>
              {submitAttempted && !specialType && !modelCode ? (
                <p className="mt-2 text-xs font-medium text-red-700">
                  Seleziona una misura Trodat oppure Numeratore / Datario.
                </p>
              ) : null}
            </section>

            <section className="mt-6" aria-labelledby="timbro-tipo-heading">
              <h2 id="timbro-tipo-heading" className="text-sm font-semibold text-slate-900">
                Tipo di timbro
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Numeratore o Datario: personalizzazione fissa a 3 righe. Seleziona uno dei due per disattivare le
                misure standard.
              </p>
              <div className="mt-3 flex flex-row gap-2">
                {(['numeratore', 'datario'] as const).map((t) => {
                  const active = specialType === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => selectSpecialType(t)}
                      className={tipoTileClass(active)}
                      aria-pressed={active}
                    >
                      <span>{timbroSpecialTypeLabel(t)}</span>
                      <span className="mt-0.5 text-xs font-normal text-slate-600">
                        3 righe · modello speciale
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="mt-6" aria-labelledby="timbro-color-heading">
              <h2 id="timbro-color-heading" className="text-sm font-semibold text-slate-900">
                Colore inchiostro <span className="text-red-600">*</span>
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TRODAT_INK_COLORS.map((c) => {
                  const active = colorId === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorId(c.id)}
                      className={[
                        'group relative flex flex-col items-center rounded-2xl border-2 bg-white p-2 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                        active ? 'border-brand-600 shadow-md' : 'border-slate-200 hover:border-slate-300',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      {active ? (
                        <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                          <Check className="size-3.5" aria-hidden />
                        </span>
                      ) : null}
                      <span className="relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                        <img
                          src={c.imageUrl}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="mt-2 text-xs font-semibold text-slate-800">{c.label}</span>
                    </button>
                  )
                })}
              </div>
              {submitAttempted && !colorId ? (
                <p className="mt-2 text-xs font-medium text-red-700">Seleziona un colore.</p>
              ) : null}
            </section>

            {effectiveLineCount > 0 ? (
              <section className="mt-6" aria-labelledby="timbro-text-heading">
                <h2 id="timbro-text-heading" className="text-sm font-semibold text-slate-900">
                  Testo da riportare sul timbro
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  {specialType
                    ? `Personalizzazione fissa a ${effectiveLineCount} righe per ${timbroSpecialTypeLabel(specialType)}.`
                    : selectedModel
                      ? `Puoi compilare fino a ${selectedModel.lines} ${selectedModel.lines === 1 ? 'riga' : 'righe'} per il modello ${selectedModel.code}.`
                      : null}
                </p>
                <div className="mt-3 space-y-3">
                  {lineValues.map((val, idx) => (
                    <label
                      key={`line-${specialType ?? modelCode ?? 'std'}-${idx}`}
                      className="block"
                    >
                      <span className="mb-1 block text-xs font-medium text-slate-700">
                        Riga {idx + 1} di {effectiveLineCount}
                      </span>
                      <textarea
                        value={val}
                        onChange={(e) => {
                          const v = e.target.value
                          setLineValues((prev) => {
                            const copy = [...prev]
                            copy[idx] = v
                            return copy
                          })
                        }}
                        rows={2}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                        placeholder={`Testo riga ${idx + 1}`}
                      />
                    </label>
                  ))}
                </div>
              </section>
            ) : (
              <p className="mt-6 text-sm text-slate-600">
                Scegli una misura Trodat oppure Numeratore / Datario per abilitare i campi di testo.
              </p>
            )}

            <div className="mt-8">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleAddQuote}
                className={[
                  'inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition sm:w-auto',
                  canSubmit
                    ? 'bg-brand-700 text-white hover:bg-brand-800'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500',
                ].join(' ')}
              >
                {justAdded ? 'Aggiunto al carrello' : 'Richiedi preventivo'}
              </button>
              {!canSubmit ? (
                <p className="mt-2 text-xs text-slate-600">
                  Completa misura (o tipo speciale) e colore per inviare la richiesta al carrello.
                </p>
              ) : null}
            </div>
            <OfficeProductDetailTrustStrip />
          </div>
        </div>
      </div>
    </main>
  )
}
