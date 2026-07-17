import { Navigate } from 'react-router-dom'
import { cartucceTonerCategoryHref } from '../lib/officeCategories'

/** Reindirizza al catalogo macro-categoria Cartucce & Toner. */
export function CartucceTonerPage() {
  return <Navigate to={cartucceTonerCategoryHref()} replace />
}
