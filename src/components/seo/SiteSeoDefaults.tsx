import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { applySiteBrandSeo } from '../../lib/siteSeo'

/**
 * SEO di brand per SPA: ripristina title/meta/JSON-LD Organization
 * su tutte le route tranne le schede prodotto (che hanno meta dedicate).
 */
export function SiteSeoDefaults() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/product/')) return
    applySiteBrandSeo({ pathname })
  }, [pathname])

  return null
}
