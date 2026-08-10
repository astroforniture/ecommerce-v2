import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { GIMA_COMPLETE_CATALOG_COVER_IMAGE_URL } from '../../lib/astroMedicalShopCopy'

type PreviewPlacement = 'top' | 'bottom' | 'right'

type CommonProps = {
  children: ReactNode
  className?: string
  triggerClassName?: string
  previewImageUrl?: string
  previewAlt?: string
  previewCaption?: string
  placement?: PreviewPlacement
}

type AnchorProps = CommonProps & {
  as?: 'a'
  href: string
  target?: string
  rel?: string
  'aria-label'?: string
  title?: string
}

type RouterLinkProps = CommonProps & {
  as: 'link'
  to: string
  'aria-label'?: string
  title?: string
}

type Props = AnchorProps | RouterLinkProps

const placementClasses: Record<PreviewPlacement, { anchor: string; arrow: string }> = {
  top: {
    anchor: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    arrow:
      'absolute left-1/2 top-full -mt-px h-0 w-0 -translate-x-1/2 border-x-[8px] border-t-[8px] border-x-transparent border-t-white',
  },
  bottom: {
    anchor: 'top-full left-1/2 mt-3 -translate-x-1/2',
    arrow:
      'absolute bottom-full left-1/2 mb-px h-0 w-0 -translate-x-1/2 border-x-[8px] border-b-[8px] border-x-transparent border-b-white',
  },
  right: {
    anchor: 'left-full top-1/2 ml-3 -translate-y-1/2',
    arrow:
      'absolute right-full top-1/2 mr-px h-0 w-0 -translate-y-1/2 border-y-[8px] border-r-[8px] border-y-transparent border-r-white',
  },
}

/**
 * Link/CTA con popover anteprima immagine al hover (solo desktop / pointer fine).
 */
export function HoverImagePreviewTrigger(props: Props) {
  const {
    children,
    className,
    triggerClassName,
    previewImageUrl = GIMA_COMPLETE_CATALOG_COVER_IMAGE_URL,
    previewAlt = 'Anteprima Catalogo Generale GIMA',
    previewCaption = 'Catalogo Generale GIMA',
    placement = 'top',
  } = props

  const pos = placementClasses[placement]
  const shellClass = ['hover-preview-trigger relative max-w-full', className ?? 'inline-flex'].join(
    ' ',
  )

  const preview = (
    <div
      className={['pointer-events-none absolute z-50 w-[9.5rem] sm:w-[11rem]', pos.anchor].join(' ')}
    >
      <div role="tooltip" className="hover-preview-panel">
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5">
          <img
            src={previewImageUrl}
            alt={previewAlt}
            width={176}
            height={240}
            className="aspect-[3/4] w-full rounded-md object-cover"
            loading="lazy"
            decoding="async"
          />
          {previewCaption ? (
            <p className="mt-1.5 px-0.5 pb-0.5 text-center text-[10px] font-semibold leading-tight text-slate-700">
              {previewCaption}
            </p>
          ) : null}
          <span className={pos.arrow} aria-hidden />
        </div>
      </div>
    </div>
  )

  if (props.as === 'link') {
    return (
      <span className={shellClass}>
        <Link
          to={props.to}
          className={triggerClassName}
          title={props.title}
          aria-label={props['aria-label']}
        >
          {children}
        </Link>
        {preview}
      </span>
    )
  }

  return (
    <span className={shellClass}>
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={triggerClassName}
        title={props.title}
        aria-label={props['aria-label']}
      >
        {children}
      </a>
      {preview}
    </span>
  )
}
