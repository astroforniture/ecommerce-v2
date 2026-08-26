/**
 * Riferimenti categoria da gimaitaly.com
 * -----------------------------
 * Le voci in `gimaWebsiteDepartments` riproducono il menu principale delle categorie
 * prodotto (link a `categoria.asp?dept_id=…&dept_selected=…`) così come compare sulla
 * home https://www.gimaitaly.com/default.asp al momento dell’analisi (etichette in
 * inglese sul sito).
 *
 * Le **macro** in `medicalCatalogByMacro` sono raggruppamenti solo per la vetrina Astro
 * Medical: ogni macro elenca esclusivamente `deptId` presenti in quel menu. I prodotti
 * possono essere serviti da **Supabase** (`medical_products`): vedi `src/api/medicalProductsSupabase.ts`.
 */

/** Voce categoria così come linkata dal sito Gima (dept_id + etichetta pubblicata). */
export type GimaWebsiteDepartment = {
  readonly deptId: number
  /** Testo del link sul sito (lingua pubblicata sulle pagine analizzate). */
  readonly labelAsPublished: string
  readonly categoryListUrl: string
}

export const gimaWebsiteDepartments: readonly GimaWebsiteDepartment[] = [
  {
    deptId: 8,
    labelAsPublished: 'Wireless products',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=8&dept_selected=8',
  },
  {
    deptId: 10,
    labelAsPublished: 'Diagnostic tests - laboratory',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=10&dept_selected=10',
  },
  {
    deptId: 14,
    labelAsPublished: 'Health care - pharmacy',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=14&dept_selected=14',
  },
  {
    deptId: 18,
    labelAsPublished: 'Surgical instruments',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=18&dept_selected=18',
  },
  {
    deptId: 22,
    labelAsPublished: 'Medical bags',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=22&dept_selected=22',
  },
  {
    deptId: 28,
    labelAsPublished: 'Scales and measures',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=28&dept_selected=28',
  },
  {
    deptId: 24,
    labelAsPublished: 'Patient aids',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=24&dept_selected=24',
  },
  {
    deptId: 32,
    labelAsPublished: 'Furniture',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=32&dept_selected=32',
  },
  {
    deptId: 36,
    labelAsPublished: 'Electromedical devices',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=36&dept_selected=36',
  },
  {
    deptId: 40,
    labelAsPublished: 'Gynaecology',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=40&dept_selected=40',
  },
  {
    deptId: 44,
    labelAsPublished: 'Electrosurgery - cautery',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=44&dept_selected=44',
  },
  {
    deptId: 46,
    labelAsPublished: 'Loupes & mirrors',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=46&dept_selected=46',
  },
  {
    deptId: 48,
    labelAsPublished: 'Endoscopy',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=48&dept_selected=48',
  },
  {
    deptId: 50,
    labelAsPublished: 'Medical lights',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=50&dept_selected=50',
  },
  {
    deptId: 52,
    labelAsPublished: 'ENT devices',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=52&dept_selected=52',
  },
  {
    deptId: 54,
    labelAsPublished: 'Stethoscopes & sphygmos',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=54&dept_selected=54',
  },
  {
    deptId: 56,
    labelAsPublished: 'Audiometry & spirometry',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=56&dept_selected=56',
  },
  {
    deptId: 58,
    labelAsPublished: 'Ecg, monitors & ultrasound',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=58&dept_selected=58',
  },
  {
    deptId: 62,
    labelAsPublished: 'First aid & emergency',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=62&dept_selected=62',
  },
  {
    deptId: 66,
    labelAsPublished: 'Sterilization',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=66&dept_selected=66',
  },
  {
    deptId: 90,
    labelAsPublished: 'Veterinary',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=90&dept_selected=90',
  },
  {
    deptId: 70,
    labelAsPublished: 'Human anatomy',
    categoryListUrl:
      'https://www.gimaitaly.com/categoria.asp?dept_id=70&dept_selected=70',
  },
] as const

export type MedicalProductCta = 'quote' | 'buy'

/**
 * Prodotto catalogo Astro Medical / Gima.
 * `categoryPath`: [macro vetrina, etichetta categoria ufficiale da `gimaWebsiteDepartments`].
 */
export type MedicalProduct = {
  readonly sku: string
  readonly name: string
  readonly fullDescription: string
  readonly price: number
  readonly categoryPath: readonly [macroLabel: string, gimaDepartmentLabel: string]
  /** Presente quando il record proviene da Supabase (`macro_id`). */
  readonly macroId?: string
  /** Opzionale: immagine vetrina (es. da media Gima). */
  readonly imageUrl?: string
  /** Codice GIMA ufficiale (id catalogo `gima-{sku}`), se distinto dallo stem immagine. */
  readonly gimaSku?: string
  readonly cta?: MedicalProductCta
}

