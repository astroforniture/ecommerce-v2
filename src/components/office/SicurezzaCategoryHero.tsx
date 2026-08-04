import { SICUREZZA_CATEGORY } from '../../lib/officeCategories'
import { SICUREZZA_CATEGORY_HERO_IMAGE_URL } from '../../lib/sicurezzaCatalog'

type Props = {
  className?: string
}

/** Banner d’impatto in testa alla macro-categoria Sicurezza. */
export function SicurezzaCategoryHero({ className = '' }: Props) {
  return (
    <section
      className={['relative mt-4 overflow-hidden rounded-2xl border border-slate-200 shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="sicurezza-hero-heading"
    >
      <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]">
        <img
          src={SICUREZZA_CATEGORY_HERO_IMAGE_URL}
          alt="Operatore in magazzino con elmetto di protezione"
          className="absolute inset-0 size-full object-cover object-[center_20%]"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-900/20"
          aria-hidden
        />
        <div className="relative flex min-h-[220px] max-w-2xl flex-col justify-end px-5 py-8 sm:min-h-[280px] sm:px-8 sm:py-10 lg:min-h-[320px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 sm:text-sm">
            Antinfortunistica
          </p>
          <h1
            id="sicurezza-hero-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {SICUREZZA_CATEGORY}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
            DPI e abbigliamento professionale per ambienti di lavoro, cantieri e magazzini: protezione,
            segnaletica e conformità normativa.
          </p>
        </div>
      </div>
    </section>
  )
}
