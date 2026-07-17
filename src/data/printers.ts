import type { PrinterRentalItem } from '../types/printer-rental'

/**
 * Elenco stampanti in noleggio — sostituisci con i tuoi modelli e specifiche.
 * - imageUrl: inserisci path `/nome-file.jpg` in public/ oppure URL assoluto
 * - subscription.printsBarMax: usa un tetto coerente tra le card per confrontare le barre, oppure il massimo del piano
 */
export const printerRentals: PrinterRentalItem[] = [
  {
    id: 'placeholder-1',
    model: 'Modello esempio — Laser mono A4',
    imageUrl: '',
    tagline: 'Ideale per piccoli uffici',
    specs: {
      ppmMono: 35,
      ppmColor: null,
      resolution: '1200 x 1200 dpi',
    },
    subscription: {
      includedPrints: 2500,
      printsBarMax: 5000,
      periodLabel: 'al mese',
    },
  },
  {
    id: 'placeholder-2',
    model: 'Modello esempio — Multifunzione a colori',
    imageUrl: '',
    tagline: 'Stampa, copia, scansione',
    specs: {
      ppmMono: 28,
      ppmColor: 22,
      resolution: '4800 x 1200 dpi',
    },
    subscription: {
      includedPrints: 4000,
      printsBarMax: 5000,
      periodLabel: 'al mese',
    },
  },
  {
    id: 'placeholder-3',
    model: 'Modello esempio — Workgroup',
    imageUrl: '',
    tagline: 'Alto volume, basso costo per pagina',
    specs: {
      ppmMono: 45,
      ppmColor: null,
      resolution: '1200 x 1200 dpi',
    },
    subscription: {
      includedPrints: 8000,
      printsBarMax: 10000,
      periodLabel: 'al mese',
    },
  },
]
