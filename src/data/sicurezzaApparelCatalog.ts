import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'
import {
  SICUREZZA_SUBCATEGORY_GIACCHE,
  SICUREZZA_SUBCATEGORY_GIUBBOTTI,
  SICUREZZA_SUBCATEGORY_PANTALONI,
} from '../lib/sicurezzaCatalog'
import { applySicurezzaPromoDiscount } from '../lib/sicurezzaPromoDiscount'
import { SICUREZZA_CATEGORY } from '../lib/officeCategories'

/** Taglie standard abbigliamento da lavoro (default listing). */
export const SICUREZZA_APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'] as const
export type SicurezzaApparelSize = (typeof SICUREZZA_APPAREL_SIZES)[number] | 'XS'

export type SicurezzaTechnicalDocument = {
  id: string
  title: string
  href: string
  hint: string
}

type ApparelFamilyConfig = {
  sizes?: ProductVariantOption[]
  documents?: readonly SicurezzaTechnicalDocument[]
  /** Immagini aggiuntive galleria PDP (dopo `imageUrl`). */
  galleryUrls?: string[]
  /** Normalizza nome vetrina (senza taglia fissa nel titolo). */
  displayName?: string
  imageUrl?: string
  /** Descrizione PDP curata (sostituisce testo DB se presente). */
  description?: string
  /** Feature principali da unire in `mainFeatures`. */
  mainFeatures?: Record<string, string>
}

/** PDF pubblici in `public/docs/safety/` — solo prodotti in allowlist. */
export const HORTEN2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/89931.pdf',
    hint: 'Scheda informativa e logistica (cod. 89931)',
  },
  {
    id: 'conformita-ce',
    title: '📜 Dichiarazione di Conformità CE',
    href: '/docs/safety/89931-1.pdf',
    hint: 'Certificazione CE e conformità EN ISO 13688:2013',
  },
  {
    id: 'scheda-tecnica',
    title: '📄 Scarica Scheda Tecnica del Produttore',
    href: '/docs/safety/89931-2.pdf',
    hint: 'Scheda tecnica Delta Plus Horten2 Light',
  },
] as const

export const PORTWEST_TEXPEL_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Fornitore / Prodotto',
    href: '/docs/safety/105192.pdf',
    hint: 'Scheda descrittiva e logistica Portwest (cod. 105192)',
  },
  {
    id: 'dichiarazione-qualita',
    title: '📜 Dichiarazione di Qualità',
    href: '/docs/safety/105192-1.pdf',
    hint: 'Dichiarazione di Qualità del produttore Portwest',
  },
  {
    id: 'scheda-tecnica',
    title: '📄 Scarica Scheda Tecnica del Produttore',
    href: '/docs/safety/105192-2.pdf',
    hint: 'Scheda tecnica dettagliata PW378 Texpel Splash Eco',
  },
] as const

export const LULEA2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/104546.pdf',
    hint: 'Scheda informativa, descrizione estesa e dati logistici (cod. 104546)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/104546-1.pdf',
    hint:
      'Scheda dettagliata Deltaplus Softshell 2 strati, stretch 4 direzioni, 280 g/m² e tabella EAN',
  },
] as const

export const MYSEN2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/86181.pdf',
    hint: 'Scheda descrittiva, dati logistici e specifiche di vendita (cod. 86181)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/86181-1.pdf',
    hint:
      'Scheda tecnica Deltaplus MySen 2:1 — maniche staccabili, Softshell 2 strati elasticizzato, campi d’impiego e tabella EAN/SKU',
  },
] as const

export const SOCCIA_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/104541.pdf',
    hint: 'Scheda informativa, descrizione estesa, dati logistici e specifiche di vendita (cod. 104541)',
  },
  {
    id: 'scheda-tecnica',
    title: '📜 Scheda Tecnica / Scheda Produttore',
    href: '/docs/safety/104541-1.pdf',
    hint:
      'Scheda dettagliata Deltaplus Soccia Softshell 2 in 1 in poliestere riciclato, stretch 4 direzioni, 280 g/m² e tabella SKU/EAN',
  },
] as const

export const SPACE_LADY_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-prodotto',
    title: '📄 Scarica Scheda Prodotto / Fornitore',
    href: '/docs/safety/97983.pdf',
    hint: 'Scheda descrittiva, dati logistici e commerciali (cod. 97983)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Dichiarazione di Conformità UE',
    href: '/docs/safety/97983-1.pdf',
    hint: 'Certificazione CE EN ISO 13688, EN 14058, DPI Cat. I',
  },
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Prodotto',
    href: '/docs/safety/97983-2.pdf',
    hint:
      'Dettagli Softshell 320 g/m², membrana U-Tex, tecnologia Free Sound e caratteristiche del capo',
  },
] as const

export const MOONLIGHT2_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Prodotto',
    href: '/docs/safety/86492-2.pdf',
    hint: 'Dettagli tecnici, prestazioni e benefici Moonlight 2 (cod. 86492)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Dichiarazione di Conformità UE',
    href: '/docs/safety/86492-1.pdf',
    hint: 'Conformità Regolamento UE 2016/425 — Certificato 033 2023 0297',
  },
  {
    id: 'scheda-prodotto',
    title: '📄 Scheda Informativa / Fornitore',
    href: '/docs/safety/86492.pdf',
    hint: 'Specifiche logistiche e dati di vendita (cod. 86492)',
  },
] as const

export const MOONLIGHT2_ARANCIO_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica e Prestazioni',
    href: '/docs/safety/86494-2.pdf',
    hint: 'Dettagli tecnici, benefici e logistica Moonlight 2 arancio fluo (cod. 86494)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Dichiarazione di Conformità UE',
    href: '/docs/safety/86494-1.pdf',
    hint: 'Conformità Regolamento UE 2016/425 — Certificato 033 2023 0297',
  },
  {
    id: 'scheda-prodotto',
    title: '📄 Scheda Informativa Prodotto',
    href: '/docs/safety/86494.pdf',
    hint: 'Specifiche sintetiche e dati di vendita (cod. 86494)',
  },
] as const

export const MIKY_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Ufficiale',
    href: '/docs/safety/89950-2.pdf',
    hint: 'Dettagli prodotto, composizione e caratteristiche U-Power Miky (cod. 89950)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Certificato di Esame UE del Tipo / Conformità',
    href: '/docs/safety/89950-1.pdf',
    hint: 'Certificato Intertek No. LECF100376148 — Regolamento UE 2016/425',
  },
  {
    id: 'scheda-prodotto',
    title: '📄 Scheda Informativa e Dati Logistici',
    href: '/docs/safety/89950.pdf',
    hint: 'Dati di vendita, codici e specifiche (cod. 89950)',
  },
] as const

