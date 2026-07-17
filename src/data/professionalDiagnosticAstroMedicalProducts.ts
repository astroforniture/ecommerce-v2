import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Dispositivi diagnostici professionali (listino orientativo Gima / linee Mission, Urilyzer, Combi Screen, ecc.). */
export const PROFESSIONAL_DIAGNOSTIC_OFFICE_ID_PREFIX = 'AF-DIAG-'

let professionalDiagnosticGimaIdSet: ReadonlySet<string> | null = null

export function isProfessionalDiagnosticOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  professionalDiagnosticGimaIdSet ??= new Set(
    buildProfessionalDiagnosticAstroMedicalOfficeProducts().map((p) => p.id),
  )
  return professionalDiagnosticGimaIdSet.has(s)
}

type DiagRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  /** Se assente, in vetrina office vale «Diagnostica professionale». */
  subcategory?: string
  /**
   * Id `OfficeProduct` esplicito quando più articoli condividono lo stesso asset GIMA
   * (stesso `imageUrl` → stesso stem) e serve uno slug univoco per cache e PDP.
   */
  officeIdOverride?: string
}

const P = PROFESSIONAL_DIAGNOSTIC_OFFICE_ID_PREFIX

/** Solo `www.gimaitaly.com`; `file` es. `24128.jpg` (codice listino / asset sito). */
function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const DIAG_CATALOG: readonly DiagRow[] = [
  {
    slug: 'mission-pt-inr',
    name: 'Sistema Mission PT/INR (coagulazione)',
    brand: 'Mission',
    priceImponible: 720,
    imageUrl: gimaMedium('33314.jpg'),
    description:
      'Sistema professionale Mission per monitoraggio PT/INR in ambiente clinico o ambulatoriale. ' +
      'Utilizzare strisce dedicate e accessori compatibili; calibrazione e manutenzione secondo manuale produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'mission-pt-strisce-standard',
    name: 'Strisce Mission PT (confezione standard)',
    brand: 'Mission',
    priceImponible: 127,
    imageUrl: gimaMedium('33315.jpg'),
    description:
      'Strisce reattive Mission per sistema PT/INR; confezione standard. Solo per analizzatori compatibili della stessa linea. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'mission-pt-strisce-pro',
    name: 'Strisce Mission PT (confezione professionale)',
    brand: 'Mission',
    priceImponible: 402,
    imageUrl: gimaMedium('33316.jpg'),
    description:
      'Strisce reattive Mission per PT/INR, formato professionale ad alto utilizzo. Abbinare all’analizzatore Mission PT/INR. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'mission-stampante',
    name: 'Stampante Mission per sistema coagulazione',
    brand: 'Mission',
    priceImponible: 318,
    imageUrl: gimaMedium('25590.jpg'),
    description:
      'Stampante dedicata per documentazione risultati su sistemi Mission coagulazione ove previsto dalla configurazione. ' +
      'Verificare compatibilità con il proprio analizzatore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'colesterolo-analizzatore',
    name: 'Analizzatore colesterolo professionale',
    brand: 'Gima',
    priceImponible: 240,
    imageUrl: gimaMedium('27640.jpg'),
    description:
      'Analizzatore per dosaggi lipidici in punto di cura; richiede pannelli o test compatibili indicati dal produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'colesterolo-pannello-esteso',
    name: 'Pannello lipidico esteso (analizzatore colesterolo)',
    brand: 'Gima',
    priceImponible: 114,
    imageUrl: gimaMedium('27641.jpg'),
    description:
      'Pannello reattivo per profilo lipidico esteso su analizzatore dedicato. Non intercambiabile tra strumenti non omologati. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'colesterolo-pannello-base',
    name: 'Pannello lipidico base (analizzatore colesterolo)',
    brand: 'Gima',
    priceImponible: 26,
    imageUrl: gimaMedium('27642.jpg'),
    description:
      'Pannello reattivo base per analisi lipidiche su analizzatore colesterolo compatibile. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'colesterolo-test-totale',
    name: 'Test colesterolo totale (analizzatore dedicato)',
    brand: 'Gima',
    priceImponible: 76,
    imageUrl: gimaMedium('27643.jpg'),
    description:
      'Test singolo per colesterolo totale su piattaforma compatibile con analizzatore colesterolo professionale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'lactate-scout-4',
    name: 'Lactate Scout 4',
    brand: 'Gima',
    priceImponible: 741,
    imageUrl: gimaMedium('27412.jpg'),
    description:
      'Analizzatore portatile Lactate Scout 4 per lactato ematico in ambito sportivo o clinico secondo indicazioni d’uso. ' +
      'Richiede strisce dedicate. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'lactate-strisce',
    name: 'Strisce Lactate Scout (ricarica)',
    brand: 'Gima',
    priceImponible: 123,
    imageUrl: gimaMedium('27644.jpg'),
    description:
      'Strisce per misurazione lactato su Lactate Scout 4; conservazione e scadenza come da confezione. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'hemo-control',
    name: 'Hemo Control (analisi ematiche)',
    brand: 'Gima',
    priceImponible: 910,
    imageUrl: gimaMedium('31800.jpg'),
    description:
      'Sistema Hemo Control per controlli ematologici secondo configurazione commerciale; microcuvette dedicate. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'hemo-microcuvette',
    name: 'Microcuvette Hemo Control',
    brand: 'Gima',
    priceImponible: 80,
    imageUrl: gimaMedium('31801.jpg'),
    description:
      'Microcuvette monouso per Hemo Control; esclusivamente compatibili con lo strumento omonimo. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'emoglobina-sistema',
    name: 'Sistema misurazione emoglobina',
    brand: 'Gima',
    priceImponible: 194,
    imageUrl: gimaMedium('32000.jpg'),
    description:
      'Dispositivo per determinazione emoglobina in campo o ambulatorio; modalità campione e accessori secondo scheda tecnica. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'analisi-urina-gima',
    name: 'Analizzatore analisi urina Gima',
    brand: 'Gima',
    priceImponible: 285,
    imageUrl: gimaMedium('32100.jpg'),
    description:
      'Piattaforma per screening urinario con strisce compatibili; ad uso professionale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'urilyzer-100',
    name: 'Urilyzer 100',
    brand: 'Gima',
    priceImponible: 898,
    imageUrl: gimaMedium('32200.jpg'),
    description:
      'Analizzatore urinario Urilyzer 100 per laboratorio leggero o ambulatorio; compatibile con strisce dedicate e linea Combi Screen ove applicabile. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'urilyzer-500',
    name: 'Urilyzer 500',
    brand: 'Gima',
    priceImponible: 3690,
    imageUrl: gimaMedium('32300.jpg'),
    description:
      'Analizzatore urinario avanzato Urilyzer 500 per alto volume; strisce e moduli secondo configurazione Gima. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-2p',
    name: 'Strisce Combi Screen — 2 parametri (10 pz)',
    brand: 'Gima',
    priceImponible: 10.4,
    imageUrl: gimaMedium('32410.jpg'),
    description:
      'Strisce urinarie Combi Screen, 2 parametri, confezione 10 test. Per strumenti compatibili (es. linea analisi urina / Urilyzer). ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-5p',
    name: 'Strisce Combi Screen — 5 parametri',
    brand: 'Gima',
    priceImponible: 24,
    imageUrl: gimaMedium('32411.jpg'),
    description:
      'Strisce Combi Screen multiparametriche (5 parametri). Verificare compatibilità con analizzatore in uso. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-8p',
    name: 'Strisce Combi Screen — 8 parametri',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('32412.jpg'),
    description:
      'Strisce Combi Screen 8 parametri per screening urinario esteso. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-10p',
    name: 'Strisce Combi Screen — 10 parametri',
    brand: 'Gima',
    priceImponible: 72,
    imageUrl: gimaMedium('32413.jpg'),
    description:
      'Strisce Combi Screen 10 parametri; utilizzo professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-11p',
    name: 'Strisce Combi Screen — 11 parametri',
    brand: 'Gima',
    priceImponible: 95,
    imageUrl: gimaMedium('32414.jpg'),
    description:
      'Strisce Combi Screen 11 parametri. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'combi-screen-13p',
    name: 'Strisce Combi Screen — 13 parametri',
    brand: 'Gima',
    priceImponible: 127,
    imageUrl: gimaMedium('32415.jpg'),
    description:
      'Strisce Combi Screen 13 parametri, massima copertura urinaria della linea. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'immuno-analizzatore',
    name: 'Analizzatore immunologico',
    brand: 'Gima',
    priceImponible: 1250,
    imageUrl: gimaMedium('33200.jpg'),
    description:
      'Piattaforma immunologica per test in cassetta (marcatori infettivologici, cardiaci, vitamine, ecc.) secondo kit omologati. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-pcr',
    name: 'Test in cassetta — PCR (compatibile analizzatore immunologico)',
    brand: 'Gima',
    priceImponible: 45,
    imageUrl: gimaMedium('33201.jpg'),
    description:
      'Test molecolare in cassetta per uso su analizzatore immunologico compatibile; interpretazione secondo IFU. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-troponina',
    name: 'Test in cassetta — Troponina',
    brand: 'Gima',
    priceImponible: 55,
    imageUrl: gimaMedium('33203.jpg'),
    description:
      'Test rapido troponina su piattaforma a cassetta compatibile con analizzatore immunologico dedicato. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-covid',
    name: 'Test in cassetta — COVID-19 Ag',
    brand: 'Gima',
    priceImponible: 35,
    imageUrl: gimaMedium('33206.jpg'),
    description:
      'Test antigenico COVID-19 in cassetta per lettura su strumento compatibile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-vitamina-d',
    name: 'Test in cassetta — Vitamina D',
    brand: 'Gima',
    priceImponible: 42,
    imageUrl: gimaMedium('33208.jpg'),
    description:
      'Dosaggio vitamina D su test in cassetta per analizzatore immunologico compatibile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-d-dimero',
    name: 'Test in cassetta — D-Dimero',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('33209.jpg'),
    description:
      'Test D-Dimero in cassetta; utilizzo con analizzatore immunologico della stessa linea. Prezzo unitario imponibile IVA esclusa.',
  },
]

