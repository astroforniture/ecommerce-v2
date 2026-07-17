import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { clearAdminAuthenticated, setAdminAuthenticated } from '../lib/adminAuth'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import { isSupabaseAdminUser, signInWithEmailPassword } from '../lib/userAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const supabase = getSupabaseBrowserClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null
      if (!user) return
      if (isSupabaseAdminUser(user)) {
        setAdminAuthenticated()
        navigate('/admin', { replace: true })
      } else {
        clearAdminAuthenticated()
        navigate('/', { replace: true })
      }
    })
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(false)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
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

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto flex max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <Card className="w-full border-brand-100">
          <CardHeader>
            <CardTitle className="text-slate-900">Accedi</CardTitle>
            <CardDescription>
              Area utenti Astro Forniture. Stile brand blu/arancione del sito.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@azienda.it"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  required
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
                <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700">
                  Registrati
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
