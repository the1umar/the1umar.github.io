import { useEffect, useRef, useState } from 'react'
import { PROFILE } from '../data'

const RADIUS = 132

/**
 * Edge-detected line art by default; the real photograph is masked to a soft
 * disc that chases the pointer. The photo is the only colour on the site.
 */
export function Portrait() {
  const frame = useRef<HTMLDivElement>(null)
  const real = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

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
      now.x += (target.x - now.x) * 0.17
      now.y += (target.y - now.y) * 0.17
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
      <span className="tick tl" aria-hidden="true" />
      <span className="tick tr" aria-hidden="true" />
      <span className="tick bl" aria-hidden="true" />
      <span className="tick br" aria-hidden="true" />

      <div className="portrait" ref={frame} data-cursor="hot">
        <img
          className="sketch"
          src={PROFILE.photo}
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
        <img
          ref={real}
          className="real"
          src={PROFILE.photo}
          alt={`${PROFILE.name}, photographed at Texas Tech`}
          draggable={false}
        />
      </div>

      <figcaption className="portrait-caption">
        <span className="mono">Fig. 01 — the subject</span>
        <span className="mono">{loaded ? 'hover to resolve' : 'loading…'}</span>
      </figcaption>
    </figure>
  )
}

/** The edge-detect filter the sketch layer points at. Rendered once, off-screen. */
export function SketchFilter() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <filter
        id="edge-sketch"
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

        {/* 8-neighbour laplacian — bright contours on black */}
        <feConvolveMatrix
          in="soft"
          order="3"
          preserveAlpha="true"
          divisor="1"
          kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1"
          result="edges"
        />

        {/* push the surviving contours up to white */}
        <feComponentTransfer in="edges">
          <feFuncR type="linear" slope="5" />
          <feFuncG type="linear" slope="5" />
          <feFuncB type="linear" slope="5" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
