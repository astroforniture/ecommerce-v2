import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { applySiteBrandSeo, clearSeoReady } from '../../lib/siteSeo'

/**
 * SEO di brand per SPA: ripristina title/meta/JSON-LD Organization
 * su route generiche (non schede prodotto né pagine servizi dedicate).
 */
export function SiteSeoDefaults() {
  const { pathname } = useLocation()

  useEffect(() => {
    clearSeoReady()
    const isProductDetail =
      pathname.startsWith('/product/') ||
      (pathname.startsWith('/prodotti/') &&
        !pathname.startsWith('/prodotti/macchine-per-ufficio'))
    const isServizioPage = pathname.startsWith('/servizi/')
    if (isProductDetail || isServizioPage) return
    applySiteBrandSeo({ pathname })
  }, [pathname])

  return null
}
