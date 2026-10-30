# Cinematic 2.0 validation — 30 October 2026

## Automated checks

- Clean `npm ci --ignore-scripts`, production build and source checks passed. The production workflow uses ordinary `npm ci`, builds the optional scene, checks all modules and media, then deploys through GitHub Pages.
- All ten unique credential records, their original documents and previews, portrait, reel, résumé and local document links remain present. Source media were not modified.
- The corrected Medium article URL remains `https://medium.com/@slcstamdford/20da0633d5d4`.
- No new private CV contacts, analytics or secrets were added.
- Three.js 0.187.0 and esbuild 0.28.2 are pinned. The optional scene bundle measured 545,380 bytes / 137,130 gzip bytes in the local production build. It is requested only after an idle/visibility check and a successful WebGL2 capability check.

## Browser checks

- Project filtering to Android showed one project; its animated detail panel contained the existing brief description. Escape dismissal worked.
- Certificate search and AI filtering returned the expected Claude entry; resetting restored all ten cards.
- Grid/filmstrip switching, horizontal gallery scrolling, previous/next controls, ArrowRight navigation, original document links, 125% zoom and Escape dismissal passed. The full document fits the initial viewer; zoom increases the sheet size for scrolling.
- Mobile menu opens and closes after navigation. A filmstrip measured 3,095 px of content within a 375 px page without causing page overflow.
- Responsive iframe checks at 320, 375, 390, 768, 1024 and 1440 px passed with ten credential cards. Actual inner content widths were 305, 360, 375, 753, 1009 and 1425 px after scrollbar space; page content width matched each viewport. These are responsive checks, not physical-device tests.
- Custom video playback advanced beyond nine seconds with a 60-second duration and no media error. Pause, seek to 59.9 seconds and video mute passed.
- This browser denies native fullscreen. The theater fallback passed: its controls remain accessible, background content becomes inert, Tab wraps inside the player and Escape exits.
- Motion low toggled the persistent reduced-motion state and revealed all content without motion. System prefers-reduced-motion uses the same preference pathway and has CSS fallbacks.
- Web Audio reached the running state after interaction. Mute and quiet event envelopes are implemented; subjective audio quality was not independently audited.

## Verification limits

The preview browser disables WebGL. The SVG fallback was visually verified, and the Three.js scene compiled successfully; actual GPU rendering could not be visually checked in this environment. Pointer/coarse and reduced-motion guards are implemented. No physical Safari/Android testing, Lighthouse score or formal WCAG certification is claimed. Existing public social links and the user-supplied Medium destination are retained; external content availability is outside the portfolio.

GitHub and Sites publication results are provided in the final handover. The rollback branch is `backup/pre-cinematic-v2`.

## Deployment cache correction

The first live refresh reused the previously cached interface script. The build now writes content-hashed interface and optional-scene chunks and updates the HTML reference automatically. This keeps page markup and behavior on the same source version.