export const MIKY_ARANCIO_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Ufficiale',
    href: '/docs/safety/89955-2.pdf',
    hint: 'Dettagli prodotto, composizione e caratteristiche U-Power Miky (cod. 89955)',
  },
  {
    id: 'conformita-ue',
    title: '📜 Certificato di Esame UE del Tipo / Conformità',
    href: '/docs/safety/89955-1.pdf',
    hint: 'Certificato Intertek No. LECF100376148 — Regolamento UE 2016/425',
  },
  {
    id: 'scheda-prodotto',
    title: '📄 Scheda Informativa e Dati Logistici',
    href: '/docs/safety/89955.pdf',
    hint: 'Dati di vendita, codici e specifiche (cod. 89955)',
  },
] as const

/** Documentazione condivisa Deltaplus Reno HV (giallo/arancio). */
export const RENO_HV_TECHNICAL_DOCUMENTS: readonly SicurezzaTechnicalDocument[] = [
  {
    id: 'scheda-tecnica',
    title: '📘 Scheda Tecnica Ufficiale',
    href: '/docs/safety/73755-2.pdf',
    hint: 'Specifiche tecniche RENO HV, dettagli costruttivi e tabelle logistiche Deltaplus',
  },
  {
    id: 'conformita-ue',
    title: '📜 Dichiarazione di Conformità UE',
    href: '/docs/safety/73755-1.pdf',
    hint: 'Conformità Regolamento UE 2016/425 — AITEX N. 0161 · Certificato 23 6516 00 0161',
  },
  {
    id: 'scheda-prodotto',
    title: '📄 Scheda Informativa e Dati Logistici',
    href: '/docs/safety/73755.pdf',
    hint: 'Dettagli di vendita, codici e specifiche di confezionamento',
  },
] as const

/**
 * Horten2 Light (nero/giallo) — part number / EAN per taglia (Delta Plus).
 * Codici: HORT2NJTM (M), HORT2NJGT (L), HORT2NJXG (XL), HORT2NJXX (XXL).
 */
const HORTEN2_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'HORT2NJTS' },
  { label: 'M', sku: 'HORT2NJTM', ean: '3295249234782' },
  { label: 'L', sku: 'HORT2NJGT', ean: '3295249234799' },
  { label: 'XL', sku: 'HORT2NJXG' },
  { label: 'XXL', sku: 'HORT2NJXX' },
  { label: '3XL', sku: 'HORT2NJ3X' },
]

/** Portwest PW378 Texpel™ Splash Eco — part number per taglia. */
const PORTWEST_TEXPEL_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'PW378BZRS' },
  { label: 'M', sku: 'PW378BZRM' },
  { label: 'L', sku: 'PW378BZRL' },
  { label: 'XL', sku: 'PW378BZRXL' },
  { label: 'XXL', sku: 'PW378BZRXXL' },
  { label: '3XL', sku: 'PW378BZRXXXL' },
]

/** Deltaplus Lulea2 Softshell grigio/nero — part number / EAN per taglia. */
const LULEA2_GRIGIO_NERO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'LULE2GRPT', ean: '3295249200558' },
  { label: 'M', sku: 'LULE2GRTM', ean: '3295249200565' },
  { label: 'L', sku: 'LULE2GRGT', ean: '3295249200619' },
  { label: 'XL', sku: 'LULE2GRXG', ean: '3295249200589' },
  { label: 'XXL', sku: 'LULE2GRXX', ean: '3295249200596' },
  { label: '3XL', sku: 'LULE2GR3X', ean: '3295249200602' },
]

/** Deltaplus MySen 2 Softshell grigio/fucsia — part number / EAN per taglia (scheda 86181-1). */
const MYSEN2_GRIGIO_FUCSIA_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'XS', sku: 'MYSE2GFTPT', ean: '3295249222314' },
  { label: 'S', sku: 'MYSE2GFPT', ean: '3295249222307' },
  { label: 'M', sku: 'MYSE2GFTM', ean: '3295249222291' },
  { label: 'L', sku: 'MYSE2GFGT', ean: '3295249222284' },
  { label: 'XXL', sku: 'MYSE2GFXX', ean: '3295249222215' },
]

/** Deltaplus Soccia Softshell 2 in 1 nero/rosso — part number / EAN per taglia (scheda 104541-1). */
const SOCCIA_NERO_ROSSO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'SOCCINOPT', ean: '3295249301965' },
  { label: 'M', sku: 'SOCCINOTM', ean: '3295249302214' },
  { label: 'L', sku: 'SOCCINOGT', ean: '3295249302221' },
  { label: 'XL', sku: 'SOCCINOXG', ean: '3295249302238' },
  { label: 'XXL', sku: 'SOCCINOXX', ean: '3295249302245' },
  { label: '3XL', sku: 'SOCCINO3X', ean: '3295249302252' },
]

/** U-Power Space Lady Grey Fucsia — solo taglie disponibili a magazzino (M, L). */
const SPACE_LADY_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'M', sku: 'FU187GF-M' },
  { label: 'L', sku: 'FU187GF-L', ean: '8033546443934' },
]

/** Deltaplus Moonlight 2 HV giallo fluo/grigio — part number / EAN per taglia (scheda 86492). */
const MOONLIGHT2_GIALLO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'MOON2JGPT', ean: '3295249222109' },
  { label: 'M', sku: 'MOON2JGTM', ean: '3295249222116' },
  { label: 'L', sku: 'MOON2JGGT', ean: '3295249222123' },
  { label: 'XL', sku: 'MOON2JGXG', ean: '3295249222130' },
  { label: 'XXL', sku: 'MOON2JGXX', ean: '3295249222147' },
  { label: '3XL', sku: 'MOON2JG3X', ean: '3295249222000' },
]

/** Deltaplus Moonlight 2 HV arancio fluo/grigio — part number / EAN per taglia (scheda 86494). */
const MOONLIGHT2_ARANCIO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'MOON2OGPT', ean: '3295249222154' },
  { label: 'M', sku: 'MOON2OGTM', ean: '3295249222161' },
  { label: 'L', sku: 'MOON2OGGT', ean: '3295249222178' },
  { label: 'XL', sku: 'MOON2OGXG', ean: '3295249222185' },
  { label: 'XXL', sku: 'MOON2OGXX', ean: '3295249222192' },
  { label: '3XL', sku: 'MOON2OG3X', ean: '3295249222017' },
]

