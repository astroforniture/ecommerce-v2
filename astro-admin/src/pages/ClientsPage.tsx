import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type ProfileRecord = {
  id: string
  companyName: string
  email: string
  vatNumber: string
  city: string
  phone: string
  pec: string
  sdi: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  raw: Record<string, unknown>
}

type OrderRecord = {
  id: string
  status: string
  total: number | null
  createdAt: string | null
}

type OrderItemRecord = {
  id: string
  productName: string
  quantity: number | null
  unitPrice: number | null
  lineTotal: number | null
}

const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const asText = (value: unknown) => (typeof value === 'string' ? value : '')
const asNumber = (value: unknown) => (typeof value === 'number' ? value : null)

function toProfileRecord(row: Record<string, unknown>): ProfileRecord {
  const companyName =
    asText(row.company_name) ||
    asText(row.ragione_sociale) ||
    asText(row.name) ||
    asText(row.companyName)
  const shippingAddress =
    asText(row.shipping_address) ||
    asText(row.indirizzo_spedizione) ||
    asText(row.shippingAddress) ||
    asText(row.default_shipping_address)
  const shippingCity =
    asText(row.shipping_city) || asText(row.default_shipping_city) || asText(row.citta)
  const shippingZip =
    asText(row.shipping_zip) || asText(row.default_shipping_zip_code) || asText(row.cap)

  return {
    id: asText(row.id),
    companyName,
    email: asText(row.email) || asText(row.user_email),
    vatNumber: asText(row.partita_iva) || asText(row.vat_number) || asText(row.vatNumber),
    city: asText(row.city) || asText(row.citta),
    phone: asText(row.phone) || asText(row.telefono),
    pec: asText(row.pec),
    sdi: asText(row.sdi) || asText(row.codice_sdi),
    shippingAddress,
    shippingCity,
    shippingZip,
    raw: row,
  }
}

function toOrderRecord(row: Record<string, unknown>): OrderRecord {
  return {
    id: asText(row.id),
    status: asText(row.status) || 'n/d',
    total: asNumber(row.total_amount) ?? asNumber(row.total),
    createdAt: asText(row.created_at) || null,
  }
}

function toOrderItemRecord(row: Record<string, unknown>): OrderItemRecord {
  return {
    id: asText(row.id),
    productName:
      asText(row.product_name) ||
      asText(row.productName) ||
      asText(row.name) ||
      asText(row.title) ||
      'Prodotto senza nome',
    quantity: asNumber(row.quantity) ?? asNumber(row.qty),
    unitPrice: asNumber(row.unit_price) ?? asNumber(row.price),
    lineTotal: asNumber(row.line_total) ?? asNumber(row.total),
  }
}

function formatDate(value: string | null) {
  if (!value) return 'n/d'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'n/d'
  return dateFormatter.format(parsed)
}

