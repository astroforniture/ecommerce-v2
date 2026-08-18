import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Porta lo scroll in cima al cambio di pagina (pathname).
 * Non ascoltare `search`: filtri e ricerca (es. GIMA `?search=`) aggiornano la query
 * a ogni tasto e non devono far saltare la vista.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
