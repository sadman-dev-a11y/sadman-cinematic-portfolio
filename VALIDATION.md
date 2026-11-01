# Director’s Cut 3.0 validation

Validated 2 November 2026 (Asia/Dhaka) against source baseline `1898c48c4e039a437310eb144e309937e7020377`.

## Commands actually run

- `npm ci`: passed; dependencies installed from the existing lockfile.
- `PUBLIC_SITE_URL=https://sadman-dev-a11y.github.io/sadman-cinematic-portfolio/ npm run build`: passed. One minified content-hashed CSS entry and a hashed JS entry are emitted; optional Three.js remains split/lazy.
- `npm run check`: passed. Syntax, ten unique certificate records, every preview/original asset, two projects, local HTML links, public email/privacy exclusions, six chapters, hashed CSS reference and supplied Medium URL were checked.
- `git diff --check`: passed.
- An invalid existing hover media-query spacing was detected by CSS bundling and corrected; the final build has no CSS syntax warning.

## Browser checks actually performed

Chrome through the supported Sites preview. Desktop visual inspection at the browser’s approximately 1360px viewport; a same-origin responsive iframe exercised 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920px viewports. Every viewport reported document scroll width equal to its client width (stable scrollbars reserve 15px). The 390px portrait/name composition was visually inspected; the 320px headline masks had no internal horizontal clipping. These checks do not simulate real phone hardware, touch input or GPU performance.

Passed interaction checks:

- Project detail opens at `#project/cinedesk`; browser Back closes it and restores focus to its trigger.
- Android project filter shows only Film & Media Studies; All restores both.
- Certificate search for Claude yields one record; an unmatched query shows the empty state.
- Education category yields three records; filmstrip layout activates.
- Certificate viewer opens, zoom reaches 125%, original Claude PDF URL is retained, and Next moves from Saylor to Basics of Artificial Intelligence. Escape dismissal exercised.
- Manual reduced motion sets the root preference to reduced; all reveal content remains readable.
- Sound toggle changes pressed state and was returned to off. No audio starts on page load.
- Original video plays and sets the watching state; pause clears it. The theater fallback opens and exits successfully. Ambient CSS and WebGL animation are wired to pause during playback.
- Mobile menu opens via keyboard, marks main content inert, focuses its first link, wraps Shift+Tab to the menu control, and restores focus/unlocks content on Escape.
- Production stylesheet loads by its content-hashed path with no desktop document overflow.

## Integrity

No media assets, certificate records/originals, résumé facts, contact destination, social URLs, or supplied Medium article URL were changed. The original MP4 was not recompressed. Interface illustrations are explicitly labeled decorative. No framework or runtime dependency was added.

Backup branch: `backup/pre-directors-cut-2026-11-02`.

## Verification limits

No Lighthouse, field Core Web Vitals, automated accessibility score, cross-browser/device lab, real touch gestures, or measured frame-rate results are claimed. No new performance scores were invented. OS-level reduced motion, native fullscreen on physical devices and WebGL on low-end hardware require device-level checks. External Medium/LinkedIn destinations were preserved; their service availability was not independently certified. The GitHub Actions build and Pages deployment must also succeed; their status is reported in the handover.

## Additional cross-device animation pass — 2 November 2026

- Added heading line reveals, scroll-triggered stagger, artwork float/depth, menu link stagger, pointer/touch feedback and keyboard press feedback in `dist/choreography.js`.
- `npm run build`, `npm run check` (including syntax of the new module) and `git diff --check` passed.
- Desktop preview: all seven section headings received readable line wrappers (14 lines); project filtering remained functional; Gmail compose destination remained intact. Full-motion artwork computed `device-breathe`; reduced motion computed no float animation.
- Playback preview: video play set `data-page-paused=true`; artwork computed animation state `paused`.
- Responsive 390px preview: all 14 line wrappers present, no horizontal document overflow, six mobile menu links available, manual reduced motion applied. Width checks at 320, 390, 768 and 1440px are recorded in the task handover after the final build.
- Touch feedback uses standard pointer events shared by mouse/touch; no hover is required. Actual iOS/Android touch gestures and device frame rates were not measured. No additional Lighthouse scores are claimed.

## Intro motion graphic and typography — 2 November 2026

The intro section now has a decorative original SVG film/aperture composition with rotating rings, floating tiles and a scanning line. Headline, body, eyebrow and chapter link sizes increased within this section only. The intro headline no longer depends on the legacy clip-mask reveal; its resting opacity is 1 and clip-path is none.

Build, source checks and whitespace checks passed. Preview checks at 320, 390, 768, 1440 and 1920px found no document overflow; the headline computed opacity 1 / clip-path none at every width. The orbit computed `intro-turn` / `running` in full motion. Reduced-motion and offscreen pause styles are included; physical mobile frame rates are unmeasured. Gmail contact destination and original content/media remain unchanged.
