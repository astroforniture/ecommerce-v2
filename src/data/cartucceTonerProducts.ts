import type { OfficeProduct } from '../types/officeProduct'
import { CARTUCCE_TONER_CATEGORY } from '../lib/officeCategories'

export type CartucceTonerCatalogItem = {
  id: string
  title: string
  imageUrl: string
  /** Prezzo unitario imponibile (EUR), solo vetrina catalogo dedicato. */
  priceImponible: number
}

export const CARTUCCE_TONER_COVER_IMAGE_URL =
  'https://www.larigenera.com/wp-content/uploads/2021/04/toner-1.jpg'

export const CARTUCCE_TONER_CATALOG: readonly CartucceTonerCatalogItem[] = [
  {
    id: 'hp-w1420a',
    title: 'Hp - Cartuccia toner originale - nero - W1420A',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW1420A.jpg',
    priceImponible: 89.0,
  },
  {
    id: 'brother-tn2420',
    title: 'Brother - Toner - Nero - TN2420 - 3000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROTN2420.jpg',
    priceImponible: 72.0,
  },
  {
    id: 'brother-tn2510',
    title: 'Brother originale - Toner - Nero - TN2510 - 1.200 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROTN2510.jpg',
    priceImponible: 64.5,
  },
  {
    id: 'hp-w1350a',
    title: 'Hp - Toner originale - 135A - Nero - W1350A - 1.100 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW1350A.jpg',
    priceImponible: 76.0,
  },
  {
    id: 'hp-w1106a',
    title: 'Hp - Toner originale - 106A - nero - W1106A - 1.000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW1106A.jpg',
    priceImponible: 58.0,
  },
  {
    id: 'brother-tn243bk',
    title: 'Brother - Toner - Nero - TN243BK - 1000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/LD/BROTN243BK.jpg',
    priceImponible: 49.9,
  },
  {
    id: 'brother-dr1050',
    title: 'Brother - Tamburo - Nero - DR1050- 10000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRODR1050.jpg',
    priceImponible: 95.0,
  },
  {
    id: 'hp-cf244a',
    title: 'Hp - Toner originale - 44A - Nero - CF244A - 1.000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCF244A.jpg',
    priceImponible: 62.0,
  },
  {
    id: 'hp-w2071a',
    title: 'Hp - Toner originale - 117A - ciano - W2071A - 700 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2071A.jpg',
    priceImponible: 79.0,
  },
  {
    id: 'hp-w2070a',
    title: 'Hp - Toner originale - 117A - nero - W2070A - 1.000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2070A.jpg',
    priceImponible: 69.0,
  },
  {
    id: 'hp-w2073a',
    title: 'Hp - Toner originale - 117A - magenta - W2073A - 700 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2073A.jpg',
    priceImponible: 79.0,
  },
  {
    id: 'hp-w2072a',
    title: 'Hp - Toner originale - 117A - giallo - W2072A - 700 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2072A.jpg',
    priceImponible: 79.0,
  },
  {
    id: 'hp-w1350x',
    title: 'Hp - Toner originale - 135X - Nero - W1350X - 2.400 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW1350X.jpg',
    priceImponible: 98.0,
  },
  {
    id: 'brother-tn1050',
    title: 'Brother - Toner - Nero - TN1050 - 1000 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROTN1050.jpg',
    priceImponible: 44.9,
  },
  {
    id: 'hp-w2411a',
    title: 'Hp - Toner originale - 216A - Ciano - W2411A - 850 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2411A.jpg',
    priceImponible: 84.0,
  },
  {
    id: 'hp-w2412a',
    title: 'Hp - Toner originale - 216A - Giallo - W2412A - 850 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2412A.jpg',
    priceImponible: 84.0,
  },
  {
    id: 'hp-w2413a',
    title: 'Hp - Toner originale - 216A - Magenta - W2413A - 850 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2413A.jpg',
    priceImponible: 84.0,
  },
  {
    id: 'hp-w2410a',
    title: 'Hp - Toner originale - 216A - Nero - W2410A - 1.050 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPW2410A.jpg',
    priceImponible: 72.0,
  },
  {
    id: 'epson-c13t16224012',
    title: 'Epson - Cartuccia ink - 16 - Ciano - C13T16224012 - 3,1ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST16224012.jpg',
    priceImponible: 18.9,
  },
  {
    id: 'epson-c13t16244012',
    title: 'Epson - Cartuccia ink - 16 - Giallo - C13T16244012 - 3,1ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST16244012.jpg',
    priceImponible: 18.9,
  },
  {
    id: 'epson-c13t16234012',
    title: 'Epson - Cartuccia ink - 16 - Magenta - C13T16234012 - 3,1ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST16234012.jpg',
    priceImponible: 18.9,
  },
  {
    id: 'epson-c13t16214012',
    title: 'Epson - Cartuccia ink - 16 - Nero - C13T16214012 - 5,4ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST16214012.jpg',
    priceImponible: 22.5,
  },
  {
    id: 'epson-c13t16264012',
    title: 'Epson - Multipack Cartuccia ink - 16 - C/M/Y/K - C13T16264012',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST16264012.jpg',
    priceImponible: 59.9,
  },
  {
    id: 'epson-c13t29834012',
    title: 'Epson - Cartuccia ink - 29 - Magenta - C13T29834012 - 3,2ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST29834012.jpg',
    priceImponible: 19.5,
  },
  {
    id: 'epson-c13t29814012',
    title: 'Epson - Cartuccia ink - 29 - Nero - C13T29814012 - 5,3ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST29814012.jpg',
    priceImponible: 24.0,
  },
  {
    id: 'epson-c13t29824012',
    title: 'Epson - Cartuccia ink - 29 - Ciano - C13T29824012 - 3,2ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST29824012.jpg',
    priceImponible: 19.5,
  },
  {
    id: 'epson-c13t29844012',
    title: 'Epson - Cartuccia ink - 29 - Giallo - C13T29844012 - 3,2ml',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST29844012.jpg',
    priceImponible: 19.5,
  },
  {
    id: 'epson-c13t29864012',
    title: 'Epson - Confezioni cartucce ink - 29 - C/M/Y/K - C13T29864012',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST29864012.jpg',
    priceImponible: 64.9,
  },
  {
    id: 'epson-c13t05g64010',
    title: 'Epson - Cartuccia Multipack DURABriteUltra 405 - BK/C/M/Y - C13T05G64010',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/epst05g64010.jpg',
    priceImponible: 89.0,
  },
  {
    id: 'epson-c13t05g34010',
    title: 'Epson - Cartuccia ink - 405 - Magenta - C13T05G34010 - 300 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST05G34010.jpg',
    priceImponible: 28.0,
  },
  {
    id: 'epson-c13t05g14010',
    title: 'Epson - Cartuccia ink - 405 - Nero - C13T05G14010 - 300 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST05G14010.jpg',
    priceImponible: 32.0,
  },
  {
    id: 'epson-c13t05g24010',
    title: 'Epson - Cartuccia ink - 405 - Ciano - C13T05G24010 - 300 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST05G24010.jpg',
    priceImponible: 28.0,
  },
  {
    id: 'epson-c13t05g44010',
    title: 'Epson - Cartuccia ink - 405 - giallo - C13T05G44010 - 300 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/EPST05G44010.jpg',
    priceImponible: 28.0,
  },
  {
    id: 'hp-6zd17ae',
    title: 'Hp - conf. combo 2 toner originale - 305 - C/M/Y/K - 6ZD17AE',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HP6ZD17AE.jpg',
    priceImponible: 389.0,
  },
  {
    id: 'hp-ce412a',
    title: 'Hp - Toner originale - 305A - Giallo - CE412A - 2.600 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCE412A.jpg',
    priceImponible: 189.0,
  },
  {
    id: 'hp-ce410a',
    title: 'Hp - Toner originale - 305A - Nero - CE410A - 2.090 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCE410A.jpg',
    priceImponible: 95.0,
  },
  {
    id: 'hp-ce413a',
    title: 'Hp - Toner originale - 305A - Magenta - CE413A - 2.600 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCE413A.jpg',
    priceImponible: 189.0,
  },
  {
    id: 'hp-ce411a',
    title: 'Hp - Toner originale - 305A - Ciano - CE411A - 2.600 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCE411A.jpg',
    priceImponible: 189.0,
  },
  {
    id: 'hp-3ym61ae',
    title: 'Hp - Cartuccia Ink originale - 305 - Nero - 3YM61AE - 120 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HP3YM61AE.jpg',
    priceImponible: 22.5,
  },
  {
    id: 'hp-3ym60ae',
    title: 'Hp - Cartuccia Ink originale - 305 - C/M/Y - 3YM60AE - 100 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HP3YM60AE.jpg',
    priceImponible: 32.0,
  },
  {
    id: 'hp-3ym62ae',
    title: 'Hp - Cartuccia Ink originale- 305XL - Nero - 3YM62AE - 240 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HP3YM62AE.jpg',
    priceImponible: 38.0,
  },
  {
    id: 'hp-3ym63ae',
    title: 'Hp - Cartuccia Ink originale - 305XL - C/M/Y - 3YM63AE - 200 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HP3YM63AE.jpg',
    priceImponible: 48.0,
  },
  {
    id: 'hp-cc531a',
    title: 'Hp - Toner originale - 304A - Ciano - CC531A - 2.800 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCC531A.jpg',
    priceImponible: 175.0,
  },
  {
    id: 'hp-cc530a',
    title: 'Hp - Toner originale - 304A - Nero - CC530A - 3.500 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCC530A.jpg',
    priceImponible: 98.0,
  },
  {
    id: 'hp-cc533a',
    title: 'Hp - Toner originale - 304A - Magenta - CC533A - 2.800 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCC533A.jpg',
    priceImponible: 175.0,
  },
  {
    id: 'hp-cc532a',
    title: 'Hp - Toner originale - 304A - Giallo - CC532A - 2.800 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCC532A.jpg',
    priceImponible: 175.0,
  },
  {
    id: 'hp-f6u66ae',
    title: 'Hp - Cartuccia ink originale - 302 - Nero - F6U66AE - 190 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPF6U66AE.jpg',
    priceImponible: 24.5,
  },
  {
    id: 'hp-f6u65ae',
    title: 'Hp - Cartuccia ink originale - 302 - C/M/Y - F6U65AE - 165 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPF6U65AE.jpg',
    priceImponible: 34.0,
  },
  {
    id: 'hp-ch561ee',
    title: 'Hp - Cartuccia ink originale- 301 - Nero - CH561EE - 190 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCH561EE.jpg',
    priceImponible: 23.5,
  },
  {
    id: 'hp-ch562ee',
    title: 'Hp - Cartuccia ink originale - 301 - C/M/Y - CH562EE - 165 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCH562EE.jpg',
    priceImponible: 32.5,
  },
  {
    id: 'hp-ch563ee',
    title: 'Hp - Cartuccia ink originale - 301XL - Nero - CH563EE - 480 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCH563EE.jpg',
    priceImponible: 36.0,
  },
  {
    id: 'hp-ch564ee',
    title: 'Hp - Cartuccia ink originale- 301XL - C/M/Y - CH564EE - 330 pag',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/HPCH564EE.jpg',
    priceImponible: 46.0,
  },
] as const

