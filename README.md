# Lean into Physics — website

The structure of physics, from first principles, for people who think in types. This repository is the static website: plain HTML, CSS and a little JavaScript, with no build step.

| Path | What it is |
| --- | --- |
| `index.html` | Landing page and contents |
| `program.html` | The program: why physics, and why this way |
| `lesson-001.html` | Lesson 001, What Is a Physical State? |
| `404.html` | Not-found page |
| `css/site.css` | Screen styles, light and dark |
| `css/print.css` | Print styles (Paged.js or Prince) |
| `js/site.js` | Theme switch and phone-width margin notes |
| `js/box.js` | Lesson 001's interactive figure |

It is served by a Cloudflare Worker with static assets (`wrangler.jsonc`); there is no script. `.assetsignore` keeps repository files such as this README off the site. Links use clean URLs (`/program`), which the Worker maps to `program.html`.

To view it locally the way the Worker serves it:

```bash
npx wrangler dev
```

To deploy from your machine (after `npx wrangler login`):

```bash
npx wrangler deploy
```

Text and code are CC0. JuliaMono is used under the SIL Open Font License (`fonts/JuliaMono-LICENSE.txt`).
