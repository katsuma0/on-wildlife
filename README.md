# 🐾 Ontario Wildlife Log

A simple, **iOS-styled** field journal for logging the wildlife you encounter across
Ontario — mammals, birds, reptiles, amphibians, fish, **trees and plants**. Spot a moose,
hear a spring peeper, catch a walleye, find a turtle crossing the road, or identify a
dangerous plant? Log it in a couple of taps.

It's built as a **Progressive Web App (PWA)**, so there's nothing to install from an app
store: open it in Safari on your iPhone and tap **Add to Home Screen**. It then launches
fullscreen with its own icon, feels native, and works offline.

> **Status:** 326 fact-checked Ontario species across 9 categories (mammals, birds,
> reptiles, amphibians, fish, trees, plants, **insects & fungi**). Optional **community**
> data pooling via a deployable backend.

---

## ✨ Features

- **iOS look & feel** — San Francisco system font, grouped inset lists, large-title
  navigation bars, a translucent bottom tab bar, iOS switches/steppers/segmented
  controls, full **light & dark mode**, and safe-area handling for notch/home-indicator.
- **9 categories → subcategories → species** — Mammals, Birds, Reptiles, Amphibians, Fish,
  **Trees** (conifers & broadleaf), **Plants** (wildflowers, shrubs & berries, ferns &
  grasses, and dangerous & invasive), **Insects** and **Fungi**. e.g. Reptiles › Turtles ›
  Blanding's Turtle.
- **A field guide** to Ontario wildlife & flora with ID tips, habitat, best seasons,
  conservation status (Species at Risk are flagged), safety cautions (e.g. the venomous
  massasauga, poison ivy, giant hogweed), and facts.
- **⚠️ Safety & Alerts hub** — bear & hazard reports plus every dangerous/venomous/poisonous
  species and plant in one place, with the ticks, bear, dangerous-plants and roads guides.
- **Fast logging** with details that adapt to what you're recording:
  - 🎣 **Fishing** — caught or seen, length, weight, bait/lure, water body, kept/released.
  - 🦅 **Birding** — count, behaviour, seen or heard.
  - 🐢 **Any wildlife** — saw / heard / signs (tracks & scat), count, date & time.
- **🐻 Report a Bear** — a quick bear-sighting flow with black/polar type, number, cubs
  and behaviour, and a prominent **Bear Wise** banner (911 for an immediate threat, or the
  1-866-514-2327 line for non-emergency problems) — the real reporting channel.
- **⚠️ Report a Hazard** — wildlife on the road, roadkill, turtle crossings, construction,
  flooding, ice, fallen trees, tick hotspots and more.
- **🗺 Map** — see your located sightings, bear reports and hazards as pins (built on
  Leaflet + OpenStreetMap). Filter by wildlife / bears / hazards, and drop a pin by tapping
  the map or using GPS.
- **📚 Learn & Safety** — Lone-Pine-style educational articles: **Ticks & Lyme disease**
  (identify, prevent, remove, and when to see a doctor), **Bear safety**, **Dangerous
  plants** (poison ivy, wild parsnip, giant hogweed, water hemlock), **Wildlife on roads**,
  and **Help Ontario's wildlife** — each linking out to official Ontario/Canada sources.
  Every species page links to iNaturalist (photos), eBird/Ontario resources, and
  Species-at-Risk info.
- **🎣 Fishing & 🦅 Birding modes** — the home screen switches into a fishing "water" version
  (Log a Fish, with fish handling/release, protect-the-water, is-it-safe-to-eat, boating
  safety and a licence link) or a birding version (how to birdwatch, trail etiquette & safety).
- **🚫 Invasive species** section — categorized, with Clean·Drain·Dry and how to report.
- **🏅 Collectible badges** (naturalist achievements, plus a secret one) and a **📊 Stats**
  screen with honest "guide completion" progress (X of 326 species).
- **🔒 Privacy & consent** — a first-run welcome that states data is private and on-device;
  a Privacy screen; a conservation-sharing consent toggle (off by default, asks before
  anything is shared); and **geoprivacy** that obscures Species-at-Risk locations in exports.
- **📤 Shareable sighting cards** (canvas image via the native share sheet) for organic reach.
- **🌗 Appearance** — in-app Light / Dark / Auto theme toggle; **pinch-zoom and OS text
  scaling** respected, with visible keyboard focus (WCAG / AODA-minded).