/** Listino finale: GimaCare, self-test, analizzatore 24600, tossicologia, salute donna, veterinaria. */
const DIAG_FINAL_CATALOG: readonly DiagRow[] = [
  {
    slug: 'gimacare-monitor-24128',
    name: 'GimaCare — Monitor multiparametrico (ref. 24128)',
    brand: 'Gima',
    priceImponible: 98,
    imageUrl: gimaMedium('24128.jpg'),
    description:
      'Monitor multiparametrico GimaCare per lettura strisce dedicate (glucosio, chetoni, lattato, colesterolo, acido urico, emoglobina) ' +
      'e soluzioni di controllo omologate. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-glucosio',
    name: 'GimaCare — Strisce glucosio (monitor 24128)',
    brand: 'Gima',
    priceImponible: 22.5,
    imageUrl: gimaMedium('24132.jpg'),
    description:
      'Strisce reattive glucosio per monitor GimaCare 24128; uso professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-chetone',
    name: 'GimaCare — Strisce chetoni (monitor 24128)',
    brand: 'Gima',
    priceImponible: 24,
    imageUrl: gimaMedium('24133.jpg'),
    description: 'Strisce chetoni compatibili monitor GimaCare 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-lattato',
    name: 'GimaCare — Strisce lattato (monitor 24128)',
    brand: 'Gima',
    priceImponible: 28,
    imageUrl: gimaMedium('24134.jpg'),
    description: 'Strisce lattato per monitor GimaCare 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-colesterolo',
    name: 'GimaCare — Strisce colesterolo (monitor 24128)',
    brand: 'Gima',
    priceImponible: 31,
    imageUrl: gimaMedium('24135.jpg'),
    description: 'Strisce colesterolo per monitor GimaCare 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-acido-urico',
    name: 'GimaCare — Strisce acido urico (monitor 24128)',
    brand: 'Gima',
    priceImponible: 26,
    imageUrl: gimaMedium('24136.jpg'),
    description: 'Strisce acido urico per monitor GimaCare 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-striscia-emoglobina',
    name: 'GimaCare — Strisce emoglobina (monitor 24128)',
    brand: 'Gima',
    priceImponible: 29,
    imageUrl: gimaMedium('24137.jpg'),
    description: 'Strisce emoglobina per monitor GimaCare 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-soluzione-controllo-l1',
    name: 'GimaCare — Soluzione di controllo livello 1',
    brand: 'Gima',
    priceImponible: 18,
    imageUrl: gimaMedium('24147.jpg'),
    description: 'Soluzione di controllo livello 1 per linea GimaCare / monitor 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gimacare-soluzione-controllo-l2',
    name: 'GimaCare — Soluzione di controllo livello 2',
    brand: 'Gima',
    priceImponible: 18,
    imageUrl: gimaMedium('24148.jpg'),
    description: 'Soluzione di controllo livello 2 per linea GimaCare / monitor 24128. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'h-pylori-self',
    name: 'Test Helicobacter pylori — Self (autodiagnostica)',
    brand: 'Gima',
    priceImponible: 5.45,
    imageUrl: gimaMedium('35010.jpg'),
    description: 'Test rapido H. pylori per uso self; seguire IFU. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'h-pylori-professionale',
    name: 'Test Helicobacter pylori — Professionale',
    brand: 'Gima',
    priceImponible: 51,
    imageUrl: gimaMedium('35011.jpg'),
    description: 'Test H. pylori professionale; lettura secondo protocollo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'covid-antigene-rapido',
    name: 'COVID-19 — Test antigene rapido',
    brand: 'Gima',
    priceImponible: 8.5,
    imageUrl: gimaMedium('35012.jpg'),
    description: 'Test antigenico COVID-19; linea self e professionale secondo confezione. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'covid-salivare',
    name: 'COVID-19 — Test salivare',
    brand: 'Gima',
    priceImponible: 12,
    imageUrl: gimaMedium('35024.jpg'),
    description: 'Test COVID-19 su campione salivare ove disponibile in listino. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'covid-professionale',
    name: 'COVID-19 — Test professionale',
    brand: 'Gima',
    priceImponible: 42,
    imageUrl: gimaMedium('35025.jpg'),
    description: 'Test COVID-19 uso professionale / laboratorio leggero. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'strep-a-striscia',
    name: 'Streptococco A — Test striscia',
    brand: 'Gima',
    priceImponible: 6.9,
    imageUrl: gimaMedium('35026.jpg'),
    description: 'Test rapido Strep-A su striscia. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'strep-a-cassetta',
    name: 'Streptococco A — Test cassetta',
    brand: 'Gima',
    priceImponible: 28,
    imageUrl: gimaMedium('35027.jpg'),
    description: 'Test rapido Strep-A in cassetta. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'marker-cardiaco',
    name: 'Diagnostica avanzata — Marker cardiaco',
    brand: 'Gima',
    priceImponible: 276,
    imageUrl: gimaMedium('35028.jpg'),
    description: 'Dosaggio marcatore cardiaco secondo kit omologato; uso professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'proteina-c-reattiva',
    name: 'Diagnostica avanzata — Proteina C reattiva (PCR)',
    brand: 'Gima',
    priceImponible: 142,
    imageUrl: gimaMedium('35029.jpg'),
    description: 'Test proteina C reattiva; listino Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'test-fob',
    name: 'Diagnostica avanzata — Test FOB (occulto)',
    brand: 'Gima',
    priceImponible: 41,
    imageUrl: gimaMedium('35035.jpg'),
    description: 'Test sangue occulto feci (FOB). Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'malaria-rapido',
    name: 'Diagnostica avanzata — Malaria (test rapido)',
    brand: 'Gima',
    priceImponible: 52,
    imageUrl: gimaMedium('35100.jpg'),
    description: 'Test rapido malaria; uso professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'analizzatore-24600',
    name: 'Analizzatore 24600 (lettura cassette)',
    brand: 'Gima',
    priceImponible: 2460,
    imageUrl: gimaMedium('24600.jpg'),
    description:
      'Analizzatore codice 24600 per cassette dedicate (PCR, procalcitonina, D-dimero, Influenza A/B, RSV, vitamina D, ecc.). ' +
      'Listino imponibile IVA esclusa; configurazione commerciale da confermare con Gima.',
  },
  {
    slug: 'cassette-24600-pcr',
    name: 'Cassetta 24600 — PCR',
    brand: 'Gima',
    priceImponible: 68,
    imageUrl: gimaMedium('24605.jpg'),
    description: 'Cassetta per analizzatore 24600 — profilo PCR. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-24600-procalcitonina',
    name: 'Cassetta 24600 — Procalcitonina',
    brand: 'Gima',
    priceImponible: 72,
    imageUrl: gimaMedium('24606.jpg'),
    description: 'Cassetta procalcitonina per analizzatore 24600. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-24600-d-dimero',
    name: 'Cassetta 24600 — D-Dimero',
    brand: 'Gima',
    priceImponible: 58,
    imageUrl: gimaMedium('24608.jpg'),
    description: 'Cassetta D-dimero per analizzatore 24600. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-24600-influenza-ab',
    name: 'Cassetta 24600 — Influenza A/B',
    brand: 'Gima',
    priceImponible: 64,
    imageUrl: gimaMedium('24610.jpg'),
    description: 'Cassetta Influenza A/B per analizzatore 24600. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-24600-rsv',
    name: 'Cassetta 24600 — RSV',
    brand: 'Gima',
    priceImponible: 61,
    imageUrl: gimaMedium('24612.jpg'),
    description: 'Cassetta RSV per analizzatore 24600. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cassette-24600-vitamina-d',
    name: 'Cassetta 24600 — Vitamina D',
    brand: 'Gima',
    priceImponible: 55,
    imageUrl: gimaMedium('24614.jpg'),
    description: 'Cassetta vitamina D per analizzatore 24600. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'test-gravidanza-singolo',
    name: 'Salute donna — Test gravidanza (singolo)',
    brand: 'Gima',
    priceImponible: 3.2,
    imageUrl: gimaMedium('35200.jpg'),
    description: 'Test di gravidanza singolo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'test-gravidanza-doppio',
    name: 'Salute donna — Test gravidanza (doppio)',
    brand: 'Gima',
    priceImponible: 5.8,
    imageUrl: gimaMedium('35202.jpg'),
    description: 'Test di gravidanza doppia sensibilità. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'ph-vaginale',
    name: 'Salute donna — Test pH vaginale',
    brand: 'Gima',
    priceImponible: 11.5,
    imageUrl: gimaMedium('35205.jpg'),
    description: 'Test pH vaginale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'vaginite-multiplo',
    name: 'Salute donna — Vaginite (pannello multiplo)',
    brand: 'Gima',
    priceImponible: 18,
    imageUrl: gimaMedium('35213.jpg'),
    description: 'Test vaginite multiparametrico. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'clamidia-rapido',
    name: 'Salute donna — Clamidia (test rapido)',
    brand: 'Gima',
    priceImponible: 22,
    imageUrl: gimaMedium('35215.jpg'),
    description: 'Test rapido Clamidia. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'multitest-urine-7',
    name: 'Tossicologia — Multitest urine 7 droghe',
    brand: 'Gima',
    priceImponible: 22,
    imageUrl: gimaMedium('35216.jpg'),
    description: 'Screening urine 7 analiti; uso professionale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'multitest-urine-10',
    name: 'Tossicologia — Multitest urine 10 droghe',
    brand: 'Gima',
    priceImponible: 34,
    imageUrl: gimaMedium('35221.jpg'),
    description: 'Screening urine 10 analiti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'multitest-urine-16',
    name: 'Tossicologia — Multitest urine 16 droghe',
    brand: 'Gima',
    priceImponible: 58,
    imageUrl: gimaMedium('35222.jpg'),
    description: 'Screening urine 16 analiti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'drug-reader-24561',
    name: 'Drug Reader 24561 (apparecchio lettura cup)',
    brand: 'Gima',
    priceImponible: 845,
    imageUrl: gimaMedium('24561.jpg'),
    description:
      'Apparecchio Drug Reader codice 24561 per lettura cup test dedicati; listino Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cup-test-24561-5',
    name: 'Cup test 24561 — pannello 5 sostanze',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('24562.jpg'),
    description: 'Cup test compatibile Drug Reader 24561 — 5 analiti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'cup-test-24561-10',
    name: 'Cup test 24561 — pannello 10 sostanze',
    brand: 'Gima',
    priceImponible: 76,
    imageUrl: gimaMedium('24563.jpg'),
    description: 'Cup test compatibile Drug Reader 24561 — 10 analiti. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'test-salivare-6dro-alcol',
    name: 'Tossicologia — Test salivare 6 droghe + alcol',
    brand: 'Gima',
    priceImponible: 29,
    imageUrl: gimaMedium('35306.jpg'),
    description: 'Test salivare multipanel 6 droghe e alcol. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'test-alcolimetrico',
    name: 'Tossicologia — Test alcolimetrico',
    brand: 'Gima',
    priceImponible: 38,
    imageUrl: gimaMedium('35307.jpg'),
    description: 'Test / rilevazione alcolimetrica secondo confezione. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'strisce-urina-vet-11p',
    name: 'Veterinaria — Strisce urina 11 parametri',
    brand: 'Gima',
    priceImponible: 32,
    imageUrl: gimaMedium('35400.jpg'),
    description: 'Strisce urinarie veterinarie 11 parametri. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'termometro-digitale-gima-ampio-schermo-scatola',
    name: 'TERMOMETRO DIGITALE GIMA AMPIO SCHERMO - scatola',
    brand: 'Gima',
    priceImponible: 9.5,
    imageUrl: gimaMedium('25552.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale Gima con display ampio, confezione scatola. Uso domestico o ambulatoriale leggero; ' +
      'seguire istruzioni del produttore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'termometro-digitale-gima-bl1-ampio-schermo-scatola',
    name: 'TERMOMETRO DIGITALE GIMA BL1 AMPIO SCHERMO - scatola',
    brand: 'Gima',
    priceImponible: 8.9,
    imageUrl: gimaMedium('25553.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale Gima modello BL1, display ampio, confezione scatola. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'termometro-digitale-gima-bl3-ampio-schermo-c',
    name: 'TERMOMETRO DIGITALE BL3 AMPIO SCHERMO °C',
    brand: 'Gima',
    priceImponible: 8.6,
    imageUrl: gimaMedium('25554.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale BL3 con display ampio, lettura in gradi Celsius. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25556',
    name: 'TERMOMETRO DIGITALE GIMA',
    brand: 'Gima',
    priceImponible: 9.4,
    imageUrl: gimaMedium('25556.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale Gima; uso secondo istruzioni del produttore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25558',
    name: 'TERMOMETRO DIGITALE JUMBO °C - rettale',
    brand: 'Gima',
    priceImponible: 8.2,
    imageUrl: gimaMedium('25558.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale Jumbo, misura rettale, lettura in °C. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25559',
    name: 'TERMOMETRO DIGITALE °C in espositore',
    brand: 'Gima',
    priceImponible: 129,
    imageUrl: gimaMedium('25559.jpg'),
    subcategory: 'Termometria',
    description:
      'Termometro digitale in °C in formato espositore per punto vendita o ambulatorio. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25300',
    name: 'CEROTTI CLASSICI 7x2cm',
    brand: 'Gima',
    priceImponible: 13.8,
    imageUrl: gimaMedium('25300.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti classici 7×2 cm; medicazione quotidiana. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25301',
    name: 'CEROTTI CLASSICI ASSORTITI 5 misure',
    brand: 'Gima',
    priceImponible: 17.5,
    imageUrl: gimaMedium('25301.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti classici assortiti in 5 misure. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25302',
    name: 'CEROTTI CLASSICI ASSORTITI 6 misure',
    brand: 'Gima',
    priceImponible: 48,
    imageUrl: gimaMedium('25302.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti classici assortiti in 6 misure. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25307',
    name: 'CEROTTI TNT ASSORTITI 2 misure',
    brand: 'Gima',
    priceImponible: 21,
    imageUrl: gimaMedium('25307.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti in TNT assortiti in 2 misure. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25310',
    name: 'CEROTTI TATOO 2 misure',
    brand: 'Gima',
    priceImponible: 21,
    imageUrl: gimaMedium('25310.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti Tatoo in 2 misure. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25312',
    name: 'CEROTTI PREMIUM',
    brand: 'Gima',
    priceImponible: 19.9,
    imageUrl: gimaMedium('25312.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti linea premium. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25314',
    name: 'CEROTTI PER MANI 3 misure',
    brand: 'Gima',
    priceImponible: 19.9,
    imageUrl: gimaMedium('25314.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti per mani in 3 misure. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25316',
    name: 'HERPES PATCH',
    brand: 'Gima',
    priceImponible: 35.5,
    imageUrl: gimaMedium('25316.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Herpes patch secondo confezione e indicazioni del produttore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25318',
    name: 'CEROTTI NASALI',
    brand: 'Gima',
    priceImponible: 24.8,
    imageUrl: gimaMedium('25318.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotti nasali. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25320',
    name: 'CEROTTO A STRISCIA 100x6cm',
    brand: 'Gima',
    priceImponible: 18,
    imageUrl: gimaMedium('25320.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Cerotto a striscia 100×6 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25322',
    name: 'ROCCHETTO CEROTTO TELA',
    brand: 'Gima',
    priceImponible: 33,
    imageUrl: gimaMedium('25322.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Rocchetto cerotto in tela. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25324',
    name: 'ROCCHETTO CEROTTO TNT',
    brand: 'Gima',
    priceImponible: 19.2,
    imageUrl: gimaMedium('25324.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Rocchetto cerotto in TNT. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25330',
    name: 'COMPRESSE DI GARZA 18x40cm',
    brand: 'Gima',
    priceImponible: 24.3,
    imageUrl: gimaMedium('25330.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Compresse di garza 18×40 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25332',
    name: 'BENDA ELASTICA 4m x 6cm',
    brand: 'Gima',
    priceImponible: 11.5,
    imageUrl: gimaMedium('25332.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Benda elastica 4 m × 6 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25335',
    name: 'KIT PRONTO SOCCORSO',
    brand: 'Gima',
    priceImponible: 44,
    imageUrl: gimaMedium('25335.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Kit pronto soccorso; contenuto come da confezione Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25337',
    name: 'BENDA COESIVA ELASTICA',
    brand: 'Gima',
    priceImponible: 22.4,
    imageUrl: gimaMedium('25337.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Benda coesiva elastica; uso secondo indicazioni. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25350',
    name: 'PARACALLI DISCO CENTRALE',
    brand: 'Gima',
    priceImponible: 14.3,
    imageUrl: gimaMedium('25350.jpg'),
    subcategory: 'Medicazione e primo soccorso',
    description:
      'Paracalli a disco centrale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25721',
    name: 'LACCIO EMOSTATICO GIMA velcro',
    brand: 'Gima',
    priceImponible: 2.1,
    imageUrl: gimaMedium('25721.jpg'),
    subcategory: 'Emergenza e emostasi',
    description:
      'Laccio emostatico Gima con chiusura a velcro; uso professionale secondo protocollo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25722',
    name: 'LACCIO EMOSTATICO JETPULL 2° - con fermo',
    brand: 'Gima',
    priceImponible: 8.3,
    imageUrl: gimaMedium('25722.jpg'),
    subcategory: 'Emergenza e emostasi',
    description:
      'Laccio emostatico Jetpull 2° con fermo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25723',
    name: 'LACCIO EMOSTATICO JETPULL 2° - senza lattice',
    brand: 'Gima',
    priceImponible: 9.9,
    imageUrl: gimaMedium('25723.jpg'),
    subcategory: 'Emergenza e emostasi',
    description:
      'Laccio emostatico Jetpull 2° senza lattice. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20695',
    name: 'GISAFE MASCHERINA TIPO IIR - azzurra',
    brand: 'Gima',
    priceImponible: 0.99,
    imageUrl: gimaMedium('20695.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina chirurgica tipo IIR Gisafe, colore azzurro, confezione flowpack. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20697',
    name: 'GISAFE MASCHERINA TIPO IIR - rosa',
    brand: 'Gima',
    priceImponible: 4,
    imageUrl: gimaMedium('20697.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina tipo IIR Gisafe, rosa, in scatola. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20699',
    name: 'GISAFE MASCHERINA TIPO IIR - verde chiaro - scatola',
    brand: 'Gima',
    priceImponible: 3.4,
    imageUrl: gimaMedium('20699.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina tipo IIR Gisafe, verde chiaro, in scatola. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20701',
    name: 'GISAFE MASCHERINA TIPO IIR - nera - scatola',
    brand: 'Gima',
    priceImponible: 5.25,
    imageUrl: gimaMedium('20701.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina tipo IIR Gisafe, nera, in scatola. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20703',
    name: 'MASCHERINA CHIRURGICA 4 VELI - verde con lacci',
    brand: 'Gima',
    priceImponible: 71.5,
    imageUrl: gimaMedium('20703.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina chirurgica a 4 veli, verde, con lacci. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20715',
    name: '3M AURA 1862+ MASCHERINA FFP2 IIR',
    brand: '3M',
    priceImponible: 86,
    imageUrl: gimaMedium('20715.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina pieghevole 3M Aura 1862+ FFP2 con prestazioni IIR secondo scheda produttore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20732',
    name: 'MASCHERINA FFP2 - bianca - Multi-lingua 1',
    brand: 'Gima',
    priceImponible: 4.9,
    imageUrl: gimaMedium('20732.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina FFP2 bianca, versione multilingua 1. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20733',
    name: 'MASCHERINA FFP2 - bianca - Multi-lingua 2',
    brand: 'Gima',
    priceImponible: 4.55,
    imageUrl: gimaMedium('20733.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Mascherina FFP2 bianca, versione multilingua 2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25636',
    name: 'MASKOP con visiera avvolgente - elastici',
    brand: 'Gima',
    priceImponible: 33,
    imageUrl: gimaMedium('25636.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Maschera con visiera avvolgente Maskop, fissaggio con elastici. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25637',
    name: 'MASKOP con visiera avvolgente - lacci',
    brand: 'Gima',
    priceImponible: 33,
    imageUrl: gimaMedium('25637.jpg'),
    subcategory: 'DPI vie respiratorie',
    description:
      'Maschera con visiera avvolgente Maskop, fissaggio con lacci. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25257',
    name: 'OCCHIALI X5-PRO - blu',
    brand: 'Gima',
    priceImponible: 4.2,
    imageUrl: gimaMedium('25257.jpg'),
    subcategory: 'Protezione oculare',
    description:
      'Occhiali di protezione X5-PRO, montatura blu. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25258',
    name: 'OCCHIALI X5-PRO - neri',
    brand: 'Gima',
    priceImponible: 110,
    imageUrl: gimaMedium('25258.jpg'),
    subcategory: 'Protezione oculare',
    description:
      'Occhiali di protezione X5-PRO, montatura nera. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25260',
    name: 'OCCHIALI 505UP',
    brand: 'Gima',
    priceImponible: 8,
    imageUrl: gimaMedium('25260.jpg'),
    subcategory: 'Protezione oculare',
    description:
      'Occhiali di protezione 505UP. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25660',
    name: 'OCCHIALI POLYSAFE MEDICAL',
    brand: 'Gima',
    priceImponible: 5.1,
    imageUrl: gimaMedium('25660.jpg'),
    subcategory: 'Protezione oculare',
    description:
      'Occhiali Polysafe Medical. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-20500',
    name: 'FORBICI PER BENDE con clip - 14 cm',
    brand: 'Gima',
    priceImponible: 7.5,
    imageUrl: gimaMedium('20500.jpg'),
    subcategory: 'Strumentario',
    description:
      'Forbici per bende con clip, lunghezza 14 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25879',
    name: 'TRAVELJOHN WC PORTATILE IN CARTA',
    brand: 'Gima',
    priceImponible: 10.8,
    imageUrl: gimaMedium('25879.jpg'),
    subcategory: 'Ausili e sanitaria',
    description:
      'WC portatile TravelJohn in carta; uso da campo o emergenza secondo istruzioni. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25880',
    name: 'TRAVELJOHN WC PORTATILE',
    brand: 'Gima',
    priceImponible: 11.25,
    imageUrl: gimaMedium('25880.jpg'),
    subcategory: 'Ausili e sanitaria',
    description:
      'WC portatile TravelJohn. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25958',
    name: 'CONTENITORE URINE 120 ml - bulk',
    brand: 'Gima',
    priceImponible: 41.5,
    imageUrl: gimaMedium('25958.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Contenitore per urine 120 ml, formato bulk. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25960-1',
    name: 'CONTENITORE URINE 60 ml - ISO8',
    brand: 'Gima',
    priceImponible: 71,
    imageUrl: gimaMedium('25960-1.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Contenitore per urine 60 ml, classe ISO8 secondo scheda. Prezzo unitario imponibile IVA esclusa.',
  },
  /* Blocco listino GIMA: contenitori / sacche / maternità / rifiuti. Per varianti coperchio con stesso JPG usare `officeIdOverride`. */
  {
    slug: 'gima-25962-63-iso8',
    officeIdOverride: 'gima-25962-63-iso8',
    name: 'CONTENITORE URINE 120 ml - ISO8',
    brand: 'Gima',
    priceImponible: 37,
    imageUrl: gimaMedium('25962-63.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Contenitore per raccolta urine 120 ml, classe ISO8 secondo indicazioni Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25962-63-sterile',
    officeIdOverride: 'gima-25962-63-sterile',
    name: 'CONTENITORE URINE 120 ml - sterile',
    brand: 'Gima',
    priceImponible: 54,
    imageUrl: gimaMedium('25962-63.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Contenitore per urine 120 ml sterile; uso secondo protocollo e IFU. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25965-66',
    name: 'CONTENITORE FECI 30 ml - ISO8',
    brand: 'Gima',
    priceImponible: 71,
    imageUrl: gimaMedium('25965-66.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Contenitore per campioni feci 30 ml, classe ISO8. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25975',
    name: 'PROVETTA SOTTOVUOTO URINE 10 ml',
    brand: 'Gima',
    priceImponible: 43,
    imageUrl: gimaMedium('25975.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Provetta sottovuoto per urine 10 ml; utilizzo da laboratorio secondo istruzioni. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28685',
    name: 'SACCA URINE PEDIATRICA 100 ml',
    brand: 'Gima',
    priceImponible: 14,
    imageUrl: gimaMedium('28685.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Sacca urinaria pediatrica 100 ml; fissaggio e valvola come da confezione. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-28693',
    name: 'SACCA URINE 2000 cc - 130 cm+valvola',
    brand: 'Gima',
    priceImponible: 18.2,
    imageUrl: gimaMedium('28693.jpg'),
    subcategory: 'Laboratorio e campioni',
    description:
      'Sacca urinaria 2000 cc, tubo 130 cm con valvola; uso ospedaliero o domiciliare secondo protocollo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-41700',
    name: 'TIRALATTE MANUALE',
    brand: 'Gima',
    priceImponible: 19.3,
    imageUrl: gimaMedium('41700.jpg'),
    subcategory: 'Maternità e specialistica',
    description:
      'Tiralatte manuale; modalità d’uso e manutenzione secondo istruzioni in confezione. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-41701',
    name: 'TIRALATTE ELETTRICO',
    brand: 'Gima',
    priceImponible: 61.6,
    imageUrl: gimaMedium('41701.jpg'),
    subcategory: 'Maternità e specialistica',
    description:
      'Tiralatte elettrico; alimentazione e ricambi come da kit produttore. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25836',
    name: 'SCHIZZETTONE SCHIMMELBUSCH 100 CC - metallo',
    brand: 'Gima',
    priceImponible: 122,
    imageUrl: gimaMedium('25836.jpg'),
    subcategory: 'Maternità e specialistica',
    description:
      'Schizzettone Schimmelbusch 100 cc in metallo; uso professionale secondo protocollo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25859',
    name: 'KIT IRRIGAZIONE AURICOLARE OTOCLEAR',
    brand: 'Gima',
    priceImponible: 126,
    imageUrl: gimaMedium('25859.jpg'),
    subcategory: 'Maternità e specialistica',
    description:
      'Kit irrigazione auricolare Otoclear; componenti monouso ove previsto dalla confezione. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25774',
    name: 'CONTENITORE RIFIUTI 30 litri',
    brand: 'Gima',
    priceImponible: 9.6,
    imageUrl: gimaMedium('25774.jpg'),
    subcategory: 'Smaltimento rifiuti speciali',
    description:
      'Contenitore per rifiuti speciali 30 litri; conformità e smaltimento secondo normativa locale. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25778',
    name: 'CONTENITORE RIFIUTI 60 litri',
    brand: 'Gima',
    priceImponible: 14,
    imageUrl: gimaMedium('25778.jpg'),
    subcategory: 'Smaltimento rifiuti speciali',
    description:
      'Contenitore per rifiuti speciali 60 litri; capienza e chiusura come da scheda Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25780',
    name: 'CONTENITORE TAGLIENTI POCKET',
    brand: 'Gima',
    priceImponible: 295,
    imageUrl: gimaMedium('25780.jpg'),
    subcategory: 'Smaltimento rifiuti speciali',
    description:
      'Contenitore per taglienti linea Pocket; uso sicuro secondo IFU. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-25784',
    name: 'CONTENITORE TAGLIENTI LINEA CS - 4 litri',
    brand: 'Gima',
    priceImponible: 125,
    imageUrl: gimaMedium('25784.jpg'),
    subcategory: 'Smaltimento rifiuti speciali',
    description:
      'Contenitore per taglienti linea CS 4 litri; compatibile con protocolli di smaltimento taglienti. Prezzo unitario imponibile IVA esclusa.',
  },
]

const ALL_DIAG_ROWS: readonly DiagRow[] = [...DIAG_CATALOG, ...DIAG_FINAL_CATALOG]

function diagnosticRowForSlug(slug: string): DiagRow {
  const row = ALL_DIAG_ROWS.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown diagnostic catalog slug: ${slug}`)
  return row
}

function diagnosticGimaIdForSlug(slug: string): string {
  const row = diagnosticRowForSlug(slug)
  return (
    row.officeIdOverride ??
    gimaOfficeProductIdFromImageUrl(row.imageUrl) ??
    `${P}${slug}`
  )
}

export function diagnosticCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    const slug = raw.slice(P.length)
    return diagnosticGimaIdForSlug(slug)
  }
  return raw
}


const MISSION_ANALYZER = diagnosticGimaIdForSlug('mission-pt-inr')
const MISSION_STR_STD = diagnosticGimaIdForSlug('mission-pt-strisce-standard')
const MISSION_STR_PRO = diagnosticGimaIdForSlug('mission-pt-strisce-pro')
const MISSION_PRINT = diagnosticGimaIdForSlug('mission-stampante')
const CHOL_MAIN = diagnosticGimaIdForSlug('colesterolo-analizzatore')
const CHOL_EXT = diagnosticGimaIdForSlug('colesterolo-pannello-esteso')
const CHOL_BASE = diagnosticGimaIdForSlug('colesterolo-pannello-base')
const CHOL_TOT = diagnosticGimaIdForSlug('colesterolo-test-totale')
const LACTATE_DEV = diagnosticGimaIdForSlug('lactate-scout-4')
const LACTATE_STR = diagnosticGimaIdForSlug('lactate-strisce')
const HEMO_MAIN = diagnosticGimaIdForSlug('hemo-control')
const HEMO_MICRO = diagnosticGimaIdForSlug('hemo-microcuvette')
const HB_SYS = diagnosticGimaIdForSlug('emoglobina-sistema')
const URINE_GIMA = diagnosticGimaIdForSlug('analisi-urina-gima')
const URIL_100 = diagnosticGimaIdForSlug('urilyzer-100')
const URIL_500 = diagnosticGimaIdForSlug('urilyzer-500')
const IMMUNO = diagnosticGimaIdForSlug('immuno-analizzatore')
const COMBI_IDS = [
  diagnosticGimaIdForSlug('combi-screen-2p'),
  diagnosticGimaIdForSlug('combi-screen-5p'),
  diagnosticGimaIdForSlug('combi-screen-8p'),
  diagnosticGimaIdForSlug('combi-screen-10p'),
  diagnosticGimaIdForSlug('combi-screen-11p'),
  diagnosticGimaIdForSlug('combi-screen-13p'),
] as const
const CASSETTE_PCR = diagnosticGimaIdForSlug('cassette-pcr')
const CASSETTE_TROP = diagnosticGimaIdForSlug('cassette-troponina')
const CASSETTE_COVID = diagnosticGimaIdForSlug('cassette-covid')
const CASSETTE_VITD = diagnosticGimaIdForSlug('cassette-vitamina-d')
const CASSETTE_DD = diagnosticGimaIdForSlug('cassette-d-dimero')

const CASSETTE_IDS = [
  CASSETTE_PCR,
  CASSETTE_TROP,
  CASSETTE_COVID,
  CASSETTE_VITD,
  CASSETTE_DD,
] as const

/** Monitor GimaCare 24128 ↔ strisce e soluzioni. */
const GIMACARE_MON = diagnosticGimaIdForSlug('gimacare-monitor-24128')
const GIMACARE_STRIP_IDS = [
  diagnosticGimaIdForSlug('gimacare-striscia-glucosio'),
  diagnosticGimaIdForSlug('gimacare-striscia-chetone'),
  diagnosticGimaIdForSlug('gimacare-striscia-lattato'),
  diagnosticGimaIdForSlug('gimacare-striscia-colesterolo'),
  diagnosticGimaIdForSlug('gimacare-striscia-acido-urico'),
  diagnosticGimaIdForSlug('gimacare-striscia-emoglobina'),
] as const
const GIMACARE_SOL_IDS = [
  diagnosticGimaIdForSlug('gimacare-soluzione-controllo-l1'),
  diagnosticGimaIdForSlug('gimacare-soluzione-controllo-l2'),
] as const

/** Analizzatore 24600 ↔ cassette dedicate. */
const ANAL_24600 = diagnosticGimaIdForSlug('analizzatore-24600')
const C24600_IDS = [
  diagnosticGimaIdForSlug('cassette-24600-pcr'),
  diagnosticGimaIdForSlug('cassette-24600-procalcitonina'),
  diagnosticGimaIdForSlug('cassette-24600-d-dimero'),
  diagnosticGimaIdForSlug('cassette-24600-influenza-ab'),
  diagnosticGimaIdForSlug('cassette-24600-rsv'),
  diagnosticGimaIdForSlug('cassette-24600-vitamina-d'),
] as const

/** Drug Reader 24561 ↔ cup test. */
const DRUG_READ_24561 = diagnosticGimaIdForSlug('drug-reader-24561')
const CUP24561_IDS = [diagnosticGimaIdForSlug('cup-test-24561-5'), diagnosticGimaIdForSlug('cup-test-24561-10')] as const

const TERMOMETRO_IDS = [
  diagnosticGimaIdForSlug('termometro-digitale-gima-ampio-schermo-scatola'),
  diagnosticGimaIdForSlug('termometro-digitale-gima-bl1-ampio-schermo-scatola'),
  diagnosticGimaIdForSlug('termometro-digitale-gima-bl3-ampio-schermo-c'),
  diagnosticGimaIdForSlug('gima-25556'),
  diagnosticGimaIdForSlug('gima-25558'),
  diagnosticGimaIdForSlug('gima-25559'),
] as const

/** Cerotti, garze, bende, kit — correlati incrociati in PDP (max 12 voci). */
const MEDICAZIONE_GIMA_IDS = [
  diagnosticGimaIdForSlug('gima-25300'),
  diagnosticGimaIdForSlug('gima-25301'),
  diagnosticGimaIdForSlug('gima-25302'),
  diagnosticGimaIdForSlug('gima-25307'),
  diagnosticGimaIdForSlug('gima-25310'),
  diagnosticGimaIdForSlug('gima-25312'),
  diagnosticGimaIdForSlug('gima-25314'),
  diagnosticGimaIdForSlug('gima-25316'),
  diagnosticGimaIdForSlug('gima-25318'),
  diagnosticGimaIdForSlug('gima-25320'),
  diagnosticGimaIdForSlug('gima-25322'),
  diagnosticGimaIdForSlug('gima-25324'),
  diagnosticGimaIdForSlug('gima-25330'),
  diagnosticGimaIdForSlug('gima-25332'),
  diagnosticGimaIdForSlug('gima-25335'),
  diagnosticGimaIdForSlug('gima-25337'),
  diagnosticGimaIdForSlug('gima-25350'),
] as const

const LACCIO_GIMA_IDS = [diagnosticGimaIdForSlug('gima-25721'), diagnosticGimaIdForSlug('gima-25722'), diagnosticGimaIdForSlug('gima-25723')] as const

const GISAFE_IIR_IDS = [
  diagnosticGimaIdForSlug('gima-20695'),
  diagnosticGimaIdForSlug('gima-20697'),
  diagnosticGimaIdForSlug('gima-20699'),
  diagnosticGimaIdForSlug('gima-20701'),
] as const

/** Chirurgica 4 veli, FFP2, Maskop. */
const DPI_VIE_RESPIRATORIE_IDS = [
  diagnosticGimaIdForSlug('gima-20703'),
  diagnosticGimaIdForSlug('gima-20715'),
  diagnosticGimaIdForSlug('gima-20732'),
  diagnosticGimaIdForSlug('gima-20733'),
  diagnosticGimaIdForSlug('gima-25636'),
  diagnosticGimaIdForSlug('gima-25637'),
] as const

const OCCHIALI_GIMA_IDS = [
  diagnosticGimaIdForSlug('gima-25257'),
  diagnosticGimaIdForSlug('gima-25258'),
  diagnosticGimaIdForSlug('gima-25260'),
  diagnosticGimaIdForSlug('gima-25660'),
] as const

const TRAVELJOHN_GIMA_IDS = [diagnosticGimaIdForSlug('gima-25879'), diagnosticGimaIdForSlug('gima-25880')] as const

const CONTENITORE_URINA_GIMA_IDS = [
  diagnosticGimaIdForSlug('gima-25958'),
  diagnosticGimaIdForSlug('gima-25960-1'),
  diagnosticGimaIdForSlug('gima-25962-63-iso8'),
  diagnosticGimaIdForSlug('gima-25962-63-sterile'),
  diagnosticGimaIdForSlug('gima-25965-66'),
  diagnosticGimaIdForSlug('gima-25975'),
  diagnosticGimaIdForSlug('gima-28685'),
  diagnosticGimaIdForSlug('gima-28693'),
] as const

const RIFIUTI_TAGLIENTI_GIMA_IDS = [
  diagnosticGimaIdForSlug('gima-25774'),
  diagnosticGimaIdForSlug('gima-25778'),
  diagnosticGimaIdForSlug('gima-25780'),
  diagnosticGimaIdForSlug('gima-25784'),
] as const

const MATERNITA_SPECIALISTICA_GIMA_IDS = [
  diagnosticGimaIdForSlug('gima-41700'),
  diagnosticGimaIdForSlug('gima-41701'),
  diagnosticGimaIdForSlug('gima-25836'),
  diagnosticGimaIdForSlug('gima-25859'),
] as const

/** Correlati logici: strumento ↔ consumabili; strisce urina ↔ analizzatori urina. */
export function professionalDiagnosticRelatedIdsForProductId(productId: string): string[] {
  const id = diagnosticCanonicalProductId(productId)

  const base: Record<string, readonly string[]> = {
    [MISSION_ANALYZER]: [MISSION_STR_STD, MISSION_STR_PRO, MISSION_PRINT],
    [MISSION_STR_STD]: [MISSION_ANALYZER, MISSION_STR_PRO, MISSION_PRINT],
    [MISSION_STR_PRO]: [MISSION_ANALYZER, MISSION_STR_STD, MISSION_PRINT],
    [MISSION_PRINT]: [MISSION_ANALYZER, MISSION_STR_STD, MISSION_STR_PRO],
    [CHOL_MAIN]: [CHOL_EXT, CHOL_BASE, CHOL_TOT],
    [CHOL_EXT]: [CHOL_MAIN, CHOL_BASE, CHOL_TOT],
    [CHOL_BASE]: [CHOL_MAIN, CHOL_EXT, CHOL_TOT],
    [CHOL_TOT]: [CHOL_MAIN, CHOL_EXT, CHOL_BASE],
    [LACTATE_DEV]: [LACTATE_STR],
    [LACTATE_STR]: [LACTATE_DEV],
    [HEMO_MAIN]: [HEMO_MICRO],
    [HEMO_MICRO]: [HEMO_MAIN],
    [HB_SYS]: [URINE_GIMA, URIL_100, MISSION_ANALYZER],
    [URINE_GIMA]: [...COMBI_IDS.slice(0, 4), URIL_100, URIL_500],
    [URIL_100]: [URIL_500, URINE_GIMA, ...COMBI_IDS.slice(2, 6)],
    [URIL_500]: [URIL_100, URINE_GIMA, COMBI_IDS[5]],
    [IMMUNO]: [...CASSETTE_IDS],
    [CASSETTE_PCR]: [IMMUNO, CASSETTE_TROP, CASSETTE_COVID],
    [CASSETTE_TROP]: [IMMUNO, CASSETTE_PCR, CASSETTE_DD],
    [CASSETTE_COVID]: [IMMUNO, CASSETTE_PCR, CASSETTE_VITD],
    [CASSETTE_VITD]: [IMMUNO, CASSETTE_COVID, CASSETTE_DD],
    [CASSETTE_DD]: [IMMUNO, CASSETTE_TROP, CASSETTE_VITD],
  }

  const related: Record<string, readonly string[]> = { ...base }
  for (const combiId of COMBI_IDS) {
    const others = COMBI_IDS.filter((c) => c !== combiId)
    related[combiId] = [URIL_100, URIL_500, URINE_GIMA, others[0], others[1]]
  }

  related[GIMACARE_MON] = [...GIMACARE_STRIP_IDS, ...GIMACARE_SOL_IDS]
  for (const sid of GIMACARE_STRIP_IDS) {
    const otherStrips = GIMACARE_STRIP_IDS.filter((x) => x !== sid).slice(0, 3)
    related[sid] = [GIMACARE_MON, ...otherStrips, GIMACARE_SOL_IDS[0]]
  }
  for (const sol of GIMACARE_SOL_IDS) {
    related[sol] = [GIMACARE_MON, ...GIMACARE_STRIP_IDS.slice(0, 3)]
  }

  related[ANAL_24600] = [...C24600_IDS]
  for (const cid of C24600_IDS) {
    related[cid] = [ANAL_24600, ...C24600_IDS.filter((c) => c !== cid).slice(0, 2)]
  }

  related[DRUG_READ_24561] = [...CUP24561_IDS, diagnosticGimaIdForSlug('multitest-urine-10')]
  for (const cup of CUP24561_IDS) {
    related[cup] = [DRUG_READ_24561, ...CUP24561_IDS.filter((c) => c !== cup)]
  }

  related[diagnosticGimaIdForSlug('h-pylori-self')] = [diagnosticGimaIdForSlug('h-pylori-professionale'), diagnosticGimaIdForSlug('marker-cardiaco')]
  related[diagnosticGimaIdForSlug('h-pylori-professionale')] = [diagnosticGimaIdForSlug('h-pylori-self'), diagnosticGimaIdForSlug('proteina-c-reattiva')]
  related[diagnosticGimaIdForSlug('covid-antigene-rapido')] = [diagnosticGimaIdForSlug('covid-salivare'), diagnosticGimaIdForSlug('covid-professionale')]
  related[diagnosticGimaIdForSlug('covid-salivare')] = [diagnosticGimaIdForSlug('covid-antigene-rapido'), diagnosticGimaIdForSlug('covid-professionale')]
  related[diagnosticGimaIdForSlug('covid-professionale')] = [diagnosticGimaIdForSlug('covid-antigene-rapido'), diagnosticGimaIdForSlug('cassette-24600-rsv')]
  related[diagnosticGimaIdForSlug('strep-a-striscia')] = [diagnosticGimaIdForSlug('strep-a-cassetta'), diagnosticGimaIdForSlug('marker-cardiaco')]
  related[diagnosticGimaIdForSlug('strep-a-cassetta')] = [diagnosticGimaIdForSlug('strep-a-striscia'), diagnosticGimaIdForSlug('proteina-c-reattiva')]
  related[diagnosticGimaIdForSlug('marker-cardiaco')] = [diagnosticGimaIdForSlug('proteina-c-reattiva'), diagnosticGimaIdForSlug('test-fob'), diagnosticGimaIdForSlug('analizzatore-24600')]
  related[diagnosticGimaIdForSlug('proteina-c-reattiva')] = [diagnosticGimaIdForSlug('marker-cardiaco'), diagnosticGimaIdForSlug('cassette-24600-procalcitonina')]
  related[diagnosticGimaIdForSlug('test-fob')] = [diagnosticGimaIdForSlug('malaria-rapido'), diagnosticGimaIdForSlug('marker-cardiaco')]
  related[diagnosticGimaIdForSlug('malaria-rapido')] = [diagnosticGimaIdForSlug('test-fob'), diagnosticGimaIdForSlug('cassette-24600-pcr')]
  related[diagnosticGimaIdForSlug('test-gravidanza-singolo')] = [diagnosticGimaIdForSlug('test-gravidanza-doppio'), diagnosticGimaIdForSlug('ph-vaginale')]
  related[diagnosticGimaIdForSlug('test-gravidanza-doppio')] = [diagnosticGimaIdForSlug('test-gravidanza-singolo'), diagnosticGimaIdForSlug('ph-vaginale')]
  related[diagnosticGimaIdForSlug('ph-vaginale')] = [diagnosticGimaIdForSlug('vaginite-multiplo'), diagnosticGimaIdForSlug('clamidia-rapido')]
  related[diagnosticGimaIdForSlug('vaginite-multiplo')] = [diagnosticGimaIdForSlug('ph-vaginale'), diagnosticGimaIdForSlug('clamidia-rapido')]
  related[diagnosticGimaIdForSlug('clamidia-rapido')] = [diagnosticGimaIdForSlug('ph-vaginale'), diagnosticGimaIdForSlug('vaginite-multiplo')]
  related[diagnosticGimaIdForSlug('multitest-urine-7')] = [diagnosticGimaIdForSlug('multitest-urine-10'), diagnosticGimaIdForSlug('drug-reader-24561')]
  related[diagnosticGimaIdForSlug('multitest-urine-10')] = [diagnosticGimaIdForSlug('multitest-urine-7'), diagnosticGimaIdForSlug('multitest-urine-16'), DRUG_READ_24561]
  related[diagnosticGimaIdForSlug('multitest-urine-16')] = [diagnosticGimaIdForSlug('multitest-urine-10'), DRUG_READ_24561]
  related[diagnosticGimaIdForSlug('test-salivare-6dro-alcol')] = [diagnosticGimaIdForSlug('test-alcolimetrico'), diagnosticGimaIdForSlug('multitest-urine-10')]
  related[diagnosticGimaIdForSlug('test-alcolimetrico')] = [diagnosticGimaIdForSlug('test-salivare-6dro-alcol'), diagnosticGimaIdForSlug('drug-reader-24561')]
  related[diagnosticGimaIdForSlug('strisce-urina-vet-11p')] = [diagnosticGimaIdForSlug('analisi-urina-gima'), diagnosticGimaIdForSlug('urilyzer-100')]

  for (const tid of TERMOMETRO_IDS) {
    related[tid] = TERMOMETRO_IDS.filter((x) => x !== tid)
  }

  for (const mid of MEDICAZIONE_GIMA_IDS) {
    related[mid] = MEDICAZIONE_GIMA_IDS.filter((x) => x !== mid).slice(0, 12)
  }

  for (const lid of LACCIO_GIMA_IDS) {
    related[lid] = LACCIO_GIMA_IDS.filter((x) => x !== lid)
  }

  for (const gid of GISAFE_IIR_IDS) {
    related[gid] = GISAFE_IIR_IDS.filter((x) => x !== gid).slice(0, 12)
  }

  for (const rid of DPI_VIE_RESPIRATORIE_IDS) {
    related[rid] = DPI_VIE_RESPIRATORIE_IDS.filter((x) => x !== rid).slice(0, 12)
  }

  for (const oid of OCCHIALI_GIMA_IDS) {
    related[oid] = OCCHIALI_GIMA_IDS.filter((x) => x !== oid)
  }

  for (const tid of TRAVELJOHN_GIMA_IDS) {
    related[tid] = TRAVELJOHN_GIMA_IDS.filter((x) => x !== tid)
  }

  for (const uid of CONTENITORE_URINA_GIMA_IDS) {
    related[uid] = CONTENITORE_URINA_GIMA_IDS.filter((x) => x !== uid).slice(0, 12)
  }

  for (const rid of RIFIUTI_TAGLIENTI_GIMA_IDS) {
    related[rid] = RIFIUTI_TAGLIENTI_GIMA_IDS.filter((x) => x !== rid).slice(0, 12)
  }

  for (const mid of MATERNITA_SPECIALISTICA_GIMA_IDS) {
    related[mid] = MATERNITA_SPECIALISTICA_GIMA_IDS.filter((x) => x !== mid).slice(0, 12)
  }

  related[diagnosticGimaIdForSlug('gima-20500')] = [
    diagnosticGimaIdForSlug('gima-25332'),
    diagnosticGimaIdForSlug('gima-25335'),
    diagnosticGimaIdForSlug('gima-25337'),
    diagnosticGimaIdForSlug('gima-25330'),
    diagnosticGimaIdForSlug('gima-25721'),
  ]

  return [...(related[id] ?? [])]
}

export function buildProfessionalDiagnosticAstroMedicalOfficeProducts(): OfficeProduct[] {
  return ALL_DIAG_ROWS.map((row) => {
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
    subcategory: row.subcategory ?? 'Diagnostica professionale',
    mainFeatures: {},
    imageUrl: row.imageUrl,
    price: row.priceImponible,
    description: row.description,
  }})
}
