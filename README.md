# the1umar.github.io

Personal site for Korede (Umar) Afolami — [the1umar.github.io](https://the1umar.github.io)

A single column, one repeated row, and a strict split of labour between two
typefaces: mono carries every piece of metadata, sans carries every piece of
prose. The accent appears in exactly three places — the section marker,
organisation names, and list bullets.

## Stack

- **Vite + React 19 + TypeScript** — single page, no router
- **[Lenis](https://github.com/darkroomengineering/lenis)** — the only runtime
  dependency beyond React; smooth scrolling that keeps native scroll position,
  so `position: sticky` and the scrollbar still behave
- Plain CSS with custom properties. No Tailwind, no CSS-in-JS, no animation
  library — the motion is `IntersectionObserver` + `requestAnimationFrame` +
  transitions

## Editing content

Everything readable lives in [`src/data.ts`](src/data.ts): profile, experience,
projects, skills, education, and the blog post index. Nothing is hard-coded in
the components.

## Local development

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + bundle to dist/
npm run preview  # serve the built bundle
```

## Deploying

Pushing to `main` is the deploy. `.github/workflows/deploy.yml` builds the site
and publishes it to GitHub Pages; nothing is built on a laptop and no `dist/`
is committed anywhere.

Pages originally used the legacy branch builder against a `gh-pages` branch.
That builder stalled mid-build with no error and had to be cancelled, so the
site now builds in Actions instead. The `gh-pages` branch and the hand-rolled
deploy script are gone.
