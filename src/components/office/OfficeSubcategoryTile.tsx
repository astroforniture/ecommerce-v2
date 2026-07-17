import type { ReactNode } from 'react'

type Props = {
  title: string
  onClick: () => void
  /** Contenuto area immagine (tipicamente `aspect-square` + `img`). */
  media: ReactNode
}

/**
 * Tile sottocategoria dashboard (Archivio Ufficio / Cancelleria): bordo, ombra, titolo sotto il media.
 */
export function OfficeSubcategoryTile({ title, onClick, media }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {media}
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-900">{title}</p>
      </div>
    </button>
  )
}

/** Griglia responsive allineata tra categorie: ~4–5 tile per riga su desktop. */
export const OFFICE_SUBCATEGORY_TILE_GRID_CLASS =
  'grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]'
