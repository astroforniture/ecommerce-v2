import {
  ASTRO_MEDICAL_SUBCATEGORIES,
  countAstroMedicalProductsBySubcategory,
  type AstroMedicalSubcategoryLabel,
} from '../../lib/astroMedicalSubcategories'
import type { OfficeProduct } from '../../types/officeProduct'

type Props = {
  products: OfficeProduct[]
  selectedSubcategory: string | null
  onSelect: (subcategory: string | null) => void
  className?: string
}

export function AstroMedicalSubcategoryNav({
  products,
  selectedSubcategory,
  onSelect,
  className = '',
}: Props) {
  const counts = countAstroMedicalProductsBySubcategory(products)
  const active = (selectedSubcategory ?? '').trim() || null

  return (
    <nav
      className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}
      aria-label="Sotto-categorie Astro Medical"
    >
      <SubcategoryPill
        label="Tutti i prodotti"
        count={products.length}
        active={!active}
        onClick={() => onSelect(null)}
      />
      {ASTRO_MEDICAL_SUBCATEGORIES.map((label) => (
        <SubcategoryPill
          key={label}
          label={label}
          count={counts[label as AstroMedicalSubcategoryLabel]}
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
          ? 'border-medical-600 bg-medical-600 text-white shadow-sm shadow-medical-600/20'
          : 'border-medical-200 bg-white text-medical-900 hover:border-medical-400 hover:bg-medical-50',
      ].join(' ')}
    >
      <span>{label}</span>
      <span
        className={[
          'rounded-full px-2 py-0.5 text-xs tabular-nums',
          active ? 'bg-medical-500/40 text-white' : 'bg-medical-100 text-medical-800',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}