export type MedicalCatalogMacroSection = {
  /** Slug stabile per filtri / URL futuri */
  readonly macroId: string
  /** Etichetta macro mostrata in vetrina (IT) */
  readonly macroLabelIt: string
  /** Solo `deptId` presenti in `gimaWebsiteDepartments` */
  readonly gimaDeptIds: readonly number[]
  /** Vetrina: prodotti da Supabase o da catalogo statico `ASTRO_MEDICAL_STATIC_CATALOG_SEED`. */
  products: MedicalProduct[]
}

/**
 * Macro = raggruppamento vetrina. Ogni `gimaDeptIds` è sottoinsieme del menu Gima.
 * Copre tutti i `deptId` del registro una sola volta.
 */
export const medicalCatalogByMacro: MedicalCatalogMacroSection[] = [
  {
    macroId: 'diagnostica',
    macroLabelIt: 'Diagnostica',
    gimaDeptIds: [10, 28, 52, 54, 56, 58],
    products: [],
  },
  {
    macroId: 'emergenza',
    macroLabelIt: 'Emergenza e pronto soccorso',
    gimaDeptIds: [62],
    products: [],
  },
  {
    macroId: 'arredo',
    macroLabelIt: 'Arredo e illuminazione',
    gimaDeptIds: [32, 50],
    products: [],
  },
  {
    macroId: 'strumentario',
    macroLabelIt: 'Strumentario e chirurgia',
    gimaDeptIds: [18, 44, 46, 48],
    products: [],
  },
  {
    macroId: 'elettromedicali',
    macroLabelIt: 'Elettromedicali',
    gimaDeptIds: [8, 36],
    products: [],
  },
  {
    macroId: 'farmacia-cura',
    macroLabelIt: 'Farmacia e cura',
    gimaDeptIds: [14],
    products: [],
  },
  {
    macroId: 'organizzazione-ausili',
    macroLabelIt: 'Organizzazione e ausili',
    gimaDeptIds: [22, 24],
    products: [],
  },
  {
    macroId: 'ginecologia',
    macroLabelIt: 'Ginecologia',
    gimaDeptIds: [40],
    products: [],
  },
  {
    macroId: 'sterilizzazione',
    macroLabelIt: 'Sterilizzazione',
    gimaDeptIds: [66],
    products: [],
  },
  {
    macroId: 'veterinaria',
    macroLabelIt: 'Veterinaria',
    gimaDeptIds: [90],
    products: [],
  },
  {
    macroId: 'formazione',
    macroLabelIt: 'Formazione e anatomia',
    gimaDeptIds: [70],
    products: [],
  },
]

/** Tutti i prodotti del catalogo locale Astro Medical (fallback se Supabase non risponde). */
export function getAllMedicalProducts(): MedicalProduct[] {
  return [...ASTRO_MEDICAL_STATIC_CATALOG_SEED]
}

function macroLabelFromId(macroId: string): string {
  return medicalCatalogByMacro.find((m) => m.macroId === macroId)?.macroLabelIt ?? macroId
}

