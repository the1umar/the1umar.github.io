import { useEffect, useRef } from 'react'
import { GoofyFace } from './Icons'
import { useScrollLock } from '../hooks/useSmoothScroll'

type Props = {
  open: boolean
  onClose: () => void
}

export function BlogPanel({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useScrollLock(open)

  // escape to close, and keep tab focus inside the panel while it is open
  useEffect(() => {
    if (!open) return

    closeBtn.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`blog-scrim${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panel}
        className={`blog-panel${open ? ' open' : ''}`}
        aria-label="Writing"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="blog-head">
          <h2>
            <span className="hash">#</span> writing
          </h2>
          <button
            ref={closeBtn}
            className="blog-close"
            onClick={onClose}
            aria-label="Close writing"
          />
        </div>

        <div className="blog-empty">
          <GoofyFace />
          <p>coming soon</p>
        </div>
      </aside>
    </>
  )
}
