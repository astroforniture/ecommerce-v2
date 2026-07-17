import { useEffect, useState } from 'react'
import { Clock3, Phone, Truck } from 'lucide-react'

type TopPromoBarProps = {
  messages: string[]
  /** Intervallo rotazione messaggi in ms */
  rotateMs?: number
}

export function TopPromoBar({ messages, rotateMs = 7000 }: TopPromoBarProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, rotateMs)
    return () => window.clearInterval(t)
  }, [messages.length, rotateMs])

  if (messages.length === 0) return null

  return (
    <div className="bg-brand-700 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-4 py-3 text-sm sm:text-base lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:px-6">
        <p className="inline-flex items-center justify-center gap-2 text-center font-bold lg:justify-start">
          <Phone className="size-4.5 shrink-0 sm:size-5" aria-hidden />
          <a href="tel:0376329959" className="transition hover:text-white/85" aria-label="Chiama 0376 329959">
            0376 329959
          </a>
        </p>

        <p className="inline-flex items-center justify-center gap-1.5 text-center font-medium text-white/95">
          <Truck className="size-4 shrink-0 sm:size-4.5" aria-hidden />
          <span className="tracking-tight">{messages[index]}</span>
        </p>

        <p className="inline-flex items-center justify-center gap-2 text-center font-semibold lg:justify-end">
          <Clock3 className="size-4.5 shrink-0 sm:size-5" aria-hidden />
          <span>
            Lun–Ven 8:00–19:00 (continuato) <span className="hidden xl:inline">|</span>{' '}
            <span className="inline xl:hidden">
              {' '}
              ·{' '}
            </span>
            Sab 8:00–12:30
          </span>
        </p>
      </div>
    </div>
  )
}
