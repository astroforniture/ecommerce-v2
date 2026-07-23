import { Link } from 'react-router-dom'
import { Check, MapPin, PencilLine, Receipt } from 'lucide-react'
import type { CustomerType } from '../../lib/checkoutOrder'
import { isBusinessCustomerType } from '../../lib/checkoutOrder'

const editableFieldClass =
  'h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

export type CheckoutAddressCardsProps = {
  isProfileLoading: boolean
  billingLocked: boolean
  customerType: CustomerType
  firstName: string
  lastName: string
  companyName: string
  vatNumber: string
  taxCode: string
  sdiCode: string
  pec: string
  addressStreet: string
  addressZip: string
  addressCity: string
  addressProvince: string
  billingEmail: string
  billingPhone: string
  deliveryMethod: 'shipping' | 'pickup'
  sameAsBillingAddress: boolean
  onSameAsBillingChange: (same: boolean) => void
  shippingCareOf: string
  shippingStreet: string
  shippingZip: string
  shippingCity: string
  shippingProvince: string
  onShippingCareOfChange: (value: string) => void
  onShippingStreetChange: (value: string) => void
  onShippingZipChange: (value: string) => void
  onShippingCityChange: (value: string) => void
  onShippingProvinceChange: (value: string) => void
  attemptedCheckout: boolean
  billingValid: boolean
  shippingStreetValid: boolean
  shippingZipValid: boolean
  shippingCityValid: boolean
  shippingProvinceValid: boolean
  shippingValid: boolean
}

function displayOrDash(value: string): string {
  const t = value.trim()
  return t || '—'
}

function customerTypeLabel(customerType: CustomerType): string {
  if (customerType === 'azienda') return 'Azienda'
  if (customerType === 'ente') return 'Ente'
  return 'Privato'
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-white/80 px-2.5 py-1.5 ring-1 ring-slate-200/70">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-xs font-medium leading-snug text-slate-900">
        {displayOrDash(value)}
      </dd>
    </div>
  )
}

