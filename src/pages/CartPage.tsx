import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import type { CartItem } from '../context/CartContext'
import {
  effectiveUnitPrice,
  isQuantityInDiscountTier,
  lineImponible,
  quantityDiscountRowsDetailed,
} from '../lib/quantityPricing'
import { withOfficeImageCacheBust } from '../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../api/officeProductsSupabase'
import { cartMerchandiseBreakdown, FREE_SHIPPING_THRESHOLD_IVATO } from '../lib/cartMerchandiseIvato'
import {
  computeShippingFeeIvato,
  orderCostBreakdown,
  SHIPPING_FEE_IVATO,
} from '../lib/cartShipping'
import { TIMBRO_AZIENDE_FARMACIE_SKU } from '../lib/timbroAziendeFarmacieProduct'
import { FreeShippingUpsellSection } from '../components/cart/FreeShippingUpsellSection'
import { OrderCostBreakdown } from '../components/cart/OrderCostBreakdown'
import { CheckoutOrderExtras } from '../components/checkout/CheckoutOrderExtras'
import { CheckoutAddressCards } from '../components/checkout/CheckoutAddressCards'
import { StripePaymentSection } from '../components/checkout/StripePaymentSection'
import { validateElectronicInvoice } from '../lib/electronicInvoiceValidation'
import { persistCheckoutOrder, type CheckoutOrderInput, type CustomerType, isBusinessCustomerType } from '../lib/checkoutOrder'
import { isStripeConfigured } from '../lib/stripe'
import { resolveLoggedInUserFormData } from '../lib/userAuth'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type DeliveryMethod = 'shipping' | 'pickup'

function CartLineTierHint({ item }: { item: CartItem }) {
  const rows = useMemo(
    () => quantityDiscountRowsDetailed(item.price ?? 0, item.quantityPriceTiers),
    [item.price, item.quantityPriceTiers],
  )
  const active = rows.find((r) => isQuantityInDiscountTier(item.quantity, r))
  if (!item.quantityPriceTiers?.length || !active) return null
  return (
    <p className="mt-1.5 text-xs text-slate-600">
      Listino attivo:{' '}
      <span className="font-semibold text-slate-800">{active.label}</span>
      {' · '}
      {eur.format(effectiveUnitPrice(item.price, item.quantityPriceTiers, item.quantity))} + IVA / pezzo
    </p>
  )
}

