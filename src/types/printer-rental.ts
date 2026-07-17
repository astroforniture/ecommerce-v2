/**
 * Modello dati noleggio stampanti.
 * Compila i campi quando avrai le schede tecniche: basta aggiornare `src/data/printers.ts`.
 */
export type PrinterRentalSpecs = {
  /** Pagine al minuto — bianco/nero */
  ppmMono: number
  /** Pagine al minuto — colore (opzionale per laser mono) */
  ppmColor?: number | null
  /** Risoluzione massima, es. "1200 x 1200 dpi" */
  resolution: string
}

export type PrinterRentalSubscription = {
  /** Stampe incluse nel canone (es. mensili o trimestrali — specifica in label) */
  includedPrints: number
  /**
   * Valore massimo per la barra visiva (es. 5000).
   * La barra mostra includedPrints / printsBarMax * 100%.
   */
  printsBarMax: number
  /** Etichetta periodo, es. "al mese" / "trimestrali" */
  periodLabel?: string
}

export type PrinterRentalItem = {
  id: string
  /** Nome commerciale / modello */
  model: string
  /** URL immagine prodotto (lascia vuoto per placeholder grafico) */
  imageUrl?: string
  /** Breve nota opzionale sulla fascia o uso consigliato */
  tagline?: string
  specs: PrinterRentalSpecs
  subscription: PrinterRentalSubscription
}
