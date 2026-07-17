/**
 * Aggiunge un parametro di versione agli URL immagine per evitare cache browser aggressiva
 * quando i link sul DB cambiano ma il path resta simile.
 */
export function withOfficeImageCacheBust(
  rawUrl: string | undefined | null,
  revision: number,
): string {
  const url = String(rawUrl ?? '').trim()
  if (!url) return ''
  if (!/^https?:\/\//i.test(url)) return url
  try {
    const u = new URL(url)
    u.searchParams.set('v', String(revision))
    return u.toString()
  } catch {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}v=${encodeURIComponent(String(revision))}`
  }
}
