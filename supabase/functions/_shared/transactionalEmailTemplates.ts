/** Template HTML per Edge Function (Deno) — allineati a src/lib/emails/templates.ts */

export const EMAIL_BRAND_NAME = 'Astro Forniture'
export const EMAIL_SITE_ORIGIN = 'https://www.asforniture.it'
export const EMAIL_LOGO_URL = `${EMAIL_SITE_ORIGIN}/logo-astro-forniture.png`
export const EMAIL_SUPPORT = 'info@astro-forniture.it'
export const EMAIL_CATALOG_URL = `${EMAIL_SITE_ORIGIN}/office-products`
export const EMAIL_ACCOUNT_URL = `${EMAIL_SITE_ORIGIN}/account`
export const EMAIL_FROM_DEFAULT = 'Astro Forniture <info@astro-forniture.it>'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatEuroIt(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)
}

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:28px 28px 16px;text-align:center;background:linear-gradient(180deg,#fff7ed 0%,#ffffff 100%);">
              <img src="${EMAIL_LOGO_URL}" alt="${escapeHtml(EMAIL_BRAND_NAME)}" width="180" style="display:inline-block;max-width:180px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background:#0f172a;color:#cbd5e1;font-size:12px;line-height:1.5;text-align:center;">
              <strong style="color:#ffffff;">${escapeHtml(EMAIL_BRAND_NAME)}</strong><br />
              <a href="${EMAIL_SITE_ORIGIN}" style="color:#fdba74;text-decoration:none;">asforniture.it</a>
              · <a href="mailto:${EMAIL_SUPPORT}" style="color:#fdba74;text-decoration:none;">${EMAIL_SUPPORT}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function cta(href: string, label: string): string {
  return `<p style="margin:24px 0 0;text-align:center;">
  <a href="${href}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">
    ${escapeHtml(label)}
  </a>
</p>`
}

export function buildWelcomeEmail(input: {
  firstName?: string
}): { subject: string; html: string } {
  const name = input.firstName?.trim() || 'Cliente'
  const subject = `Benvenuto in ${EMAIL_BRAND_NAME}!`
  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;">Ciao ${escapeHtml(name)},</h1>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
      grazie per esserti registrato su <strong>${escapeHtml(EMAIL_BRAND_NAME)}</strong>.
      Il tuo account è pronto: puoi ordinare cancelleria, carta, shopper e soluzioni per l’ufficio in pochi click.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">Ecco alcuni link utili per iniziare:</p>
    <ul style="margin:12px 0 0;padding-left:18px;font-size:15px;line-height:1.7;color:#334155;">
      <li><a href="${EMAIL_CATALOG_URL}" style="color:#c2410c;">Catalogo prodotti</a></li>
      <li><a href="${EMAIL_ACCOUNT_URL}" style="color:#c2410c;">La tua area account</a></li>
      <li><a href="mailto:${EMAIL_SUPPORT}" style="color:#c2410c;">Assistenza clienti</a></li>
    </ul>
    ${cta(EMAIL_CATALOG_URL, 'Vai al catalogo')}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#64748b;">
      A presto,<br />Il team ${escapeHtml(EMAIL_BRAND_NAME)}
    </p>`,
  )
  return { subject, html }
}

export type OrderLine = {
  name: string
  quantity: number
  unitImponibile: number
  variant?: string
}

export function buildOrderConfirmationEmail(input: {
  customerName?: string
  orderRef: string
  items: OrderLine[]
  taxableTotal: number
  vatAmount: number
  shippingFee: number
  totalWithVat: number
  deliveryMethod?: string
  shippingAddress?: string
}): { subject: string; html: string } {
  const subject = `Conferma ordine ${input.orderRef} — ${EMAIL_BRAND_NAME}`
  const rows = input.items
    .map((item) => {
      const label = item.variant ? `${item.name} (${item.variant})` : item.name
      const line = item.unitImponibile * item.quantity
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(label)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;text-align:right;">${formatEuroIt(line)}</td>
      </tr>`
    })
    .join('')

  const addressBlock = input.shippingAddress
    ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#334155;"><strong>Spedizione:</strong><br />${escapeHtml(input.shippingAddress)}</p>`
    : ''

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;">Ordine confermato</h1>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
      Ciao ${escapeHtml(input.customerName?.trim() || 'Cliente')}, abbiamo ricevuto il tuo ordine
      <strong>${escapeHtml(input.orderRef)}</strong>. Ecco il riepilogo:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <th align="left" style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Prodotto</th>
        <th style="padding:8px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Qtà</th>
        <th align="right" style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Imponibile</th>
      </tr>
      ${rows}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><td style="padding:4px 0;font-size:14px;color:#64748b;">Imponibile</td><td style="padding:4px 0;font-size:14px;color:#0f172a;text-align:right;">${formatEuroIt(input.taxableTotal)}</td></tr>
      <tr><td style="padding:4px 0;font-size:14px;color:#64748b;">IVA</td><td style="padding:4px 0;font-size:14px;color:#0f172a;text-align:right;">${formatEuroIt(input.vatAmount)}</td></tr>
      <tr><td style="padding:4px 0;font-size:14px;color:#64748b;">Spedizione</td><td style="padding:4px 0;font-size:14px;color:#0f172a;text-align:right;">${formatEuroIt(input.shippingFee)}</td></tr>
      <tr><td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#0f172a;">Totale</td><td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#0f172a;text-align:right;">${formatEuroIt(input.totalWithVat)}</td></tr>
    </table>
    ${
      input.deliveryMethod
        ? `<p style="margin:16px 0 0;font-size:14px;color:#334155;"><strong>Modalità consegna:</strong> ${escapeHtml(input.deliveryMethod)}</p>`
        : ''
    }
    ${addressBlock}
    ${cta(EMAIL_ACCOUNT_URL, 'Vedi i tuoi ordini')}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#64748b;">
      Per assistenza scrivi a <a href="mailto:${EMAIL_SUPPORT}" style="color:#c2410c;">${EMAIL_SUPPORT}</a>.
    </p>`,
  )
  return { subject, html }
}

export function buildShippingEmail(input: {
  customerName?: string
  orderRef: string
  trackingNumber?: string
  shippingAddress?: string
}): { subject: string; html: string } {
  const subject = `Ordine ${input.orderRef} spedito — ${EMAIL_BRAND_NAME}`
  const tracking = input.trackingNumber?.trim()
  const trackingBlock = tracking
    ? `<p style="margin:16px 0 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;font-size:15px;color:#9a3412;">
        <strong>Tracking:</strong> ${escapeHtml(tracking)}
      </p>`
    : `<p style="margin:16px 0 0;font-size:14px;color:#64748b;">Il numero di tracking sarà disponibile a breve dal corriere.</p>`

  const addressBlock = input.shippingAddress
    ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#334155;"><strong>Indirizzo di consegna:</strong><br />${escapeHtml(input.shippingAddress)}</p>`
    : ''

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;">Il tuo ordine è in viaggio</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
      Ciao ${escapeHtml(input.customerName?.trim() || 'Cliente')}, l’ordine
      <strong>${escapeHtml(input.orderRef)}</strong> è stato contrassegnato come <strong>Spedito</strong>.
    </p>
    ${trackingBlock}
    ${addressBlock}
    ${cta(EMAIL_SITE_ORIGIN, 'Torna su Astro Forniture')}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#64748b;">
      Domande sulla spedizione? Contattaci a <a href="mailto:${EMAIL_SUPPORT}" style="color:#c2410c;">${EMAIL_SUPPORT}</a>.
    </p>`,
  )
  return { subject, html }
}
