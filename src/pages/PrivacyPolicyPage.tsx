type TocItem = { id: string; label: string }

const TOC: TocItem[] = [
  { id: 'titolare', label: '1. Titolare del trattamento' },
  { id: 'dati-raccolti', label: '2. Categorie di dati trattati' },
  { id: 'finalita', label: '3. Finalita e base giuridica' },
  { id: 'conservazione', label: '4. Periodo di conservazione' },
  { id: 'comunicazione', label: '5. Comunicazione e responsabili' },
  { id: 'diritti', label: '6. Diritti dell interessato (GDPR)' },
  { id: 'contatti', label: '7. Contatti privacy' },
]

export function PrivacyPolicyPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-600">Informativa resa ai sensi del Regolamento (UE) 2016/679 (GDPR).</p>

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

        <section id="titolare" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">1. Titolare del trattamento</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Titolare del trattamento e Astro Forniture s.r.l., con sede in Largo di Porta Pradella 2, Mantova.
          </p>
        </section>

        <section id="dati-raccolti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">2. Categorie di dati trattati</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il sito puo trattare dati anagrafici, di contatto, fiscali e relativi all&apos;ordine (prodotti acquistati,
            importi, indirizzo di consegna/fatturazione), nonche dati tecnici necessari al funzionamento del servizio.
          </p>
        </section>

        <section id="finalita" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">3. Finalita e base giuridica</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I dati personali sono trattati esclusivamente per la gestione dell&apos;ordine, adempimenti amministrativi,
            fatturazione, assistenza post-vendita e obblighi di legge. La base giuridica e l&apos;esecuzione del contratto
            e/o l&apos;adempimento di obblighi legali.
          </p>
        </section>

        <section id="conservazione" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">4. Periodo di conservazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I dati sono conservati per il tempo strettamente necessario al perseguimento delle finalita indicate e, ove
            richiesto, per i termini previsti dalla normativa civilistica, fiscale e contabile.
          </p>
        </section>

        <section id="comunicazione" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">5. Comunicazione e responsabili</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I dati possono essere comunicati a soggetti terzi nominati responsabili del trattamento (es. fornitori
            tecnologici, corrieri, consulenti amministrativi/fiscali), esclusivamente nei limiti necessari
            all&apos;erogazione del servizio e nel rispetto del GDPR.
          </p>
        </section>

        <section id="diritti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">6. Diritti dell interessato (GDPR)</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            L&apos;interessato puo esercitare i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e
            portabilita, oltre al diritto di proporre reclamo all&apos;Autorita Garante per la protezione dei dati personali.
          </p>
        </section>

        <section id="contatti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">7. Contatti privacy</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per richieste in materia privacy, il Cliente puo contattare Astro Forniture s.r.l. ai recapiti ufficiali
            indicati sul sito istituzionale e nelle pagine di contatto.
          </p>
        </section>
      </div>
    </main>
  )
}
