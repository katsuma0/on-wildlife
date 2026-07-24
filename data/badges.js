/* Collectible naturalist badges. Each badge's test() runs against a small
   context object (built in app.js from the user's log). Nature-themed, earned
   through genuine use — plus one secret "easter egg" badge. */
window.BADGES = [
  { id: 'first', name: 'First Steps', emoji: '\u{1F331}', desc: 'Log your first encounter.', test: function (c) { return c.total >= 1; } },
  { id: 'five', name: 'Getting Started', emoji: '\u{1F50D}', desc: 'Log 5 encounters.', test: function (c) { return c.total >= 5; } },
  { id: 'journal', name: 'Field Journalist', emoji: '\u{1F4D3}', desc: 'Log 25 encounters.', test: function (c) { return c.total >= 25; } },
  { id: 'naturalist', name: 'Naturalist', emoji: '\u{1F9ED}', desc: 'Log 100 encounters.', test: function (c) { return c.total >= 100; } },
  { id: 'species10', name: 'Collector', emoji: '\u{1F43E}', desc: 'Log 10 different species.', test: function (c) { return c.species >= 10; } },
  { id: 'species25', name: 'Seasoned Spotter', emoji: '\u{1F396}️', desc: 'Log 25 different species.', test: function (c) { return c.species >= 25; } },
  { id: 'species50', name: 'Ontario Expert', emoji: '\u{1F31F}', desc: 'Log 50 different species.', test: function (c) { return c.species >= 50; } },
  { id: 'allcats', name: 'Well-Rounded', emoji: '\u{1F308}', desc: 'Log a species in all nine categories.', test: function (c) { return c.catsN >= 9; } },
  { id: 'angler', name: 'Angler', emoji: '\u{1F3A3}', desc: 'Log 5 fish.', test: function (c) { return c.fish >= 5; } },
  { id: 'master-angler', name: 'Master Angler', emoji: '\u{1F41F}', desc: 'Log 15 fish.', test: function (c) { return c.fish >= 15; } },
  { id: 'release', name: 'Catch & Release Hero', emoji: '\u{267B}️', desc: 'Release 10 caught fish.', test: function (c) { return c.released >= 10; } },
  { id: 'birder', name: 'Birder', emoji: '\u{1F985}', desc: 'Log 10 birds.', test: function (c) { return c.birds >= 10; } },
  { id: 'early-bird', name: 'Early Bird', emoji: '\u{1F305}', desc: 'Log a bird before 7 a.m.', test: function (c) { return c.earlyBird; } },
  { id: 'herper', name: 'Herper', emoji: '\u{1F40D}', desc: 'Log a reptile and an amphibian.', test: function (c) { return c.reptiles >= 1 && c.amph >= 1; } },
  { id: 'turtle', name: 'Turtle Guardian', emoji: '\u{1F422}', desc: 'Log a turtle.', test: function (c) { return c.turtle; } },
  { id: 'botanist', name: 'Botanist', emoji: '\u{1F333}', desc: 'Log 10 trees or plants.', test: function (c) { return c.flora >= 10; } },
  { id: 'guardian', name: 'At-Risk Guardian', emoji: '\u{2727}', desc: 'Log a Species at Risk.', test: function (c) { return c.atRisk; } },
  { id: 'night-owl', name: 'Night Owl', emoji: '\u{1F989}', desc: 'Log something after 10 p.m.', test: function (c) { return c.nightOwl; } },
  { id: 'seasons', name: 'Four Seasons', emoji: '\u{1F341}', desc: 'Log in all four seasons.', test: function (c) { return c.seasons >= 4; } },
  { id: 'mapper', name: 'Cartographer', emoji: '\u{1F4CD}', desc: 'Log 5 sightings with a location.', test: function (c) { return c.located >= 5; } },
  { id: 'neighbour', name: 'Good Neighbour', emoji: '\u{1F6A8}', desc: 'File a bear or hazard report.', test: function (c) { return c.reports >= 1; } },
  { id: 'emblems', name: 'Provincial Emblems', emoji: '\u{1F341}', secret: true, desc: 'Log Ontario’s emblems: the Common Loon, White Trillium and Eastern White Pine.', test: function (c) { return c.emblems >= 3; } },
];
