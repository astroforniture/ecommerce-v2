import { Link } from 'react-router-dom'
import {
  COMPANY_ADDRESS_MANTOVA,
  COMPANY_EMAIL,
  COMPANY_LANDLINE_DISPLAY,
} from '../data/companyContacts'

type TocItem = { id: string; label: string }

const TOC: TocItem[] = [
  { id: 'identita-venditore', label: '1. Identità del venditore' },
  { id: 'ambito-applicazione', label: '2. Ambito di applicazione' },
  { id: 'prezzi-e-iva', label: '3. Prezzi e IVA' },
  { id: 'ordini-e-conclusione', label: '4. Ordini e conclusione del contratto' },
  { id: 'diritto-di-recesso', label: '5. Diritto di recesso (14 giorni)' },
  { id: 'spedizioni-ritiro', label: '6. Spedizioni e ritiro in sede' },
  { id: 'disponibilita', label: '7. Disponibilità prodotti e immagini' },
  { id: 'pagamenti', label: '8. Pagamenti e fatturazione' },
  { id: 'garanzia-legale', label: '9. Garanzia legale di conformità (2 anni)' },
  { id: 'sicurezza-prodotti-gpsr', label: '10. Sicurezza dei prodotti (GPSR)' },
  { id: 'foro-competente', label: '11. Legge applicabile e foro competente' },
]

