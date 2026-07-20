import { validateElectronicInvoice } from '../../lib/electronicInvoiceValidation'

const inputClassName =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20'

export type CheckoutOrderExtrasValues = {
  wantsElectronicInvoice: boolean
  syncInvoiceWithBilling: boolean
  invoiceCompanyName: string
  invoiceVatNumber: string
  invoiceTaxCode: string
  invoiceSdiOrPec: string
  invoiceAddressStreet: string
  invoiceAddressZip: string
  invoiceAddressCity: string
  orderNotes: string
}

type CheckoutOrderExtrasProps = {
  values: CheckoutOrderExtrasValues
  onChange: (patch: Partial<CheckoutOrderExtrasValues>) => void
  attemptedCheckout: boolean
  disabled?: boolean
}

export function CheckoutOrderExtras({
  values,
  onChange,
  attemptedCheckout,
  disabled = false,
}: CheckoutOrderExtrasProps) {
  const {
    wantsElectronicInvoice,
    syncInvoiceWithBilling,
    invoiceCompanyName,
    invoiceVatNumber,
    invoiceTaxCode,
    invoiceSdiOrPec,
    invoiceAddressStreet,
    invoiceAddressZip,
    invoiceAddressCity,
    orderNotes,
  } = values

  const invoiceValidation = wantsElectronicInvoice
    ? validateElectronicInvoice({
        companyName: invoiceCompanyName,
        vatNumber: invoiceVatNumber,
        taxCode: invoiceTaxCode,
        sdiOrPec: invoiceSdiOrPec,
      })
    : null

  function editInvoiceField(patch: Partial<CheckoutOrderExtrasValues>) {
    onChange({ ...patch, syncInvoiceWithBilling: false })
  }

  return (
    <div className="mt-4 space-y-5 border-t border-slate-200 pt-4">
      <section aria-labelledby="checkout-einvoice-heading">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={wantsElectronicInvoice}
            onChange={(e) => onChange({ wantsElectronicInvoice: e.target.checked })}
            disabled={disabled}
            className="mt-0.5"
          />
          <span id="checkout-einvoice-heading" className="font-medium text-slate-800">
            Desidero fattura elettronica
          </span>
        </label>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
            wantsElectronicInvoice
              ? 'mt-3 grid-rows-[1fr] opacity-100'
              : 'mt-0 grid-rows-[0fr] opacity-0'
          }`}
          aria-hidden={!wantsElectronicInvoice}
        >
          <div className="overflow-hidden">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
              <p className="text-xs font-medium text-slate-600">
                Dati obbligatori per l&apos;emissione della fattura elettronica.
              </p>

              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={syncInvoiceWithBilling}
                  onChange={(e) => onChange({ syncInvoiceWithBilling: e.target.checked })}
                  disabled={disabled || !wantsElectronicInvoice}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium text-slate-800">
                    Usa gli stessi dati di fatturazione
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Precompila e mantieni sincronizzati Ragione Sociale, indirizzo, CAP, città e
                    P.IVA/CF con i campi principali. Se modifichi un campo qui sotto, la
                    sincronizzazione si interrompe.
                  </span>
                </span>
              </label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium text-slate-700">
                    Ragione Sociale / Nome Azienda *
                  </span>
                  <input
                    type="text"
                    value={invoiceCompanyName}
                    onChange={(e) => editInvoiceField({ invoiceCompanyName: e.target.value })}
                    placeholder="Es. Astro Forniture s.r.l."
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                  {attemptedCheckout && invoiceValidation && !invoiceValidation.companyNameValid ? (
                    <p className="mt-1 text-xs text-red-700">Ragione sociale obbligatoria.</p>
                  ) : null}
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium text-slate-700">Indirizzo *</span>
                  <input
                    type="text"
                    value={invoiceAddressStreet}
                    onChange={(e) => editInvoiceField({ invoiceAddressStreet: e.target.value })}
                    placeholder="Es. Via Roma, 10"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">CAP *</span>
                  <input
                    type="text"
                    value={invoiceAddressZip}
                    onChange={(e) => editInvoiceField({ invoiceAddressZip: e.target.value })}
                    placeholder="46100"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Città *</span>
                  <input
                    type="text"
                    value={invoiceAddressCity}
                    onChange={(e) => editInvoiceField({ invoiceAddressCity: e.target.value })}
                    placeholder="Mantova"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Partita IVA *</span>
                  <input
                    type="text"
                    value={invoiceVatNumber}
                    onChange={(e) => editInvoiceField({ invoiceVatNumber: e.target.value })}
                    placeholder="Es. IT01234567890"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                  {attemptedCheckout && invoiceValidation && !invoiceValidation.vatNumberValid ? (
                    <p className="mt-1 text-xs text-red-700">Partita IVA non valida.</p>
                  ) : null}
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Codice Fiscale *</span>
                  <input
                    type="text"
                    value={invoiceTaxCode}
                    onChange={(e) => editInvoiceField({ invoiceTaxCode: e.target.value })}
                    placeholder="Es. RSSMRA80A01H501U"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                  {attemptedCheckout && invoiceValidation && !invoiceValidation.taxCodeValid ? (
                    <p className="mt-1 text-xs text-red-700">Codice fiscale non valido.</p>
                  ) : null}
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium text-slate-700">
                    Codice Univoco SDI o PEC *
                  </span>
                  <input
                    type="text"
                    value={invoiceSdiOrPec}
                    onChange={(e) => editInvoiceField({ invoiceSdiOrPec: e.target.value })}
                    placeholder="Es. ABCD123 oppure nome@pec.it"
                    disabled={disabled || !wantsElectronicInvoice || syncInvoiceWithBilling}
                    className={inputClassName}
                  />
                  {attemptedCheckout && invoiceValidation && !invoiceValidation.sdiOrPecValid ? (
                    <p className="mt-1 text-xs text-red-700">
                      Inserisci un codice SDI di 7 caratteri oppure un indirizzo PEC valido.
                    </p>
                  ) : null}
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="checkout-order-notes-heading">
        <label className="block text-sm" htmlFor="checkout-order-notes">
          <span
            id="checkout-order-notes-heading"
            className="mb-1.5 block font-medium text-slate-700"
          >
            Note ordine / richieste particolari / orari di consegna
          </span>
          <textarea
            id="checkout-order-notes"
            value={orderNotes}
            onChange={(e) => onChange({ orderNotes: e.target.value })}
            placeholder="Es: Consegnare solo la mattina, lasciare al portiere, scala B..."
            disabled={disabled}
            rows={4}
            className="min-h-[7.5rem] w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </section>
    </div>
  )
}
