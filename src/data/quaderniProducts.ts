import type { OfficeProduct } from '../types/officeProduct'

export const QUADERNI_OFFICE_ID_PREFIX = 'AF-QUAD-'

/** Copertina tile hub Cancelleria (stile compatto Archivio Ufficio). */
export const QUADERNI_HUB_COVER_IMAGE_URL =
  'https://www.bonostore.it/public/ProdImages/MAXI-BM-CART_-VARESE/maxi-BM-10MM2YBJ720928.jpg'

export const CANCELLERIA_SUB_QUADERNI = 'Quaderni'

export function cancelleriaQuaderniListingPath(): string {
  return '/office-products?category=Cancelleria&cancelleriaView=quaderni'
}

export type QuaderniCatalogItem = {
  id: string
  title: string
  imageUrl: string
  imageGalleryUrls?: string[]
  priceImponible: number
  brand: string
}

export const QUADERNI_CATALOG: readonly QuaderniCatalogItem[] = [
  {
    id: 'raccoglitore-4r-a4-30mm-colorosa',
    title: 'Raccoglitore 4R A4 (30mm) - Colorosa',
    brand: 'Colorosa',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/89359.jpg',
    priceImponible: 6.9,
  },
  {
    id: 'raccoglitore-4r-a4-15mm-colorosa',
    title: 'Raccoglitore 4R A4 (15mm) - Colorosa',
    brand: 'Colorosa',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/89358.jpg',
    priceImponible: 5.5,
  },
  {
    id: 'quaderno-monocromo-a5-4mm-pigna',
    title: 'Quaderno Monocromo A5 (4mm) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28912.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/28912_1.jpg'],
    priceImponible: 2.9,
  },
  {
    id: 'quaderno-nature-flowers-a5-5mm-pigna',
    title: 'Quaderno Nature Flowers A5 (5mm) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/97642.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/97642_9.jpg'],
    priceImponible: 3.2,
  },
  {
    id: 'quaderno-monocromo-a5-5mm-pigna',
    title: 'Quaderno Monocromo A5 (5mm) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28913.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/28913_1.jpg'],
    priceImponible: 2.9,
  },
  {
    id: 'quaderno-nature-flowers-a5-1rigo-pigna',
    title: 'Quaderno Nature Flowers A5 (1 rigo) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/97641.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/97641_9.jpg'],
    priceImponible: 3.2,
  },
  {
    id: 'quaderno-monocromo-a5-1rigo-margine-pigna',
    title: 'Quaderno Monocromo A5 (1 rigo c/margine) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28908.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/28908_1.jpg'],
    priceImponible: 2.9,
  },
  {
    id: 'quaderno-crush-a5-1rigo-favini',
    title: 'Quaderno Crush A5 (1 rigo) - Favini',
    brand: 'Favini',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/100772.jpg',
    priceImponible: 3.5,
  },
  {
    id: 'quaderno-colors-a5-spiralato-1rigo-bm',
    title: 'Quaderno Colors A5 Spiralato (1 rigo) - BM',
    brand: 'BM',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/71199.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/71199_1.jpg'],
    priceImponible: 3.8,
  },
  {
    id: 'quaderno-one-color-a5plus-spiralato-1rigo-blasetti',
    title: 'Quaderno One Color A5+ Spiralato (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/59613.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/59613_1.jpg'],
    priceImponible: 4.2,
  },
  {
    id: 'rubrica-cartonato-a5-48f-blasetti',
    title: 'Rubrica cartonato A5 (48 fogli) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/45071.jpg',
    priceImponible: 5.5,
  },
  {
    id: 'rubrica-cartonato-a5-96f-blasetti',
    title: 'Rubrica cartonato A5 (96 fogli) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/45073.jpg',
    priceImponible: 8.9,
  },
  {
    id: 'quaderno-colors-a5-spiralato-5mm-bm',
    title: 'Quaderno Colors A5 Spiralato (5mm) - BM',
    brand: 'BM',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/71197.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/71197_1.jpg'],
    priceImponible: 3.8,
  },
  {
    id: 'quaderno-monocromo-a5-spiralato-5mm-fori-pigna',
    title: 'Quaderno Monocromo A5 Spiralato (5mm c/fori) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/55732.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/55732_1.jpg'],
    priceImponible: 3.9,
  },
  {
    id: 'quaderno-monocromo-a5-spiralato-4mm-sfori-pigna',
    title: 'Quaderno Monocromo A5 Spiralato (4mm s/fori) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/97624.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/97624_1.jpg'],
    priceImponible: 3.9,
  },
  {
    id: 'maxiquaderno-monocromo-a4-spiralato-1rigo-fori-pigna',
    title: 'Maxiquaderno Monocromo A4 Spiralato (1 rigo c/fori) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/38549.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/38549_1.jpg'],
    priceImponible: 6.5,
  },
  {
    id: 'maxiquaderno-color80-a4-cartonato-1rigo-bm',
    title: 'Maxiquaderno Color 80 A4 Cartonato (1 rigo) - BM',
    brand: 'BM',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/74119.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/74119_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-monocromo-a4-cartonato-1rigo-pigna',
    title: 'Maxiquaderno Monocromo A4 Cartonato (1 rigo) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28940.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/28940_1.jpg'],
    priceImponible: 6.2,
  },
  {
    id: 'maxiquaderno-one-color-a4-1rigo-blasetti',
    title: 'Maxiquaderno One Color A4 (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/59073.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/59073_1.jpg'],
    priceImponible: 6.8,
  },
  {
    id: 'maxiquaderno-teen-girl-1rigo-blasetti',
    title: 'Maxiquaderno Teen Girl (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/97362.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/97362_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-teen-boy-1rigo-blasetti',
    title: 'Maxiquaderno Teen Boy (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/104330.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/104330_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-teen-girl-v2-1rigo-blasetti',
    title: 'Maxiquaderno Teen Girl V2 (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/104335.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/104335_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-sport-1rigo-pigna',
    title: 'Maxiquaderno Sport (1 rigo) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/99877.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/99877_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-ragazzo-1rigo-pigna',
    title: 'Maxiquaderno Ragazzo (1 rigo) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/99856.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/99856_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-abcity-1rigo-blasetti',
    title: 'Maxiquaderno ABCity (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/104869.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/104869_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-animal-cut-1rigo-blasetti',
    title: 'Maxiquaderno Animal Cut (1 rigo) - Blasetti',
    brand: 'Blasetti',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/104343.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/104343_1.jpg'],
    priceImponible: 6.9,
  },
  {
    id: 'maxiquaderno-monocromo-a4-cartonato-4mm-pigna',
    title: 'Maxiquaderno Monocromo A4 Cartonato (4mm) - Pigna',
    brand: 'Pigna',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28941.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/MD/28941_1.jpg'],
    priceImponible: 6.4,
  },
] as const

function quaderniDescription(row: QuaderniCatalogItem): string {
  return (
    `${row.title}: articolo da cancelleria (${row.brand}). Formato e rigatura come da descrizione. ` +
    `Prezzo unitario imponibile IVA esclusa; per assortimenti e disponibilità contattare il commerciale.`
  )
}

export function buildQuaderniOfficeProducts(): OfficeProduct[] {
  return QUADERNI_CATALOG.map((row) => ({
    id: `${QUADERNI_OFFICE_ID_PREFIX}${row.id}`,
    name: row.title,
    brand: row.brand,
    producerCode: `${QUADERNI_OFFICE_ID_PREFIX}${row.id}`,
    category: 'Cancelleria',
    subcategory: CANCELLERIA_SUB_QUADERNI,
    mainFeatures: {},
    imageUrl: row.imageUrl,
    imageGalleryUrls: row.imageGalleryUrls,
    price: row.priceImponible,
    description: quaderniDescription(row),
  }))
}

export function isQuaderniOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(QUADERNI_OFFICE_ID_PREFIX)
}
