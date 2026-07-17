import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NavCategory } from '../../data/nav'
import { prefetchOfficeCatalogForHref } from '../../hooks/useOfficeCatalog'

type CategoryDropdownProps = {
  categories: NavCategory[]
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <LayoutGrid className="size-4 text-brand-600" aria-hidden />
        Categorie
        <ChevronDown
          className={`size-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className="absolute left-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-xl"
          role="menu"
        >
          <ul className="py-1">
            {categories.map((c) => (
              <li key={c.id} role="none">
                <Link
                  role="menuitem"
                  to={c.href}
                  className="block px-4 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                  onMouseEnter={() => void prefetchOfficeCatalogForHref(queryClient, c.href)}
                  onClick={() => setOpen(false)}
                >
                  <span className="font-medium">{c.label}</span>
                  {c.description ? (
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {c.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
