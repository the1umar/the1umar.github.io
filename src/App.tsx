import { useCallback, useEffect, useState } from 'react'
import { EDUCATION, EXPERIENCE, LEADERSHIP, PROFILE, PROJECTS, SKILLS } from './data'
import { Portrait, InkFilter } from './components/Portrait'
import { BlogPanel } from './components/BlogPanel'
import {
  ArrowIcon,
  DocIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from './components/Icons'
import { useRevealGroup } from './hooks/useReveal'
import { scrollToId, useSmoothScroll } from './hooks/useSmoothScroll'

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

function Nav({ onBlog }: { onBlog: () => void }) {
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20)
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
        <span className="sq" />
        Korede Afolami
      </a>

      <div className="nav-right">
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
            Blog
          </button>
        </div>

        <div className="nav-social">
          <a
            className="icon-btn"
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Korede Afolami on GitHub"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            className="icon-btn"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Korede Afolami on LinkedIn"
            title="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            className="icon-btn"
            href={`mailto:${PROFILE.email}`}
            aria-label={`Email ${PROFILE.name}`}
            title="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <header className="hero shell" id="top">
      <div className="hero-grid">
        <div>
          <span className="hero-eyebrow label">
            <span className="dot" />
            Open to 2027 new-grad roles
          </span>

          <h1 className="hero-name">
            <span className="line">
              <span style={{ ['--d' as string]: '80ms' }}>Korede</span>
            </span>
            <span className="line">
              <span style={{ ['--d' as string]: '180ms' }} className="accent">
                Afolami
              </span>
            </span>
          </h1>

          <p className="hero-blurb">{PROFILE.blurb}</p>

          <div className="hero-facts">
            <span className="pill">Software Engineer</span>
            <span className="pill">Dallas, TX</span>
            <span className="pill">Texas Tech &rsquo;26</span>
            <span className="pill">GPA 3.9</span>
          </div>

          <div className="hero-actions">
            <a className="btn primary" href={PROFILE.resume} target="_blank" rel="noreferrer">
              <DocIcon /> Résumé
            </a>
            <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer">
              <GitHubIcon /> GitHub
            </a>
            <a className="btn" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>

        <Portrait />
      </div>
    </header>
  )
}

function Work() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section" id="work" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">01</span>
          <h2>Experience</h2>
          <span className="rule" />
        </div>

        {EXPERIENCE.map((job) => (
          <article className="xp-item reveal" key={job.org + job.period}>
            <div className="xp-rail">
              <span className="label">{job.period}</span>
            </div>
            <div>
              <h3 className="xp-org">{job.org}</h3>
              <p className="xp-title">
                {job.title} · {job.place}
                {job.current ? (
                  <>
                    {' '}
                    <span className="badge-now">
                      <span className="dot" /> current
                    </span>
                  </>
                ) : null}
              </p>
              <ul className="points">
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
          <span className="label label-accent">02</span>
          <h2>Projects</h2>
          <span className="rule" />
        </div>

        <div className="reveal">
          {PROJECTS.map((p, i) => {
            const isOpen = open === p.index
            const last = i === PROJECTS.length - 1
            return (
              <div key={p.index} className={last && !isOpen ? 'proj-last' : undefined}>
                <button
                  className="proj-row"
                  aria-expanded={isOpen}
                  aria-controls={`proj-${p.index}`}
                  onClick={() => setOpen(isOpen ? null : p.index)}
                >
                  <div className="proj-head">
                    <span className="label">{p.period}</span>
                    <span className="proj-name">{p.name}</span>
                    <span className="proj-right">
                      <span className="proj-toggle" />
                    </span>
                  </div>
                </button>

                <div className={`proj-body${isOpen ? ' open' : ''}`} id={`proj-${p.index}`}>
                  <div>
                    <div className="proj-inner">
                      <span className="spacer" />
                      <div>
                        <p className="proj-summary">{p.summary}</p>
                        <ul className="points">
                          {p.points.map((pt) => (
                            <li key={pt.slice(0, 40)}>{pt}</li>
                          ))}
                        </ul>
                        <div className="chips">
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
          <span className="label label-accent">03</span>
          <h2>About</h2>
          <span className="rule" />
        </div>

        <div className="about-grid">
          <div className="about-copy reveal">
            <p>
              I&rsquo;m a computer science senior at <strong>Texas Tech</strong>, most of the
              way through a math minor, and most interested in the layer where a system
              stops being one machine.
            </p>
            <p>
              The last two summers were spent at <strong>Cisco</strong> and{' '}
              <strong>Splunk</strong> on backend and platform work — writing Go, designing a
              cell-based service, arguing with Kubernetes, and learning that the hard part is
              almost never the code.
            </p>
            <p>
              Off the clock I&rsquo;m VP of <strong>ColorStack TTU</strong>, I TA data
              structures for a few hundred students a year, and I am perpetually about to
              start a blog.
            </p>
          </div>

          <div className="reveal">
            <dl>
              <div className="fact">
                <dt className="label">Education</dt>
                <dd>
                  {EDUCATION.school}
                  <span>
                    {EDUCATION.degree} · GPA {EDUCATION.gpa} · Graduating {EDUCATION.grad}
                  </span>
                </dd>
              </div>
              <div className="fact">
                <dt className="label">Leadership</dt>
                <dd>
                  {LEADERSHIP.org} — {LEADERSHIP.title}
                  <span>{LEADERSHIP.points[0]}</span>
                </dd>
              </div>
            </dl>

            <div style={{ marginTop: 32 }}>
              {SKILLS.map((group) => (
                <div className="skill-block" key={group.label}>
                  <span className="label">{group.label}</span>
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

const CARDS = [
  {
    icon: <MailIcon />,
    title: 'Email',
    sub: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    external: false,
  },
  {
    icon: <LinkedInIcon />,
    title: 'LinkedIn',
    sub: PROFILE.linkedinLabel,
    href: PROFILE.linkedin,
    external: true,
  },
  {
    icon: <GitHubIcon />,
    title: 'GitHub',
    sub: PROFILE.githubLabel,
    href: PROFILE.github,
    external: true,
  },
  {
    icon: <DocIcon />,
    title: 'Résumé',
    sub: 'One page, PDF',
    href: PROFILE.resume,
    external: true,
  },
]

function Contact() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section" id="contact" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">04</span>
          <h2>Get in touch</h2>
          <span className="rule" />
        </div>

        <div className="reveal">
          <p className="contact-lead">Looking for a new grad SWE for 2027.</p>
          <p className="contact-sub">
            Backend, infrastructure, distributed systems. Fastest way to reach me is email —
            everything else is below.
          </p>

          <div className="contact-cards">
            {CARDS.map((c) => (
              <a
                className="contact-card"
                key={c.title}
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="ic">{c.icon}</span>
                <span className="txt">
                  <b>{c.title}</b>
                  <span>{c.sub}</span>
                </span>
                <span className="go">
                  <ArrowIcon />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="foot">
          <span className="label">© {new Date().getFullYear()} Korede Afolami</span>
          <span className="label">Built with React, TypeScript &amp; Vite</span>
          <span className="foot-social">
            <a
              className="icon-btn"
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              className="icon-btn"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </span>
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
      <InkFilter />
      <Nav onBlog={openBlog} />

      <main>
        <Hero />
        <Work />
        <Projects />
        <About />
        <Contact />
      </main>

      <BlogPanel open={blogOpen} onClose={closeBlog} />
    </>
  )
}
