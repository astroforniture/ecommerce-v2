import { Resend } from 'resend'
import { EMAIL_FROM_DEFAULT } from './brand'

function readResendApiKey(explicit?: string): string | undefined {
  if (explicit?.trim()) return explicit.trim()
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return g.process?.env?.RESEND_API_KEY?.trim() || undefined
}

/**
 * Client Resend per ambienti Node (script, test locali).
 * La chiave `RESEND_API_KEY` non deve mai finire nel bundle Vite (`VITE_*`).
 */
export function createResendClient(apiKey = readResendApiKey()): Resend {
  const key = apiKey?.trim()
  if (!key) {
    throw new Error('RESEND_API_KEY mancante. Impostala in .env / secret Supabase.')
  }
  return new Resend(key)
}

export type SendResendEmailInput = {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendResendEmail(
  input: SendResendEmailInput,
  apiKey?: string,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  try {
    const resend = createResendClient(apiKey)
    const result = await resend.emails.send({
      from: input.from?.trim() || EMAIL_FROM_DEFAULT,
      to: input.to.trim(),
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    })
    if (result.error) {
      return { ok: false, error: result.error.message }
    }
    return { ok: true, id: result.data?.id }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Invio email Resend fallito',
    }
  }
}
