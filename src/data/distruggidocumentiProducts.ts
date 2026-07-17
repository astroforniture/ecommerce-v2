import type { OfficeProduct } from '../types/officeProduct'
import { macchineUfficioSubcategoryPath } from '../lib/macchineUfficioRoutes'

export type DistruggidocumentiCatalogItem = {
  id: string
  title: string
  imageUrl: string
  /** Prezzo unitario imponibile (EUR), solo vetrina catalogo dedicato. */
  priceImponible: number
}

export const DISTRUGGIDOCUMENTI_COVER_IMAGE_URL =
  'https://odmultimedia.eu/immagini/MD/92766.jpg'

/** Sottocategoria Macchine per Ufficio — URL e etichetta UI */
export const MACCHINE_SUB_DISTRUGGI_DOCUMENTI_SLUG = 'distruggi-documenti'
export const MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL = 'Distruggi Documenti'

export function macchineUfficioDistruggiDocumentiListingPath(): string {
  return macchineUfficioSubcategoryPath(MACCHINE_SUB_DISTRUGGI_DOCUMENTI_SLUG)
}

export const DISTRUGGIDOCUMENTI_CATALOG: readonly DistruggidocumentiCatalogItem[] = [
  {
    id: 'rexel-secure-s5',
    title: 'Distruggidocumenti Secure S5 - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/92766.jpg',
    priceImponible: 45.9,
  },
  {
    id: 'rexel-secure-x6',
    title: 'Distruggidocumenti Secure X6 - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/92767_2.jpg',
    priceImponible: 119.0,
  },
  {
    id: 'rexel-momentum-x406',
    title: 'Distruggidocumenti Momentum X406 - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/95071.jpg',
    priceImponible: 189.0,
  },
  {
    id: 'titanium-080x',
    title: 'Distruggidocumenti 080X - Titanium',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/75989.jpg',
    priceImponible: 79.5,
  },
  {
    id: 'fellowes-m-7cm',
    title: 'Distruggidocumenti M-7CM - Fellowes',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/103117.jpg',
    priceImponible: 149.0,
  },
  {
    id: 'rexel-momentum-x410',
    title: 'Distruggidocumenti Momentum X410 - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/90022.jpg',
    priceImponible: 229.0,
  },
  {
    id: 'leitz-iq-home-office-p4',
    title: 'Distruggidocumenti Home Office P4 - Leitz IQ',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/86814.jpg',
    priceImponible: 99.0,
  },
  {
    id: 'fellowes-lx-41',
    title: 'Distruggidocumenti LX-41 - Fellowes',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/95081.jpg',
    priceImponible: 169.0,
  },
  {
    id: 'kobra-c1',
    title: 'Distruggidocumenti C1 - Kobra',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/74767.jpg',
    priceImponible: 259.0,
  },
  {
    id: 'kobra-hybrid',
    title: 'Distruggidocumenti Hybrid - Kobra',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/86880.jpg',
    priceImponible: 189.0,
  },
  {
    id: 'rexel-optimum-autofeed-50x',
    title: 'Distruggidocumenti Optimum AutoFeed+ 50X - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/92566.jpg',
    priceImponible: 449.0,
  },
  {
    id: 'kobra-s4-hybrid',
    title: 'Distruggidocumenti S4-HYBRID - Kobra',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/99619.jpg',
    priceImponible: 139.0,
  },
  {
    id: 'leitz-office-225',
    title: 'Distruggidocumenti Office 225 - Leitz',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/104444.jpg',
    priceImponible: 319.0,
  },
  {
    id: 'rexel-mercury-rem820',
    title: 'Distruggidocumenti Mercury REM820 - Rexel',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/80366.jpg',
    priceImponible: 279.0,
  },
  {
    id: 'fellowes-automatico-80m',
    title: 'Distruggidocumenti 80M - Fellowes',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/98809.jpg',
    priceImponible: 529.0,
  },
] as const

export const DISTRUGGIDOCUMENTI_OFFICE_ID_PREFIX = 'AF-DIST-'

function brandFromDistruggiTitle(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('leitz iq')) return 'Leitz IQ'
  if (t.includes('leitz')) return 'Leitz'
  if (t.includes('kobra')) return 'Kobra'
  if (t.includes('fellowes')) return 'Fellowes'
  if (t.includes('titanium')) return 'Titanium'
  if (t.includes('rexel')) return 'Rexel'
  return 'Varie'
}

/** Testo vetrina per la sezione «Descrizione Prodotto» sulla PDP (allineata al catalogo standard). */
export function distruggidocumentiCatalogDescription(
  row: DistruggidocumentiCatalogItem,
  brand: string,
): string {
  return (
    `${row.title}: distruggidocumenti elettrico adatto a uso personale, studio o piccolo ufficio (${brand}). ` +
    `Pensato per la distruzione periodica di documenti cartacei; tipo di taglio, livello di sicurezza e capienza secondo le specifiche del produttore. ` +
    `Prezzo unitario imponibile IVA esclusa. Per volumi, garanzie estese o installazioni contattare il nostro ufficio commerciale.`
  )
}

export function buildDistruggidocumentiOfficeProducts(): OfficeProduct[] {
  return DISTRUGGIDOCUMENTI_CATALOG.map((row) => {
    const brand = brandFromDistruggiTitle(row.title)
    return {
      id: `${DISTRUGGIDOCUMENTI_OFFICE_ID_PREFIX}${row.id}`,
      name: row.title,
      brand,
      producerCode: `${DISTRUGGIDOCUMENTI_OFFICE_ID_PREFIX}${row.id}`,
      category: 'Macchine per Ufficio',
      subcategory: MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: distruggidocumentiCatalogDescription(row, brand),
    }
  })
}

export function isDistruggidocumentiOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(DISTRUGGIDOCUMENTI_OFFICE_ID_PREFIX)
}