/** U-Power Miky Softshell HV giallo fluo — part number per taglia (modello HL169YF, scheda 89950). */
const MIKY_GIALLO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'HL169YF-S' },
  { label: 'M', sku: 'HL169YF-M' },
  { label: 'L', sku: 'HL169YF-L', ean: '8033546387245' },
  { label: 'XL', sku: 'HL169YF-XL' },
  { label: 'XXL', sku: 'HL169YF-XXL' },
  { label: '3XL', sku: 'HL169YF-3XL' },
  { label: '4XL', sku: 'HL169YF-4XL' },
]

/** U-Power Miky Softshell HV arancio fluo — part number per taglia (modello HL169OF, scheda 89955). */
const MIKY_ARANCIO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'HL169OF-S' },
  { label: 'M', sku: 'HL169OF-M' },
  { label: 'L', sku: 'HL169OF-L' },
  { label: 'XL', sku: 'HL169OF-XL', ean: '8033546387320' },
  { label: 'XXL', sku: 'HL169OF-XXL' },
  { label: '3XL', sku: 'HL169OF-3XL' },
  { label: '4XL', sku: 'HL169OF-4XL' },
]

/** Deltaplus Reno HV giallo fluo — part number / EAN per taglia (scheda 73755-2). */
const RENO_HV_GIALLO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'RENHVJAPT', ean: '3295249161941' },
  { label: 'M', sku: 'RENHVJATM', ean: '3295249161958' },
  { label: 'L', sku: 'RENHVJAGT', ean: '3295249161965' },
  { label: 'XL', sku: 'RENHVJAXG', ean: '3295249161972' },
  { label: 'XXL', sku: 'RENHVJAXX', ean: '3295249161989' },
  { label: '3XL', sku: 'RENHVJA3X', ean: '3295249161996' },
]

/** Deltaplus Reno HV arancio fluo — part number / EAN per taglia (scheda 73755-2). */
const RENO_HV_ARANCIO_FLUO_SIZE_VARIANTS: ProductVariantOption[] = [
  { label: 'S', sku: 'RENHVORPT', ean: '3295249162009' },
  { label: 'M', sku: 'RENHVORTM', ean: '3295249162016' },
  { label: 'L', sku: 'RENHVORGT', ean: '3295249162023' },
  { label: 'XL', sku: 'RENHVORXG', ean: '3295249162030' },
  { label: 'XXL', sku: 'RENHVORXX', ean: '3295249162047' },
  { label: '3XL', sku: 'RENHVOR3X', ean: '3295249162054' },
]

const HORTEN2_GALLERY = ['https://odmultimedia.eu/immagini/MD/89930_1.jpg'] as const
const PORTWEST_TEXPEL_GALLERY = ['https://odmultimedia.eu/immagini/MD/105192_1.jpg'] as const
const SOCCIA_GALLERY = [
  'https://odmultimedia.eu/immagini/MD/104541_1.jpg',
  'https://odmultimedia.eu/immagini/MD/104541_3.jpg',
] as const
const SOCCIA_IMAGE_URL = 'https://odmultimedia.eu/immagini/MD/104541_2.jpg'

const HORTEN2_DISPLAY_NAME =
  'Giacca Softshell Horten2 Light - tessuto Softshell/poliestere/elastan - con cappuccio - nero/giallo - Deltaplus'

const PORTWEST_TEXPEL_DISPLAY_NAME =
  'Giacca da lavoro Softshell Texpel™ Splash Eco - nero/grigio - Portwest'

const LULEA2_DISPLAY_NAME =
  'Giacca Softshell Lulea2 - grigio/nero - Deltaplus'

const MYSEN2_DISPLAY_NAME =
  'Giacca Softshell MySen 2 - tessuto Softshell/poliestere/elastan - grigio/fucsia - Deltaplus'

const SOCCIA_DISPLAY_NAME =
  'Giacca Softshell 2 in 1 Soccia - nero/rosso - Deltaplus'

const SPACE_LADY_DISPLAY_NAME =
  'Giacca Softshell donna Space Lady - grigio/fucsia - U-Power'

const SPACE_LADY_IMAGE_URL = 'https://odmultimedia.eu/immagini/LD/97983.jpg'

const MOONLIGHT2_DISPLAY_NAME =
  'Giacca Softshell Moonlight 2 alta visibilità - poliestere - giallo fluo - Deltaplus'

const MOONLIGHT2_IMAGE_URL = 'https://odmultimedia.eu/immagini/LD/86492.jpg'

const MOONLIGHT2_DESCRIPTION =
  'Softshell elasticizzato 2 in 1 ad alta visibilità, antivento e idrorepellente, con maniche staccabili. Dotato di chiusura con zip antifreddo, 5 tasche (3 esterne con zip, 2 interne), fondo maniche con finitura sbieco e parte bassa regolabile con elastico.\n\n' +
  'Composizione: Softshell 100% poliestere con membrana in TPU, 3 strati laminati. Fodera pile 100% poliestere (130 g/m²). Impermeabilità/traspirabilità: membrana WP 8000 mm / MVP 5000 g/m²/24h. Visibilità Classe 3 (con maniche) / Classe 2 (senza maniche), bande riflettenti a bretella e parallele sul torso e sulle braccia; certificato EN ISO 20471 fino a 25 lavaggi.\n\n' +
  'Normative: DPI Cat. 2, Certificato CE, EN ISO 13688:2013, EN ISO 20471:2013/A1:2016. Campi d’impiego: lavori pubblici, edilizia, industria mineraria, servizi pubblici, gestione rifiuti e acque. Selezionare la taglia (codici MOON2JG*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.'

const MOONLIGHT2_MAIN_FEATURES: Record<string, string> = {
  Colore: 'giallo fluo / grigio',
  Materiale: 'Softshell 100% PE + membrana TPU · 3 strati',
  Fodera: 'Pile 100% poliestere 130 g/m²',
  Visibilità: 'EN ISO 20471 Classe 3 / Classe 2',
  'Part number': 'MOON2JGGT',
  Taglia: 'L',
  EAN: '3295249222123',
  Normative: 'DPI Cat. 2 · EN ISO 13688 · EN ISO 20471',
}

const MOONLIGHT2_ARANCIO_DISPLAY_NAME =
  'Giacca Softshell Moonlight 2 alta visibilità - poliestere - taglia M - arancio fluo - Deltaplus'

