import { Link } from 'react-router-dom'
import {
  COMPANY_ADDRESS_MANTOVA,
  COMPANY_EMAIL,
  COMPANY_LANDLINE_DISPLAY,
} from '../data/companyContacts'

type TocItem = { id: string; label: string }

const TOC: TocItem[] = [
  { id: 'ambito', label: '1. Ambito di applicazione' },
  { id: 'recesso-consumatori', label: '2. Diritto di recesso (14 giorni)' },
  { id: 'come-esercitare', label: '3. Come esercitare il reso' },
  { id: 'spedizione-reso', label: '4. Spedizione del reso e costi' },
  { id: 'rimborso', label: '5. Tempi e modalità di rimborso' },
  { id: 'esclusioni', label: '6. Casi di esclusione' },
  { id: 'b2b', label: '7. Clienti professionali (B2B)' },
  { id: 'garanzia', label: '8. Resi per difetto / garanzia' },
  { id: 'contatti', label: '9. Contatti' },
]

/** Pagina dedicata «Norme sui resi» per Google Merchant Center e clienti. */
export function ReturnPolicyPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Norme sui resi e rimborsi</h1>
        <p className="mt-3 text-sm text-slate-600">
          Politica di reso e diritto di recesso di Astro Forniture. Ultimo aggiornamento: 15/08/2026.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          La presente pagina descrive le condizioni di reso e rimborso applicabili agli acquisti effettuati
          sul sito{' '}
          <a className="font-semibold text-brand-700 hover:underline" href="https://www.asforniture.it">
            www.asforniture.it
          </a>
          . Per il quadro contrattuale completo si veda anche i{' '}
          <Link to="/termini-condizioni-vendita" className="font-semibold text-brand-700 hover:underline">
            Termini e Condizioni di Vendita
          </Link>
          .
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

        <section id="ambito" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">1. Ambito di applicazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Le presenti norme si applicano agli ordini di prodotti venduti online da Astro Forniture s.r.l.,
            con sede in {COMPANY_ADDRESS_MANTOVA}, Italia (di seguito, &quot;Venditore&quot;), tramite il sito
            asforniture.it.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Paese di reso:</strong> Italia. I prodotti devono essere restituiti all&apos;indirizzo
            indicato al punto 4.
          </p>
        </section>

        <section id="recesso-consumatori" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">2. Diritto di recesso (14 giorni)</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Cliente <strong>consumatore</strong> (B2C), ai sensi del Codice del Consumo (D.Lgs. 206/2005),
            ha diritto di recedere dal contratto senza indicarne i motivi entro <strong>14 giorni</strong>{' '}
            dal giorno in cui il consumatore (o un terzo da lui designato, diverso dal vettore) entra in
            possesso fisico del bene.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Finestra di reso:</strong> 14 giorni dalla consegna. Il reso deve essere spedito entro
            14 giorni dalla comunicazione di recesso.
          </p>
        </section>

        <section id="come-esercitare" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">3. Come esercitare il reso</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per esercitare il recesso, il Cliente deve informare il Venditore con una dichiarazione
            esplicita inviata a{' '}
            <a className="font-semibold text-brand-700 hover:underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{' '}
            (oppure tramite i canali di assistenza indicati nella pagina{' '}
            <Link to="/contatti" className="font-semibold text-brand-700 hover:underline">
              Contatti
            </Link>
            ), indicando:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>numero d&apos;ordine;</li>
            <li>dati anagrafici e recapito;</li>
            <li>elenco dei beni oggetto di reso;</li>
            <li>eventuale motivazione (facoltativa per il recesso B2C).</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            È possibile utilizzare il modulo tipo di recesso previsto dall&apos;Allegato I, parte B, del
            Codice del Consumo, senza che ciò sia obbligatorio.
          </p>
        </section>

        <section id="spedizione-reso" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">4. Spedizione del reso e costi</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Entro 14 giorni dalla comunicazione del recesso, il Cliente restituisce i beni{' '}
            <strong>integri</strong>, nella confezione originale ove possibile, all&apos;indirizzo:
          </p>
          <p className="mt-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
            Astro Forniture s.r.l. — {COMPANY_ADDRESS_MANTOVA}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Salvo diverso accordo scritto, le <strong>spese di spedizione del reso</strong> sono a carico
            del Cliente. Si consiglia di utilizzare un servizio di spedizione tracciabile e di conservare la
            prova di spedizione.
          </p>
        </section>

        <section id="rimborso" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">5. Tempi e modalità di rimborso</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Venditore rimborsa i pagamenti ricevuti per i beni restituiti, compresi i costi di consegna
            standard (esclusi costi aggiuntivi per modalità di consegna diverse da quella meno costosa
            offerta), senza indebito ritardo e comunque entro <strong>14 giorni</strong> dal giorno in cui
            è informato della decisione di recedere.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Venditore si riserva di trattenere il rimborso fino alla ricezione dei beni o fino alla
            prova dell&apos;avvenuta spedizione. Il rimborso avviene con lo stesso mezzo di pagamento usato
            per l&apos;acquisto, salvo diverso accordo con il Cliente.
          </p>
        </section>

        <section id="esclusioni" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">6. Casi di esclusione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il diritto di recesso è escluso nei casi previsti dall&apos;art. 59 del Codice del Consumo,
            tra cui, a titolo esemplificativo:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>beni confezionati su misura o chiaramente personalizzati;</li>
            <li>
              beni sigillati non idonei alla restituzione per motivi igienici o di protezione della salute,
              aperti dopo la consegna;
            </li>
            <li>altri casi previsti dalla normativa vigente.</li>
          </ul>
        </section>

        <section id="b2b" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">7. Clienti professionali (B2B)</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per Cliente professionista/azienda con Partita IVA (B2B), il diritto di recesso previsto per i
            consumatori non trova applicazione, salvi diversi accordi commerciali scritti con il Venditore.
          </p>
        </section>

        <section id="garanzia" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">8. Resi per difetto / garanzia</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            In caso di prodotto difettoso o non conforme, il Cliente consumatore può avvalersi della{' '}
            <strong>garanzia legale di conformità</strong> (2 anni dalla consegna), come descritto nei{' '}
            <Link
              to="/termini-condizioni-vendita#garanzia-legale"
              className="font-semibold text-brand-700 hover:underline"
            >
              Termini e Condizioni di Vendita
            </Link>
            . Contattare il Servizio Clienti indicando numero d&apos;ordine, codice articolo e descrizione
            del problema: in questi casi le modalità di reso/rimborso o sostituzione seguono la normativa
            di garanzia e potranno differire dal recesso volontario.
          </p>
        </section>

        <section id="contatti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">9. Contatti</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Astro Forniture s.r.l. — {COMPANY_ADDRESS_MANTOVA}
            <br />
            E-mail:{' '}
            <a className="font-semibold text-brand-700 hover:underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
            <br />
            Tel. {COMPANY_LANDLINE_DISPLAY}
            <br />
            <Link to="/contatti" className="font-semibold text-brand-700 hover:underline">
              Pagina Contatti
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
