/**
 * Sanificazione e risoluzione image_link per Google Merchant Center.
 * Formati accettati: JPEG, PNG, GIF, WebP, BMP, TIFF.
 */

import { SITE_ORIGIN } from './siteSeo'

/** Placeholder JPEG su dominio storefront (sempre raggiungibile da Google). */
export const MERCHANT_FALLBACK_IMAGE_LINK = `${SITE_ORIGIN}/images/placeholder.jpg`

/** Fallback medicale/GIMA (PNG sul nostro dominio). */
export const MERCHANT_MEDICAL_FALLBACK_IMAGE_LINK = `${SITE_ORIGIN}/images/gima-catalogo-generale-copertina.png`

const SUPPORTED_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff'])

const imageReachabilityCache = new Map<string, boolean>()

export function merchantImageExtension(url: string): string | null {
  try {
    const pathname = new URL(url).pathname
    const m = pathname.match(/\.([a-z0-9]+)$/i)
    return m?.[1]?.toLowerCase() ?? null
  } catch {
    return null
  }
}

export function isMerchantSupportedImageExtension(ext: string | null | undefined): boolean {
  if (!ext) return false
  return SUPPORTED_EXT.has(ext.toLowerCase())
}

/**
 * Normalizza un URL immagine per il feed:
 * assoluto, senza query/hash, estensione supportata.
 * Ritorna null se non recuperabile (il caller usera il fallback).
 */
export function sanitizeMerchantImageUrl(raw: string, origin = SITE_ORIGIN): string | null {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return null

  let absolute = trimmed
  if (!/^https?:\/\//i.test(absolute)) {
    const base = origin.replace(/\/$/, '')
    absolute = absolute.startsWith('/') ? `${base}${absolute}` : `${base}/${absolute}`
  }

  let parsed: URL
  try {
    parsed = new URL(absolute)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null

  // Rimuovi query/hash (possono confondere il MIME check di Google).
  parsed.search = ''
  parsed.hash = ''

  const ext = merchantImageExtension(parsed.toString())
  if (!isMerchantSupportedImageExtension(ext)) return null
  if (ext === 'svg') return null

  return parsed.toString()
}

function isLikelyMedicalImage(url: string, categoryHint?: string): boolean {
  const hay = `${url} ${categoryHint ?? ''}`.toLowerCase()
  return /gimaitaly|gima|astro\s*medical|medical|sutura|ethicon|prolene/.test(hay)
}

function buildGimaAlternateCandidates(url: string): string[] {
  const out: string[] = [url]
  try {
    const u = new URL(url)
    if (!/gimaitaly\.com$/i.test(u.hostname) && !/\.gimaitaly\.com$/i.test(u.hostname)) {
      return out
    }
    const path = u.pathname
    const variants = new Set<string>()
    variants.add(path)
    variants.add(path.replace(/\/medium\//i, '/big/'))
    variants.add(path.replace(/\/big\//i, '/medium/'))
    variants.add(path.replace(/\.jpg$/i, '.jpeg'))
    variants.add(path.replace(/\.jpeg$/i, '.jpg'))
    // anche croce big+jpeg
    for (const p of [...variants]) {
      variants.add(p.replace(/\/medium\//i, '/big/').replace(/\.jpg$/i, '.jpeg'))
      variants.add(p.replace(/\/big\//i, '/medium/').replace(/\.jpeg$/i, '.jpg'))
    }
    for (const p of variants) {
      const cand = `${u.origin}${p}`
      if (!out.includes(cand)) out.push(cand)
    }
  } catch {
    // ignore
  }
  return out
}

async function isReachableMerchantImage(url: string): Promise<boolean> {
  const cached = imageReachabilityCache.get(url)
  if (cached !== undefined) return cached

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    })
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    const ok = res.ok && ct.startsWith('image/') && !ct.includes('svg')
    imageReachabilityCache.set(url, ok)
    return ok
  } catch {
    // Alcuni CDN bloccano HEAD: prova GET range minimo.
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(12_000),
      })
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      const ok =
        (res.ok || res.status === 206) && ct.startsWith('image/') && !ct.includes('svg')
      imageReachabilityCache.set(url, ok)
      return ok
    } catch {
      imageReachabilityCache.set(url, false)
      return false
    }
  }
}

export type ResolveMerchantImageOptions = {
  origin?: string
  categoryHint?: string
  /** Se true, forza HEAD anche per host non-GIMA. Default: solo gimaitaly. */
  alwaysValidate?: boolean
}

/**
 * Risolve un image_link valido per Merchant Center.
 * Per gimaitaly.com verifica raggiungibilita (404 HTML = tipo non supportato).
 */
export async function resolveMerchantImageLink(
  raw: string,
  opts: ResolveMerchantImageOptions = {},
): Promise<string> {
  const origin = (opts.origin ?? SITE_ORIGIN).replace(/\/$/, '')
  const medical = isLikelyMedicalImage(raw, opts.categoryHint)
  const fallback = medical ? MERCHANT_MEDICAL_FALLBACK_IMAGE_LINK : MERCHANT_FALLBACK_IMAGE_LINK

  const sanitized = sanitizeMerchantImageUrl(raw, origin)
  if (!sanitized) return fallback

  const host = (() => {
    try {
      return new URL(sanitized).hostname.toLowerCase()
    } catch {
      return ''
    }
  })()

  const needsLiveCheck =
    opts.alwaysValidate ||
    host === 'www.gimaitaly.com' ||
    host === 'gimaitaly.com' ||
    host.endsWith('.gimaitaly.com')

  if (!needsLiveCheck) {
    return sanitized
  }

  const candidates = buildGimaAlternateCandidates(sanitized)
  for (const candidate of candidates) {
    const clean = sanitizeMerchantImageUrl(candidate, origin)
    if (!clean) continue
    if (await isReachableMerchantImage(clean)) return clean
  }

  return fallback
}

export function clearMerchantImageReachabilityCache(): void {
  imageReachabilityCache.clear()
}
