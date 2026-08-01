/* Educational content and outside resources for the Ontario Wildlife Log.
   This is general information for Ontario, not professional or medical advice.
   Each safety topic points to official sources. Links use stable canonical URLs. */
window.LEARN = {
  topics: {
    ticks: {
      id: 'ticks', emoji: '\u{1F577}️', title: 'Ticks & Lyme Disease', tint: '#8D6E63',
      subtitle: 'What to look for, and what to do if you find one',
      disclaimer: 'General information for Ontario, not medical advice. Follow guidance from Ontario public health and your healthcare provider.',
      intro: 'Ontario has ticks, and the blacklegged (deer) tick can spread Lyme disease. Its range is growing across the province. Most tick bites do not make you sick. It still helps to know how to prevent bites, how to check for ticks, how to remove one, and when to see a doctor.',
      sections: [
        { h: 'Which ticks to watch for', bullets: [
          'Blacklegged or deer tick (Ixodes scapularis). This is the one that carries Lyme. It is small. Adults are reddish-brown with black legs, and nymphs are about the size of a poppy seed. Active spring through fall, and on any mild day above freezing.',
          'American dog tick (Dermacentor variabilis). Larger, brown with pale grey markings. Common in Ontario, but it does not spread Lyme.',
          'Both attach to feed. Not every blacklegged tick carries Lyme, and a tick usually has to be attached for many hours before it can pass it on.'
        ] },
        { h: 'Where you pick them up', p: 'Ticks wait on the tips of tall grass, brush and leaf litter, then grab on as you brush past. This is called questing. The highest risk is in wooded and brushy areas and along forest edges and tall-grass trails.' },
        { h: 'How to prevent tick bites', bullets: [
          'Wear light-coloured long sleeves and pants. Tuck your pants into your socks so ticks stay on the outside.',
          'Use an approved repellent (DEET or icaridin) on skin, and permethrin on clothing and gear.',
          'Walk in the centre of trails and stay out of tall grass and brush.',
          'Shower within about two hours of coming indoors, and put dry clothes in a hot dryer for at least 10 minutes. High heat kills ticks. Damp or wet field clothes need longer, up to an hour.'
        ] },
        { h: 'Do a tick check', p: 'After you have been outdoors, check yourself, your kids and your pets. Ticks like warm, hidden spots:', bullets: [
          'Scalp and hairline, and behind and in the ears',
          'Underarms, and in and around the groin',
          'Behind the knees, around the waistband and belly button',
          'Between the toes'
        ] },
        { h: 'If you find a tick attached', steps: [
          'Use fine-tipped tweezers and grasp the tick as close to the skin as you can.',
          'Pull straight up with steady, even pressure. Do not twist, jerk or squeeze the body.',
          'Do not use heat, petroleum jelly, or nail polish to try to make it back out.',
          'Clean the bite and your hands with soap and water or antiseptic.',
          'Note the date and where on your body it was. Consider keeping the tick in a sealed bag, or photographing it.',
          'Submit a clear photo to eTick.ca to have the species identified and learn the local risk.'
        ] },
        { h: 'Watch for symptoms', p: 'Symptoms of Lyme usually appear 3 to 30 days after a bite. They can include:', bullets: [
          'An expanding red rash, sometimes with a bull’s-eye (erythema migrans). Not everyone gets a rash.',
          'Fever, chills, headache and fatigue',
          'Muscle and joint aches'
        ], callout: { style: 'warn', title: 'When to see a doctor', body: 'The 24-hour guide is for Lyme disease, which usually needs a long attachment to pass on. Other tick-borne infections can pass sooner, so remove any tick promptly and watch for symptoms whatever the timing. See a healthcare provider if you develop a rash, fever or flu-like symptoms in the weeks after a bite, if a blacklegged tick was attached for about a day or more, or if you are not sure. Early Lyme disease is very treatable with antibiotics.' } },
        { h: 'Don’t forget pets', p: 'Check dogs and cats after walks, especially around the ears, neck and toes, and talk to your vet about tick prevention.' }
      ],
      links: [
        { label: 'Ontario: Lyme disease', url: 'https://www.ontario.ca/page/lyme-disease', note: 'Official provincial info and risk areas' },
        { label: 'eTick.ca tick identification', url: 'https://www.etick.ca', note: 'Submit a photo to identify a tick' },
        { label: 'Government of Canada: Lyme disease', url: 'https://www.canada.ca/en/public-health/services/diseases/lyme-disease.html', note: 'Symptoms, prevention and national data' }
      ]
    },

    bears: {
      id: 'bears', emoji: '\u{1F43B}', title: 'Bear Safety (Bear Wise)', tint: '#5D4037',
      subtitle: 'Prevent encounters and know what to do',
      intro: 'Ontario is black bear country. There are no grizzly bears here, and polar bears live only along the far northern Hudson Bay coast. Black bears usually want to avoid people. Most encounters end safely if you stay calm and give the bear room. Ontario’s Bear Wise program is the official channel for bear problems.',
      sections: [
        { h: 'Prevent encounters at home and camp', bullets: [
          'Never leave food, garbage, greasy grills, birdseed or pet food outdoors.',
          'Store garbage in a secure building or a bear-resistant container, and put it out the morning of pickup.',
          'Keep a clean campsite, and store food and scented items away from where you sleep.'
        ] },
        { h: 'If you see a bear at a distance', bullets: [
          'Stay calm and do not approach. Never get between a bear and its cubs or its food.',
          'Make your presence known, and give the bear space and a clear escape route.',
          'Slowly back away, and keep dogs leashed.'
        ] },
        { h: 'If a bear is close or approaches', bullets: [
          'Do not run and do not climb a tree. Never turn your back on the bear.',
          'Make yourself look big, be loud, wave your arms and use a firm voice.',
          'Slowly back toward a building or vehicle, and have bear spray ready if you carry it.'
        ], callout: { style: 'danger', title: 'If a black bear actually attacks', body: 'Black bear attacks are very rare. If one does attack, fight back. Do not play dead. Playing dead is advice for grizzlies, which are not found in Ontario.' } },
        { h: 'On the trail', bullets: [
          'Make noise so you do not surprise a bear, and travel in a group.',
          'Keep dogs leashed, and manage food and scents.',
          'Carry bear spray in the backcountry and know how to use it.'
        ] },
        { h: 'Reporting a bear, the real alert system', p: 'Use these official channels so the right people can respond:', callout: { style: 'info', title: 'Bear Wise', body: 'Immediate threat to safety, such as a bear entering a home or stalking or attacking a person: call 911. Non-emergency bear problems: call the Bear Wise line 1-866-514-2327 (TTY 705-945-7641), available April to November.' } }
      ],
      links: [
        { label: 'Ontario: Prevent bear encounters (Bear Wise)', url: 'https://www.ontario.ca/page/prevent-bear-encounters-bear-wise', note: 'Official Bear Wise guidance' }
      ]
    },

    roads: {
      id: 'roads', emoji: '\u{1F6E3}️', title: 'Wildlife on Roads', tint: '#455A64',
      subtitle: 'Deer, moose, turtles and road hazards',
      intro: 'Vehicle collisions with wildlife are common in Ontario, and for some species they are a serious threat. Road mortality is one of the biggest dangers to Ontario’s turtles. A bit of awareness protects you and the animals.',
      sections: [
        { h: 'Deer and moose', bullets: [
          'Most active at dawn, dusk and at night. Deer collisions peak in the fall rut, but moose are drawn to roadside salt and greenery and peak in late spring and early summer, with a second rise in fall.',
          'Heed wildlife-crossing signs and scan the road edges. If one animal crosses, expect more.',
          'Brake firmly and stay in your lane. Swerving into oncoming traffic or the ditch is often worse.',
          'Moose are tall and dark, and their eyes may not reflect your headlights. Use high beams when it is safe to.'
        ] },
        { h: 'Helping a turtle cross', bullets: [
          'Only if it is safe and legal to stop. Move the turtle across in the direction it was already heading.',
          'Never take a turtle home. Moving them far from where they live can harm them, and it is illegal for Species at Risk.',
          'Handle small turtles gently by the sides of the shell. For a snapping turtle, slide it onto a car mat to drag it, or lift it from the back of the shell above the tail. Keep clear of the head, and never lift it by the tail.',
          'Wash your hands afterward. Report injured turtles to the Ontario Turtle Conservation Centre.'
        ] },
        { h: 'Construction and road hazards', p: 'Check road conditions, closures and construction on Ontario 511 before you drive, and never stop in an unsafe spot to look. You can also drop a pin on the map in this app to note a hazard for yourself.' },
        { h: 'If you hit or find injured wildlife', bullets: [
          'Pull over safely and turn on your hazards. Do not touch large or potentially dangerous animals.',
          'For injured wildlife, contact a licensed wildlife rehabilitator.',
          'For a large-animal collision or a hazard blocking the road, call the local police or road authority.'
        ] }
      ],
      links: [
        { label: 'Ontario 511: road conditions and closures', url: 'https://511on.ca', note: 'Check road conditions and closures' },
        { label: 'Ontario Turtle Conservation Centre', url: 'https://ontarioturtle.ca', note: 'Injured turtles and the turtle hotline' },
        { label: 'Ontario Nature', url: 'https://ontarionature.org', note: 'Reptile and amphibian conservation' }
      ]
    },

    plants: {
      id: 'plants', emoji: '☠️', title: 'Dangerous Plants', tint: '#689F38',
      subtitle: 'Ontario plants to know, and not touch',
      intro: 'Most Ontario plants are harmless. A few can cause painful rashes or serious burns, and one is dangerously poisonous. Learn to recognize these and give them space.',
      sections: [
        { h: 'Poison ivy', p: 'Leaves of three, let it be. Three pointed leaflets, with the middle one on a longer stalk, often glossy and reddish in spring and fall. It grows as a low plant, a shrub, or a climbing vine.', callout: { style: 'warn', title: 'What to do', body: 'Contact with any part of it, even dead stems, causes an itchy, blistering rash from its oil (urushiol). Never touch it, and never burn it, since the smoke is hazardous. If you are exposed, wash your skin, tools and clothing with soap and water as soon as you can.' } },
        { h: 'Wild parsnip', p: 'A tall plant with flat-topped clusters of small yellow flowers and a grooved green stem. Common along roadsides and in old fields.', callout: { style: 'warn', title: 'What to do', body: 'Its sap makes skin extremely sensitive to sunlight, which causes severe burns and blisters. Wear gloves and long sleeves near it. If sap contacts skin, wash it off, cover the area, and keep it out of the sun.' } },
        { h: 'Giant hogweed', p: 'A towering invasive plant, up to 5 m, with huge white umbrella-shaped flower heads, enormous jagged leaves, and a thick green stem with purple blotches and coarse hairs.', callout: { style: 'danger', title: 'Do not touch it. Report it.', body: 'Its watery sap causes severe burns and blistering in sunlight, and it can injure your eyes. Stay well clear and keep children and pets away. If sap touches your skin, wash it off with soap and water right away and keep the area out of the sun for at least 48 hours. If it gets in your eyes, rinse with water and get medical care. Report sightings to Ontario’s Invading Species Hotline.' } },
        { h: 'Water hemlock', p: 'A wetland plant with small white umbrella-shaped flower clusters and a stout, sometimes purple-streaked stem. It is easily confused with edible look-alikes.', callout: { style: 'danger', title: 'Highly poisonous', body: 'This is one of the most poisonous plants in North America. Eating even a small amount can be fatal, and fast. Never forage a plant you cannot identify with certainty. If someone may have eaten it, call 911 or the Ontario Poison Centre at 1-800-268-9017 right away, do not wait for symptoms.' } },
        { h: 'Stinging nettle', p: 'A leafy plant covered in fine hairs that sting on contact and leave a burning, itchy rash for a while. Unpleasant but not dangerous. Wash the area and try not to scratch.' },
        { h: 'A good rule', p: 'Learn a few key dangerous plants, do not touch what you cannot identify, and never eat wild plants unless you are completely certain they are safe.' }
      ],
      links: [
        { label: 'Ontario: Giant hogweed', url: 'https://www.ontario.ca/page/giant-hogweed', note: 'Identify and report' },
        { label: 'Invasive Species Centre', url: 'https://www.invasivespeciescentre.ca', note: 'Invasive plants in Ontario' },
        { label: 'Ontario: Poison ivy and wild parsnip', url: 'https://www.ontario.ca/page/poison-ivy', note: 'Identification and safety' }
      ]
    },

    'fish-handling': {
      id: 'fish-handling', emoji: '\u{1F3A3}', title: 'Handling & Releasing Fish', tint: '#00838F',
      subtitle: 'Keep released fish alive and your catch fresh',
      intro: 'Whether you let a fish go or keep it for dinner, how you handle it matters. Good technique keeps a released fish alive, and keeps a kept fish in good shape.',
      sections: [
        { h: 'Set up for an easy release', bullets: [
          'Pinch down your barbs, or use barbless or single hooks. They come out fast and hurt the fish less.',
          'Keep pliers or forceps and a rubber or knotless landing net within reach.',
          'Decide whether you will keep or release before you cast, and do not play the fish to exhaustion.'
        ] },
        { h: 'Landing and holding', bullets: [
          'Wet your hands first. Dry hands strip the slime coat that protects a fish from disease.',
          'Support the fish horizontally under the belly. Never squeeze it, and never hold it by the eyes or gills.',
          'Keep it out of the water as briefly as you can. Hold your own breath as a timer.'
        ] },
        { h: 'Releasing', bullets: [
          'Back the hook out the way it went in.',
          'If a fish is hooked deep, cut the line close to the hook rather than digging for it.',
          'Revive a tired fish by holding it upright, facing the current, until it swims off on its own. In still water, move it slowly forward or in a gentle figure-eight so water passes over the gills, and never drag it rapidly back and forth.'
        ] },
        { h: 'Keeping fish to eat', p: 'Dispatch it quickly and humanely, get it cold right away, and keep only what you will eat, within the limits for that water.',
          callout: { style: 'info', title: 'Know before you go', body: 'Seasons, size limits and catch limits change by species and by lake or river. They keep the fishery healthy. Check the regulations and get your licence first.' } }
      ],
      links: [
        { label: 'Ontario: Get a fishing licence', url: 'https://www.ontario.ca/page/get-fishing-licence', note: 'Required for most anglers' },
        { label: 'Ontario: Fishing regulations summary', url: 'https://www.ontario.ca/document/ontario-fishing-regulations-summary', note: 'Seasons, sizes and limits by zone' }
      ]
    },
    'water-care': {
      id: 'water-care', emoji: '\u{1F6A4}', title: 'Protect the Water', tint: '#0277BD',
      subtitle: 'Stop the spread of aquatic invasive species',
      intro: 'Anglers and boaters are the main way invasive species hitch a ride between Ontario waters. Three simple habits stop them.',
      sections: [
        { h: 'Clean, Drain, Dry', steps: [
          'CLEAN off any plants, mud and debris from your boat, trailer, waders and gear before you leave.',
          'DRAIN all water, including the livewell, bilge, motor and buckets, onto land and not into another lake.',
          'DRY everything completely, or disinfect it, before you put it in a different waterbody.'
        ] },
        { h: 'Bait', bullets: [
          'Never move live bait from one water to another.',
          'Do not release unused bait. Put it in the trash.',
          'Buy bait locally, near where you will fish.'
        ] },
        { h: 'Never release into the wild', p: 'Do not dump an aquarium, water garden, or unused catch into any lake, river or storm drain. It is how many invasions start.',
          callout: { style: 'warn', title: 'Report invasive species', body: 'Call Ontario’s Invading Species Hotline at 1-800-563-7711, or report online to EDDMapS Ontario. See the Invasive species section for what to watch for.' } }
      ],
      links: [
        { label: 'Ontario: Invasive species', url: 'https://www.ontario.ca/page/invasive-species-ontario', note: 'Identify and prevent spread' },
        { label: 'EDDMapS Ontario: report a sighting', url: 'https://www.eddmaps.org/ontario/', note: 'Online invasive species reporting' }
      ]
    },
    'fish-eating': {
      id: 'fish-eating', emoji: '\u{1F37D}️', title: 'Is It Safe to Eat?', tint: '#00695C',
      subtitle: 'Eating your catch the healthy way',
      intro: 'Fish is a healthy, local food, but some Ontario fish carry contaminants like mercury. The province publishes exactly how much of each fish is safe to eat.',
      sections: [
        { h: 'Use the eating guide', p: 'Ontario’s Guide to Eating Ontario Fish gives safe meal limits by species, size, and location. As a rule, bigger, older, predatory fish such as large walleye and pike carry more contaminants than smaller ones.' },
        { h: 'Sensitive groups', p: 'People who are or may become pregnant, and children under 15, should follow the stricter sensitive-population limits in the guide.' },
        { h: 'Preparation helps a bit', p: 'Trimming fat and skin, and cooking so the fat drips away, lowers some contaminants. It does not lower mercury, which is in the meat. When unsure, eat smaller fish and vary the species and waters you eat from.',
          callout: { style: 'info', title: 'Quick rule of thumb', body: 'Smaller fish, more variety, and check the guide for your lake before a big fish fry.' } }
      ],
      links: [
        { label: 'Ontario: Guide to Eating Ontario Fish', url: 'https://www.ontario.ca/page/eating-ontario-fish', note: 'Meal limits by fish, size and location' }
      ]
    },
    'birding-how': {
      id: 'birding-how', emoji: '\u{1F430}', title: 'How to Birdwatch', tint: '#5E35B1',
      subtitle: 'Patience, quiet, and good timing',
      intro: 'You do not need fancy gear to start birding. You need patience, quiet, and good timing.',
      sections: [
        { h: 'Go early', p: 'Birds are most active and most vocal in the first few hours after dawn, especially in spring and early summer.' },
        { h: 'Be quiet and still', p: 'Move slowly, keep your voice low, and let birds come to you. Sudden movement sends them flying.' },
        { h: 'Use your ears', p: 'You will hear far more birds than you see. Learning a few common songs and calls doubles what you notice.' },
        { h: 'Gear that helps', bullets: [
          'A simple pair of binoculars makes a big difference.',
          'A free ID app such as Merlin can identify a bird by photo or by its song.',
          'Start in your own backyard or at a feeder before heading out.'
        ] },
        { h: 'Note the field marks', p: 'Size and shape, colours and patterns, behaviour, and habitat together tell you what you are looking at.',
          callout: { style: 'info', title: 'Bird kindly', body: 'Give nesting birds space. Do not play calls over and over to lure them in. Keep cats indoors, since free-roaming cats are a leading killer of songbirds.' } }
      ],
      links: [
        { label: 'eBird: record and explore birds', url: 'https://ebird.org/canada', note: 'Share sightings that help science' },
        { label: 'Ontario Field Ornithologists', url: 'https://ofo.ca', note: 'Ontario birding community' }
      ]
    },
    'trail-etiquette': {
      id: 'trail-etiquette', emoji: '\u{1F97E}', title: 'Trail Etiquette', tint: '#2E7D32',
      subtitle: 'Share the trail, protect the wild',
      intro: 'A bit of courtesy goes a long way, for the wildlife and for everyone else on the trail.',
      sections: [
        { h: 'Stay on the trail', p: 'Walking off-trail tramples plants and erodes the ground. Stick to marked paths.' },
        { h: 'Leave no trace', p: 'Pack out everything you bring in, including food scraps and pet waste. Take only photos.' },
        { h: 'Keep it down', p: 'Quiet voices let you and others see more wildlife, and keep the peace on busy trails.' },
        { h: 'Dogs and wildlife', bullets: [
          'Keep dogs leashed where required. They disturb wildlife and pick up ticks.',
          'Never feed wildlife. It harms animals and creates dangerous, food-conditioned bears.'
        ] },
        { h: 'Respect closures', p: 'Obey trail and area closures. Many are seasonal and protect nesting birds or sensitive species.' }
      ],
      links: []
    },
    'trail-safety': {
      id: 'trail-safety', emoji: '\u{1F9ED}', title: 'Trail Safety', tint: '#455A64',
      subtitle: 'Come home from every hike',
      intro: 'A few simple habits keep a hike or birding walk safe.',
      sections: [
        { h: 'Tell someone', p: 'Share where you are going and when you will be back.' },
        { h: 'Check conditions', p: 'Look at the weather and trail conditions before you leave, and turn back if they get worse.' },
        { h: 'Bring the basics', p: 'Water, a snack, layers, sun protection, a charged phone, and a small first-aid kit.' },
        { h: 'Ticks and bears', p: 'On grassy or wooded trails, cover up and check for ticks afterward. In bear country, make noise and travel in a group. See the Ticks and Bear safety guides.' },
        { h: 'Know your limits', p: 'Start with shorter routes, keep an eye on daylight, and do not count on cell coverage.' }
      ],
      links: []
    },

    contribute: {
      id: 'contribute', emoji: '\u{1F30D}', title: 'Help Ontario’s Wildlife', tint: '#14804a',
      subtitle: 'How your sightings support conservation',
      intro: 'Consistent records of what you see, and where and when, are the backbone of wildlife monitoring. Your log builds your own picture. Shared observations help scientists and agencies track species across Ontario.',
      sections: [
        { h: 'Your data stays yours', p: 'Everything you log in this app is stored privately on your device. Nothing is uploaded unless you choose to turn on sharing. You can export your whole log to a file at any time from the More tab.' },
        { h: 'Contribute to real conservation datasets', bullets: [
          'Post sightings to iNaturalist, for any plant or animal. Records are used by researchers worldwide and feed global biodiversity databases.',
          'Log birds on eBird. Ontario’s birding data helps track populations and migration.',
          'Report Species at Risk sightings to Ontario’s Natural Heritage Information Centre so they inform protection efforts.'
        ] },
        { h: 'The community layer', p: 'The more people log wildlife here, the more useful the picture gets. This app has an optional community layer you can connect: a small backend that pools anonymized sightings to show local trends, turtle-crossing hotspots and recent bear activity. It is off until you connect a server and turn on sharing, and coordinates are coarsened before they ever leave your phone. On its own, the app stays private and offline. See the Community screen to set it up.' }
      ],
      links: [
        { label: 'iNaturalist Canada', url: 'https://inaturalist.ca', note: 'Log and share any wildlife sighting' },
        { label: 'eBird', url: 'https://ebird.org/canada', note: 'Contribute bird observations' },
        { label: 'Ontario: Species at risk', url: 'https://www.ontario.ca/page/species-risk-ontario', note: 'Learn about and report at-risk species' },
        { label: 'Open Government Canada: species dataset', url: 'https://open.canada.ca/data/en/dataset/743a0b4a-9e33-4b12-981a-9f9fd3dd1680', note: 'Federal open data on species' }
      ]
    }
  },

  /* Outside resources, grouped. These open in the browser. */
  resources: [
    { group: 'Wildlife & Species', items: [
      { label: 'Ontario: Species at risk in Ontario', url: 'https://www.ontario.ca/page/species-risk-ontario' },
      { label: 'Hinterland Who’s Who: species profiles', url: 'https://www.hww.ca' },
      { label: 'Ontario Nature', url: 'https://ontarionature.org' },
      { label: 'Canadian Wildlife Federation', url: 'https://cwf-fcf.org' }
    ] },
    { group: 'Log & share sightings (citizen science)', items: [
      { label: 'iNaturalist Canada', url: 'https://inaturalist.ca' },
      { label: 'eBird (birds)', url: 'https://ebird.org/canada' },
      { label: 'Ontario Turtle Conservation Centre', url: 'https://ontarioturtle.ca' }
    ] },
    { group: 'Fishing & Boating', items: [
      { label: 'Ontario: Get a fishing licence', url: 'https://www.ontario.ca/page/get-fishing-licence' },
      { label: 'Ontario: Fishing regulations summary', url: 'https://www.ontario.ca/document/ontario-fishing-regulations-summary' },
      { label: 'Ontario: Guide to Eating Ontario Fish', url: 'https://www.ontario.ca/page/eating-ontario-fish' },
      { label: 'Transport Canada: Safe Boating Guide', url: 'https://tc.canada.ca/en/marine-transportation/marine-safety/safe-boating-guide' }
    ] },
    { group: 'Invasive species', items: [
      { label: 'Ontario: Invasive species', url: 'https://www.ontario.ca/page/invasive-species-ontario' },
      { label: 'Invasive Species Centre', url: 'https://www.invasivespeciescentre.ca' },
      { label: 'EDDMapS Ontario: report a sighting', url: 'https://www.eddmaps.org/ontario/' }
    ] },
    { group: 'Health & Safety', items: [
      { label: 'Ontario: Lyme disease', url: 'https://www.ontario.ca/page/lyme-disease' },
      { label: 'eTick.ca tick identification', url: 'https://www.etick.ca' },
      { label: 'Ontario: Bear Wise', url: 'https://www.ontario.ca/page/prevent-bear-encounters-bear-wise' },
      { label: 'Ontario 511: road conditions', url: 'https://511on.ca' }
    ] },
    { group: 'Open data & conservation', items: [
      { label: 'Open Government Canada: species dataset', url: 'https://open.canada.ca/data/en/dataset/743a0b4a-9e33-4b12-981a-9f9fd3dd1680' },
      { label: 'Government of Canada: Lyme disease', url: 'https://www.canada.ca/en/public-health/services/diseases/lyme-disease.html' }
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
