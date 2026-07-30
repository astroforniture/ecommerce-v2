const BRANDS = [
  {
    id: 'ditron',
    name: 'Ditron',
    src: 'https://www.ditronretailsystem.it/static/version1762514796/frontend/Meetweb/ditron/it_IT/images/logo.png',
  },
  {
    id: 'esselte',
    name: 'Esselte',
    src: 'https://www.esselte.com/assets/img-abc/esselte-logo.svg',
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
  },
  {
    id: 'bruneau',
    name: 'Bruneau',
    src: 'https://prod.isg.bruneau.media/asset/aHR0cHM6Ly9vZG11bHRpbWVkaWEuZXUvaW1tYWdpbmkvTUQvUklCT0xCQk5SLmpwZw==/?dpi=1.25&format=avif&height=410&quality=60&trim=&width=860',
  },
  {
    id: 'leitz',
    name: 'Leitz',
    src: 'https://www.leitz.com/assets/img-abc/leitz-logo.svg',
  },
  {
    id: 'comet',
    name: 'Comet',
    src: 'https://odmultimedia.eu/immagini/logo/brand/comet.png',
  },
  {
    id: 'eurocel',
    name: 'Eurocel',
    src: 'https://odmultimedia.eu/immagini/logo/brand/eurocel.png',
  },
  {
    id: 'lebez',
    name: 'Lebez',
    src: 'https://www.lebez.com/wp-content/uploads/2026/01/Logo_Lebez_new.png',
  },
  {
    id: 'tombow',
    name: 'Tombow',
    src: 'https://odmultimedia.eu/immagini/logo/brand/tombow.png',
  },
  {
    id: 'pentel',
    name: 'Pentel',
    src: 'https://pentel.it/assets/img/brand/logo-pentel-rgb.png',
  },
  {
    id: 'titanium',
    name: 'Titanium',
    src: 'https://odmultimedia.eu/immagini/logo/brand/titanium.png',
  },
  {
    id: 'iternet',
    name: 'Iternet',
    src: 'https://odmultimedia.eu/immagini/logo/brand/iternet.png',
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
  },
  {
    id: 'colop',
    name: 'Colop',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Colop_logo.svg',
  },
] as const

function BrandLogoRow({ trackId }: { trackId: string }) {
  return (
    <ul
      className="brand-marquee-track flex shrink-0 items-center gap-10 px-5 sm:gap-14 sm:px-8"
      aria-hidden={trackId === 'b' ? true : undefined}
    >
      {BRANDS.map((brand) => (
        <li
          key={`${trackId}-${brand.id}`}
          className="flex h-14 w-[7.5rem] shrink-0 items-center justify-center sm:w-36"
        >
          <img
            src={brand.src}
            alt={trackId === 'a' ? brand.name : ''}
            title={brand.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="brand-marquee-logo max-h-10 w-auto max-w-full object-contain opacity-55 grayscale transition duration-300 sm:max-h-12"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Brand Shop — marquee infinito «I Nostri Marchi» (CSS @keyframes, pausa su hover).
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
          I brand professionali che trovi nel nostro catalogo per ufficio, scuola e attività commerciali.
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