export function CheckoutAddressCards({
  isProfileLoading,
  billingLocked,
  customerType,
  firstName,
  lastName,
  companyName,
  vatNumber,
  taxCode,
  sdiCode,
  pec,
  addressStreet,
  addressZip,
  addressCity,
  addressProvince,
  billingEmail,
  billingPhone,
  deliveryMethod,
  sameAsBillingAddress,
  onSameAsBillingChange,
  shippingCareOf,
  shippingStreet,
  shippingZip,
  shippingCity,
  shippingProvince,
  onShippingCareOfChange,
  onShippingStreetChange,
  onShippingZipChange,
  onShippingCityChange,
  onShippingProvinceChange,
  attemptedCheckout,
  billingValid,
  shippingStreetValid,
  shippingZipValid,
  shippingCityValid,
  shippingProvinceValid,
  shippingValid,
}: CheckoutAddressCardsProps) {
  const isBusiness = isBusinessCustomerType(customerType)
  const displayName = isBusiness
    ? companyName.trim()
    : [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
  const fiscalAddress = [addressStreet, addressZip, addressCity, addressProvince]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(', ')
  const vatOrCf = [
    vatNumber.trim() ? `P.IVA ${vatNumber.trim()}` : '',
    taxCode.trim() ? `CF ${taxCode.trim()}` : '',
  ]
    .filter(Boolean)
    .join(' · ')
  const sdiOrPec = [sdiCode.trim() ? `SDI ${sdiCode.trim()}` : '', pec.trim() ? `PEC ${pec.trim()}` : '']
    .filter(Boolean)
    .join(' · ')

  const showCustomShipping = !sameAsBillingAddress && deliveryMethod !== 'pickup'

  return (
    <div className="space-y-3">
      {/* 1. Fatturazione — sola lettura, compatta */}
      <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-brand-50/40 to-white px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Receipt className="size-3.5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Dati di Fatturazione</h3>
              <p className="text-[11px] text-slate-500">
                {billingLocked ? 'Profilo · sola lettura' : 'Accedi per usare il profilo'}
              </p>
            </div>
          </div>
          <Link
            to={billingLocked ? '/account/profile' : '/login'}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 underline-offset-2 transition hover:text-brand-800 hover:underline"
          >
            <PencilLine className="size-3" aria-hidden />
            {billingLocked ? 'Modifica nel profilo' : 'Accedi'}
          </Link>
        </header>

        <div className="bg-slate-50 px-3 py-2.5">
          {isProfileLoading ? (
            <div className="grid gap-1.5 sm:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-md bg-slate-200/80" />
              ))}
            </div>
          ) : (
            <dl className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              <ProfileField label="Tipo cliente" value={customerTypeLabel(customerType)} />
              <ProfileField
                label={isBusiness ? 'Ragione sociale' : 'Nome'}
                value={displayName}
              />
              <ProfileField label="P.IVA / CF" value={vatOrCf} />
              <ProfileField label="SDI / PEC" value={sdiOrPec} />
              <ProfileField label="Telefono" value={billingPhone} />
              <ProfileField label="Email" value={billingEmail} />
              <div className="sm:col-span-2 lg:col-span-3">
                <ProfileField label="Indirizzo fiscale" value={fiscalAddress} />
              </div>
            </dl>
          )}

          {attemptedCheckout && !billingValid ? (
            <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-800">
              {billingLocked
                ? 'Il profilo non ha tutti i dati di fatturazione obbligatori. Aggiornali dall’area riservata.'
                : 'Accedi e completa il profilo per procedere al pagamento.'}
            </p>
          ) : null}
        </div>
      </section>

      {/* 2. Consegna — dinamica, compatta quando chiusa */}
      <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-brand-50/40 to-white px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <MapPin className="size-3.5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Indirizzo di Consegna</h3>
              <p className="text-[11px] text-slate-500">
                {deliveryMethod === 'pickup'
                  ? 'Ritiro in negozio'
                  : 'Spedizione a domicilio o cantiere'}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-2.5 bg-slate-50 px-3 py-2.5">
          {deliveryMethod === 'pickup' ? (
            <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-900">
              Ritiro gratuito in sede (Porto Mantovano): l&apos;indirizzo di consegna non è
              necessario. Dettagli e mappa sotto in &quot;Metodo di consegna&quot;.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSameAsBillingChange(!sameAsBillingAddress)}
                disabled={isProfileLoading}
                className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition ${
                  sameAsBillingAddress
                    ? 'border-brand-300 bg-white shadow-sm ring-1 ring-brand-500/15'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-pressed={sameAsBillingAddress}
              >
                <span
                  className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded border transition ${
                    sameAsBillingAddress
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                  aria-hidden
                >
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-900">
                    Indirizzo di consegna identico all&apos;indirizzo di fatturazione
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    Deseleziona per spedire a un altro indirizzo
                  </span>
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  sameAsBillingAddress
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!sameAsBillingAddress}
              >
                <div className="overflow-hidden">
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Destinazione
                    </p>
                    <p className="mt-0.5 text-xs font-medium leading-snug text-slate-900">
                      {displayOrDash(fiscalAddress)}
                    </p>
                    {displayName ? (
                      <p className="mt-0.5 text-[11px] text-slate-500">Destinatario: {displayName}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  showCustomShipping
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!showCustomShipping}
              >
                <div className="overflow-hidden">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Invia a un altro indirizzo
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="block text-xs sm:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">
                          Destinatario / Presso
                        </span>
                        <input
                          type="text"
                          value={shippingCareOf}
                          onChange={(e) => onShippingCareOfChange(e.target.value)}
                          placeholder="Es. Cantiere Via Roma…"
                          className={editableFieldClass}
                        />
                      </label>
                      <label className="block text-xs sm:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">
                          Via e civico *
                        </span>
                        <input
                          type="text"
                          value={shippingStreet}
                          onChange={(e) => onShippingStreetChange(e.target.value)}
                          placeholder="Via e numero civico"
                          className={editableFieldClass}
                        />
                        {attemptedCheckout && !sameAsBillingAddress && !shippingStreetValid ? (
                          <p className="mt-1 text-[11px] text-red-700">Indirizzo non valido.</p>
                        ) : null}
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium text-slate-700">CAP *</span>
                        <input
                          type="text"
                          value={shippingZip}
                          onChange={(e) => onShippingZipChange(e.target.value)}
                          placeholder="CAP"
                          inputMode="numeric"
                          className={editableFieldClass}
                        />
                        {attemptedCheckout && !sameAsBillingAddress && !shippingZipValid ? (
                          <p className="mt-1 text-[11px] text-red-700">CAP non valido (5 cifre).</p>
                        ) : null}
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium text-slate-700">Città *</span>
                        <input
                          type="text"
                          value={shippingCity}
                          onChange={(e) => onShippingCityChange(e.target.value)}
                          placeholder="Città"
                          className={editableFieldClass}
                        />
                        {attemptedCheckout && !sameAsBillingAddress && !shippingCityValid ? (
                          <p className="mt-1 text-[11px] text-red-700">Città obbligatoria.</p>
                        ) : null}
                      </label>
                      <label className="block text-xs sm:col-span-2 sm:max-w-[7rem]">
                        <span className="mb-1 block font-medium text-slate-700">Provincia *</span>
                        <input
                          type="text"
                          value={shippingProvince}
                          onChange={(e) =>
                            onShippingProvinceChange(e.target.value.toUpperCase())
                          }
                          placeholder="MN"
                          maxLength={2}
                          className={editableFieldClass}
                        />
                        {attemptedCheckout && !sameAsBillingAddress && !shippingProvinceValid ? (
                          <p className="mt-1 text-[11px] text-red-700">
                            Provincia non valida (2 lettere).
                          </p>
                        ) : null}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {attemptedCheckout && !shippingValid ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-800">
                  Completa l&apos;indirizzo di consegna (via, CAP, città, provincia).
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
