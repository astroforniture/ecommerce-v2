import {
  companyMailtoHref,
  companyWhatsappHref,
} from './companyContacts'

export type ServizioSlug =
  | 'timbri-personalizzati'
  | 'noleggio-stampanti'
  | 'shopper-personalizzate'
  | 'biglietti-da-visita'
  | 'vetrofanie'

export type ServizioPageContent = {
  slug: ServizioSlug
  navLabel: string
  path: string
  h1: string
  subtitle: string
  description?: string
  guideTitle?: string
  guideText?: string
  featureTitle?: string
  features?: readonly string[]
  categoriesTitle?: string
  categories?: readonly string[]
  processTitle?: string
  processSteps?: readonly { title: string; text: string }[]
  ctaLabel: string
  ctaHref: string
  ctaSecondaryHref?: string
  ctaSecondaryLabel?: string
}

const SERVIZI_BASE = '/servizi'

export const SERVIZI_NAV_ITEMS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Timbri Personalizzati', href: `${SERVIZI_BASE}/timbri-personalizzati` },
  { label: 'Noleggio Stampanti', href: `${SERVIZI_BASE}/noleggio-stampanti` },
  { label: 'Shopper Personalizzate', href: `${SERVIZI_BASE}/shopper-personalizzate` },
  { label: 'Biglietti da Visita', href: `${SERVIZI_BASE}/biglietti-da-visita` },
  { label: 'Vetrofanie', href: `${SERVIZI_BASE}/vetrofanie` },
]

