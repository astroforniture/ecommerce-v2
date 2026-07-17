import { Award, Clock, Handshake, Headphones } from 'lucide-react'

const FOOTER_VALUES: ReadonlyArray<{
  title: string
  description: string
  Icon: typeof Award
}> = [
  {
    title: 'Qualità',
    description: 'Selezioniamo solo prodotti affidabili dai migliori marchi.',
    Icon: Award,
  },
  {
    title: 'Affidabilità',
    description: 'Rispettiamo gli impegni, sempre.',
    Icon: Handshake,
  },
  {
    title: 'Tempestività',
    description: 'Consegne rapide e puntuali.',
    Icon: Clock,
  },
  {
    title: 'Assistenza dedicata',
    description: 'Un referente sempre a disposizione.',
    Icon: Headphones,
  },
]

const Footer = () => {
  return (
    <footer className="mt-auto w-full min-w-0 bg-white">
      <section
        className="w-full min-w-0 border-b border-slate-900/25 bg-[#0a1f3d] text-white"
        aria-labelledby="footer-valori-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-10 text-center sm:px-6 sm:py-11 lg:px-10 lg:py-12 xl:px-14">
          <p
            id="footer-valori-heading"
            className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 sm:text-sm"
          >
            I nostri valori
          </p>
          <ul className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-10 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-8">
            {FOOTER_VALUES.map(({ title, description, Icon }) => (
              <li key={title} className="flex flex-col items-center gap-3 text-center sm:gap-2.5">
                <span className="text-orange-400">
                  <Icon className="size-9 sm:size-8" strokeWidth={1.35} aria-hidden />
                </span>
                <span className="block text-xs font-bold uppercase tracking-wide text-white">{title}</span>
                <span className="block max-w-xs text-sm leading-relaxed text-white/90 sm:max-w-none">
                  {description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="w-full border-t border-slate-200 px-4 py-8 text-slate-700 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-1.5 text-sm leading-relaxed md:text-left">
            <p className="font-semibold text-slate-900">Astro Forniture di Borella Mario</p>
            <p>Sede: Str Cisa 7 - 46047 Porto M.no (MN)</p>
            <p className="text-xs text-slate-600 sm:text-sm">
              C.F.: BRLMRA78D11L750E - P.IVA: 02383560204
            </p>
            <p className="text-xs text-slate-600 sm:text-sm">
              SDI: T04ZHR3 - Tel.{' '}
              <a className="underline-offset-4 hover:underline" href="tel:0376329959">
                0376 329959
              </a>
            </p>
            <p>
              Email:{' '}
              <a className="underline-offset-4 hover:underline" href="mailto:info@astro-forniture.it">
                info@astro-forniture.it
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
