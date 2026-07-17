import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  FEATURED_CATEGORY_SPOTLIGHT_FADE_MS,
  FEATURED_CATEGORY_SPOTLIGHT_ROTATE_MS,
  FEATURED_CATEGORY_SPOTLIGHTS,
} from '../../data/featuredCategorySpotlight'

export function FeaturedCategorySpotlight() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const current = FEATURED_CATEGORY_SPOTLIGHTS[index]!
  const Icon = current.Icon
  const isCartaSpotlight = current.id === 'carta'
  const headingId = `featured-category-heading-${current.id}`

  useEffect(() => {
    if (FEATURED_CATEGORY_SPOTLIGHTS.length <= 1) return

    let fadeTimeoutId: number | undefined

    const intervalId = window.setInterval(() => {
      setVisible(false)
      fadeTimeoutId = window.setTimeout(() => {
        setIndex((i) => (i + 1) % FEATURED_CATEGORY_SPOTLIGHTS.length)
        setVisible(true)
      }, FEATURED_CATEGORY_SPOTLIGHT_FADE_MS)
    }, FEATURED_CATEGORY_SPOTLIGHT_ROTATE_MS)

    return () => {
      window.clearInterval(intervalId)
      if (fadeTimeoutId !== undefined) window.clearTimeout(fadeTimeoutId)
    }
  }, [])

  return (
    <section
      className="border-t border-slate-100 bg-white py-8 sm:py-10"
      aria-label="Categorie in evidenza"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to={current.href}
          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-50/40 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:flex-row"
        >
          <div
            className={[
              'relative flex min-h-[180px] flex-1 items-center justify-center transition-opacity ease-in-out sm:min-h-[200px] sm:max-w-sm',
              isCartaSpotlight ? 'bg-white' : 'bg-slate-100',
            ].join(' ')}
            style={{
              opacity: visible ? 1 : 0,
              transitionDuration: `${FEATURED_CATEGORY_SPOTLIGHT_FADE_MS}ms`,
            }}
          >
            <img
              src={current.imageUrl}
              alt={isCartaSpotlight ? 'Risme di carta A4 per fotocopie e stampa' : ''}
              className={[
                'absolute inset-0 size-full transition group-hover:scale-[1.02]',
                isCartaSpotlight
                  ? 'object-contain p-4 opacity-100'
                  : 'object-cover opacity-90',
              ].join(' ')}
              loading="lazy"
              decoding="async"
            />
            {!isCartaSpotlight ? (
              <span className="relative flex size-16 items-center justify-center rounded-2xl bg-white/90 text-brand-800 shadow-md backdrop-blur-sm">
                <Icon className="size-8" strokeWidth={1.5} aria-hidden />
              </span>
            ) : null}
          </div>
          <div
            className="flex flex-1 flex-col justify-center p-6 transition-opacity ease-in-out sm:p-8"
            style={{
              opacity: visible ? 1 : 0,
              transitionDuration: `${FEATURED_CATEGORY_SPOTLIGHT_FADE_MS}ms`,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Categoria in evidenza
            </p>
            <h2
              id={headingId}
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              {current.title}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              {current.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 group-hover:text-brand-900">
              Scopri il catalogo
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
