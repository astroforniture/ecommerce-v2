import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from './supabaseClient'

type AuthResult = { ok: true; user: User } | { ok: false; error: string }

function adminEmails(): string[] {
  return String(import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x.length > 0)
}

export function isSupabaseAdminUser(user: User): boolean {
  const email = (user.email ?? '').trim().toLowerCase()
  const byEmail = email.length > 0 && adminEmails().includes(email)
  const role = String(user.user_metadata?.role ?? user.app_metadata?.role ?? '').toLowerCase()
  const byRole = role === 'admin'
  return byEmail || byRole
}

export async function signInWithEmailPassword(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return { ok: false, error: 'Supabase non configurato.' }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) return { ok: false, error: error.message }
  if (!data.user) return { ok: false, error: 'Utente non trovato.' }
  return { ok: true, user: data.user }
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = String(value ?? '').trim()
    if (trimmed) return trimmed
  }
  return ''
}

function asProfileString(row: Record<string, unknown> | null | undefined, key: string): string {
  if (!row) return ''
  const value = row[key]
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}

/** Estrae campi profilo da user_metadata (fallback se la riga profiles è vuota/incompleta). */
export function profileFieldsFromUserMetadata(user: User | null | undefined): {
  firstName: string
  lastName: string
  companyName: string
  address: string
  city: string
  zipCode: string
  province: string
  vatNumber: string
  sdiCode: string
  taxCode: string
  pec: string
  phone: string
  email: string
  accountType: string
} {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>
  const str = (key: string) => {
    const v = meta[key]
    return typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim()
  }
  return {
    firstName: str('first_name'),
    lastName: str('last_name'),
    companyName: str('ragione_sociale'),
    address: firstNonEmpty(str('indirizzo'), str('default_shipping_address'), str('shipping_address')),
    city: firstNonEmpty(str('citta'), str('default_shipping_city'), str('shipping_city')),
    zipCode: firstNonEmpty(str('cap'), str('default_shipping_zip_code'), str('shipping_zip')),
    province: firstNonEmpty(
      str('provincia'),
      str('default_shipping_province'),
      str('shipping_province'),
    ).toUpperCase(),
    vatNumber: firstNonEmpty(str('partita_iva'), str('vat_number')),
    sdiCode: firstNonEmpty(str('sdi'), str('sdi_code')),
    taxCode: firstNonEmpty(str('codice_fiscale'), str('tax_code')),
    pec: str('pec'),
    phone: firstNonEmpty(str('telefono'), str('phone')),
    email: firstNonEmpty(str('email'), user?.email),
    accountType: str('account_type').toLowerCase(),
  }
}

/**
 * Unisce riga `profiles` + `user_metadata` per valorizzare form checkout/profilo.
 * Preferisce sempre i dati DB; metadata solo come fallback.
 */
export function resolveLoggedInUserFormData(
  user: User | null | undefined,
  profileRow?: Record<string, unknown> | null,
): {
  firstName: string
  lastName: string
  companyName: string
  address: string
  city: string
  zipCode: string
  province: string
  vatNumber: string
  sdiCode: string
  taxCode: string
  pec: string
  phone: string
  email: string
  accountType: 'privato' | 'azienda' | 'ente' | ''
  isCompany: boolean
} {
  const meta = profileFieldsFromUserMetadata(user)
  const row = profileRow ?? null

  const firstName = firstNonEmpty(asProfileString(row, 'first_name'), meta.firstName)
  const lastName = firstNonEmpty(asProfileString(row, 'last_name'), meta.lastName)
  const companyName = firstNonEmpty(asProfileString(row, 'ragione_sociale'), meta.companyName)
  const address = firstNonEmpty(
    asProfileString(row, 'shipping_address'),
    asProfileString(row, 'default_shipping_address'),
    asProfileString(row, 'indirizzo'),
    meta.address,
  )
  const city = firstNonEmpty(
    asProfileString(row, 'shipping_city'),
    asProfileString(row, 'default_shipping_city'),
    asProfileString(row, 'citta'),
    meta.city,
  )
  const zipCode = firstNonEmpty(
    asProfileString(row, 'shipping_zip'),
    asProfileString(row, 'default_shipping_zip_code'),
    asProfileString(row, 'cap'),
    meta.zipCode,
  )
  const province = firstNonEmpty(
    asProfileString(row, 'shipping_province'),
    asProfileString(row, 'default_shipping_province'),
    asProfileString(row, 'provincia'),
    meta.province,
  ).toUpperCase()
  const vatNumber = firstNonEmpty(
    asProfileString(row, 'vat_number'),
    asProfileString(row, 'partita_iva'),
    meta.vatNumber,
  )
  const sdiCode = firstNonEmpty(
    asProfileString(row, 'sdi_code'),
    asProfileString(row, 'sdi'),
    meta.sdiCode,
  )
  const taxCode = firstNonEmpty(
    asProfileString(row, 'codice_fiscale'),
    asProfileString(row, 'tax_code'),
    meta.taxCode,
  )
  const pec = firstNonEmpty(asProfileString(row, 'pec'), meta.pec)
  const phone = firstNonEmpty(
    asProfileString(row, 'telefono'),
    asProfileString(row, 'phone'),
    meta.phone,
  )
  const email = firstNonEmpty(asProfileString(row, 'email'), meta.email, user?.email)
  const rawType = firstNonEmpty(asProfileString(row, 'account_type'), meta.accountType).toLowerCase()
  const accountType =
    rawType === 'ente' || rawType === 'azienda' || rawType === 'privato' ? rawType : ''
  const isCompany =
    accountType === 'azienda' ||
    accountType === 'ente' ||
    Boolean(companyName) ||
    Boolean(vatNumber)

  return {
    firstName,
    lastName,
    companyName,
    address,
    city,
    zipCode,
    province,
    vatNumber,
    sdiCode,
    taxCode,
    pec,
    phone,
    email,
    accountType: accountType as 'privato' | 'azienda' | 'ente' | '',
    isCompany,
  }
}

