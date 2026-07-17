/** Errori rete / DNS / timeout tipici quando Supabase non è raggiungibile. */
export function isLikelyCatalogConnectionError(error: unknown): boolean {
  if (!error) return false
  const msg = String(error instanceof Error ? error.message : error).toLowerCase()
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('network request failed') ||
    msg.includes('load failed') ||
    msg.includes('err_name_not_resolved') ||
    msg.includes('enotfound') ||
    msg.includes('timeout') ||
    msg.includes('aborted')
  )
}

export const CATALOG_CONNECTION_ERROR_MESSAGE =
  'Errore di connessione al catalogo. Verifica la rete o riprova tra qualche minuto.'
