import { useEffect, useState } from 'react'

const ANNOUNCEMENT_MESSAGES = [
  '📞 Serve aiuto? Contattaci o scrivici su WhatsApp al 0376 329959',
  "✨ Forniture per ufficio di qualità con assistenza dedicata prima e dopo l'ordine",
  '💼 Soluzioni su misura per aziende, professionisti e privati',
  '🚀 Ordina online e ritira gratuitamente presso il punto vendita di Mantova!',
  '⭐ Astro Forniture: Qualità, Affidabilità e Tempestività al servizio del tuo ufficio',
  '🏢 Tutto il necessario per il tuo spazio di lavoro, a portata di click',
] as const

const ROTATE_MS = 4000
const FADE_MS = 350

export function HeaderAnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (ANNOUNCEMENT_MESSAGES.length <= 1) return

    let fadeTimeoutId: number | undefined

    const intervalId = window.setInterval(() => {
      setVisible(false)
      fadeTimeoutId = window.setTimeout(() => {
        setIndex((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length)
        setVisible(true)
      }, FADE_MS)
    }, ROTATE_MS)

    return () => {
      window.clearInterval(intervalId)
      if (fadeTimeoutId !== undefined) window.clearTimeout(fadeTimeoutId)
    }
  }, [])

  return (
    <div
      className="bg-emerald-950 px-4 py-1.5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white sm:text-xs sm:tracking-[0.16em]"
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className="mx-auto max-w-5xl transition-opacity duration-300 ease-in-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {ANNOUNCEMENT_MESSAGES[index]}
      </p>
    </div>
  )
}
