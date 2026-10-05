import { useEffect } from 'react'
import Lenis from 'lenis'

let lenis: Lenis | null = null

/** Scroll to an element by id, through Lenis when it is running. */
export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) lenis.scrollTo(target, { offset: -10 })
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const instance = new Lenis({
      duration: 1.1,
      // gentle exponential ease-out — carries momentum without feeling slippery
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenis = instance

    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      lenis = null
    }
  }, [])
}

/** Freeze smooth scrolling (and the page) while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    document.body.classList.add('is-locked')
    lenis?.stop()
    return () => {
      document.body.classList.remove('is-locked')
      lenis?.start()
    }
  }, [locked])
}
