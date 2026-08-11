/** PDF informativo ufficiale — file in `public/pdf/`. */
const ASTRO_SALUTE_PDF_URL = '/pdf/POLIAMBULATORIO%20ASTRO%20SALUTE.pdf'

/** Banner ufficiale Poliambulatorio (export da PDF informativo). */
const ASTRO_SALUTE_BANNER_IMAGE = '/images/banners/astro-salute.jpg'
const ASTRO_SALUTE_SERVICES_IMAGE = '/astro-salute/image_e0ce46.png'

const ASTRO_SALUTE_LABEL =
  'Poliambulatorio Astro Salute - Punto prelievi convenzionato ATS e Regione Lombardia | Medicina del lavoro e dello sport'

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
          href={ASTRO_SALUTE_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2"
          aria-label={`Apri il PDF informativo: ${ASTRO_SALUTE_LABEL}`}
        >
          <img
            src={ASTRO_SALUTE_BANNER_IMAGE}
            alt={ASTRO_SALUTE_LABEL}
            width={1500}
            height={1000}
            className="block w-full bg-white object-contain transition duration-300 group-hover:scale-[1.01]"
            loading="lazy"
            decoding="async"
          />
        </a>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-5">
          <img
            src={ASTRO_SALUTE_SERVICES_IMAGE}
            alt="Astro Salute: medici esperti, trattamento personalizzato, qualità e sicurezza, servizio immediato"
            width={1400}
            height={220}
            className="block w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
