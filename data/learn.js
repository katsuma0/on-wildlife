/* Educational content + curated external resources for the Ontario Wildlife Log.
   Content is general information for Ontario, not professional/medical advice —
   each safety topic points to official sources. Links use stable canonical URLs. */
window.LEARN = {
  topics: {
    ticks: {
      id: 'ticks', emoji: '\u{1F577}️', title: 'Ticks & Lyme Disease', tint: '#8D6E63',
      subtitle: 'What to look for, and what to do if you find one',
      disclaimer: 'General information for Ontario — not medical advice. Follow guidance from Ontario public health and your healthcare provider.',
      intro: 'Ontario has ticks, and the blacklegged (deer) tick can spread Lyme disease. Its range is expanding across the province. Most tick bites do not cause illness, but knowing how to prevent, check for, and remove ticks — and when to see a doctor — makes a real difference.',
      sections: [
        { h: 'Which ticks to watch for', bullets: [
          'Blacklegged / deer tick (Ixodes scapularis) — the Lyme carrier. Tiny: adults are reddish-brown with black legs; nymphs are the size of a poppy seed. Active spring through fall, and on mild days above freezing.',
          'American dog tick (Dermacentor variabilis) — larger, brown with pale grey markings. Common in Ontario but does NOT spread Lyme disease.',
          'Both attach to feed. Not every blacklegged tick carries Lyme, and a tick usually must be attached for many hours before it can transmit it.'
        ] },
        { h: 'Where you pick them up', p: 'Ticks wait on the tips of tall grass, brush and leaf litter and grab on as you brush past — this is called "questing". Highest risk is in wooded and brushy areas and along forest-edge and tall-grass trails.' },
        { h: 'How to prevent tick bites', bullets: [
          'Wear light-coloured long sleeves and pants; tuck pants into your socks so ticks stay on the outside.',
          'Use an approved repellent (DEET or icaridin) on skin, and permethrin on clothing and gear.',
          'Walk in the centre of trails and avoid brushing through tall grass and brush.',
          'Shower within about 2 hours of coming indoors, and put your clothes in a hot dryer for 10+ minutes — high heat kills ticks.'
        ] },
        { h: 'Do a tick check', p: 'After being outdoors, check yourself, children and pets. Ticks like warm, hidden spots:', bullets: [
          'Scalp and hairline, and behind and in the ears',
          'Underarms, and in and around the groin',
          'Behind the knees, around the waistband and belly button',
          'Between the toes'
        ] },
        { h: 'If you find a tick attached', steps: [
          'Use fine-tipped tweezers and grasp the tick as close to the skin as possible.',
          'Pull straight up with steady, even pressure — do not twist, jerk or squeeze the body.',
          'Do NOT use heat, petroleum jelly, or nail polish to try to make it back out.',
          'Clean the bite and your hands with soap and water or antiseptic.',
          'Note the date and where on your body it was. Consider keeping the tick (in a sealed bag) or photographing it.',
          'Submit a clear photo to eTick.ca to have the species identified and learn the local risk.'
        ] },
        { h: 'Watch for symptoms', p: 'Symptoms of Lyme usually appear 3 to 30 days after a bite and can include:', bullets: [
          'An expanding red rash, sometimes with a "bull’s-eye" (erythema migrans) — but not everyone gets a rash',
          'Fever, chills, headache and fatigue',
          'Muscle and joint aches'
        ], callout: { style: 'warn', title: 'When to see a doctor', body: 'See a healthcare provider if you develop symptoms, if a blacklegged tick was attached for roughly 24 hours or more, or if you are unsure. Early Lyme disease is very treatable with antibiotics — when in doubt, get checked.' } },
        { h: 'Don’t forget pets', p: 'Check dogs and cats after walks, especially around the ears, neck and toes, and talk to your vet about tick prevention.' }
      ],
      links: [
        { label: 'Ontario — Lyme disease', url: 'https://www.ontario.ca/page/lyme-disease', note: 'Official provincial info & risk areas' },
        { label: 'eTick.ca — tick identification', url: 'https://www.etick.ca', note: 'Submit a photo to identify a tick' },
        { label: 'Government of Canada — Lyme disease', url: 'https://www.canada.ca/en/public-health/services/diseases/lyme-disease.html', note: 'Symptoms, prevention & national data' }
      ]
    },

    bears: {
      id: 'bears', emoji: '\u{1F43B}', title: 'Bear Safety (Bear Wise)', tint: '#5D4037',
      subtitle: 'Prevent encounters and know what to do',
      intro: 'Ontario is black bear country — there are no grizzly bears in Ontario (polar bears live only along the far northern Hudson Bay coast). Black bears usually want to avoid people. Most encounters end safely if you stay calm and give the bear space. Ontario’s Bear Wise program is the official channel for bear problems.',
      sections: [
        { h: 'Prevent encounters at home & camp', bullets: [
          'Never leave food, garbage, greasy grills, birdseed or pet food outdoors.',
          'Store garbage in a secure building or bear-resistant container; put it out the morning of pickup.',
          'Keep a clean campsite and store food and scented items away from where you sleep.'
        ] },
        { h: 'If you see a bear at a distance', bullets: [
          'Stay calm and do not approach — never get between a bear and its cubs or its food.',
          'Make your presence known; give the bear space and a clear escape route.',
          'Slowly back away, and keep dogs leashed.'
        ] },
        { h: 'If a bear is close or approaches', bullets: [
          'Do NOT run and do NOT climb a tree — never turn your back on the bear.',
          'Make yourself look big, be loud, wave your arms and use a firm voice.',
          'Slowly back toward a building or vehicle; have bear spray ready if you carry it.'
        ], callout: { style: 'danger', title: 'If a black bear actually attacks', body: 'Black bear attacks are very rare. If one does attack, FIGHT BACK — do not play dead. (Playing dead is advice for grizzlies, which are not found in Ontario.)' } },
        { h: 'On the trail', bullets: [
          'Make noise so you don’t surprise a bear, and travel in a group.',
          'Keep dogs leashed and manage food and scents.',
          'Carry bear spray in the backcountry and know how to use it.'
        ] },
        { h: 'Reporting a bear — the real alert system', p: 'Use these official channels so the right people can respond:', callout: { style: 'info', title: 'Bear Wise', body: 'Immediate threat to safety (a bear enters a home, stalks or attacks a person): call 911. Non-emergency bear problems: call the Bear Wise line 1-866-514-2327 (TTY 705-945-7641), available April to November.' } }
      ],
      links: [
        { label: 'Ontario — Prevent bear encounters (Bear Wise)', url: 'https://www.ontario.ca/page/prevent-bear-encounters-bear-wise', note: 'Official Bear Wise guidance' }
      ]
    },

    roads: {
      id: 'roads', emoji: '\u{1F6E3}️', title: 'Wildlife on Roads', tint: '#455A64',
      subtitle: 'Deer, moose, turtles & road hazards',
      intro: 'Vehicle collisions with wildlife are common in Ontario and are a serious threat to some species — road mortality is one of the biggest dangers to Ontario’s turtles. A little awareness protects both you and the animals.',
      sections: [
        { h: 'Deer & moose', bullets: [
          'Most active at dawn, dusk and at night, and especially in the fall.',
          'Heed wildlife-crossing signs and scan the road edges; if one animal crosses, expect more.',
          'Brake firmly and stay in your lane — swerving into oncoming traffic or the ditch is often worse.',
          'Moose are tall and dark and their eyes may not reflect your headlights — use high beams when it is safe.'
        ] },
        { h: 'Helping a turtle cross', bullets: [
          'Only if it is safe and legal to stop. Move the turtle across in the direction it was already heading.',
          'Never take a turtle home — moving them far from where they live can harm them and is illegal for Species at Risk.',
          'Handle small turtles gently by the sides of the shell. For a snapping turtle, slide it onto a car mat to drag it, or lift from the back of the shell above the tail — keep clear of the head, and never lift by the tail.',
          'Wash your hands afterward. Report injured turtles to the Ontario Turtle Conservation Centre.'
        ] },
        { h: 'Construction & road hazards', p: 'Report road hazards, closures and construction through Ontario 511, and never stop in an unsafe spot to do so. You can also drop a pin on the map in this app to note a hazard for yourself.' },
        { h: 'If you hit or find injured wildlife', bullets: [
          'Pull over safely and turn on your hazards; do not touch large or potentially dangerous animals.',
          'For injured wildlife, contact a licensed wildlife rehabilitator.',
          'For a large-animal collision or a hazard blocking the road, call the local police or road authority.'
        ] }
      ],
      links: [
        { label: 'Ontario 511 — road conditions & closures', url: 'https://511on.ca', note: 'Report & check road hazards' },
        { label: 'Ontario Turtle Conservation Centre', url: 'https://ontarioturtle.ca', note: 'Injured turtles & the turtle hotline' },
        { label: 'Ontario Nature', url: 'https://ontarionature.org', note: 'Reptile & amphibian conservation' }
      ]
    },

    plants: {
      id: 'plants', emoji: '☠️', title: 'Dangerous Plants', tint: '#689F38',
      subtitle: 'Ontario plants to look out for — and not touch',
      intro: 'Most Ontario plants are harmless, but a few can cause painful rashes or serious burns, and one is dangerously poisonous. Learn to recognize these and give them space.',
      sections: [
        { h: 'Poison ivy', p: 'Leaves of three, let it be. Three pointed leaflets (the middle on a longer stalk), often glossy and reddish in spring/fall; grows as a low plant, shrub or climbing vine.', callout: { style: 'warn', title: 'What to do', body: 'Contact with any part — even dead stems — causes an itchy, blistering rash from its oil (urushiol). Never touch it and never burn it (the smoke is hazardous). If exposed, wash skin, tools and clothing with soap and water as soon as possible.' } },
        { h: 'Wild parsnip', p: 'Tall plant with flat-topped clusters of small yellow flowers and a grooved green stem; common along roadsides and in old fields.', callout: { style: 'warn', title: 'What to do', body: 'Its sap makes skin extremely sensitive to sunlight, causing severe burns and blisters. Wear gloves and long sleeves near it; if sap contacts skin, wash it off, cover the area and keep it out of the sun.' } },
        { h: 'Giant hogweed', p: 'A towering invasive (up to 5 m) with huge white umbrella-shaped flower heads, enormous jagged leaves, and a thick green stem with purple blotches and coarse hairs.', callout: { style: 'danger', title: 'Do not touch — report it', body: 'Its watery sap causes severe burns and blistering in sunlight and can injure eyes. Stay well clear, keep children and pets away, and report sightings to Ontario’s Invading Species Hotline.' } },
        { h: 'Water hemlock', p: 'Wetland plant with small white umbrella-shaped flower clusters and a stout, sometimes purple-streaked stem — easily confused with edible look-alikes.', callout: { style: 'danger', title: 'Highly poisonous', body: 'One of the most poisonous plants in North America — eating even a small amount can be fatal. Never forage a plant you cannot identify with certainty.' } },
        { h: 'Stinging nettle', p: 'Leafy plant covered in fine hairs that inject a sting on contact, leaving a burning, itchy rash for a while. Unpleasant but not dangerous; wash the area and avoid scratching.' },
        { h: 'A good rule', p: 'Learn a few key dangerous plants, don’t touch what you can’t identify, and never eat wild plants unless you are completely certain they are safe.' }
      ],
      links: [
        { label: 'Ontario — Giant hogweed', url: 'https://www.ontario.ca/page/giant-hogweed', note: 'Identify & report' },
        { label: 'Invasive Species Centre', url: 'https://www.invasivespeciescentre.ca', note: 'Invasive plants in Ontario' },
        { label: 'Ontario — Poison ivy & wild parsnip', url: 'https://www.ontario.ca/page/poison-ivy', note: 'Identification & safety' }
      ]
    },

    'fish-handling': {
      id: 'fish-handling', emoji: '\u{1F3A3}', title: 'Handling & Releasing Fish', tint: '#00838F',
      subtitle: 'Keep released fish alive and your catch fresh',
      intro: 'Whether you let a fish go or keep it for dinner, how you handle it matters. Good technique keeps released fish alive and keeps a kept fish in top shape.',
      sections: [
        { h: 'Set up for an easy release', bullets: [
          'Pinch down your barbs or use barbless / single hooks — they come out fast and hurt the fish less.',
          'Keep pliers or forceps and a rubber or knotless landing net within reach.',
          'Decide whether you’ll keep or release before you cast, and don’t play the fish to exhaustion.'
        ] },
        { h: 'Landing & holding', bullets: [
          'Wet your hands first — dry hands strip the slime coat that protects a fish from disease.',
          'Support the fish horizontally under the belly; never squeeze it or hold it by the eyes or gills.',
          'Keep it out of the water as briefly as possible — hold your own breath as a timer.'
        ] },
        { h: 'Releasing', bullets: [
          'Back the hook out the way it went in.',
          'If a fish is hooked deep, cut the line close to the hook rather than digging for it.',
          'Revive a tired fish by holding it upright, facing the current, until it swims off on its own.'
        ] },
        { h: 'Keeping fish to eat', p: 'Dispatch it quickly and humanely, keep it cold right away, and keep only what you’ll eat — within the limits for that water.',
          callout: { style: 'info', title: 'Know before you go', body: 'Seasons, size limits and catch limits change by species and by lake or river — they keep the fishery healthy. Check the regulations and get your licence first.' } }
      ],
      links: [
        { label: 'Ontario — Get a fishing licence', url: 'https://www.ontario.ca/page/get-fishing-licence', note: 'Required for most anglers' },
        { label: 'Ontario — Fishing regulations summary', url: 'https://www.ontario.ca/document/ontario-fishing-regulations-summary', note: 'Seasons, sizes & limits by zone' }
      ]
    },
    'water-care': {
      id: 'water-care', emoji: '\u{1F6A4}', title: 'Protect the Water', tint: '#0277BD',
      subtitle: 'Stop the spread of aquatic invasive species',
      intro: 'Anglers and boaters are the main way invasive species hitch a ride between Ontario waters. Three simple habits stop them.',
      sections: [
        { h: 'Clean · Drain · Dry', steps: [
          'CLEAN off any plants, mud and debris from your boat, trailer, waders and gear before you leave.',
          'DRAIN all water — livewell, bilge, motor and buckets — onto land, not into another lake.',
          'DRY everything completely (or disinfect) before you put it in a different waterbody.'
        ] },
        { h: 'Bait', bullets: [
          'Never move live bait from one water to another.',
          'Don’t release unused bait — put it in the trash.',
          'Buy bait locally, near where you’ll fish.'
        ] },
        { h: 'Never release into the wild', p: 'Don’t dump an aquarium, water garden, or unused catch into any lake, river or storm drain — it’s how many invasions start.',
          callout: { style: 'warn', title: 'Report invasive species', body: 'Call Ontario’s Invading Species Hotline at 1-800-563-7711, or report online to EDDMapS Ontario. See the Invasive species section for what to watch for.' } }
      ],
      links: [
        { label: 'Ontario — Invasive species', url: 'https://www.ontario.ca/page/invasive-species-ontario', note: 'Identify & prevent spread' },
        { label: 'EDDMapS Ontario — report a sighting', url: 'https://www.eddmaps.org/ontario/', note: 'Online invasive species reporting' }
      ]
    },
    'fish-eating': {
      id: 'fish-eating', emoji: '\u{1F37D}️', title: 'Is It Safe to Eat?', tint: '#00695C',
      subtitle: 'Eating your catch — the healthy way',
      intro: 'Fish is a healthy, local food, but some Ontario fish carry contaminants like mercury. The province publishes exactly how much of each fish is safe to eat.',
      sections: [
        { h: 'Use the eating guide', p: 'Ontario’s Guide to Eating Ontario Fish gives safe meal limits by species, size, and location. As a rule, bigger, older, predatory fish (like large walleye and pike) carry more contaminants than smaller ones.' },
        { h: 'Sensitive groups', p: 'People who are or may become pregnant, and young children, should follow the stricter “sensitive population” limits in the guide.' },
        { h: 'Preparation helps (a bit)', p: 'Trimming fat and skin and cooking so the fat drips away lowers some contaminants — but not mercury, which is in the meat. When unsure, eat smaller fish and vary the species and waters you eat from.',
          callout: { style: 'info', title: 'Quick rule of thumb', body: 'Smaller fish, more variety, and check the guide for your lake before a big fish fry.' } }
      ],
      links: [
        { label: 'Ontario — Guide to Eating Ontario Fish', url: 'https://www.ontario.ca/page/eating-ontario-fish', note: 'Meal limits by fish, size & location' }
      ]
    },
    'boat-safety': {
      id: 'boat-safety', emoji: '\u{1F6E5}️', title: 'Boating Safety', tint: '#1565C0',
      subtitle: 'Simple rules for a safe day on the water',
      intro: 'Most boating tragedies in Ontario involve cold water and an unworn lifejacket. A little preparation keeps a fun day safe.',
      sections: [
        { h: 'Wear your lifejacket', p: 'Carry a Canadian-approved lifejacket or PFD for every person aboard — and actually wear it. Most drownings happen to people who had one on the boat but weren’t wearing it.' },
        { h: 'Cold water is the real danger', p: 'Ontario water is cold most of the year. A sudden fall in causes an involuntary gasp and rapid loss of muscle control. Dress for the water temperature, not the air.' },
        { h: 'Carry the required gear', p: 'Bring the safety equipment your boat’s size requires — a bailer or pump, a buoyant heaving line, a sound signalling device, navigation lights, and a fire extinguisher where needed. Operating a motorized boat requires proof of competency (a Pleasure Craft Operator Card).' },
        { h: 'Before you go', bullets: [
          'Check the weather and forecast.',
          'Tell someone your route and return time.',
          'Never mix alcohol or cannabis with boating.'
        ] }
      ],
      links: [
        { label: 'Transport Canada — Safe Boating Guide', url: 'https://tc.canada.ca/en/marine-transportation/marine-safety/safe-boating-guide', note: 'Rules, required gear & the operator card' }
      ]
    },
    'birding-how': {
      id: 'birding-how', emoji: '\u{1F430}', title: 'How to Birdwatch', tint: '#5E35B1',
      subtitle: 'The early bird really does get the bird',
      intro: 'You don’t need fancy gear to start birding — just patience, quiet, and good timing.',
      sections: [
        { h: 'Go early', p: 'Birds are most active and most vocal in the first few hours after dawn, especially in spring and early summer. The early bird gets the bird.' },
        { h: 'Be quiet and still', p: 'Move slowly, keep your voice low, and let birds come to you. Sudden movement sends them flying.' },
        { h: 'Use your ears', p: 'You’ll hear far more birds than you see. Learning a few common songs and calls doubles what you notice.' },
        { h: 'Gear that helps', bullets: [
          'A simple pair of binoculars changes everything.',
          'A free ID app (like Merlin) can identify a bird by photo or by its song.',
          'Start in your own backyard or at a feeder before heading out.'
        ] },
        { h: 'Note the field marks', p: 'Size and shape, colours and patterns, behaviour, and habitat together tell you what you’re looking at.',
          callout: { style: 'info', title: 'Bird kindly', body: 'Give nesting birds space, don’t play calls over and over to lure them in, and keep cats indoors — free-roaming cats are a leading killer of songbirds.' } }
      ],
      links: [
        { label: 'eBird — record & explore birds', url: 'https://ebird.org/canada', note: 'Share sightings that help science' },
        { label: 'Ontario Field Ornithologists', url: 'https://ofo.ca', note: 'Ontario birding community' }
      ]
    },
    'trail-etiquette': {
      id: 'trail-etiquette', emoji: '\u{1F97E}', title: 'Trail Etiquette', tint: '#2E7D32',
      subtitle: 'Share the trail, protect the wild',
      intro: 'A little courtesy protects the wildlife, the land, and everyone’s experience.',
      sections: [
        { h: 'Stay on the trail', p: 'Walking off-trail tramples plants and erodes the ground. Stick to marked paths.' },
        { h: 'Leave no trace', p: 'Pack out everything you bring in — including food scraps and pet waste. Take only photos.' },
        { h: 'Keep it down', p: 'Quiet voices let you (and others) see more wildlife, and keep the peace on busy trails.' },
        { h: 'Dogs & wildlife', bullets: [
          'Keep dogs leashed where required — they disturb wildlife and pick up ticks.',
          'Never feed wildlife; it harms animals and creates dangerous, food-conditioned bears.'
        ] },
        { h: 'Respect closures', p: 'Obey trail and area closures — many are seasonal and protect nesting birds or sensitive species.' }
      ],
      links: []
    },
    'trail-safety': {
      id: 'trail-safety', emoji: '\u{1F9ED}', title: 'Trail Safety', tint: '#455A64',
      subtitle: 'Come home from every hike',
      intro: 'A few simple habits keep a hike or birding walk safe.',
      sections: [
        { h: 'Tell someone', p: 'Share where you’re going and when you’ll be back.' },
        { h: 'Check conditions', p: 'Look at the weather and trail conditions before you leave, and turn back if they worsen.' },
        { h: 'Bring the basics', p: 'Water, a snack, layers, sun protection, a charged phone, and a small first-aid kit.' },
        { h: 'Ticks & bears', p: 'On grassy or wooded trails, cover up and check for ticks afterward. In bear country, make noise and travel in a group. See the Ticks and Bear safety guides.' },
        { h: 'Know your limits', p: 'Start with shorter routes, keep an eye on daylight, and don’t count on cell coverage.' }
      ],
      links: []
    },

    contribute: {
      id: 'contribute', emoji: '\u{1F30D}', title: 'Help Ontario’s Wildlife', tint: '#14804a',
      subtitle: 'How your sightings support conservation',
      intro: 'Consistent records of what you see, where and when are the backbone of wildlife monitoring. Your log helps you build your own picture — and shared observations help scientists and agencies track species across Ontario.',
      sections: [
        { h: 'Your data stays yours', p: 'Everything you log in this app is stored privately on your device. Nothing is uploaded. You can export your whole log to a file at any time from the More tab.' },
        { h: 'Contribute to real conservation datasets', bullets: [
          'Post sightings to iNaturalist (all plants & animals) — records are used by researchers worldwide and feed global biodiversity databases.',
          'Log birds on eBird — Ontario’s birding data helps track populations and migration.',
          'Report Species at Risk sightings to Ontario’s Natural Heritage Information Centre so they inform protection efforts.'
        ] },
        { h: 'Where this is going', p: 'The vision: the more people log wildlife here, the more useful the picture becomes. A future opt-in community layer would let Wildlife Log users pool anonymized sightings to reveal local trends, turtle-crossing hotspots and recent bear activity — a genuine citizen-science tool for Ontario. (That shared layer needs a secure server and is on the roadmap; today the app is private and offline.)' }
      ],
      links: [
        { label: 'iNaturalist Canada', url: 'https://inaturalist.ca', note: 'Log & share any wildlife sighting' },
        { label: 'eBird', url: 'https://ebird.org/canada', note: 'Contribute bird observations' },
        { label: 'Ontario — Species at risk', url: 'https://www.ontario.ca/page/species-risk-ontario', note: 'Learn about & report at-risk species' },
        { label: 'Open Government Canada — species dataset', url: 'https://open.canada.ca/data/en/dataset/743a0b4a-9e33-4b12-981a-9f9fd3dd1680', note: 'Federal open data on species' }
      ]
    }
  },

  /* Curated external resources, grouped. Opened in the browser (external sites). */
  resources: [
    { group: 'Wildlife & Species', items: [
      { label: 'Ontario — Species at risk in Ontario', url: 'https://www.ontario.ca/page/species-risk-ontario' },
      { label: 'Hinterland Who’s Who — species profiles', url: 'https://www.hww.ca' },
      { label: 'Ontario Nature', url: 'https://ontarionature.org' },
      { label: 'Canadian Wildlife Federation', url: 'https://cwf-fcf.org' }
    ] },
    { group: 'Log & share sightings (citizen science)', items: [
      { label: 'iNaturalist Canada', url: 'https://inaturalist.ca' },
      { label: 'eBird (birds)', url: 'https://ebird.org/canada' },
      { label: 'Ontario Turtle Conservation Centre', url: 'https://ontarioturtle.ca' }
    ] },
    { group: 'Fishing & Boating', items: [
      { label: 'Ontario — Get a fishing licence', url: 'https://www.ontario.ca/page/get-fishing-licence' },
      { label: 'Ontario — Fishing regulations summary', url: 'https://www.ontario.ca/document/ontario-fishing-regulations-summary' },
      { label: 'Ontario — Guide to Eating Ontario Fish', url: 'https://www.ontario.ca/page/eating-ontario-fish' },
      { label: 'Transport Canada — Safe Boating Guide', url: 'https://tc.canada.ca/en/marine-transportation/marine-safety/safe-boating-guide' }
    ] },
    { group: 'Invasive species', items: [
      { label: 'Ontario — Invasive species', url: 'https://www.ontario.ca/page/invasive-species-ontario' },
      { label: 'Invasive Species Centre', url: 'https://www.invasivespeciescentre.ca' },
      { label: 'EDDMapS Ontario — report a sighting', url: 'https://www.eddmaps.org/ontario/' }
    ] },
    { group: 'Health & Safety', items: [
      { label: 'Ontario — Lyme disease', url: 'https://www.ontario.ca/page/lyme-disease' },
      { label: 'eTick.ca — tick identification', url: 'https://www.etick.ca' },
      { label: 'Ontario — Bear Wise', url: 'https://www.ontario.ca/page/prevent-bear-encounters-bear-wise' },
      { label: 'Ontario 511 — road conditions', url: 'https://511on.ca' }
    ] },
    { group: 'Open data & conservation', items: [
      { label: 'Open Government Canada — species dataset', url: 'https://open.canada.ca/data/en/dataset/743a0b4a-9e33-4b12-981a-9f9fd3dd1680' },
      { label: 'Government of Canada — Lyme disease', url: 'https://www.canada.ca/en/public-health/services/diseases/lyme-disease.html' }
    ] }
  ],

  /* Hazard types for the "Report a hazard" flow and map pins. */
  hazardTypes: [
    { id: 'wildlife-road', name: 'Wildlife on road', emoji: '\u{1F98C}' },
    { id: 'roadkill', name: 'Roadkill', emoji: '\u{1F480}' },
    { id: 'turtle-crossing', name: 'Turtle crossing', emoji: '\u{1F422}' },
    { id: 'construction', name: 'Construction', emoji: '\u{1F6A7}' },
    { id: 'flooding', name: 'Flooding / water', emoji: '\u{1F30A}' },
    { id: 'ice', name: 'Ice / snow', emoji: '\u{1F9CA}' },
    { id: 'tree', name: 'Fallen tree', emoji: '\u{1F333}' },
    { id: 'ticks', name: 'Ticks here', emoji: '\u{1F577}️' },
    { id: 'other', name: 'Other hazard', emoji: '⚠️' }
  ]
};
