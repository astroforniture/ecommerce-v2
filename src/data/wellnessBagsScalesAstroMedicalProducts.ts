import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Borse pregiate, termoterapia, ausili, bilance e pesaneonati GIMA (listino imponibile IVA esclusa). */
export const WELLNESS_BAGS_SCALES_OFFICE_ID_PREFIX = 'AF-WELL-'

let wellnessGimaIdSet: ReadonlySet<string> | null = null

export function isWellnessBagsScalesAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  wellnessGimaIdSet ??= new Set(buildWellnessBagsScalesAstroMedicalOfficeProducts().map((p) => p.id))
  return wellnessGimaIdSet.has(s)
}

type WellRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory: string
}

const P = WELLNESS_BAGS_SCALES_OFFICE_ID_PREFIX
const BAGS_SUB = 'Borse pregiate in pelle e cuoio'
const THERMO_SUB = 'Termoterapia e benessere'
const AIDS_SUB = 'Ausili per pazienti'
const SCALE_SUB = 'Bilance pesapersone'
const PRO_SCALE_SUB = 'Bilance professionali e pesaneonati'

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const WELLNESS_CATALOG: readonly WellRow[] = [
  {
    slug: 'gima-27110',
    name: 'BORSA MEDICA "TEXAS PELLE" — castagna — GIMA 27110',
    brand: 'Gima',
    priceImponible: 276,
    imageUrl: gimaMedium('27110.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa medica Texas in pelle, colore castagna; fondo rigido, tasca interna con bottone, serratura Tuc brunita. ' +
      'Misure esterne 35×17×h 22 cm. Made in Italy. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27114',
    name: 'BORSA "VALIGETTA CUOIO FIORE" — nera — GIMA 27114',
    brand: 'Gima',
    priceImponible: 343,
    imageUrl: gimaMedium('27114.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Valigetta in cuoio fiore, colore nero; fondo rigido, tasca interna con zip e tasca a soffietto. ' +
      'Misure esterne 34×18×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27120',
    name: 'BORSA "VALIGETTA CUOIO FIORE" — marrone — GIMA 27120',
    brand: 'Gima',
    priceImponible: 318,
    imageUrl: gimaMedium('27120.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Valigetta in cuoio fiore, colore marrone; fondo rigido, tasche interne con zip. ' +
      'Misure esterne 34×18×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27115',
    name: 'BORSA "SUPERTEXAS PELLE" — nera — GIMA 27115',
    brand: 'Gima',
    priceImponible: 328,
    imageUrl: gimaMedium('27115.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa SuperTexas in pelle, colore nero; tasche esterna e interna con zip, divisorio trasversale 8 cm, doppia serratura brunita. ' +
      'Misure esterne 41×20×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27116',
    name: 'BORSA "SUPERTEXAS PELLE" — castagna — GIMA 27116',
    brand: 'Gima',
    priceImponible: 330,
    imageUrl: gimaMedium('27116.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa SuperTexas in pelle, colore castagna; ampia zona centrale portoggetti e doppia serratura. ' +
      'Misure esterne 41×20×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27118',
    name: 'BORSA "SUPERTEXAS PELLE" — bordeaux — GIMA 27118',
    brand: 'Gima',
    priceImponible: 335,
    imageUrl: gimaMedium('27118.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa SuperTexas in pelle, colore bordeaux; tasche con zip e divisorio interno. ' +
      'Misure esterne 41×20×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27100',
    name: 'BORSA "TEXAS SKAY" — nera — GIMA 27100',
    brand: 'Gima',
    priceImponible: 198,
    imageUrl: gimaMedium('27100.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Texas in skay, colore nero; fondo rigido, tasca interna con bottone, serratura Tuc brunita. ' +
      'Misure esterne 35×13×h 24 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27101',
    name: 'BORSA "TEXAS SKAY" — cognac — GIMA 27101',
    brand: 'Gima',
    priceImponible: 198,
    imageUrl: gimaMedium('27101.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Texas in skay, colore cognac; formato compatto per visite e ambulatorio. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27104',
    name: 'BORSA "INFERMIERA SKAY" — cognac — GIMA 27104',
    brand: 'Gima',
    priceImponible: 215,
    imageUrl: gimaMedium('27104.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Infermiera in skay cognac; fondo rigido, tasca a soffietto e zip interna. ' +
      'Misure esterne 38×20×h 20 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27105',
    name: 'BORSA "SUPERTEXAS SKAY" — cognac — GIMA 27105',
    brand: 'Gima',
    priceImponible: 248,
    imageUrl: gimaMedium('27105.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa SuperTexas in skay cognac; tasca esterna a soffietto, divisorio interno 8 cm, doppia serratura. ' +
      'Misure esterne 41×20×h 22 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27108',
    name: 'BORSA "GRANDE POLUS SKAY" — cognac — GIMA 27108',
    brand: 'Gima',
    priceImponible: 268,
    imageUrl: gimaMedium('27108.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Grande Polus in skay cognac; fondo rigido, elastici fermaoggetti sui lati interni. ' +
      'Misure esterne 45×20×h 25 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28593',
    name: 'THERMY GEL CALDO-FREDDO 14×18 cm — GIMA 28593',
    brand: 'Gima',
    priceImponible: 33.4,
    imageUrl: gimaMedium('28593.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Gel caldo/freddo atossico riutilizzabile 14×18 cm; microonde, acqua calda o freezer. ' +
      'Dispositivo medico Classe I. Abbinare fodera velcro GIMA 28596. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28594',
    name: 'THERMY GEL CALDO-FREDDO 11×26 cm — GIMA 28594',
    brand: 'Gima',
    priceImponible: 34.5,
    imageUrl: gimaMedium('28594.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Gel caldo/freddo 11×26 cm per lombalgia, torcicollo, traumi e distorsioni. ' +
      'Utilizzabile con fodera velcro GIMA 28596. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28596',
    name: 'FODERA THERMY GEL con chiusura velcro 25,5×12,5 cm — GIMA 28596',
    brand: 'Gima',
    priceImponible: 12.5,
    imageUrl: gimaMedium('28596.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Fodera con velcro per panetti Thermy Gel; evita contatto diretto sulla pelle. ' +
      'Compatibile con GIMA 28593 e 28594. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28605',
    name: 'BORSA GHIACCIO Ø 28 cm — apertura 6 cm — GIMA 28605',
    brand: 'Gima',
    priceImponible: 8.8,
    imageUrl: gimaMedium('28605.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Borsa per ghiaccio, diametro 28 cm, apertura 6 cm; per crioterapia e primo soccorso. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28670',
    name: 'TERMOFORO senza copertura — GIMA 28670',
    brand: 'Gima',
    priceImponible: 38,
    imageUrl: gimaMedium('28670.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Termoforo elettrico senza copertura; 3 impostazioni di temperatura. Dimensioni circa 40×30 cm. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28671',
    name: 'TERMOFORO con copertura — GIMA 28671',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('28671.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Termoforo elettrico con copertura; 6 impostazioni. Dimensioni circa 63×42 cm. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28674',
    name: 'TERMOFORO COLLO E SPALLE — GIMA 28674',
    brand: 'Gima',
    priceImponible: 43,
    imageUrl: gimaMedium('28674.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Termoforo anatomico per collo e spalle; terapia del calore mirata. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28675',
    name: 'CINTURA RISCALDANTE — GIMA 28675',
    brand: 'Gima',
    priceImponible: 52,
    imageUrl: gimaMedium('28675.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Cintura riscaldante elettrica per zona lombare e addome. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28664',
    name: 'PLAID RISCALDABILE — GIMA 28664',
    brand: 'Gima',
    priceImponible: 68,
    imageUrl: gimaMedium('28664.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Plaid riscaldabile elettrico per benessere domestico e recupero muscolare. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28668',
    name: 'SCALDAPIEDI con massaggio — GIMA 28668',
    brand: 'Gima',
    priceImponible: 89,
    imageUrl: gimaMedium('28668.jpg'),
    subcategory: THERMO_SUB,
    description:
      'Scaldapiedi elettrico con funzione massaggio; comfort e rilassamento. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28921',
    name: 'KIT POSATE MODELLABILI — GIMA 28921',
    brand: 'Gima',
    priceImponible: 49,
    imageUrl: gimaMedium('28921.jpg'),
    subcategory: AIDS_SUB,
    description:
      'Set posate modellabili per anziani e disabili; impugnature ergonomiche adattabili. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28610',
    name: 'CIAMBELLA GOMMA Ø 35 cm — GIMA 28610',
    brand: 'Gima',
    priceImponible: 24,
    imageUrl: gimaMedium('28610.jpg'),
    subcategory: AIDS_SUB,
    description:
      'Ciambella in gomma Ø 35 cm, circonferenza interna Ø 14 cm; ausilio antidecubito. ' +
      'Abbinare pompa GIMA 28614. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28611',
    name: 'CIAMBELLA GOMMA Ø 40 cm — GIMA 28611',
    brand: 'Gima',
    priceImponible: 28,
    imageUrl: gimaMedium('28611.jpg'),
    subcategory: AIDS_SUB,
    description:
      'Ciambella in gomma Ø 40 cm; supporto seduta. Compatibile con pompa GIMA 28614. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28612',
    name: 'CIAMBELLA GOMMA Ø 45 cm — GIMA 28612',
    brand: 'Gima',
    priceImponible: 32,
    imageUrl: gimaMedium('28612.jpg'),
    subcategory: AIDS_SUB,
    description:
      'Ciambella in gomma Ø 45 cm; taglia max della gamma. Pompa dedicata GIMA 28614. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28614',
    name: 'POMPA per ciambella gomma — GIMA 28614',
    brand: 'Gima',
    priceImponible: 16,
    imageUrl: gimaMedium('28614.jpg'),
    subcategory: AIDS_SUB,
    description:
      'Pompa per gonfiaggio ciambelle GIMA 28610, 28611 e 28612. Dispositivo medico Classe I. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27087',
    name: 'BILANCIA DIGITALE OMRON HN-286 — GIMA 27087',
    brand: 'Omron',
    priceImponible: 25.5,
    imageUrl: gimaMedium('27087.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia digitale pesapersone Omron HN-286; display chiaro per uso domestico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27086',
    name: 'BILANCIA BODY FAT GIMAFIT con Bluetooth 5.0 — nera — GIMA 27086',
    brand: 'Gima',
    priceImponible: 39.8,
    imageUrl: gimaMedium('27086.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia analisi composizione corporea GIMAFIT con Bluetooth 5.0, colore nero. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27094',
    name: 'BILANCIA BODY FAT GIMAFIT con app Bluetooth — GIMA 27094',
    brand: 'Gima',
    priceImponible: 42,
    imageUrl: gimaMedium('27094.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia GIMAFIT con app dedicata via Bluetooth; monitoraggio peso e metriche corporee. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27089',
    name: 'BILANCIA BODY FAT LIBRA — nera — GIMA 27089',
    brand: 'Gima',
    priceImponible: 36,
    imageUrl: gimaMedium('27089.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia body fat Libra, colore nero; analisi composizione per uso domestico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27229',
    name: 'BILANCIA DIGITALE compatta — GIMA 27229',
    brand: 'Gima',
    priceImponible: 22,
    imageUrl: gimaMedium('27229.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia digitale compatta per pesatura quotidiana. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24990',
    name: 'PESANEONATO ELETTRONICA PROFESSIONALE WUNDER BABY 02-1 — Classe III — GIMA 24990',
    brand: 'Gima',
    priceImponible: 520,
    imageUrl: gimaMedium('24990.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Bilancia elettronica professionale portatile per neonati 6–15 kg, Classe III; funzioni hold, tara, milk intake, RS232. ' +
      'Superficie ABS 560×290 mm. Made in Italy. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27267',
    name: 'BILANCIA OSPEDALIERA PESANEONATI SECA 376 — 20 kg — Classe III — GIMA 27267',
    brand: 'Seca',
    priceImponible: 1380,
    imageUrl: gimaMedium('27267.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati ospedaliera Seca 376 digitale Classe III; portata 20 kg, precisione 5–10 g, wireless Seca 360° opzionale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27294',
    name: 'PESANEONATI SECA 745 — meccanica — Classe III — GIMA 27294',
    brand: 'Seca',
    priceImponible: 524,
    imageUrl: gimaMedium('27294.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati meccanica Seca 745, Classe III; piatto ricurvo, portata 16 kg, precisione 10 g. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27299',
    name: 'PESANEONATI SECA 725 — meccanica — GIMA 27299',
    brand: 'Seca',
    priceImponible: 398,
    imageUrl: gimaMedium('27299.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati meccanica Seca 725; portata 16 kg, precisione 5 g, struttura in acciaio. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27282',
    name: 'PESANEONATI SECA 354 — elettronica — Classe III — GIMA 27282',
    brand: 'Seca',
    priceImponible: 485,
    imageUrl: gimaMedium('27282.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati elettronica Seca 354 Classe III; vassoio removibile, funzione breast-milk-intake. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27283',
    name: 'PESANEONATI SECA 384 — elettronica — Classe III — GIMA 27283',
    brand: 'Seca',
    priceImponible: 545,
    imageUrl: gimaMedium('27283.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati Seca 384 Classe III; due modalità sdraiato/pavimento, hold automatico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27300',
    name: 'PESANEONATI MECCANICA GIMA — GIMA 27300',
    brand: 'Gima',
    priceImponible: 165,
    imageUrl: gimaMedium('27300.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati meccanica Gima; portata 20 kg, piatto ricurvo, struttura stabile. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27266',
    name: 'PESANEONATI RIPIEGABILE SOEHNLE 8320 — GIMA 27266',
    brand: 'Soehnle',
    priceImponible: 295,
    imageUrl: gimaMedium('27266.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Pesaneonati ripiegabile Soehnle 8320; soluzione compatta per ambulatorio e domicilio. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27313',
    name: 'BILANCIA PESA NEONATI GIMA — elettronica — GIMA 27313',
    brand: 'Gima',
    priceImponible: 225,
    imageUrl: gimaMedium('27313.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Bilancia pesaneonati elettronica Gima; design pratico con ampio piatto di pesata. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27275',
    name: 'BILANCIA PROFESSIONALE SOEHNLE 7830 — GIMA 27275',
    brand: 'Soehnle',
    priceImponible: 890,
    imageUrl: gimaMedium('27275.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Bilancia professionale Soehnle 7830 con colonna; uso ambulatorio e studio medico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27276',
    name: 'BILANCIA PROFESSIONALE SOEHNLE 7831 con altimetro e IMC — GIMA 27276',
    brand: 'Soehnle',
    priceImponible: 1180,
    imageUrl: gimaMedium('27276.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Bilancia Soehnle 7831 con altimetro integrato 120–202 cm e display IMC. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27296',
    name: 'BILANCIA PROFESSIONALE SECA 711 — Classe III — GIMA 27296',
    brand: 'Seca',
    priceImponible: 1650,
    imageUrl: gimaMedium('27296.jpg'),
    subcategory: PRO_SCALE_SUB,
    description:
      'Bilancia medica Seca 711 Classe III; portata 220 kg, precisione 100 g, uso ospedaliero. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function wellRowForSlug(slug: string): WellRow {
  const row = WELLNESS_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown wellness catalog slug: ${slug}`)
  return row
}

function wellGimaIdForSlug(slug: string): string {
  return gimaOfficeProductIdFromImageUrl(wellRowForSlug(slug).imageUrl) ?? `${P}${slug}`
}

export function wellnessBagsScalesCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return wellGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const LEATHER_BAG_IDS = [
  'gima-27110',
  'gima-27114',
  'gima-27115',
  'gima-27116',
  'gima-27118',
  'gima-27120',
].map(wellGimaIdForSlug) as readonly string[]

const SKAY_BAG_IDS = ['gima-27100', 'gima-27101', 'gima-27104', 'gima-27105', 'gima-27108'].map(
  wellGimaIdForSlug,
) as readonly string[]

const THERMY_IDS = [wellGimaIdForSlug('gima-28593'), wellGimaIdForSlug('gima-28594')] as const
const COVER_ID = wellGimaIdForSlug('gima-28596')
const THERMO_GROUP_IDS = WELLNESS_CATALOG.filter((r) => r.subcategory === THERMO_SUB).map((r) =>
  wellGimaIdForSlug(r.slug),
)

const RING_IDS = ['gima-28610', 'gima-28611', 'gima-28612'].map(wellGimaIdForSlug) as readonly string[]
const PUMP_ID = wellGimaIdForSlug('gima-28614')

const CONSUMER_SCALE_IDS = WELLNESS_CATALOG.filter((r) => r.subcategory === SCALE_SUB).map((r) =>
  wellGimaIdForSlug(r.slug),
)

const NEONATAL_IDS = [
  'gima-24990',
  'gima-27267',
  'gima-27294',
  'gima-27299',
  'gima-27282',
  'gima-27283',
  'gima-27300',
  'gima-27266',
  'gima-27313',
].map(wellGimaIdForSlug) as readonly string[]

const PROFESSIONAL_SCALE_IDS = ['gima-27275', 'gima-27276', 'gima-27296'].map(
  wellGimaIdForSlug,
) as readonly string[]

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function wellnessBagsScalesRelatedIdsForProductId(productId: string): string[] {
  const id = wellnessBagsScalesCanonicalProductId(productId)

  if (RING_IDS.includes(id as (typeof RING_IDS)[number])) {
    return [PUMP_ID, ...relatedFromGroup(RING_IDS, id)].slice(0, 12)
  }
  if (id === PUMP_ID) {
    return [...RING_IDS].slice(0, 12)
  }

  if (THERMY_IDS.includes(id as (typeof THERMY_IDS)[number])) {
    return [COVER_ID, ...relatedFromGroup(THERMY_IDS, id), ...THERMO_GROUP_IDS.filter((x) => x !== COVER_ID)]
      .filter((x) => x !== id)
      .slice(0, 12)
  }
  if (id === COVER_ID) {
    return [...THERMY_IDS, ...THERMO_GROUP_IDS.filter((x) => !THERMY_IDS.includes(x as (typeof THERMY_IDS)[number]))]
      .filter((x) => x !== id)
      .slice(0, 12)
  }
  if (THERMO_GROUP_IDS.includes(id)) {
    return relatedFromGroup(THERMO_GROUP_IDS, id)
  }

  if (LEATHER_BAG_IDS.includes(id as (typeof LEATHER_BAG_IDS)[number])) {
    return relatedFromGroup(LEATHER_BAG_IDS, id)
  }
  if (SKAY_BAG_IDS.includes(id as (typeof SKAY_BAG_IDS)[number])) {
    return relatedFromGroup(SKAY_BAG_IDS, id)
  }

  if (NEONATAL_IDS.includes(id as (typeof NEONATAL_IDS)[number])) {
    return [
      ...relatedFromGroup(NEONATAL_IDS, id),
      ...PROFESSIONAL_SCALE_IDS.filter((x) => !NEONATAL_IDS.includes(x as (typeof NEONATAL_IDS)[number])),
    ].slice(0, 12)
  }
  if (PROFESSIONAL_SCALE_IDS.includes(id as (typeof PROFESSIONAL_SCALE_IDS)[number])) {
    return [...NEONATAL_IDS, ...relatedFromGroup(PROFESSIONAL_SCALE_IDS, id)].slice(0, 12)
  }

  if (CONSUMER_SCALE_IDS.includes(id)) {
    return relatedFromGroup(CONSUMER_SCALE_IDS, id)
  }

  if (id === wellGimaIdForSlug('gima-28921')) {
    return [PUMP_ID, ...RING_IDS].slice(0, 12)
  }

  return relatedFromGroup(
    WELLNESS_CATALOG.map((r) => wellGimaIdForSlug(r.slug)),
    id,
  )
}

export function buildWellnessBagsScalesAstroMedicalOfficeProducts(): OfficeProduct[] {
  return WELLNESS_CATALOG.map((row) => {
    const id = gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${row.slug}`
    return {
      id,
      name: row.name,
      brand: row.brand,
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: row.subcategory,
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
  })
}
