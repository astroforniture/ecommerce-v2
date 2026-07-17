import { CartSlideOver } from './CartSlideOver'
import { CartAddToast } from './CartAddToast'

/** Drawer carrello + toast fallback (montare una volta nel layout storefront). */
export function CartQuickView() {
  return (
    <>
      <CartSlideOver />
      <CartAddToast />
    </>
  )
}
