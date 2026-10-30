# Validation — 30 October 2026

- `npm ci --ignore-scripts` completed without runtime dependencies.
- `npm run check`: JavaScript syntax, ten unique credential records, corresponding previews and original documents, local link existence, exact professional email, and exclusion of private CV phone/reference email strings passed.
- `ffprobe`: original video is exactly 60.000 seconds; H.264 1920×1080 and AAC audio.
- Browser playback advanced past eight seconds, readyState 4, without a media error; play/pause native controls were exercised.
- Browser tests: category filter, text search, no-results message, restoration of all ten cards, certificate modal, 125% zoom, Escape dismissal, mobile navigation open and close, and sound on state passed.
- Layout inspection used 320, 390 and 768 pixel iframe viewports and a desktop browser. Content width matched viewport width (305, 375 and 753 CSS pixels respectively after browser scrollbars). These are responsive layout checks, not physical-device tests.
- All ten certificate previews were visually inspected; photography was rotated to readable landscape orientation.
- Native dialog supplies keyboard focus containment; explicit close restores the triggering element. Reduced-motion CSS and JavaScript are included. No formal WCAG certification or Lighthouse score is claimed.
- Interface sounds are synthesized with Web Audio after opt-in; oscillator output volume and timing are coded, but subjective audio quality was not audited. Sounds are suppressed during video playback.
- The CV-derived Medium article URL could not be independently retrieved. No article abstract was invented. Faculty app details remain CV-backed without an independently verified APK.
- GitHub publication and preview deployment status are recorded in the final handover.
