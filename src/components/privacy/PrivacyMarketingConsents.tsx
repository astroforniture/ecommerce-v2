import { Link } from 'react-router-dom'

/** Consensi marketing/privacy opzionali: sempre default unchecked (GDPR). */
export type PrivacyMarketingConsentValues = {
  newsletter: boolean
  profiling: boolean
  thirdParties: boolean
}

export const DEFAULT_PRIVACY_MARKETING_CONSENTS: PrivacyMarketingConsentValues = {
  newsletter: false,
  profiling: false,
  thirdParties: false,
}

type Props = {
  values: PrivacyMarketingConsentValues
  onChange: (next: PrivacyMarketingConsentValues) => void
  /** Prefisso id accessibilità (es. register / checkout). */
  idPrefix?: string
  className?: string
}

/**
 * Checkbox separate e non preselezionate per newsletter, profilazione e comunicazione a terzi.
 * Nessuna è obbligatoria per completare acquisto/registrazione.
 */
export function PrivacyMarketingConsents({
  values,
  onChange,
  idPrefix = 'privacy-consent',
  className = '',
}: Props) {
  return (
    <fieldset className={`space-y-3 ${className}`.trim()}>
      <legend className="text-sm font-semibold text-slate-800">
        Consensi privacy opzionali
      </legend>
      <p className="text-xs leading-relaxed text-slate-500">
        I consensi seguenti non sono obbligatori e restano deselezionati di default. Puoi modificarli in
        ogni momento. Informativa:{' '}
        <Link to="/privacy-policy" className="font-semibold text-brand-700 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <label className="flex items-start gap-2.5 text-sm text-slate-700">
        <input
          id={`${idPrefix}-newsletter`}
          type="checkbox"
          checked={values.newsletter}
          onChange={(e) => onChange({ ...values, newsletter: e.target.checked })}
          className="mt-0.5"
        />
        <span>
          Acconsento a ricevere comunicazioni commerciali e newsletter via e-mail / WhatsApp
          (finalità di marketing diretto).
        </span>
      </label>

      <label className="flex items-start gap-2.5 text-sm text-slate-700">
        <input
          id={`${idPrefix}-profiling`}
          type="checkbox"
          checked={values.profiling}
          onChange={(e) => onChange({ ...values, profiling: e.target.checked })}
          className="mt-0.5"
        />
        <span>
          Acconsento alla profilazione (analisi delle preferenze di navigazione e acquisto) per
          ricevere proposte personalizzate.
        </span>
      </label>

      <label className="flex items-start gap-2.5 text-sm text-slate-700">
        <input
          id={`${idPrefix}-third-parties`}
          type="checkbox"
          checked={values.thirdParties}
          onChange={(e) => onChange({ ...values, thirdParties: e.target.checked })}
          className="mt-0.5"
        />
        <span>
          Acconsento alla comunicazione dei miei dati a partner commerciali terzi per finalità di
          marketing autonomo.
        </span>
      </label>
    </fieldset>
  )
}