const MOONLIGHT2_ARANCIO_IMAGE_URL = 'https://odmultimedia.eu/immagini/MD/86494_1.jpg'
const MOONLIGHT2_ARANCIO_GALLERY = ['https://odmultimedia.eu/immagini/MD/86494_2.jpg'] as const

const MOONLIGHT2_ARANCIO_DESCRIPTION =
  'Giacca Softshell 2 in 1 elasticizzata, traspirante e idrorepellente con maniche staccabili, ideale per l’utilizzo tutto l’anno. Chiusura con zip antifreddo, 5 tasche complessive (3 esterne con zip e 2 interne), fondo maniche rifinito a sbieco e parte inferiore regolabile tramite elastico.\n\n' +
  'Composizione: Softshell 100% poliestere a 3 strati laminati con membrana TPU. Fodera pile 100% poliestere (130 g/m²). Impermeabilità e traspirabilità: membrana WP 8000 mm / MVP 5000 g/m²/24h. Alta visibilità Classe 3 (con maniche) / Classe 2 (senza maniche), bande retroriflettenti cucite argento a bretella e parallele su torso e braccia; resistente fino a 25 cicli di lavaggio.\n\n' +
  'Normative: DPI Cat. 2, Certificato CE, EN ISO 13688:2013+A1:2021, EN ISO 20471:2013/A1:2016. Settori d’impiego: lavori pubblici, edilizia, industria mineraria, servizi pubblici, gestione rifiuti/acque e lavoro temporaneo. Selezionare la taglia (codici MOON2OG*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.'

const MOONLIGHT2_ARANCIO_MAIN_FEATURES: Record<string, string> = {
  Colore: 'arancio fluo / grigio',
  Materiale: 'Softshell 100% PE + membrana TPU · 3 strati',
  Fodera: 'Pile 100% poliestere 130 g/m²',
  Visibilità: 'EN ISO 20471 Classe 3 / Classe 2',
  'Part number': 'MOON2OGTM',
  Taglia: 'M',
  EAN: '3295249222161',
  Normative: 'DPI Cat. 2 · EN ISO 13688 · EN ISO 20471',
}

const MIKY_DISPLAY_NAME =
  'Giacca alta visibilità Softshell Miky - taglia L - giallo fluo - U-Power'

const MIKY_IMAGE_URL = 'https://odmultimedia.eu/immagini/HD/89950.jpg'

const MIKY_DESCRIPTION =
  'Giacca in tessuto Softshell stretch, traspirante, antivento e idrorepellente. Dotata di 2 ampie tasche frontali con zip, tasca porta cellulare sul petto chiusa da zip, cappuccio staccabile tramite zip, maniche preformate e fondo sagomato. Presenta coulisse antimpigliamento regolabile dall’interno della tasca, polsini regolabili con velcro, polsini antivento elasticizzati con foro per il pollice, e zip YKK di alta qualità. Strisce riflettenti termo-applicate su busto e braccia per la massima visibilità.\n\n' +
  'Composizione: 96% poliestere, 4% elastane con membrana in TPU (grammatura 310–320 g/m²). Vestibilità / stagionalità: 4 stagioni (autunno / inverno). Alta visibilità Classe 2 con 2 bande riflettenti attorno al busto e 2 attorno a ciascuna manica (larghezza bande 60 mm).\n\n' +
  'Normative: DPI Cat. II, Certificato CE, EN ISO 13688:2013, EN ISO 20471:2013+A1:2016. Modello MIKY (cod. modello HL169YF). Selezionare la taglia (codici HL169YF-*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.'

const MIKY_MAIN_FEATURES: Record<string, string> = {
  Colore: 'giallo fluo (Yellow Fluo)',
  Modello: 'MIKY · HL169YF',
  Materiale: '96% PE / 4% EA · membrana TPU · 310–320 g/m²',
  Visibilità: 'EN ISO 20471 Classe 2',
  'Part number': 'HL169YF-L',
  Taglia: 'L',
  EAN: '8033546387245',
  Normative: 'DPI Cat. II · EN ISO 13688 · EN ISO 20471',
}

const MIKY_ARANCIO_DISPLAY_NAME =
  'Giacca alta visibilità Softshell Miky - taglia XL - arancio fluo - U-Power'

const MIKY_ARANCIO_IMAGE_URL = 'https://odmultimedia.eu/immagini/HD/89955.jpg'

const MIKY_ARANCIO_DESCRIPTION =
  'Giacca in tessuto Softshell stretch, traspirante, antivento e idrorepellente. Dotata di 2 ampie tasche frontali con zip, tasca porta cellulare sul petto chiusa da zip, cappuccio staccabile tramite zip, maniche preformate e fondo sagomato. Presenta coulisse antimpigliamento regolabile dall’interno della tasca, polsini regolabili con velcro, polsini antivento elasticizzati con foro per il pollice, e zip YKK di alta qualità. Strisce riflettenti termo-applicate su busto e braccia per garantire la massima visibilità.\n\n' +
  'Composizione: 96% poliestere, 4% elastane con membrana in TPU (grammatura 310–320 g/m²). Vestibilità / stagionalità: 4 stagioni (autunno / inverno). Alta visibilità Classe 2 con 2 bande riflettenti attorno al busto e 2 attorno a ciascuna manica (larghezza bande 60 mm).\n\n' +
  'Normative: DPI Cat. II, Certificato CE, EN ISO 13688:2013, EN ISO 20471:2013+A1:2016. Modello MIKY (cod. modello HL169 / HL169OF). Selezionare la taglia (codici HL169OF-*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.'

const MIKY_ARANCIO_MAIN_FEATURES: Record<string, string> = {
  Colore: 'arancio fluo (Orange Fluo)',
  Modello: 'MIKY · HL169OF',
  Materiale: '96% PE / 4% EA · membrana TPU · 310–320 g/m²',
  Visibilità: 'EN ISO 20471 Classe 2',
  'Part number': 'HL169OF-XL',
  Taglia: 'XL',
  EAN: '8033546387320',
  Normative: 'DPI Cat. II · EN ISO 13688 · EN ISO 20471',
}

