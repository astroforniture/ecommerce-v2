import { Link } from 'react-router-dom'
import { Check, MapPin, PencilLine, Receipt } from 'lucide-react'
import type { CustomerType } from '../../lib/checkoutOrder'
import { isBusinessCustomerType } from '../../lib/checkoutOrder'

const editableFieldClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

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
  shippingNotes: string
  onShippingCareOfChange: (value: string) => void
  onShippingStreetChange: (value: string) => void
  onShippingZipChange: (value: string) => void
  onShippingCityChange: (value: string) => void
  onShippingProvinceChange: (value: string) => void
  onShippingNotesChange: (value: string) => void
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
    <div className="min-w-0 rounded-lg bg-white/70 px-3 py-2.5 ring-1 ring-slate-200/80">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium leading-snug text-slate-900">
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
  shippingNotes,
  onShippingCareOfChange,
  onShippingStreetChange,
  onShippingZipChange,
  onShippingCityChange,
  onShippingProvinceChange,
  onShippingNotesChange,
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
    <div className="mt-6 space-y-5">
      {/* 1. Fatturazione — sola lettura */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/40 to-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Receipt className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Dati di Fatturazione</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {billingLocked
                  ? 'Dati dal profilo · sola lettura in checkout'
                  : 'Accedi per caricare i dati del tuo profilo'}
              </p>
            </div>
          </div>
          <Link
            to={billingLocked ? '/account/profile' : '/login'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 underline-offset-2 transition hover:text-brand-800 hover:underline"
          >
            <PencilLine className="size-3.5" aria-hidden />
            {billingLocked ? 'Modifica nel tuo profilo' : 'Accedi al tuo account'}
          </Link>
        </header>

        <div className="bg-slate-50 px-5 py-4">
          {isProfileLoading ? (
            <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200/80" />
              ))}
            </div>
          ) : (
            <dl className="grid gap-3 sm:grid-cols-2">
              <ProfileField label="Tipo cliente" value={customerTypeLabel(customerType)} />
              <ProfileField
                label={isBusiness ? 'Ragione sociale' : 'Nome'}
                value={displayName}
              />
              <ProfileField label="P.IVA / CF" value={vatOrCf} />
              <ProfileField label="SDI / PEC" value={sdiOrPec} />
              <div className="sm:col-span-2">
                <ProfileField label="Indirizzo fiscale" value={fiscalAddress} />
              </div>
              <ProfileField label="Telefono" value={billingPhone} />
              <ProfileField label="Email" value={billingEmail} />
            </dl>
          )}

          {attemptedCheckout && !billingValid ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
              {billingLocked
                ? 'Il profilo non ha tutti i dati di fatturazione obbligatori. Aggiornali dall’area riservata.'
                : 'Accedi e completa il profilo per procedere al pagamento.'}
            </p>
          ) : null}
        </div>
      </section>

      {/* 2. Consegna — dinamica */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/40 to-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <MapPin className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Indirizzo di Consegna</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {deliveryMethod === 'pickup'
                  ? 'Ritiro in negozio: non è richiesta una spedizione'
                  : 'Spedizione a domicilio o cantiere'}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4 bg-slate-50 px-5 py-4">
          {deliveryMethod === 'pickup' ? (
            <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Ritiro gratuito a Mantova: l&apos;indirizzo di consegna non è necessario.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSameAsBillingChange(!sameAsBillingAddress)}
                disabled={isProfileLoading}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                  sameAsBillingAddress
                    ? 'border-brand-300 bg-white shadow-sm ring-1 ring-brand-500/15'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-pressed={sameAsBillingAddress}
              >
                <span
                  className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                    sameAsBillingAddress
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                  aria-hidden
                >
                  <Check className="size-3.5 stroke-[3]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    Indirizzo di consegna identico all&apos;indirizzo di fatturazione
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Deseleziona per spedire a un altro indirizzo o cantiere
                  </span>
                </span>
              </button>

              {/* Preview profilo quando stesso indirizzo */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  sameAsBillingAddress
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!sameAsBillingAddress}
              >
                <div className="overflow-hidden">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Destinazione
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-900">
                      {displayOrDash(fiscalAddress)}
                    </p>
                    {displayName ? (
                      <p className="mt-1 text-xs text-slate-500">Destinatario: {displayName}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Form indirizzo alternativo */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  showCustomShipping
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!showCustomShipping}
              >
                <div className="overflow-hidden">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Invia a un altro indirizzo
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm sm:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">
                          Destinatario / Presso
                        </span>
                        <input
                          type="text"
                          value={shippingCareOf}
                          onChange={(e) => onShippingCareOfChange(e.target.value)}
                          placeholder="Es. Cantiere Via Roma, Ufficio acquisti…"
                          className={editableFieldClass}
                        />
                      </label>
                      <label className="block text-sm sm:col-span-2">
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
                          <p className="mt-1 text-xs text-red-700">Indirizzo non valido.</p>
                        ) : null}
                      </label>
                      <label className="block text-sm">
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
                          <p className="mt-1 text-xs text-red-700">CAP non valido (5 cifre).</p>
                        ) : null}
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Città *</span>
                        <input
                          type="text"
                          value={shippingCity}
                          onChange={(e) => onShippingCityChange(e.target.value)}
                          placeholder="Città"
                          className={editableFieldClass}
                        />
                        {attemptedCheckout && !sameAsBillingAddress && !shippingCityValid ? (
                          <p className="mt-1 text-xs text-red-700">Città obbligatoria.</p>
                        ) : null}
                      </label>
                      <label className="block text-sm sm:col-span-2 sm:max-w-[8rem]">
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
                          <p className="mt-1 text-xs text-red-700">
                            Provincia non valida (2 lettere).
                          </p>
                        ) : null}
                      </label>
                      <label className="block text-sm sm:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">
                          Note per il corriere
                        </span>
                        <textarea
                          value={shippingNotes}
                          onChange={(e) => onShippingNotesChange(e.target.value)}
                          rows={3}
                          placeholder="Orari, citofono, istruzioni di scarico…"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {attemptedCheckout && !shippingValid ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
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
