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

```sh
npm run deploy   # builds, then force-pushes dist/ to the gh-pages branch
```

GitHub Pages is configured to serve the `gh-pages` branch at the repository
root.

### Optional: deploy from GitHub Actions instead

A workflow is tidier than deploying from a laptop, but pushing a file under
`.github/workflows/` needs the `workflow` OAuth scope. To switch:

```sh
gh auth refresh -s workflow
```

Then add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Finally switch the Pages source from the `gh-pages` branch to **GitHub Actions**
in repository settings.