const RENO_HV_DESCRIPTION =
  'Giubbotto alta visibilità 2 in 1 antivento, idrorepellente e impermeabile con fodera in pile e maniche rimovibili/staccabili. Ideale per i primi freddi e per garantire massima visibilità giorno e notte.\n\n' +
  'Tessuto esterno: Oxford 100% poliestere spalmato/rivestito in PU. Fodera interna: pile 100% poliestere. Imbottitura: 100% fibra di poliestere. Grammatura totale: 465 g/m². Cuciture impermeabili. Cappuccio fisso a scomparsa. Collo alto foderato in pile. Chiusura a zip. Bordo a coste su polsini e fondo vita. 4 tasche (2 esterne a toppa, 1 interna con zip, 1 interna per il telefono). Zip interna per accesso alla marcatura (ricamo, serigrafia, transfer). 4 fasce riflettenti (2 sul torso e 2 sulle braccia).\n\n' +
  'Campi di utilizzo: lavori pubblici, edilizia, industria mineraria, pulizia, lavoro temporaneo, servizi pubblici. Normative: DPI Cat. II, marcatura CE, EN ISO 13688:2013/A1:2021, EN ISO 20471:2013/A1:2016 (Classe 3 con maniche / Classe 2 smanicato; certificato dopo 25 lavaggi), EN343:2019 / EN343:2003 A1:2007. Selezionare la taglia (codici RENHV*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.'

const RENO_HV_GIALLO_DISPLAY_NAME =
  'Giubbotto alta visibilità Reno HV - poliestere/poliuretano - taglia XL - giallo fluo - Deltaplus'

const RENO_HV_ARANCIO_DISPLAY_NAME =
  'Giubbotto alta visibilità Reno HV - poliestere/poliuretano - taglia XL - arancio fluo - Deltaplus'

const RENO_HV_GIALLO_IMAGE_URL = 'https://odmultimedia.eu/immagini/HD/73755.jpg'
const RENO_HV_ARANCIO_IMAGE_URL = 'https://odmultimedia.eu/immagini/HD/73757.jpg'

const RENO_HV_GIALLO_MAIN_FEATURES: Record<string, string> = {
  Colore: 'giallo fluo',
  Modello: 'RENO HV',
  Genere: 'Uomo / Unisex',
  Materiale: 'Oxford PE + PU · fodera pile · 465 g/m²',
  Visibilità: 'EN ISO 20471 Classe 3 / Classe 2',
  'Part number': 'RENHVJAXG',
  Taglia: 'XL',
  EAN: '3295249161972',
  Normative: 'DPI Cat. II · EN ISO 13688 · EN ISO 20471 · EN343',
}

const RENO_HV_ARANCIO_MAIN_FEATURES: Record<string, string> = {
  Colore: 'arancio fluo',
  Modello: 'RENO HV',
  Genere: 'Uomo / Unisex',
  Materiale: 'Oxford PE + PU · fodera pile · 465 g/m²',
  Visibilità: 'EN ISO 20471 Classe 3 / Classe 2',
  'Part number': 'RENHVORXG',
  Taglia: 'XL',
  EAN: '3295249162030',
  Normative: 'DPI Cat. II · EN ISO 13688 · EN ISO 20471 · EN343',
}

const HORTEN2_FAMILY: ApparelFamilyConfig = {
  sizes: HORTEN2_SIZE_VARIANTS,
  documents: HORTEN2_TECHNICAL_DOCUMENTS,
  galleryUrls: [...HORTEN2_GALLERY],
  displayName: HORTEN2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/89931.jpg',
}

const PORTWEST_TEXPEL_FAMILY: ApparelFamilyConfig = {
  sizes: PORTWEST_TEXPEL_SIZE_VARIANTS,
  documents: PORTWEST_TEXPEL_TECHNICAL_DOCUMENTS,
  galleryUrls: [...PORTWEST_TEXPEL_GALLERY],
  displayName: PORTWEST_TEXPEL_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/105192.jpg',
}

const LULEA2_FAMILY: ApparelFamilyConfig = {
  sizes: LULEA2_GRIGIO_NERO_SIZE_VARIANTS,
  documents: LULEA2_TECHNICAL_DOCUMENTS,
  displayName: LULEA2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/104546.jpg',
}

const MYSEN2_FAMILY: ApparelFamilyConfig = {
  sizes: MYSEN2_GRIGIO_FUCSIA_SIZE_VARIANTS,
  documents: MYSEN2_TECHNICAL_DOCUMENTS,
  displayName: MYSEN2_DISPLAY_NAME,
  imageUrl: 'https://odmultimedia.eu/immagini/LD/86181.jpg',
}

const SOCCIA_FAMILY: ApparelFamilyConfig = {
  sizes: SOCCIA_NERO_ROSSO_SIZE_VARIANTS,
  documents: SOCCIA_TECHNICAL_DOCUMENTS,
  galleryUrls: [...SOCCIA_GALLERY],
  displayName: SOCCIA_DISPLAY_NAME,
  imageUrl: SOCCIA_IMAGE_URL,
}

const SPACE_LADY_FAMILY: ApparelFamilyConfig = {
  sizes: SPACE_LADY_SIZE_VARIANTS,
  documents: SPACE_LADY_TECHNICAL_DOCUMENTS,
  displayName: SPACE_LADY_DISPLAY_NAME,
  imageUrl: SPACE_LADY_IMAGE_URL,
}

const MOONLIGHT2_FAMILY: ApparelFamilyConfig = {
  sizes: MOONLIGHT2_GIALLO_FLUO_SIZE_VARIANTS,
  documents: MOONLIGHT2_TECHNICAL_DOCUMENTS,
  displayName: MOONLIGHT2_DISPLAY_NAME,
  imageUrl: MOONLIGHT2_IMAGE_URL,
  description: MOONLIGHT2_DESCRIPTION,
  mainFeatures: MOONLIGHT2_MAIN_FEATURES,
}

const MOONLIGHT2_ARANCIO_FAMILY: ApparelFamilyConfig = {
  sizes: MOONLIGHT2_ARANCIO_FLUO_SIZE_VARIANTS,
  documents: MOONLIGHT2_ARANCIO_TECHNICAL_DOCUMENTS,
  galleryUrls: [...MOONLIGHT2_ARANCIO_GALLERY],
  displayName: MOONLIGHT2_ARANCIO_DISPLAY_NAME,
  imageUrl: MOONLIGHT2_ARANCIO_IMAGE_URL,
  description: MOONLIGHT2_ARANCIO_DESCRIPTION,
  mainFeatures: MOONLIGHT2_ARANCIO_MAIN_FEATURES,
}

