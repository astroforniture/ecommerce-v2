import type { OfficeProduct } from '../types/officeProduct'
import { macchineUfficioSubcategoryPath } from '../lib/macchineUfficioRoutes'

/** Sottocategoria Macchine per Ufficio — URL e etichetta UI */
export const MACCHINE_SUB_VERIFICA_BANCONOTE_SLUG = 'verifica-banconote'
export const MACCHINE_SUB_VERIFICA_BANCONOTE_LABEL = 'Verifica banconote'

export const VERIFICA_BANCONOTE_COVER_IMAGE_URL =
  'https://odmultimedia.eu/immagini/MD/77725.jpg'

export function macchineUfficioVerificaBanconoteListingPath(): string {
  return macchineUfficioSubcategoryPath(MACCHINE_SUB_VERIFICA_BANCONOTE_SLUG)
}

export const VERIFICA_BANCONOTE_OFFICE_ID_PREFIX = 'AF-VB-'

export type VerificaBanconoteCatalogItem = {
  sku: string
  title: string
  brand: string
  priceImponible: number
  imageUrl: string
  colorName?: string
  format?: string
  description: string
}

export const VERIFICA_BANCONOTE_CATALOG: readonly VerificaBanconoteCatalogItem[] = [
  {
    sku: '92216',
    title: 'Conta/verifica banconote multivalute HT 8913 - HolenBecky',
    brand: 'HolenBecky',
    priceImponible: 260,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/92216.jpg',
    format: 'Multivalute HT 8913',
    description:
      'Conta/verifica banconote HolenBecky HT 8913 multivalute. Dispositivo professionale per conteggio rapido e controlli anti-falsificazione (UV, MG, IR e/o TH secondo configurazione del lotto) su banconote di più valute. Ideale per retail, GDO, uffici contabili e punti cassa B2B ad alto volume: display chiaro, caricamento semplificato e allarmi in caso di sospetta contraffazione. Verificare sul prodotto l’elenco valute aggiornato e le modalità di calibrazione. Manutenzione: tenere i sensori puliti e usare solo banconote in buono stato per ridurre inceppamenti.',
  },
  {
    sku: '88305',
    title: 'Conta/verifica banconote HT 7.0 - nero - Holenbecky',
    brand: 'HolenBecky',
    priceImponible: 140,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/88305.jpg',
    colorName: 'nero',
    format: 'HT 7.0',
    description:
      'Conta/verifica banconote HolenBecky HT 7.0, colore nero. Modello compatto per conteggio quotidiano in negozio, farmacia o back-office: verifica di sicurezza tipica UV/MG/IR (controllare marcatura sul lotto) e conteggio affidabile per lotti di banconote. Facile da posizionare sul bancone grazie all’ingombro ridotto. Indicato per attività retail e B2B con flussi di cassa medi. Pulire i rulli e i sensori periodicamente; non forzare banconote piegate o danneggiate.',
  },
  {
    sku: '88304',
    title: 'Conta/verifica banconote HT 7.0 - bianco - Holenbecky',
    brand: 'HolenBecky',
    priceImponible: 140,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/88304.jpg',
    colorName: 'bianco',
    format: 'HT 7.0',
    description:
      'Conta/verifica banconote HolenBecky HT 7.0, colore bianco. Stesse funzionalità del modello nero: conteggio e controlli anti-falso (UV/MG/IR ove presenti) in un formato da bancone. Ideale per ambienti dove il colore chiaro si integra meglio con l’arredo del punto vendita. Uso quotidiano in retail e uffici amministrativi. Seguire le istruzioni di alimentazione e spegnimento; aggiornare firmware se previsto dal produttore.',
  },
  {
    sku: '85875',
    title: 'Conta/verifica banconote Pixel S2 - 11,7 x 13,6 x 7,1 cm - nero - Iternet',
    brand: 'Iternet',
    priceImponible: 120,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/85875.jpg',
    colorName: 'nero',
    format: '11,7 × 13,6 × 7,1 cm',
    description:
      'Conta/verifica banconote Iternet Pixel S2, nero, dimensioni 11,7 × 13,6 × 7,1 cm. Formato ultra-compatto per spazi ridotti: conteggio e rilevazione banconote sospette tramite sensori di sicurezza (UV/MG/IR tipici della serie — verificare scheda tecnica). Pensato per bar, tabacchi, piccoli negozi e desk reception. Facilità d’uso con comandi essenziali e feedback immediato. Conservare al riparo da polvere e umidità eccessiva; non esporre a urti durante il trasporto.',
  },
  {
    sku: '77725',
    title: 'Conta/Verifica banconote HT2280 - 31,1 x 26,1 x 19,5 cm - nero - HolenBecky',
    brand: 'HolenBecky',
    priceImponible: 420,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/77725.jpg',
    colorName: 'nero',
    format: '31,1 × 26,1 × 19,5 cm',
    description:
      'Conta/verifica banconote HolenBecky HT2280, nero, dimensioni 31,1 × 26,1 × 19,5 cm. Macchina di fascia superiore per volumi elevati: conteggio veloce, hopper/cassetto di capacità maggiore rispetto ai modelli da bancone e suite di controlli anti-falsificazione UV/MG/IR/TH (verificare configurazione sul lotto). Ideale per centri commerciali, cash-office, grandi retail e servizi di gestione contante B2B. Interfaccia professionale e segnalazioni acustiche/visive in caso di anomalia. Pianificare manutenzione sensori e rulli secondo intensità d’uso.',
  },
  {
    sku: '90207',
    title: 'Conta banconote HT 2150 - Holenburg Iternet',
    brand: 'Iternet',
    priceImponible: 220,
    imageUrl: 'https://odmultimedia.eu/immagini/MD/90207.jpg',
    format: 'HT 2150',
    description:
      'Conta banconote HT 2150 Holenburg / Iternet. Soluzione intermedia per conteggio affidabile in ambienti retail e uffici contabili: velocità di conteggio elevata e controlli di sicurezza (UV/MG/IR ove dichiarati) per individuare banconote non conformi. Adatta a punti cassa con flussi regolari e a riconciliazioni di fine giornata. Facile da operare anche da personale non tecnico. Verificare valute supportate e modalità ADD/BATCH sul manuale; tenere pulita la pista di alimentazione.',
  },
] as const

export function buildVerificaBanconoteOfficeProducts(): OfficeProduct[] {
  return VERIFICA_BANCONOTE_CATALOG.map((row) => ({
    id: `${VERIFICA_BANCONOTE_OFFICE_ID_PREFIX}${row.sku}`,
    name: row.title,
    brand: row.brand,
    producerCode: row.sku,
    category: 'Macchine per Ufficio',
    subcategory: MACCHINE_SUB_VERIFICA_BANCONOTE_LABEL,
    mainFeatures: {},
    imageUrl: row.imageUrl,
    price: row.priceImponible,
    description: row.description,
    colorName: row.colorName,
    format: row.format,
  }))
}

export function isVerificaBanconoteOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(VERIFICA_BANCONOTE_OFFICE_ID_PREFIX)
}

export function matchesVerificaBanconoteSubcategory(
  product: { subcategory?: string | null },
): boolean {
  const sub = (product.subcategory ?? '').trim()
  return (
    sub.localeCompare(MACCHINE_SUB_VERIFICA_BANCONOTE_LABEL, 'it', { sensitivity: 'base' }) === 0
  )
}
