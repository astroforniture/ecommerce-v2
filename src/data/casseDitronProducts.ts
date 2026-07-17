import type { OfficeProduct } from '../types/officeProduct'
import { macchineUfficioSubcategoryPath } from '../lib/macchineUfficioRoutes'

/** Sottocategoria Macchine per Ufficio — URL e etichetta UI */
export const MACCHINE_SUB_CASSE_DITRON_SLUG = 'casse-ditron'
export const MACCHINE_SUB_CASSE_DITRON_LABEL = 'Casse Ditron'

export const CASSE_DITRON_COVER_IMAGE_URL = '/macchine-per-ufficio/image_184622.png'

const CASSE_DITRON_IMAGE_BASE = '/macchine-per-ufficio/casse-ditron'

export function macchineUfficioCasseDitronListingPath(): string {
  return macchineUfficioSubcategoryPath(MACCHINE_SUB_CASSE_DITRON_SLUG)
}

export const CASSE_DITRON_OFFICE_ID_PREFIX = 'AF-DITRON-'

export type CasseDitronCatalogItem = {
  id: string
  title: string
  imageUrl: string
  /** Prezzo imponibile catalogo; 0 = su preventivo (non esposto al pubblico). */
  priceImponible: number
  brand: string
  description: string
  mainFeatures: Record<string, string>
}

const SAFEMONEY_SPECS = `Display operatore: 10" grafico touchscreen con rotazione di 30°
Connessioni: Ethernet
Alimentazione: 500 W / 100-240 VAC - 50/60 Hz con backup power supply per chiusura transazione
Dimensioni (case metallico): L 41,6 x P 37,3 x H 68,5 cm
Peso a vuoto: 70 kg
Funzioni: accettazione e riciclo banconote (fino a 15 pezzi contemporaneamente / bulknote), smart coin system per monete, integrazione diretta con RT Ditron, diagnostica e aggiornamento software da remoto`

const NEW_IDEAL_SPECS = `DGFE / Memoria fiscale: Micro SD certificata RT
Stampante: termica da 2", risoluzione 8 dots/mm, larghezza rotolo 58 mm, diametro fino a 50 mm, caricamento easy loading e taglierina manuale
Tastiera: compatta, 40 tasti programmabili con assegnazione libera delle funzioni
Display operatore: LCD TFT grafico touch da 3,5"
Display cliente: LCD TFT grafico da 3,5" con visualizzazione QR code per scontrino digitale
Connessioni: 1 porta Ethernet (10/100), 2 porte seriali RJ45, 1 connettore per cassetto, 1 porta USB
Connettività: Wi-Fi integrato
Dimensioni: 241 x 260 x 120 mm (L x P x H)
Peso: 1,2 kg
Colore: nero
Driver / protocolli supportati: WinEcrCom, XDitron, JavaPOS, POS for .NET, OLEPOS, REST API, XON/XOFF`

