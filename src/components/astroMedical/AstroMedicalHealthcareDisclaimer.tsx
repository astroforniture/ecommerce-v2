import { ASTRO_MEDICAL_HEALTHCARE_ADVERTISING_DISCLAIMER } from '../../lib/astroMedicalShopCopy'

type Props = {
  className?: string
}

/**
 * Nota legale obbligatoria pubblicità sanitaria — footer Astro Medical Shop / PDP medicali.
 */
export function AstroMedicalHealthcareDisclaimer({ className }: Props) {
  return (
    <aside
      role="note"
      aria-label="Disclaimer pubblicità sanitaria dispositivi medici"
      className={[
        'rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-3.5 text-center sm:px-5 sm:py-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-xs italic leading-relaxed text-slate-600 sm:text-sm">
        {ASTRO_MEDICAL_HEALTHCARE_ADVERTISING_DISCLAIMER}
      </p>
    </aside>
  )
}
