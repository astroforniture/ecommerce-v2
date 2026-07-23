import {
  COMPANY_ADDRESS_SHORT,
  COMPANY_LANDLINE_DISPLAY,
  COMPANY_MOBILE_DISPLAY,
  COMPANY_PICKUP_MAPS_EMBED_URL,
  COMPANY_TRADE_NAME,
} from '../../data/companyContacts'

type Props = {
  className?: string
}

/**
 * Box conferma ritiro in sede nel checkout (visibile solo se metodo = pickup).
 */
export function PickupStoreConfirmBox({ className }: Props) {
  return (
    <div
      className={[
        'ritiro-sede-checkout-box mt-4 rounded-xl border border-red-200 bg-red-50/30 p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Punto di ritiro selezionato"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>
          📍
        </span>
        <div>
          <h4 className="font-semibold text-gray-900">Punto di Ritiro Selezionato:</h4>
          <p className="text-sm font-medium text-gray-700">{COMPANY_TRADE_NAME}</p>
          <p className="text-sm text-gray-600">{COMPANY_ADDRESS_SHORT}</p>
          <p className="mt-1 text-xs text-gray-500">
            📞 Tel: {COMPANY_LANDLINE_DISPLAY} | 📱 Cell/WhatsApp: {COMPANY_MOBILE_DISPLAY}
          </p>
        </div>
      </div>

      <div className="mt-3 h-48 w-full overflow-hidden rounded-lg border border-gray-300 shadow-inner">
        <iframe
          title="Mappa Ritiro in Sede Checkout"
          src={COMPANY_PICKUP_MAPS_EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
