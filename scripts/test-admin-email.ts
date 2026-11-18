/**
 * Test invio email admin "Nuovo Ordine Ricevuto" -> info@astro-forniture.it
 *
 *   npx tsx scripts/test-admin-email.ts
 *
 * Usa l'Edge Function send-transactional-email (Resend) in produzione.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

async function readEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (k && !process.env[k]) process.env[k] = v
    }
  } catch {
    // missing env file is fine
  }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/$/, '')
  const anonKey = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()

  if (!supabaseUrl || !anonKey) {
    throw new Error('Mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env')
  }

  const orderRef = `AF-TEST-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}`
  const payload = {
    type: 'admin_new_order',
    to: 'info@astro-forniture.it',
    orderRef,
    firstName: 'Mario',
    lastName: 'Rossi Test',
    customerName: 'Mario Rossi Test',
    customerEmail: 'mario.rossi.test@example.com',
    phone: '375 613 9937',
    billingAddress: 'Via Roma 1, 46100 Mantova MN',
    shippingAddress: 'Via Roma 1, 46100 Mantova MN',
    items: [
      {
        name: 'Carta termica ECG Test',
        quantity: 1,
        unitImponibile: 24,
        variant: 'Conf. test',
      },
    ],
    taxableTotal: 24,
    vatAmount: 5.28,
    shippingFee: 0,
    totalWithVat: 29.28,
    paymentMethod: 'Stripe / Carta (TEST)',
    orderNotes: 'Email di prova automatica - ignorare questo ordine.',
    deliveryMethod: 'Spedizione standard',
  }

  const endpoint = `${supabaseUrl}/functions/v1/send-transactional-email`
  console.log('[test-admin-email] Invio a', payload.to)
  console.log('[test-admin-email] orderRef:', orderRef)
  console.log('[test-admin-email] endpoint:', endpoint)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  let json: { ok?: boolean; id?: string; error?: string } = {}
  try {
    json = JSON.parse(text) as typeof json
  } catch {
    json = { error: text }
  }

  if (!res.ok || json.error || !json.ok) {
    console.error('[test-admin-email] FALLITO', res.status, json)
    process.exit(1)
  }

  console.log('[test-admin-email] OK - email inviata')
  console.log('[test-admin-email] Resend id:', json.id ?? '(n/d)')
  console.log('[test-admin-email] Controlla la casella info@astro-forniture.it')
}

main().catch((err) => {
  console.error('[test-admin-email] exception:', err)
  process.exit(1)
})