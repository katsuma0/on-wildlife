# Ontario Wildlife Log — Features

A simple, iOS-styled Progressive Web App for logging the wildlife, fish, and plants
you find across Ontario. Everything below is built and working today.

## Logging

- **Log any encounter** in a couple of taps — pick a species (or "name it later"),
  set saw / heard / signs, a count, and the date & time.
- **Fishing mode** — caught or seen, length, weight, bait/lure, water body, kept or
  released.
- **Birding mode** — count, behaviour, seen or heard.
- **Photos** (auto-resized), **GPS location** (optional), and free-text notes.
- **Edit any encounter** afterward, or delete it.
- **Report a Bear** — black/polar, number, cubs, behaviour, with the real Bear Wise
  reporting numbers.
- **Report a Hazard** — wildlife on the road, roadkill, turtle crossings,
  construction, flooding, ice, fallen trees, tick hotspots, and more.

## The field guide

- **382 fact-checked Ontario species across 9 categories** — Mammals, Birds,
  Reptiles, Amphibians, Fish, Trees, Plants, Insects, and Fungi — each with ID tips,
  habitat, best seasons, a fun fact, conservation status, and safety cautions.
- **Species at Risk** are flagged (SARO/COSEWIC context).
- **Full-text search** and category → subcategory → species browsing.
- **Real photos** — an openly-licensed (Creative Commons) photo from iNaturalist per
  species when you turn that on; the built-in illustration otherwise.

## Safety & learning

- **Safety & Alerts hub** — your bear/hazard reports plus every dangerous, venomous,
  or poisonous species and plant in one place.
- **Lone-Pine-style articles** — Ticks & Lyme disease, Bear safety, Dangerous plants,
  Wildlife on roads, and Help Ontario's wildlife, each linking to official sources.
- **Fungi safety** — every edible mushroom names its deadly look-alikes, and toxic
  species spell out the toxin and how fast it acts.
- **Invasive species** section — categorized, with Clean·Drain·Dry and how to report.

## Map

- Your located sightings, bear reports, and hazards as pins (Leaflet + OpenStreetMap).
- Filter by wildlife / bears / hazards; drop a pin by tapping the map, using GPS, or
  (keyboard) "place at map centre."

## Community (optional, off by default)

- Connect a deployable, zero-dependency backend to pool sightings: "seen near you
  this week," recent bear/hazard activity, and province-wide totals.
- **Private by design** — nothing is shared until you connect a server *and* turn
  sharing on. Coordinates are coarsened (~5 km, ~22 km for at-risk species and bears)
  and times blurred **before they leave your phone**, and again at the server.
- **You own your data** — a secret device token means only you can delete what you've
  shared; you can reset your device id anytime.

## Engagement (no dark patterns)

- **Collectible badges** for genuine naturalist milestones, plus one secret badge.
- **Stats** screen with honest "guide completion" progress.
- **"This month in Ontario"** seasonal card with a gentle nudge.
- **Shareable sighting cards** (a canvas image via the native share sheet).

## iOS & PWA

- **Add to Home Screen** to run fullscreen and offline, with its own icon.
- **Native share sheet**, light/dark mode, safe-area handling, pinch-zoom and OS
  text scaling.
- **Web Push** — "Enable nearby alerts" subscribes through the service worker for
  bear/hazard notifications (iOS 16.4+ installed; needs the server's push keys).

## Privacy & accessibility

- All your data is stored **on your device** (IndexedDB); no accounts, ads, or
  trackers. Export everything to a file, or delete it, anytime.
- Built to **WCAG 2.1 AA / AODA** — keyboard operable, screen-reader labelled,
  focus-managed modals, sufficient contrast, and non-colour status cues.

## Under the hood

- **Zero-dependency app** — plain HTML/CSS/JS, no build step.
- **Anomaly-detection demo** showing how crowdsourced sightings can be vetted.
- **CI** runs syntax, data-integrity, a live server round-trip, and headless UI
  tests on every push (see `tests/`).
