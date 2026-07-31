import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import {
  OTP_EXPIRED_USER_MESSAGE,
  parseAuthCallbackFromLocation,
} from '../lib/authRecovery'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import { updatePasswordAfterRecovery } from '../lib/userAuth'

function urlLooksLikeRecovery(): boolean {
  return parseAuthCallbackFromLocation().isRecovery
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const supabase = getSupabaseBrowserClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [expired, setExpired] = useState(false)
  const [modalOpen, setModalOpen] = useState(true)

  useEffect(() => {
    const info = parseAuthCallbackFromLocation()
    if (info.isOtpExpired || info.errorCode === 'otp_expired') {
      setExpired(true)
      setChecking(false)
      setReady(false)
      setModalOpen(true)
      return
    }
    if (info.errorCode) {
      setError(
        info.errorMessage ||
          'Il link di reset non è valido. Richiedine uno nuovo dalla pagina di login.',
      )
      setChecking(false)
      setReady(false)
      setModalOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!supabase || expired) {
      if (!supabase) setChecking(false)
      return
    }

    let cancelled = false
    let settled = false

    const finish = (ok: boolean) => {
      if (cancelled || settled) return
      settled = true
      setReady(ok)
      setChecking(false)
      if (ok) setModalOpen(true)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'PASSWORD_RECOVERY') {
        finish(true)
        return
      }
      if (
        session?.user &&
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
        urlLooksLikeRecovery()
      ) {
        finish(true)
      }
    })

    const timer = window.setTimeout(() => {
      void (async () => {
        if (cancelled || settled) return
        const info = parseAuthCallbackFromLocation()
        if (info.isOtpExpired) {
          setExpired(true)
          setChecking(false)
          setReady(false)
          setModalOpen(true)
          return
        }
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          finish(true)
          return
        }
        finish(false)
      })()
    }, 900)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      authListener.subscription.unsubscribe()
    }
  }, [expired, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirm) {
      setError('Le password non coincidono.')
      return
    }

    setLoading(true)
    try {
      const res = await updatePasswordAfterRecovery(password)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setSuccess('Password aggiornata. Ora puoi accedere con la nuova password.')
      window.setTimeout(() => navigate('/login', { replace: true }), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aggiornamento password non riuscito.')
    } finally {
      setLoading(false)
    }
  }

  const formBody = (
    <>
      {checking ? (
        <p className="text-sm text-slate-600">Verifica del link in corso…</p>
      ) : expired ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm font-medium text-amber-950">
            {OTP_EXPIRED_USER_MESSAGE}
          </p>
          <Link
            to="/login"
            className="inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Richiedi un nuovo link dal login
          </Link>
        </div>
      ) : !ready ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-red-700">
            {error || 'Link non valido o scaduto. Richiedi un nuovo reset dalla pagina di login.'}
          </p>
          <Link
            to="/login"
            className="inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Torna al login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-password" className="text-sm font-medium text-slate-700">
              Nuova password
            </label>
            <Input
              id="reset-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Almeno 8 caratteri"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="reset-password-confirm" className="text-sm font-medium text-slate-700">
              Conferma password
            </label>
            <Input
              id="reset-password-confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ripeti la password"
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 text-white hover:bg-brand-800"
          >
            {loading ? 'Salvataggio…' : 'Salva nuova password'}
          </Button>
        </form>
      )}
    </>
  )

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto flex max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-full text-center text-sm text-slate-600">
          {expired
            ? 'Il link di reset non è più valido.'
            : 'Stiamo aprendo il form per impostare la nuova password…'}
        </p>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md border-brand-100 sm:rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              {expired ? 'Link scaduto' : 'Nuova password'}
            </DialogTitle>
            <DialogDescription>
              {expired
                ? 'Per motivi di sicurezza i link di reset scadono dopo un breve periodo.'
                : 'Scegli una nuova password per il tuo account Astro Forniture.'}
            </DialogDescription>
          </DialogHeader>
          {formBody}
        </DialogContent>
      </Dialog>
    </main>
  )
}
