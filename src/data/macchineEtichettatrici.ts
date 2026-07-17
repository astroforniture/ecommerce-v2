import type { OfficeProduct } from '../types/officeProduct'
import { macchineUfficioSubcategoryPath } from '../lib/macchineUfficioRoutes'

/** Sottocategoria Macchine per Ufficio — URL e etichetta UI */
export const MACCHINE_SUB_ETICHETTATRICI_SLUG = 'etichettatrici'
export const MACCHINE_SUB_ETICHETTATRICI_LABEL = 'Etichettatrici'

export function macchineUfficioEtichettatriciListingPath(): string {
  return macchineUfficioSubcategoryPath(MACCHINE_SUB_ETICHETTATRICI_SLUG)
}

/** Anteprima hub (stessa immagine principale del prodotto card). */
export const ETICHETTATRICI_COVER_IMAGE_URL = 'https://odmultimedia.eu/immagini/HD/48891.jpg'

export const ETICHETTATRICI_OFFICE_ID_PREFIX = 'AF-ETCH-'

export type EtichettatriciCatalogItem = {
  id: string
  title: string
  imageUrl: string
  imageGalleryUrls?: string[]
  priceImponible: number
  /** Marca in scheda e card (default Dymo per retrocompatibilità). */
  brand?: string
}

export const ETICHETTATRICI_CATALOG: readonly EtichettatriciCatalogItem[] = [
  {
    id: 'dymo-letratag-lt-100h',
    title: 'Etichettatrice Letratag LT-100H - Dymo',
    imageUrl: 'https://odmultimedia.eu/immagini/HD/48891.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/HD/48891_1.jpg'],
    priceImponible: 48,
  },
  {
    id: 'dymo-letratag-lt-200b',
    title: 'Etichettatrice Letratag LT-200B - Dymo',
    imageUrl: 'https://odmultimedia.eu/immagini/HD/95970.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/HD/95970_1.jpg'],
    priceImponible: 48,
  },
  {
    id: 'dymo-labelmanager-160',
    title: 'Etichettatrice LabelManager 160 - Dymo',
    imageUrl: 'https://odmultimedia.eu/immagini/HD/65606.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/HD/65606_1.jpg'],
    priceImponible: 65,
  },
  {
    id: 'dymo-labelmanager-210d',
    title: 'Dymo LabelManager 210D',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/51073.jpg',
    imageGalleryUrls: ['https://odmultimedia.eu/immagini/HD/51073_1.jpg'],
    priceImponible: 74,
  },
  {
    id: 'dymo-rhino-4200',
    title: 'Dymo Rhino 4200',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/72179.jpg',
    priceImponible: 229,
  },
  {
    id: 'brother-ql-800',
    title: 'Brother QL 800',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-QL800.jpg',
    priceImponible: 139,
  },
  {
    id: 'brother-ptouch-d210',
    title: 'Brother PTouch D210',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-PTD210.jpg',
    priceImponible: 49,
  },
  {
    id: 'brother-ptouch-110',
    title: 'Brother PTouch 110',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-PT110.jpg',
    priceImponible: 39,
  },
  {
    id: 'brother-ptouch-e310btv',
    title: 'Brother PTouch E310BTV',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROPTE310BTV.jpg',
    priceImponible: 89,
  },
  {
    id: 'brother-ptouch-cube-ptp300',
    title: 'Brother PTouch Cube PTP300',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-PTP300.jpg',
    priceImponible: 79,
  },
  {
    id: 'dymo-rhino-4200-kit',
    title: 'Dymo Rhino 4200 (IN KIT)',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/100008.jpg',
    priceImponible: 269,
  },
  {
    id: 'brother-ptouch-cube-plus-ptp710',
    title: 'Brother P-Touch Cube Plus PTP710',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-PTP710BT.jpg',
    priceImponible: 149,
  },
  {
    id: 'brother-ptouch-cube-pro-ptp910',
    title: 'Brother P-Touch Cube Pro PTP910',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BRO-PTP910BT.jpg',
    priceImponible: 189,
  },
  {
    id: 'brother-ptouch-cube-pro-pte720bt',
    title: 'Brother P-Touch CUBE PRO PTE720BT',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROPTE720BT.jpg',
    priceImponible: 199,
  },
  {
    id: 'brother-ptouch-cube-pro-pte920bt',
    title: 'Brother P-Touch CUBE PRO PTE920BT',
    brand: 'Brother',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/BROPTE920BT.jpg',
    priceImponible: 229,
  },
] as const

