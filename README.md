# RVSE LLC — institutional site

Static one-page site for RVSE LLC, served from GitHub Pages.

**Live:** https://reverseeth.github.io/rvse-llc/

## Files

| Path | What it is |
|------|------------|
| `index.html` | The whole page — every section lives here |
| `styles.css` | Design tokens + all styling |
| `main.js` | Scroll reveal, sticky-nav hairline, mobile menu |
| `assets/rvse-black.svg` · `rvse-white.svg` | Brand wordmark |
| `assets/favicon.svg` | Browser tab icon |
| `assets/og.png` | Link preview card (1200×630) |

## Design system

Set once in `:root` at the top of `styles.css`.

- **Type** — Geist (body/display) + Geist Mono (labels, legal lines), via Google Fonts.
  Root is `62.5%`, so `1rem = 10px`.
- **Palette** — cool slate neutrals: `--paper #f9fbfb`, `--paper-alt #f2f5f5`,
  `--ink #233137`, `--ink-soft #5d767e`, `--muted #758084`, `--mist #9aaeb5`,
  `--night #151d20`. No accent hue — the slate range carries everything.
- **Geometry** — radii `4 / 8 / 12px`, pill buttons, 1px hairline rules.
- **Motion** — `cubic-bezier(.19,1,.22,1)` (expo) for reveals and hovers.
  Everything collapses under `prefers-reduced-motion: reduce`.

## Editing

Plain HTML/CSS/JS — no build step, no dependencies.

```bash
python3 -m http.server 8931   # then open http://localhost:8931
```

Push to `main` and GitHub Pages redeploys in about a minute.

## Things to fill in

- `[YOUR-EMAIL]` in the contact section (`index.html`) — appears twice, as the
  link text and in the `mailto:`.
