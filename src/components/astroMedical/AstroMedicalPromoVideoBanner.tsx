type Props = {
  className?: string
}

/** Video promo GIMA — autoplay muted loop, sopra il titolo Astro Medical. */
export function AstroMedicalPromoVideoBanner({ className }: Props) {
  return (
    <div
      className={['w-full mb-6 overflow-hidden rounded-xl shadow-md', className]
        .filter(Boolean)
        .join(' ')}
    >
      <video
        src="/videos/GIMA - People & Service [ITA].mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-auto max-h-[400px] w-full object-cover"
      >
        Il tuo browser non supporta il tag video.
      </video>
    </div>
  )
}
