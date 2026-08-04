import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type Props = {
  className?: string
}

const SEO_PARAGRAPHS = [
  <>
    Parlare di <strong>sicurezza sul lavoro</strong> significa parlare di prevenzione e tutela. Per
    salvaguardare la salute dei lavoratori negli ambienti a rischio, <strong>Astro Forniture</strong>{' '}
    propone un vasto catalogo di prodotti e accessori studiati per massimizzare la protezione e
    garantire la piena conformità alle normative vigenti.
  </>,
  <>
    Priorità assoluta per permettere il regolare svolgimento delle attività lavorative, la sicurezza
    sul lavoro è un aspetto imprescindibile per ogni azienda. Che si tratti di un ufficio, di un
    ambiente industriale o di un cantiere, ogni luogo di lavoro condiviso deve rispettare i rigorosi
    standard previsti dal D.Lgs. 81/08 (Testo Unico sulla Sicurezza).
  </>,
  <>
    Adottare le giuste misure di protezione è fondamentale per minimizzare i rischi operativi. Nel
    catalogo <strong>Astro Forniture</strong> puoi trovare un&apos;ampia gamma di{' '}
    <strong>Dispositivi di Protezione Individuale (DPI)</strong> quali{' '}
    <strong>elmetti di protezione</strong>, <strong>guanti da lavoro e di precisione</strong>,{' '}
    <strong>occhiali e visiere protettive</strong>,{' '}
    <strong>dispositivi di protezione per l&apos;udito</strong>,{' '}
    <strong>abbigliamento antinfortunistico</strong> (pantaloni, giacche e giubbotti ad alta
    visibilità) e <strong>nastri per la segnaletica</strong>.
  </>,
  <>
    Visita il nostro catalogo online e scegli i prodotti più adatti alla tua realtà aziendale. La
    nostra assistenza clienti è sempre a disposizione per aiutarti nella scelta degli articoli DPI
    più idonei alle esigenze del tuo settore.
  </>,
] as const

const PREVIEW_COUNT = 2

/** Blocco SEO espandibile in fondo alla pagina Sicurezza. */
export function SicurezzaSeoSection({ className = '' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const reactId = useId().replace(/:/g, '')
  const panelId = `sicurezza-seo-${reactId}`
  const buttonId = `${panelId}-toggle`
  const visible = expanded ? SEO_PARAGRAPHS : SEO_PARAGRAPHS.slice(0, PREVIEW_COUNT)

  return (
    <section
      className={[
        'mt-10 rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="sicurezza-seo-heading"
    >
      <h2
        id="sicurezza-seo-heading"
        className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
      >
        Sicurezza sul lavoro
      </h2>
      <div id={panelId} className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        {visible.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <button
        type="button"
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 transition hover:text-brand-950"
      >
        {expanded ? 'Riduci il testo' : 'Leggi di più'}
        <ChevronDown
          className={['size-4 transition', expanded ? 'rotate-180' : ''].join(' ')}
          aria-hidden
        />
      </button>
    </section>
  )
}