export async function signUpWithEmailPassword(
  input: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    accountType: 'azienda' | 'privato'
    companyName?: string
    vatNumber?: string
    taxCode?: string
    sdiCode?: string
    pecEmail?: string
    address: string
    city: string
    zipCode: string
    province: string
  },
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return { ok: false, error: 'Supabase non configurato.' }

  const firstName = input.firstName.trim()
  const lastName = input.lastName.trim()
  const phone = input.phone.trim()
  const companyName = input.companyName?.trim() || ''
  const vatNumber = input.vatNumber?.trim() || ''
  const taxCode = input.taxCode?.trim() || ''
  const sdiCode = input.sdiCode?.trim() || ''
  const pecEmail = input.pecEmail?.trim() || ''
  const address = input.address.trim()
  const city = input.city.trim()
  const zipCode = input.zipCode.trim()
  const province = input.province.trim().toUpperCase()
  const email = input.email.trim()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        telefono: phone,
        account_type: input.accountType,
        ragione_sociale: companyName || null,
        partita_iva: vatNumber || null,
        vat_number: vatNumber || null,
        codice_fiscale: taxCode || null,
        sdi: sdiCode || null,
        sdi_code: sdiCode || null,
        pec: pecEmail || null,
        indirizzo: address,
        citta: city,
        cap: zipCode,
        provincia: province,
        shipping_address: address,
        shipping_city: city,
        shipping_zip: zipCode,
        shipping_province: province,
        default_shipping_address: address,
        default_shipping_city: city,
        default_shipping_zip_code: zipCode,
        default_shipping_province: province,
      },
    },
  })
  if (error) return { ok: false, error: error.message }

  const userId = data.user?.id
  if (!userId) return { ok: true }

  const upsertPayload = {
    id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    telefono: phone,
    account_type: input.accountType,
    ragione_sociale: companyName || null,
    partita_iva: vatNumber || null,
    vat_number: vatNumber || null,
    codice_fiscale: taxCode || null,
    sdi: sdiCode || null,
    sdi_code: sdiCode || null,
    pec: pecEmail || null,
    indirizzo: address,
    citta: city,
    cap: zipCode,
    provincia: province,
    shipping_address: address,
    shipping_city: city,
    shipping_zip: zipCode,
    shipping_province: province,
    default_shipping_address: address,
    default_shipping_city: city,
    default_shipping_zip_code: zipCode,
    default_shipping_province: province,
  }

  const profileRes = await supabase.from('profiles').upsert(upsertPayload, { onConflict: 'id' })
  if (profileRes.error) {
    // Schema ridotto: ritenta con colonne legacy più comuni.
    const legacyPayload = {
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      telefono: phone,
      account_type: input.accountType,
      ragione_sociale: companyName || null,
      partita_iva: vatNumber || null,
      codice_fiscale: taxCode || null,
      sdi: sdiCode || null,
      pec: pecEmail || null,
      indirizzo: address,
      citta: city,
      cap: zipCode,
      provincia: province,
      default_shipping_address: address,
      default_shipping_city: city,
      default_shipping_zip_code: zipCode,
      default_shipping_province: province,
    }
    const legacyRes = await supabase.from('profiles').upsert(legacyPayload, { onConflict: 'id' })
    if (legacyRes.error) {
      return {
        ok: false,
        error: `Registrazione riuscita ma salvataggio profilo fallito: ${legacyRes.error.message}`,
      }
    }
  }

  return { ok: true }
}
