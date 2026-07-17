import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Bilance professionali, antropometria, plicometri e aerosol GIMA (listino imponibile IVA esclusa). */
export const PRO_INSTR_OFFICE_ID_PREFIX = 'AF-PROINSTR-'

let proInstrGimaIdSet: ReadonlySet<string> | null = null

export function isProfessionalInstrumentationAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  proInstrGimaIdSet ??= new Set(buildProfessionalInstrumentationAstroMedicalOfficeProducts().map((p) => p.id))
  return proInstrGimaIdSet.has(s)
}

type ProRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory: string
  /** ID distinto quando più articoli condividono lo stesso JPG GIMA. */
  officeIdOverride?: string
}

const P = PRO_INSTR_OFFICE_ID_PREFIX
const SCALE_SUB = 'Bilance mediche professionali'
const DIAG_SUB = 'Diagnostica corporea e sistemi di pesatura'
const ANTHRO_SUB = 'Antropometria e misurazione'
const PLIC_SUB = 'Plicometri'
const RESP_SUB = 'Terapia respiratoria'

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const PRO_INSTR_CATALOG: readonly ProRow[] = [
  {
    slug: 'gima-27240',
    name: 'BILANCIA BIG DIAL GIMA DIGITALE — GIMA 27240',
    brand: 'Gima',
    priceImponible: 75,
    imageUrl: gimaMedium('27240.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia Gima digitale ampio display; uso ambulatorio e studio medico. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27241',
    name: 'BILANCIA SECA 750 — GIMA 27241',
    brand: 'Seca',
    priceImponible: 176,
    imageUrl: gimaMedium('27241.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia meccanica Seca 750; quadrante di facile lettura per uso professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27257',
    name: 'BILANCIA DIGITALE SECA 807 — GIMA 27257',
    brand: 'Seca',
    priceImponible: 99,
    imageUrl: gimaMedium('27257.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia digitale Seca 807; pesatura precisa in ambiente sanitario. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27280',
    name: 'BILANCIA SECA 761 — uso medico — Classe IIII — GIMA 27280',
    brand: 'Seca',
    priceImponible: 195,
    imageUrl: gimaMedium('27285.jpg'),
    officeIdOverride: 'gima-27280',
    subcategory: SCALE_SUB,
    description:
      'Bilancia Seca 761 per uso medico, Classe IIII; quadrante professionale, struttura metallica. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27285',
    name: 'BILANCIA SECA 762 — professionale — GIMA 27285',
    brand: 'Seca',
    priceImponible: 161,
    imageUrl: gimaMedium('27285.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia Seca 762 professionale; portata 150 kg, precisione 500 g, pedana antiscivolo. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25000',
    name: 'PESAPERSONE DIGITALE PROFESSIONALE WUNDER RB200 250 kg — Classe III — GIMA 25000',
    brand: 'Gima',
    priceImponible: 470,
    imageUrl: gimaMedium('25000.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Pesapersone digitale Wunder RB200, portata 250 kg, Classe III; uso ospedaliero e ambulatoriale. ' +
      'Compatibile con statimetro WH200 GIMA 25005. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25003',
    name: 'PESAPERSONE DIGITALE PROFESSIONALE WUNDER RA300 300 kg — Classe III — GIMA 25003',
    brand: 'Gima',
    priceImponible: 700,
    imageUrl: gimaMedium('25003.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Pesapersone Wunder RA300, portata 300 kg, Classe III; struttura rinforzata per pazienti bariatrici. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27289',
    name: 'BILANCIA DIGITALE PEGASO — non DM — GIMA 27289',
    brand: 'Gima',
    priceImponible: 272,
    imageUrl: gimaMedium('27289.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia digitale Pegaso, dispositivo non DM; uso professionale e fitness club. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27292',
    name: 'BILANCIA DIGITALE SECA 799 con BMI — Classe III — GIMA 27292',
    brand: 'Seca',
    priceImponible: 990,
    imageUrl: gimaMedium('27292.jpg'),
    subcategory: SCALE_SUB,
    description:
      'Bilancia elettronica Seca 799 con calcolo BMI/IMC, Classe III; pedana 520×520 mm. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25015',
    name: 'ANALIZZATORE DI COMPOSIZIONE CORPOREA WUNDER WBA300 CON STAMPANTE — Classe III — GIMA 25015',
    brand: 'Gima',
    priceImponible: 2115,
    imageUrl: gimaMedium('25015.jpg'),
    subcategory: DIAG_SUB,
    description:
      'Analizzatore composizione corporea Wunder WBA300 con stampante integrata, Classe III. ' +
      'Abbinare elettrodi GIMA 27319. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25020',
    name: 'PESAPERSONE ELETTRONICA A SEDIA WUNDER DE20 250 kg — Classe III — GIMA 25020',
    brand: 'Gima',
    priceImponible: 1060,
    imageUrl: gimaMedium('25020.jpg'),
    subcategory: DIAG_SUB,
    description:
      'Bilancia a sedia Wunder DE20, portata 250 kg, Classe III; pesatura pazienti con mobilità ridotta. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25026',
    name: 'PIATTAFORMA DIGITALE WUNDER RW2.0 CON CORRIMANO 300 kg — Classe III — GIMA 25026',
    brand: 'Gima',
    priceImponible: 1517,
    imageUrl: gimaMedium('25026.jpg'),
    subcategory: DIAG_SUB,
    description:
      'Piattaforma digitale Wunder RW2.0 con corrimano, portata 300 kg, Classe III. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25027',
    name: 'PIATTAFORMA DIGITALE WUNDER RW2.0 MOVE CON CORRIMANO E RUOTE 300 kg — Classe III — GIMA 25027',
    brand: 'Gima',
    priceImponible: 1745,
    imageUrl: gimaMedium('25027.jpeg'),
    subcategory: DIAG_SUB,
    description:
      'Piattaforma Wunder RW2.0 Move con corrimano e ruote, portata 300 kg, Classe III; massima mobilità in reparto. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27243',
    name: 'BILANCIA SOEHNLE 7808 — MULTIFUNZIONE — GIMA 27243',
    brand: 'Soehnle',
    priceImponible: 1625,
    imageUrl: gimaMedium('27243.jpg'),
    subcategory: DIAG_SUB,
    description:
      'Bilancia multifunzione Soehnle 7808; colonna, funzioni avanzate per ambulatorio. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27273',
    name: 'BILANCIA SEDIA SOEHNLE — GIMA 27273',
    brand: 'Soehnle',
    priceImponible: 1870,
    imageUrl: gimaMedium('27273.jpg'),
    subcategory: DIAG_SUB,
    description:
      'Bilancia a sedia Soehnle 7802; pesatura comoda per pazienti seduti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25005',
    name: 'STATIMETRO WH200 per bilance — GIMA 25005',
    brand: 'Gima',
    priceImponible: 92,
    imageUrl: gimaMedium('25005.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Statimetro WH200 per abbinamento a bilance Wunder RB200/RA300 e sistemi compatibili. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27245',
    name: 'BARRE DI SOSTEGNO OBESI (set da 3) + SOSTEGNO INDICATORE — GIMA 27245',
    brand: 'Gima',
    priceImponible: 1150,
    imageUrl: gimaMedium('27245.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Set da 3 barre di sostegno per pazienti obesi con supporto indicatore; accessorio bilance multifunzione. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27319',
    name: 'ELETTRODI per Analizzatore di Grasso Corporeo — GIMA 27319',
    brand: 'Gima',
    priceImponible: 31,
    imageUrl: gimaMedium('27319.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Elettrodi di ricambio per analizzatore composizione corporea; compatibili con Wunder WBA300 GIMA 25015. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27320',
    name: 'PLICOMETRO 0-40 mm — meccanico — GIMA 27320',
    brand: 'Gima',
    priceImponible: 605,
    imageUrl: gimaMedium('27320.jpg'),
    subcategory: PLIC_SUB,
    description:
      'Plicometro professionale meccanico 0–40 mm; doppia scala di lettura per antropometria clinica. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27344',
    name: 'PLICOMETRO FAT-1 — GIMA 27344',
    brand: 'Gima',
    priceImponible: 29.5,
    imageUrl: gimaMedium('27344.jpg'),
    subcategory: PLIC_SUB,
    description:
      'Plicometro Harpenden-style FAT-1; misurazione spessore pliche cutanee. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27346',
    name: 'PLICOMETRO DIGITALE GIMA — GIMA 27346',
    brand: 'Gima',
    priceImponible: 1100,
    imageUrl: gimaMedium('27346.jpg'),
    subcategory: PLIC_SUB,
    description:
      'Plicometro digitale professionale 0–12 mm; gestione dati su PC. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27349',
    name: 'PLICOMETRO FAT-2 — GIMA 27349',
    brand: 'Gima',
    priceImponible: 158,
    imageUrl: gimaMedium('27349.jpg'),
    subcategory: PLIC_SUB,
    description:
      'Plicometro FAT-2 per valutazione composizione corporea. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24900',
    name: 'GONIOMETRO PER DITA — acciaio inox 15 cm — GIMA 24900',
    brand: 'Gima',
    priceImponible: 21.8,
    imageUrl: gimaMedium('24904.jpg'),
    officeIdOverride: 'gima-24900',
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro da dita in acciaio inox AISI 430, 15 cm; scala 180° in incrementi di 5°. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24901',
    name: 'GONIOMETRO DIGIT 180° — acciaio inox 15 cm — GIMA 24901',
    brand: 'Gima',
    priceImponible: 24,
    imageUrl: gimaMedium('24901.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro Digit 180°; misurazione con una mano, flessione 110° e iperestensione 40°. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24902',
    name: 'GONIOMETRO ROBINSON 180° — acciaio inox 17,5 cm — GIMA 24902',
    brand: 'Gima',
    priceImponible: 18,
    imageUrl: gimaMedium('24902.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro tascabile Robinson 180° per medici e fisioterapisti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24903',
    name: 'GONIOMETRO 360° — acciaio inox 35 cm — GIMA 24903',
    brand: 'Gima',
    priceImponible: 32,
    imageUrl: gimaMedium('24903.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro 360° con doppia scala 180° opposta; manopola regolabile tensione bracci. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-24904',
    name: 'GONIOMETRO A BRACCI LUNGHI 180° — acciaio inox 35 cm — GIMA 24904',
    brand: 'Gima',
    priceImponible: 35,
    imageUrl: gimaMedium('24904.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro a bracci lunghi 14"/35 cm; scala lineare in incrementi di 1° per tutte le articolazioni. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27339',
    name: 'GONIOMETRO con scala soglia del dolore — GIMA 27339',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('27339.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro 203×45×7 mm con scala per misurazione soglia del dolore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27340',
    name: 'GONIOMETRO 205×45 mm — GIMA 27340',
    brand: 'Gima',
    priceImponible: 42,
    imageUrl: gimaMedium('27340.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Goniometro con scala circolare per articolazioni anca e asse collo femorale ai raggi X. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27232',
    name: 'QUADRANT SMARTWATCH — GIMA 27232',
    brand: 'Gima',
    priceImponible: 115,
    imageUrl: gimaMedium('27232.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Smartwatch Quadrant per monitoraggio parametri wellness; display e connettività moderne. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27317',
    name: 'STADIOMETRO MOBILE SECA 213 — GIMA 27317',
    brand: 'Seca',
    priceImponible: 220,
    imageUrl: gimaMedium('27317.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Stadiometro mobile Seca 213; misurazione altezza professionale in ambulatorio. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27325',
    name: 'CALIBRO PER OSSA — GIMA 27325',
    brand: 'Gima',
    priceImponible: 62.4,
    imageUrl: gimaMedium('27325.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Calibro per misurazione ossa; strumento antropometrico da laboratorio e studio ortopedico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27326',
    name: 'CALIBRO PER MISURA NEONATI — GIMA 27326',
    brand: 'Gima',
    priceImponible: 84.5,
    imageUrl: gimaMedium('27326.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Calibro per misurazioni su neonati; precisione per reparto nido e pediatria. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27329',
    name: 'MISURATORE BAMBINI SECA 210 — GIMA 27329',
    brand: 'Seca',
    priceImponible: 106,
    imageUrl: gimaMedium('27329.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Misuratore portatile Seca 210 per neonati e bambini; intervallo 10–99 cm, graduazione 5 mm. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27331',
    name: 'MISURATORE BAMBINI GIMA — GIMA 27331',
    brand: 'Gima',
    priceImponible: 43,
    imageUrl: gimaMedium('27331.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Misuratore bambini Gima; formato compatto per altezza pediatrica. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27333',
    name: 'STATIMETRO DIGITALE SOEHNLE — GIMA 27333',
    brand: 'Soehnle',
    priceImponible: 206,
    imageUrl: gimaMedium('27333.jpg'),
    subcategory: ANTHRO_SUB,
    description:
      'Statimetro digitale Soehnle; misurazione altezza con display elettronico. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28073',
    name: 'AEROSOL MYNEB — a pistone — GIMA 28073',
    brand: 'Gima',
    priceImponible: 54,
    imageUrl: gimaMedium('28073.jpg'),
    subcategory: RESP_SUB,
    description:
      'Aerosol a pistone MyNeb per terapia inalatoria domiciliare e ambulatoriale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function proRowForSlug(slug: string): ProRow {
  const row = PRO_INSTR_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown professional instrumentation slug: ${slug}`)
  return row
}

function proGimaIdForSlug(slug: string): string {
  const row = proRowForSlug(slug)
  return row.officeIdOverride ?? gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${slug}`
}

export function professionalInstrumentationCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return proGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const WBA300_ID = proGimaIdForSlug('gima-25015')
const ELECTRODES_ID = proGimaIdForSlug('gima-27319')
const STATIMETER_WH200_ID = proGimaIdForSlug('gima-25005')

const WUNDER_SCALE_IDS = [
  proGimaIdForSlug('gima-25000'),
  proGimaIdForSlug('gima-25003'),
  proGimaIdForSlug('gima-25020'),
  proGimaIdForSlug('gima-25026'),
  proGimaIdForSlug('gima-25027'),
] as const

const PLICOMETER_IDS = [
  proGimaIdForSlug('gima-27320'),
  proGimaIdForSlug('gima-27344'),
  proGimaIdForSlug('gima-27346'),
  proGimaIdForSlug('gima-27349'),
] as const

const GONIOMETER_IDS = [
  proGimaIdForSlug('gima-24900'),
  proGimaIdForSlug('gima-24901'),
  proGimaIdForSlug('gima-24902'),
  proGimaIdForSlug('gima-24903'),
  proGimaIdForSlug('gima-24904'),
  proGimaIdForSlug('gima-27339'),
  proGimaIdForSlug('gima-27340'),
] as const

const ANTHRO_HEIGHT_IDS = [
  proGimaIdForSlug('gima-27317'),
  proGimaIdForSlug('gima-27329'),
  proGimaIdForSlug('gima-27331'),
  proGimaIdForSlug('gima-27333'),
  STATIMETER_WH200_ID,
  proGimaIdForSlug('gima-27325'),
  proGimaIdForSlug('gima-27326'),
] as const

const PRO_SCALE_IDS = PRO_INSTR_CATALOG.filter((r) => r.subcategory === SCALE_SUB).map((r) =>
  proGimaIdForSlug(r.slug),
)

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function professionalInstrumentationRelatedIdsForProductId(productId: string): string[] {
  const id = professionalInstrumentationCanonicalProductId(productId)

  if (id === ELECTRODES_ID) {
    return [WBA300_ID, ...PLICOMETER_IDS].slice(0, 12)
  }
  if (id === WBA300_ID) {
    return [ELECTRODES_ID, ...PLICOMETER_IDS, ...WUNDER_SCALE_IDS].filter((x) => x !== id).slice(0, 12)
  }

  if (id === STATIMETER_WH200_ID) {
    return [...WUNDER_SCALE_IDS, ...ANTHRO_HEIGHT_IDS.filter((x) => x !== STATIMETER_WH200_ID)].slice(0, 12)
  }
  if (WUNDER_SCALE_IDS.includes(id as (typeof WUNDER_SCALE_IDS)[number])) {
    return [STATIMETER_WH200_ID, ...relatedFromGroup(WUNDER_SCALE_IDS, id)].slice(0, 12)
  }

  if (PLICOMETER_IDS.includes(id as (typeof PLICOMETER_IDS)[number])) {
    return [WBA300_ID, ELECTRODES_ID, ...relatedFromGroup(PLICOMETER_IDS, id)].slice(0, 12)
  }

  if (GONIOMETER_IDS.includes(id as (typeof GONIOMETER_IDS)[number])) {
    return relatedFromGroup(GONIOMETER_IDS, id)
  }

  if (ANTHRO_HEIGHT_IDS.includes(id as (typeof ANTHRO_HEIGHT_IDS)[number])) {
    return [
      ...relatedFromGroup(ANTHRO_HEIGHT_IDS, id),
      STATIMETER_WH200_ID,
      ...GONIOMETER_IDS.slice(0, 4),
    ].slice(0, 12)
  }

  if (PRO_SCALE_IDS.includes(id)) {
    return [
      ...relatedFromGroup(PRO_SCALE_IDS, id),
      STATIMETER_WH200_ID,
      WBA300_ID,
    ].slice(0, 12)
  }

  if (id === proGimaIdForSlug('gima-27245')) {
    return [proGimaIdForSlug('gima-27243'), ...WUNDER_SCALE_IDS].slice(0, 12)
  }

  return relatedFromGroup(
    PRO_INSTR_CATALOG.map((r) => proGimaIdForSlug(r.slug)),
    id,
  )
}

export function buildProfessionalInstrumentationAstroMedicalOfficeProducts(): OfficeProduct[] {
  return PRO_INSTR_CATALOG.map((row) => {
    const id =
      row.officeIdOverride ??
      gimaOfficeProductIdFromImageUrl(row.imageUrl) ??
      `${P}${row.slug}`
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
