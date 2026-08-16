# 🐾 Ontario Wildlife Log

A simple, **iOS-styled** field journal for logging the wildlife you find across Ontario:
mammals, birds, reptiles, amphibians, fish, trees, plants, insects and fungi. Spot a moose,
hear a spring peeper, catch a walleye, find a turtle crossing the road, or identify a
dangerous plant, and log it in a couple of taps.

It is a **Progressive Web App (PWA)**, so there is nothing to install from an app store.
Open it in Safari on your iPhone and tap **Add to Home Screen**. It then launches
fullscreen with its own icon, feels native, and works offline.

> **Status:** 778 fact-checked Ontario species across 9 categories. Optional community
> data pooling through a deployable backend.

---

## ✨ What it does

- **iOS look and feel.** San Francisco system font, grouped inset lists, large-title
  navigation bars, a translucent bottom tab bar, iOS switches, steppers and segmented
  controls, full light and dark mode, and safe-area handling for the notch and home
  indicator.
- **9 categories, then subcategories, then species.** Mammals, Birds, Reptiles,
  Amphibians, Fish, Trees, Plants, Insects and Fungi. For example, Reptiles, Turtles,
  Blanding's Turtle.
- **A field guide** to Ontario wildlife and flora with ID tips, habitat, best seasons,
  conservation status (Species at Risk are flagged), safety cautions (the venomous
  massasauga, poison ivy, giant hogweed), and facts.
- **Safety and Alerts hub.** Bear and hazard reports, plus every dangerous, venomous
  or poisonous species and plant in one place, with the ticks, bear, dangerous-plants
  and roads guides.
- **Fast logging** with details that adapt to what you are recording:
  - 🎣 **Fishing.** Caught or seen, length, weight, bait or lure, water body, kept or
    released.
  - 🦅 **Birding.** Count, behaviour, seen or heard.
  - 🐢 **Any wildlife.** Saw, heard, or signs (tracks and scat), count, date and time.
- **🐻 Report a Bear.** A quick bear-sighting flow with black or polar type, number,
  cubs and behaviour, and a prominent **Bear Wise** banner (911 for an immediate threat,
  or the 1-866-514-2327 line for non-emergency problems). That is the real reporting
  channel.
- **⚠️ Report a Hazard.** Wildlife on the road, roadkill, turtle crossings, construction,
  flooding, ice, fallen trees, tick hotspots and more.
- **🗺 Map.** See your located sightings, bear reports and hazards as pins (built on
  Leaflet and OpenStreetMap). Filter by wildlife, bears or hazards, and drop a pin by
  tapping the map or using GPS.
- **📚 Learn and Safety.** Field-guide-style articles: ticks and Lyme disease, bear
  safety, dangerous plants, wildlife on roads, and helping Ontario's wildlife. Each one
  links out to official Ontario and Canada sources. Every species page links to
  iNaturalist, eBird and Ontario resources, and Species-at-Risk info.
- **🎣 Fishing and 🦅 Birding modes.** The home screen switches into a fishing version
  (Log a Fish, with fish handling and release, protecting the water, is-it-safe-to-eat,
  boating safety and a licence link) or a birding version (how to birdwatch, trail
  etiquette and safety).
- **🚫 Invasive species** section, with Clean, Drain, Dry and how to report.
- **🏅 Collectible badges** (naturalist achievements, plus a secret one) and a **📊 Stats**
  screen with honest guide-completion progress.
- **🔒 Privacy and consent.** A first-run welcome that states your data is private and
  on-device, a Privacy screen, a sharing-consent toggle (off by default, and it asks
  before anything is shared), and geoprivacy that obscures Species-at-Risk locations in
  exports.
- **📤 Shareable sighting cards** (a canvas image sent through the native share sheet).
- **🌗 Appearance.** In-app Light, Dark or Auto theme toggle. Pinch-zoom and OS text
  scaling are respected, with visible keyboard focus (WCAG and AODA-minded).
- **🌍 Community (optional).** Connect a deployable [backend](server/) to pool
  pseudonymized sightings: seen near you this week, recent bear and hazard activity, and
  province-wide totals. It is off until you connect a server and turn on sharing.
  Coordinates are coarsened, and times blurred, before they leave the phone, and again
  at the server. A secret ownership token means only you can delete your shared data.
- **📅 Timely nudges.** A season-aware "This month in Ontario" card with a gentle "you
  haven't logged one yet" prompt. It is deterministic and offline, with no dark patterns.
- **🖼 Real photos.** Species pages pull an openly-licensed (Creative Commons) photo from
  iNaturalist with attribution when online, and fall back to the emoji offline. These are
  not Lone Pine's copyrighted images. They are a legal, real-photo layer.
- **Photos** (auto-resized), **GPS location** (optional), and notes per sighting.
- **Your log.** Every encounter, grouped by day, with running stats. Export everything
  (sightings and hazards) to a JSON file anytime.
