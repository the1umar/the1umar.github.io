import { useEffect, useRef } from 'react'
import { POSTS } from '../data'
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
        aria-label="Blog posts"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="blog-panel-head">
          <div>
            <span className="mono">Index — 006 entries</span>
            <h2>Blog Posts</h2>
          </div>
          <button
            ref={closeBtn}
            className="blog-close"
            onClick={onClose}
            aria-label="Close blog posts"
          />
        </div>

        <p className="blog-note">
          Everything here is <em>coming soon</em>, which is a phrase doing an
          enormous amount of work. The thinking is done. The outlines are in a
          file called <code>drafts/</code> that I open on Sundays and close on
          Sundays. What remains is the writing, and the writing is the part
          where you find out whether you meant any of it.
        </p>

        <div className="blog-list">
          {POSTS.map((post, i) => (
            <article
              className="blog-post"
              key={post.n}
              style={{ ['--d' as string]: `${260 + i * 75}ms` }}
            >
              <div className="blog-post-top">
                <span className="mono">{post.n}</span>
                <span className="mono">{post.meta}</span>
              </div>
              <h3>{post.title}</h3>
              <p className="blog-kicker">{post.kicker}</p>
              <span className="blog-status" data-s={post.status}>
                <span className="tick" />
                {post.status}
              </span>
            </article>
          ))}
        </div>

        <div className="blog-foot">
          <span className="mono">
            No RSS yet. No newsletter. No <em>subscribe</em> modal. Just this.
          </span>
        </div>
      </aside>
    </>
  )
}
