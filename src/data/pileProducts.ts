import type { OfficeProduct } from '../types/officeProduct'

export const PILE_OFFICE_ID_PREFIX = 'AF-PILE-'

/** Copertina tile hub Cancelleria (card compatta come Archivio Ufficio). */
export const PILE_HUB_COVER_IMAGE_URL =
  'https://www.buyabattery.co.uk/media/catalog/product/cache/8561e7c00b531c8ba481d19414abea81/m/n/mn2400pb_40pk.jpg'

export const CANCELLERIA_SUB_PILE = 'Pile'

export function cancelleriaPileListingPath(): string {
  return '/office-products?category=Cancelleria&cancelleriaView=pile'
}

export type PileCatalogItem = {
  id: string
  title: string
  imageUrl: string
  priceImponible: number
}

export const PILE_CATALOG: readonly PileCatalogItem[] = [
  {
    id: 'mn21-12v-2pz',
    title: 'Pila - MN21 - 12V (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/62771.jpg',
    priceImponible: 4.9,
  },
  {
    id: 'lr1-15v-2pz',
    title: 'Pila - LR1 - 1,5V (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/60419.jpg',
    priceImponible: 4.5,
  },
  {
    id: 'transistor-9v-1pz',
    title: 'Pila Transistor - 9V (1 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/36206.jpg',
    priceImponible: 3.9,
  },
  {
    id: 'cr2025-3v-2pz',
    title: 'Micropila CR2025 - 3V (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/87226.jpg',
    priceImponible: 4.2,
  },
  {
    id: 'dl2032-3v-2pz',
    title: 'Micropila DL2032 - 3V (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/87227.jpg',
    priceImponible: 4.2,
  },
  {
    id: 'lr44-15v-2pz',
    title: 'Micropila LR44 - 1,5V (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68688.jpg',
    priceImponible: 3.5,
  },
  {
    id: 'lr20-d-2pz',
    title: 'Pila torcia - D - LR20 (2 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/36207.jpg',
    priceImponible: 5.9,
  },
  {
    id: 'aa-ricaricabile-4pz',
    title: 'Pila stilo AA Ricaricabile (4 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/70166.jpg',
    priceImponible: 14.9,
  },
  {
    id: 'aaa-ricaricabile-4pz',
    title: 'Pila ministilo AAA Ricaricabile (4 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/70167.jpg',
    priceImponible: 14.9,
  },
  {
    id: 'aa-plus-4pz',
    title: 'Pila stilo AA Plus (4 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/103667.jpg',
    priceImponible: 6.9,
  },
  {
    id: 'aa-plus-12pz',
    title: 'Pila stilo AA Plus (12 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/103669.jpg',
    priceImponible: 16.9,
  },
  {
    id: 'aaa-plus-4pz',
    title: 'Pila ministilo AAA Plus (4 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/103668.jpg',
    priceImponible: 6.9,
  },
  {
    id: 'aaa-plus-12pz',
    title: 'Pila ministilo AAA Plus (12 pz)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/103670.jpg',
    priceImponible: 16.9,
  },
] as const

function pileDescription(row: PileCatalogItem): string {
  return (
    `${row.title}: pile alcaline o specialistiche Duracell per uso domestico e ufficio. Confezione e formato come da ` +
    `descrizione. Prezzo unitario imponibile IVA esclusa; per stock e listini contattare il commerciale.`
  )
}

export function buildPileOfficeProducts(): OfficeProduct[] {
  return PILE_CATALOG.map((row) => ({
    id: `${PILE_OFFICE_ID_PREFIX}${row.id}`,
    name: row.title,
    brand: 'Duracell',
    producerCode: `${PILE_OFFICE_ID_PREFIX}${row.id}`,
    category: 'Cancelleria',
    subcategory: CANCELLERIA_SUB_PILE,
    mainFeatures: {},
    imageUrl: row.imageUrl,
    price: row.priceImponible,
    description: pileDescription(row),
  }))
}

export function isPileOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(PILE_OFFICE_ID_PREFIX)
}
