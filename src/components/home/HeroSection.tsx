import { lineaAstroMedicalCatalogPath } from '../../data/iHealthAstroMedicalProducts'
import { HoverImagePreviewTrigger } from '../astroMedical/HoverImagePreviewTrigger'

const HERO_DECORATIVE_IMAGE_URL = '/Articoli_Cancelleria_Ufficio.jpg'

const ASTRO_LEGATORIA_URL = 'https://astrolegatoria.it/'

/** Anteprime hover (desktop) — Astro Legatoria */
const RILEGATURE_NOTARILI_PREVIEW_URL =
  'https://astrolegatoria.it/images/lavorazione-cucitura.jpg'
const TESI_PREVIEW_URL = 'https://astrolegatoria.it/images/hero-tesi-blu.jpg'

const LINE_CARD_CLASS =
  'block cursor-pointer rounded-2xl bg-[#0A362D] p-6 text-white shadow-sm transition-all duration-200 hover:bg-[#0f4d40] hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2'

export function HeroSection() {
  return (
    <section className="bg-white" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-6 lg:grid-cols-12 sm:pt-8">
        <div className="lg:col-span-5">
          <img
            src={HERO_DECORATIVE_IMAGE_URL}
            alt="Articoli da ufficio: penne, forbici e clip ordinate"
            width={1200}
            height={520}
            className="h-auto w-full rounded-2xl object-cover shadow-md"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="lg:col-span-7">
          <h1
            id="hero-heading"
            className="text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-5xl"
          >
            IL TUO UFFICIO, EVOLUTO.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-700 sm:text-xl">
            Forniture per uffici, aziende, scuole e professionisti: carta, cancelleria, toner,
            archivio, macchine per ufficio e materiale di consumo. Ordina online o richiedi un
            preventivo personalizzato.
          </p>

          <div className="mt-6 space-y-4">
            <HoverImagePreviewTrigger
              as="link"
              to={lineaAstroMedicalCatalogPath()}
              className="block w-full"
              triggerClassName={LINE_CARD_CLASS}
              placement="right"
              previewCaption="Visita Astro Medical Shop"
            >
              <h3 className="mb-2 text-xl font-bold">Astro Medical Shop</h3>
              <p className="text-sm text-gray-200">
                Linea dedicata ad articoli e apparecchi professionali per il settore medicale.
              </p>
            </HoverImagePreviewTrigger>

            <HoverImagePreviewTrigger
              href={ASTRO_LEGATORIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
              triggerClassName={LINE_CARD_CLASS}
              placement="right"
              previewImageUrl={RILEGATURE_NOTARILI_PREVIEW_URL}
              previewAlt="Lavorazione cucitura rilegature notarili"
              previewCaption="Rilegature Notarili"
            >
              <h3 className="mb-2 text-xl font-bold">Rilegature Notarili</h3>
              <p className="text-sm text-gray-200">
                Servizi di rilegatura notarile con lavorazioni curate e consegna rapida.
              </p>
            </HoverImagePreviewTrigger>

            <HoverImagePreviewTrigger
              href={ASTRO_LEGATORIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
              triggerClassName={LINE_CARD_CLASS}
              placement="right"
              previewImageUrl={TESI_PREVIEW_URL}
              previewAlt="Rilegatura tesi con copertina blu"
              previewCaption="Rilegatura Tesi"
            >
              <h3 className="mb-2 text-xl font-bold">Tesi</h3>
              <p className="text-sm text-gray-200">
                Stampa e rilegatura tesi con copertine professionali e finiture personalizzate.
              </p>
            </HoverImagePreviewTrigger>
          </div>
        </div>
      </div>
    </section>
  )
}