- **🌍 Community (optional)** — connect a deployable [backend](server/) to pool anonymized
  sightings: "seen near you this week", recent bear/hazard activity, and province-wide totals.
  Off until you connect a server and turn on sharing; at-risk locations are coarsened first.
- **📅 Timely nudges** — a season-aware "This month in Ontario" card with a gentle "you haven't
  logged one yet" prompt (deterministic, offline, no dark patterns).
- **🖼 Real photos** — species pages pull an **openly-licensed (CC) photo from iNaturalist**
  with attribution when online, falling back to the emoji offline. (These are not Lone Pine's
  copyrighted images — a legal, real-photo layer.)
- **🧪 Data reliability (demo)** — an anomaly-detection model (robust z-scores over behavioural
  signals — never rarity — plus plausibility rules) run over simulated contributors, including
  a deliberately fake "sham" account, showing how crowdsourced sightings can be vetted.
- **Photos** (auto-resized), **GPS location** (optional), and free-text notes per sighting.
- **Your log** — every encounter, grouped by day, with running stats (encounters, unique
  species, categories). Export everything (sightings + hazards) to a JSON file anytime.
- **Private & offline** — all data is stored on your device (IndexedDB); nothing is sent
  anywhere. No account, no tracking. (Map tiles need a connection; everything else works
  offline.)

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
app.js                  SPA: hash routing, IndexedDB journal, map, all screens
data/
  categories.js         Category & subcategory metadata (+ "coming soon")
  species.js            The Ontario species database (326 species)
  learn.js              Educational articles, curated resource links, hazard types
  trust.js              Anomaly-detection demo: synthetic data + statistical model
  badges.js             Collectible naturalist badge definitions
manifest.webmanifest    PWA manifest (name, icons, theme, standalone)
service-worker.js       Offline caching + Web Push handlers
vendor/leaflet/         Vendored Leaflet mapping library (offline-capable)
icons/                  App icons (SVG master + PNGs incl. apple-touch-icon)
server/                 Optional community backend (zero-dependency Node) + its README
```

## 📲 iOS support & the native-feature question

This is a web app (PWA), which shapes what iOS features are possible:

- **Works today on iOS:** installable fullscreen app (Add to Home Screen), the **native
  share sheet** (send a sighting card straight to Messages/anywhere), standalone status-bar
  chrome, light/dark, offline, and **Web Push notifications** (iOS 16.4+ once installed) —
  the service worker already renders pushes, and the community server is where nearby
  bear/hazard alerts would be sent from (needs VAPID keys — see `server/README`).
- **Not possible from a web app:** **Live Activities** and **Home-Screen Widgets** are
  native-only (ActivityKit / WidgetKit in Swift). Delivering those means shipping a native
  **SwiftUI** app (or a Capacitor wrapper with native widget/Live-Activity modules). The
  data model and design here carry straight over when that's the goal.

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

## 🌍 Community data & conservation

Consistent records of what you see, where and when are the backbone of wildlife
monitoring. Today the app is **private and offline** — your data stays on your device.
The vision is that the more people log wildlife, the more useful the picture becomes:
turtle-crossing hotspots, recent bear activity, local trends.

A true shared/community layer (and push "alerts") needs a secure backend server, so
it's on the roadmap. In the meantime the app points to the channels that already reach
conservation databases — **iNaturalist** and **eBird** for observations, **Bear Wise**
for bear problems, and Ontario's **Species at Risk** reporting — and can export your data
so it's never locked in.

## 🛣 Roadmap

- **Web Push delivery** — wire VAPID keys + a sender into the community server so nearby
  bear/hazard reports push to opted-in phones (iOS 16.4+ installed PWAs).
- **Richer imagery** — multiple photos + range maps per species (via iNaturalist/GBIF),
  and French + plain-language presets for AODA-grade accessibility.
- **Native SwiftUI build** — for true **Live Activities and Home-Screen Widgets** (e.g. a
  "recent bear activity near you" widget), which a web app can't provide.
- Deeper community: seasonal BioBlitz / classroom "pass-the-phone" group mode, and an
  Ontario Parks "park mode" with seasonally-timed conservation missions.