- **Private and offline.** Your data is stored on your device (IndexedDB). No account,
  no tracking. Map tiles need a connection, and everything else works offline.

---

## 📱 Testing it on your iPhone

Because it is a static site, the quickest way to get a live link is **GitHub Pages**:

1. Push this branch (already done if you are reading this in a PR).
2. In the repo, go to **Settings, Pages**.
3. Under **Build and deployment, Source**, choose **Deploy from a branch**.
4. Pick the branch (for example `claude/ontario-wildlife-log-hf9i94` to preview, or
   `main` once merged) and folder **`/ (root)`**, then **Save**.
5. Wait about a minute, then open the published URL (something like
   `https://<your-username>.github.io/on-wildlife/`) in **Safari on your iPhone**.
6. Tap the **Share** button, then **Add to Home Screen**. Launch it from the new icon.
   It now runs fullscreen like a native app.

### Running locally

```bash
# from the project root
python3 -m http.server 8137
# then open http://localhost:8137 in a browser
```

A local server is needed, rather than opening the file directly, so the service worker
and data scripts load correctly.

---

## 🗂 Project structure

```
index.html              App shell and iOS/PWA meta tags
assets/ios.css          iOS design system (core tokens + app styles)
app.js                  SPA: hash routing, IndexedDB journal, map, all screens
data/
  categories.js         Category and subcategory metadata
  species.js            The Ontario species database (778 species)
  learn.js              Educational articles, resource links, hazard types
  badges.js             Collectible naturalist badge definitions
manifest.webmanifest    PWA manifest (name, icons, theme, standalone)
service-worker.js       Offline caching and Web Push handlers
vendor/leaflet/         Vendored Leaflet mapping library (offline-capable)
icons/                  App icons (SVG master and PNGs incl. apple-touch-icon)
server/                 Optional community backend (zero-dependency Node) and its README
tests/                  CI validation and headless UI test suites
```

## 📲 iOS support and the native-feature question

This is a web app (PWA), which shapes what iOS features are possible:

- **Works today on iOS:** installable fullscreen app (Add to Home Screen), the native
  share sheet (send a sighting card straight to Messages or anywhere), standalone
  status-bar chrome, light and dark, offline, and Web Push notifications (iOS 16.4 and
  up once installed). **Enable nearby alerts** on the Community screen asks for
  permission and subscribes through the service worker, which renders incoming pushes.
  The community server holds the subscriptions, and once you give it VAPID keys it is
  where nearby bear and hazard alerts are sent from. See `server/README`.
- **Not possible from a web app:** Live Activities and Home-Screen Widgets are
  native-only (ActivityKit and WidgetKit in Swift). Delivering those means shipping a
  native SwiftUI app, or a Capacitor wrapper with native widget and Live-Activity
  modules. The data model and design here carry straight over when that is the goal.

No build step and no dependencies. It is plain HTML, CSS and JS that runs anywhere.

## 🧬 Species data model

Each record in `data/species.js` follows this shape:

```js
{
  id, name, sci,          // ids, common and scientific names
  cat, sub,               // category and subcategory (see categories.js)
  emoji, size, habitat,
  tips, fact,             // how to identify it, and a fact
  seasons, activity, seen,// when and how it is observed, how common it is
  status, atRisk, caution,// conservation status, at-risk flag, safety note
  region,                 // where in Ontario
  angling                 // fish only: a bait or method tip
}
```

Conservation statuses reflect Ontario (SARO and COSEWIC) context. Anything Special
Concern, Threatened or Endangered is flagged as **at risk** in the guide.

## 🌍 Community data and conservation

Consistent records of what you see, and where and when, are the backbone of wildlife
monitoring. On its own the app is **private and offline**, and your data stays on your
device. The more people log wildlife, the more useful the picture gets: turtle-crossing
hotspots, recent bear activity, local trends.

The shared community layer is built. It is an optional, deployable [backend](server/)
that pools pseudonymized sightings, coarsens coordinates before they leave the phone and
again at the server, and lets only you delete your own data. It is off until you connect
a server and turn on sharing. The app also points to the channels that already reach
conservation databases: **iNaturalist** and **eBird** for observations, **Bear Wise**
for bear problems, and Ontario's **Species at Risk** reporting. You can export your data
anytime, so it is never locked in.

## 🛣 Roadmap

- **Web Push delivery.** The subscribe side is wired. What remains is a VAPID key pair
  and a sender in the community server, so nearby bear and hazard reports push to
  opted-in phones (iOS 16.4 and up, installed PWAs).
- **Richer imagery.** Multiple photos and range maps per species (through iNaturalist or
  GBIF), and French and plain-language presets for AODA-grade accessibility.
- **Native SwiftUI build.** For real Live Activities and Home-Screen Widgets, such as a
  "recent bear activity near you" widget, which a web app cannot provide.
