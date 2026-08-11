import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import {
  AGENDE_CATEGORY_HERO_IMAGE_URL,
  agendeCategoryHref,
} from '../../lib/agendeCatalog'

const PROMO_TITLE = 'Agende 2027'
const PROMO_SUBTITLE = 'Scopri la Nuova Collezione Agende 2027'
const PROMO_CTA = 'Esplora le Agende'

export function HomeAgende2027PromoSection() {
  return (
    <section
      className="bg-white"
      aria-labelledby="home-agende-2027-heading"
    >
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 sm:pb-5 sm:pt-8 lg:px-8">
        <Link
          to={agendeCategoryHref()}
          className="home-agende-promo-card group relative block overflow-hidden rounded-2xl border border-slate-200/80 shadow-md transition duration-500 hover:scale-[1.02] hover:border-brand-300/60 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2"
        >
          <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]">
            <img
              src={AGENDE_CATEGORY_HERO_IMAGE_URL}
              alt="Nuova collezione Agende 2027"
              className="absolute inset-0 size-full object-cover object-[center_30%] transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-900/75 to-slate-900/40"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/15"
              aria-hidden
            />

            <span
              className="home-agende-promo-shine pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden
            />

            <div className="relative flex min-h-[220px] flex-col justify-center px-6 py-8 sm:min-h-[260px] sm:px-10 sm:py-10 lg:min-h-[300px] lg:px-12">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200 sm:text-sm">
                <Sparkles className="size-3.5 shrink-0 animate-pulse" aria-hidden />
                Novità 2027
              </p>
              <h2
                id="home-agende-2027-heading"
                className="home-agende-promo-title mt-3 text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl"
              >
                {PROMO_TITLE}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-100 drop-shadow-sm sm:text-lg">
                {PROMO_SUBTITLE}
              </p>
              <span className="home-agende-promo-cta mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-lg transition duration-300 group-hover:scale-105 group-hover:bg-brand-50 group-hover:shadow-xl sm:px-6 sm:py-3.5 sm:text-base">
                {PROMO_CTA}
                <ArrowRight
                  className="size-4 transition duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
