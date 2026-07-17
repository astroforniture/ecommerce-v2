import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { loginAdmin } from '../lib/adminAuth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!loginAdmin(username, password)) {
      setError('Credenziali non valide.')
      return
    }
    const to = location.state?.from || '/admin'
    navigate(to, { replace: true })
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <LockKeyhole className="size-6 text-brand-700" />
            Login Admin
          </h1>
          <p className="mt-2 text-sm text-slate-600">Area gestionale protetta.</p>
          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Password amministratore</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            {error ? <p className="text-xs text-red-700">{error}</p> : null}
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
