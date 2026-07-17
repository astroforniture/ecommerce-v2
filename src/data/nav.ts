import { cartucceTonerCategoryHref } from '../lib/officeCategories'

export type NavCategory = {
  id: string
  label: string
  href: string
  description?: string
}

/** Voci menu categorie principali */
export const mainCategories: NavCategory[] = [
  {
    id: 'prodotti',
    label: 'Prodotti',
    href: '/office-products',
    description: 'Catalogo completo',
  },
  {
    id: 'cancelleria',
    label: 'Cancelleria',
    href: '/office-products?category=Cancelleria',
    description: 'Penne, pennarelli e accessori',
  },
  {
    id: 'carta',
    label: 'Carta',
    href: '/office-products?category=Carta',
    description: 'Catalogo office',
  },
  {
    id: 'cartucce-toner',
    label: 'Cartucce & Toner',
    href: cartucceTonerCategoryHref(),
    description: 'Cartucce inkjet e toner laser',
  },
  {
    id: 'archivio',
    label: 'Archivio',
    href: '/office-products?category=Archivio',
    description: 'Raccoglitori e archiviazione',
  },
  { id: 'stampanti', label: 'Stampanti', href: '/categoria/stampanti' },
]
