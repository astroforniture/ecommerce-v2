import {
  IGIENE_SUBCATEGORIES,
  matchesIgieneSubcategoryFilter,
  type IgieneSubcategory,
} from '../../lib/prodottiIgieneSubcategories'
import type { OfficeProduct } from '../../types/officeProduct'

type Props = {
  products: OfficeProduct[]
  selectedSubcategory: string | null
  onSelect: (subcategory: string | null) => void
  className?: string
}

export function IgieneSubcategoryNav({
  products,
  selectedSubcategory,
  onSelect,
  className = '',
}: Props) {
  const active = (selectedSubcategory ?? '').trim() || null
  const counts = Object.fromEntries(
    IGIENE_SUBCATEGORIES.map((label) => [
      label,
      products.filter((p) => matchesIgieneSubcategoryFilter(p, label)).length,
    ]),
  ) as Record<IgieneSubcategory, number>

  return (
    <nav
      className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}
      aria-label="Sotto-categorie Prodotti per igiene"
    >
      <SubcategoryPill
        label="Tutti i prodotti"
        count={products.length}
        active={!active}
        onClick={() => onSelect(null)}
      />
      {IGIENE_SUBCATEGORIES.map((label) => (
        <SubcategoryPill
          key={label}
          label={label}
          count={counts[label]}
          active={active === label}
          onClick={() => onSelect(label)}
        />
      ))}
    </nav>
  )
}

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
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-brand-700 bg-brand-700 text-white shadow-sm shadow-brand-700/20'
          : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50',
      ].join(' ')}
    >
      <span>{label}</span>
      <span
        className={[
          'rounded-full px-2 py-0.5 text-xs tabular-nums',
          active ? 'bg-brand-600/50 text-white' : 'bg-slate-100 text-slate-700',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}
