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