export function CartPage() {
  const { items, totalItems, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('shipping')
  const [customerType, setCustomerType] = useState<CustomerType>('privato')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressZip, setAddressZip] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressProvince, setAddressProvince] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [sdiCode, setSdiCode] = useState('')
  const [pec, setPec] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [billingPhone, setBillingPhone] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [wantsElectronicInvoice, setWantsElectronicInvoice] = useState(false)
  const [syncInvoiceWithBilling, setSyncInvoiceWithBilling] = useState(true)
  const [invoiceCompanyName, setInvoiceCompanyName] = useState('')
  const [invoiceVatNumber, setInvoiceVatNumber] = useState('')
  const [invoiceTaxCode, setInvoiceTaxCode] = useState('')
  const [invoiceSdiOrPec, setInvoiceSdiOrPec] = useState('')
  const [invoiceAddressStreet, setInvoiceAddressStreet] = useState('')
  const [invoiceAddressZip, setInvoiceAddressZip] = useState('')
  const [invoiceAddressCity, setInvoiceAddressCity] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  /** true = consegna = fatturazione (default). */
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(true)
  const [shippingCareOf, setShippingCareOf] = useState('')
  const [shippingStreet, setShippingStreet] = useState('')
  const [shippingZip, setShippingZip] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingProvince, setShippingProvince] = useState('')
  const [shippingNotes, setShippingNotes] = useState('')
  const [attemptedCheckout, setAttemptedCheckout] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  /** Dati fatturazione bloccati: utente loggato con profilo/metadata caricati. */
  const [billingLocked, setBillingLocked] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function preloadBillingData() {
      const client = getSupabaseBrowserClient()
      if (!client) return
      setIsProfileLoading(true)
      try {
        // Preferisci getUser() per metadata aggiornati; fallback a getSession().
        const { data: userData } = await client.auth.getUser()
        const user =
          userData.user ??
          (await client.auth.getSession()).data.session?.user ??
          null
        if (!user || !isMounted) return

        const profileRes = await client
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (!isMounted) return

        if (profileRes.error && import.meta.env.DEV) {
          console.warn('Checkout: profilo non caricato, uso user_metadata:', profileRes.error.message)
        }

        const profileRow =
          profileRes.data && typeof profileRes.data === 'object'
            ? (profileRes.data as Record<string, unknown>)
            : null

        const form = resolveLoggedInUserFormData(user, profileRow)

        if (import.meta.env.DEV) {
          console.debug('Checkout form da profilo/metadata:', form)
        }

        if (form.isCompany) {
          setCustomerType(form.accountType === 'ente' ? 'ente' : 'azienda')
          setCompanyName(
            form.companyName ||
              [form.firstName, form.lastName].filter(Boolean).join(' ').trim(),
          )
          setFirstName('')
          setLastName('')
        } else {
          setCustomerType('privato')
          setCompanyName('')
          setFirstName(form.firstName)
          setLastName(form.lastName)
        }

        setAddressStreet(form.address)
        setAddressCity(form.city)
        setAddressZip(form.zipCode)
        setAddressProvince(form.province)
        setVatNumber(form.vatNumber)
        setSdiCode(form.sdiCode)
        setTaxCode(form.taxCode)
        setPec(form.pec)
        setBillingEmail(form.email)
        setBillingPhone(form.phone)
        // Default spedizione = indirizzo profilo (override solo se checkbox attiva).
        setShippingStreet(form.address)
        setShippingCity(form.city)
        setShippingZip(form.zipCode)
        setShippingProvince(form.province)
        setBillingLocked(true)
      } finally {
        if (isMounted) setIsProfileLoading(false)
      }
    }

    void preloadBillingData()

    return () => {
      isMounted = false
    }
  }, [])

  const { taxableTotal, vatAmount, merchandiseIvato } = useMemo(
    () => cartMerchandiseBreakdown(items),
    [items],
  )
  const shippingFee = computeShippingFeeIvato(merchandiseIvato, deliveryMethod)
  const { totalDue: totalWithVat } = orderCostBreakdown(merchandiseIvato, deliveryMethod)
  const isBusinessCustomer = isBusinessCustomerType(customerType)
  const billingDisplayName = isBusinessCustomer
    ? companyName.trim()
    : [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')

  function buildInvoiceFieldsFromBilling() {
    const resolvedCompany = isBusinessCustomer
      ? companyName.trim()
      : [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    const resolvedVat = vatNumber.trim()
    const vatAsTaxCode = resolvedVat.replace(/^IT/i, '').trim()
    const resolvedTaxCode = taxCode.trim() || (isBusinessCustomer ? vatAsTaxCode : '')
    const resolvedSdiOrPec = sdiCode.trim() || pec.trim()

    return {
      invoiceCompanyName: resolvedCompany,
      invoiceVatNumber: resolvedVat,
      invoiceTaxCode: resolvedTaxCode,
      invoiceSdiOrPec: resolvedSdiOrPec,
      invoiceAddressStreet: addressStreet,
      invoiceAddressZip: addressZip,
      invoiceAddressCity: addressCity,
    }
  }

  function applyInvoiceFieldsFromBilling() {
    const next = buildInvoiceFieldsFromBilling()
    setInvoiceCompanyName(next.invoiceCompanyName)
    setInvoiceVatNumber(next.invoiceVatNumber)
    setInvoiceTaxCode(next.invoiceTaxCode)
    setInvoiceSdiOrPec(next.invoiceSdiOrPec)
    setInvoiceAddressStreet(next.invoiceAddressStreet)
    setInvoiceAddressZip(next.invoiceAddressZip)
    setInvoiceAddressCity(next.invoiceAddressCity)
  }

  useEffect(() => {
    if (!wantsElectronicInvoice || !syncInvoiceWithBilling) return
    applyInvoiceFieldsFromBilling()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only when billing source fields change
  }, [
    wantsElectronicInvoice,
    syncInvoiceWithBilling,
    isBusinessCustomer,
    companyName,
    firstName,
    lastName,
    vatNumber,
    taxCode,
    sdiCode,
    pec,
    addressStreet,
    addressZip,
    addressCity,
  ])
  const companyNameValid = isBusinessCustomer ? companyName.trim().length >= 2 : true
  const privateNameValid = !isBusinessCustomer
    ? firstName.trim().length >= 2 && lastName.trim().length >= 2
    : true
  const addressStreetValid = addressStreet.trim().length >= 4
  const zipValid = /^\d{5}$/.test(addressZip.trim())
  const cityValid = addressCity.trim().length >= 2
  const provinceValid = /^[A-Za-z]{2}$/.test(addressProvince.trim())
  const vatValid =
    !isBusinessCustomer || /^[A-Za-z]{2}\d{11}$|^\d{11}$/.test(vatNumber.trim())
  const sdiValid = !isBusinessCustomer || /^[A-Za-z0-9]{7}$/.test(sdiCode.trim())
  const taxCodeFilled = taxCode.trim().length > 0
  const taxCodeValid =
    isBusinessCustomer || !taxCodeFilled || /^[A-Za-z0-9]{11,16}$/i.test(taxCode.trim())
  const termsValid = acceptTerms
  const electronicInvoiceValid =
    !wantsElectronicInvoice ||
    validateElectronicInvoice({
      companyName: invoiceCompanyName,
      vatNumber: invoiceVatNumber,
      taxCode: invoiceTaxCode,
      sdiOrPec: invoiceSdiOrPec,
    }).isValid

  const useCustomShipping = !sameAsBillingAddress
  const effectiveShippingStreet = useCustomShipping
    ? shippingStreet.trim()
    : addressStreet.trim()
  const effectiveShippingZip = useCustomShipping ? shippingZip.trim() : addressZip.trim()
  const effectiveShippingCity = useCustomShipping
    ? shippingCity.trim()
    : addressCity.trim()
  const effectiveShippingProvince = useCustomShipping
    ? shippingProvince.trim().toUpperCase()
    : addressProvince.trim().toUpperCase()
  const effectiveShippingCareOf = useCustomShipping ? shippingCareOf.trim() : ''
  const effectiveShippingNotes = useCustomShipping ? shippingNotes.trim() : ''

  const shippingStreetValid =
    deliveryMethod === 'pickup' || effectiveShippingStreet.length >= 4
  const shippingZipValid =
    deliveryMethod === 'pickup' || /^\d{5}$/.test(effectiveShippingZip)
  const shippingCityValid =
    deliveryMethod === 'pickup' || effectiveShippingCity.length >= 2
  const shippingProvinceValid =
    deliveryMethod === 'pickup' || /^[A-Za-z]{2}$/.test(effectiveShippingProvince)

  const billingValid =
    privateNameValid &&
    companyNameValid &&
    addressStreetValid &&
    zipValid &&
    cityValid &&
    provinceValid &&
    vatValid &&
    sdiValid &&
    taxCodeValid
  const shippingValid =
    shippingStreetValid && shippingZipValid && shippingCityValid && shippingProvinceValid
  const checkoutBlocked =
    !billingValid || !shippingValid || !termsValid || !electronicInvoiceValid
  const stripeEnabled = isStripeConfigured()
  const deliveryLabel =
    deliveryMethod === 'pickup' ? 'Ritiro a Mantova' : 'Spedizione a domicilio'

  function handleSameAsBillingChange(same: boolean) {
    setSameAsBillingAddress(same)
    if (same) {
      setShippingStreet(addressStreet)
      setShippingZip(addressZip)
      setShippingCity(addressCity)
      setShippingProvince(addressProvince)
      setShippingCareOf('')
      setShippingNotes('')
    } else {
      setShippingStreet((prev) => prev || addressStreet)
      setShippingZip((prev) => prev || addressZip)
      setShippingCity((prev) => prev || addressCity)
      setShippingProvince((prev) => prev || addressProvince)
    }
  }

  function buildCheckoutInput(
    customerEmail: string,
    stripePaymentIntentId?: string,
  ): CheckoutOrderInput {
    return {
      items,
      customerType,
      firstName,
      lastName,
      companyName,
      addressStreet,
      addressCity,
      addressZip,
      addressProvince,
      shippingStreet: effectiveShippingStreet,
      shippingCity: effectiveShippingCity,
      shippingZip: effectiveShippingZip,
      shippingProvince: effectiveShippingProvince,
      shippingCareOf: effectiveShippingCareOf,
      shippingNotes: effectiveShippingNotes,
      vatNumber,
      sdiCode,
      taxCode,
      pec,
      billingEmail,
      billingPhone,
      customerEmail,
      deliveryLabel,
      taxableTotal,
      vatAmount,
      shippingFee,
      totalWithVat,
      stripePaymentIntentId,
      wantsElectronicInvoice,
      invoiceCompanyName,
      invoiceVatNumber,
      invoiceTaxCode,
      invoiceSdiOrPec,
      orderNotes,
    }
  }

  function handleCheckoutExtrasChange(
    patch: Partial<{
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
    }>,
  ) {
    if ('wantsElectronicInvoice' in patch) {
      const checked = patch.wantsElectronicInvoice ?? false
      setWantsElectronicInvoice(checked)
      if (checked) {
        setSyncInvoiceWithBilling(true)
        applyInvoiceFieldsFromBilling()
      }
      return
    }
    if ('syncInvoiceWithBilling' in patch) {
      const sync = patch.syncInvoiceWithBilling ?? false
      setSyncInvoiceWithBilling(sync)
      if (sync) applyInvoiceFieldsFromBilling()
    }
    if ('invoiceCompanyName' in patch) setInvoiceCompanyName(patch.invoiceCompanyName ?? '')
    if ('invoiceVatNumber' in patch) setInvoiceVatNumber(patch.invoiceVatNumber ?? '')
    if ('invoiceTaxCode' in patch) setInvoiceTaxCode(patch.invoiceTaxCode ?? '')
    if ('invoiceSdiOrPec' in patch) setInvoiceSdiOrPec(patch.invoiceSdiOrPec ?? '')
    if ('invoiceAddressStreet' in patch) setInvoiceAddressStreet(patch.invoiceAddressStreet ?? '')
    if ('invoiceAddressZip' in patch) setInvoiceAddressZip(patch.invoiceAddressZip ?? '')
    if ('invoiceAddressCity' in patch) setInvoiceAddressCity(patch.invoiceAddressCity ?? '')
    if ('orderNotes' in patch) setOrderNotes(patch.orderNotes ?? '')
  }

  async function resolveCustomerEmail(supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>) {
    const { data: authData } = await supabase.auth.getSession()
    const loggedUserEmail = authData.session?.user?.email?.trim() ?? ''
    return loggedUserEmail || billingEmail.trim()
  }

  async function completeOrder(stripePaymentIntentId?: string) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setSubmitError('Configurazione Supabase mancante. Impossibile completare l ordine.')
      return false
    }

    const customerEmail = await resolveCustomerEmail(supabase)
    console.log('[Checkout] completeOrder start', {
      customerEmail,
      stripePaymentIntentId,
      itemsCount: items.length,
    })

    const result = await persistCheckoutOrder(
      supabase,
      buildCheckoutInput(customerEmail, stripePaymentIntentId),
    )

    if (!result.ok) {
      console.error('[Checkout] completeOrder fallito:', result)
      setSubmitError(result.error)
      return false
    }

    console.log('[Checkout] completeOrder ok:', result)
    clearCart()
    navigate('/checkout/success', { state: { orderRef: result.orderRef } })
    return true
  }

  async function handleStripePaymentSucceeded(paymentIntentId: string) {
    setSubmitError('')
    setIsSubmitting(true)
    try {
      await completeOrder(paymentIntentId)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCheckoutClick() {
    setAttemptedCheckout(true)
    setSubmitError('')
    if (checkoutBlocked) return
    if (stripeEnabled) {
      setSubmitError('Usa il modulo di pagamento Stripe qui sotto per completare l ordine.')
      return
    }

    setIsSubmitting(true)
    try {
      await completeOrder()
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentCustomerEmail = billingEmail.trim()

  const checkoutBilling = useMemo(
    () => ({
      billingName: billingDisplayName || undefined,
      customerType,
      addressStreet: effectiveShippingStreet || undefined,
      addressCity: effectiveShippingCity || undefined,
      addressZip: effectiveShippingZip || undefined,
      addressProvince: effectiveShippingProvince || undefined,
      billingPhone: billingPhone.trim() || undefined,
      deliveryMethod: deliveryLabel,
      isCompany: isBusinessCustomer,
      vatNumber: isBusinessCustomer ? vatNumber.trim() || undefined : undefined,
      sdiCode: isBusinessCustomer ? sdiCode.trim() || undefined : undefined,
      pec: isBusinessCustomer ? pec.trim() || undefined : undefined,
      checkoutMode: (billingLocked ? 'logged_in' : 'guest') as 'guest' | 'logged_in',
    }),
    [
      billingDisplayName,
      customerType,
      effectiveShippingStreet,
      effectiveShippingCity,
      effectiveShippingZip,
      effectiveShippingProvince,
      billingPhone,
      deliveryLabel,
      isBusinessCustomer,
      vatNumber,
      sdiCode,
      pec,
      billingLocked,
    ],
  )

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <h1 className="inline-flex items-center gap-2 text-3xl font-bold text-brand-900">
            <ShoppingCart className="size-7" aria-hidden />
            Carrello
          </h1>
          <p className="text-sm text-slate-600">{totalItems} articol{totalItems === 1 ? 'o' : 'i'}</p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center">
            <p className="text-slate-700">Il carrello e vuoto.</p>
            <Link
              to="/office-products?catalog=ufficio"
              className="mt-4 inline-flex rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Vai al catalogo office
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <FreeShippingUpsellSection merchandiseIvato={merchandiseIvato} />

            {items.map((item) => {
              const unitImponible = effectiveUnitPrice(
                item.price,
                item.quantityPriceTiers,
                item.quantity,
              )
              const rowImponible = lineImponible(
                item.price,
                item.quantityPriceTiers,
                item.quantity,
              )
              const isTimbroLine = item.sku === TIMBRO_AZIENDE_FARMACIE_SKU
              const multilineName = item.name.includes('\n')
              return (
              <article
                key={item.lineId}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-stretch sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  {item.imageUrl ? (
                    <div className="shrink-0 self-start rounded-lg border border-slate-100 bg-slate-50/80 p-2">
                      <img
                        src={withOfficeImageCacheBust(item.imageUrl, OFFICE_CATALOG_DATA_REVISION)}
                        alt=""
                        className="size-[4.5rem] object-contain sm:size-24"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SKU: {item.sku}
                  </p>
                  <h2
                    className={[
                      'mt-1 text-base font-semibold text-slate-900',
                      multilineName ? 'whitespace-pre-wrap' : '',
                    ].join(' ')}
                  >
                    {item.name}
                  </h2>
                  {item.variantLabel && !isTimbroLine ? (
                    <p className="mt-1 text-sm text-slate-600">Variante: {item.variantLabel}</p>
                  ) : null}
                  {unitImponible <= 0 && item.price === 0 ? (
                    <p className="mt-1 text-sm font-semibold text-slate-800">Su preventivo (0,00 € + IVA)</p>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-brand-800">
                      {eur.format(unitImponible)} + IVA{' '}
                      <span className="font-normal text-slate-600">/ pezzo</span>
                    </p>
                  )}
                  {unitImponible > 0 || item.price !== 0 ? (
                    <p className="mt-0.5 text-sm text-slate-700">
                      Totale imponibile riga:{' '}
                      <span className="font-semibold tabular-nums">{eur.format(rowImponible)}</span>
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-slate-700">
                      Totale riga preventivo:{' '}
                      <span className="font-semibold tabular-nums">{eur.format(rowImponible)}</span>
                    </p>
                  )}
                  <CartLineTierHint item={item} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.lineId)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                    aria-label={`Diminuisci quantita ${item.name}`}
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.lineId)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                    aria-label={`Aumenta quantita ${item.name}`}
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="ml-2 inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Rimuovi
                  </button>
                </div>
              </article>
              )
            })}

            <CheckoutAddressCards
              isProfileLoading={isProfileLoading}
              billingLocked={billingLocked}
              customerType={customerType}
              firstName={firstName}
              lastName={lastName}
              companyName={companyName}
              vatNumber={vatNumber}
              taxCode={taxCode}
              sdiCode={sdiCode}
              pec={pec}
              addressStreet={addressStreet}
              addressZip={addressZip}
              addressCity={addressCity}
              addressProvince={addressProvince}
              billingEmail={billingEmail}
              billingPhone={billingPhone}
              deliveryMethod={deliveryMethod}
              sameAsBillingAddress={sameAsBillingAddress}
              onSameAsBillingChange={handleSameAsBillingChange}
              shippingCareOf={shippingCareOf}
              shippingStreet={shippingStreet}
              shippingZip={shippingZip}
              shippingCity={shippingCity}
              shippingProvince={shippingProvince}
              shippingNotes={shippingNotes}
              onShippingCareOfChange={setShippingCareOf}
              onShippingStreetChange={setShippingStreet}
              onShippingZipChange={setShippingZip}
              onShippingCityChange={setShippingCity}
              onShippingProvinceChange={setShippingProvince}
              onShippingNotesChange={setShippingNotes}
              attemptedCheckout={attemptedCheckout}
              billingValid={billingValid}
              shippingStreetValid={shippingStreetValid}
              shippingZipValid={shippingZipValid}
              shippingCityValid={shippingCityValid}
              shippingProvinceValid={shippingProvinceValid}
              shippingValid={shippingValid}
            />

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">Metodo di Consegna</h3>
              <div className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm">
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="radio"
                    name="delivery-method"
                    value="shipping"
                    checked={deliveryMethod === 'shipping'}
                    onChange={() => setDeliveryMethod('shipping')}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block font-semibold text-slate-900">Spedizione a domicilio</span>
                    <span className="text-slate-600">Consegna all'indirizzo indicato.</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Da {eur.format(FREE_SHIPPING_THRESHOLD_IVATO)} IVA inclusa di merce: spedizione gratuita;
                      altrimenti {eur.format(SHIPPING_FEE_IVATO)} IVA inclusa.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="radio"
                    name="delivery-method"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => {
                      setDeliveryMethod('pickup')
                      setSameAsBillingAddress(true)
                    }}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block font-semibold text-slate-900">Ritiro gratuito in negozio</span>
                    <span className="text-slate-600">Pronto al ritiro presso il punto vendita di Mantova.</span>
                  </span>
                </label>
              </div>

              {deliveryMethod === 'pickup' ? (
                <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/50 p-3.5 text-sm">
                  <p className="font-semibold text-brand-900">
                    TuttUfficio - Astro Forniture - Buffetti
                  </p>
                  <p className="mt-1 text-slate-700">
                    Largo di Porta Pradella, 2, 46100 Mantova (MN)
                  </p>
                  <p className="mt-1 text-slate-700">Lun-Ven 05:45-19:00, Sab-Dom mattina.</p>
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                    La merce sara disponibile in 5 giorni lavorativi. Presentarsi con conferma ordine e documento.
                  </p>
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <div className="aspect-[16/10] w-full sm:aspect-[16/8]">
                      <iframe
                        title="Mappa punto vendita Mantova"
                        src="https://www.google.com/maps?q=Largo%20di%20Porta%20Pradella%2C%202%2C%2046100%20Mantova&output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-full w-full border-0"
                      />
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=TuttUfficio+-+Astro+Forniture+-+Buffetti+Mantova&query_place_id=ChIJI5uWQgXUgUcRGU-5v6iuAaU"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-900"
                  >
                    Apri su Google Maps
                  </a>
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">Riepilogo ordine</h3>
              <OrderCostBreakdown
                merchandiseIvato={merchandiseIvato}
                deliveryMethod={deliveryMethod}
                className="mt-3"
              />

              <CheckoutOrderExtras
                values={{
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
                }}
                onChange={handleCheckoutExtrasChange}
                attemptedCheckout={attemptedCheckout}
                disabled={isSubmitting}
              />

              <div className="mt-4 border-t border-slate-200 pt-4">
                <label className="flex items-start gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Confermo di aver letto e accettato i{' '}
                    <Link className="font-semibold text-brand-700 hover:underline" to="/termini-condizioni-vendita">
                      Termini e Condizioni
                    </Link>
                    .
                  </span>
                </label>
                {attemptedCheckout && !acceptTerms ? (
                  <p className="mt-1 text-xs text-red-700">
                    Per completare il checkout e necessario accettare i Termini e Condizioni.
                  </p>
                ) : null}

                {stripeEnabled ? (
                  <div className="mt-4">
                    <StripePaymentSection
                      amountIvato={totalWithVat}
                      customerEmail={paymentCustomerEmail}
                      checkoutBilling={checkoutBilling}
                      disabled={checkoutBlocked}
                      attemptedCheckout={attemptedCheckout}
                      isSubmitting={isSubmitting}
                      onAttempt={() => setAttemptedCheckout(true)}
                      onSubmittingChange={setIsSubmitting}
                      onError={setSubmitError}
                      onPaymentSucceeded={handleStripePaymentSucceeded}
                    />
                  </div>
                ) : null}

                {!stripeEnabled ? (
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    aria-label="Procedi al checkout e invia ordine"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    {isSubmitting ? 'Invio ordine...' : 'Procedi al checkout'}
                  </button>
                ) : (
                  <p className="mt-4 text-sm text-slate-600">
                    Il pagamento con carta è gestito nel modulo Stripe sopra. Dopo il pagamento
                    l&apos;ordine viene registrato e il carrello svuotato automaticamente.
                  </p>
                )}
                {attemptedCheckout && checkoutBlocked ? (
                  <p className="mt-2 text-xs font-medium text-amber-800">
                    Controlla i campi evidenziati sopra per procedere
                    {wantsElectronicInvoice && !electronicInvoiceValid
                      ? ', inclusi i dati per la fattura elettronica.'
                      : '.'}
                  </p>
                ) : null}
                {submitError ? (
                  <p className="mt-2 text-xs font-medium text-red-700">{submitError}</p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
