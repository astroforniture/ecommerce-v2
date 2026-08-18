import type { FaqItem } from '../data/faqCatalog'

export type { FaqItem }

/** Soglia quantità → prezzo unitario (IVA esclusa) per listini sconto quantità. */
export type QuantityPriceTier = {
  minQuantity: number
  unitPrice: number
}

/** Opzione in `products.variants` (JSONB): array o `{ "options": [...] }`. */
export type ProductVariantOption = {
  label: string
  hex?: string
  sku?: string
  image_url?: string
  /** Es. buste forate: Medium / Top (da JSON o dedotto dal testo). */
  quality?: string
  /** Es. buste forate: Liscio / Buccia. */
  finish?: string
  /** Prezzo imponibile della variante (es. misure shopper). */
  price?: number
  /** Pezzi per confezione della variante. */
  packQty?: number
  /** Etichetta confezione (es. «Scatola 500 pz»). */
  packLabel?: string
  /** EAN-13 della variante (es. Sacboll conf. 10 pz). */
  ean?: string
  /** Codice formato breve (es. A, CD, FG). */
  formatCode?: string
  /** Formato esterno (es. «13 x 20 cm»). */
  outerCm?: string
  /** Formato interno utile (es. «11 x 16 cm»). */
  innerCm?: string
}

export interface OfficeProduct {
  id: string // Codice Produttore
  name: string
  brand: string
  producerCode: string
  parentSku?: string
  colorName?: string
  category: string
  subcategory?: string
  mainFeatures: {
    [key: string]: string // Es: Colore: "Bianco", Formato: "A3", Grammatura: "80gr"
  }
  imageUrl: string
  /** Immagini aggiuntive in PDP (es. cataloghi statici): ordine dopo `imageUrl`. */
  imageGalleryUrls?: string[]
  description?: string
  /** Sottotitolo / breve descrizione sotto il titolo in PDP. */
  subtitle?: string
  price?: number
  /** Prezzo di listino (imponibile) prima dello sconto promo; usato per prezzo barrato. */
  compareAtPrice?: number
  /** Percentuale sconto promo visibile a FE (es. 20 → badge "-20%"). */
  discountPercent?: number
  /** true = articolo in pronta consegna (badge «Disponibilità immediata»). */
  inStock?: boolean
  /** Etichetta giacenza visibile in listing/PDP (es. «Disponibilità immediata»). */
  availabilityLabel?: string
  /** Opzionale: colonna `format` su `public.products` (es. buste Mailpack Blasetti). */
  format?: string
  /** Opzionale: EAN-13 su `public.products` (es. Modulistica Edipro). */
  ean?: string
  /** Opzionale: URL brochure / scheda tecnica PDF (es. Casse Ditron NEW iDEAL, GIMA PrintDataSheet). */
  brochureUrl?: string
  /** Etichetta link scheda tecnica (default: «Descrizione prodotto (PDF)»). */
  brochureLinkLabel?: string
  /** Opzionale: URL pagina di catalogo PDF (allegato distinto dalla scheda tecnica). */
  catalogPagePdfUrl?: string
  /** Etichetta link PDF catalogo/manuale (default: «Pagina di catalogo (PDF)»). */
  catalogPagePdfLabel?: string
  /**
   * Documenti tecnici / certificazioni (es. abbigliamento Sicurezza):
   * scheda fornitore, dichiarazione CE, scheda produttore.
   */
  technicalDocuments?: Array<{
    id: string
    title: string
    href: string
    hint?: string
  }>
  /** Opzionale: FAQ prodotto (array domande/risposte). */
  faq?: FaqItem[]
  /** Opzionale: ID prodotti correlati specifici (cross-selling). Fallback: regola per categoria. */
  relatedProductIds?: string[]
  /** Opzionale: da tabella Supabase product_quantity_prices */
  quantityPriceTiers?: QuantityPriceTier[]
  /** Se true, mostra la tabella listino quantità anche con un solo scaglione. */
  showQuantityDiscountTable?: boolean
  /** Quantità minima d'acquisto (pezzi/conf.). Default implicito: 1. */
  minOrderQuantity?: number
  /** Incremento quantità consentito (es. 24 → solo multipli di 24). Default implicito: 1. */
  orderQuantityStep?: number
  /** Opzionale: colonna JSONB `variants` su public.products */
  variants?: ProductVariantOption[]
  /**
   * GPSR (Reg. UE 2023/988) — produttore / importatore / responsabile UE e avvertenze.
   * Valorizzati da colonne DB, JSON `gpsr` o cataloghi FE.
   */
  manufacturerName?: string
  manufacturerAddress?: string
  importerName?: string
  importerAddress?: string
  euResponsibleName?: string
  euResponsibleAddress?: string
  safetyWarnings?: string
}
