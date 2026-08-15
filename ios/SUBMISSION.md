# Submitting on-wildlife to the App Store

Everything App Store Connect will ask for, with the answer already worked out.
Written against the App Review Guidelines as published on 15 August 2026.

## URLs, which must be live before you submit

Guideline 2.1(a) rejects placeholder text and empty websites, so these have to
resolve to real pages, not stubs.

| App Store Connect field | URL |
| --- | --- |
| Privacy Policy URL (required) | https://katsuma.ca/privacy.html |
| Support URL (required) | https://katsuma.ca/support.html |
| Marketing URL (optional) | https://katsuma.ca/wildlife.html |

All three are also reachable inside the app, under More, then Legal. Guideline
5.1.1 asks for the privacy policy in both places, not just the listing.

## App Privacy, the nutrition label

In App Store Connect, App Privacy, the honest answer for every question is
**"Data Not Collected"**. Before you tick that, here is the reasoning, because
the form asks about data collected *by the developer*, and this app collects
none.

- There is no account, no analytics SDK, no advertising SDK and no tracking.
- Everything a person logs is written to storage inside the app container and
  is never transmitted. I never receive it and cannot read it.
- The optional community layer ships switched off with no server address. It
  only sends anything if the user pastes in the address of a server they run
  themselves, and then it is their server, not mine. Nothing reaches me.
- Map tiles and reference photos are ordinary third-party requests. They carry
  an IP address the way any web request does, and are not linked to a user or
  used to track. Apple's own guidance treats this as not-collected.

Answer **No** to App Tracking Transparency. Nothing is tracked, no IDFA is
requested, and no `NSUserTrackingUsageDescription` is needed.

## Permissions, and the strings already in the project

Set in `OnWildlife.xcodeproj/project.pbxproj` as `INFOPLIST_KEY_*` entries, so
they ship without a hand-edited Info.plist.

| Key | String |
| --- | --- |
| `NSLocationWhenInUseUsageDescription` | "Your location is used to tag the sightings you log and to show nearby reports. It stays on your phone unless you choose to share it." |
| `NSCameraUsageDescription` | "Attach a photo to a sighting in your log." |
| `NSPhotoLibraryUsageDescription` | "Pick a photo from your library to attach to a sighting." |
| `ITSAppUsesNonExemptEncryption` | `NO` |

There is no background location, no always-on location, and no location
request until the user taps a control that needs one. Guideline 5.1.5 is
satisfied by that alone, and every screen still works if the person declines.

## Guideline 4.2, minimum functionality

This is the guideline most likely to be raised against any app built on a web
view, so answer it in the review notes before it is asked. Paste this into App
Review Information, Notes:

> This is not a web view onto a website. The entire app, including a guide to
> 778 Ontario species with long-form accounts, the fishing regulations, and the
> user's own journal, is bundled in the binary and works with the device in
> airplane mode. There is no server, no account and no network dependency for
> any feature except optional map tiles and optional reference photos. The app
> uses the camera, Location Services, haptics and the iOS share sheet. Nothing
> in it is a link to a website.
>
> To test offline, which is the primary use case: launch the app, put the
> device in airplane mode, then browse the guide, open any species, log a
> sighting with a photo, and read the fishing seasons. All of it works.

## Guideline 1.2, other people's content

The app has an optional community layer, off by default, with no server
included. Add this to the review notes as well:

> The Community screen is off by default and has no server. It does nothing
> until a user enters the address of a server they run themselves. Nothing in
> the feed is free text: it displays species ids, hazard type values and times
> blurred to the hour, so there is no field in which a person can write
> anything. Even so, every item in the feed carries a control to hide it and to
> report it by email, hidden items are filtered out on the device, and the
> Terms of use, which state what may not be posted, are linked from the screen
> itself. Published contact information is at https://katsuma.ca/support.html.

## Age rating

Answer every content question **None**. There is no violence, no simulated
gambling, no mature themes, no unrestricted web access and no user-generated
content in the shipped configuration. Expect 4+.

## Account deletion, guideline 5.1.1(v)

Not applicable: the app supports no account creation, so no in-app account
deletion is required. Data deletion does exist anyway, under More, then Your
data, then Reset all data.

## Third-party material to declare

- Map images: CARTO, rendering OpenStreetMap data, © OpenStreetMap
  contributors. Attribution is shown on the map and in More.
- Reference photos: iNaturalist, under each contributor's licence, credited on
  the photo. Off by default in the sense that they can be switched off in More.
- Fishing zone boundaries and regulation summaries: Government of Ontario open
  data.
- Leaflet, BSD 2-Clause, vendored in `vendor/leaflet/`.

None of these are Apple marks, and the app claims no affiliation with Ontario
Parks, the Government of Ontario, Parks Canada or Apple. That line appears in
More, in the privacy policy and in the terms.

## Before you press submit

- [ ] The three URLs above load and are not placeholders.
- [ ] Screenshots for 6.9 inch and 6.5 inch iPhone. iPad screenshots too, since
      `TARGETED_DEVICE_FAMILY` is `1,2`. Drop iPad from the target instead if
      you would rather not maintain them.
- [ ] `MARKETING_VERSION` in the project matches the version in the app's More
      screen. They are independent numbers and drift easily.
- [ ] Icon is 1024x1024 with no alpha and no rounded corners applied by you.
- [ ] Tested on a real device in airplane mode, per the note above.
- [ ] Export compliance: already answered by `ITSAppUsesNonExemptEncryption =
      NO`, so App Store Connect will not ask again.

## Listing copy

**Name:** on-wildlife

**Subtitle:** Ontario field guide and journal

**Promotional text:** Look up what you just saw, read the long account, and
keep a record of it. Works with no signal.

**Description:**

> on-wildlife is a field guide and a journal for the Ontario outdoors. It
> covers 778 species: mammals, birds, reptiles, amphibians, fish, trees,
> plants, insects and fungi. Look one up, read a real account of it rather than
> a caption, and log what you saw.
>
> It works with no signal. The whole guide is on your phone, so it is there at
> the back of a park where there is no service, which is where you need it.
>
> Your journal is yours. Every sighting, note and photo is stored on your phone
> only. There is no account, no advertising and no tracking, and nothing you
> log is sent anywhere. You can export the whole thing to a file at any time.
>
> Fishing is built in. Every fish page carries its season and limits for your
> zone, and the fishing zones are on the map.
>
> Also in the app: a map of what you have seen and where, bear safety guidance,
> species at risk, what to look for this month, and French.
>
> Not affiliated with Ontario Parks or the Government of Ontario. Check the
> current fishing regulations before you fish.

**Keywords:** ontario,wildlife,field guide,birds,fish,nature,journal,species,
offline,camping,birding,identify

**Category:** Reference. Secondary: Travel.
