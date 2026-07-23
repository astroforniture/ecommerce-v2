/** Brand / SEO canonici per asforniture.it */
export const SITE_ORIGIN = 'https://www.asforniture.it'

export const SITE_BRAND_NAME = 'Astro Forniture'

export const SITE_ALTERNATE_NAMES = [
  'asforniture',
  'asforniture.it',
  'Astro Forniture',
  'astroforniture',
] as const

export const SITE_LOGO_URL = `${SITE_ORIGIN}/logo.png`

export const SITE_DEFAULT_TITLE =
  'Astro Forniture | Cancelleria, Shopper e Macchine per Ufficio (asforniture.it)'

export const SITE_DEFAULT_DESCRIPTION =
  'Astro Forniture è il tuo e-commerce di fiducia per cancelleria, shopper in carta e plastica, registratori di cassa e timbri. Visita asforniture.it!'

export const SITE_DEFAULT_KEYWORDS =
  'asforniture, asforniture.it, astro forniture, astroforniture, cancelleria ufficio, shopper carta plastica'

export const SITE_BRAND_JSONLD_ID = 'seo-organization-jsonld'

export const SITE_BRAND_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: SITE_BRAND_NAME,
      alternateName: [...SITE_ALTERNATE_NAMES],
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO_URL,
      },
      email: 'info@astro-forniture.it',
      description: SITE_DEFAULT_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: SITE_BRAND_NAME,
      alternateName: [...SITE_ALTERNATE_NAMES],
      url: SITE_ORIGIN,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: 'it-IT',
      description: SITE_DEFAULT_DESCRIPTION,
    },
  ],
} as const

/** @deprecated alias — stesso script JSON-LD brand */
export const SITE_ORGANIZATION_JSONLD_ID = SITE_BRAND_JSONLD_ID
export const SITE_ORGANIZATION_JSONLD = SITE_BRAND_JSONLD

export function setMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function setMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function setCanonical(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', href)
}

export function upsertJsonLdById(id: string, payload: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(payload)
}

/** Applica (o ripristina) title/description/keywords e JSON-LD Organization + WebSite. */
export function applySiteBrandSeo(options?: { pathname?: string }) {
  const pathname = options?.pathname ?? window.location.pathname
  const canonical = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`

  document.title = SITE_DEFAULT_TITLE
  setMetaName('description', SITE_DEFAULT_DESCRIPTION)
  setMetaName('keywords', SITE_DEFAULT_KEYWORDS)
  setMetaName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  setCanonical(canonical)

  setMetaProperty('og:type', 'website')
  setMetaProperty('og:locale', 'it_IT')
  setMetaProperty('og:site_name', SITE_BRAND_NAME)
  setMetaProperty('og:title', SITE_DEFAULT_TITLE)
  setMetaProperty('og:description', SITE_DEFAULT_DESCRIPTION)
  setMetaProperty('og:url', canonical)
  setMetaProperty('og:image', SITE_LOGO_URL)

  setMetaName('twitter:card', 'summary_large_image')
  setMetaName('twitter:title', SITE_DEFAULT_TITLE)
  setMetaName('twitter:description', SITE_DEFAULT_DESCRIPTION)
  setMetaName('twitter:image', SITE_LOGO_URL)

  upsertJsonLdById(SITE_BRAND_JSONLD_ID, SITE_BRAND_JSONLD as unknown as Record<string, unknown>)
  markSeoReady()
}

/** Flag per Playwright prerender: meta + contenuti pronti. */
export function markSeoReady() {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-seo-ready', 'true')
}

export function clearSeoReady() {
  if (typeof document === 'undefined') return
  document.documentElement.removeAttribute('data-seo-ready')
}

