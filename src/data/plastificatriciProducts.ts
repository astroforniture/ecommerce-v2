import type { OfficeProduct } from '../types/officeProduct'
import { macchineUfficioSubcategoryPath } from '../lib/macchineUfficioRoutes'

/** Sottocategoria Macchine per Ufficio — URL e etichetta UI */
export const MACCHINE_SUB_PLASTIFICATRICI_SLUG = 'plastificatrici-e-materiale'
export const MACCHINE_SUB_PLASTIFICATRICI_LABEL = 'Plastificatrici e Materiale'

export const PLASTIFICATRICI_COVER_IMAGE_URL =
  'https://odmultimedia.eu/immagini/MD/80357.jpg'

export function macchineUfficioPlastificatriciListingPath(): string {
  return macchineUfficioSubcategoryPath(MACCHINE_SUB_PLASTIFICATRICI_SLUG)
}

export const PLASTIFICATRICI_OFFICE_ID_PREFIX = 'AF-PLAST-'

export type PlastificatriciCatalogItem = {
  sku: string
  title: string
  brand: string
  priceImponible: number
  imageUrl: string
  imageGalleryUrls?: string[]
  format?: string
  description: string
  mainFeatures: Record<string, string>
  /** Part number produttore (es. GBC). */
  partNumber?: string
}

