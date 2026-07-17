import { type ComponentType, type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Shield,
  Truck,
  User,
} from 'lucide-react'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'

type ProfileRow = {
  id: string
  first_name: string | null
  last_name: string | null
  telefono: string | null
  account_type: 'azienda' | 'privato' | null
  ragione_sociale: string | null
  partita_iva: string | null
  sdi: string | null
  indirizzo: string | null
  citta: string | null
  cap: string | null
  provincia: string | null
  default_shipping_address: string | null
  default_shipping_city: string | null
  default_shipping_zip_code: string | null
  default_shipping_province: string | null
  email?: string | null
  newsletter_opt_in?: boolean | null
}

type UserOrder = {
  id: string
  created_at: string | null
  status: string | null
  total: number
  items_json?: Array<Record<string, unknown>>
}

type ProfileTab =
  | 'dashboard'
  | 'orders'
  | 'ordered-products'
  | 'favorites'
  | 'addresses-company'
  | 'base-profile'
  | 'cards'
  | 'admin'
  | 'newsletter'

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export function AccountProfilePage() {
  const supabase = getSupabaseBrowserClient()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [shouldLogin, setShouldLogin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [_ordersLoading, setOrdersLoading] = useState(false)
  const [_ordersError, setOrdersError] = useState('')
  const [activeTab, setActiveTab] = useState<ProfileTab>('dashboard')
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('all')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [billingName, setBillingName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingZip, setShippingZip] = useState('')
  const [shippingProvince, setShippingProvince] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [sdiCode, setSdiCode] = useState('')
  const [baseFirstName, setBaseFirstName] = useState('')
  const [baseLastName, setBaseLastName] = useState('')
  const [baseEmail, setBaseEmail] = useState('')
  const [basePhone, setBasePhone] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      if (!supabase) {
        if (!cancelled) {
          setShouldLogin(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      setOrdersError('')
      setOrdersLoading(true)

      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) {
        if (!cancelled) {
          setShouldLogin(true)
          setLoading(false)
        }
        return
      }

      if (!cancelled) setUserEmail(user.email ?? null)

      const [profileRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle<Record<string, unknown>>(),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ])

      if (cancelled) return

      if (profileRes.error) {
        console.warn('Profilo non caricato, continuo con valori vuoti:', profileRes.error.message)
      }

      if (ordersRes.error) {
        setOrdersError(`Errore nel caricamento ordini: ${ordersRes.error.message}`)
      } else {
        const rows = (ordersRes.data ?? []) as Record<string, unknown>[]
        const filtered = rows
          .filter((row) => {
            const linkCandidates = [
              row.profile_id,
              row.user_id,
              row.customer_id,
              row.client_id,
              row.profileId,
              row.userId,
              row.customerId,
              row.clientId,
            ].map(asString)
            const emailCandidates = [row.email, row.billing_email, row.customer_email].map(asString)
            return (
              linkCandidates.some((v) => v !== '' && v === user.id) ||
              emailCandidates.some((v) => v !== '' && v === (user.email ?? ''))
            )
          })
          .map((row) => ({
            id: asString(row.id),
            created_at: asString(row.created_at) || null,
            status: asString(row.status) || 'In elaborazione',
            total: asNumber(row.total_amount ?? row.total ?? row.grand_total),
            items_json: Array.isArray(row.items_json)
              ? (row.items_json as Array<Record<string, unknown>>)
              : [],
          }))
          .filter((o) => o.id !== '')
        setOrders(filtered)
      }

      const row = profileRes.data ?? {}
      const p: ProfileRow | null = profileRes.data
        ? {
            id: asString(row.id),
            first_name: asString(row.first_name) || null,
            last_name: asString(row.last_name) || null,
            telefono: asString(row.telefono) || null,
            account_type: (asString(row.account_type) as 'azienda' | 'privato' | '') || null,
            ragione_sociale: asString(row.ragione_sociale) || null,
            partita_iva: asString(row.partita_iva) || null,
            sdi: asString(row.sdi) || null,
            indirizzo: asString(row.indirizzo) || null,
            citta: asString(row.citta) || null,
            cap: asString(row.cap) || null,
            provincia: asString(row.provincia) || null,
            default_shipping_address: asString(row.default_shipping_address) || null,
            default_shipping_city: asString(row.default_shipping_city) || null,
            default_shipping_zip_code: asString(row.default_shipping_zip_code) || null,
            default_shipping_province: asString(row.default_shipping_province) || null,
            email: asString(row.email) || null,
            newsletter_opt_in: Boolean(row.newsletter_opt_in),
          }
        : null

      setProfile(p)
      setBillingName(p?.ragione_sociale ?? [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim())
      setShippingAddress(p?.default_shipping_address ?? p?.indirizzo ?? '')
      setShippingCity(p?.default_shipping_city ?? p?.citta ?? '')
      setShippingZip(p?.default_shipping_zip_code ?? p?.cap ?? '')
      setShippingProvince((p?.default_shipping_province ?? p?.provincia ?? '').toUpperCase())
      setVatNumber(p?.partita_iva ?? '')
      setSdiCode(p?.sdi ?? '')
      setBaseFirstName(p?.first_name ?? '')
      setBaseLastName(p?.last_name ?? '')
      setBaseEmail(p?.email ?? user.email ?? '')
      setBasePhone(p?.telefono ?? '')
      setNewsletterOptIn(Boolean(p?.newsletter_opt_in))
      setOrdersLoading(false)
      setLoading(false)
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const fullName = useMemo(() => {
    if (!profile) return ''
    return [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
  }, [profile])
  const displayName = useMemo(
    () => profile?.ragione_sociale?.trim() || fullName || 'Cliente Astro Forniture',
    [profile, fullName],
  )
  const customerCode = useMemo(
    () => (profile?.id ? profile.id.slice(0, 8).toUpperCase() : 'N/D'),
    [profile?.id],
  )
  const avatarInitials = useMemo(() => {
    const source = displayName.trim()
    if (!source) return 'AF'
    const tokens = source.split(/\s+/).filter(Boolean)
    if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
    return `${tokens[0][0] ?? ''}${tokens[1][0] ?? ''}`.toUpperCase()
  }, [displayName])
  const latestOrder = orders[0] ?? null
  const statusOptions = useMemo(() => {
    const all = Array.from(new Set(orders.map((o) => (o.status ?? '').trim()).filter(Boolean)))
    return ['all', ...all]
  }, [orders])
  const filteredOrders = useMemo(() => {
    if (ordersStatusFilter === 'all') return orders
    return orders.filter((o) => (o.status ?? '') === ordersStatusFilter)
  }, [orders, ordersStatusFilter])
  const recentOrderedProducts = useMemo(() => {
    if (!latestOrder?.items_json?.length) return []
    return latestOrder.items_json
      .map((item) => ({
        id: asString(item.id) || asString(item.sku) || asString(item.name),
        name: asString(item.name) || 'Prodotto',
      }))
      .filter((item) => item.id !== '')
      .slice(0, 8)
  }, [latestOrder])

  async function handleSignOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    navigate('/')
  }

  async function updateProfileModernThenLegacy(
    modernPayload: Record<string, unknown>,
    legacyPayload: Record<string, unknown>,
  ) {
    if (!supabase || !profile?.id) return
    const modernRes = await supabase.from('profiles').update(modernPayload).eq('id', profile.id)
    if (!modernRes.error) return
    const fallbackRes = await supabase.from('profiles').update(legacyPayload).eq('id', profile.id)
    if (fallbackRes.error) throw fallbackRes.error
  }

  async function handleSaveAddressesAndCompany() {
    setSaveMessage('')
    setSaveError('')
    setIsSaving(true)
    try {
      await updateProfileModernThenLegacy(
        {
          shipping_address: shippingAddress.trim(),
          shipping_city: shippingCity.trim(),
          shipping_zip: shippingZip.trim(),
          shipping_province: shippingProvince.trim().toUpperCase(),
          vat_number: vatNumber.trim() || null,
          sdi_code: sdiCode.trim() || null,
          ragione_sociale: billingName.trim() || null,
        },
        {
          default_shipping_address: shippingAddress.trim(),
          default_shipping_city: shippingCity.trim(),
          default_shipping_zip_code: shippingZip.trim(),
          default_shipping_province: shippingProvince.trim().toUpperCase(),
          indirizzo: shippingAddress.trim(),
          citta: shippingCity.trim(),
          cap: shippingZip.trim(),
          provincia: shippingProvince.trim().toUpperCase(),
          partita_iva: vatNumber.trim() || null,
          sdi: sdiCode.trim() || null,
          ragione_sociale: billingName.trim() || null,
        },
      )
      setSaveMessage('Dati indirizzo e aziendali aggiornati.')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Errore aggiornamento dati.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveBaseProfile() {
    if (!supabase || !profile?.id) return
    setSaveMessage('')
    setSaveError('')
    setIsSaving(true)
    try {
      const mergedFullName = `${baseFirstName.trim()} ${baseLastName.trim()}`.trim()
      const res = await supabase
        .from('profiles')
        .update({
          first_name: baseFirstName.trim() || null,
          last_name: baseLastName.trim() || null,
          telefono: basePhone.trim() || null,
          email: baseEmail.trim() || null,
          ragione_sociale: billingName.trim() || mergedFullName || null,
        })
        .eq('id', profile.id)
      if (res.error) throw res.error
      setSaveMessage('Dati anagrafici aggiornati.')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Errore aggiornamento dati.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveNewsletter() {
    if (!supabase || !profile?.id) return
    setSaveMessage('')
    setSaveError('')
    setIsSaving(true)
    try {
      const res = await supabase
        .from('profiles')
        .update({ newsletter_opt_in: newsletterOptIn })
        .eq('id', profile.id)
      if (res.error) throw res.error
      setSaveMessage('Preferenza newsletter aggiornata.')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Errore aggiornamento newsletter.')
    } finally {
      setIsSaving(false)
    }
  }

  if (shouldLogin) {
    return <Navigate to="/login" replace state={{ from: '/account/profile' }} />
  }

  return (
    <main className="min-h-[70vh] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Area cliente</h2>
            <nav className="mt-3 space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Il mio Account" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon={Truck} label="Ordini e Tracking" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
              <SidebarItem icon={PackageCheck} label="Prodotti ordinati" active={activeTab === 'ordered-products'} onClick={() => setActiveTab('ordered-products')} />
              <SidebarItem icon={Heart} label="Articoli preferiti" active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
              <SidebarItem icon={MapPin} label="Indirizzi / Dati Aziendali" active={activeTab === 'addresses-company'} onClick={() => setActiveTab('addresses-company')} />
              <SidebarItem icon={User} label="Nome-Email-Telefono" active={activeTab === 'base-profile'} onClick={() => setActiveTab('base-profile')} />
              <SidebarItem icon={CreditCard} label="Carte di credito" active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
              <SidebarItem icon={Shield} label="Amministratore" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
              <SidebarItem icon={Mail} label="Newsletter" active={activeTab === 'newsletter'} onClick={() => setActiveTab('newsletter')} />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
              >
                <LogOut className="size-4" aria-hidden />
                <span>Esci</span>
              </button>
            </nav>
          </aside>

          <section className="space-y-6">
            {loading ? <p className="text-sm text-slate-600">Caricamento profilo in corso...</p> : null}
            {!loading && error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
            {!loading && !error && !profile ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-700">Profilo non trovato per questo account.</p>
              </div>
            ) : null}

            {saveMessage ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{saveMessage}</p> : null}
            {saveError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p> : null}

            {!loading && !error && profile && activeTab === 'dashboard' ? (
              <div className="grid gap-6 xl:grid-cols-12">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">{avatarInitials}</div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Profilo cliente</p>
                      <h1 className="mt-1 text-xl font-semibold text-slate-900">{displayName}</h1>
                      <p className="mt-2 text-sm text-slate-600">Codice Cliente: {customerCode}</p>
                      <p className="text-sm text-slate-600">{userEmail ?? '-'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p>Telefono: {profile.telefono ?? '-'}</p>
                    <p>Tipo account: {profile.account_type ?? '-'}</p>
                  </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">I miei ordini</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Ultimo ordine effettuato</h2>
                    </div>
                    <button type="button" className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Riordina</button>
                  </div>
                  {!latestOrder ? (
                    <p className="mt-3 text-sm text-slate-600">Nessun ordine disponibile.</p>
                  ) : (
                    <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                      <Info label="ID Ordine">{latestOrder.id}</Info>
                      <Info label="Data">{latestOrder.created_at ? new Date(latestOrder.created_at).toLocaleDateString('it-IT') : '-'}</Info>
                      <Info label="Totale">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(latestOrder.total)}</Info>
                    </div>
                  )}
                </article>
              </div>
            ) : null}

            {!loading && !error && profile && activeTab === 'orders' ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Ordini e Tracking</h2>
                  <select value={ordersStatusFilter} onChange={(e) => setOrdersStatusFilter(e.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm">
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status === 'all' ? 'Tutti gli stati' : status}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-2 py-2">ID Ordine</th><th className="px-2 py-2">Data</th><th className="px-2 py-2">Stato</th><th className="px-2 py-2">Totale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-100">
                          <td className="px-2 py-2 font-medium text-slate-900">{order.id}</td>
                          <td className="px-2 py-2 text-slate-700">{order.created_at ? new Date(order.created_at).toLocaleDateString('it-IT') : '-'}</td>
                          <td className="px-2 py-2 text-slate-700">{order.status ?? '-'}</td>
                          <td className="px-2 py-2 text-slate-700">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 ? <p className="mt-3 text-sm text-slate-600">Nessun ordine per il filtro selezionato.</p> : null}
                </div>
              </article>
            ) : null}

            {!loading && !error && profile && activeTab === 'addresses-company' ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Indirizzi / Dati Aziendali</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Ragione Sociale / Intestazione"><input value={billingName} onChange={(e) => setBillingName(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="P.IVA"><input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Codice SDI"><input value={sdiCode} onChange={(e) => setSdiCode(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <div />
                  <Field label="Via e numero civico"><input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Citta"><input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="CAP"><input value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Provincia"><input value={shippingProvince} onChange={(e) => setShippingProvince(e.target.value.toUpperCase())} maxLength={2} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                </div>
                <button type="button" onClick={handleSaveAddressesAndCompany} disabled={isSaving} className="mt-4 inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">{isSaving ? 'Salvataggio...' : 'Salva dati indirizzo e aziendali'}</button>
              </article>
            ) : null}

            {!loading && !error && profile && activeTab === 'base-profile' ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Nome-Email-Telefono</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Nome"><input value={baseFirstName} onChange={(e) => setBaseFirstName(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Cognome"><input value={baseLastName} onChange={(e) => setBaseLastName(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Email"><input value={baseEmail} onChange={(e) => setBaseEmail(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                  <Field label="Telefono"><input value={basePhone} onChange={(e) => setBasePhone(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></Field>
                </div>
                <button type="button" onClick={handleSaveBaseProfile} disabled={isSaving} className="mt-4 inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">{isSaving ? 'Salvataggio...' : 'Salva dati base'}</button>
              </article>
            ) : null}

            {!loading && !error && profile && activeTab === 'newsletter' ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Newsletter</h2>
                <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
                  <span>Voglio ricevere aggiornamenti e offerte via email.</span>
                </label>
                <button type="button" onClick={handleSaveNewsletter} disabled={isSaving} className="mt-4 inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">{isSaving ? 'Salvataggio...' : 'Salva preferenze'}</button>
              </article>
            ) : null}

            {!loading && !error && profile && activeTab === 'ordered-products' ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Prodotti ordinati</h2>
                {recentOrderedProducts.length === 0 ? <p className="mt-2 text-sm text-slate-600">Nessun prodotto recente da mostrare.</p> : (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {recentOrderedProducts.map((item) => (
                      <div key={item.id} className="min-w-28 rounded-xl border border-slate-200 bg-white p-3 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">{item.name.slice(0, 2).toUpperCase()}</div>
                        <p className="mt-2 line-clamp-2 text-xs text-slate-700">{item.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ) : null}

            {!loading && !error && profile && activeTab === 'favorites' ? <PlaceholderCard title="Articoli preferiti" text="La wishlist verra mostrata qui non appena colleghiamo la tabella dedicata." /> : null}
            {!loading && !error && profile && activeTab === 'cards' ? <PlaceholderCard title="Carte di credito" text="Sezione predisposta. Gestione pagamenti da integrare con provider sicuro." /> : null}
            {!loading && !error && profile && activeTab === 'admin' ? <PlaceholderCard title="Amministratore" text="Area informativa: accesso amministrativo separato dal portale cliente." /> : null}

            <div>
              <Link to="/" className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Torna alla home</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function Info({ label, children }: { label: string; children: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{children}</p>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <Icon className="size-4" aria-hidden />
      <span>{label}</span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function PlaceholderCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </article>
  )
}