/** Catalogo Casse Ditron — sistemi Ditronetwork per retail e hospitality. */
export const CASSE_DITRON_CATALOG: readonly CasseDitronCatalogItem[] = [
  {
    id: 'advance-safemoney',
    title: 'ADVANCE | SafeMoney',
    imageUrl: `${CASSE_DITRON_IMAGE_BASE}/image_18c927.jpg`,
    priceImponible: 0,
    brand: 'Ditronetwork',
    description:
      'Sistema di cash-handling progettato per automatizzare la gestione dei pagamenti in contanti, rendendo i flussi più rapidi e sicuri. Riduce gli errori di cassa, protegge dai furti ed è ideale per punti vendita ad alta affluenza. Integra uno schermo touchscreen grafico da 10" e supporta la gestione multicassa.',
    mainFeatures: {
      Tipologia: 'Sistema cash-handling ADVANCE SafeMoney',
      'Display operatore': '10" touchscreen grafico (rotazione 30°)',
      Connessioni: 'Ethernet',
      Alimentazione: '500 W / 100-240 VAC - 50/60 Hz',
      Dimensioni: 'L 41,6 x P 37,3 x H 68,5 cm',
      Peso: '70 kg',
      Funzioni:
        'Accettazione/riciclo banconote, smart coin system, integrazione RT Ditron, diagnostica remota',
    },
  },
  {
    id: 'pax-q58-gem',
    title: 'PAX SERIE Q58 GEM | Pos Bancario',
    imageUrl: `${CASSE_DITRON_IMAGE_BASE}/image_18cd43.png`,
    priceImponible: 0,
    brand: 'PAX',
    description:
      "L'ultimo classico terminale di pagamento da banco di Pax presenta un design dall'aspetto elegante e moderno, alimentato da un processore e un sistema operativo veloce e affidabile. Grazie alle sue porte, il Q58 può offrire opzioni di connettività senza precedenti per qualsiasi azienda, robustezza ed affidabilità comprovata su vasta scala. La soluzione ideale per il settore Banking e Retail, eventualmente integrabile con tutti i Registratori telematici, consente di poter effettuare ricariche e soluzioni di pagamento integrate con sistemi di dematerializzazione degli scontrini.",
    mainFeatures: {
      Tipologia: 'POS bancario PAX Serie Q58 GEM',
      Settori: 'Banking, Retail',
      Integrazione: 'Registratori telematici Ditron, dematerializzazione scontrini',
      Connettività: 'Porte multiple per opzioni di collegamento avanzate',
    },
  },
  {
    id: 'new-ideal',
    title: 'NEW iDEAL',
    imageUrl: `${CASSE_DITRON_IMAGE_BASE}/image_18d0c9.jpg`,
    priceImponible: 0,
    brand: 'Ditronetwork',
    description:
      "Registratore Telematico conforme ai requisiti dell'Agenzia delle Entrate per l'invio dei corrispettivi fiscali. Dotato di display touch e un'interfaccia utente riprogettata per rendere ogni funzione a portata di tocco. Include un sistema antitampering per bloccare ogni manomissione e garantire la massima sicurezza dei dati.",
    mainFeatures: {
      Tipologia: 'Registratore telematico (RT)',
      'Display operatore': 'LCD TFT touch 3,5"',
      'Display cliente': 'LCD TFT 3,5" con QR code scontrino digitale',
      Stampante: 'Termica 2" — rotolo 58 mm',
      Tastiera: '40 tasti programmabili',
      Connettività: 'Ethernet, Wi-Fi, USB, porte seriali',
      Dimensioni: '241 x 260 x 120 mm',
      Peso: '1,2 kg',
    },
  },
] as const

function casseDitronFullDescription(row: CasseDitronCatalogItem): string {
  const specsBlock =
    row.id === 'advance-safemoney'
      ? SAFEMONEY_SPECS
      : row.id === 'new-ideal'
        ? NEW_IDEAL_SPECS
        : null

  const preventivoNote =
    row.priceImponible <= 0
      ? '\n\nPrezzo su preventivo: contattaci per configurazione, installazione e listino aggiornato.'
      : ''

  if (!specsBlock) {
    return `${row.description}${preventivoNote}`
  }

  return `${row.description}\n\nSPECIFICHE TECNICHE\n${specsBlock}${preventivoNote}`
}

export function buildCasseDitronOfficeProducts(): OfficeProduct[] {
  return CASSE_DITRON_CATALOG.map((row) => ({
    id: `${CASSE_DITRON_OFFICE_ID_PREFIX}${row.id}`,
    name: row.title,
    brand: row.brand,
    producerCode: `${CASSE_DITRON_OFFICE_ID_PREFIX}${row.id}`,
    category: 'Macchine per Ufficio',
    subcategory: MACCHINE_SUB_CASSE_DITRON_LABEL,
    mainFeatures: row.mainFeatures,
    imageUrl: row.imageUrl,
    price: undefined,
    description: casseDitronFullDescription(row),
  }))
}

export function isCasseDitronOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(CASSE_DITRON_OFFICE_ID_PREFIX)
}

/** Prodotti venduti solo su preventivo: nessun prezzo pubblico né acquisto online. */
export function isQuoteOnlyOfficeProduct(
  product: Pick<OfficeProduct, 'id'> | null | undefined,
): boolean {
  return isCasseDitronOfficeProductId(String(product?.id ?? ''))
}