export const PLASTIFICATRICI_CATALOG: readonly PlastificatriciCatalogItem[] = [
  // —— Consumabili (pouches Titanium, conf. 100 pz) ——
  {
    sku: '68540',
    title: 'Pouches A7 - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 3,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68540.jpg',
    format: 'A7 (80×111 mm)',
    description:
      'Pouches per plastificazione formato A7 (80×111 mm), spessore 2×125 micron (pesante). Confezione da 100 pezzi Titanium, ideale per badge, tessere e documenti di piccolo formato.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A7 (80×111 mm)',
      Spessore: '2×125 micron (Pesante)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68539',
    title: 'Pouches A6 - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 6,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68539.jpg',
    format: 'A6 (111×154 mm)',
    description:
      'Pouches per plastificazione formato A6 (111×154 mm), spessore 2×125 micron (pesante). Confezione da 100 pezzi Titanium per foto, cartoncini e documenti tascabili.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A6 (111×154 mm)',
      Spessore: '2×125 micron (Pesante)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68555',
    title: 'Pouches A5 Leggere - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 6.5,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68555.jpg',
    format: 'A5 (154×216 mm)',
    description:
      'Pouches A5 leggere (154×216 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per plastificazione quotidiana di documenti e fogli A5.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A5 (154×216 mm)',
      Spessore: '2×80 micron (Leggero)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68538',
    title: 'Pouches A5 Pesanti - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 9.9,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68538.jpg',
    format: 'A5 (154×216 mm)',
    description:
      'Pouches A5 pesanti (154×216 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per una finitura più rigida e resistente.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A5 (154×216 mm)',
      Spessore: '2×125 micron (Pesante)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68554',
    title: 'Pouches A4 Leggere - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 9,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68554.jpg',
    format: 'A4 (216×303 mm)',
    description:
      'Pouches A4 leggere (216×303 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per documenti standard da ufficio.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A4 (216×303 mm)',
      Spessore: '2×80 micron (Leggero)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68537',
    title: 'Pouches A4 Pesanti - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 15,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68537.jpg',
    format: 'A4 (216×330 mm)',
    description:
      'Pouches A4 pesanti (216×330 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per plastificazione resistente di documenti A4.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A4 (216×330 mm)',
      Spessore: '2×125 micron (Pesante)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68553',
    title: 'Pouches A3 Leggere - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 20,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68553.jpg',
    format: 'A3 (303×426 mm)',
    description:
      'Pouches A3 leggere (303×426 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per poster, mappe e documenti grande formato.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A3 (303×426 mm)',
      Spessore: '2×80 micron (Leggero)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },
  {
    sku: '68536',
    title: 'Pouches A3 Pesanti - Titanium (Conf. 100 pezzi)',
    brand: 'Titanium',
    priceImponible: 28,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/68536.jpg',
    format: 'A3 (303×426 mm)',
    description:
      'Pouches A3 pesanti (303×426 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per una plastificazione A3 più robusta.',
    mainFeatures: {
      Tipologia: 'Pouches / Buste plastificazione',
      Formato: 'A3 (303×426 mm)',
      Spessore: '2×125 micron (Pesante)',
      Confezione: '100 pezzi',
      Marca: 'Titanium',
    },
  },

  // —— Macchine ——
  {
    sku: '80357',
    title: 'Plastificatrice Inspire+ A4 - Nera - GBC',
    brand: 'GBC',
    priceImponible: 40.6,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/80357.jpg',
    format: 'A4',
    partNumber: '4402075EU',
    description:
      'Plastificatrice a caldo e a freddo, leggera e compatta, ideale per l’uso occasionale a casa o in piccoli uffici. Dotata di interruttore unico intuitivo e leva di rilascio manuale degli inceppamenti. Incluso starter pack da 5 pouch A4 (2×75 micron).\n\nSpecifiche: Formato A4, Spessore 2×75 – 2×125 micron, Preriscaldamento 4–5 min, Velocità 250 mm/min, 2 Rulli, Potenza 420W, Peso 1,24 kg.',
    mainFeatures: {
      Tipologia: 'Plastificatrice',
      Formato: 'A4',
      'Part number': '4402075EU',
      Spessore: '2×75 – 2×125 micron',
      Preriscaldamento: '4–5 min',
      Velocità: '250 mm/min',
      Rulli: '2',
      Potenza: '420 W',
      Peso: '1,24 kg',
      Modalità: 'Caldo e freddo',
      Incluso: 'Starter pack 5 pouch A4 (2×75 micron)',
    },
  },
  {
    sku: '80358',
    title: 'Plastificatrice Inspire+ A3 - Nera - GBC',
    brand: 'GBC',
    priceImponible: 54.2,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/80358.jpg',
    format: 'A3',
    partNumber: '4402076EU',
    description:
      'Plastificatrice versatile per formati dal badge ID al formato A3. Perfetta per l’uso domestico e in ufficio, supporta la plastificazione sia a caldo che a freddo. Incluso starter pack da 5 pouch A4 (2×75 micron).\n\nSpecifiche: Formato A3 (Luce max 303 mm), Spessore 2×75 – 2×125 micron, Preriscaldamento 4–5 min, Velocità 250 mm/min, 2 Rulli riscaldati, Potenza 550W, Peso 1,68 kg.',
    mainFeatures: {
      Tipologia: 'Plastificatrice',
      Formato: 'A3 (luce max 303 mm)',
      'Part number': '4402076EU',
      Spessore: '2×75 – 2×125 micron',
      Preriscaldamento: '4–5 min',
      Velocità: '250 mm/min',
      Rulli: '2 riscaldati',
      Potenza: '550 W',
      Peso: '1,68 kg',
      Modalità: 'Caldo e freddo',
      Incluso: 'Starter pack 5 pouch A4 (2×75 micron)',
    },
  },
  {
    sku: '84330',
    title: 'Plastificatrice/Taglierina 3in1 A3 - Titanium (Olympia A 340 Combo)',
    brand: 'Titanium',
    priceImponible: 59.9,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/84330.jpg',
    format: 'A3',
    description:
      'Unità multifunzione avanzata che integra plastificatrice a caldo/freddo, taglierina a rullo integrata e arrotonda-angoli integrato sul retro.\n\nSpecifiche: Formato A3 (Luce max 330 mm), Spessore 80/100/125 micron (max doc 0,6 mm), Preriscaldamento 3–5 min, Velocità 250 mm/min, Taglierina 3 tipi di taglio (Diritto, Ondulato, Perforato – cap. 3 fogli 80 g/m²), Sistema ABS sblocco inceppamenti, Potenza 365W, Peso 1,8 kg.',
    mainFeatures: {
      Tipologia: 'Plastificatrice 3in1 + taglierina',
      Formato: 'A3 (luce max 330 mm)',
      Spessore: '80 / 100 / 125 micron (max doc 0,6 mm)',
      Preriscaldamento: '3–5 min',
      Velocità: '250 mm/min',
      Taglierina: 'Diritto, Ondulato, Perforato (3 fogli 80 g/m²)',
      Funzioni: 'Plastificazione, taglio, arrotonda-angoli',
      'Sblocco inceppamenti': 'Sistema ABS',
      Potenza: '365 W',
      Peso: '1,8 kg',
      Modalità: 'Caldo e freddo',
    },
  },
  {
    sku: '78746',
    title: 'Plastificatrice HomeOffice PL 350-L A3 - Titanium',
    brand: 'Titanium',
    priceImponible: 65.3,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/78746.jpg',
    format: 'A3',
    description:
      'Plastificatrice ideale per piccoli uffici e uso domestico frequente. Supporta documenti fino al formato A3 garantendo protezione e finitura di livello professionale per stampe e foto.\n\nSpecifiche: Formato A3, Plastificazione a caldo e a freddo.',
    mainFeatures: {
      Tipologia: 'Plastificatrice',
      Formato: 'A3',
      Modello: 'HomeOffice PL 350-L',
      Modalità: 'Caldo e freddo',
    },
  },
  {
    sku: '65245',
    title: 'Plastificatrice Lunar A4 A Caldo - Fellowes',
    brand: 'Fellowes',
    priceImponible: 69.9,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/65245.jpg',
    imageGalleryUrls: [
      'https://odmultimedia.eu/immagini/MD/65245_1.jpg',
      'https://odmultimedia.eu/immagini/MD/65245_2.jpg',
    ],
    format: 'A4',
    description:
      'Plastificatrice compatta ed elegante progettata da Fellowes per l’uso domestico e l’hobby. Garantisce un processo di plastificazione a caldo rapido, sicuro e privo di inceppamenti.\n\nSpecifiche: Formato A4, Plastificazione a caldo.',
    mainFeatures: {
      Tipologia: 'Plastificatrice',
      Formato: 'A4',
      Modello: 'Lunar',
      Modalità: 'A caldo',
    },
  },
] as const

export function buildPlastificatriciOfficeProducts(): OfficeProduct[] {
  return PLASTIFICATRICI_CATALOG.map((row) => ({
    id: `${PLASTIFICATRICI_OFFICE_ID_PREFIX}${row.sku}`,
    name: row.title,
    brand: row.brand,
    producerCode: row.sku,
    category: 'Macchine per Ufficio',
    subcategory: MACCHINE_SUB_PLASTIFICATRICI_LABEL,
    mainFeatures: {
      ...row.mainFeatures,
      ...(row.partNumber ? { 'Part number': row.partNumber } : {}),
      'Cod. articolo': row.sku,
    },
    imageUrl: row.imageUrl,
    imageGalleryUrls: row.imageGalleryUrls ? [...row.imageGalleryUrls] : undefined,
    price: row.priceImponible,
    description: row.description,
    format: row.format,
  }))
}

export function isPlastificatriciOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(PLASTIFICATRICI_OFFICE_ID_PREFIX)
}

export function resolvePlastificatriciProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  return (
    buildPlastificatriciOfficeProducts().find(
      (p) =>
        p.id === k ||
        p.producerCode === k ||
        p.id === `${PLASTIFICATRICI_OFFICE_ID_PREFIX}${k}`,
    ) ?? null
  )
}

export function matchesPlastificatriciSubcategory(product: {
  subcategory?: string | null
}): boolean {
  const sub = (product.subcategory ?? '').trim()
  return (
    sub.localeCompare(MACCHINE_SUB_PLASTIFICATRICI_LABEL, 'it', { sensitivity: 'base' }) === 0
  )
}
