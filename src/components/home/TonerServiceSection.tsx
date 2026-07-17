import { Link } from 'react-router-dom'
import { CheckCircle2, Droplets, ShieldCheck } from 'lucide-react'

const points = [
  {
    icon: ShieldCheck,
    title: 'Qualità certificata',
    text: 'Compatibili testati per resa colore, resa pagina e affidabilità sui tuoi modelli.',
  },
  {
    icon: Droplets,
    title: 'Passaggio guidato',
    text: 'Ti aiutiamo nel passaggio da toner originale a compatibile senza interruzioni di lavoro.',
  },
  {
    icon: CheckCircle2,
    title: 'Supporto dedicato',
    text: 'Consulenza su volumi, ricambi e piani di ricarica in base al tuo parco stampanti.',
  },
]

export function TonerServiceSection() {
  return (
    <section
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="toner-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-slate-100 bg-gradient-to-br from-brand-50 to-white p-10 sm:p-12 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Servizio toner
              </p>
              <h2
                id="toner-heading"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Da originale a compatibile, in sicurezza
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Riduci i costi di stampa mantenendo standard professionali. Il nostro
                servizio è pensato per chi vuole chiarezza sui consumi, garanzia sui
                prodotti e un interlocutore unico per ordini e assistenza.
              </p>
              <ul className="mt-8 space-y-4">
                {points.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                      <p.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {p.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center p-10 sm:p-12">
              <blockquote className="rounded-2xl border border-slate-100 bg-surface p-8 text-slate-700">
                <p className="text-lg font-medium leading-relaxed text-slate-800">
                  &ldquo;Obiettivo: meno sprechi, più controllo. Ti proponiamo solo
                  alternative compatibili in linea con il tuo utilizzo reale.&rdquo;
                </p>
                <footer className="mt-6 text-sm text-muted">
                  — Team commerciale Astro Forniture
                </footer>
              </blockquote>
              <Link
                to="/contatti-toner"
                className="mt-8 inline-flex w-fit items-center justify-center rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Richiedi una consulenza toner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
