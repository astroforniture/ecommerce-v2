import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Briefcase,
  FileText,
  MapPin,
  MessageSquare,
  Truck,
} from 'lucide-react'

type StrengthTone = 'medical'

type StrengthItem = {
  icon: LucideIcon
  text: string
  tone: StrengthTone
}

const STRENGTHS: readonly StrengthItem[] = [
  {
    icon: MapPin,
    text: 'Sede fisica a Mantova',
    tone: 'medical',
  },
  {
    icon: Truck,
    text: 'Consegna diretta in zona Mantova',
    tone: 'medical',
  },
  {
    icon: FileText,
    text: 'Fatturazione elettronica',
    tone: 'medical',
  },
  {
    icon: MessageSquare,
    text: 'Assistenza telefonica e WhatsApp',
    tone: 'medical',
  },
  {
    icon: Briefcase,
    text: 'Prezzi riservati per aziende',
    tone: 'medical',
  },
  {
    icon: Building2,
    text: 'Forniture continuative per uffici, scuole e professionisti',
    tone: 'medical',
  },
] as const

const ICON_TONE_CLASS: Record<StrengthTone, string> = {
  medical: 'bg-medical-100 text-medical-700 ring-medical-200/70',
}

function StrengthCard({ icon: Icon, text, tone }: StrengthItem) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-medical-200 hover:bg-medical-50/40 hover:shadow-md">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ${ICON_TONE_CLASS[tone]}`}
        aria-hidden
      >
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <p className="pt-0.5 text-sm font-bold leading-snug text-slate-900 sm:text-[0.95rem]">
        {text}
      </p>
    </article>
  )
}

export function WhyChooseUs() {
  return (
    <section
      className="border-t border-slate-100 bg-slate-50 py-12 sm:py-16"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="why-choose-us-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] lg:leading-tight"
          >
            Perché scegliere Astro Forniture
          </h2>
        </header>

        <ul className="mt-10 grid list-none gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STRENGTHS.map((item) => (
            <li key={item.text}>
              <StrengthCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
