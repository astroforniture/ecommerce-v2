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
    name: 'ELETTRODI MONOUSO FOAM - adulti',
    fullDescription: 'ELETTRODI MONOUSO FOAM - adulti',
    price: 18.9,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33319.jpg',
  },
  {
    sku: 'AMS-0003',
    name: 'LENZUOLINO 2 VELI - 46m x 50 cm',
    fullDescription: 'LENZUOLINO 2 VELI - 46m x 50 cm',
    price: 24.0,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27416.jpg',
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
    name: 'ELETTRODI PE-FOAM MONOUSO 48-50 mm',
    fullDescription: 'ELETTRODI PE-FOAM MONOUSO 48-50 mm',
    price: 28.5,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33371.jpg',
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
    fullDescription: 'LENZUOLINO PUNTA A PUNTA 80m x 59 cm',
    price: 26.5,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27419.jpg',
  },
  {
    sku: 'AMS-0021',
    name: 'LENZUOLINO MONOVELO GOFFRATO 95m x 50cm',
    fullDescription: 'LENZUOLINO MONOVELO GOFFRATO 95m x 50cm',
    price: 27.0,
    categoryPath: [macroLabelFromId('diagnostica'), 'Consumabili'],
    macroId: 'diagnostica',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27418.jpg',
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