/** Catalogo vetrina Gima: stessi articoli della selezione iniziale, raggruppati per macro. */
export const ASTRO_MEDICAL_STATIC_CATALOG_SEED: readonly MedicalProduct[] = [
  {
    sku: 'AMS-0001',
    name: 'BORSA TERMICA - nylon giallo',
    fullDescription: 'BORSA TERMICA - nylon giallo',
    price: 42.5,
    categoryPath: [macroLabelFromId('emergenza'), 'Pronto soccorso'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27209.jpg',
  },
  {
    sku: 'AMS-0002',
    name: 'CAVO ECG VETERINARIA 5 derivazioni per 33305/6',
    fullDescription:
      'Cavo ECG veterinaria 5 derivazioni compatibile con ECG GIMA 33305/33306. Codice GIMA 33319. ' +
      'Prezzo fisso, imponibile IVA esclusa.',
    price: 130,
    categoryPath: [macroLabelFromId('elettromedicali'), 'Elettromedicali'],
    macroId: 'elettromedicali',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33319.jpg',
    gimaSku: '33319',
  },
  {
    sku: 'AMS-0003',
    name: 'LETTINO DA VISITA IN LEGNO - GIMA 27416',
    fullDescription:
      'Lettino da visita in legno. Codice GIMA 27416. Prezzo 740,00 € al pezzo, imponibile IVA esclusa.',
    price: 740,
    categoryPath: [macroLabelFromId('arredo'), 'Lettini da visita'],
    macroId: 'arredo',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27416.jpg',
    gimaSku: '27416',
  },
  {
    sku: 'AMS-0004',
    name: 'CAMICE BIANCO - donna - taglia S',
    fullDescription: 'CAMICE BIANCO - donna - taglia S',
    price: 36.0,
    categoryPath: [macroLabelFromId('organizzazione-ausili'), 'Abbigliamento'],
    macroId: 'organizzazione-ausili',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/21401-05.jpg',
  },
  {
    sku: 'AMS-0005',
    name: 'MISURATORE DI PRESSIONE GIMA BLUETOOTH',
    fullDescription: 'MISURATORE DI PRESSIONE GIMA BLUETOOTH',
    price: 89.0,
    categoryPath: [macroLabelFromId('elettromedicali'), 'Elettromedicali'],
    macroId: 'elettromedicali',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32915.jpg',
  },
  {
    sku: 'AMS-0006',
    name: 'Carta termica ECG 210x295 mm (Pacco griglia arancio)',
    fullDescription: 'Carta termica ECG 210x295 mm (Pacco griglia arancio)',
    price: 32.5,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32984.jpg',
  },
  {
    sku: 'AMS-0007',
    name: 'TERMOMETRO NO CONTACT AEON A200',
    fullDescription: 'TERMOMETRO NO CONTACT AEON A200',
    price: 45.9,
    categoryPath: [macroLabelFromId('elettromedicali'), 'Elettromedicali'],
    macroId: 'elettromedicali',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/25550.jpg',
  },
  {
    sku: 'AMS-0008',
    name: 'COMPRESSE GARZA COTONE 10x20 cm (12 strati)',
    fullDescription: 'COMPRESSE GARZA COTONE 10x20 cm (12 strati)',
    price: 12.4,
    categoryPath: [macroLabelFromId('emergenza'), 'Consumabili'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/34773b.jpg',
  },
  {
    sku: 'AMS-0009',
    name: 'BISTURI RETTO - 13 cm',
    fullDescription: 'BISTURI RETTO - 13 cm',
    price: 8.5,
    categoryPath: [macroLabelFromId('strumentario'), 'Strumentario'],
    macroId: 'strumentario',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/26703.jpg',
  },
  {
    sku: 'AMS-0010',
    name: 'GERMOXID LIQUIDO DISINFETTANTE CUTE (250 ml)',
    fullDescription: 'GERMOXID LIQUIDO DISINFETTANTE CUTE (250 ml)',
    price: 14.2,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Disinfezione'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/36635.jpg',
  },
  {
    sku: 'AMS-0011',
    name: 'BILANCIA BODY FAT LIBRA - nera',
    fullDescription: 'BILANCIA BODY FAT LIBRA - nera',
    price: 52.0,
    categoryPath: [macroLabelFromId('diagnostica'), 'Elettromedicali'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27089.jpg',
  },
  {
    sku: 'AMS-0012',
    name: 'PESAPERSONE A STADERA WUNDER C201',
    fullDescription: 'PESAPERSONE A STADERA WUNDER C201',
    price: 38.0,
    categoryPath: [macroLabelFromId('diagnostica'), 'Elettromedicali'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/25008.jpg',
  },
  {
    sku: 'AMS-0013',
    name: 'KIT GRANDE MULTIRED - valigetta',
    fullDescription: 'KIT GRANDE MULTIRED - valigetta',
    price: 195.0,
    categoryPath: [macroLabelFromId('emergenza'), 'Pronto soccorso'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/34193.jpg',
  },
  {
    sku: 'AMS-0014',
    name: 'BILANCIA BODY FAT OMRON BF511',
    fullDescription: 'BILANCIA BODY FAT OMRON BF511',
    price: 98.0,
    categoryPath: [macroLabelFromId('elettromedicali'), 'Elettromedicali'],
    macroId: 'elettromedicali',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27293.jpg',
  },
  {
    sku: 'AMS-0015',
    name: 'ECOGRAFO B/N CHISON ECO3',
    fullDescription: 'ECOGRAFO B/N CHISON ECO3',
    price: 4280.0,
    categoryPath: [macroLabelFromId('diagnostica'), 'Diagnostica per immagini'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33864.jpg',
  },
  {
    sku: 'AMS-0016',
    name: 'POVI-IODINE 100 ANTISETTICO - 500 ml',
    fullDescription: 'POVI-IODINE 100 ANTISETTICO - 500 ml',
    price: 22.0,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Disinfezione'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/36565.jpg',
  },
  {
    sku: 'AMS-0017',
    name: 'SIRINGA INSULINA AGO INSERITO 27G',
    fullDescription: 'SIRINGA INSULINA AGO INSERITO 27G',
    price: 9.9,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Consumabili'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23803.jpg',
  },
  {
    sku: 'AMS-0018',
    name: 'ELETTRODI PE-FOAM MONOUSO 48-50 mm - Conf. 50 pz.',
    fullDescription:
      'Elettrodi PE-Foam monouso diametro 48-50 mm, confezione da 50 pezzi. Codice GIMA 33371. ' +
      'Prezzo fisso per confezione da 50 pz, imponibile IVA esclusa.',
    price: 6.7,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33371.jpg',
  },
  {
    sku: 'AMS-0031',
    name: 'ELETTRODI MONOUSO FOAM 36-40 mm - Conf. 100 pz.',
    fullDescription:
      'Elettrodi monouso foam diametro 36-40 mm, confezione da 100 pezzi. Codice GIMA 33314. ' +
      'Prezzo riferito alla confezione da 100 pz, imponibile IVA esclusa.',
    price: 11,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33314.jpg',
    gimaSku: '33314',
  },
  {
    sku: 'AMS-0032',
    name: 'ELETTRODI FOAM MONOUSO 48-50mm - gel - Conf. 50 pz.',
    fullDescription:
      'Elettrodi foam monouso diametro 48-50 mm con gel, confezione da 50 pezzi. Codice GIMA 33344. ' +
      'Prezzo riferito alla confezione da 50 pz, imponibile IVA esclusa.',
    price: 7.15,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33344.jpg',
    gimaSku: '33344',
  },
  {
    sku: 'AMS-0033',
    name: 'Carta termica ECG 215x25 mmxm - rotolo griglia arancio - Conf. 5pz',
    fullDescription:
      'Carta termica ECG 215x25 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 32950. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.',
    price: 30,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32950.jpg',
    gimaSku: '32950',
  },
  {
    sku: 'AMS-0034',
    name: 'Carta termica ECG 80x20 mmxm - rotolo griglia arancio - Conf. 10pz',
    fullDescription:
      'Carta termica ECG 80x20 mmxm, rotolo con griglia arancio, confezione da 10 pezzi. Codice GIMA 32969. ' +
      'Prezzo riferito alla confezione da 10 pz, imponibile IVA esclusa.',
    price: 25,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32969.jpg',
    gimaSku: '32969',
  },
  {
    sku: 'AMS-0035',
    name: 'Carta termica ECG 210x30 mmxm - rotolo griglia arancio - Conf. 5pz',
    fullDescription:
      'Carta termica ECG 210x30 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 32967. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.',
    price: 29,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    // 32967.jpg non è pubblicato su GIMA: asset condiviso con 32969, id catalogo gima-32967.
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32969.jpg',
    gimaSku: '32967',
  },
  {
    sku: 'AMS-0036',
    name: 'Carta termica ECG 110x20 mmxm - rotolo griglia arancio - Conf. 10pz',
    fullDescription:
      'Carta termica ECG 110x20 mmxm, rotolo con griglia arancio, confezione da 10 pezzi. Codice GIMA 32970. ' +
      'Prezzo riferito alla confezione da 10 pz, imponibile IVA esclusa.',
    price: 30,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32970.jpg',
    gimaSku: '32970',
  },
  {
    sku: 'AMS-0037',
    name: 'Carta termica ECG 210x20 mmxm - rotolo griglia arancio - Conf. 5pz',
    fullDescription:
      'Carta termica ECG 210x20 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 33021. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.',
    price: 30,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33021.jpg',
    gimaSku: '33021',
  },
  {
    sku: 'AMS-0038',
    name: 'FONENDO "TRAD" - lira nera',
    fullDescription:
      'Fonendoscopio TRAD con lira nera. Codice GIMA 32560. Prezzo unitario imponibile IVA esclusa.',
    price: 4.2,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32555_57-64_b.jpg',
    gimaSku: '32560',
  },
  {
    sku: 'AMS-0039',
    name: 'DUOFONO YTON - lira blu scuro',
    fullDescription:
      'Duofono YTON con lira blu scuro. Codice GIMA 49511. Prezzo unitario imponibile IVA esclusa.',
    price: 15,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49511.jpg',
    gimaSku: '49511',
  },
  {
    sku: 'AMS-0040',
    name: 'FONENDO "WAN" - lira blu',
    fullDescription:
      'Fonendoscopio WAN con lira blu. Codice GIMA 32570. Prezzo unitario imponibile IVA esclusa.',
    price: 14,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32570.jpg',
    gimaSku: '32570',
  },
  {
    sku: 'AMS-0041',
    name: 'FONENDOSCOPIO YTON - lira blu scuro',
    fullDescription:
      'Fonendoscopio YTON con lira blu scuro. Codice GIMA 49501. Prezzo unitario imponibile IVA esclusa.',
    price: 13,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49501.jpg',
    gimaSku: '49501',
  },
  {
    sku: 'AMS-0042',
    name: 'STETOSCOPIO LINUX - lira nera',
    fullDescription:
      'Stetoscopio LINUX con lira nera. Codice GIMA 32524. Prezzo unitario imponibile IVA esclusa.',
    price: 17,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32524.jpg',
    gimaSku: '32524',
  },
  {
    sku: 'AMS-0043',
    name: 'FONENDO REGALITE DELUXE',
    fullDescription:
      'Fonendoscopio REGALITE DELUXE. Codice GIMA 32526. Prezzo fisso, imponibile IVA esclusa.',
    price: 55,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32526.jpg',
    gimaSku: '32526',
  },
  {
    sku: 'AMS-0044',
    name: 'DUOFONO "CLASSIC CARDIOLOGICO" - lira blu',
    fullDescription:
      'Duofono CLASSIC CARDIOLOGICO con lira blu. Codice GIMA 32550. Prezzo unitario imponibile IVA esclusa.',
    price: 30,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32550.jpg',
    gimaSku: '32550',
  },
  {
    sku: 'AMS-0045',
    name: 'DUOFONO "JOTARAP" - lira nera',
    fullDescription:
      'Duofono JOTARAP con lira nera. Codice GIMA 32580. Prezzo unitario imponibile IVA esclusa.',
    price: 14,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32580.jpg',
    gimaSku: '32580',
  },
  // ── Sfigmomanometri e misuratori di pressione ──────────────────────────────
  {
    sku: 'AMS-0046',
    name: 'SFIGMO LONDON nero - aneroide',
    fullDescription:
      'Sfigmomanometro aneroide LONDON nero. Codice GIMA 32725. Prezzo unitario imponibile IVA esclusa.',
    price: 20,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32725.jpg',
    gimaSku: '32725',
  },
  {
    sku: 'AMS-0047',
    name: 'SFIGMO PALMARE KOBE',
    fullDescription:
      'Sfigmomanometro palmare KOBE. Codice GIMA 32690. Prezzo unitario imponibile IVA esclusa.',
    price: 19,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32690.jpg',
    gimaSku: '32690',
  },
  {
    sku: 'AMS-0048',
    name: 'MISURATORE DI PRESSIONE AUTOMATICO GIMA SMART',
    fullDescription:
      'Misuratore di pressione automatico GIMA SMART. Codice GIMA 32921. Prezzo unitario imponibile IVA esclusa.',
    price: 25,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32921.jpg',
    gimaSku: '32921',
  },
  {
    sku: 'AMS-0049',
    name: 'SFIGMO MINOR-2 - bracciale a velcro',
    fullDescription:
      'Sfigmomanometro MINOR-2 con bracciale a velcro. Codice GIMA 32714. Prezzo unitario imponibile IVA esclusa.',
    price: 35,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32714.jpg',
    gimaSku: '32714',
  },
  {
    sku: 'AMS-0050',
    name: 'MISURATORE DI PRESSIONE DIGITALE OMRON M2+ HEM-7188-LE',
    fullDescription:
      'Misuratore di pressione digitale OMRON M2+ HEM-7188-LE. Codice GIMA 49898. Prezzo fisso, imponibile IVA esclusa.',
    price: 40,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49898.jpeg',
    gimaSku: '49898',
  },
  {
    sku: 'AMS-0051',
    name: 'MISURATORE DI PRESSIONE DIGITALE OMRON M3 COMFORT AFIB HEM-7196-FLE',
    fullDescription:
      'Misuratore di pressione digitale OMRON M3 COMFORT AFIB HEM-7196-FLE. Codice GIMA 49907. Prezzo fisso, imponibile IVA esclusa.',
    price: 60,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49907.jpeg',
    gimaSku: '49907',
  },
  {
    sku: 'AMS-0052',
    name: 'MISURATORE DI PRESSIONE AUTOMATICO EASYCHECK GIMA',
    fullDescription:
      'Misuratore di pressione automatico EASYCHECK GIMA. Codice GIMA 49880. Prezzo unitario imponibile IVA esclusa.',
    price: 20,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49880.jpg',
    gimaSku: '49880',
  },
  // ── ECG ────────────────────────────────────────────────────────────────────
  {
    sku: 'AMS-0053',
    name: 'ECG CONTEC 300G - 3 canali con display',
    fullDescription:
      'Elettrocardiografo CONTEC 300G a 3 canali con display. Codice GIMA 33221. Prezzo fisso, imponibile IVA esclusa.',
    price: 400,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33221.jpg',
    gimaSku: '33221',
  },
  {
    sku: 'AMS-0054',
    name: 'ECG CONTEC 1200G - 12 canali con display',
    fullDescription:
      'Elettrocardiografo CONTEC 1200G a 12 canali con display. Codice GIMA 33224. Prezzo fisso, imponibile IVA esclusa.',
    price: 740,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33224.jpg',
    gimaSku: '33224',
  },
  {
    sku: 'AMS-0055',
    name: 'ECG CONTEC 600G - 3/6 canali con display',
    fullDescription:
      'Elettrocardiografo CONTEC 600G a 3/6 canali con display. Codice GIMA 33222. Prezzo fisso, imponibile IVA esclusa.',
    price: 599,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33222.jpeg',
    gimaSku: '33222',
  },
  {
    sku: 'AMS-0056',
    name: 'CARDIOLINE ECG200L FULL (Glasgow + EasyApp) - schermo a colori touch da 7',
    fullDescription:
      'Cardioline ECG200L FULL con interpretazione Glasgow e EasyApp, schermo touch a colori da 7". Codice GIMA 54205. Prezzo fisso, imponibile IVA esclusa.',
    price: 1600,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54205.jpg',
    gimaSku: '54205',
  },
  {
    sku: 'AMS-0057',
    name: 'NEO ECG T180 TABLET ECG con stampante',
    fullDescription:
      'NEO ECG T180 tablet ECG con stampante. Codice GIMA 54231. Prezzo fisso, imponibile IVA esclusa.',
    price: 1500,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54231.jpg',
    gimaSku: '54231',
  },
  {
    sku: 'AMS-0058',
    name: 'MONITOR ECG TASCABILE PCECG-500',
    fullDescription:
      'Monitor ECG tascabile PCECG-500. Codice GIMA 33236. Prezzo fisso, imponibile IVA esclusa.',
    price: 700,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33236_b.jpg',
    gimaSku: '33236',
  },
  // ── Colposcopi ─────────────────────────────────────────────────────────────
  {
    sku: 'AMS-0059',
    name: 'COLPOSCOPIO ALLTION A LED - 3,75X, 7X, 15X > 28.000 Lux',
    fullDescription:
      'Colposcopio ALLTION a LED con ingrandimenti 3,75X, 7X, 15X e illuminazione > 28.000 Lux. Codice GIMA 29613. Prezzo fisso, imponibile IVA esclusa.',
    price: 2100,
    categoryPath: [macroLabelFromId('ginecologia'), 'Strumenti'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29613.jpg',
    gimaSku: '29613',
  },
  {
    sku: 'AMS-0060',
    name: 'COLPOSCOPIO GIMA COLPY',
    fullDescription:
      'Colposcopio GIMA COLPY. Codice GIMA 29600. Prezzo fisso, imponibile IVA esclusa.',
    price: 2800,
    categoryPath: [macroLabelFromId('ginecologia'), 'Strumenti'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29600.jpg',
    gimaSku: '29600',
  },
  {
    sku: 'AMS-0061',
    name: 'COLPOSCOPIO ALLTION A LED - 9X',
    fullDescription:
      'Colposcopio ALLTION a LED con ingrandimento 9X. Codice GIMA 29612. Prezzo fisso, imponibile IVA esclusa.',
    price: 1900,
    categoryPath: [macroLabelFromId('ginecologia'), 'Strumenti'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29612.jpg',
    gimaSku: '29612',
  },
  {
    sku: 'AMS-0062',
    name: 'VIDEOCOLPOSCOPIO A LED COLPRO',
    fullDescription:
      'Videocolposcopio a LED COLPRO. Codice GIMA 29620. Prezzo fisso, imponibile IVA esclusa.',
    price: 2600,
    categoryPath: [macroLabelFromId('ginecologia'), 'Strumenti'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29620.jpg',
    gimaSku: '29620',
  },
  // ── Lettini / poltrone ginecologiche ───────────────────────────────────────
  {
    sku: 'AMS-0063',
    name: 'LETTINO GINECOLOGICO ALTEZZA VAR. - blu',
    fullDescription:
      'Lettino ginecologico ad altezza variabile, colore blu. Codice GIMA 27507. Prezzo fisso, imponibile IVA esclusa.',
    price: 1300,
    categoryPath: [macroLabelFromId('ginecologia'), 'Arredo'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27507.jpg',
    gimaSku: '27507',
  },
  {
    sku: 'AMS-0064',
    name: 'LETTINO GINECOLOGICO ALTEZZA VAR. - verde',
    fullDescription:
      'Lettino ginecologico ad altezza variabile, colore verde. Codice GIMA 27506. Prezzo fisso, imponibile IVA esclusa.',
    price: 1300,
    categoryPath: [macroLabelFromId('ginecologia'), 'Arredo'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27506.jpg',
    gimaSku: '27506',
  },
  {
    sku: 'AMS-0065',
    name: 'POLTRONA GINECOLOGICA GYNEX - colore a richiesta',
    fullDescription:
      'Poltrona ginecologica GYNEX, colore a richiesta. Codice GIMA 27520. Prezzo fisso, imponibile IVA esclusa.',
    price: 3000,
    categoryPath: [macroLabelFromId('ginecologia'), 'Arredo'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27520.jpg',
    gimaSku: '27520',
  },
  {
    sku: 'AMS-0066',
    name: 'LETTO GINECOLOGICO AD ALTEZZA VARIABILE - altri colori',
    fullDescription:
      'Letto ginecologico ad altezza variabile, altri colori. Codice GIMA 27496. Prezzo fisso, imponibile IVA esclusa.',
    price: 1700,
    categoryPath: [macroLabelFromId('ginecologia'), 'Arredo'],
    macroId: 'ginecologia',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27496.jpg',
    gimaSku: '27496',
  },
  // ── Defibrillatore / Holter ────────────────────────────────────────────────
  {
    sku: 'AMS-0067',
    name: 'DEFIBRILLATORE iPad CU-SP1 AED - GB,FR,IT,ES,DE,PL,US, JP, KR, Arabo',
    fullDescription:
      'Defibrillatore iPad CU-SP1 AED multilingua (GB, FR, IT, ES, DE, PL, US, JP, KR, Arabo). Codice GIMA 35340. Prezzo fisso, imponibile IVA esclusa.',
    price: 900,
    categoryPath: [macroLabelFromId('emergenza'), 'Pronto soccorso'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/35340.jpg',
    gimaSku: '35340',
  },
  {
    sku: 'AMS-0068',
    name: 'HOLTER ECG + SOFTWARE',
    fullDescription:
      'Holter ECG con software. Codice GIMA 35130. Prezzo fisso, imponibile IVA esclusa.',
    price: 600,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/35130.jpeg',
    gimaSku: '35130',
  },
  {
    sku: 'AMS-0069',
    name: 'SISTEMA DI MONITORAGGIO HOLTER M12 - 12 derivazioni',
    fullDescription:
      'Sistema di monitoraggio Holter M12 a 12 derivazioni. Codice GIMA 54300. Prezzo fisso, imponibile IVA esclusa.',
    price: 950,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54300.jpg',
    gimaSku: '54300',
  },
  // ── Dermatoscopi / Criochirurgia ───────────────────────────────────────────
  {
    sku: 'AMS-0070',
    name: 'DERMATOSCOPIO A LED POLARIZZATI+UV+BIANCHI MIC Wi-Fi & USB con software',
    fullDescription:
      'Dermatoscopio a LED polarizzati + UV + bianchi MIC Wi-Fi & USB con software. Codice GIMA 32177. Prezzo fisso, imponibile IVA esclusa.',
    price: 700,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32177.jpeg',
    gimaSku: '32177',
  },
  {
    sku: 'AMS-0071',
    name: 'DERMATOSCOPIO HEINE DELTA 30 - K-230.28.305',
    fullDescription:
      'Dermatoscopio HEINE DELTA 30 (K-230.28.305). Codice GIMA 31146. Prezzo fisso, imponibile IVA esclusa.',
    price: 1500,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31146.jpg',
    gimaSku: '31146',
  },
  {
    sku: 'AMS-0072',
    name: 'DERMATOSCOPIO GIMA 2000 - 10 ingrandimenti',
    fullDescription:
      'Dermatoscopio GIMA 2000 a 10 ingrandimenti. Codice GIMA 31187. Prezzo fisso, imponibile IVA esclusa.',
    price: 190,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31187.jpg',
    gimaSku: '31187',
  },
  {
    sku: 'AMS-0073',
    name: 'DERMATOSCOPIO LED HEINE MINI 3000 - nero',
    fullDescription:
      'Dermatoscopio LED HEINE MINI 3000, colore nero. Codice GIMA 31158. Prezzo fisso, imponibile IVA esclusa.',
    price: 400,
    categoryPath: [macroLabelFromId('diagnostica'), 'Strumenti'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31158.jpg',
    gimaSku: '31158',
  },
  {
    sku: 'AMS-0074',
    name: 'DISPOSITIVO CRIOCHIRURGICO CRYOMEGA con cartuccia 16 g',
    fullDescription:
      'Dispositivo criochirurgico CRYOMEGA con cartuccia 16 g. Codice GIMA 30586. Prezzo unitario imponibile IVA esclusa.',
    price: 290,
    categoryPath: [macroLabelFromId('strumentario'), 'Strumenti'],
    macroId: 'strumentario',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/30586.jpg',
    gimaSku: '30586',
  },
  // ── Lenzuolini medici / monouso ────────────────────────────────────────────
  {
    sku: 'AMS-0075',
    name: 'LENZUOLINO PUNTA A PUNTA 2 VELI 50m x 59 cm - Conf. 9 rotoli',
    fullDescription:
      'Lenzuolino punta a punta 2 veli 50m x 59 cm. Codice GIMA 27428. Prezzo 4,80 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 9 rotoli, solo quantità multiple di 9.',
    price: 4.8,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27428.jpg',
    gimaSku: '27428',
  },
  {
    sku: 'AMS-0076',
    name: 'LENZUOLINO PUNTA A PUNTA 2 VELI 100m x 50 cm',
    fullDescription:
      'Lenzuolino punta a punta 2 veli 100m x 50 cm. Codice GIMA 27427. Prezzo 7,50 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.',
    price: 7.5,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27427.jpg',
    gimaSku: '27427',
  },
  {
    sku: 'AMS-0077',
    name: 'LENZUOLINO 2 VELI - 47,5m x 59 cm',
    fullDescription:
      'Lenzuolino 2 veli 47,5m x 59 cm. Codice GIMA 27411. Prezzo 5,45 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.',
    price: 5.45,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27412.jpg',
    gimaSku: '27411',
  },
  {
    sku: 'AMS-0078',
    name: 'LENZUOLINO POLITENATO GOFFRATO - 50m x 60 cm',
    fullDescription:
      'Lenzuolino politenato goffrato 50m x 60 cm. Codice GIMA 27415. Prezzo 7,15 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.',
    price: 7.15,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27413.jpg',
    gimaSku: '27415',
  },
  {
    sku: 'AMS-0019',
    name: 'SET 4 ELETTRODI PERIFERICI (PINZE)',
    fullDescription: 'SET 4 ELETTRODI PERIFERICI (PINZE)',
    price: 64.0,
    categoryPath: [macroLabelFromId('elettromedicali'), 'Elettromedicali'],
    macroId: 'elettromedicali',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33364.jpeg',
  },
  {
    sku: 'AMS-0020',
    name: 'LENZUOLINO PUNTA A PUNTA 80m x 59 cm',
    fullDescription:
      'Lenzuolino punta a punta 80m x 59 cm. Codice GIMA 27419. Prezzo 7,80 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.',
    price: 7.8,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27419.jpg',
    gimaSku: '27419',
  },
  {
    sku: 'AMS-0021',
    name: 'LENZUOLINO MONOVELO GOFFRATO 95m x 50cm',
    fullDescription:
      'Lenzuolino monovelo goffrato 95m x 50 cm. Codice GIMA 27410. Prezzo 6,70 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.',
    price: 6.7,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Lenzuolini medici / Monouso'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27410.jpg',
    gimaSku: '27410',
  },
  {
    sku: 'AMS-0022',
    name: 'BENDE DI GARZA 3,5 m x 10 cm',
    fullDescription: 'BENDE DI GARZA 3,5 m x 10 cm',
    price: 11.5,
    categoryPath: [macroLabelFromId('emergenza'), 'Consumabili'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/34842.jpg',
  },
  {
    sku: 'AMS-0023',
    name: 'COMPRESSE COTONE STERILI 10x10 cm',
    fullDescription: 'COMPRESSE COTONE STERILI 10x10 cm',
    price: 7.8,
    categoryPath: [macroLabelFromId('emergenza'), 'Consumabili'],
    macroId: 'emergenza',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/35039.jpg',
  },
  {
    sku: 'AMS-0024',
    name: 'ZOCCOLI BIANCHI - senza fori',
    fullDescription: 'ZOCCOLI BIANCHI - senza fori',
    price: 34.0,
    categoryPath: [macroLabelFromId('organizzazione-ausili'), 'Abbigliamento'],
    macroId: 'organizzazione-ausili',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/26319.jpg',
  },
  {
    sku: 'AMS-0025',
    name: 'PANTALONI COTONE - bianchi - M',
    fullDescription: 'PANTALONI COTONE - bianchi - M',
    price: 29.0,
    categoryPath: [macroLabelFromId('organizzazione-ausili'), 'Abbigliamento'],
    macroId: 'organizzazione-ausili',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/26136.jpg',
  },
  {
    sku: 'AMS-0026',
    name: 'CASACCA - unisex - taglia S bianca',
    fullDescription: 'CASACCA - unisex - taglia S bianca',
    price: 31.5,
    categoryPath: [macroLabelFromId('organizzazione-ausili'), 'Abbigliamento'],
    macroId: 'organizzazione-ausili',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/21431-37.jpg',
  },
  {
    sku: 'AMS-0027',
    name: 'DISINFETTANTE SPRAY - 400 ml',
    fullDescription: 'DISINFETTANTE SPRAY - 400 ml',
    price: 16.5,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Disinfezione'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/36620.jpg',
  },
  {
    sku: 'AMS-0028',
    name: 'SALVIETTINE DISINFETTANTI ALLA CLOREXIDINA',
    fullDescription: 'SALVIETTINE DISINFETTANTI ALLA CLOREXIDINA',
    price: 12.9,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Disinfezione'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/36633.jpg',
  },
  {
    sku: 'AMS-0029',
    name: 'AGO CANNULA BD VENFLON 18G 45 mm',
    fullDescription: 'AGO CANNULA BD VENFLON 18G 45 mm',
    price: 4.5,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Consumabili'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23715.jpg',
  },
  {
    sku: 'AMS-0030',
    name: 'MEDICAL SOAP sapone disinfettante - 1L',
    fullDescription: 'MEDICAL SOAP sapone disinfettante - 1L',
    price: 19.8,
    categoryPath: [macroLabelFromId('farmacia-cura'), 'Disinfezione'],
    macroId: 'farmacia-cura',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/36630.jpg',
  },
] as const

export function bucketStaticMedicalProductsByMacro(): Map<string, MedicalProduct[]> {
  const map = new Map<string, MedicalProduct[]>()
  for (const id of medicalMacroIds) map.set(id, [])
  for (const p of ASTRO_MEDICAL_STATIC_CATALOG_SEED) {
    const mid = p.macroId
    if (mid && map.has(mid)) map.get(mid)!.push(p)
  }
  return map
}

export function gimaDepartmentByDeptId(
  deptId: number,
): GimaWebsiteDepartment | undefined {
  return gimaWebsiteDepartments.find((d) => d.deptId === deptId)
}

export function getMacroLabelIt(macroId: string): string | undefined {
  return medicalCatalogByMacro.find((m) => m.macroId === macroId)?.macroLabelIt
}

export const medicalMacroIds: readonly string[] = medicalCatalogByMacro.map(
  (m) => m.macroId,
)
