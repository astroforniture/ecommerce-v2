import {
  useCallback,
  useEffect,
  useRef,
  useState,
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

const SCROLL_STEP_RATIO = 0.7
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

/**
 * Brand Shop — carosello manuale «I Nostri Marchi»
 * (frecce, drag mouse, swipe touch; loghi con link al catalogo filtrato).
 */
export function BrandMarquee() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startScrollLeft: number
    moved: boolean
  } | null>(null)
  const suppressClickRef = useRef(false)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanScrollPrev(el.scrollLeft > 2)
    setCanScrollNext(max > 2 && el.scrollLeft < max - 2)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    const onScroll = () => updateScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null
    ro?.observe(el)
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return
    const step = Math.max(160, Math.round(el.clientWidth * SCROLL_STEP_RATIO))
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // Drag custom solo col mouse; su touch resta lo swipe nativo (overflow-x).
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = scrollerRef.current
    if (!el) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    }
    el.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const el = scrollerRef.current
    if (!drag || !el || drag.pointerId !== event.pointerId) return
    const delta = event.clientX - drag.startX
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD_PX) {
      drag.moved = true
      el.classList.add('brand-carousel-dragging')
    }
    if (drag.moved) {
      el.scrollLeft = drag.startScrollLeft - delta
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const el = scrollerRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (drag.moved) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    el?.classList.remove('brand-carousel-dragging')
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    updateScrollState()
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

      <div className="relative mx-auto mt-8 max-w-7xl px-2 pb-10 sm:mt-10 sm:px-4 sm:pb-12 lg:px-6">
        <button
          type="button"
          aria-label="Scorri marchi indietro"
          disabled={!canScrollPrev}
          onClick={() => scrollByPage(-1)}
          className={[
            'absolute left-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md transition sm:left-2 sm:size-11',
            'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
            'disabled:pointer-events-none disabled:opacity-35',
          ].join(' ')}
        >
          <ChevronLeft className="size-5 sm:size-6" aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Scorri marchi avanti"
          disabled={!canScrollNext}
          onClick={() => scrollByPage(1)}
          className={[
            'absolute right-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md transition sm:right-2 sm:size-11',
            'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
            'disabled:pointer-events-none disabled:opacity-35',
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
          ref={scrollerRef}
          className={[
            'brand-carousel-track flex touch-pan-x gap-10 overflow-x-auto scroll-smooth px-12 py-2 sm:gap-14 sm:px-16',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'cursor-grab select-none active:cursor-grabbing',
          ].join(' ')}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Marchi partner, scorri con frecce, drag o swipe"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onTrackClickCapture}
        >
          <ul className="flex min-w-max items-center gap-10 sm:gap-14">
            {BRANDS.map((brand) => {
              const href = brandCatalogHref(brand)
              const img = (
                <img
                  src={brand.src}
                  alt={brand.name}
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
                  key={brand.id}
                  className="flex h-14 w-[7.5rem] shrink-0 items-center justify-center sm:w-36"
                >
                  {href ? (
                    <Link
                      to={href}
                      aria-label={`Vedi prodotti ${brand.name}`}
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
        </div>
      </div>
    </section>
  )
}
