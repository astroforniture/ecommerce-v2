import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { clearAdminAuthenticated, setAdminAuthenticated } from '../lib/adminAuth'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import {
  isSupabaseAdminUser,
  requestPasswordReset,
  signInWithEmailPassword,
} from '../lib/userAuth'

type LoginView = 'login' | 'forgot'

export function LoginPage() {
  const navigate = useNavigate()
  const supabase = getSupabaseBrowserClient()
  const [view, setView] = useState<LoginView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null
      if (!user) return
      // Durante recovery l'utente arriva su /reset-password, non qui.
      if (isSupabaseAdminUser(user)) {
        setAdminAuthenticated()
        navigate('/admin', { replace: true })
      } else {
        clearAdminAuthenticated()
        navigate('/', { replace: true })
      }
    })
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(false)
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password', { replace: true })
        return
      }
      const user = session?.user ?? null
      if (!user) return
      if (isSupabaseAdminUser(user)) {
        setAdminAuthenticated()
        navigate('/admin', { replace: true })
      } else {
        clearAdminAuthenticated()
        navigate('/', { replace: true })
      }
    })
    return () => authListener.subscription.unsubscribe()
  }, [navigate, supabase])

  function switchView(next: LoginView) {
    setView(next)
    setError('')
    setSuccess('')
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await signInWithEmailPassword(email, password)
      if (!res.ok) {
        setError(res.error)
        return
      }
      if (isSupabaseAdminUser(res.user)) {
        setAdminAuthenticated()
        navigate('/admin', { replace: true })
      } else {
        clearAdminAuthenticated()
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Accesso non riuscito.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await requestPasswordReset(email)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setSuccess(
        'Se l’indirizzo è registrato, riceverai a breve un’email con il link per reimpostare la password.',
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invio richiesta non riuscito.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto flex max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <Card className="w-full border-brand-100">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {view === 'login' ? 'Accedi' : 'Password dimenticata'}
            </CardTitle>
            <CardDescription>
              {view === 'login'
                ? 'Area utenti Astro Forniture. Stile brand blu/arancione del sito.'
                : 'Inserisci l’email del tuo account: ti invieremo un link per scegliere una nuova password.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {view === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => switchView('forgot')}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Password dimenticata?
                    </button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>

                {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-700 text-white hover:bg-brand-800"
                >
                  {loading ? 'Accesso in corso...' : 'Login'}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  Non hai un account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Registrati
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email di registrazione"
                  />
                </div>

                {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
                {success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-700 text-white hover:bg-brand-800"
                >
                  {loading ? 'Invio in corso...' : 'Invia link di reset'}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Torna al login
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