function descriptionForEtichettatrici(row: EtichettatriciCatalogItem): string {
  const brand = (row.brand ?? 'Dymo').trim()
  if (row.id === 'dymo-letratag-lt-200b') {
    return (
      `${row.title}: etichettatrice LetraTag elettronica con connettività Bluetooth per creare e stampare etichette da ` +
      `smartphone o computer tramite app DYMO Connect. Nastri compatibili serie LT (12 mm) per cavi, scaffali e ` +
      `organizzazione ufficio. Alimentazione a batteria ricaricabile o USB-C secondo confezione. Prezzo unitario ` +
      `imponibile IVA esclusa; per accessori contattare il commerciale.`
    )
  }
  if (row.id === 'dymo-labelmanager-160') {
    return (
      `${row.title}: stampante per etichette DYMO LabelManager da tavolo, pensata per etichettatura frequente in ` +
      `ufficio (D1 e nastri compatibili secondo scheda tecnica). Display e tastiera per modifica rapida del testo; ` +
      `connessione USB o standalone secondo versione. Prezzo unitario imponibile IVA esclusa; verificare nastri in ` +
      `dotazione con il commerciale.`
    )
  }
  if (row.id === 'dymo-labelmanager-210d') {
    return (
      `${row.title}: etichettatrice LabelManager con tastiera QWERTY per digitazione veloce di testi lunghi e ` +
      `simboli; ideale per archiviazione, magazzino e reparti logistici. Compatibilità nastri DYMO D1 secondo ` +
      `dichiarazioni del produttore. Prezzo unitario imponibile IVA esclusa; per kit e consumabili contattare il ` +
      `commerciale.`
    )
  }
  if (row.id === 'dymo-rhino-4200' || row.id === 'dymo-rhino-4200-kit') {
    return (
      `${row.title}: etichettatrice industriale Rhino per nastri vinile e poliestere; pensata per cantieri, ` +
      `elettricisti e identificazione cavi. Versione kit dove indicato include accessori secondo confezione. ` +
      `Prezzo unitario imponibile IVA esclusa; per nastri e personalizzazioni contattare il commerciale.`
    )
  }
  if (
    row.id === 'brother-ptouch-cube-plus-ptp710' ||
    row.id === 'brother-ptouch-cube-pro-ptp910' ||
    row.id === 'brother-ptouch-cube-pro-pte720bt' ||
    row.id === 'brother-ptouch-cube-pro-pte920bt'
  ) {
    return (
      `${row.title}: modello di fascia alta della serie Brother P-touch Cube, per etichettatura professionale da ` +
      `scrivania o in mobilità secondo versione commerciale. Qualità di stampa e connettività secondo scheda ` +
      `produttore. Prezzo unitario imponibile IVA esclusa; nastri e accessori su richiesta al commerciale.`
    )
  }
  if (row.brand === 'Brother') {
    return (
      `${row.title}: stampante per etichette Brother da ufficio o mobile. Prezzo unitario imponibile IVA esclusa; ` +
      `per nastri e accessori contattare il commerciale.`
    )
  }
  if (row.id === 'dymo-letratag-lt-100h') {
    return (
      `${row.title}: etichettatrice a rilievo LetraTag per nastri DYMO LT (12 mm), adatta a etichettatura di cavi, ` +
      `scaffali, archivi e piccola segnaletica interna. Funzionamento portatile con batterie o alimentatore (secondo ` +
      `confezione / versione commerciale). Prezzo unitario imponibile IVA esclusa; per accessori e nastri compatibili ` +
      `contattare il commerciale.`
    )
  }
  return (
    `${row.title}: etichettatrice per ufficio (${brand}). Prezzo unitario imponibile IVA esclusa; per nastri, ` +
    `accessori e disponibilità contattare il commerciale.`
  )
}

export function buildEtichettatriciOfficeProducts(): OfficeProduct[] {
  return ETICHETTATRICI_CATALOG.map((row) => {
    const brand = (row.brand ?? 'Dymo').trim()
    return {
      id: `${ETICHETTATRICI_OFFICE_ID_PREFIX}${row.id}`,
      name: row.title,
      brand,
      producerCode: `${ETICHETTATRICI_OFFICE_ID_PREFIX}${row.id}`,
      category: 'Macchine per Ufficio',
      subcategory: MACCHINE_SUB_ETICHETTATRICI_LABEL,
      mainFeatures: {},
      imageUrl: row.imageUrl,
      imageGalleryUrls: row.imageGalleryUrls,
      price: row.priceImponible,
      description: descriptionForEtichettatrici(row),
    }
  })
}

export function isEtichettatriciOfficeProductId(id: string): boolean {
  return String(id ?? '').startsWith(ETICHETTATRICI_OFFICE_ID_PREFIX)
}
