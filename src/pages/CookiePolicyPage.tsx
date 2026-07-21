import { Link } from 'react-router-dom'
import { openCookiePreferencesEvent } from '../lib/cookieConsent'

type TocItem = { id: string; label: string }

const TOC: TocItem[] = [
  { id: 'cosa-sono', label: '1. Cosa sono i cookie' },
  { id: 'categorie', label: '2. Categorie di cookie' },
  { id: 'base-giuridica', label: '3. Base giuridica' },
  { id: 'durata', label: '4. Durata e gestione cookie' },
  { id: 'diritti', label: '5. Diritti dell utente' },
]

export function CookiePolicyPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cookie Policy</h1>
        <p className="mt-3 text-sm text-slate-600">Informazioni sull&apos;uso dei cookie e tecnologie analoghe.</p>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => openCookiePreferencesEvent()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Gestisci preferenze cookie
          </button>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Indice</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-brand-700 hover:text-brand-900 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="cosa-sono" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">1. Cosa sono i cookie</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I cookie sono piccoli file di testo che i siti web inviano al dispositivo dell&apos;utente per migliorare
            l&apos;esperienza di navigazione e consentire il corretto funzionamento dei servizi.
          </p>
        </section>

        <section id="categorie" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">2. Categorie di cookie</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>
              <strong>Tecnici:</strong> indispensabili al carrello, sessione e sicurezza. Sempre attivi, senza
              consenso preventivo.
            </li>
            <li>
              <strong>Analitici:</strong> misurano l&apos;uso del sito in forma aggregata. Attivati solo con consenso.
            </li>
            <li>
              <strong>Marketing:</strong> possono supportare contenuti e offerte personalizzate. Attivati solo con
              consenso.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            La scelta viene salvata nel browser (localStorage) e non viene riproposta a ogni pagina; puoi
            modificarla in qualsiasi momento dal banner o da questa pagina.
          </p>
        </section>

        <section id="base-giuridica" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">3. Base giuridica</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per i cookie tecnici il trattamento si fonda sull&apos;esecuzione del servizio richiesto. Per analitici e
            marketing la base giuridica è il consenso dell&apos;utente, revocabile in ogni momento.
          </p>
        </section>

        <section id="durata" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">4. Durata e gestione cookie</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I cookie tecnici possono essere di sessione o persistenti per il tempo strettamente necessario. L&apos;utente puo
            gestire o disabilitare i cookie tramite le impostazioni del browser; tale disabilitazione puo compromettere
            il funzionamento del carrello e del checkout. Per analitici e marketing usa il pulsante &quot;Gestisci
            preferenze cookie&quot; sopra oppure consulta la{' '}
            <Link to="/privacy-policy" className="font-semibold text-brand-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section id="diritti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">5. Diritti dell utente</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Restano applicabili i diritti previsti dal GDPR, come indicato nella Privacy Policy, inclusi accesso,
            rettifica, cancellazione, limitazione e opposizione.
          </p>
        </section>
      </div>
    </main>
  )
}
