import { useCallback, useEffect, useState } from 'react'
import { EDUCATION, EXPERIENCE, LEADERSHIP, PROFILE, PROJECTS, SKILLS } from './data'
import { BlogPanel } from './components/BlogPanel'
import { DocIcon, GitHubIcon, LinkedInIcon, MailIcon } from './components/Icons'
import { useRevealGroup } from './hooks/useReveal'
import { scrollToId, useSmoothScroll } from './hooks/useSmoothScroll'

const SECTIONS = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'stack', label: 'stack' },
  { id: 'contact', label: 'contact' },
]

/** The one section marker: a hash, the title, a rule, an optional count. */
function SecHead({ title, count }: { title: string; count?: string }) {
  return (
    <div className="sec-head">
      <h2>
        <span className="hash">#</span> {title}
      </h2>
      <span className="rule" />
      {count ? <span className="count">{count}</span> : null}
    </div>
  )
}

function Nav({ onBlog }: { onBlog: () => void }) {
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        }),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className={`nav${stuck ? ' stuck' : ''}`}>
      <div className="wrap nav-in">
        <a
          className="nav-mark"
          href="#about"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('about')
          }}
        >
          <span className="br">[</span>ka<span className="br">]</span>
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
            writing
          </button>
        </div>

        <div className="nav-icons">
          <a
            className="icon-btn"
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            className="icon-btn"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            className="icon-btn"
            href={`mailto:${PROFILE.email}`}
            aria-label="Email"
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
    <header className="hero wrap" id="about">
      <span className="avatar">
        <img src={PROFILE.photo} alt={PROFILE.name} />
      </span>

      <h1>Hey, I&rsquo;m Korede</h1>
      <p className="hero-role">software engineer, dallas tx</p>

      <div className="hero-links">
        <a className="chip chip-link" href={PROFILE.github} target="_blank" rel="noreferrer">
          <GitHubIcon /> github
        </a>
        <a className="chip chip-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon /> linkedin
        </a>
        <a className="chip chip-link" href={`mailto:${PROFILE.email}`}>
          <MailIcon /> email
        </a>
        <a className="chip chip-link" href={PROFILE.resume} target="_blank" rel="noreferrer">
          <DocIcon /> résumé
        </a>
      </div>

      <div className="hero-rule" />

      <div className="hero-copy">
        <p>
          I&rsquo;m a CS senior at <strong>Texas Tech</strong>, most of the way through a math
          minor, and most interested in the layer where a system stops being one machine.
        </p>
        <p>
          The last two summers I was at <strong>Cisco</strong> and <strong>Splunk</strong> on
          backend and platform work: writing Go, designing a cell-based service, arguing with
          Kubernetes, and learning that the hard part is almost never the code.
        </p>
        <p>
          Right now that means distributed systems, infrastructure, and the occasional compiler
          assignment. I&rsquo;m also VP of ColorStack at Tech and I TA data structures, which is
          a few hundred students a year.
        </p>
        <p>
          Outside of that: pickleball, hiking, soccer, 3D printing, and writing, which is why
          there is a writing tab with nothing in it yet.
        </p>
      </div>
    </header>
  )
}

