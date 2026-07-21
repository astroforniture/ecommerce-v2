import { Link } from 'react-router-dom'
import { openCookiePreferencesEvent } from '../../lib/cookieConsent'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Astro Forniture s.r.l.</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link className="hover:text-brand-800 hover:underline" to="/termini-condizioni-vendita">
            Termini e Condizioni
          </Link>
          <Link className="hover:text-brand-800 hover:underline" to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="hover:text-brand-800 hover:underline" to="/cookie-policy">
            Cookie Policy
          </Link>
          <button
            type="button"
            onClick={() => openCookiePreferencesEvent()}
            className="hover:text-brand-800 hover:underline"
          >
            Preferenze cookie
          </button>
        </nav>
      </div>
    </footer>
  )
}
