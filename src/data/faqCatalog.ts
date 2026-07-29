export type FaqItem = {
  question: string
  answer: string
}

export type FaqCategory = {
  id: string
  title: string
  items: readonly FaqItem[]
}

/** FAQ globali sito (pagina /faq). */
export const GLOBAL_FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: 'ordini-spedizioni',
    title: 'Ordini & Spedizioni',
    items: [
      {
        question: 'Come posso effettuare un ordine?',
        answer:
          'Puoi acquistare online dal catalogo Astro Forniture aggiungendo i prodotti al carrello e completando il checkout. Per articoli su preventivo (es. casse Ditron, configurazioni speciali) contattaci via WhatsApp o telefono: prepariamo un’offerta dedicata.',
      },
      {
        question: 'Quali sono i tempi di consegna?',
        answer:
          'Per la merce disponibile in pronta consegna spediamo in genere entro 24–48 ore lavorative. I tempi di arrivo dipendono dalla destinazione e dal corriere. Per urgenze o ritiro in sede a Porto Mantovano (MN) chiamaci: organizziamo la soluzione più rapida.',
      },
      {
        question: 'Posso ritirare l’ordine in negozio?',
        answer:
          'Sì. Il ritiro è disponibile presso la nostra sede in Strada Cisa 7, 46047 Porto Mantovano (MN). Ti consigliamo di avvisarci in anticipo così prepariamo la merce e ti confermiamo l’orario.',
      },
      {
        question: 'Come traccio la spedizione?',
        answer:
          'Quando l’ordine viene affidato al corriere ricevi le informazioni di tracking via email o messaggio. In caso di dubbio puoi contattare il nostro servizio clienti con il numero d’ordine.',
      },
    ],
  },
  {
    id: 'prezzi-preventivi',
    title: 'Prezzi & Preventivi',
    items: [
      {
        question: 'I prezzi indicati sono IVA esclusa?',
        answer:
          'Sì: i prezzi online sono imponibili (IVA esclusa), salvo diversa indicazione in scheda. In carrello e in fattura trovi il dettaglio imponibile e IVA secondo le aliquote applicabili.',
      },
      {
        question: 'Come richiedo un preventivo personalizzato?',
        answer:
          'Per prodotti “su preventivo”, grandi forniture o configurazioni (casse, installazioni, personalizzazioni) usa il pulsante WhatsApp in scheda oppure scrivi a info@astro-forniture.it indicando prodotti, quantità e destinazione d’uso.',
      },
      {
        question: 'Fate sconti per quantità o aziende?',
        answer:
          'Sì. Su molte referenze sono previsti listini a scaglioni; per forniture ricorrenti o contratti aziendali prepariamo condizioni dedicate. Contatta il commerciale con l’elenco articoli.',
      },
      {
        question: 'Accettate pagamenti con bonifico o fattura?',
        answer:
          'Sì. Oltre ai metodi disponibili in checkout possiamo gestire bonifico e fatturazione elettronica per partita IVA. I dettagli sono anche nelle condizioni di vendita del sito.',
      },
    ],
  },
  {
    id: 'garanzia-assistenza',
    title: 'Garanzia & Assistenza',
    items: [
      {
        question: 'Quali garanzie offrite sui prodotti?',
        answer:
          'I prodotti godono della garanzia del produttore e delle tutele previste dalla normativa vigente. Per macchine e sistemi (es. registratori telematici) l’assistenza può includere installazione e supporto tecnico su accordo commerciale.',
      },
      {
        question: 'Come funziona il reso?',
        answer:
          'Per merce errata o difettosa contattaci tempestivamente con foto e numero d’ordine: organizziamo sostituzione o reso secondo le condizioni di vendita. I prodotti personalizzati o aperti possono avere limitazioni.',
      },
      {
        question: 'Chi contatto per assistenza post-vendita?',
        answer:
          'Puoi chiamare lo 0376 329959, il cellulare/WhatsApp 375 613 9937 oppure scrivere a info@astro-forniture.it. Un referente ti supporta su disponibilità, uso prodotto e segnalazioni di garanzia.',
      },
      {
        question: 'Fornite assistenza anche su installazione e configurazione?',
        answer:
          'Sì, soprattutto su attrezzature professionali (casse, POS, registratori telematici). Possiamo includere installazione, configurazione fiscale e formazione base nell’offerta di preventivo.',
      },
    ],
  },
] as const

/** FAQ di default per NEW iDEAL / registratori Ditron (override da DB se presente). */
export const NEW_IDEAL_PRODUCT_FAQ: readonly FaqItem[] = [
  {
    question: 'Il NEW iDEAL è un registratore telematico conforme?',
    answer:
      'Sì. È un Registratore Telematico conforme ai requisiti dell’Agenzia delle Entrate per la memorizzazione e la trasmissione dei corrispettivi, con memoria fiscale su Micro SD certificata RT.',
  },
  {
    question: 'Include Wi-Fi e collegamento a cassetto?',
    answer:
      'Sì: ha Wi-Fi integrato, porta Ethernet, porte seriali, USB e connettore per cassetto. È pensato per negozi, bar, ristoranti e attività commerciali che necessitano di connettività flessibile.',
  },
  {
    question: 'Il prezzo include installazione e configurazione?',
    answer:
      'Il NEW iDEAL è venduto su preventivo: in offerta possiamo includere installazione, configurazione fiscale, assistenza iniziale e opzioni dedicate alla tua attività. Contattaci per un’offerta personalizzata.',
  },
  {
    question: 'Posso scaricare la scheda tecnica?',
    answer:
      'Sì. Nella scheda prodotto trovi il pulsante “Scarica Brochure PDF (Scheda Tecnica)” con le specifiche ufficiali Ditron NEW iDEAL.',
  },
] as const

export function parseProductFaq(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return []
  const out: FaqItem[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const q = String((entry as { question?: unknown }).question ?? '').trim()
    const a = String((entry as { answer?: unknown }).answer ?? '').trim()
    if (q && a) out.push({ question: q, answer: a })
  }
  return out
}