export function TermsSalesPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Termini e Condizioni di Vendita
        </h1>
        <p className="mt-3 text-sm text-slate-600">Ultimo aggiornamento: 10/08/2026</p>

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
          <h3 className="text-lg font-semibold text-slate-900">1. Identità del venditore</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il presente sito di commercio elettronico è gestito da Astro Forniture s.r.l., con sede in{' '}
            {COMPANY_ADDRESS_MANTOVA}, Italia (di seguito, &quot;Venditore&quot;). Contatti:{' '}
            <a className="font-semibold text-brand-700 hover:underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
            , tel. {COMPANY_LANDLINE_DISPLAY}.
          </p>
        </section>

        <section id="ambito-applicazione" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">2. Ambito di applicazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I presenti Termini disciplinano la vendita online di prodotti per ufficio, cancelleria, carta,
            registratori, dispositivi e beni correlati. L&apos;inoltro di un ordine implica piena accettazione
            dei presenti Termini e della{' '}
            <Link to="/privacy-policy" className="font-semibold text-brand-700 hover:underline">
              Privacy Policy
            </Link>
            .
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

        <section id="diritto-di-recesso" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">5. Diritto di recesso (14 giorni)</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Cliente consumatore (B2C), ai sensi del Codice del Consumo (D.Lgs. 206/2005), ha diritto di
            recedere dal contratto senza indicarne i motivi entro <strong>14 giorni</strong> dal giorno in
            cui il consumatore (o un terzo da lui designato, diverso dal vettore) entra in possesso fisico
            del bene.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per esercitare il recesso, il Cliente deve informare il Venditore con una dichiarazione
            esplicita (es. lettera inviata per posta, e-mail a {COMPANY_EMAIL} o comunicazione tramite i
            canali di assistenza indicati sul sito), indicando numero d&apos;ordine, dati anagrafici e beni
            oggetto di reso. È possibile utilizzare il modulo tipo di recesso previsto dall&apos;Allegato I,
            parte B, del Codice del Consumo, senza che ciò sia obbligatorio.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Entro 14 giorni dalla comunicazione del recesso, il Cliente restituisce i beni integri, nella
            confezione originale ove possibile, a proprie spese salvo diverso accordo, all&apos;indirizzo:{' '}
            {COMPANY_ADDRESS_MANTOVA}. Il Venditore rimborsa i pagamenti ricevuti, compresi i costi di
            consegna standard (esclusi costi aggiuntivi per modalità di consegna diverse da quella meno
            costosa offerta), senza indebito ritardo e comunque entro 14 giorni dal giorno in cui è
            informato della decisione di recedere, riservandosi di trattenere il rimborso fino alla
            ricezione dei beni o alla prova dell&apos;avvenuta spedizione.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il diritto di recesso è escluso nei casi previsti dall&apos;art. 59 del Codice del Consumo
            (es. beni confezionati su misura o chiaramente personalizzati, beni sigillati non idonei alla
            restituzione per motivi igienici o di protezione della salute aperti dopo la consegna, ecc.).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per Cliente professionista/azienda con Partita IVA (B2B), il diritto di recesso previsto per i
            consumatori non trova applicazione, salvi diversi accordi commerciali.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Dettaglio operativo su modalità di reso e rimborso:{' '}
            <Link to="/politica-resi" className="font-semibold text-brand-700 hover:underline">
              Norme sui resi
            </Link>
            .
          </p>
        </section>

        <section id="spedizioni-ritiro" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">6. Spedizioni e ritiro in sede</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Cliente può scegliere tra spedizione a domicilio e ritiro gratuito presso il punto vendita di
            Mantova ({COMPANY_ADDRESS_MANTOVA}). I tempi di consegna variano in base alla disponibilità del
            prodotto, all&apos;area di destinazione e ai tempi del vettore.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Eventuali ritardi imputabili a cause di forza maggiore o a terzi non sono imputabili al
            Venditore, fermo restando il diritto del Cliente alle tutele previste dalla legge.
          </p>
        </section>

        <section id="disponibilita" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">7. Disponibilità prodotti e immagini</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Le immagini dei prodotti hanno finalità illustrativa e possono non rappresentare in modo
            perfettamente fedele il prodotto reale (es. variazioni di colore, packaging, dettaglio).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            In caso di indisponibilità sopravvenuta del prodotto ordinato, il Cliente verrà tempestivamente
            informato e potrà scegliere tra rimborso dell&apos;importo versato o proposta di prodotto
            sostitutivo equivalente.
          </p>
        </section>

        <section id="pagamenti" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">8. Pagamenti e fatturazione</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I metodi di pagamento disponibili sono indicati nel checkout. Per i soggetti con Partita IVA,
            la fatturazione avviene sulla base dei dati fiscali forniti dal Cliente, che ne garantisce
            correttezza e completezza.
          </p>
        </section>

        <section id="garanzia-legale" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            9. Garanzia legale di conformità (2 anni)
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Ai sensi del Codice del Consumo, il Venditore è responsabile nei confronti del consumatore per
            qualsiasi difetto di conformità esistente al momento della consegna del bene. La{' '}
            <strong>garanzia legale di conformità</strong> ha durata di <strong>due (2) anni</strong> dalla
            consegna per i beni di consumo acquistati da Cliente consumatore (B2C).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            In caso di difetto di conformità, il consumatore ha diritto al ripristino della conformità
            mediante riparazione o sostituzione, oppure — nei casi previsti dalla legge — alla riduzione
            del prezzo o alla risoluzione del contratto. La denuncia del difetto va effettuata entro i
            termini di legge. Restano salvi i diritti derivanti da eventuali garanzie convenzionali del
            produttore, che non sostituiscono né limitano la garanzia legale.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per i Clienti B2B si applicano le norme del Codice Civile in materia di vizi della cosa venduta
            e gli eventuali accordi commerciali, fermo restando quanto previsto dalla garanzia del
            produttore ove applicabile.
          </p>
        </section>

        <section id="sicurezza-prodotti-gpsr" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            10. Sicurezza dei prodotti (GPSR — Regolamento UE 2023/988)
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Il Venditore commercializza prodotti conformi alla normativa europea in materia di sicurezza
            generale dei prodotti, incluso il Regolamento (UE) 2023/988 (GPSR), per quanto applicabile ai
            beni offerti sul sito.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Nelle schede prodotto, ove disponibili, sono indicati i riferimenti al produttore e/o
            all&apos;importatore / responsabile economico nell&apos;Unione Europea, nonché le avvertenze e le
            informazioni di sicurezza rilevanti. Il Cliente è tenuto a consultare tali indicazioni e le
            istruzioni d&apos;uso allegate al prodotto prima dell&apos;utilizzo.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per segnalazioni relative alla sicurezza di un prodotto (difetti, incidenti, rischi), il Cliente
            può contattare il Venditore a {COMPANY_EMAIL} o ai recapiti indicati nella pagina Contatti,
            fornendo codice articolo, numero d&apos;ordine e descrizione del problema. Il Venditore collabora
            con le autorità e gli operatori economici della filiera secondo gli obblighi di legge.
          </p>
        </section>

        <section id="foro-competente" className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            11. Legge applicabile e foro competente
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            I presenti Termini sono regolati dalla legge italiana.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per le controversie con Cliente <strong>consumatore</strong>, è competente in via esclusiva il
            foro del luogo di <strong>residenza o domicilio eletto del consumatore</strong>, ai sensi della
            normativa vigente a tutela del consumatore. Il consumatore può inoltre avvalersi della
            piattaforma europea di risoluzione delle controversie online (ODR), ove applicabile.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Per le controversie con Cliente professionista/azienda (B2B), è competente in via esclusiva il
            Foro di Mantova, salvi eventuali fori inderogabili di legge.
          </p>
        </section>
      </div>
    </main>
  )
}
