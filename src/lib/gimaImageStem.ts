/**
 * Estrae il codice file Gima (es. `25721`, `21401-05`) da un URL media gimaitaly.com.
 */
export function gimaImageStemFromUrl(url: string | undefined | null): string | null {
  const u = String(url ?? '').trim()
  const m = u.match(
    /gimaitaly\.com\/images\/prodotti\/(?:big|medium)\/([^/?#]+)\.(?:jpg|jpeg|png)/i,
  )
  if (!m?.[1]) return null
  return m[1].trim().toLowerCase()
}

/** ID catalogo office unico legato all’asset GIMA (es. `gima-25721`). */
export function gimaOfficeProductIdFromImageUrl(url: string | undefined | null): string | null {
  const stem = gimaImageStemFromUrl(url)
  return stem ? `gima-${stem}` : null
}
