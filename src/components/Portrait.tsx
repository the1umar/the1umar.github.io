import { useEffect, useRef } from 'react'
import { PROFILE } from '../data'

const RADIUS = 136

/**
 * Pen-and-ink line drawing by default; the real photograph is masked to a soft
 * disc that chases the pointer. The photo is the only full-colour thing here.
 */
export function Portrait() {
  const frame = useRef<HTMLDivElement>(null)
  const real = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const box = frame.current
    const layer = real.current
    if (!box || !layer) return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    // target vs. rendered position, lerped so the disc lags a little
    const target = { x: 0.5, y: 0.5, r: 0 }
    const now = { x: 0.5, y: 0.5, r: 0 }
    let anim = 0
    let live = false

    const move = (e: PointerEvent) => {
      const rect = box.getBoundingClientRect()
      target.x = (e.clientX - rect.left) / rect.width
      target.y = (e.clientY - rect.top) / rect.height
      if (!live) {
        live = true
        now.x = target.x
        now.y = target.y
      }
    }

    const enter = () => {
      target.r = RADIUS
    }
    const leave = () => {
      target.r = 0
    }

    const tick = () => {
      now.x += (target.x - now.x) * 0.18
      now.y += (target.y - now.y) * 0.18
      now.r += (target.r - now.r) * 0.1

      layer.style.setProperty('--mx', `${(now.x * 100).toFixed(2)}%`)
      layer.style.setProperty('--my', `${(now.y * 100).toFixed(2)}%`)
      layer.style.setProperty('--mr', `${now.r.toFixed(1)}px`)

      anim = requestAnimationFrame(tick)
    }

    anim = requestAnimationFrame(tick)
    box.addEventListener('pointermove', move, { passive: true })
    box.addEventListener('pointerenter', enter)
    box.addEventListener('pointerleave', leave)

    return () => {
      cancelAnimationFrame(anim)
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerenter', enter)
      box.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <figure className="portrait-frame">
      <div className="portrait" ref={frame}>
        <img className="sketch" src={PROFILE.photo} alt="" aria-hidden="true" draggable={false} />
        <img
          ref={real}
          className="real"
          src={PROFILE.photo}
          alt={`${PROFILE.name}, photographed at Texas Tech`}
          draggable={false}
        />
      </div>

      <figcaption className="portrait-caption">
        <span className="label">Korede Afolami</span>
        <span className="label portrait-hint">
          <span className="ring" />
          Hover to develop
        </span>
      </figcaption>
    </figure>
  )
}

/** The filter the sketch layer points at. Rendered once, off-screen. */
export function InkFilter() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <filter
        id="ink-sketch"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        {/* drop colour */}
        <feColorMatrix type="saturate" values="0" result="gray" />

        {/* stretch levels first — a dark subject on a dark ground gives the
            edge pass almost nothing to work with otherwise */}
        <feComponentTransfer in="gray" result="lift">
          <feFuncR type="linear" slope="2.4" intercept="-0.42" />
          <feFuncG type="linear" slope="2.4" intercept="-0.42" />
          <feFuncB type="linear" slope="2.4" intercept="-0.42" />
        </feComponentTransfer>

        {/* soften JPEG grain so the edge pass finds contours, not noise */}
        <feGaussianBlur in="lift" stdDeviation="0.8" result="soft" />

        {/* 8-neighbour laplacian — contours come out bright on black */}
        <feConvolveMatrix
          in="soft"
          order="3"
          preserveAlpha="true"
          divisor="1"
          kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1"
          result="edges"
        />

        <feComponentTransfer in="edges" result="amped">
          <feFuncR type="linear" slope="5" />
          <feFuncG type="linear" slope="5" />
          <feFuncB type="linear" slope="5" />
        </feComponentTransfer>

        {/* flip it: dark ink on white paper */}
        <feComponentTransfer in="amped">
          <feFuncR type="table" tableValues="1 0" />
          <feFuncG type="table" tableValues="1 0" />
          <feFuncB type="table" tableValues="1 0" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
