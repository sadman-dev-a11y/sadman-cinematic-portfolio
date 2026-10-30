# Sadman — cinematic portfolio

Responsive static portfolio with a real portrait, 60-second introduction, two project case studies, research and ten authentic certificate documents. No framework runtime or third-party JavaScript dependencies. Native CSS and IntersectionObserver animate the sections; Web Audio generates original interaction sounds after opt-in. Native dialogs provide keyboard focus containment and restore focus after closing.

## Run and verify

Node 22+ is recommended. `npm ci`, `npm run check`, and `npm run build`. Serve `dist/` through any local static HTTP server (for example `python3 -m http.server 8000 --directory dist`). Do not open the HTML directly via file://; the data uses ES modules.

## Update content

Edit `dist/content.js` for profile, projects and certificate data. Add each new certificate's readable WebP preview and original PDF/image to `dist/assets/`, then add a unique entry to `certificates`. Categories and counts update automatically. Add a project entry to `projects`; optional `url` and `link` fields show a source link. The current automated credential check deliberately expects ten files: update its expected count when adding credentials. Biography, education and leadership text live in `dist/index.html` and the print-friendly `dist/resume.html`.

## GitHub Pages

The repository is created through GitHub’s browser interface; text source is synchronized through the GitHub connection and public media through GitHub’s upload interface. Deployment status is recorded in the final handover.

The included `.github/workflows/deploy.yml` is configured for `main`, uses the official configure/upload/deploy Pages actions, and runs checks before publication. Select GitHub Actions under Settings → Pages. A later push to `main` redeploys. All asset paths are relative and support a repository subpath. The build accepts `PUBLIC_SITE_URL` to write the correct canonical, OpenGraph and sitemap URLs; the workflow supplies its eventual GitHub Pages URL. Do not copy the Sites-specific `.openai/` directory into a separate GitHub repository.

## Privacy and source accuracy

The original CV, private phone and reference contacts are excluded. Certificates are public gallery assets. The résumé is an independently authored public-safe HTML page with browser Print / Save as PDF support. All certificate previews come from the supplied documents; the photography preview is rotated for readability. CineDesk details come from its current repository README, rather than outdated CV shorthand. Faculty app details are CV-backed; no independent APK or live deployment is claimed. The Medium link is supplied in the CV; retrieval may be blocked, so no unverified abstract is included. No analytics, form backend or secrets are included. Sound preference is stored locally in the browser; sound is opt-in and ducks while the reel plays.

## Validation

See `VALIDATION.md` for the actual checks performed and remaining verification limits. No license grant has been added to the personal media or source.
