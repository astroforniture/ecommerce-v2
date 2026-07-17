type TocItem = { id: string; label: string }

const TOC: TocItem[] = [
  { id: 'identita-venditore', label: '1. Identita del venditore' },
  { id: 'ambito-applicazione', label: '2. Ambito di applicazione' },
  { id: 'prezzi-e-iva', label: '3. Prezzi e IVA' },
  { id: 'ordini-e-conclusione', label: '4. Ordini e conclusione del contratto' },
  { id: 'b2c-b2b', label: '5. Clientela B2C e B2B' },
  { id: 'spedizioni-ritiro', label: '6. Spedizioni e ritiro in sede' },
  { id: 'disponibilita', label: '7. Disponibilita prodotti e immagini' },
  { id: 'pagamenti', label: '8. Pagamenti e fatturazione' },
  { id: 'garanzia-e-resi', label: '9. Garanzia legale e resi' },
  { id: 'foro-competente', label: '10. Legge applicabile e foro competente' },
]

export function TermsSalesPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Termini e Condizioni di Vendita
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Ultimo aggiornamento: 08/04/2026
        </p>

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

        <section id="identita-venditore" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">1. Identita del venditore</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il presente sito di commercio elettronico e gestito da Astro Forniture s.r.l., con sede
            in Largo di Porta Pradella 2, Mantova, Italia (di seguito, "Venditore").
          </p>
        </section>

        <section id="ambito-applicazione" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">2. Ambito di applicazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I presenti Termini disciplinano la vendita online di prodotti per ufficio, cancelleria,
            carta, registratori, accessori e beni correlati. L&apos;inoltro di un ordine implica piena
            accettazione dei presenti Termini.
          </p>
        </section>

        <section id="prezzi-e-iva" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">3. Prezzi e IVA</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I prezzi dei prodotti sono esposti IVA esclusa (imponibile), salvo diversa indicazione.
            L&apos;IVA applicabile viene calcolata e mostrata in fase di checkout, unitamente al totale
            finale dell&apos;ordine.
          </p>
        </section>

        <section id="ordini-e-conclusione" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">4. Ordini e conclusione del contratto</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            L&apos;ordine inviato dal Cliente costituisce proposta di acquisto. Il contratto si perfeziona
            con l&apos;accettazione dell&apos;ordine da parte del Venditore, comunicata tramite conferma
            elettronica o esecuzione della fornitura.
          </p>
        </section>

        <section id="b2c-b2b" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">5. Clientela B2C e B2B</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per Cliente consumatore privato (B2C), ai sensi del Codice del Consumo, e previsto il
            diritto di recesso entro 14 giorni dalla consegna, salvo eccezioni di legge.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per Cliente professionista/azienda con Partita IVA (B2B), il diritto di recesso non trova
            applicazione nei casi previsti dalla normativa vigente.
          </p>
        </section>

        <section id="spedizioni-ritiro" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">6. Spedizioni e ritiro in sede</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Cliente puo scegliere tra spedizione a domicilio e ritiro gratuito presso il punto
            vendita di Mantova (Largo di Porta Pradella 2). I tempi di consegna variano in base alla
            disponibilita del prodotto, all&apos;area di destinazione e ai tempi del vettore.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Eventuali ritardi imputabili a cause di forza maggiore o a terzi non sono imputabili al
            Venditore, fermo restando il diritto del Cliente alle tutele previste dalla legge.
          </p>
        </section>

        <section id="disponibilita" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">7. Disponibilita prodotti e immagini</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Le immagini dei prodotti hanno finalita illustrativa e possono non rappresentare in modo
            perfettamente fedele il prodotto reale (es. variazioni di colore, packaging, dettaglio).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            In caso di indisponibilita sopravvenuta del prodotto ordinato, il Cliente verra
            tempestivamente informato e potra scegliere tra rimborso dell&apos;importo versato o proposta
            di prodotto sostitutivo equivalente.
          </p>
        </section>

        <section id="pagamenti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">8. Pagamenti e fatturazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I metodi di pagamento disponibili sono indicati nel checkout. Per i soggetti con Partita
            IVA, la fatturazione avviene sulla base dei dati fiscali forniti dal Cliente, che ne
            garantisce correttezza e completezza.
          </p>
        </section>

        <section id="garanzia-e-resi" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">9. Garanzia legale e resi</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per i consumatori si applica la garanzia legale di conformita ai sensi della normativa
            vigente. Restano salvi i diritti del Cliente in caso di prodotto difettoso o non conforme.
          </p>
        </section>

        <section id="foro-competente" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">10. Legge applicabile e foro competente</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I presenti Termini sono regolati dalla legge italiana. Per ogni controversia relativa a
            interpretazione, validita o esecuzione, il foro competente e il Foro di Mantova, fatti
            salvi gli eventuali fori inderogabili previsti per il consumatore.
          </p>
        </section>
      </div>
    </main>
  )
}
