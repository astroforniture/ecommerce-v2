import {
  useEffect,
  useRef,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    id: 'brother',
    name: 'Brother',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Brother_logo.svg/3840px-Brother_logo.svg.png',
    brandParam: 'Brother',
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
  {
    id: 'sanitec',
    name: 'Sanitec',
    src: 'https://odmultimedia.eu/immagini/logo/brand/sanitec.png',
    brandParam: 'Sanitec',
  },
  {
    id: 'chanteclair',
    name: 'Chanteclair',
    src: 'https://cdn.builder.io/api/v1/image/assets%2F5d27e3bf79a1424d964148b42831fd40%2Ff0f672979532467aae61572b6e8871e8',
    brandParam: 'Chanteclair',
  },
  {
    id: 'lavor',
    name: 'Lavor',
    src: 'https://www.immaginesrl.it/img/m/97.jpg',
    brandParam: 'Lavor',
  },
]

/** Velocità autoplay continua (px/s). */
const AUTOPLAY_PX_PER_SEC = 38
const MANUAL_STEP_RATIO = 0.55
const MANUAL_ANIM_MS = 420
const DRAG_CLICK_THRESHOLD_PX = 6

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

function BrandLogoRow({
  trackId,
  listRef,
}: {
  trackId: string
  listRef?: RefObject<HTMLUListElement | null>
}) {
  const isClone = trackId === 'b'
  return (
    <ul
      ref={listRef}
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
            draggable={false}
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
                draggable={false}
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
 * Brand Shop — marquee infinito con autoplay + frecce manuali «I Nostri Marchi».
 */
export function BrandMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const trackARef = useRef<HTMLUListElement>(null)

  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)
  const pausedRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const draggingRef = useRef(false)
  const manualAnimRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startOffset: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      reducedMotionRef.current = mq.matches
    }
    syncMotion()
    mq.addEventListener('change', syncMotion)

    const measure = () => {
      halfWidthRef.current = trackARef.current?.offsetWidth ?? 0
    }
    measure()
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null
    if (trackARef.current) ro?.observe(trackARef.current)
    window.addEventListener('resize', measure)

    let raf = 0
    let last = performance.now()

    const normalize = () => {
      const half = halfWidthRef.current
      if (half <= 0) return
      offsetRef.current = ((offsetRef.current % half) + half) % half
    }

    const apply = () => {
      const rail = railRef.current
      if (rail) {
        rail.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (
        !pausedRef.current &&
        !draggingRef.current &&
        !reducedMotionRef.current &&
        manualAnimRef.current === null
      ) {
        offsetRef.current += AUTOPLAY_PX_PER_SEC * dt
        normalize()
        apply()
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(raf)
      if (manualAnimRef.current !== null) {
        window.cancelAnimationFrame(manualAnimRef.current)
      }
      mq.removeEventListener('change', syncMotion)
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  function setPaused(value: boolean) {
    pausedRef.current = value
  }

  function applyTransform() {
    const rail = railRef.current
    if (rail) {
      rail.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }
  }

  function normalizeOffset() {
    const half = halfWidthRef.current || trackARef.current?.offsetWidth || 0
    halfWidthRef.current = half
    if (half <= 0) return
    offsetRef.current = ((offsetRef.current % half) + half) % half
  }

  function scrollByPage(direction: -1 | 1) {
    const viewport = viewportRef.current
    if (!viewport) return
    if (manualAnimRef.current !== null) {
      window.cancelAnimationFrame(manualAnimRef.current)
      manualAnimRef.current = null
    }

    const step = Math.max(180, Math.round(viewport.clientWidth * MANUAL_STEP_RATIO))
    const from = offsetRef.current
    const to = from + direction * step
    const start = performance.now()

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / MANUAL_ANIM_MS)
      offsetRef.current = from + (to - from) * easeOutCubic(t)
      normalizeOffset()
      applyTransform()
      if (t < 1) {
        manualAnimRef.current = window.requestAnimationFrame(animate)
      } else {
        manualAnimRef.current = null
      }
    }
    manualAnimRef.current = window.requestAnimationFrame(animate)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    // Evita di catturare il drag partito dalle frecce.
    if ((event.target as HTMLElement).closest('button')) return

    if (manualAnimRef.current !== null) {
      window.cancelAnimationFrame(manualAnimRef.current)
      manualAnimRef.current = null
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    }
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const delta = event.clientX - drag.startX
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD_PX) {
      drag.moved = true
      event.currentTarget.classList.add('brand-carousel-dragging')
    }
    if (drag.moved) {
      offsetRef.current = drag.startOffset - delta
      normalizeOffset()
      applyTransform()
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (drag.moved) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    event.currentTarget.classList.remove('brand-carousel-dragging')
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    draggingRef.current = false
  }

  function onTrackClickCapture(event: ReactMouseEvent) {
    if (suppressClickRef.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

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
          Scorri i marchi o clicca un logo per vedere i prodotti nel catalogo.
        </p>
      </div>

      <div
        className="relative mx-auto mt-8 max-w-7xl px-2 pb-10 sm:mt-10 sm:px-4 sm:pb-12 lg:px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          aria-label="Scorri marchi indietro"
          onClick={() => scrollByPage(-1)}
          className={[
            'absolute left-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md transition sm:left-2 sm:size-11',
            'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
          ].join(' ')}
        >
          <ChevronLeft className="size-5 sm:size-6" aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Scorri marchi avanti"
          onClick={() => scrollByPage(1)}
          className={[
            'absolute right-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md transition sm:right-2 sm:size-11',
            'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
          ].join(' ')}
        >
          <ChevronRight className="size-5 sm:size-6" aria-hidden />
        </button>

        <div
          className="pointer-events-none absolute inset-y-0 left-10 z-10 w-8 bg-gradient-to-r from-slate-50 to-transparent sm:left-14 sm:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-10 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:right-14 sm:w-12"
          aria-hidden
        />

        <div
          ref={viewportRef}
          className={[
            'brand-carousel-track relative overflow-hidden px-12 py-2 sm:px-16',
            'cursor-grab select-none touch-pan-y active:cursor-grabbing',
          ].join(' ')}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Marchi partner in scorrimento automatico; usa frecce, drag o swipe per navigare"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onTrackClickCapture}
        >
          <div ref={railRef} className="brand-marquee-rail flex w-max will-change-transform">
            <BrandLogoRow trackId="a" listRef={trackARef} />
            <BrandLogoRow trackId="b" />
          </div>
        </div>
      </div>
    </section>
  )
}
