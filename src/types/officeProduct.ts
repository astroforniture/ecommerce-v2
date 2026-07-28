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
  price?: number
  /** Opzionale: colonna `format` su `public.products` (es. buste Mailpack Blasetti). */
  format?: string
  /** Opzionale: EAN-13 su `public.products` (es. Modulistica Edipro). */
  ean?: string
  /** Opzionale: da tabella Supabase product_quantity_prices */
  quantityPriceTiers?: QuantityPriceTier[]
  /** Opzionale: colonna JSONB `variants` su public.products */
  variants?: ProductVariantOption[]
}
