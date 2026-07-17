import { Globe, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const whoWeAreLinks = [
  { label: 'Chi siamo', to: '/home' },
  { label: 'La nostra storia', to: '/home' },
  { label: 'Mission', to: '/home' },
  { label: 'I nostri partner', to: '/home' },
]

const customerServiceLinks = [
  { label: 'FAQ', to: '/home' },
  { label: 'Contattaci', to: '/contatti-toner' },
  { label: 'Richiesta catalogo', to: '/home' },
  { label: 'Termini e condizioni', to: '/termini-condizioni-vendita' },
  { label: 'Privacy', to: '/privacy-policy' },
]

const guaranteesLinks = [
  { label: 'Modalita di pagamento', to: '/termini-condizioni-vendita' },
  { label: 'Trasporto e consegna', to: '/termini-condizioni-vendita' },
  { label: 'Reso facile', to: '/termini-condizioni-vendita' },
  { label: 'Soluzioni per la stampa', to: '/servizi/rilegature' },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: Globe, fallback: 'FB' },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Share2, fallback: 'IG' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Share2, fallback: 'IN' },
  { label: 'YouTube', href: 'https://www.youtube.com', icon: Share2, fallback: 'YT' },
]

export function Footer() {
  return (
    <footer className="mt-12 bg-[#171b22] text-slate-200">
      <div className="border-b border-slate-700/60 bg-[#1b2028]">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-slate-300 sm:px-6 lg:px-8">
          * Le immagini degli omaggi sono illustrative e potrebbero variare in base alla disponibilita.
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-8">
        <FooterColumn title="CHI SIAMO" links={whoWeAreLinks} />
        <FooterColumn title="SERVIZIO CLIENTI" links={customerServiceLinks} />
        <FooterColumn title="GARANZIE E SERVIZI" links={guaranteesLinks} />

        <div className="lg:text-right">
          <h3 className="text-sm font-bold tracking-wide text-white">SEGUICI SU</h3>
          <ul className="mt-4 space-y-2.5">
            {socialLinks.map(({ label, href, icon: Icon, fallback }) => (
              <li key={label} className="lg:flex lg:justify-end">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                >
                  {Icon ? <Icon className="size-4" aria-hidden /> : <span className="text-xs">{fallback ?? 'SN'}</span>}
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="text-sm font-bold tracking-wide text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-slate-300 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
