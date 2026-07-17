import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
import { lineImponible } from '../lib/quantityPricing'

export type CartLineVariant = {
  label: string
  sku?: string
  /** Nome completo riga carrello (anche multilinea). Se presente, sostituisce nome+variante. */
  cartDisplayName?: string
}

export type CartItem = {
  /** Chiave univoca riga carrello (prodotto + variante). */
  lineId: string
  id: string
  sku: string
  name: string
  /** URL immagine (snapshot) per righe carrello senza refetch catalogo. */
  imageUrl?: string
  /** Etichetta variante (es. colore), se presente. */
  variantLabel?: string
  price?: number
  quantity: number
  /** Snapshot listini al momento dell’aggiunta (per totali coerenti). */
  quantityPriceTiers?: QuantityPriceTier[]
}

/** Anteprima articolo appena aggiunto (popover header). */
export type LastAddedCartPreview = {
  name: string
  imageUrl: string
  /** Totale riga IVA inclusa (22%) al momento dell’aggiunta. */
  rowIvato: number
}

function makeLineId(productId: string, variantLabel?: string) {
  return `${productId}|||${variantLabel ?? ''}`
}

function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  addOfficeProduct: (
    product: OfficeProduct,
    quantity?: number,
    variant?: CartLineVariant,
  ) => void
  increaseQuantity: (lineId: string) => void
  decreaseQuantity: (lineId: string) => void
  removeItem: (lineId: string) => void
  clearCart: () => void
  lastAddedPreview: LastAddedCartPreview | null
  clearLastAddedPreview: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const CART_STORAGE_KEY = 'af:cart:v1'

function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Partial<CartItem>
      const lineId = String(row.lineId ?? '').trim()
      const id = String(row.id ?? '').trim()
      const sku = String(row.sku ?? '').trim()
      const name = String(row.name ?? '').trim()
      const quantity = Number(row.quantity)
      if (!lineId || !id || !sku || !name || !Number.isFinite(quantity) || quantity <= 0) {
        return null
      }
      const next: CartItem = {
        lineId,
        id,
        sku,
        name,
        quantity: Math.floor(quantity),
      }
      if (typeof row.variantLabel === 'string' && row.variantLabel.trim()) {
        next.variantLabel = row.variantLabel.trim()
      }
      if (typeof row.price === 'number' && Number.isFinite(row.price)) {
        next.price = row.price
      }
      if (Array.isArray(row.quantityPriceTiers)) {
        next.quantityPriceTiers = row.quantityPriceTiers
      }
      if (typeof row.imageUrl === 'string' && row.imageUrl.trim()) {
        next.imageUrl = row.imageUrl.trim()
      }
      return next
    })
    .filter((item): item is CartItem => item != null)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY)
      if (!raw) return []
      return sanitizeCartItems(JSON.parse(raw))
    } catch {
      return []
    }
  })
  const [lastAddedPreview, setLastAddedPreview] = useState<LastAddedCartPreview | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignora errori storage (quota, privacy mode).
    }
  }, [items])

  function addOfficeProduct(
    product: OfficeProduct,
    addQty = 1,
    variant?: CartLineVariant,
  ) {
    const variantLabel = variant?.label?.trim() || undefined
    const lineId = makeLineId(product.id, variantLabel)
    const sku =
      (variant?.sku?.trim() || product.producerCode || product.id).trim() || product.id
    const baseName = product.name.trim()
    const cartDisplayName = variant?.cartDisplayName?.trim() || ''
    const name = cartDisplayName
      ? cartDisplayName
      : variantLabel
        ? `${baseName} — ${variantLabel}`
        : baseName
    const delta = Math.max(1, Math.floor(addQty))

    let nextQtyForPreview = delta
    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === lineId)
      nextQtyForPreview = existing ? existing.quantity + delta : delta
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          sku,
          name,
          variantLabel,
          imageUrl: (product.imageUrl ?? '').trim() || undefined,
          price: product.price,
          quantity: delta,
          quantityPriceTiers: product.quantityPriceTiers,
        },
      ]
    })
    const rowImp = lineImponible(
      product.price,
      product.quantityPriceTiers,
      nextQtyForPreview,
    )
    const rowIvato = roundMoney2(rowImp * 1.22)
    setLastAddedPreview({
      name,
      imageUrl: (product.imageUrl ?? '').trim(),
      rowIvato,
    })
  }

  function clearLastAddedPreview() {
    setLastAddedPreview(null)
  }

  function increaseQuantity(lineId: string) {
    setItems((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  function decreaseQuantity(lineId: string) {
    setItems((prev) =>
      prev
        .map((item) => (item.lineId === lineId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId))
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    return {
      items,
      totalItems,
      addOfficeProduct,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      lastAddedPreview,
      clearLastAddedPreview,
    }
  }, [items, lastAddedPreview])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve essere usato dentro CartProvider')
  }
  return context
}
