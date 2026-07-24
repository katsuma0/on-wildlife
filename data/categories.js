/* Category + subcategory metadata for the Ontario Wildlife Log.
   `species.js` references these ids in each record's `cat` / `sub` fields. */
window.CATEGORIES = [
  {
    id: 'mammals',
    name: 'Mammals',
    emoji: '\u{1F98C}',
    color: '#8D6E63',
    blurb: 'Moose to muskrats',
    subs: [
      { id: 'large-mammals', name: 'Large Mammals', emoji: '\u{1F98C}' },
      { id: 'carnivores', name: 'Carnivores', emoji: '\u{1F98A}' },
      { id: 'small-mammals', name: 'Small Mammals & Rodents', emoji: '\u{1F43F}️' },
      { id: 'bats', name: 'Bats', emoji: '\u{1F987}' },
    ],
  },
  {
    id: 'birds',
    name: 'Birds',
    emoji: '\u{1F985}',
    color: '#1E88E5',
    blurb: 'For the birdwatchers',
    subs: [
      { id: 'raptors-owls', name: 'Raptors & Owls', emoji: '\u{1F989}' },
      { id: 'waterfowl', name: 'Waterfowl & Water Birds', emoji: '\u{1F986}' },
      { id: 'songbirds', name: 'Songbirds', emoji: '\u{1F426}' },
      { id: 'woodpeckers', name: 'Woodpeckers', emoji: '\u{1F426}' },
      { id: 'game-birds', name: 'Game Birds', emoji: '\u{1F983}' },
      { id: 'other-birds', name: 'Corvids & Others', emoji: '\u{1F54A}️' },
    ],
  },
  {
    id: 'reptiles',
    name: 'Reptiles',
    emoji: '\u{1F422}',
    color: '#43A047',
    blurb: 'Turtles, snakes & a skink',
    subs: [
      { id: 'turtles', name: 'Turtles', emoji: '\u{1F422}' },
      { id: 'snakes', name: 'Snakes', emoji: '\u{1F40D}' },
      { id: 'lizards', name: 'Lizards', emoji: '\u{1F98E}' },
    ],
  },
  {
    id: 'amphibians',
    name: 'Amphibians',
    emoji: '\u{1F438}',
    color: '#7CB342',
    blurb: 'Frogs, toads & salamanders',
    subs: [
      { id: 'frogs-toads', name: 'Frogs & Toads', emoji: '\u{1F438}' },
      { id: 'salamanders', name: 'Salamanders & Newts', emoji: '\u{1F98E}' },
    ],
  },
  {
    id: 'fish',
    name: 'Fish',
    emoji: '\u{1F41F}',
    color: '#00ACC1',
    blurb: 'Cast, catch & log',
    subs: [
      { id: 'gamefish', name: 'Game Fish', emoji: '\u{1F3A3}' },
      { id: 'panfish', name: 'Panfish & Sunfish', emoji: '\u{1F41F}' },
      { id: 'trout-salmon', name: 'Trout & Salmon', emoji: '\u{1F41F}' },
      { id: 'other-fish', name: 'Other Fish', emoji: '\u{1F420}' },
    ],
  },
  {
    id: 'trees',
    name: 'Trees',
    emoji: '\u{1F333}',
    color: '#2E7D32',
    blurb: 'Conifers & broadleaf',
    flora: true,
    subs: [
      { id: 'conifers', name: 'Conifers & Evergreens', emoji: '\u{1F332}' },
      { id: 'deciduous', name: 'Broadleaf / Deciduous', emoji: '\u{1F333}' },
    ],
  },
  {
    id: 'plants',
    name: 'Plants',
    emoji: '\u{1F33F}',
    color: '#689F38',
    blurb: 'Wildflowers to dangerous plants',
    flora: true,
    subs: [
      { id: 'wildflowers', name: 'Wildflowers', emoji: '\u{1F338}' },
      { id: 'shrubs-berries', name: 'Shrubs & Berries', emoji: '\u{1FAD0}' },
      { id: 'ferns-grasses', name: 'Ferns & Grasses', emoji: '\u{1F33F}' },
      { id: 'dangerous-invasive', name: 'Dangerous & Invasive', emoji: '☠️' },
    ],
  },
  {
    id: 'insects',
    name: 'Insects',
    emoji: '\u{1F98B}',
    color: '#FB8C00',
    blurb: 'Butterflies, bees & bugs',
    subs: [
      { id: 'butterflies-moths', name: 'Butterflies & Moths', emoji: '\u{1F98B}' },
      { id: 'dragonflies', name: 'Dragonflies & Damselflies', emoji: '\u{1FAB0}' },
      { id: 'bees-wasps', name: 'Bees & Wasps', emoji: '\u{1F41D}' },
      { id: 'beetles', name: 'Beetles & Fireflies', emoji: '\u{1F41E}' },
      { id: 'other-insects', name: 'Other Insects', emoji: '\u{1F997}' },
    ],
  },
  {
    id: 'fungi',
    name: 'Fungi',
    emoji: '\u{1F344}',
    color: '#8D6E63',
    blurb: 'Mushrooms — look, don’t eat',
    flora: true,
    subs: [
      { id: 'edible', name: 'Edible (with great care)', emoji: '\u{1F344}' },
      { id: 'poisonous', name: 'Poisonous & Deadly', emoji: '☠️' },
      { id: 'other-fungi', name: 'Other Fungi', emoji: '\u{1F344}' },
    ],
  },
];

/* Categories planned for a future release (shown greyed-out in Explore). */
window.COMING_SOON = [];
