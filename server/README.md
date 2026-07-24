# Community backend

A tiny, **zero-dependency** Node server that lets Ontario Wildlife Log users pool
anonymized sightings — powering the app's **Community** screen ("near you this week",
recent bear/hazard activity, province-wide totals) without a single npm install.

It is optional. With no server configured, the app stays fully private and offline.

## What it protects

- **Pseudonymous** — clients send a random device id only (no accounts, names, or emails),
  plus a secret **ownership token**. The server stores only the token's hash, and requires
  it to submit-as or delete that id — so knowing an id alone can't erase or impersonate a
  contributor.
- **Geoprivacy, enforced server-side** — every coordinate is snapped to a coarse grid **at
  ingest** (~5 km normally, ~22 km for Species-at-Risk and bear reports). The coarse grid is
  **forced for bears** rather than trusted to the client, and raw points are never stored.
- **Soft anti-abuse** — rapid-fire / impossible-travel bursts get a **temporary** throttle
  (never a permanent ban, never a retroactive purge of a contributor's history). Every route
  is rate-limited per IP; submissions also per client, per IP per day, and with a cap on how
  many new ids one IP can mint.
- **Bounded & durable** — the rate map is swept, orphan clients are pruned, no single client
  can dominate the store, writes are **atomic** (temp-file + rename with a `.bak` fallback so
  a crash can't zero the data), and push subscriptions are capped and upserted per client.

## Run locally

```bash
cd server
node server.js            # listens on :8787
# then, in the app: More → Community → paste  http://localhost:8787
```

Environment variables:

- `PORT` (default 8787), `DATA_FILE` (default `./data.json`).
- `ALLOW_ORIGIN` — **set this** to your site's origin (e.g. `https://<user>.github.io`).
  It defaults to `*` for local testing, but a `*` policy lets any website drive the API from
  a visitor's browser; the server prints a warning while it's `*`.
- `TRUST_PROXY` — set to `1` **only** when running behind a reverse proxy you control.
  `X-Forwarded-For` is forgeable, so it is **ignored by default** and the socket address is
  used for rate limiting.
- `VAPID_PUBLIC_KEY` — the public VAPID key, served at `/api/v1/push/key` (see Web Push).

> `data.json` holds push-subscription endpoints/keys (delivery secrets) alongside coarse
> data — keep it on a private disk with restricted file permissions.

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
| POST | `/api/v1/sightings` | submit a sighting/bear/hazard (`clientId` + `token` required) |
| POST | `/api/v1/delete` | delete everything for a `clientId` (requires its `token`) |
| GET  | `/api/v1/community?lat=&lng=&km=&days=` | nearby activity + stats (coarsened) |
| GET  | `/api/v1/stats` | province-wide totals |
| POST | `/api/v1/push/subscribe` | store a Web Push subscription (`token` required) |
| GET  | `/api/v1/push/key` | the server's VAPID public key (empty until configured) |

## Web Push (iOS 16.4+ installed PWA)

The app can subscribe for **nearby bear/hazard alerts** — tap **Enable nearby alerts** on the
Community screen. That flow requests notification permission, subscribes via the service
worker (which already renders incoming pushes), and POSTs the subscription here. It only works
once the server has a VAPID key:

1. Generate VAPID keys (e.g. `npx web-push generate-vapid-keys`).
2. Set `VAPID_PUBLIC_KEY` — the server already serves it at `/api/v1/push/key`, which the
   client fetches before subscribing.
3. Sign and send notifications with the `web-push` library (using your private key) when a
   new nearby bear/hazard arrives.

This reference server stores subscriptions and serves the public key, but does not sign
pushes itself, to stay dependency-free. Until `VAPID_PUBLIC_KEY` is set, the app tells the
user alerts aren't configured yet.
