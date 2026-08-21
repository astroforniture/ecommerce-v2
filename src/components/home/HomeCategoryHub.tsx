import { Link } from 'react-router-dom'
import { cartucceTonerCategoryHref, prodottiIgieneCategoryHref } from '../../lib/officeCategories'
import { agendeCategoryHref } from '../../lib/agendeCatalog'
import { sicurezzaCategoryHref } from '../../lib/sicurezzaCatalog'
import { lineaAstroMedicalCatalogPath } from '../../data/iHealthAstroMedicalProducts'

type HomeCategoryLink = {
  id: string
  label: string
  href: string
  isHighlight?: boolean
}

const HOME_CATEGORY_LINKS: HomeCategoryLink[] = [
  { id: 'archivio', label: 'Archivio', href: '/office-products?category=Archivio' },
  { id: 'cancelleria', label: 'Cancelleria', href: '/office-products?category=Cancelleria' },
  { id: 'agende', label: 'Agende', href: agendeCategoryHref() },
  { id: 'modulistica', label: 'Modulistica', href: '/office-products?category=Modulistica' },
  { id: 'carta', label: 'Carta', href: '/office-products?category=Carta' },
  { id: 'cartucce-toner', label: 'Cartucce & Toner', href: cartucceTonerCategoryHref() },
  { id: 'igiene', label: 'Prodotti per igiene', href: prodottiIgieneCategoryHref() },
  { id: 'sicurezza', label: 'Sicurezza', href: sicurezzaCategoryHref() },
  { id: 'macchine', label: 'Macchine ufficio', href: '/prodotti/macchine-per-ufficio' },
  {
    id: 'astro-medical',
    label: 'Astro Medical',
    href: lineaAstroMedicalCatalogPath(),
    isHighlight: true,
  },
]

export function HomeCategoryHub() {
  return (
    <section className="border-b border-slate-100 bg-white" aria-label="Categorie principali">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <nav className="flex min-w-max items-stretch justify-center gap-3 sm:gap-4 lg:grid lg:min-w-0 lg:grid-cols-10 lg:gap-2">
            {HOME_CATEGORY_LINKS.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={[
                  'group inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg border-b-2 border-transparent px-4 py-2.5 text-center text-base font-semibold tracking-wide transition',
                  item.isHighlight
                    ? 'text-brand-700 hover:border-brand-500 hover:text-brand-800'
                    : 'text-slate-800 hover:border-brand-500 hover:text-slate-900',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
