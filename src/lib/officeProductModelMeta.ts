import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'

/** Chiavi JSON `main_features` (o simili) accettate per buste / modelli. */
const QUALITY_FEATURE_KEYS = [
  'Qualità',
  'qualità',
  'Quality',
  'quality',
  'Livello',
  'livello',
  'Livello qualità',
]

const FINISH_FEATURE_KEYS = [
  'Finitura',
  'finitura',
  'Finish',
  'finish',
  'Superficie',
  'superficie',
]

function readMainFeature(
  mainFeatures: Record<string, string> | undefined,
  keyList: readonly string[],
): string | null {
  if (!mainFeatures) return null
  for (const k of keyList) {
    const v = mainFeatures[k]?.trim()
    if (v) return v
  }
  for (const [key, val] of Object.entries(mainFeatures)) {
    const kl = key.trim().toLowerCase()
    const hit = keyList.some((c) => c.trim().toLowerCase() === kl)
    const s = String(val ?? '').trim()
    if (hit && s) return s
  }
  return null
}

function inferFromBlob(blob: string): { quality: string | null; finish: string | null } {
  const h = blob.toLowerCase()
  let quality: string | null = null
  if (/\btop\b/.test(h)) quality = 'Top'
  else if (/\bmedium\b/.test(h)) quality = 'Medium'

  let finish: string | null = null
  if (h.includes('buccia')) finish = 'Buccia'
  else if (h.includes('liscio')) finish = 'Liscio'

  return { quality, finish }
}

export function modelQualityFromProduct(p: OfficeProduct): string | null {
  const from = readMainFeature(p.mainFeatures, QUALITY_FEATURE_KEYS)
  if (from) return from
  const blob = `${p.name} ${p.colorName ?? ''} ${p.description ?? ''}`
  return inferFromBlob(blob).quality
}

export function modelFinishFromProduct(p: OfficeProduct): string | null {
  const from = readMainFeature(p.mainFeatures, FINISH_FEATURE_KEYS)
  if (from) return from
  const blob = `${p.name} ${p.colorName ?? ''} ${p.description ?? ''}`
  return inferFromBlob(blob).finish
}

export function modelQualityFromVariant(opt: ProductVariantOption): string | null {
  const q = opt.quality?.trim()
  if (q) return q
  return inferFromBlob(opt.label).quality
}

export function modelFinishFromVariant(opt: ProductVariantOption): string | null {
  const f = opt.finish?.trim()
  if (f) return f
  return inferFromBlob(opt.label).finish
}
