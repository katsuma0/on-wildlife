# 🐾 Ontario Wildlife Log

A simple, **iOS-styled** field journal for logging the wildlife you encounter across
Ontario — mammals, birds, reptiles, amphibians and fish. Spot a moose, hear a spring
peeper, catch a walleye, or find a turtle crossing the road? Log it in a couple of taps.

It's built as a **Progressive Web App (PWA)**, so there's nothing to install from an app
store: open it in Safari on your iPhone and tap **Add to Home Screen**. It then launches
fullscreen with its own icon, feels native, and works completely offline.

> **Status:** v1 — Ontario animals. Plants, trees, insects and fungi are planned for
> future updates (they already appear as "Coming Soon" in the app).

---

## ✨ Features

- **iOS look & feel** — San Francisco system font, grouped inset lists, large-title
  navigation bars, a translucent bottom tab bar, iOS switches/steppers/segmented
  controls, full **light & dark mode**, and safe-area handling for notch/home-indicator.
- **Categories → subcategories → species**, e.g. Reptiles › Turtles › Blanding's Turtle.
- **A field guide** to Ontario wildlife with ID tips, habitat, best seasons, conservation
  status (Species at Risk are flagged), safety cautions (e.g. the venomous massasauga),
  and fun facts.
- **Fast logging** with details that adapt to what you're recording:
  - 🎣 **Fishing** — caught or seen, length, weight, bait/lure, water body, kept/released.
  - 🦅 **Birding** — count, behaviour, seen or heard.
  - 🐢 **Any wildlife** — saw / heard / signs (tracks & scat), count, date & time.
- **Photos** (auto-resized), **GPS location** (optional), and free-text notes per sighting.
- **Your log** — every encounter, grouped by day, with running stats (encounters, unique
  species, categories). Export everything to a JSON file anytime.
- **Private & offline** — all data is stored on your device (IndexedDB); nothing is sent
  anywhere. No account, no tracking, no network required after first load.

---

## 📱 Testing it on your iPhone

Because it's a static site, the quickest way to get a live link is **GitHub Pages**:

1. Push this branch (already done if you're reading this in a PR).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (e.g. `claude/ontario-wildlife-log-hf9i94` to preview, or `main` once
   merged) and folder **`/ (root)`**, then **Save**.
5. Wait ~1 minute, then open the published URL (something like
   `https://<your-username>.github.io/on-wildlife/`) in **Safari on your iPhone**.
6. Tap the **Share** button → **Add to Home Screen**. Launch it from the new icon — it
   now runs fullscreen like a native app.

### Running locally

```bash
# from the project root
python3 -m http.server 8137
# then open http://localhost:8137 in a browser
```

A local server is needed (rather than opening the file directly) so the service worker
and data scripts load correctly.

---

## 🗂 Project structure

```
index.html              App shell + iOS/PWA meta tags
styles.css              iOS design system (light/dark, components)
app.js                  SPA: hash routing, IndexedDB journal, all screens
data/
  categories.js         Category & subcategory metadata (+ "coming soon")
  species.js            The Ontario species database
manifest.webmanifest    PWA manifest (name, icons, theme, standalone)
service-worker.js       Offline caching of the app shell
icons/                  App icons (SVG master + PNGs incl. apple-touch-icon)
```

No build step and no dependencies — it's plain HTML/CSS/JS that runs anywhere.

## 🧬 Species data model

Each record in `data/species.js` follows this shape:

```js
{
  id, name, sci,          // ids + common & scientific names
  cat, sub,               // category / subcategory (see categories.js)
  emoji, size, habitat,
  tips, fact,             // how to identify + a fun fact
  seasons, activity, seen,// when/how it's observed; how common it is
  status, atRisk, caution,// conservation status; at-risk flag; safety note
  region,                 // where in Ontario
  angling                 // fish only: a bait/method tip
}
```

Conservation statuses reflect Ontario (SARO/COSEWIC) context; anything Special
Concern / Threatened / Endangered is flagged as **at risk** in the guide.

## 🛣 Roadmap

- Plants & wildflowers, trees, insects & butterflies, and fungi guides.
- Optional map view of your logged encounters.
- iCloud/file sync and sharing a sighting.
- A native App Store build (the PWA can be wrapped, or rebuilt in SwiftUI).
