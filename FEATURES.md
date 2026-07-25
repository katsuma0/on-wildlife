# Ontario Wildlife Log, Features

A simple iOS-styled Progressive Web App for logging the wildlife, fish, and plants
you find across Ontario. Everything below is built and working.

## Logging

- Log an encounter in a couple of taps. Pick a species, or name it later. Set saw,
  heard, or signs, a count, and the date and time.
- Fishing mode: caught or seen, length, weight, bait or lure, water body, kept or
  released.
- Birding mode: count, behaviour, seen or heard.
- Photos (auto-resized), GPS location (optional), and notes.
- Edit any encounter afterward, or delete it.
- Report a Bear: black or polar, number, cubs, behaviour, with the real Bear Wise
  reporting numbers.
- Report a Hazard: wildlife on the road, roadkill, turtle crossings, construction,
  flooding, ice, fallen trees, tick hotspots.

## The field guide

- 580 fact-checked Ontario species across 9 categories: Mammals, Birds, Reptiles,
  Amphibians, Fish, Trees, Plants, Insects, and Fungi. Each has ID tips, habitat,
  best seasons, a fact, conservation status, and safety cautions.
- Species at Risk are flagged, using SARO and COSEWIC context.
- Full-text search, and category to subcategory to species browsing.
- Real photos: an openly-licensed (Creative Commons) photo from iNaturalist per
  species when you turn that on. The built-in illustration otherwise.

## Safety and learning

- Safety and Alerts hub: your bear and hazard reports, plus every dangerous,
  venomous, or poisonous species and plant, in one place.
- Field-guide-style articles: ticks and Lyme disease, bear safety, dangerous
  plants, wildlife on roads, and helping Ontario wildlife. Each links to official
  sources.
- Fungi safety: every edible mushroom names its deadly look-alikes, and toxic
  species spell out the toxin and how fast it acts.
- Invasive species section, with Clean, Drain, Dry and how to report.

## Map

- Your located sightings, bear reports, and hazards as pins (Leaflet plus
  OpenStreetMap).
- Filter by wildlife, bears, or hazards. Drop a pin by tapping the map, using GPS,
  or placing at map centre with a keyboard.

## Community (optional, off by default)

- Connect a deployable, zero-dependency backend to pool sightings: seen near you
  this week, recent bear and hazard activity, and province-wide totals.
- Nothing is shared until you connect a server and turn sharing on. Coordinates are
  coarsened, about 5 km normally and about 22 km for at-risk species and bears, and
  times are blurred to the hour before anything leaves your phone. The server
  coarsens again on the way in.
- A secret device token means only you can delete what you have shared. You can
  reset your device id anytime.

## Engagement, without dark patterns

- Collectible badges for genuine naturalist milestones, plus one secret badge.
- A Stats screen with honest guide-completion progress.
- A season-aware "This month in Ontario" card with a gentle nudge.
- Shareable sighting cards, drawn to a canvas image and sent through the native
  share sheet.

## iOS and PWA

- Add to Home Screen to run fullscreen and offline, with its own icon.
- Native share sheet, light and dark mode, safe-area handling, pinch-zoom, and OS
  text scaling.
- Web Push: "Enable nearby alerts" subscribes through the service worker for bear
  and hazard notifications on iOS 16.4 and up once installed. Needs the server's
  push keys.

## Privacy and accessibility

- All your data is stored on your device (IndexedDB). No accounts, ads, or
  trackers. Export everything to a file, or delete it, anytime.
- Built to WCAG 2.1 AA and AODA: keyboard operable, screen-reader labelled,
  focus-managed modals, sufficient contrast, and status cues that do not rely on
  colour alone.

## Under the hood

- The app is zero-dependency plain HTML, CSS, and JS, with no build step.
- An anomaly-detection demo shows how crowdsourced sightings can be vetted.
- CI runs syntax, data-integrity, a live server round-trip, and headless UI tests
  on every push. See `tests/`.
