import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAllowedCredentials, isAuthenticated, setAuthenticated } from '../lib/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!isAllowedCredentials(email, password)) {
      setError('Accesso negato: credenziali non autorizzate')
      setIsSubmitting(false)
      return
    }

    setAuthenticated(true)
    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <h1>Astro Admin</h1>
        <p>Accedi al gestionale con credenziali autorizzate.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

      </section>
    </main>
  )
}
