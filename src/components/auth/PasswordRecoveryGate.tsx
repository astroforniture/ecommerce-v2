import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseAuthCallbackFromLocation } from '../../lib/authRecovery'
import { getSupabaseBrowserClient } from '../../lib/supabaseClient'

/**
 * Se l’utente apre un link di reset (PASSWORD_RECOVERY o parametri URL),
 * lo porta subito a /reset-password (form nuova password / messaggio errore).
 */
export function PasswordRecoveryGate() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const goReset = (search = '') => {
      if (location.pathname === '/reset-password') return
      navigate(
        {
          pathname: '/reset-password',
          search: search || undefined,
          hash: window.location.hash || undefined,
        },
        { replace: true },
      )
    }

    const info = parseAuthCallbackFromLocation(location.search, location.hash)
    if (info.isOtpExpired) {
      goReset('?error=otp_expired')
      return
    }
    if (info.errorCode && location.pathname !== '/reset-password') {
      goReset(`?error=${encodeURIComponent(info.errorCode)}`)
      return
    }
    if (info.isRecovery) {
      // Conserva hash/query così Supabase può completare exchange session.
      goReset(location.search)
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        goReset()
      }
    })

    return () => data.subscription.unsubscribe()
  }, [location.hash, location.pathname, location.search, navigate])

  return null
}
