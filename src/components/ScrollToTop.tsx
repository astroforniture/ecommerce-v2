import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Porta lo scroll in cima a ogni cambio di route (footer Servizio Clienti, menu, ecc.).
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // Ancore interne (#...): lascia lo scroll gestito dal browser.
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, search, hash])

  return null
}
