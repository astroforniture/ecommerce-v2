import { useMemo } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Cpu } from 'lucide-react'
import {
  buildCasseDitronOfficeProducts,
  CASSE_DITRON_COVER_IMAGE_URL,
  MACCHINE_SUB_CASSE_DITRON_LABEL,
  MACCHINE_SUB_CASSE_DITRON_SLUG,
  macchineUfficioCasseDitronListingPath,
} from '../data/casseDitronProducts'
import {
  buildDistruggidocumentiOfficeProducts,
  DISTRUGGIDOCUMENTI_COVER_IMAGE_URL,
  MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
  MACCHINE_SUB_DISTRUGGI_DOCUMENTI_SLUG,
  macchineUfficioDistruggiDocumentiListingPath,
} from '../data/distruggidocumentiProducts'
import {
  ETICHETTATRICI_COVER_IMAGE_URL,
  MACCHINE_SUB_ETICHETTATRICI_LABEL,
  MACCHINE_SUB_ETICHETTATRICI_SLUG,
  buildEtichettatriciOfficeProducts,
  macchineUfficioEtichettatriciListingPath,
} from '../data/macchineEtichettatrici'
import { macchineUfficioHubPath } from '../lib/macchineUfficioRoutes'
import { OfficeProductCard } from '../components/office/OfficeProductCard'
import {
  OfficeSubcategoryTile,
  OFFICE_SUBCATEGORY_TILE_GRID_CLASS,
} from '../components/office/OfficeSubcategoryTile'
import { MacchinePanoramicaCarousel } from '../components/macchine/MacchinePanoramicaCarousel'

const distruggiListingPath = macchineUfficioDistruggiDocumentiListingPath()
const etichettatriciListingPath = macchineUfficioEtichettatriciListingPath()
const casseDitronListingPath = macchineUfficioCasseDitronListingPath()
const macchineHubPath = macchineUfficioHubPath()

const MACCHINE_SUB_LABEL_BY_SLUG: Record<string, string> = {
  [MACCHINE_SUB_DISTRUGGI_DOCUMENTI_SLUG]: MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
  [MACCHINE_SUB_ETICHETTATRICI_SLUG]: MACCHINE_SUB_ETICHETTATRICI_LABEL,
  [MACCHINE_SUB_CASSE_DITRON_SLUG]: MACCHINE_SUB_CASSE_DITRON_LABEL,
}

function MacchineBreadcrumb() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)
  const leaf = parts[parts.length - 1] ?? ''
  const subLabel = MACCHINE_SUB_LABEL_BY_SLUG[leaf] ?? null
  const showSub = Boolean(subLabel)

  return (
    <nav className="mt-6 text-sm text-slate-600" aria-label="Percorso di navigazione">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="transition hover:text-brand-800">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link
            to={macchineHubPath}
            className={`transition hover:text-brand-800 ${showSub ? '' : 'font-medium text-slate-900'}`}
          >
            Macchine per Ufficio
          </Link>
        </li>
        {showSub && subLabel ? (
          <>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-900">{subLabel}</li>
          </>
        ) : null}
      </ol>
    </nav>
  )
}

function MacchineSidebar() {
  const base =
    'block rounded-lg px-3 py-2.5 text-sm font-semibold transition border border-transparent'
  const inactive = 'text-slate-700 hover:border-slate-200 hover:bg-white'
  const active = 'border-brand-200 bg-brand-50 text-brand-900'

  return (
    <aside className="shrink-0 lg:w-56" aria-label="Sottocategorie Macchine per Ufficio">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Macchine per Ufficio</p>
      <nav className="mt-3 flex flex-col gap-1 border-t border-slate-200 pt-3">
        <NavLink to={macchineHubPath} end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Panoramica
        </NavLink>
        <NavLink
          to={distruggiListingPath}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL}
        </NavLink>
        <NavLink
          to={etichettatriciListingPath}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {MACCHINE_SUB_ETICHETTATRICI_LABEL}
        </NavLink>
        <NavLink
          to={casseDitronListingPath}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {MACCHINE_SUB_CASSE_DITRON_LABEL}
        </NavLink>
      </nav>
    </aside>
  )
}

/** Layout con breadcrumb, sidebar e area contenuti. */
export function MacchineUfficioLayout() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/office-products?catalog=ufficio"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna al catalogo
        </Link>

        <MacchineBreadcrumb />

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-12">
          <MacchineSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  )
}