export const CARTUCCE_TONER_OFFICE_ID_PREFIX = 'AF-TONER-'

function brandFromCartucceTitle(title: string): string {
  const t = title.toLowerCase()
  if (t.startsWith('epson') || t.includes(' epson')) return 'Epson'
  if (t.startsWith('hp') || t.includes(' hp')) return 'HP'
  if (t.includes('brother')) return 'Brother'
  return 'Varie'
}

function cartucceTonerCatalogDescription(row: CartucceTonerCatalogItem, brand: string): string {
  return (
    `${row.title}: consumabile originale o da catalogo (${brand}), indicato per stampanti e multifunzione compatibili. ` +
    `Resa in pagine e colorazione secondo dichiarazioni del produttore. Prezzo unitario imponibile IVA esclusa; ` +
    `verificare sempre la compatibilità con il proprio modello prima dell'ordine.`
  )
}

export function buildCartucceTonerOfficeProducts(): OfficeProduct[] {
  return CARTUCCE_TONER_CATALOG.map((row) => {
    const brand = brandFromCartucceTitle(row.title)
    return {
      id: `${CARTUCCE_TONER_OFFICE_ID_PREFIX}${row.id}`,
      name: row.title,
      brand,
      producerCode: `${CARTUCCE_TONER_OFFICE_ID_PREFIX}${row.id}`,
      category: CARTUCCE_TONER_CATEGORY,
      subcategory: undefined,
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: cartucceTonerCatalogDescription(row, brand),
    }
  })
}

export function isCartucceTonerOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(CARTUCCE_TONER_OFFICE_ID_PREFIX)
}