const MIKY_FAMILY: ApparelFamilyConfig = {
  sizes: MIKY_GIALLO_FLUO_SIZE_VARIANTS,
  documents: MIKY_TECHNICAL_DOCUMENTS,
  displayName: MIKY_DISPLAY_NAME,
  imageUrl: MIKY_IMAGE_URL,
  description: MIKY_DESCRIPTION,
  mainFeatures: MIKY_MAIN_FEATURES,
}

const MIKY_ARANCIO_FAMILY: ApparelFamilyConfig = {
  sizes: MIKY_ARANCIO_FLUO_SIZE_VARIANTS,
  documents: MIKY_ARANCIO_TECHNICAL_DOCUMENTS,
  displayName: MIKY_ARANCIO_DISPLAY_NAME,
  imageUrl: MIKY_ARANCIO_IMAGE_URL,
  description: MIKY_ARANCIO_DESCRIPTION,
  mainFeatures: MIKY_ARANCIO_MAIN_FEATURES,
}

const RENO_HV_GIALLO_FAMILY: ApparelFamilyConfig = {
  sizes: RENO_HV_GIALLO_FLUO_SIZE_VARIANTS,
  documents: RENO_HV_TECHNICAL_DOCUMENTS,
  displayName: RENO_HV_GIALLO_DISPLAY_NAME,
  imageUrl: RENO_HV_GIALLO_IMAGE_URL,
  description: RENO_HV_DESCRIPTION,
  mainFeatures: RENO_HV_GIALLO_MAIN_FEATURES,
}

const RENO_HV_ARANCIO_FAMILY: ApparelFamilyConfig = {
  sizes: RENO_HV_ARANCIO_FLUO_SIZE_VARIANTS,
  documents: RENO_HV_TECHNICAL_DOCUMENTS,
  displayName: RENO_HV_ARANCIO_DISPLAY_NAME,
  imageUrl: RENO_HV_ARANCIO_IMAGE_URL,
  description: RENO_HV_DESCRIPTION,
  mainFeatures: RENO_HV_ARANCIO_MAIN_FEATURES,
}

/** Famiglie con documentazione PDF dedicata (allowlist). */
const APPAREL_FAMILY_BY_SKU: Record<string, ApparelFamilyConfig> = {
  '89931': HORTEN2_FAMILY,
  '89930': HORTEN2_FAMILY,
  '89929': HORTEN2_FAMILY,
  '105192': PORTWEST_TEXPEL_FAMILY,
  '104546': LULEA2_FAMILY,
  '86181': MYSEN2_FAMILY,
  '104541': SOCCIA_FAMILY,
  '97983': SPACE_LADY_FAMILY,
  '86492': MOONLIGHT2_FAMILY,
  '86494': MOONLIGHT2_ARANCIO_FAMILY,
  '89950': MIKY_FAMILY,
  '89955': MIKY_ARANCIO_FAMILY,
  '73755': RENO_HV_GIALLO_FAMILY,
  '73757': RENO_HV_ARANCIO_FAMILY,
}

/** SKU con certificazioni/PDF tecnici consentiti in categoria Sicurezza. */
const SICUREZZA_DOCS_ALLOWLIST = new Set(Object.keys(APPAREL_FAMILY_BY_SKU))

const APPAREL_SUBCATEGORIES = new Set([
  SICUREZZA_SUBCATEGORY_PANTALONI.toLowerCase(),
  SICUREZZA_SUBCATEGORY_GIUBBOTTI.toLowerCase(),
  SICUREZZA_SUBCATEGORY_GIACCHE.toLowerCase(),
])

const SIZE_LABEL_RE = /^(XS|S|M|L|XL|XXL|2XL|3XL|XXXL|4XL)$/i

export function isSicurezzaApparelSizeLabel(label: string): boolean {
  return SIZE_LABEL_RE.test(label.trim())
}

export function areSicurezzaApparelSizeVariants(
  variants: ProductVariantOption[] | null | undefined,
): boolean {
  const list = variants ?? []
  return list.length > 0 && list.every((v) => isSicurezzaApparelSizeLabel(v.label))
}

export function isSicurezzaCategoryProduct(
  product: Pick<OfficeProduct, 'category'> | null | undefined,
): boolean {
  if (!product) return false
  return (
    (product.category ?? '').trim().localeCompare(SICUREZZA_CATEGORY, 'it', {
      sensitivity: 'base',
    }) === 0
  )
}

export function isSicurezzaWorkwearProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory'> | null | undefined,
): boolean {
  if (!isSicurezzaCategoryProduct(product)) return false
  const sub = (product?.subcategory ?? '').trim().toLowerCase()
  return APPAREL_SUBCATEGORIES.has(sub)
}

function productSkuKey(product: Pick<OfficeProduct, 'id' | 'producerCode'>): string {
  return String(product.producerCode || product.id || '')
    .trim()
    .toLowerCase()
}

export function isSicurezzaDocsAllowlistedProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  return SICUREZZA_DOCS_ALLOWLIST.has(productSkuKey(product))
}

/** Estrae taglia da format / nome (es. "M · Softshell", "taglia XL"). */
export function extractApparelSizeFromProduct(
  product: Pick<OfficeProduct, 'name' | 'format' | 'mainFeatures'>,
): SicurezzaApparelSize | null {
  const normalizeSize = (raw: string): SicurezzaApparelSize => {
    const s = raw.trim().toUpperCase()
    if (s === '2XL') return 'XXL'
    if (s === 'XXXL') return '3XL'
    return s as SicurezzaApparelSize
  }
  const fromFormat = String(product.format ?? '')
    .trim()
    .match(/^(XS|S|M|L|XL|XXL|2XL|3XL|4XL)\b/i)
  if (fromFormat) {
    return normalizeSize(fromFormat[1])
  }
  const fromName = String(product.name ?? '').match(
    /\btaglia\s+(XS|S|M|L|XL|XXL|2XL|3XL|XXXL|4XL)\b/i,
  )
  if (fromName) {
    return normalizeSize(fromName[1])
  }
  const feat = product.mainFeatures?.Taglia ?? product.mainFeatures?.taglia ?? ''
  if (isSicurezzaApparelSizeLabel(feat)) {
    return normalizeSize(feat)
  }
  return null
}

function defaultSizeVariantsForSku(baseSku: string): ProductVariantOption[] {
  const sku = baseSku.trim()
  return SICUREZZA_APPAREL_SIZES.map((size) => ({
    label: size,
    sku: sku ? `${sku}-${size}` : size,
  }))
}