/** Hub: card sottocategorie (nessun elenco prodotti). */
export function MacchineUfficioHubPage() {
  const navigate = useNavigate()

  return (
    <>
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:gap-10">
        <span
          className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          aria-hidden
        >
          <Cpu className="size-10" strokeWidth={1.35} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Categoria</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Macchine per Ufficio</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Attrezzature professionali per ottimizzare il tuo lavoro: distruggidocumenti, etichettatrici,
            casse registratrici Ditron, plastificatrici, calcolatrici e soluzioni tecnologiche per
            l&apos;ufficio moderno. Scegli una sottocategoria per esplorare i prodotti.
          </p>
        </div>
      </header>

      <section className="pt-10" aria-labelledby="macchine-panoramica-carousel-heading">
        <h2
          id="macchine-panoramica-carousel-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
        >
          Panoramica
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
          Soluzioni per il punto cassa e la gestione dei pagamenti — scopri i modelli in evidenza.
        </p>
        <div className="mt-5">
          <MacchinePanoramicaCarousel />
        </div>
      </section>

      <section className="pt-12" aria-labelledby="macchine-sottocategorie-heading">
        <h2 id="macchine-sottocategorie-heading" className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Sottocategorie
        </h2>
        <div className={`mt-5 ${OFFICE_SUBCATEGORY_TILE_GRID_CLASS}`}>
          <OfficeSubcategoryTile
            title={MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL}
            onClick={() => void navigate(distruggiListingPath)}
            media={
              <div className="aspect-square w-full bg-slate-50">
                <img
                  src={DISTRUGGIDOCUMENTI_COVER_IMAGE_URL}
                  alt=""
                  className="size-full object-contain p-4"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            }
          />
          <OfficeSubcategoryTile
            title={MACCHINE_SUB_ETICHETTATRICI_LABEL}
            onClick={() => void navigate(etichettatriciListingPath)}
            media={
              <div className="aspect-square w-full bg-slate-50">
                <img
                  src={ETICHETTATRICI_COVER_IMAGE_URL}
                  alt=""
                  className="size-full object-contain p-4"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            }
          />
          <OfficeSubcategoryTile
            title={MACCHINE_SUB_CASSE_DITRON_LABEL}
            onClick={() => void navigate(casseDitronListingPath)}
            media={
              <div className="aspect-square w-full bg-slate-50">
                <img
                  src={CASSE_DITRON_COVER_IMAGE_URL}
                  alt=""
                  className="size-full object-contain p-4"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            }
          />
        </div>
      </section>
    </>
  )
}

/** Elenco prodotti distruggidocumenti. */
export function MacchineDistruggiDocumentiPage() {
  const products = useMemo(() => buildDistruggidocumentiOfficeProducts(), [])

  return (
    <>
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Catalogo distruggidocumenti — prezzi imponibili + IVA.
        </p>
      </header>

      <section className="pt-10" aria-labelledby="macchine-distruggi-catalogo">
        <h2 id="macchine-distruggi-catalogo" className="sr-only">
          Catalogo {MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <OfficeProductCard
                product={p}
                hideCategoryBadge
                compactGrid
                suppressQuantityTierHint
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/** Elenco etichettatrici. */
export function MacchineEtichettatriciPage() {
  const products = useMemo(() => buildEtichettatriciOfficeProducts(), [])

  return (
    <>
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {MACCHINE_SUB_ETICHETTATRICI_LABEL}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Catalogo etichettatrici — prezzi imponibili + IVA.
        </p>
      </header>

      <section className="pt-10" aria-labelledby="macchine-etichettatrici-catalogo">
        <h2 id="macchine-etichettatrici-catalogo" className="sr-only">
          Catalogo {MACCHINE_SUB_ETICHETTATRICI_LABEL}
        </h2>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
            <p className="text-base font-medium text-slate-800">
              Nessun prodotto disponibile in questa categoria
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Stiamo completando l&apos;assortimento: torna a visitarci o scrivici per un preventivo.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <OfficeProductCard
                  product={p}
                  hideCategoryBadge
                  compactGrid
                  suppressQuantityTierHint
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

/** Elenco casse registratrici Ditron. */
export function MacchineCasseDitronPage() {
  const products = useMemo(() => buildCasseDitronOfficeProducts(), [])

  return (
    <>
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {MACCHINE_SUB_CASSE_DITRON_LABEL}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Casse registratrici Ditron per negozi, bar e attività commerciali — prezzi imponibili + IVA.
        </p>
      </header>

      <section className="pt-10" aria-labelledby="macchine-casse-ditron-catalogo">
        <h2 id="macchine-casse-ditron-catalogo" className="sr-only">
          Catalogo {MACCHINE_SUB_CASSE_DITRON_LABEL}
        </h2>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
            <p className="text-base font-medium text-slate-800">Catalogo in aggiornamento</p>
            <p className="mt-2 text-sm text-slate-600">
              Contattaci su WhatsApp o richiedi un preventivo personalizzato per le casse Ditron.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <OfficeProductCard
                    product={p}
                    hideCategoryBadge
                    compactGrid
                    suppressQuantityTierHint
                  />
                </li>
              ))}
            </ul>

            <div
              className="mt-10 rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/50 to-slate-50/40 px-6 py-8 text-center shadow-sm sm:mt-12 sm:px-10 sm:py-9"
              role="note"
            >
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                Questi sono solo alcuni dei modelli che possiamo proporti per la tua azienda.
                Sviluppiamo preventivi personalizzati e soluzioni su misura per negozi,
                ristoranti, bar e attività commerciali.
              </p>
            </div>
          </>
        )}
      </section>
    </>
  )
}
