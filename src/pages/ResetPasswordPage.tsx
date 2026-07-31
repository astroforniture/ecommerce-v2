import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import { updatePasswordAfterRecovery } from '../lib/userAuth'

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

  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }

    let cancelled = false

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setReady(Boolean(data.session?.user))
      setChecking(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session?.user) {
        setReady(true)
        setChecking(false)
      }
    })

    return () => {
      cancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

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

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto flex max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <Card className="w-full border-brand-100">
          <CardHeader>
            <CardTitle className="text-slate-900">Nuova password</CardTitle>
            <CardDescription>
              Scegli una nuova password per il tuo account Astro Forniture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checking ? (
              <p className="text-sm text-slate-600">Verifica del link in corso…</p>
            ) : !ready ? (
              <div className="space-y-4">
                <p className="text-sm text-red-700">
                  Link non valido o scaduto. Richiedi un nuovo reset dalla pagina di login.
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
                  <label
                    htmlFor="reset-password-confirm"
                    className="text-sm font-medium text-slate-700"
                  >
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
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