export const SERVIZI_PAGES: Record<ServizioSlug, ServizioPageContent> = {
  'timbri-personalizzati': {
    slug: 'timbri-personalizzati',
    navLabel: 'Timbri Personalizzati',
    path: `${SERVIZI_BASE}/timbri-personalizzati`,
    h1: 'Timbri Personalizzati & Sigilli su Misura',
    subtitle: 'Crea il tuo timbro personalizzato e lascia un’impronta indelebile.',
    description:
      'Scegli tra diversi modelli, ideali per un uso continuativo in ufficio o per personalizzare documenti importanti con le tue iniziali o il tuo logo aziendale.',
    guideTitle: 'Come trovare i timbri sul sito',
    guideText:
      'Dalla Homepage digita il modello desiderato nella barra di ricerca in alto, oppure naviga nella categoria Cancelleria > Timbri.',
    categoriesTitle: 'Categorie disponibili',
    categories: [
      'Timbri in Legno Classici',
      'Sigilli in Ottone e Ceralacca',
      'Autoinchiostranti Professionali',
      'Timbri Tascabili e Pre-inchiostrati',
    ],
    ctaLabel: 'Richiedi preventivo timbro',
    ctaHref: companyWhatsappHref(
      'Ciao, vorrei informazioni per un timbro personalizzato.',
    ),
    ctaSecondaryLabel: 'Vai a Cancelleria > Timbri',
    ctaSecondaryHref: '/office-products?category=Cancelleria&cancelleriaView=timbri',
  },
  'noleggio-stampanti': {
    slug: 'noleggio-stampanti',
    navLabel: 'Noleggio Stampanti',
    path: `${SERVIZI_BASE}/noleggio-stampanti`,
    h1: 'Noleggio Stampanti e Multifunzione Xerox',
    subtitle: 'Soluzioni di stampa ad alte prestazioni con assistenza all-inclusive.',
    featureTitle: 'Caratteristiche del servizio',
    features: [
      'Rivenditore Autorizzato Xerox con garanzie e certificazioni ufficiali.',
      'Modelli sia a Colori che in Bianco e Nero.',
      'Supporto formati standard e A3.',
      'Formula All-Inclusive: assistenza tecnica, installazione in sede, sostituzione pezzi e smaltimento a norma di toner e cartucce.',
      'Piena trasparenza sui costi del canone di noleggio.',
    ],
    guideTitle: 'Guida alla scelta del modello perfetto per la tua azienda',
    guideText:
      'Contattaci: ti aiutiamo a scegliere il multifunzione Xerox più adatto a volumi di stampa, formato (A4/A3) e necessità colore/bianco e nero, con un preventivo chiaro sul canone.',
    ctaLabel: 'Richiedi Preventivo Noleggio Gratuito',
    ctaHref: companyMailtoHref(
      'Richiesta preventivo noleggio stampanti Xerox',
      'Buongiorno,\nvorrei ricevere un preventivo gratuito per il noleggio di stampanti/multifunzione Xerox.\n\nAzienda:\nVolumi di stampa indicativi:\nPreferenza: Colore / B&N / A3:\n',
    ),
  },
  'shopper-personalizzate': {
    slug: 'shopper-personalizzate',
    navLabel: 'Shopper Personalizzate',
    path: `${SERVIZI_BASE}/shopper-personalizzate`,
    h1: 'Shopper e Buste Personalizzate per la tua Attività',
    subtitle: 'Promuovi la tua immagine con un packaging unico.',
    description:
      'Ampia scelta di materiali, grammature, colori di stampa e modelli per shopper e buste personalizzate con il tuo logo.',
    processTitle: 'Processo d’ordine',
    processSteps: [
      {
        title: 'Consulenza gratuita',
        text: 'Scegli modello e colore: ti ricontattiamo per definire l’idea.',
      },
      {
        title: 'Sviluppo & approvazione bozza',
        text: 'Esamina attentamente la bozza del logo che ti inviamo prima di andare in produzione.',
      },
      {
        title: 'Produzione e controllo qualità',
        text: 'Realizziamo la fornitura con verifica qualità prima della spedizione.',
      },
      {
        title: 'Consegna',
        text: 'Scegli tra spedizione a domicilio o Ritiro in Sede (mappa interattiva nei contatti sotto).',
      },
    ],
    ctaLabel: 'Richiedi Consulenza e Bozza Gratuita',
    ctaHref: companyMailtoHref(
      'Richiesta preventivo Shopper Personalizzate',
      'Buongiorno,\nvorrei una consulenza e una bozza gratuita per shopper/buste personalizzate.\n\nAzienda:\nQuantità indicativa:\nMateriale preferito (carta/plastica):\n',
    ),
    ctaSecondaryLabel: 'Vedi shopper a catalogo',
    ctaSecondaryHref: '/office-products?category=Cancelleria&cancelleriaView=shopper',
  },
  'biglietti-da-visita': {
    slug: 'biglietti-da-visita',
    navLabel: 'Biglietti da Visita',
    path: `${SERVIZI_BASE}/biglietti-da-visita`,
    h1: 'Biglietti da Visita Personalizzati',
    subtitle: 'Fai un’ottima prima impressione con una stampa professionale di alta qualità.',
    featureTitle: 'Opzioni disponibili',
    features: [
      'Stampa Fronte e Retro',
      'Plastificazione Opaca o Lucida',
      'Finiture con Dettagli e Loghi in Rilievo / UV',
      'Formato Tessera / Carte Fedeltà',
    ],
    processTitle: 'Processo d’ordine',
    processSteps: [
      {
        title: 'Invio file o idea',
        text: 'Condividi il materiale grafico o l’idea: ti seguiamo nella consulenza iniziale.',
      },
      {
        title: 'Bozza grafica',
        text: 'Ricevi una bozza da esaminare prima della produzione.',
      },
      {
        title: 'Approvazione',
        text: 'Confermi la bozza e avviamo la stampa professionale.',
      },
      {
        title: 'Spedizione o ritiro in sede',
        text: 'Consegna a domicilio oppure ritiro in sede con mappa nei contatti sotto.',
      },
    ],
    ctaLabel: 'Richiedi Preventivo e Bozza',
    ctaHref: companyMailtoHref(
      'Richiesta preventivo biglietti da visita',
      'Buongiorno,\nvorrei un preventivo e una bozza per biglietti da visita personalizzati.\n\nAzienda:\nQuantità:\nFiniture desiderate:\n',
    ),
  },
  'vetrofanie': {
    slug: 'vetrofanie',
    navLabel: 'Vetrofanie',
    path: `${SERVIZI_BASE}/vetrofanie`,
    h1: 'Vetrofanie e Decorazioni per Vetrine',
    subtitle: 'Rendi visibile la tua attività commerciale e i tuoi uffici.',
    description:
      'Progettazione e intaglio di pellicole per vetrine ad alta resistenza. Ideali per saldi, promozioni temporanee, orari, loghi permanenti ed effetto sabbiato opaco per la privacy.',
    ctaLabel: 'Richiedi Sopralluogo o Preventivo',
    ctaHref: companyMailtoHref(
      'Richiesta sopralluogo / preventivo vetrofanie',
      'Buongiorno,\nvorrei un sopralluogo o un preventivo per vetrofanie / decorazioni vetrine.\n\nAzienda / attività:\nIndirizzo:\nTipo di intervento (saldi, logo, orari, sabbiato):\n',
    ),
  },
}

export function isServizioSlug(raw: string): raw is ServizioSlug {
  return Object.prototype.hasOwnProperty.call(SERVIZI_PAGES, raw)
}

export function getServizioPage(slug: string): ServizioPageContent | null {
  if (!isServizioSlug(slug)) return null
  return SERVIZI_PAGES[slug]
}

export function allServiziStaticPaths(): string[] {
  return SERVIZI_NAV_ITEMS.map((i) => i.href)
}

export const SERVIZI_SLUGS = Object.keys(SERVIZI_PAGES) as ServizioSlug[]

