import { Link } from 'react-router-dom'

type BrandLogo = {
  id: string
  name: string
  src: string
  /** Parametro `brand` per /office-products (preferito). */
  brandParam?: string
  /** Fallback: ricerca testuale se il brand in DB non è univoco. */
  searchParam?: string
}

const BRANDS: readonly BrandLogo[] = [
  {
    id: 'ditron',
    name: 'Ditron',
    src: 'https://www.ditronretailsystem.it/static/version1762514796/frontend/Meetweb/ditron/it_IT/images/logo.png',
    brandParam: 'Ditron',
    searchParam: 'Ditron',
  },
  {
    id: 'esselte',
    name: 'Esselte',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-mycBVtxaH2Zjn3_TxTZzjHokUnU_FiBZhOUqY7l&s=10',
    brandParam: 'Esselte',
  },
  {
    id: 'xerox',
    name: 'Xerox',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Xerox_logo.svg/1280px-Xerox_logo.svg.png',
    brandParam: 'Xerox',
  },
  {
    id: 'leone',
    name: 'Leone',
    src: 'https://www.delleragiuseppe.com/media/2023/04/logo-Leone.png',
    brandParam: 'Leone',
  },
  {
    id: 'casio',
    name: 'Casio',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Casio_logo.svg/960px-Casio_logo.svg.png',
    brandParam: 'Casio',
  },
  {
    id: 'canon',
    name: 'Canon',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Canon_logo.svg/1280px-Canon_logo.svg.png',
    brandParam: 'Canon',
  },
  {
    id: 'brand-3',
    name: 'Partner brand',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeaX_g2PQBjtg0-LGbE7CEQ18epRRCvo8Z1YmFFwIfx9nSOKGFv1-jWjo&s=10',
  },
  {
    id: 'eurocart',
    name: 'Eurocart',
    src: 'https://www.euro-cart.it/ImgHome/Eurocart-logo.png',
    brandParam: 'Eurocart',
  },
  {
    id: 'bruneau',
    name: 'Bruneau',
    src: 'https://prod.isg.bruneau.media/asset/aHR0cHM6Ly9vZG11bHRpbWVkaWEuZXUvaW1tYWdpbmkvTUQvUklCT0xCQk5SLmpwZw==/?dpi=1.25&format=avif&height=410&quality=60&trim=&width=860',
    brandParam: 'Bruneau',
    searchParam: 'BBNR',
  },
  {
    id: 'leitz',
    name: 'Leitz',
    src: 'https://www.leitz.com/assets/img-abc/leitz-logo.svg',
    brandParam: 'Leitz',
  },
  {
    id: 'comet',
    name: 'Comet',
    src: 'https://odmultimedia.eu/immagini/logo/brand/comet.png',
    brandParam: 'Comet',
  },
  {
    id: 'eurocel',
    name: 'Eurocel',
    src: 'https://odmultimedia.eu/immagini/logo/brand/eurocel.png',
    brandParam: 'Eurocel',
  },
  {
    id: 'lebez',
    name: 'Lebez',
    src: 'https://www.lebez.com/wp-content/uploads/2026/01/Logo_Lebez_new.png',
    brandParam: 'Lebez',
  },
  {
    id: 'tombow',
    name: 'Tombow',
    src: 'https://odmultimedia.eu/immagini/logo/brand/tombow.png',
    brandParam: 'Tombow',
  },
  {
    id: 'pentel',
    name: 'Pentel',
    src: 'https://pentel.it/assets/img/brand/logo-pentel-rgb.png',
    brandParam: 'Pentel',
  },
  {
    id: 'titanium',
    name: 'Titanium',
    src: 'https://odmultimedia.eu/immagini/logo/brand/titanium.png',
    brandParam: 'Titanium',
  },
  {
    id: 'iternet',
    name: 'Iternet',
    src: 'https://odmultimedia.eu/immagini/logo/brand/iternet.png',
    brandParam: 'Iternet',
  },
  {
    id: 'brand-14',
    name: 'Partner brand',
    src: 'https://static.wixstatic.com/media/1cc11d_33602fb37a7447d68888edc98452878e~mv2.png/v1/fill/w_446,h_221,al_c,lg_1,q_85,enc_avif,quality_auto/1cc11d_33602fb37a7447d68888edc98452878e~mv2.png',
  },
  {
    id: 'tratto',
    name: 'Tratto',
    src: 'https://www.marcatoriindelebili.com/wp-content/uploads/2021/11/logo_tratto_ok.png',
    brandParam: 'Tratto',
  },
  {
    id: 'brand-16',
    name: 'Partner brand',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnOE9pAKsWJSip1nqW4RV5OCcWqNVBrmlAlgz7OdvfD8BunEnafMwSFqWC&s=10',
  },
  {
    id: 'trodat',
    name: 'Trodat',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Trodat_Logo.svg/960px-Trodat_Logo.svg.png?_=20160907174125',
    brandParam: 'Trodat',
  },
  {
    id: 'colop',
    name: 'Colop',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Colop_logo.svg',
    brandParam: 'Colop',
  },
]

function brandCatalogHref(brand: BrandLogo): string | null {
  const params = new URLSearchParams()
  params.set('catalog', 'ufficio')
  if (brand.brandParam?.trim()) {
    params.set('brand', brand.brandParam.trim())
    return `/office-products?${params.toString()}`
  }
  if (brand.searchParam?.trim()) {
    params.set('search', brand.searchParam.trim())
    return `/office-products?${params.toString()}`
  }
  return null
}

function BrandLogoRow({ trackId }: { trackId: string }) {
  const isClone = trackId === 'b'
  return (
    <ul
      className="brand-marquee-track flex shrink-0 items-center gap-10 px-5 sm:gap-14 sm:px-8"
      aria-hidden={isClone ? true : undefined}
    >
      {BRANDS.map((brand) => {
        const href = brandCatalogHref(brand)
        const img = (
          <img
            src={brand.src}
            alt={isClone ? '' : brand.name}
            title={brand.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="brand-marquee-logo max-h-10 w-auto max-w-full object-contain opacity-55 grayscale transition duration-300 sm:max-h-12"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        )
        return (
          <li
            key={`${trackId}-${brand.id}`}
            className="flex h-14 w-[7.5rem] shrink-0 items-center justify-center sm:w-36"
          >
            {href ? (
              <Link
                to={href}
                tabIndex={isClone ? -1 : undefined}
                aria-label={isClone ? undefined : `Vedi prodotti ${brand.name}`}
                className="brand-marquee-link inline-flex cursor-pointer items-center justify-center rounded-lg p-1 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              >
                {img}
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center p-1">{img}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Brand Shop — marquee infinito «I Nostri Marchi» (CSS @keyframes, pausa su hover).
 * Loghi noti collegano al catalogo filtrato per brand.
 */
export function BrandMarquee() {
  return (
    <section
      className="brand-marquee border-y border-slate-200/80 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="brand-marquee-heading"
    >
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
          Brand Shop
        </p>
        <h2
          id="brand-marquee-heading"
          className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          I Nostri Marchi
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">
          Clicca un logo per vedere i prodotti di quel marchio nel catalogo.
        </p>
      </div>

      <div className="brand-marquee-viewport relative mt-8 overflow-hidden pb-10 sm:mt-10 sm:pb-12">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20"
          aria-hidden
        />
        <div className="brand-marquee-rail flex w-max">
          <BrandLogoRow trackId="a" />
          <BrandLogoRow trackId="b" />
        </div>
      </div>
    </section>
  )
}