function Experience() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section wrap" id="experience" ref={ref}>
      <SecHead title="experience" count={String(EXPERIENCE.length).padStart(2, '0')} />
      {EXPERIENCE.map((job) => (
        <article className="row reveal" key={job.org + job.period}>
          <div className="row-head">
            <span className="tile">{job.mark}</span>
            <div>
              <h3 className="row-title">{job.title}</h3>
              <p className="m-org">{job.org}</p>
            </div>
            <div className="row-meta">
              <span className="m-sm">{job.place}</span>
              <span className="m-sm">{job.period}</span>
            </div>
          </div>
          <div className="row-body">
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
    </section>
  )
}

function Projects() {
  const ref = useRevealGroup<HTMLElement>()
  const [open, setOpen] = useState<string | null>(PROJECTS[0].index)

  return (
    <section className="section wrap" id="projects" ref={ref}>
      <SecHead title="projects" count={String(PROJECTS.length).padStart(2, '0')} />
      {PROJECTS.map((p) => {
        const isOpen = open === p.index
        return (
          <article className="row reveal" key={p.index}>
            <button
              className="row-toggle"
              aria-expanded={isOpen}
              aria-controls={`p-${p.index}`}
              onClick={() => setOpen(isOpen ? null : p.index)}
            >
              <div className="row-head">
                <span className="tile">{p.index}</span>
                <div>
                  <h3 className="row-title">{p.name}</h3>
                  <p className="m-org">{p.status}</p>
                </div>
                <div className="row-meta">
                  <span className="m-sm">{p.period}</span>
                </div>
                <span className="row-plus" />
              </div>
            </button>

            <div className={`collapse${isOpen ? ' open' : ''}`} id={`p-${p.index}`}>
              <div>
                <div className="row-body">
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
          </article>
        )
      })}
    </section>
  )
}

function Stack() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section wrap" id="stack" ref={ref}>
      <SecHead title="stack" />
      <div className="reveal">
        {SKILLS.map((g) => (
          <div className="group" key={g.label}>
            <span className="m">{g.label.toLowerCase()}</span>
            <div className="chips">
              {g.items.map((i) => (
                <span className="chip" key={i}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Education() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section wrap" id="education" ref={ref}>
      <SecHead title="education" />
      <article className="row reveal">
        <div className="row-head">
          <span className="tile">TT</span>
          <div>
            <h3 className="row-title">{EDUCATION.school}</h3>
            <p className="m-org">{EDUCATION.degree}</p>
          </div>
          <div className="row-meta">
            <span className="m-sm">{EDUCATION.place}</span>
            <span className="m-sm">
              GPA {EDUCATION.gpa} · {EDUCATION.grad}
            </span>
          </div>
        </div>
      </article>
      <article className="row reveal">
        <div className="row-head">
          <span className="tile">CS</span>
          <div>
            <h3 className="row-title">{LEADERSHIP.title}</h3>
            <p className="m-org">{LEADERSHIP.org}</p>
          </div>
          <div className="row-meta">
            <span className="m-sm">{LEADERSHIP.period}</span>
          </div>
        </div>
        <div className="row-body">
          <ul className="points">
            {LEADERSHIP.points.map((p) => (
              <li key={p.slice(0, 30)}>{p}</li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  )
}

const CARDS = [
  { icon: <MailIcon />, t: 'email', s: PROFILE.email, href: `mailto:${PROFILE.email}`, ext: false },
  { icon: <LinkedInIcon />, t: 'linkedin', s: PROFILE.linkedinLabel, href: PROFILE.linkedin, ext: true },
  { icon: <GitHubIcon />, t: 'github', s: PROFILE.githubLabel, href: PROFILE.github, ext: true },
  { icon: <DocIcon />, t: 'résumé', s: 'one page, pdf', href: PROFILE.resume, ext: true },
]

function Contact() {
  const ref = useRevealGroup<HTMLElement>()
  return (
    <section className="section wrap" id="contact" ref={ref}>
      <SecHead title="contact" />
      <div className="reveal">
        <p className="contact-copy">
          Looking for a new grad software engineering role for 2027: backend, infrastructure,
          distributed systems. Email is the fastest way to reach me.
        </p>
        <div className="contact-grid">
          {CARDS.map((c) => (
            <a
              className="ccard"
              key={c.t}
              href={c.href}
              {...(c.ext ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="ic">{c.icon}</span>
              <span className="tx">
                <b>{c.t}</b>
                <span>{c.s}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="foot">
        <span className="m-sm">© {new Date().getFullYear()} korede afolami</span>
        <span className="m-sm">react · typescript · vite</span>
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
      <Nav onBlog={openBlog} />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Stack />
        <Education />
        <Contact />
      </main>
      <BlogPanel open={blogOpen} onClose={closeBlog} />
    </>
  )
}
