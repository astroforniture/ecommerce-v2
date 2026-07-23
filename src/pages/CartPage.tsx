import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
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
import { CheckoutAddressCards } from '../components/checkout/CheckoutAddressCards'
import { CheckoutStepIndicator } from '../components/checkout/CheckoutStepIndicator'
import { PickupStoreConfirmBox } from '../components/checkout/PickupStoreConfirmBox'
import { StripePaymentSection } from '../components/checkout/StripePaymentSection'
import { persistCheckoutOrder, type CheckoutOrderInput, type CustomerType, isBusinessCustomerType } from '../lib/checkoutOrder'
import { isStripeConfigured } from '../lib/stripe'
import { resolveLoggedInUserFormData } from '../lib/userAuth'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type DeliveryMethod = 'shipping' | 'pickup'
type CheckoutStep = 1 | 2

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
  /** true = consegna = fatturazione (default). */
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(true)
  const [shippingCareOf, setShippingCareOf] = useState('')
  const [shippingStreet, setShippingStreet] = useState('')
  const [shippingZip, setShippingZip] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingProvince, setShippingProvince] = useState('')
  const [shippingNotes, setShippingNotes] = useState('')
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(1)
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

  useEffect(() => {
    if (items.length === 0) setCheckoutStep(1)
  }, [items.length])

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

  /** Fattura elettronica sempre attiva: campi derivati dai dati di fatturazione profilo. */
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
    }
  }

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
  /** Note consegna dalla sezione Note & PO (sempre, indipendentemente dall'override indirizzo). */
  const effectiveShippingNotes = shippingNotes.trim()

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
  const checkoutBlocked = !billingValid || !shippingValid || !termsValid
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
      ...buildInvoiceFieldsFromBilling(),
      orderNotes: [
        purchaseOrderNumber.trim() ? `PO / Riferimento: ${purchaseOrderNumber.trim()}` : '',
        promoCode.trim() ? `Codice promozionale: ${promoCode.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    }
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-2 flex items-center justify-between gap-4">
          <h1 className="inline-flex items-center gap-2 text-3xl font-bold text-brand-900">
            <ShoppingCart className="size-7" aria-hidden />
            {checkoutStep === 1 ? 'Carrello' : 'Checkout'}
          </h1>
          <p className="text-sm text-slate-600">
            {totalItems} articol{totalItems === 1 ? 'o' : 'i'}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center">
            <p className="text-slate-700">Il carrello e vuoto.</p>
            <Link
              to="/office-products?catalog=ufficio"
              className="mt-4 inline-flex rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Vai al catalogo office
            </Link>
          </div>
        ) : (
          <>
            <CheckoutStepIndicator currentStep={checkoutStep} />

            <div
              className={
                checkoutStep === 1
                  ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,24rem)] xl:grid-cols-[minmax(0,1fr)_26rem] lg:items-start'
                  : 'grid gap-6 lg:grid-cols-12 lg:items-start'
              }
            >
              <div
                className={
                  checkoutStep === 1
                    ? 'min-w-0 space-y-5'
                    : 'min-w-0 space-y-4 lg:col-span-7'
                }
              >
                {checkoutStep === 1 ? (
                  <>
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-slate-900">I tuoi prodotti</h2>
                      {items.map((item) => {
                      const unitImponible = effectiveUnitPrice(
                        item.price,
                        item.quantityPriceTiers,
                        item.quantity,
                      )
                      const rowImponibile = lineImponible(
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
                                  src={withOfficeImageCacheBust(
                                    item.imageUrl,
                                    OFFICE_CATALOG_DATA_REVISION,
                                  )}
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
                                <p className="mt-1 text-sm text-slate-600">
                                  Variante: {item.variantLabel}
                                </p>
                              ) : null}
                              {unitImponible <= 0 && item.price === 0 ? (
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  Su preventivo (0,00 € + IVA)
                                </p>
                              ) : (
                                <p className="mt-1 text-sm font-medium text-brand-800">
                                  {eur.format(unitImponible)} + IVA{' '}
                                  <span className="font-normal text-slate-600">/ pezzo</span>
                                </p>
                              )}
                              {unitImponible > 0 || item.price !== 0 ? (
                                <p className="mt-0.5 text-sm text-slate-700">
                                  Totale imponibile riga:{' '}
                                  <span className="font-semibold tabular-nums">
                                    {eur.format(rowImponibile)}
                                  </span>
                                </p>
                              ) : (
                                <p className="mt-0.5 text-sm text-slate-700">
                                  Totale riga preventivo:{' '}
                                  <span className="font-semibold tabular-nums">
                                    {eur.format(rowImponibile)}
                                  </span>
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
                    </div>

                    {/* Solo Step 1: sotto i prodotti */}
                    <FreeShippingUpsellSection merchandiseIvato={merchandiseIvato} />
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAttemptedCheckout(false)
                        setSubmitError('')
                        setCheckoutStep(1)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-brand-800"
                    >
                      <ArrowLeft className="size-4" aria-hidden />
                      Torna al carrello
                    </button>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">I tuoi indirizzi</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Fatturazione dal profilo e destinazione di consegna.
                      </p>
                    </div>

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
                      onShippingCareOfChange={setShippingCareOf}
                      onShippingStreetChange={setShippingStreet}
                      onShippingZipChange={setShippingZip}
                      onShippingCityChange={setShippingCity}
                      onShippingProvinceChange={setShippingProvince}
                      attemptedCheckout={attemptedCheckout}
                      billingValid={billingValid}
                      shippingStreetValid={shippingStreetValid}
                      shippingZipValid={shippingZipValid}
                      shippingCityValid={shippingCityValid}
                      shippingProvinceValid={shippingProvinceValid}
                      shippingValid={shippingValid}
                    />

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-base font-semibold text-slate-900">Metodo di consegna</h3>
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
                            <span className="block font-semibold text-slate-900">
                              Spedizione a domicilio
                            </span>
                            <span className="text-slate-600">
                              Consegna all&apos;indirizzo indicato.
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                              Da {eur.format(FREE_SHIPPING_THRESHOLD_IVATO)} IVA inclusa: spedizione
                              gratuita; altrimenti {eur.format(SHIPPING_FEE_IVATO)} IVA inclusa.
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
                            <span className="block font-semibold text-slate-900">
                              Ritiro gratuito in negozio
                            </span>
                            <span className="text-slate-600">
                              Pronto al ritiro presso il punto vendita di Porto Mantovano.
                            </span>
                          </span>
                        </label>
                      </div>
                      {deliveryMethod === 'pickup' ? <PickupStoreConfirmBox /> : null}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-base font-semibold text-slate-900">Note &amp; PO</h3>
                      <div className="mt-3 grid gap-3">
                        <label className="block text-sm">
                          <span className="mb-1 block font-medium text-slate-700">
                            Note per la consegna
                          </span>
                          <textarea
                            value={shippingNotes}
                            onChange={(e) => setShippingNotes(e.target.value)}
                            rows={3}
                            placeholder="Orari, citofono, istruzioni per il corriere…"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="mb-1 block font-medium text-slate-700">
                            Numero PO / Riferimento ordine
                          </span>
                          <input
                            type="text"
                            value={purchaseOrderNumber}
                            onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                            placeholder="Es. PO-2026-001"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                          />
                        </label>
                      </div>
                    </section>
                  </>
                )}
              </div>

              <aside
                className={
                  checkoutStep === 1
                    ? 'lg:sticky lg:top-24'
                    : 'lg:sticky lg:top-24 lg:col-span-5'
                }
              >
                <div
                  className={
                    checkoutStep === 1
                      ? 'rounded-2xl border border-slate-200 bg-white p-6 shadow-md ring-1 ring-slate-900/5 sm:p-7'
                      : 'rounded-2xl border border-slate-200 bg-white p-6 shadow-lg ring-1 ring-slate-900/5 sm:p-8'
                  }
                >
                  <h3
                    className={
                      checkoutStep === 1
                        ? 'text-lg font-bold tracking-tight text-slate-900'
                        : 'text-xl font-bold tracking-tight text-slate-900'
                    }
                  >
                    {checkoutStep === 1 ? 'Riepilogo ordine' : 'Riepilogo finale'}
                  </h3>
                  <OrderCostBreakdown
                    merchandiseIvato={merchandiseIvato}
                    deliveryMethod={deliveryMethod}
                    prominent
                    className={checkoutStep === 1 ? 'mt-5' : 'mt-6'}
                  />

                  {checkoutStep === 1 ? (
                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-slate-700">
                          Codice promozionale
                        </span>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Inserisci codice"
                          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                        />
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          Verrà allegato all&apos;ordine in conferma.
                        </p>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('')
                          setCheckoutStep(2)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      >
                        Procedi al checkout
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <label className="flex items-start gap-2.5 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          Confermo di aver letto e accettato i{' '}
                          <Link
                            className="font-semibold text-brand-700 hover:underline"
                            to="/termini-condizioni-vendita"
                          >
                            Termini e Condizioni
                          </Link>
                          .
                        </span>
                      </label>
                      {attemptedCheckout && !acceptTerms ? (
                        <p className="mt-1.5 text-xs text-red-700">
                          Per completare il checkout è necessario accettare i Termini e Condizioni.
                        </p>
                      ) : null}

                      {stripeEnabled ? (
                        <div className="mt-6 -mx-1">
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
                            prominent
                          />
                        </div>
                      ) : null}

                      {!stripeEnabled ? (
                        <button
                          type="button"
                          onClick={handleCheckoutClick}
                          aria-label="Conferma l'ordine"
                          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-md transition hover:bg-brand-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                        >
                          {isSubmitting ? 'Invio ordine...' : "Conferma l'ordine"}
                        </button>
                      ) : null}

                      {attemptedCheckout && checkoutBlocked ? (
                        <p className="mt-3 text-xs font-medium text-amber-800">
                          Controlla indirizzi e termini per procedere.
                        </p>
                      ) : null}
                      {submitError ? (
                        <p className="mt-2 text-xs font-medium text-red-700">{submitError}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