function mergeGalleryUrls(
  primary: string | undefined,
  existing: string[] | undefined,
  extra: string[] | undefined,
): string[] | undefined {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (u?: string) => {
    const t = (u ?? '').trim()
    if (!t || seen.has(t)) return
    seen.add(t)
    out.push(t)
  }
  // `imageGalleryUrls` è aggiuntivo rispetto a imageUrl (già in PDP).
  for (const u of existing ?? []) push(u)
  for (const u of extra ?? []) {
    if (primary && u === primary.trim()) continue
    push(u)
  }
  return out.length ? out : undefined
}

/**
 * Arricchisce prodotti Sicurezza:
 * - abbigliamento: varianti taglia
 * - allowlist: documenti tecnici + galleria dedicata
 * - tutti gli altri Sicurezza: nasconde PDF/certificazioni generiche
 */
export function applySicurezzaApparelCatalog(product: OfficeProduct): OfficeProduct {
  if (!isSicurezzaCategoryProduct(product)) return product

  const skuKey = productSkuKey(product)
  const family = APPAREL_FAMILY_BY_SKU[skuKey] ?? APPAREL_FAMILY_BY_SKU[product.id.trim().toLowerCase()]
  const isWorkwear = isSicurezzaWorkwearProduct(product)

  let next: OfficeProduct = { ...product }

  // 1) Pulizia certificazioni/PDF generici fuori allowlist
  if (!family?.documents?.length) {
    next = {
      ...next,
      brochureUrl: undefined,
      catalogPagePdfUrl: undefined,
      technicalDocuments: undefined,
    }
  }

  if (!isWorkwear && !family) return applySicurezzaPromoDiscount(next)

  const existingAreSizes = areSicurezzaApparelSizeVariants(product.variants)

  if (family?.displayName) {
    next = { ...next, name: family.displayName }
  }
  if (family?.imageUrl?.trim()) {
    next = { ...next, imageUrl: family.imageUrl.trim() }
  }
  if (family?.description?.trim()) {
    next = { ...next, description: family.description.trim() }
  }
  if (family?.mainFeatures && Object.keys(family.mainFeatures).length) {
    next = {
      ...next,
      mainFeatures: { ...next.mainFeatures, ...family.mainFeatures },
    }
  }

  if (family?.sizes?.length) {
    next = { ...next, variants: family.sizes.map((v) => ({ ...v })) }
  } else if (isWorkwear && !existingAreSizes && !(product.variants?.length)) {
    const detected = extractApparelSizeFromProduct(product)
    const sizes = defaultSizeVariantsForSku(String(product.producerCode || product.id || ''))
    next = {
      ...next,
      variants: sizes.map((v) =>
        detected && v.label === detected
          ? { ...v, sku: String(product.producerCode || product.id || '').trim() || v.sku }
          : v,
      ),
    }
  }

  if (family?.galleryUrls?.length) {
    next = {
      ...next,
      // Galleria curata: sostituisce eventuali immagini DB non allineate.
      imageGalleryUrls: mergeGalleryUrls(next.imageUrl, undefined, family.galleryUrls),
    }
  }

  if (family?.documents?.length) {
    next = {
      ...next,
      technicalDocuments: family.documents.map((d) => ({ ...d })),
      brochureUrl: undefined,
      catalogPagePdfUrl: undefined,
    }
  }

  const defaultSize =
    extractApparelSizeFromProduct(product) ??
    (areSicurezzaApparelSizeVariants(next.variants) ? (next.variants?.[1]?.label as string) : null)
  if (defaultSize && next.variants) {
    const match = next.variants.find((v) => v.label === defaultSize)
    if (match?.ean && !next.ean) {
      next = {
        ...next,
        ean: match.ean,
        mainFeatures: { ...next.mainFeatures, EAN: match.ean },
      }
    }
    if (match?.sku) {
      next = {
        ...next,
        mainFeatures: {
          ...next.mainFeatures,
          'Cod. produttore': match.sku,
          Taglia: match.label,
        },
      }
    }
  }

  return applySicurezzaPromoDiscount(next)
}

/** Prodotto sintetico 89931 se ancora assente in DB (fallback PDP / listing). */
export function buildHorten2LightOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '89931',
    name: HORTEN2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '89931',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/giallo',
      Materiale: 'Softshell PE/elastan',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/89931.jpg',
    format: 'Softshell con cappuccio · taglie S–3XL',
    price: 60,
    description:
      'Giacca Softshell Delta Plus Horten2 Light con cappuccio, nero/giallo. Softshell a 3 strati laminati (poliestere/elastan): antivento, idrorepellente su pioggia fine e traspirante. Cappuccio fisso, zip sotto patta antipioggia, 4 tasche e piping catarifrangente decorativo. Conformità tipica EN ISO 13688:2013 / Regolamento UE 2016/425 (rischi minori). Selezionare la taglia prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Portwest Texpel Splash Eco (105192). */
export function buildPortwestTexpelSplashEcoOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '105192',
    name: PORTWEST_TEXPEL_DISPLAY_NAME,
    brand: 'Portwest',
    producerCode: '105192',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/grigio',
      Materiale: 'Texpel™ Splash Eco Softshell',
      'Part number': 'PW378BZRL',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/105192.jpg',
    format: 'L · Texpel Splash Eco Softshell · taglie S–3XL',
    price: 60,
    description:
      'Giacca da lavoro Softshell Portwest Texpel™ Splash Eco, nero/grigio. Softshell antivento e traspirante con trattamento Splash Eco orientato a idrorepellenza e resistenza agli schizzi. Vestibilità professionale Portwest; selezionare la taglia (codici PW378BZR*) prima dell’acquisto. Non è un capo alta visibilità EN ISO 20471. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus Lulea2 Softshell grigio/nero (104546). */
export function buildLulea2SoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '104546',
    name: LULEA2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '104546',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/nero',
      Materiale: 'Softshell 2 strati',
      'Part number': 'LULE2GRXG',
      EAN: '3295249200589',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/104546.jpg',
    format: 'XL · Softshell · taglie S–3XL',
    price: 60,
    ean: '3295249200589',
    description:
      'Giacca Softshell Deltaplus Lulea2, grigio/nero. Softshell a 2 strati con stretch a 4 direzioni (~280 g/m²): antivento, idrorepellente e traspirante per uso professionale. Vestibilità ampia adatta sopra pile o maglia. Selezionare la taglia (codici LULE2GR*) prima dell’acquisto. Non certificata EN ISO 20471. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus MySen 2 Softshell grigio/fucsia (86181). */
