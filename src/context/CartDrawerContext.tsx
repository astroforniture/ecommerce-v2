import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from './CartContext'

type CartDrawerContextValue = {
  isOpen: boolean
  openCartDrawer: () => void
  closeCartDrawer: () => void
}

const CartDrawerContext = createContext<CartDrawerContextValue | undefined>(undefined)

const PREVIEW_CLEAR_MS = 6000

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const { lastAddedPreview, clearLastAddedPreview } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const openCartDrawer = useCallback(() => setIsOpen(true), [])
  const closeCartDrawer = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!lastAddedPreview) return
    setIsOpen(true)
    const id = window.setTimeout(() => clearLastAddedPreview(), PREVIEW_CLEAR_MS)
    return () => window.clearTimeout(id)
  }, [lastAddedPreview, clearLastAddedPreview])

  const value = useMemo(
    () => ({ isOpen, openCartDrawer, closeCartDrawer }),
    [isOpen, openCartDrawer, closeCartDrawer],
  )

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) {
    throw new Error('useCartDrawer deve essere usato dentro CartDrawerProvider')
  }
  return ctx
}
