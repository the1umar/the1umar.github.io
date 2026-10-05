import { useEffect, useRef } from 'react'

/**
 * Adds `.in` to the element once it scrolls into view, then stops observing.
 * Pair with the `.reveal` class in index.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}

/** Same thing, but for a container whose `.reveal` children should stagger in. */
export function useRevealGroup<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    if (!targets.length) return

    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        })
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )

    targets.forEach((t, i) => {
      t.style.setProperty('--d', `${Math.min(i, 8) * 70}ms`)
      io.observe(t)
    })

    return () => io.disconnect()
  }, [threshold])

  return ref
}
