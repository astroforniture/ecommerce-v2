import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'

/** Placeholder generico in `public/images/placeholder.jpg`. */
export const PRODUCT_IMAGE_PLACEHOLDER = '/images/placeholder.jpg'

type ProductThumbProps = {
  /** Campo canonico OfficeProduct (`imageUrl`). Accetta anche alias legacy. */
  imageUrl?: string | null
  image_url?: string | null
  image?: string | null
  alt?: string
  className?: string
  imgClassName?: string
  iconClassName?: string
}

function resolveRawImageUrl(props: {
  imageUrl?: string | null
  image_url?: string | null
  image?: string | null
}): string {
  return String(props.imageUrl ?? props.image_url ?? props.image ?? '').trim()
}

/**
 * Anteprima prodotto con fallback su placeholder se URL assente o onError.
 */
export function ProductThumb({
  imageUrl,
  image_url,
  image,
  alt = '',
  className = 'flex size-full items-center justify-center overflow-hidden bg-slate-50 p-2',
  imgClassName = 'max-h-full max-w-full object-contain',
  iconClassName = 'size-10 text-brand-200',
}: ProductThumbProps) {
  const raw = resolveRawImageUrl({ imageUrl, image_url, image })
  const primary = raw
    ? withOfficeImageCacheBust(raw, OFFICE_CATALOG_DATA_REVISION) || raw
    : PRODUCT_IMAGE_PLACEHOLDER

  const [src, setSrc] = useState(primary)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setSrc(primary)
    setFailed(false)
  }, [primary])

  if (failed && src === PRODUCT_IMAGE_PLACEHOLDER) {
    return (
      <div className={className}>
        <FileText className={iconClassName} strokeWidth={1.25} aria-hidden />
      </div>
    )
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (src !== PRODUCT_IMAGE_PLACEHOLDER) {
            setSrc(PRODUCT_IMAGE_PLACEHOLDER)
          } else {
            setFailed(true)
          }
        }}
      />
    </div>
  )
}
