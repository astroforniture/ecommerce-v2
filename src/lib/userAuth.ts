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

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        telefono: input.phone.trim(),
        account_type: input.accountType,
        ragione_sociale: input.companyName?.trim() || null,
        partita_iva: input.vatNumber?.trim() || null,
        codice_fiscale: input.taxCode?.trim() || null,
        sdi: input.sdiCode?.trim() || null,
        pec: input.pecEmail?.trim() || null,
        indirizzo: input.address.trim(),
        citta: input.city.trim(),
        cap: input.zipCode.trim(),
        provincia: input.province.trim().toUpperCase(),
        default_shipping_address: input.accountType === 'privato' ? input.address.trim() : null,
        default_shipping_city: input.accountType === 'privato' ? input.city.trim() : null,
        default_shipping_zip_code: input.accountType === 'privato' ? input.zipCode.trim() : null,
        default_shipping_province:
          input.accountType === 'privato' ? input.province.trim().toUpperCase() : null,
      },
    },
  })
  if (error) return { ok: false, error: error.message }

  const userId = data.user?.id
  if (!userId) return { ok: true }

  const upsertPayload = {
    id: userId,
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    telefono: input.phone.trim(),
    account_type: input.accountType,
    ragione_sociale: input.companyName?.trim() || null,
    partita_iva: input.vatNumber?.trim() || null,
    codice_fiscale: input.taxCode?.trim() || null,
    sdi: input.sdiCode?.trim() || null,
    pec: input.pecEmail?.trim() || null,
    indirizzo: input.address.trim(),
    citta: input.city.trim(),
    cap: input.zipCode.trim(),
    provincia: input.province.trim().toUpperCase(),
    default_shipping_address: input.accountType === 'privato' ? input.address.trim() : null,
    default_shipping_city: input.accountType === 'privato' ? input.city.trim() : null,
    default_shipping_zip_code: input.accountType === 'privato' ? input.zipCode.trim() : null,
    default_shipping_province:
      input.accountType === 'privato' ? input.province.trim().toUpperCase() : null,
  }

  const profileRes = await supabase.from('profiles').upsert(upsertPayload, { onConflict: 'id' })
  if (profileRes.error) {
    return { ok: false, error: `Registrazione riuscita ma salvataggio profilo fallito: ${profileRes.error.message}` }
  }

  return { ok: true }
}
