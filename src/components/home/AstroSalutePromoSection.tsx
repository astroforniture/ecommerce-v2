/** Sito ufficiale Poliambulatorio Astro Salute. */
const ASTRO_SALUTE_SITE_URL = 'https://www.astro-salute.it/'

/** Banner ufficiale Poliambulatorio (export da PDF informativo). */
const ASTRO_SALUTE_BANNER_IMAGE = '/images/banners/astro-salute.jpg'

const ASTRO_SALUTE_LABEL =
  'Poliambulatorio Astro Salute - Punto prelievi convenzionato ATS e Regione Lombardia | Medicina del lavoro e dello sport'

type AstroSaluteHighlight = {
  title: string
  body: string
  icon: 'doctor' | 'heart' | 'shield' | 'kit'
}

/** Testi rivisti da POLIAMBULATORIO ASTRO SALUTE2.pdf */
const ASTRO_SALUTE_HIGHLIGHTS: readonly AstroSaluteHighlight[] = [
  {
    title: 'Medici esperti',
    body: 'La tua salute è la tua risorsa più importante. Dovresti affidarlo solo ai migliori professionisti.',
    icon: 'doctor',
  },
  {
    title: 'Trattamento Personalizzato',
    body: 'Le scelte terapeutiche si adattano perfettamente ai tuoi obiettivi di trattamento con intervento rapido.',
    icon: 'heart',
  },
  {
    title: 'Qualità e sicurezza',
    body: 'Tutti i membri del team di Astro Salute sono preparati per assistere i pazienti in ogni situazione.',
    icon: 'shield',
  },
  {
    title: 'Servizio immediato',
    body: 'Il tuo piano di trattamento è progettato per progressi costanti.',
    icon: 'kit',
  },
]

function HighlightIcon({ kind }: { kind: AstroSaluteHighlight['icon'] }) {
  const common = {
    width: 36,
    height: 36,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    className: 'h-9 w-9 shrink-0 text-sky-500',
  }

  if (kind === 'doctor') {
    return (
      <svg {...common}>
        <circle cx="24" cy="14" r="7" />
        <path d="M10 40c2.5-8 8-12 14-12s11.5 4 14 12" />
        <path d="M28 18h6v8c0 2-1.5 3.5-3.5 3.5h-1" />
        <circle cx="34" cy="22" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (kind === 'heart') {
    return (
      <svg {...common}>
        <path d="M24 40s-12-7.5-16.5-14C4.5 20 6 13 12 11.5c4-.9 7.5 1.2 9 4.5 1.5-3.3 5-5.4 9-4.5 6 1.5 7.5 8.5 4.5 14.5C36 32.5 24 40 24 40z" />
        <path d="M11 24h6l3-5 4 10 3-5h8" />
      </svg>
    )
  }

  if (kind === 'shield') {
    return (
      <svg {...common}>
        <path d="M24 6l14 5v11c0 9-6.5 16.5-14 20-7.5-3.5-14-11-14-20V11l14-5z" />
        <rect x="18" y="18" width="8" height="10" rx="1.5" />
        <rect x="23" y="20" width="7" height="10" rx="1.5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect x="10" y="14" width="28" height="22" rx="3" />
      <path d="M18 14V12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M24 20v10M19 25h10" />
    </svg>
  )
}

export function AstroSalutePromoSection() {
  return (
    <section
      className="border-t border-slate-100 bg-slate-50 py-10 sm:py-12"
      aria-labelledby="astro-salute-promo-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p id="astro-salute-promo-heading" className="sr-only">
          {ASTRO_SALUTE_LABEL}
        </p>

        <a
          href={ASTRO_SALUTE_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-sky-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 sm:p-4 md:p-5"
          aria-label={`Visita il sito: ${ASTRO_SALUTE_LABEL}`}
        >
          <img
            src={ASTRO_SALUTE_BANNER_IMAGE}
            alt={ASTRO_SALUTE_LABEL}
            width={1500}
            height={1000}
            className="mx-auto block h-auto w-[70%] max-w-full bg-white object-contain transition duration-300 group-hover:scale-[1.01]"
            loading="lazy"
            decoding="async"
          />
        </a>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-[#f6f7f9] px-4 py-6 shadow-sm sm:mt-5 sm:px-6 sm:py-8 lg:px-8">
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ASTRO_SALUTE_HIGHLIGHTS.map((item) => (
              <li key={item.title} className="min-w-0">
                <div className="flex items-start gap-3">
                  <HighlightIcon kind={item.icon} />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-slate-800 sm:text-[1.05rem]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
