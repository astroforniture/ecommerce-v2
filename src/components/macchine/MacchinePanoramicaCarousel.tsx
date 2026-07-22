import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  CASSE_DITRON_CATALOG,
  CASSE_DITRON_OFFICE_ID_PREFIX,
} from '../../data/casseDitronProducts'
import { productDetailPath } from '../../lib/productRoutes'

const AUTO_ADVANCE_MS = 6500

type PanoramicaSlide = {
  id: string
  title: string
  description: string
  imageUrl: string
  href: string
}

function buildPanoramicaSlides(): PanoramicaSlide[] {
  const byCatalogId = new Map(CASSE_DITRON_CATALOG.map((row) => [row.id, row]))

  const specs: Array<{
    catalogId: string
    title: string
    description: string
  }> = [
    {
      catalogId: 'advance-safemoney',
      title: 'ADVANCE | SafeMoney',
      description:
        'La soluzione intelligente per la gestione automatica del contante. Sicurezza totale, zero errori di cassa e massima igiene per il tuo punto vendita.',
    },
    {
      catalogId: 'pax-q58-gem',
      title: 'PAX SERIE Q58 GEM | POS Bancario',
      description:
        'Terminale di pagamento Android di ultima generazione. Transazioni veloci, connettività affidabile e massima flessibilità per ogni tipo di attività.',
    },
    {
      catalogId: 'new-ideal',
      title: 'NEW iDEAL | Registratore di Cassa',
      description:
        'Interamente progettate in Italia e realizzate dai nostri ingegneri. La più ampia gamma di soluzioni per il punto cassa pensata per funzionare sempre e senza vincoli per te.',
    },
  ]

  return specs.flatMap((spec) => {
    const row = byCatalogId.get(spec.catalogId)
    if (!row) return []
    const productId = `${CASSE_DITRON_OFFICE_ID_PREFIX}${row.id}`
    return [
      {
        id: row.id,
        title: spec.title,
        description: spec.description,
        imageUrl: row.imageUrl,
        href: productDetailPath({ id: productId, producerCode: productId }),
      },
    ]
  })
}

const SLIDES = buildPanoramicaSlides()

export function MacchinePanoramicaCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const liveRef = useRef<HTMLDivElement>(null)

  const slideCount = SLIDES.length
  const active = SLIDES[index] ?? SLIDES[0]

  useEffect(() => {
    if (paused || slideCount <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slideCount)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [paused, slideCount])

  if (!active) return null

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 shadow-sm"
      aria-roledescription="carousel"
      aria-label="Panoramica soluzioni punto cassa"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div className="grid min-h-[18rem] gap-6 p-6 sm:min-h-[20rem] sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
        <div className="relative z-10 flex min-w-0 flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
            In evidenza
          </p>
          <div
            ref={liveRef}
            aria-live="polite"
            aria-atomic="true"
            className="mt-3"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] lg:leading-tight">
              {active.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {active.description}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to={active.href}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Scopri di più
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[14rem] items-center justify-center rounded-xl bg-white/70 ring-1 ring-slate-200/60 sm:min-h-[16rem]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={[
                'absolute inset-0 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-500 ease-out',
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              ].join(' ')}
              aria-hidden={i !== index}
            >
              <img
                src={slide.imageUrl}
                alt=""
                className="max-h-full max-w-full object-contain drop-shadow-md"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-5 sm:right-5">
        {SLIDES.map((slide, i) => {
          const selected = i === index
          return (
            <button
              key={slide.id}
              type="button"
              aria-label={`Vai alla slide ${i + 1}: ${slide.title}`}
              aria-current={selected ? 'true' : undefined}
              onClick={() => setIndex(i)}
              className={[
                'size-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                selected
                  ? 'scale-110 bg-brand-700 shadow-sm'
                  : 'bg-slate-300 hover:bg-slate-400',
              ].join(' ')}
            />
          )
        })}
      </div>
    </section>
  )
}
