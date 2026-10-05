import { useCallback, useEffect, useState } from 'react'
import {
  EDUCATION,
  EXPERIENCE,
  LEADERSHIP,
  PROFILE,
  PROJECTS,
  SKILLS,
} from './data'
import { Cursor } from './components/Cursor'
import { Portrait, SketchFilter } from './components/Portrait'
import { BlogPanel } from './components/BlogPanel'
import { useRevealGroup } from './hooks/useReveal'
import { scrollToId, useSmoothScroll } from './hooks/useSmoothScroll'

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const MARQUEE = [
  'Go',
  'Kubernetes',
  'Distributed Systems',
  'Terraform',
  'Python',
  'Istio',
  'PostgreSQL',
  'AWS',
  'TypeScript',
  'ArgoCD',
  'System Design',
  'Compilers',
]

function Arrow() {
  return (
    <svg
      className="arw"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 9.5 9.5 1.5M9.5 1.5H3.2M9.5 1.5v6.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function Nav({ onBlog }: { onBlog: () => void }) {
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className={`nav${stuck ? ' stuck' : ''}`}>
      <a
        className="nav-mark"
        href="#top"
        onClick={(e) => {
          e.preventDefault()
          scrollToId('top')
        }}
      >
        <span className="pulse" />
        KA
      </a>

      <div className="nav-links">
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-link${active === id ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              scrollToId(id)
            }}
          >
            {label}
          </a>
        ))}
        <button className="nav-link blog-trigger" onClick={onBlog}>
          Blog Posts
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <header className="hero shell" id="top">
      <div className="hero-grid">
        <div>
          <div className="hero-eyebrow">
            <span className="bar" />
            <span className="mono">{PROFILE.role} — {PROFILE.location}</span>
          </div>

          <h1 className="hero-name">
            <span className="line">
              <span style={{ ['--d' as string]: '120ms' }}>Korede</span>
            </span>
            <span className="line">
              <span style={{ ['--d' as string]: '230ms' }} className="dim">
                Afolami
              </span>
            </span>
          </h1>

          <p className="hero-blurb">{PROFILE.blurb}</p>

          <div className="hero-meta">
            <span className="mono">B.S. CS + Math — Texas Tech</span>
            <span className="mono">GPA {EDUCATION.gpa}</span>
            <span className="mono">Grad {EDUCATION.grad}</span>
          </div>

          <div className="hero-actions">
            <a
              className="btn solid"
              href={PROFILE.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé <Arrow />
            </a>
            <a className="btn" href={`mailto:${PROFILE.email}`}>
              Get in touch <Arrow />
            </a>
          </div>
        </div>

        <Portrait />
      </div>
    </header>
  )
}

