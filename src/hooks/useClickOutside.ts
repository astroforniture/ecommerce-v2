import { type RefObject, useEffect } from 'react'

/**
 * Chiama `handler` al click/touch fuori da `ref` (e dai nodi opzionali `extraRefs`).
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled = true,
  extraRefs: RefObject<HTMLElement | null>[] = [],
) {
  useEffect(() => {
    if (!enabled) return

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target
      if (!(target instanceof Node)) return
      const roots = [ref.current, ...extraRefs.map((r) => r.current)].filter(Boolean)
      if (roots.some((el) => el?.contains(target))) return
      handler()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [ref, handler, enabled, extraRefs])
}
