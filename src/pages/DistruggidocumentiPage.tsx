import { Navigate } from 'react-router-dom'
import { macchineUfficioDistruggiDocumentiListingPath } from '../data/distruggidocumentiProducts'

/** URL legacy: vetrina sottocategoria Distruggi Documenti. */
export function DistruggidocumentiPage() {
  return <Navigate to={macchineUfficioDistruggiDocumentiListingPath()} replace />
}
