import { AGENDE_CATEGORY } from '../../lib/officeCategories'
import {
  AGENDE_CATEGORY_DESCRIPTION,
  AGENDE_CATEGORY_HERO_IMAGE_URL,
} from '../../lib/agendeCatalog'

type Props = {
  className?: string
}

/** Banner in testa alla macro-categoria Agende. */
export function AgendeCategoryHero({ className = '' }: Props) {
  return (
    <section
      className={['relative mt-4 overflow-hidden rounded-2xl border border-slate-200 shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="agende-hero-heading"
    >
      <div className="relative min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]">
        <img
          src={AGENDE_CATEGORY_HERO_IMAGE_URL}
          alt="Selezione di agende da ufficio"
          className="absolute inset-0 size-full object-cover object-[center_30%]"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10"
          aria-hidden
        />
        <div className="relative flex min-h-[200px] max-w-2xl flex-col justify-end px-5 py-8 sm:min-h-[240px] sm:px-8 sm:py-10 lg:min-h-[280px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 drop-shadow-sm sm:text-sm">
            Pianificazione
          </p>
          <h1
            id="agende-hero-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl"
          >
            {AGENDE_CATEGORY}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-50 drop-shadow-sm sm:text-base">
            {AGENDE_CATEGORY_DESCRIPTION}
          </p>
        </div>
      </div>
    </section>
  )
}
