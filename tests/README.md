# Tests

The app ships as zero-dependency HTML/CSS/JS. These tests are dev-only tooling and
run in CI (`.github/workflows/ci.yml`).

## `validate.js`, no browser, no install

```bash
node tests/validate.js
```

Checks syntax (`node --check`) of every JS file, the species database (count, no
duplicate ids, valid subcategories, well-formed records), the manifest and its
icons, the service-worker cache version and precached shell files, and a live
community-server round-trip (submit → feed → delete, including ownership-token
enforcement and forced bear geoprivacy).

## `e2e.js` / `e2e2.js`, headless browser (Playwright)

```bash
npm install
npx playwright install chromium
python3 -m http.server 8000 &        # serve the app
BASE=http://localhost:8000/index.html node tests/e2e.js
BASE=http://localhost:8000/index.html node tests/e2e2.js
```

`e2e.js` covers core flows (log an encounter, modal a11y, Escape, edit-in-place).
`e2e2.js` covers the hardening behaviours (privacy-gate consent, `aria-current` /
`aria-pressed`, picker inert, the double-tap save guard, and community-payload
privacy, coarse coordinates, ownership token, no PII, blurred timestamp).
