/**
 * Alberatura footer «Note Legali – Governance».
 * Le voci senza documento dedicato usano pagine placeholder sotto `/note-legali-governance/*`.
 */

export type LegalGovernanceLink = {
  label: string
  to: string
  /** Se true, è una pagina placeholder (contenuto in aggiornamento). */
  placeholder?: boolean
}

export const LEGAL_GOVERNANCE_HUB_PATH = '/note-legali-governance'

export const LEGAL_GOVERNANCE_FOOTER_LINKS: readonly LegalGovernanceLink[] = [
  {
    label: 'Governance, Etica, Ambiente',
    to: LEGAL_GOVERNANCE_HUB_PATH,
  },
  {
    label: 'MOG',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/mog`,
    placeholder: true,
  },
  {
    label: 'Codice Etico',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/codice-etico`,
    placeholder: true,
  },
  {
    label: 'Whistleblowing',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/whistleblowing`,
    placeholder: true,
  },
  {
    label: 'Politica Aziendale',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/politica-aziendale`,
    placeholder: true,
  },
  {
    label: 'Informativa Intelligenza Artificiale',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/informativa-intelligenza-artificiale`,
    placeholder: true,
  },
  {
    label: 'Misure Restrittive dell\'Unione Europea',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/misure-restrittive-ue`,
    placeholder: true,
  },
  {
    label: 'Condizioni di Vendita e Garanzia',
    to: '/termini-condizioni-vendita',
  },
  {
    label: 'Privacy e cookie',
    to: `${LEGAL_GOVERNANCE_HUB_PATH}/privacy-e-cookie`,
  },
] as const

export type LegalGovernanceDocSlug =
  | 'mog'
  | 'codice-etico'
  | 'whistleblowing'
  | 'politica-aziendale'
  | 'informativa-intelligenza-artificiale'
  | 'misure-restrittive-ue'
  | 'privacy-e-cookie'

export type LegalGovernanceDoc = {
  slug: LegalGovernanceDocSlug
  title: string
  summary: string
  /** Link a documenti già pubblicati sul sito. */
  relatedLinks?: ReadonlyArray<{ label: string; to: string }>
}

export const LEGAL_GOVERNANCE_DOCS: readonly LegalGovernanceDoc[] = [
  {
    slug: 'mog',
    title: 'MOG — Modello di Organizzazione e Gestione',
    summary:
      'Documento in aggiornamento. Il Modello di Organizzazione, Gestione e Controllo (D.Lgs. 231/2001) sarà pubblicato a breve in questa sezione.',
  },
  {
    slug: 'codice-etico',
    title: 'Codice Etico',
    summary:
      'Documento in aggiornamento. I principi di condotta e i valori aziendali di Astro Forniture saranno disponibili a breve in questa pagina.',
  },
  {
    slug: 'whistleblowing',
    title: 'Whistleblowing',
    summary:
      'Canale di segnalazione in aggiornamento. Le modalità di whistleblowing ai sensi della normativa vigente saranno pubblicate a breve.',
  },
  {
    slug: 'politica-aziendale',
    title: 'Politica Aziendale',
    summary:
      'Documento in aggiornamento. La politica aziendale (qualità, sicurezza, responsabilità sociale) sarà pubblicata a breve.',
  },
  {
    slug: 'informativa-intelligenza-artificiale',
    title: 'Informativa Intelligenza Artificiale',
    summary:
      'Informativa in aggiornamento. Le modalità di utilizzo di strumenti di intelligenza artificiale nei processi aziendali e sul sito saranno descritte a breve.',
  },
  {
    slug: 'misure-restrittive-ue',
    title: 'Misure Restrittive dell\'Unione Europea',
    summary:
      'Informativa in aggiornamento. Astro Forniture opera nel rispetto delle misure restrittive dell\'Unione Europea; il dettaglio operativo sarà pubblicato a breve.',
  },
  {
    slug: 'privacy-e-cookie',
    title: 'Privacy e cookie',
    summary:
      'Consulta le informative complete su trattamento dei dati personali e utilizzo dei cookie.',
    relatedLinks: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
    ],
  },
]

export function legalGovernanceDocBySlug(
  slug: string | undefined,
): LegalGovernanceDoc | undefined {
  if (!slug) return undefined
  return LEGAL_GOVERNANCE_DOCS.find((d) => d.slug === slug)
}
