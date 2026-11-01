# Sadman — cinematic portfolio

Responsive static portfolio with a real portrait, 60-second introduction, two project case studies, research and ten authentic certificate documents. Native ES modules, CSS and the Web Animations API handle the main interface. A lazily loaded Three.js lens sculpture adds optional WebGL graphics. Web Audio generates quiet interaction sounds after opt-in; native dialogs retain keyboard focus and return it after closing.

## Run and verify

Node 22+ is recommended. `npm ci`, `npm run build`, and `npm run check`. Serve `dist/` through any local static HTTP server (for example `python3 -m http.server 8000 --directory dist`). Do not open the HTML directly via file://; the data uses ES modules.

## Update content

Edit `dist/content.js` for profile, projects and certificate data. Add each new certificate's readable WebP preview and original PDF/image to `dist/assets/`, then add a unique entry to `certificates`. Categories and counts update automatically. Add a project entry to `projects`; optional `url` and `link` fields show a source link. The current automated credential check deliberately expects ten files: update its expected count when adding credentials. Biography, education and leadership text live in `dist/index.html` and the print-friendly `dist/resume.html`.

## GitHub Pages

The included `.github/workflows/deploy.yml` is configured for `main`, uses the official configure/upload/deploy Pages actions, and runs checks before publication. Select GitHub Actions under Settings → Pages. A later push to `main` redeploys. All asset paths are relative and support a repository subpath. The build accepts `PUBLIC_SITE_URL` to write the correct canonical, OpenGraph and sitemap URLs; the workflow supplies its eventual GitHub Pages URL. Do not copy the Sites-specific `.openai/` directory into a separate GitHub repository.

## Privacy and source accuracy

The original CV, private phone and reference contacts are excluded. Certificates are public gallery assets. The résumé is an independently authored public-safe HTML page with browser Print / Save as PDF support. All certificate previews come from the supplied documents; the photography preview is rotated for readability. CineDesk details come from its current repository README, rather than outdated CV shorthand. Faculty app details are CV-backed; no independent APK or live deployment is claimed. The Medium link is supplied in the CV; retrieval may be blocked, so no unverified abstract is included. No analytics, form backend or secrets are included. Sound preference is stored locally in the browser; sound is opt-in and ducks while the reel plays.

## Validation

See `VALIDATION.md` for the actual checks performed and remaining verification limits. No license grant has been added to the personal media or source.

## Motion and media foundations

- `dist/motion.css` and `dist/motion.js`: name masks, lighting, particles, scroll reveals, active navigation, magnetic buttons, card tilt, custom cursor and offscreen animation pausing.
- `src/scene.js`: original lens sculpture built from simple geometry. `scripts/build.mjs` bundles it locally with esbuild into `dist/scene.js`; the bundle is generated, not committed. Three.js uses a WebGL2 context created only after idle time and viewport visibility. Data saver and devices reporting 2 GB RAM or less use the SVG fallback. Context failure also leaves the SVG intact.
- `dist/preferences.js`: system reduced-motion support plus a persistent Motion low control. Pointer effects are disabled for coarse pointers and reduced motion.
- `dist/player.js`: custom play/pause, seeking, time, mute, volume and fullscreen controls, retaining the original MP4 and soundtrack. Browsers that deny native fullscreen use an accessible theater view with Escape exit, focus containment and background inertness. Native controls remain available when JavaScript is absent.
- Certificates support grid/filmstrip layouts, existing search/category filters, next/previous controls, arrow-key navigation, fit-to-view, zoom, touch swipes and original documents.
- Project cards support category filters, device-inspired graphics and animated detail panels with brief descriptions. The graphics are original illustrations, not application screenshots.

`backup/pre-cinematic-v2` preserves the original public GitHub source before this upgrade. Source content, ten certificate originals and previews, portrait, résumé, public contact links and the corrected Medium article URL are retained.

The production build also bundles the core interface into `dist/runtime/interface-<hash>.js` and splits the optional scene into a separately hashed chunk. The HTML entry is updated automatically, preventing browsers from mixing a new page with a cached older interface. `dist/runtime/` is generated and excluded from source control. Run `npm run build` after editing interface source before refreshing the local preview.

## Director’s Cut 3.0

The refined brief is in `DIRECTORS_CUT_BRIEF.md`. `dist/directors-cut.css` controls the editorial composition, portrait frame, chapter index, project showcase, exhibition-style credentials, grouped skills and contact finale. Shared motion timings and easing live in its root tokens. `dist/design.css` imports the existing styles and this design layer; esbuild emits one minified, content-hashed production stylesheet. The HTML build references both a hashed stylesheet and hashed JavaScript entry so visitors receive updated design assets after deployment.

`dist/motion.js` handles contextual pointer interpolation, visibility-based reveals and active header navigation. Its cursor loop stops once the pointer settles, when the document is hidden, during showreel playback, and under reduced motion. Small screens below 850px, data saver and low-memory devices retain the lightweight SVG lens. The optional Three.js loop pauses offscreen, in hidden tabs and during playback.

The mobile menu uses background inertness, scroll locking, a Tab loop, Escape dismissal and focus restoration. Project details use `#project/cinedesk` and `#project/film-media-studies`, support Back/Forward and retain native dialog keyboard behavior. Interface artwork is explicitly labeled decorative. Do not present it as a screenshot.

To update project scope, edit `openProject` in `dist/app.js`; it deliberately lists only capabilities already stated in the verified descriptions. To extend the project set, add a stable unique slug in `projectSlug` as well as its content record. Certificate data and originals are unchanged; existing filters, search, filmstrip, keyboard/swipe navigation and zoom remain available.

No new runtime dependency or framework was added. The original showreel and soundtrack are unchanged. Interface sound remains opt-in and is suppressed during video playback. Metrics in the original brief remain goals; see `VALIDATION.md` for what was actually measured.
