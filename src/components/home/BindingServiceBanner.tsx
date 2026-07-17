import { useState } from 'react'

const ASTRO_LEGATORIA_URL = 'https://www.astrolegatoria.it/'

const BINDING_IMAGE_URL =
  'https://static.wixstatic.com/media/617993_fc197a9f5548452685669861fa2865fc~mv2.jpg/v1/fill/w_320,h_320,q_90,enc_avif,quality_auto/617993_fc197a9f5548452685669861fa2865fc~mv2.jpg'

export function BindingServiceBanner() {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <section className="bg-white pb-6 pt-4 sm:pb-8 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-white to-brand-50/40 shadow-sm">
          <div className="grid items-stretch md:grid-cols-[1.05fr_1fr]">
            <div className="relative flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
              {showOptions ? (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOptions(false)}
                      className="text-sm font-semibold text-brand-700 underline-offset-4 hover:text-brand-800 hover:underline"
                    >
                      Indietro
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOptions(false)}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg leading-none text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      aria-label="Chiudi e torna alla descrizione"
                    >
                      ×
                    </button>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Come possiamo aiutarti?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 sm:text-base">
                    Scegli il percorso più adatto a te.
                  </p>
                  <div className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:gap-4">
                    <a
                      href={ASTRO_LEGATORIA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-4 text-center text-sm font-semibold leading-snug text-white shadow-sm transition hover:bg-brand-800 active:scale-[0.99] sm:py-5 sm:text-base"
                    >
                      Sei uno studente? creiamo la tua tesi!
                    </a>
                    <a
                      href={ASTRO_LEGATORIA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-slate-800 bg-slate-900 px-5 py-4 text-center text-sm font-semibold leading-snug text-white shadow-sm transition hover:border-slate-700 hover:bg-slate-800 active:scale-[0.99] sm:py-5 sm:text-base"
                    >
                      Preventivi personalizzati per Notai
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                    Servizio Professionale
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    Rilegature Notarili e Tesi
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    Soluzioni curate per studi notarili, uffici e studenti: finiture eleganti, materiali
                    resistenti e consegna rapida.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowOptions(true)}
                      className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto sm:text-base"
                    >
                      Scopri il servizio
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="relative min-h-[220px] overflow-hidden bg-slate-100 md:min-h-[280px]">
              <img
                src={BINDING_IMAGE_URL}
                alt="Rilegature notarili e tesi"
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/10"
                aria-hidden
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