function Marquee() {
  const run = (
    <div className="marquee-run" aria-hidden="true">
      {MARQUEE.map((item) => (
        <span key={item}>
          {item}
          <i className="dot" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee">
      <div className="marquee-track">
        {run}
        {run}
      </div>
    </div>
  )
}

function Work() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section" id="work" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="mono">01</span>
          <h2>Where I&rsquo;ve worked</h2>
          <span className="rule" />
        </div>

        {EXPERIENCE.map((job) => (
          <article className="xp-item reveal" key={job.org + job.period}>
            <div className="xp-year">{job.year}</div>
            <div>
              <div className="xp-top">
                <h3 className="xp-org">{job.org}</h3>
                {job.current ? (
                  <span className="badge-live">
                    <span className="dot" /> current
                  </span>
                ) : (
                  <span className="mono">{job.period}</span>
                )}
              </div>
              <p className="xp-title">
                {job.title} — {job.place}
                {job.current ? ` — ${job.period}` : ''}
              </p>
              <ul className="xp-points">
                {job.points.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <div className="chips">
                {job.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  const ref = useRevealGroup<HTMLElement>()
  const [open, setOpen] = useState<string | null>(PROJECTS[0].index)

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="mono">02</span>
          <h2>Things I&rsquo;ve built</h2>
          <span className="rule" />
        </div>

        <div className="proj reveal">
          {PROJECTS.map((p) => {
            const isOpen = open === p.index
            return (
              <div key={p.index}>
                <button
                  className="proj-row"
                  aria-expanded={isOpen}
                  aria-controls={`proj-${p.index}`}
                  onClick={() => setOpen(isOpen ? null : p.index)}
                >
                  <div className="proj-head">
                    <span className="proj-n">{p.index}</span>
                    <span className="proj-name">{p.name}</span>
                    <span className="proj-right">
                      <span className="proj-status">{p.status}</span>
                      <span className="proj-plus" />
                    </span>
                  </div>
                </button>

                <div
                  className={`proj-body${isOpen ? ' open' : ''}`}
                  id={`proj-${p.index}`}
                >
                  <div>
                    <div className="proj-inner">
                      <span className="spacer" />
                      <div>
                        <p className="proj-summary">{p.summary}</p>
                        <ul className="xp-points">
                          {p.points.map((pt) => (
                            <li key={pt.slice(0, 40)}>{pt}</li>
                          ))}
                        </ul>
                        <div className="chips">
                          <span className="chip">{p.period}</span>
                          {p.stack.map((s) => (
                            <span className="chip" key={s}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section" id="about" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="mono">03</span>
          <h2>About</h2>
          <span className="rule" />
        </div>

        <div className="about-grid">
          <div className="about-copy reveal">
            <p>
              I&rsquo;m a computer science senior at <strong>Texas Tech</strong>,
              most of the way through a math minor, and most interested in the
              layer where a system stops being one machine.
            </p>
            <p>
              The last two summers were spent at <strong>Cisco</strong> and{' '}
              <strong>Splunk</strong> on backend and platform work — writing Go,
              designing a cell-based service, arguing with Kubernetes, and
              learning that the hard part is almost never the code.
            </p>
            <p>
              Off the clock I&rsquo;m VP of <strong>ColorStack TTU</strong>,
              I TA data structures for a few hundred students a year, and I am
              perpetually about to start a blog.
            </p>
          </div>

          <div className="reveal">
            <dl>
              <div className="fact">
                <dt className="mono">Education</dt>
                <dd>
                  {EDUCATION.school}
                  <span>
                    {EDUCATION.degree} — GPA {EDUCATION.gpa} — {EDUCATION.grad}
                  </span>
                </dd>
              </div>
              <div className="fact">
                <dt className="mono">Leadership</dt>
                <dd>
                  {LEADERSHIP.org} — {LEADERSHIP.title}
                  <span>{LEADERSHIP.points[0]}</span>
                </dd>
              </div>
              <div className="fact">
                <dt className="mono">Based in</dt>
                <dd>
                  {PROFILE.location}
                  <span>Open to 2027 new-grad roles</span>
                </dd>
              </div>
            </dl>

            <div style={{ marginTop: 44 }}>
              {SKILLS.map((group) => (
                <div className="skill-block" key={group.label}>
                  <span className="mono">{group.label}</span>
                  <ul className="skill-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact({ onBlog }: { onBlog: () => void }) {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section" id="contact" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="mono">04</span>
          <h2>Say something</h2>
          <span className="rule" />
        </div>

        <div className="reveal">
          <a className="contact-big" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>

          <div className="contact-links">
            <a
              className="btn"
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
            <a
              className="btn"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Arrow />
            </a>
            <a
              className="btn"
              href={PROFILE.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé <Arrow />
            </a>
            <button className="btn" onClick={onBlog}>
              Blog Posts <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="foot" style={{ marginTop: 'clamp(70px, 10vw, 130px)' }}>
          <span className="mono">© {new Date().getFullYear()} Korede Afolami</span>
          <span className="mono">Built with React, TypeScript &amp; Vite</span>
          <span className="mono">{PROFILE.githubLabel}</span>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [blogOpen, setBlogOpen] = useState(false)
  useSmoothScroll()

  const openBlog = useCallback(() => setBlogOpen(true), [])
  const closeBlog = useCallback(() => setBlogOpen(false), [])

  return (
    <>
      <SketchFilter />
      <Cursor />
      <div className="grain" aria-hidden="true" />

      <Nav onBlog={openBlog} />

      <main>
        <Hero />
        <Marquee />
        <Work />
        <Projects />
        <About />
        <Contact onBlog={openBlog} />
      </main>

      <BlogPanel open={blogOpen} onClose={closeBlog} />
    </>
  )
}
