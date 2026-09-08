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
- **Palette** — pure black + QOVES-style neutrals: `--black #000`, `--ink #0a0a0a`,
  `--gray #515255`, canvas `--bg #f2f2f2`, hairlines `--line #e8e8e8`; on dark,
  70% / 50% white. No accent hue.
- **Geometry** — radii `8 / 12 / 16px`, pill buttons and pill nav, 1px hairlines.
- **Motion** — expo `cubic-bezier(.19,1,.22,1)`: staggered line-mask headline
  reveals, draw-on card artwork, nav that melts into a floating blurred pill on
  scroll. Everything collapses under `prefers-reduced-motion: reduce`.

## Editing

Plain HTML/CSS/JS — no build step, no dependencies.

```bash
python3 -m http.server 8931   # then open http://localhost:8931
```

Push to `main` and GitHub Pages redeploys in about a minute.

## Things to fill in

- `[YOUR-EMAIL]` in the contact section (`index.html`) — appears twice, as the
  link text and in the `mailto:`.
