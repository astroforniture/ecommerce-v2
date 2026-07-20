import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { canAccessAdminRoute } from '../../../middleware'
import { isAdminAuthenticated } from '../../lib/adminAuth'

export function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [allowed, setAllowed] = useState<boolean | null>(() =>
    isAdminAuthenticated() ? true : null,
  )

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAllowed(true)
      return
    }

    let cancelled = false
    ;(async () => {
      const ok = await canAccessAdminRoute()
      if (!cancelled) setAllowed(ok)
    })()
    return () => {
      cancelled = true
    }
  }, [location.pathname])

  if (allowed == null) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 animate-pulse rounded-lg bg-slate-100" aria-hidden />
      </main>
    )
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
