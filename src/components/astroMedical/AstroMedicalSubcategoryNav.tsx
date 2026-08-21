import { Link } from 'react-router-dom'
import {
  ASTRO_MEDICAL_SUBCATEGORIES,
  countAstroMedicalProductsBySubcategory,
  lineaAstroMedicalMacroHref,
  type AstroMedicalSubcategoryLabel,
} from '../../lib/astroMedicalSubcategories'
import type { OfficeProduct } from '../../types/officeProduct'

type Props = {
  products: OfficeProduct[]
  selectedSubcategory: string | null
  /** Callback locale (catalogo). Ignorato se `linkToCatalog`. */
  onSelect?: (subcategory: string) => void
  /**
   * Chip come Link verso `/categoria/astro-medical?subcategory=…`
   * (scheda prodotto → catalogo filtrato).
   */
  linkToCatalog?: boolean
  className?: string
}

/** Nav macro-categorie Astro Medical (senza chip “Tutti i prodotti”). */
export function AstroMedicalSubcategoryNav({
  products,
  selectedSubcategory,
  onSelect,
  linkToCatalog = false,
  className = '',
}: Props) {
  const counts = countAstroMedicalProductsBySubcategory(products)
  const active = (selectedSubcategory ?? '').trim() || null
  const visible = ASTRO_MEDICAL_SUBCATEGORIES.filter(
    (label) => (counts[label as AstroMedicalSubcategoryLabel] ?? 0) > 0,
  )

  return (
    <nav
      className={[
        'rounded-2xl border border-medical-200/80 bg-gradient-to-br from-white via-medical-50/40 to-teal-50/30 p-4 shadow-sm ring-1 ring-medical-100/60 sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Macro-categorie Astro Medical (GIMA)"
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-medical-700">
            Categorie prodotto
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {linkToCatalog
              ? 'Apri il catalogo GIMA filtrato per macro-categoria.'
              : 'Scegli una macro-categoria per filtrare il catalogo GIMA.'}
          </p>
        </div>
        {active ? (
          <p className="text-sm font-semibold text-medical-900">
            Attiva: <span className="text-medical-700">{active}</span>
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2.5" role="list">
        {visible.map((label) => {
          const count = counts[label as AstroMedicalSubcategoryLabel] ?? 0
          const isActive = active === label
          return (
            <div key={label} role="listitem">
              {linkToCatalog ? (
                <SubcategoryLinkPill
                  label={label}
                  count={count}
                  active={isActive}
                  to={lineaAstroMedicalMacroHref(label)}
                />
              ) : (
                <SubcategoryPill
                  label={label}
                  count={count}
                  active={isActive}
                  onClick={() => onSelect?.(label)}
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

const pillClass = (active: boolean) =>
  [
    'inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
    active
      ? 'border-medical-700 bg-medical-700 text-white shadow-md shadow-medical-700/25'
      : 'border-medical-200 bg-white text-medical-950 hover:border-medical-500 hover:bg-medical-50 hover:shadow-sm',
  ].join(' ')

const countClass = (active: boolean) =>
  [
    'rounded-lg px-2 py-0.5 text-xs tabular-nums',
    active ? 'bg-white/20 text-white' : 'bg-medical-100 text-medical-800',
  ].join(' ')

function SubcategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={pillClass(active)}>
      <span>{label}</span>
      <span className={countClass(active)}>{count}</span>
    </button>
  )
}

function SubcategoryLinkPill({
  label,
  count,
  active,
  to,
}: {
  label: string
  count: number
  active: boolean
  to: string
}) {
  return (
    <Link to={to} aria-current={active ? 'page' : undefined} className={pillClass(active)}>
      <span>{label}</span>
      <span className={countClass(active)}>{count}</span>
    </Link>
  )
}
