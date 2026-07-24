# Community backend

A tiny, **zero-dependency** Node server that lets Ontario Wildlife Log users pool
anonymized sightings — powering the app's **Community** screen ("near you this week",
recent bear/hazard activity, province-wide totals) without a single npm install.

It is optional. With no server configured, the app stays fully private and offline.

## What it protects

- **Anonymous** — clients send a random device id only. No accounts, names, or emails.
- **Geoprivacy** — every coordinate returned to clients is snapped to a coarse grid
  (~5 km normally, ~22 km for Species-at-Risk and bear reports). Exact points never leave
  the grid, mirroring how iNaturalist obscures sensitive taxa.
- **Anomaly-gating** — a lightweight version of the app's trust model (bursts, impossible
  travel, absurd counts) flags bot-like contributors and excludes them from public data.

## Run locally

```bash
cd server
node server.js            # listens on :8787
# then, in the app: More → Community → paste  http://localhost:8787
```

Environment variables: `PORT` (default 8787), `DATA_FILE` (default `./data.json`),
`ALLOW_ORIGIN` (CORS origin, default `*` — set to your Pages origin in production).

## Deploy (needs HTTPS)

The app is served over HTTPS (GitHub Pages), so the backend must be HTTPS too. Any Node
host works — no build step:

- **Render / Railway / Fly.io**: point at this folder, start command `node server.js`.
  Set `ALLOW_ORIGIN` to your site (e.g. `https://<user>.github.io`). Attach a small disk
  and set `DATA_FILE` to a path on it so data persists.
- **A VPS**: `node server.js` behind nginx/Caddy with TLS.
- **Serverless / edge**: the same handlers port cleanly to Cloudflare Workers + KV/D1 or a
  Deno Deploy script; swap the JSON-file store for the platform's KV.

Then open the app → **More → Community**, paste the deployed URL, and turn on sharing.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET  | `/api/v1/health` | liveness |
| POST | `/api/v1/sightings` | submit an anonymized sighting/bear/hazard |
| GET  | `/api/v1/community?lat=&lng=&km=&days=` | nearby activity + stats (coarsened) |
| GET  | `/api/v1/stats` | province-wide totals |
| POST | `/api/v1/push/subscribe` | store a Web Push subscription (see below) |

## Web Push (iOS 16.4+ installed PWA)

The client can subscribe for **nearby bear/hazard alerts**, and the service worker already
renders incoming pushes. Actually *sending* a push requires VAPID keys and a sender:

1. Generate VAPID keys (e.g. `npx web-push generate-vapid-keys`).
2. Serve the public key to the client (add a `/api/v1/push/key` route) and sign/send
   notifications with the `web-push` library when a new nearby bear/hazard arrives.

This reference server stores subscriptions but does not sign pushes, to stay dependency-free.