export function buildMySen2SoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '86181',
    name: MYSEN2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '86181',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/fucsia',
      Materiale: 'Softshell/poliestere/elastan',
      'Part number': 'MYSE2GFTM',
      Taglia: 'M',
      EAN: '3295249222291',
    },
    imageUrl: 'https://odmultimedia.eu/immagini/LD/86181.jpg',
    format: 'M · Softshell 2:1 · taglie XS–XXL',
    price: 60,
    ean: '3295249222291',
    description:
      'Giacca Softshell Deltaplus MySen 2, grigio/fucsia. Softshell a 2 strati elasticizzato (poliestere/elastan) con struttura 2 in 1 e maniche staccabili. Adatta ad ambienti professionali; selezionare la taglia (codici MYSE2GF*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus Soccia Softshell 2 in 1 nero/rosso (104541). */
export function buildSocciaSoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '104541',
    name: SOCCIA_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '104541',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'nero/rosso',
      Materiale: 'Softshell 100% poliestere riciclato',
      'Part number': 'SOCCINOGT',
      Taglia: 'L',
      EAN: '3295249302221',
    },
    imageUrl: SOCCIA_IMAGE_URL,
    imageGalleryUrls: [...SOCCIA_GALLERY],
    format: 'L · Softshell 2 in 1 · taglie S–3XL',
    price: 60,
    ean: '3295249302221',
    description:
      'Giacca Softshell 2 in 1 Deltaplus Soccia, nero/rosso. Softshell in 100% poliestere riciclato con stretch a 4 direzioni (~280 g/m²): antivento, idrorepellente e traspirante. Selezionare la taglia (codici SOCCINO*) prima dell’acquisto. Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP U-Power Space Lady Softshell donna grigio/fucsia (97983). */
export function buildSpaceLadySoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '97983',
    name: SPACE_LADY_DISPLAY_NAME,
    brand: 'U-Power',
    producerCode: '97983',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: {
      Colore: 'grigio/fucsia',
      Materiale: 'Softshell 320 g/m² · membrana U-Tex',
      'Cod. modello': 'FU187GF',
      'Part number': 'FU187GF-L',
      Taglia: 'L',
      EAN: '8033546443934',
    },
    imageUrl: SPACE_LADY_IMAGE_URL,
    format: 'L · Softshell donna · taglie M–L',
    price: 60,
    ean: '8033546443934',
    description:
      'Giacca Softshell donna U-Power Space Lady, grigio/fucsia (modello FU187GF). Softshell ~320 g/m² con membrana U-Tex e tecnologia Free Sound. Disponibile solo nelle taglie M e L a magazzino; selezionare la taglia (FU187GF-M / FU187GF-L) prima dell’acquisto. Conformità tipica EN ISO 13688 / EN 14058 (DPI Cat. I). Prezzo unitario imponibile IVA esclusa.',
  })
}

/** Fallback PDP Deltaplus Moonlight 2 Softshell HV giallo fluo (86492). */
export function buildMoonlight2SoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '86492',
    name: MOONLIGHT2_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '86492',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: { ...MOONLIGHT2_MAIN_FEATURES },
    imageUrl: MOONLIGHT2_IMAGE_URL,
    format: 'L · Softshell HV 2 in 1 · taglie S–3XL',
    price: 60,
    ean: '3295249222123',
    description: MOONLIGHT2_DESCRIPTION,
  })
}

/** Fallback PDP Deltaplus Moonlight 2 Softshell HV arancio fluo (86494). */
export function buildMoonlight2ArancioSoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '86494',
    name: MOONLIGHT2_ARANCIO_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '86494',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: { ...MOONLIGHT2_ARANCIO_MAIN_FEATURES },
    imageUrl: MOONLIGHT2_ARANCIO_IMAGE_URL,
    imageGalleryUrls: [...MOONLIGHT2_ARANCIO_GALLERY],
    format: 'M · Softshell HV 2 in 1 · taglie S–3XL',
    price: 60,
    ean: '3295249222161',
    description: MOONLIGHT2_ARANCIO_DESCRIPTION,
  })
}

/** Fallback PDP U-Power Miky Softshell HV giallo fluo (89950). */
export function buildMikySoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '89950',
    name: MIKY_DISPLAY_NAME,
    brand: 'U-Power',
    producerCode: '89950',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: { ...MIKY_MAIN_FEATURES },
    imageUrl: MIKY_IMAGE_URL,
    format: 'L · Softshell HV Miky · taglie S–4XL',
    price: 55,
    ean: '8033546387245',
    description: MIKY_DESCRIPTION,
  })
}

/** Fallback PDP U-Power Miky Softshell HV arancio fluo (89955). */
export function buildMikyArancioSoftshellOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '89955',
    name: MIKY_ARANCIO_DISPLAY_NAME,
    brand: 'U-Power',
    producerCode: '89955',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIACCHE,
    mainFeatures: { ...MIKY_ARANCIO_MAIN_FEATURES },
    imageUrl: MIKY_ARANCIO_IMAGE_URL,
    format: 'XL · Softshell HV Miky · taglie S–4XL',
    price: 55,
    ean: '8033546387320',
    description: MIKY_ARANCIO_DESCRIPTION,
  })
}

/** Fallback PDP Deltaplus Reno HV giallo fluo (73755). */
export function buildRenoHvGialloOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '73755',
    name: RENO_HV_GIALLO_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '73755',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIUBBOTTI,
    mainFeatures: { ...RENO_HV_GIALLO_MAIN_FEATURES },
    imageUrl: RENO_HV_GIALLO_IMAGE_URL,
    format: 'XL · Reno HV 2 in 1 · taglie S–3XL',
    price: 55,
    ean: '3295249161972',
    description: RENO_HV_DESCRIPTION,
  })
}

/** Fallback PDP Deltaplus Reno HV arancio fluo (73757). */
export function buildRenoHvArancioOfficeProduct(): OfficeProduct {
  return applySicurezzaApparelCatalog({
    id: '73757',
    name: RENO_HV_ARANCIO_DISPLAY_NAME,
    brand: 'Deltaplus',
    producerCode: '73757',
    category: SICUREZZA_CATEGORY,
    subcategory: SICUREZZA_SUBCATEGORY_GIUBBOTTI,
    mainFeatures: { ...RENO_HV_ARANCIO_MAIN_FEATURES },
    imageUrl: RENO_HV_ARANCIO_IMAGE_URL,
    format: 'XL · Reno HV 2 in 1 · taglie S–3XL',
    price: 55,
    ean: '3295249162030',
    description: RENO_HV_DESCRIPTION,
  })
}
