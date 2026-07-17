import { type RefObject, useCallback, useLayoutEffect, useState } from 'react'

export type AnchoredDropdownRect = {
  top: number
  left: number
  width: number
}

/**
 * Posizione fixed per tendine portate su `document.body`, ancorate a un input.
 */
export function useAnchoredDropdownPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  gapPx = 6,
): AnchoredDropdownRect | null {
  const [rect, setRect] = useState<AnchoredDropdownRect | null>(null)

  const update = useCallback(() => {
    const el = anchorRef.current
    if (!el || !open) {
      setRect(null)
      return
    }
    const box = el.getBoundingClientRect()
    setRect({
      top: box.bottom + gapPx,
      left: box.left,
      width: box.width,
    })
  }, [anchorRef, gapPx, open])

  useLayoutEffect(() => {
    update()
  }, [update, open])

  useLayoutEffect(() => {
    if (!open) return
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, update])

  return rect
}
