import { useEffect, useRef } from 'react'

/**
 * Two-part cursor: a dot pinned to the pointer and a ring that trails it.
 * Blend mode `difference` keeps it legible over both the page and the photo.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const trail = { ...pos }
    let frame = 0
    let seen = false

    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY

      if (!seen) {
        seen = true
        trail.x = pos.x
        trail.y = pos.y
      }

      // enlarge the ring over anything interactive
      const hot = (e.target as Element | null)?.closest(
        'a, button, [data-cursor="hot"]',
      )
      ring.current?.classList.toggle('hot', Boolean(hot))
    }

    const hide = () => {
      dot.current?.classList.add('hide')
      ring.current?.classList.add('hide')
    }
    const show = () => {
      dot.current?.classList.remove('hide')
      ring.current?.classList.remove('hide')
    }

    const tick = () => {
      trail.x += (pos.x - trail.x) * 0.16
      trail.y += (pos.y - trail.y) * 0.16

      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    document.addEventListener('pointerenter', show)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('pointerenter', show)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring hide" aria-hidden="true" />
      <div ref={dot} className="cursor-dot hide" aria-hidden="true" />
    </>
  )
}
