import { getSupabaseBrowserClient } from '../lib/supabaseClient'

export type AdminCustomerOrder = {
  id: string
  createdAt: string | null
  status: string
  total: number
  shippingStreet: string
  shippingCity: string
  shippingZip: string
  shippingProvince: string
}

export type AdminCustomer = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  companyName: string
  registeredAt: string | null
  ordersCount: number
  totalSpent: number
  status: 'Attivo'
  shippingStreet: string
  shippingCity: string
  shippingZip: string
  shippingProvince: string
  orders: AdminCustomerOrder[]
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const n = Number.parseFloat(value.replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function orderUserId(row: Record<string, unknown>): string {
  return (
    asString(row.user_id) ||
    asString(row.profile_id) ||
    asString(row.customer_id) ||
    asString(row.client_id)
  )
}

function orderEmail(row: Record<string, unknown>): string {
  return normalizeEmail(
    asString(row.billing_email) ||
      asString(row.customer_email) ||
      asString(row.email) ||
      asString(row.user_email),
  )
}

function parseShipping(row: Record<string, unknown>): {
  street: string
  city: string
  zip: string
  province: string
} {
  let street =
    asString(row.shipping_street) ||
    asString(row.shipping_address_street) ||
    asString(row.default_shipping_address) ||
    asString(row.indirizzo)
  let city =
    asString(row.shipping_city) ||
    asString(row.default_shipping_city) ||
    asString(row.citta)
  let zip =
    asString(row.shipping_zip) ||
    asString(row.default_shipping_zip_code) ||
    asString(row.cap)
  let province =
    asString(row.shipping_province) ||
    asString(row.default_shipping_province) ||
    asString(row.provincia)

  const raw = row.shipping_address
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    street =
      street ||
      asString(obj.street) ||
      asString(obj.address) ||
      asString(obj.indirizzo) ||
      asString(obj.line1)
    city = city || asString(obj.city) || asString(obj.citta)
    zip = zip || asString(obj.zip) || asString(obj.cap) || asString(obj.postal_code)
    province = province || asString(obj.province) || asString(obj.provincia)
  } else if (typeof raw === 'string' && raw.trim() && !street) {
    street = raw.trim()
  }

  return { street, city, zip, province }
}

function toCustomerOrder(row: Record<string, unknown>): AdminCustomerOrder {
  const shipping = parseShipping(row)
  return {
    id: asString(row.id),
    createdAt: asString(row.created_at) || null,
    status: asString(row.status) || 'In Elaborazione',
    total: asNumber(row.total_amount ?? row.total ?? row.grand_total),
    shippingStreet: shipping.street,
    shippingCity: shipping.city,
    shippingZip: shipping.zip,
    shippingProvince: shipping.province,
  }
}

function displayName(firstName: string, lastName: string, companyName: string, email: string): string {
  const person = [firstName, lastName].filter(Boolean).join(' ').trim()
  if (person) return person
  if (companyName) return companyName
  if (email) return email
  return 'Cliente senza nome'
}

function toCustomer(
  row: Record<string, unknown>,
  orders: AdminCustomerOrder[],
): AdminCustomer {
  const firstName = asString(row.first_name) || asString(row.nome)
  const lastName = asString(row.last_name) || asString(row.cognome)
  const companyName =
    asString(row.ragione_sociale) ||
    asString(row.company_name) ||
    asString(row.companyName)
  const email = asString(row.email) || asString(row.user_email)
  const shipping = parseShipping(row)
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  return {
    id: asString(row.id),
    firstName,
    lastName,
    fullName: displayName(firstName, lastName, companyName, email),
    email,
    phone: asString(row.telefono) || asString(row.phone),
    companyName,
    registeredAt: asString(row.created_at) || asString(row.registered_at) || null,
    ordersCount: orders.length,
    totalSpent,
    status: 'Attivo',
    shippingStreet: shipping.street,
    shippingCity: shipping.city,
    shippingZip: shipping.zip,
    shippingProvince: shipping.province,
    orders,
  }
}

function matchOrdersForProfile(
  profileId: string,
  profileEmail: string,
  orderRows: Record<string, unknown>[],
): AdminCustomerOrder[] {
  const email = normalizeEmail(profileEmail)
  return orderRows
    .filter((row) => {
      const byId = orderUserId(row) === profileId
      const byEmail = email !== '' && orderEmail(row) === email
      return byId || byEmail
    })
    .map(toCustomerOrder)
    .filter((order) => order.id !== '')
    .sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0
      return tb - ta
    })
}

/** Elenco clienti registrati (`profiles`) con aggregati da `orders`. */
export async function fetchCustomersForAdmin(): Promise<AdminCustomer[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) throw new Error('Supabase non configurato')

  const [profilesRes, ordersRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
  ])

  if (profilesRes.error) {
    if (/created_at/i.test(profilesRes.error.message)) {
      const retry = await supabase.from('profiles').select('*')
      if (retry.error) throw retry.error
      const orderRows = ordersRes.error
        ? []
        : ((ordersRes.data ?? []) as Record<string, unknown>[])
      return ((retry.data ?? []) as Record<string, unknown>[])
        .map((row) => {
          const id = asString(row.id)
          if (!id) return null
          const email = asString(row.email) || asString(row.user_email)
          return toCustomer(row, matchOrdersForProfile(id, email, orderRows))
        })
        .filter((c): c is AdminCustomer => c != null)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'it'))
    }
    throw profilesRes.error
  }

  if (ordersRes.error) {
    console.warn('[admin/customers] ordini non caricabili:', ordersRes.error.message)
  }

  const orderRows = (ordersRes.data ?? []) as Record<string, unknown>[]
  const customers = ((profilesRes.data ?? []) as Record<string, unknown>[])
    .map((row) => {
      const id = asString(row.id)
      if (!id) return null
      const email = asString(row.email) || asString(row.user_email)
      return toCustomer(row, matchOrdersForProfile(id, email, orderRows))
    })
    .filter((c): c is AdminCustomer => c != null)

  return customers.sort((a, b) => {
    const ta = a.registeredAt ? Date.parse(a.registeredAt) : 0
    const tb = b.registeredAt ? Date.parse(b.registeredAt) : 0
    if (tb !== ta) return tb - ta
    return a.fullName.localeCompare(b.fullName, 'it')
  })
}

export function customersToCsv(customers: AdminCustomer[]): string {
  const headers = [
    'Nome',
    'Cognome',
    'Email',
    'Data registrazione',
    'Ordini totali',
    'Spesa totale',
    'Stato',
    'Telefono',
    'Ragione sociale',
    'Indirizzo spedizione',
    'Citta',
    'CAP',
    'Provincia',
  ]

  const escape = (value: string | number) => {
    const text = String(value ?? '')
    if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
  }

  const rows = customers.map((c) =>
    [
      c.firstName,
      c.lastName,
      c.email,
      c.registeredAt ?? '',
      c.ordersCount,
      c.totalSpent.toFixed(2),
      c.status,
      c.phone,
      c.companyName,
      c.shippingStreet,
      c.shippingCity,
      c.shippingZip,
      c.shippingProvince,
    ]
      .map(escape)
      .join(','),
  )

  return `\uFEFF${[headers.join(','), ...rows].join('\n')}`
}