export function ClientsPage() {
  const [query, setQuery] = useState('')
  const [profiles, setProfiles] = useState<ProfileRecord[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<OrderRecord[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItemRecord[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isLoadingOrderItems, setIsLoadingOrderItems] = useState(false)
  const [profilesError, setProfilesError] = useState('')
  const [ordersError, setOrdersError] = useState('')
  const [orderItemsError, setOrderItemsError] = useState('')

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoadingProfiles(true)
      setProfilesError('')

      const { data, error } = await supabase.from('profiles').select('*')
      if (error) {
        setProfilesError("Impossibile caricare i clienti dalla tabella 'profiles'.")
        setProfiles([])
        setSelectedProfileId(null)
        setIsLoadingProfiles(false)
        return
      }

      const parsedProfiles = (data ?? [])
        .map((row) => toProfileRecord(row as Record<string, unknown>))
        .filter((profile) => profile.id)

      // Retry una volta se la sync email è appena avvenuta e i primi risultati sono ancora null.
      const needsEmailRetry =
        parsedProfiles.length > 0 && parsedProfiles.every((profile) => profile.email.trim() === '')

      if (needsEmailRetry) {
        const retry = await supabase.from('profiles').select('*')
        if (!retry.error) {
          const retryProfiles = (retry.data ?? [])
            .map((row) => toProfileRecord(row as Record<string, unknown>))
            .filter((profile) => profile.id)
          setProfiles(retryProfiles)
          setSelectedProfileId(retryProfiles[0]?.id ?? null)
          setIsLoadingProfiles(false)
          return
        }
      }

      setProfiles(parsedProfiles)
      setSelectedProfileId(parsedProfiles[0]?.id ?? null)
      setIsLoadingProfiles(false)
    }

    loadProfiles()
  }, [])

  useEffect(() => {
    const loadOrdersForProfile = async () => {
      if (!selectedProfileId) {
        setSelectedOrders([])
        setSelectedOrderId(null)
        setSelectedOrderItems([])
        return
      }

      setIsLoadingOrders(true)
      setOrdersError('')

      const { data, error } = await supabase.from('orders').select('*')
      if (error) {
        setOrdersError("Impossibile caricare gli ordini associati al cliente selezionato.")
        setSelectedOrders([])
        setSelectedOrderId(null)
        setSelectedOrderItems([])
        setIsLoadingOrders(false)
        return
      }

      const allOrders = (data ?? []).map((row) => row as Record<string, unknown>)
      const profileOrders = allOrders
        .filter((order) => {
          const candidates = [
            order.profile_id,
            order.customer_id,
            order.client_id,
            order.user_id,
            order.profileId,
            order.customerId,
            order.clientId,
            order.userId,
          ]
          return candidates.some((candidate) => asText(candidate) === selectedProfileId)
        })
        .map(toOrderRecord)

      setSelectedOrders(profileOrders)
      setSelectedOrderId(profileOrders[0]?.id ?? null)
      setIsLoadingOrders(false)
    }

    loadOrdersForProfile()
  }, [selectedProfileId])

  useEffect(() => {
    const loadOrderItems = async () => {
      if (!selectedOrderId) {
        setSelectedOrderItems([])
        return
      }

      setIsLoadingOrderItems(true)
      setOrderItemsError('')

      const { data, error } = await supabase.from('order_items').select('*')
      if (error) {
        setOrderItemsError("Impossibile caricare i prodotti dell'ordine selezionato.")
        setSelectedOrderItems([])
        setIsLoadingOrderItems(false)
        return
      }

      const orderItems = (data ?? [])
        .map((row) => row as Record<string, unknown>)
        .filter((item) => {
          const candidates = [item.order_id, item.orderId, item.order_uuid]
          return candidates.some((candidate) => asText(candidate) === selectedOrderId)
        })
        .map(toOrderItemRecord)

      setSelectedOrderItems(orderItems)
      setIsLoadingOrderItems(false)
    }

    loadOrderItems()
  }, [selectedOrderId])

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return profiles

    return profiles.filter((profile) => {
      const searchableName = `${profile.companyName}`.toLowerCase()
      return (
        searchableName.includes(normalizedQuery) ||
        profile.email.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [profiles, query])

  const selectedProfile =
    filteredProfiles.find((profile) => profile.id === selectedProfileId) ??
    profiles.find((profile) => profile.id === selectedProfileId) ??
    null
  const customer = selectedProfile
  console.log('DATI PROFILO CLIENTE:', customer)

  return (
    <section className="clients-page">
      <header className="page-header">
        <div>
          <h1>Clienti</h1>
          <p>Elenco clienti reali registrati su Astro Forniture.</p>
        </div>
      </header>

      <article className="card">
        <div className="clients-toolbar">
          <input
            type="search"
            value={query}
            placeholder="Cerca per ragione sociale o email"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cerca clienti per ragione sociale o email"
          />
        </div>

        {profilesError ? <p className="auth-error">{profilesError}</p> : null}

        <div className="table-wrap">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Ragione Sociale</th>
                <th>Email</th>
                <th>Partita IVA</th>
                <th>Citta</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr
                  key={profile.id}
                  className={profile.id === selectedProfileId ? 'selected-row' : ''}
                  onClick={() => setSelectedProfileId(profile.id)}
                >
                  <td>{profile.companyName || 'n/d'}</td>
                  <td>{profile.email || 'n/d'}</td>
                  <td>{profile.vatNumber || 'n/d'}</td>
                  <td>{profile.city || 'n/d'}</td>
                  <td>{profile.phone || 'n/d'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoadingProfiles ? <p className="table-empty">Caricamento clienti in corso...</p> : null}
        {!isLoadingProfiles && filteredProfiles.length === 0 ? (
          <p className="table-empty">Nessun cliente trovato con i filtri correnti.</p>
        ) : null}
      </article>

      <article className="card">
        <h2>Dettaglio Cliente</h2>
        {!selectedProfile ? (
          <p className="table-empty">Seleziona un cliente per visualizzare i dettagli.</p>
        ) : (
          <>
            <div className="client-detail-grid">
              <p>
                <strong>Ragione Sociale:</strong> {selectedProfile.companyName || 'n/d'}
              </p>
              <p>
                <strong>Email:</strong> {selectedProfile.email || 'Email non presente'}
              </p>
              <p>
                <strong>Partita IVA:</strong> {selectedProfile.vatNumber || 'n/d'}
              </p>
              <p>
                <strong>Citta:</strong> {selectedProfile.city || 'n/d'}
              </p>
              <p>
                <strong>Telefono:</strong> {selectedProfile.phone || 'n/d'}
              </p>
              <p>
                <strong>PEC:</strong> {selectedProfile.pec || 'n/d'}
              </p>
              <p>
                <strong>SDI:</strong> {selectedProfile.sdi || 'n/d'}
              </p>
              <p>
                <strong>Indirizzo di spedizione:</strong>{' '}
                {[selectedProfile.shippingAddress, selectedProfile.shippingCity, selectedProfile.shippingZip]
                  .filter((value) => value.trim().length > 0)
                  .join(', ') || 'Indirizzo non registrato'}
              </p>
            </div>

            <h3>Storico Ordini</h3>
            {ordersError ? <p className="auth-error">{ordersError}</p> : null}
            {isLoadingOrders ? (
              <p className="table-empty">Caricamento ordini in corso...</p>
            ) : selectedOrders.length === 0 ? (
              <p className="table-empty">Nessun ordine associato a questo cliente.</p>
            ) : (
              <div className="table-wrap">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>ID Ordine</th>
                      <th>Data</th>
                      <th>Stato</th>
                      <th>Totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={order.id === selectedOrderId ? 'selected-row' : ''}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td>{order.id || 'n/d'}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.status}</td>
                        <td>{order.total == null ? 'n/d' : currency.format(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h3>Prodotti Ordine Selezionato</h3>
            {orderItemsError ? <p className="auth-error">{orderItemsError}</p> : null}
            {isLoadingOrderItems ? (
              <p className="table-empty">Caricamento prodotti in corso...</p>
            ) : !selectedOrderId ? (
              <p className="table-empty">Seleziona un ordine per vedere i prodotti specifici.</p>
            ) : selectedOrderItems.length === 0 ? (
              <p className="table-empty">Nessun prodotto trovato per l'ordine selezionato.</p>
            ) : (
              <div className="table-wrap">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Prodotto</th>
                      <th>Quantita</th>
                      <th>Prezzo Unitario</th>
                      <th>Totale Riga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName}</td>
                        <td>{item.quantity == null ? 'n/d' : item.quantity}</td>
                        <td>{item.unitPrice == null ? 'n/d' : currency.format(item.unitPrice)}</td>
                        <td>{item.lineTotal == null ? 'n/d' : currency.format(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </article>
    </section>
  )
}
