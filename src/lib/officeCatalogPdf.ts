/**
 * Generazione catalogo PDF (shop ufficio/cancelleria).
 * Esclude linea Astro Medical / GIMA.
 */

import { jsPDF } from 'jspdf'
import type { OfficeProduct } from '../types/officeProduct'
import { fetchOfficeProductsFromSupabase } from '../api/officeProductsSupabase'
import { isGeneralOfficeShopCatalogProduct } from './isGeneralOfficeShopCatalogProduct'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'
import { productCatalogKey } from './productRoutes'
import { SITE_BRAND_NAME } from './siteSeo'

export type OfficeCatalogPdfProgress = {
  phase: 'loading' | 'rendering' | 'done'
  current: number
  total: number
}

const PER_PAGE = 8
const IMG_W = 28
const IMG_H = 28

function formatPriceIt(imponibile: number): string {
  return (
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(imponibile) + ' + IVA'
  )
}

function absoluteImageUrl(url: string): string {
  const u = url.trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('//')) return `https:${u}`
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(u.startsWith('/') ? u : `/${u}`, window.location.origin).href
  }
  return u
}

function loadImageDataUrl(url: string, timeoutMs = 8000): Promise<string | null> {
  const src = absoluteImageUrl(url)
  if (!src) return Promise.resolve(null)

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const timer = window.setTimeout(() => {
      img.src = ''
      resolve(null)
    }, timeoutMs)

    img.onload = () => {
      window.clearTimeout(timer)
      try {
        const canvas = document.createElement('canvas')
        const w = Math.min(img.naturalWidth || 240, 320)
        const h = Math.min(img.naturalHeight || 240, 320)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve(null)
    }
    img.src = src
  })
}

function dedupeProducts(list: OfficeProduct[]): OfficeProduct[] {
  const byKey = new Map<string, OfficeProduct>()
  for (const p of list) {
    const key = productCatalogKey(p) || String(p.id)
    if (!key || byKey.has(key)) continue
    byKey.set(key, p)
  }
  return Array.from(byKey.values())
}

/** Carica catalogo shop escludendo Astro Medical / GIMA. */
export async function loadOfficeCatalogProductsForPdf(): Promise<OfficeProduct[]> {
  const remote = await fetchOfficeProductsFromSupabase(null, null)
  const injected = getInjectedLocalCatalogProducts()
  const merged = dedupeProducts([...remote, ...injected])
  return merged
    .filter(isGeneralOfficeShopCatalogProduct)
    .filter((p) => Boolean(p.name?.trim()))
    .filter((p) => typeof p.price === 'number' && Number.isFinite(p.price) && p.price > 0)
    .sort((a, b) => {
      const ca = `${a.category ?? ''} ${a.subcategory ?? ''}`.localeCompare(
        `${b.category ?? ''} ${b.subcategory ?? ''}`,
        'it',
      )
      if (ca !== 0) return ca
      return a.name.localeCompare(b.name, 'it')
    })
}

export async function generateOfficeCatalogPdf(
  products: readonly OfficeProduct[],
  opts?: { onProgress?: (p: OfficeCatalogPdfProgress) => void },
): Promise<Blob> {
  const list = [...products]
  const total = list.length
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 12
  const contentW = pageW - margin * 2

  // Cover
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageW, pageH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text(SITE_BRAND_NAME, margin, 48)
  doc.setFontSize(16)
  doc.text('Catalogo prodotti ufficio e cancelleria', margin, 62)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Articoli: ${total}  -  Prezzi imponibili IVA esclusa`, margin, 74)
  doc.text(
    `Generato il ${new Date().toLocaleDateString('it-IT')} - esclusa linea Astro Medical / GIMA`,
    margin,
    82,
  )

  const rowH = 32
  let pageIndex = 0

  for (let i = 0; i < list.length; i += PER_PAGE) {
    pageIndex += 1
    doc.addPage()
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageW, pageH, 'F')

    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${SITE_BRAND_NAME} - Catalogo ufficio`, margin, 10)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(`Pagina ${pageIndex}`, pageW - margin, 10, { align: 'right' })

    const chunk = list.slice(i, i + PER_PAGE)
    opts?.onProgress?.({
      phase: 'rendering',
      current: Math.min(i + chunk.length, total),
      total,
    })

    const images = await Promise.all(chunk.map((p) => loadImageDataUrl(p.imageUrl ?? '')))

    let y = 16
    for (let r = 0; r < chunk.length; r++) {
      const p = chunk[r]!
      const dataUrl = images[r]
      const boxY = y

      doc.setDrawColor(226, 232, 240)
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(margin, boxY, contentW, rowH - 2, 2, 2, 'FD')

      if (dataUrl) {
        try {
          doc.addImage(dataUrl, 'JPEG', margin + 2, boxY + 2, IMG_W, IMG_H)
        } catch {
          doc.setFillColor(226, 232, 240)
          doc.rect(margin + 2, boxY + 2, IMG_W, IMG_H, 'F')
        }
      } else {
        doc.setFillColor(226, 232, 240)
        doc.rect(margin + 2, boxY + 2, IMG_W, IMG_H, 'F')
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(7)
        doc.text('N/D', margin + 2 + IMG_W / 2, boxY + 2 + IMG_H / 2, {
          align: 'center',
        })
      }

      const textX = margin + IMG_W + 6
      const textW = contentW - IMG_W - 10
      const categoryLine = [p.category, p.subcategory].filter(Boolean).join(' > ')
      const sku = (p.producerCode || productCatalogKey(p) || p.id || '').trim()

      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      const nameLines = doc.splitTextToSize(p.name.trim(), textW) as string[]
      doc.text(nameLines.slice(0, 2), textX, boxY + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(71, 85, 105)
      if (categoryLine) doc.text(categoryLine, textX, boxY + 16)
      if (sku) doc.text(`Cod. ${sku}`, textX, boxY + 21)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      doc.text(formatPriceIt(p.price as number), textX, boxY + 27)

      y += rowH
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text('www.asforniture.it', pageW / 2, pageH - 6, { align: 'center' })
  }

  opts?.onProgress?.({ phase: 'done', current: total, total })
  return doc.output('blob')
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function downloadOfficeCatalogPdf(
  onProgress?: (p: OfficeCatalogPdfProgress) => void,
): Promise<{ count: number }> {
  onProgress?.({ phase: 'loading', current: 0, total: 0 })
  const products = await loadOfficeCatalogProductsForPdf()
  if (!products.length) {
    throw new Error('Nessun prodotto disponibile per il catalogo PDF.')
  }
  onProgress?.({ phase: 'rendering', current: 0, total: products.length })
  const blob = await generateOfficeCatalogPdf(products, { onProgress })
  const stamp = new Date().toISOString().slice(0, 10)
  downloadBlob(blob, `astro-forniture-catalogo-ufficio-${stamp}.pdf`)
  return { count: products.length }
}
