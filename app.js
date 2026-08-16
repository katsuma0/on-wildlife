/* =========================================================================
   Ontario Wildlife Log, application logic
   Vanilla single-page app: hash routing, IndexedDB-backed journal, and an
   iOS-styled UI rendered from the SPECIES / CATEGORIES globals.
   ========================================================================= */
(function () {
  'use strict';

  /* --------------------------------------------------------------- Icons */
  var I = {
    log: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5h11l5 5V23a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"/><path d="M16.5 4.6V10h5"/><path d="M9 14h8M9 18h6"/></svg>',
    explore: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="14" r="9.5"/><path d="M18.5 9.5 12.8 12 10 18l5.7-2.5L18.5 9.5Z" fill="currentColor" stroke="none"/></svg>',
    mylog: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h9l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M16.5 4.4V9.5H21"/><path d="M10.5 14.5l1.8 1.8 3.4-3.6"/></svg>',
    more: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="7" cy="14" r="1.6" fill="currentColor" stroke="none"/><circle cx="14" cy="14" r="1.6" fill="currentColor" stroke="none"/><circle cx="21" cy="14" r="1.6" fill="currentColor" stroke="none"/></svg>',
    chevron: '<svg viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7.4l3.4 3.4L12 3.6"/></svg>',
    back: '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 1 2 10l8 9"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/></svg>',
    tabsearch: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12.5" cy="12.5" r="8"/><path d="M18.5 18.5 23 23"/></svg>',
    learn: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5H21a2.5 2.5 0 0 1 2.5 2.5V22H7.5A2.5 2.5 0 0 0 5 24.5Z"/><path d="M23.5 22a2.5 2.5 0 0 0-2.5 2.5H7.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L18 8h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.2"/></svg>',
    map: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 5 7v16l6-2 6 2 6-2V5l-6 2-6-2Z"/><path d="M11 5v16M17 7v16"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M19 5l-8 8"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
    crosshair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="M8 7l4-4 4 4"/><path d="M6 12H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1"/></svg>'
  };

  /* ----------------------------------------------------------- Utilities */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function uid() {
    return 'e' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  }
  function haptic() { try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {} }
  function isIosSafari() {
    var ua = navigator.userAgent || '';
    var ios = /iphone|ipad|ipod/i.test(ua);
    var standalone = (window.navigator.standalone === true) ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    return ios && !standalone;
  }
  var _vtaps = 0, _vtimer;
  function versionTap() {
    _vtaps++; clearTimeout(_vtimer); _vtimer = setTimeout(function () { _vtaps = 0; }, 1200);
    if (_vtaps >= 5) { _vtaps = 0; haptic(); toast('\u{1F43E} Thanks for logging what you see.'); }
  }

  var app = {
    entries: [], hazards: [],
    settings: { units: 'metric', theme: 'auto', homeMode: 'all', photos: true, seenPrivacy: false, seenInstall: false, community: false, communityUrl: '', badges: [], journalFilter: 'all', mapLayers: { wildlife: true, parks: false, zones: false }, mapShow: { wildlife: false, hazard: false }, displayName: '', primaryPursuit: 'fishing' },
    draft: null, hdraft: null, ready: false, map: null, mapFilter: 'all', placeMode: null
  };

  /* ------------------------------------------------------------- Storage */
  var Store = {
    useIDB: false,
    db: null,
    openIDB: function () {
      return new Promise(function (resolve) {
        if (!('indexedDB' in window)) return resolve(false);
        try {
          var r = indexedDB.open('owl-db', 2);
          r.onupgradeneeded = function (e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('entries')) db.createObjectStore('entries', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('hazards')) db.createObjectStore('hazards', { keyPath: 'id' });
          };
          r.onsuccess = function (e) { Store.db = e.target.result; Store.useIDB = true; resolve(true); };
          r.onerror = function () { resolve(false); };
        } catch (e) { resolve(false); }
      });
    },
    tx: function (mode, store) { return Store.db.transaction(store || 'entries', mode).objectStore(store || 'entries'); },
    _getAll: function (store, lsKey) {
      if (Store.useIDB) {
        return new Promise(function (resolve) {
          try {
            var r = Store.tx('readonly', store).getAll();
            r.onsuccess = function () { resolve(r.result || []); };
            r.onerror = function () { resolve([]); };
          } catch (e) { resolve([]); }
        });
      }
      try { return Promise.resolve(JSON.parse(localStorage.getItem(lsKey) || '[]')); }
      catch (e) { return Promise.resolve([]); }
    },
    load: function () { return Store.openIDB().then(function () { return Store._getAll('entries', 'owl-entries'); }); },
    loadHazards: function () { return Store._getAll('hazards', 'owl-hazards'); },
    _ls: function (store) {
      try {
        if (store === 'hazards') localStorage.setItem('owl-hazards', JSON.stringify(app.hazards));
        else localStorage.setItem('owl-entries', JSON.stringify(app.entries));
        return true;
      } catch (e) { return false; } // e.g. QuotaExceededError, surfaced, not swallowed
    },
    // put returns a Promise so callers can await a REAL success/failure (photos
    // and entries must never silently fail while the user is told "✓ Logged").
    put: function (v, store) {
      store = store || 'entries';
      if (Store.useIDB) {
        return new Promise(function (resolve, reject) {
          try {
            var tx = Store.db.transaction(store, 'readwrite');
            tx.objectStore(store).put(v);
            tx.oncomplete = function () { resolve(); };
            tx.onerror = tx.onabort = function () { reject(tx.error || new Error('write failed')); };
          } catch (e) { reject(e); }
        });
      }
      return Store._ls(store) ? Promise.resolve() : Promise.reject(new Error('storage full'));
    },
    del: function (id, store) {
      store = store || 'entries';
      if (Store.useIDB) { try { Store.tx('readwrite', store).delete(id); } catch (e) { Store._ls(store); } }
      else Store._ls(store);
    },
    clear: function (store) {
      store = store || 'entries';
      if (Store.useIDB) { try { Store.tx('readwrite', store).clear(); } catch (e) {} }
      Store._ls(store);
    }
  };
  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem('owl-settings') || '{}');
      if (s && typeof s === 'object') { for (var k in s) if (s.hasOwnProperty(k)) app.settings[k] = s[k]; }
    } catch (e) {}
    if (!Array.isArray(app.settings.badges)) app.settings.badges = [];
    if (!app.settings.mapLayers || typeof app.settings.mapLayers !== 'object') {
      app.settings.mapLayers = { wildlife: true, parks: false, zones: false };
    }
    if (!app.settings.mapShow || typeof app.settings.mapShow !== 'object') {
      app.settings.mapShow = { wildlife: false, hazard: false };
    }
  }
  function saveSettings() { try { localStorage.setItem('owl-settings', JSON.stringify(app.settings)); } catch (e) {} }

  /* ------------------------------------------------------------ Language
     One dictionary, keyed by the English the code already carries, so a
     missing entry safely falls back to English. Species accounts, safety
     notes and regulations are reference data and stay in English. */
  var FR = {
    'Guide': 'Guide', 'Map': 'Carte', 'Journal': 'Journal', 'Fishing': 'Pêche', 'Birding': 'Oiseaux', 'More': 'Plus',
    'on-wildlife': 'on-wildlife', 'Account': 'Compte', 'Search': 'Recherche', 'Log an encounter': 'Noter une observation',
    'This month in Ontario': 'Ce mois-ci en Ontario', 'Ontario Wildlife': 'Faune de l’Ontario', 'Coming Soon': 'À venir',
    'Loading': 'Chargement',
    'Your journal': 'Votre journal', 'of': 'sur', 'in the Ontario guide': 'du guide ontarien',
    'Insights': 'Aperçus', 'spotted': 'observées', 'Days with sightings': 'Jours avec observations',
    'Total sightings': 'Observations au total', 'All Species': 'Toutes les espèces',
    'Your sighting map': 'La carte de vos observations',
    'Log this sighting': 'Noter cette observation', 'Open in your journal': 'Ouvrir dans votre journal',
    'Every encounter': 'Chaque observation', 'Open guide entry': 'Ouvrir la fiche du guide', 'At risk': 'En péril',
    'A private field guide and journal for the Ontario outdoors. Everything here manages this app and your data.':
      'Un guide de terrain et un journal privés pour le plein air en Ontario. Tout ici gère cette application et vos données.',
    'In a future update': 'Dans une prochaine version', 'Species at Risk': 'Espèces en péril',
    'flagged in the guide': 'signalées dans le guide', 'species': 'espèces', 'Recent': 'Récent',
    'Encounter': 'Observation', 'Encounters': 'Observations', 'Species': 'Espèces', 'Categories': 'Catégories',
    'Mammals': 'Mammifères', 'Birds': 'Oiseaux', 'Reptiles': 'Reptiles', 'Amphibians': 'Amphibiens', 'Fish': 'Poissons',
    'Trees': 'Arbres', 'Plants': 'Plantes', 'Insects': 'Insectes', 'Fungi': 'Champignons',
    'See all encounters ›': 'Toutes les observations ›',
    'Learn': 'Apprendre', 'Learn and safety': 'Apprendre et sécurité', 'Bears, ticks, roads, water': 'Ours, tiques, routes, eau',
    'Invasive species': 'Espèces envahissantes', 'What to watch for and how to report': 'Quoi surveiller et comment signaler',
    'Your journal': 'Votre journal', 'Stats': 'Statistiques', 'Your numbers': 'Vos chiffres',
    'Your encounters live in the Journal tab.': 'Vos observations vivent dans l’onglet Journal.',
    'Community and data': 'Communauté et données', 'Community': 'Communauté',
    'What’s near you this week': 'Près de chez vous cette semaine',
    'Ontario and Canada resources': 'Ressources de l’Ontario et du Canada', 'Trusted sites': 'Sites de confiance',
    'Data reliability': 'Fiabilité des données', 'Anomaly detection, a demo': 'Détection d’anomalies, une démo',
    'Privacy': 'Confidentialité', 'Private, on this phone': 'Privé, sur ce téléphone',
    'Appearance': 'Apparence', 'Theme': 'Thème', 'Auto': 'Auto', 'Light': 'Clair', 'Dark': 'Sombre',
    'Glass': 'Verre', 'Frosted bars and buttons': 'Barres et boutons givrés', 'Text size': 'Taille du texte',
    'Units': 'Unités', 'Metric': 'Métrique', 'Imperial': 'Impériale',
    'Language': 'Langue', 'Third tab': 'Troisième onglet', 'Include': 'Inclure',
    'A record of everything you have seen outside.': 'Le registre de tout ce que vous avez vu dehors.',
    'Start your life list': 'Commencez votre liste de vie',
    'Log what you see and it collects here: a timeline of your outings, a life list of the species you have found, and the places where you found them. Everything stays on this phone.': 'Notez ce que vous voyez et tout se rassemble ici: une chronologie de vos sorties, une liste de vie des espèces trouvées, et les lieux où vous les avez trouvées. Tout reste sur ce téléphone.',
    'Log your first encounter': 'Notez votre première observation',
    'encounter': 'observation', 'encounters': 'observations',
    'logged, all on this phone.': 'notées, tout sur ce téléphone.',
    'Category': 'Catégorie', 'Recently seen': 'Vues récemment', 'A to Z': 'A à Z',
    'first seen': 'vue la première fois',
    'species logged. Tap one to read your record of it.': 'espèces notées. Touchez-en une pour lire votre dossier.',
    'Nothing in this filter': 'Rien dans ce filtre',
    'No encounters match. Choose All to see everything.': 'Aucune observation ne correspond. Choisissez Tout pour tout voir.',
    'Search the guide': 'Chercher le guide',
    'species, every category and every provincial park. Searches stay on this phone.': 'espèces, chaque catégorie et chaque parc provincial. Les recherches restent sur ce téléphone.',
    'Notes. Where exactly, what it was doing, the weather…': 'Notes. Où exactement, ce qu’il faisait, la météo…',
    'Name': 'Nom', 'Your name': 'Votre nom',
    'Future of this project': 'L’avenir de ce projet',
    'Smart stickers are next: tap one of my stickers in the field and the right page opens in this app.': 'Les autocollants intelligents arrivent: touchez un de mes autocollants sur le terrain et la bonne page s’ouvre dans cette appli.',
    'Offline maps you download before the trip. Pick your park, carry the map with no signal, and get a campground map you can actually read, because the printed ones are hard to follow.': 'Des cartes hors ligne à télécharger avant le départ. Choisissez votre parc, gardez la carte sans signal, et ayez un plan de camping vraiment lisible, parce que les plans imprimés sont durs à suivre.',
    'Easier park entrances too, especially at parks like Hemlock where there are no signs. The long goal is to partner with a provincial park and pilot these features there.': 'Des entrées de parc plus simples aussi, surtout dans des parcs comme Hemlock où il n’y a aucun panneau. Le but à long terme est un partenariat avec un parc provincial pour y piloter ces fonctions.',
    'More from the Ontario outdoors': 'Plus du plein air ontarien',
    'Legal': 'Mentions légales', 'Privacy policy': 'Politique de confidentialité',
    'What stays on this phone, and what does not': 'Ce qui reste sur ce téléphone, et ce qui n’y reste pas',
    'Terms of use': 'Conditions d’utilisation',
    'Including what this app is not safe for': 'Y compris ce pour quoi cette appli n’est pas sûre',
    'Support': 'Assistance', 'Help, and how to reach me': 'Aide, et comment me joindre',
    'Not affiliated with Ontario Parks, the Government of Ontario, Parks Canada or Apple. Map images come from CARTO using OpenStreetMap data. Reference photos come from iNaturalist under their contributors\u2019 licences.': 'Sans lien avec Parcs Ontario, le gouvernement de l\u2019Ontario, Parcs Canada ou Apple. Les images de carte viennent de CARTO à partir des données OpenStreetMap. Les photos de référence viennent d\u2019iNaturalist sous les licences de leurs auteurs.',
    'Rate Ontario Parks campsites': 'Évaluez les emplacements des parcs de l’Ontario',
    'Zones, seasons and catch limits': 'Zones, saisons et limites de prise',
    'Three field guides for Ontario, built to match.': 'Trois guides de terrain pour l’Ontario, conçus pour s’accorder.',
    'Your data': 'Vos données', 'Export my log': 'Exporter mon journal', 'Your whole log in one file': 'Tout votre journal dans un fichier',
    'Import a backup': 'Importer une sauvegarde', 'From an exported file': 'Depuis un fichier exporté',
    'Reset all data': 'Réinitialiser toutes les données',
    'Import merges by id and skips anything already saved. Reset asks for confirmation twice.': 'L’import fusionne par identifiant et saute ce qui est déjà enregistré. La réinitialisation demande deux confirmations.',
    'About': 'À propos', 'Species in guide': 'Espèces dans le guide', 'Version': 'Version',
    'Apps, projects and the rest': 'Applis, projets et le reste',
    'on-fishing, the solo site': 'on-fishing, le site solo', 'The standalone zone map stays up': 'La carte des zones autonome reste en ligne',
    'Every row in this section is hidden. Use the edit button to show them again.': 'Chaque rangée de cette section est masquée. Utilisez le bouton de modification pour les afficher de nouveau.',
    'Drag the handle to reorder. Unchecked rows are hidden from this page and can be checked again any time.': 'Glissez la poignée pour réordonner. Les rangées décochées sont masquées de cette page et peuvent être recochées en tout temps.',
    'Edit': 'Modifier', 'Done': 'Terminé', 'Cancel': 'Annuler', 'Save': 'Enregistrer', 'Back': 'Retour',
    'Save Encounter': 'Enregistrer l’observation', 'Log Encounter': 'Noter une observation', 'Edit Encounter': 'Modifier l’observation',
    'What did you see?': 'Qu’avez-vous vu?', 'How did you see it?': 'Comment l’avez-vous vu?',
    'Choose a species': 'Choisir une espèce', 'Search the guide or add your own': 'Cherchez le guide ou ajoutez la vôtre',
    'Choose Species': 'Choisir l’espèce', 'Not in the guide': 'Pas dans le guide', 'Change': 'Changer',
    'Observation': 'Observation', 'How many': 'Combien', 'Caught': 'Pris', 'Seen': 'Vu', 'Saw': 'Vu', 'Heard': 'Entendu', 'Signs': 'Traces',
    'Where and when': 'Où et quand', 'Notes': 'Notes', 'Add a photo': 'Ajouter une photo',
    'Take one or choose from your library': 'Prenez-en une ou choisissez dans votre bibliothèque', 'Remove photo': 'Retirer la photo',
    'Choose a species first': 'Choisissez d’abord une espèce',
    'All': 'Tout', 'Wildlife': 'Faune', 'Bears': 'Ours', 'Hazards': 'Dangers', 'Parks': 'Parcs', 'Zones': 'Zones',
    'Layers': 'Couches', 'My location': 'Ma position', 'Report hazard': 'Signaler un danger', 'Report bear': 'Signaler un ours',
    'Report a Bear': 'Signaler un ours', 'Report a Hazard': 'Signaler un danger',
    'Map tiles need a connection. Your pins still show.': 'Les tuiles de carte demandent une connexion. Vos épingles restent visibles.',
    'Fishing zone boundaries need a connection. Your pins still show.': 'Les limites de zones de pêche demandent une connexion. Vos épingles restent visibles.',
    'Loading the map…': 'Chargement de la carte…', 'Map couldn’t load.': 'La carte n’a pas pu charger.',
    'Timeline': 'Chronologie', 'Life list': 'Liste de vie', 'Places': 'Lieux', 'Badges': 'Insignes',
    'Filter': 'Filtre',
    'Species caught': 'Espèces prises', 'This year': 'Cette année', 'Biggest': 'La plus grosse',
    'What is open now': 'Ouvert en ce moment', 'All 20 zones': 'Les 20 zones', 'Recent catches': 'Prises récentes',
    'No catches yet.': 'Pas encore de prises.', 'Latest lifer': 'Dernière coche', 'Birds in the guide': 'Oiseaux dans le guide',
    'Recent sightings': 'Observations récentes', 'No birds yet.': 'Pas encore d’oiseaux.',
    'Fishing is in the bar': 'La pêche est dans la barre', 'Birding is in the bar': 'Les oiseaux sont dans la barre',
    'Search species, categories, or a park': 'Cherchez espèces, catégories ou un parc',
    'Photos': 'Photos', 'Visibility': 'Visibilité', 'Sharing on': 'Partage activé', 'Sharing off': 'Partage désactivé'
  };
  function Lx(s) { return (app.settings && app.settings.lang === 'fr' && FR[s]) || s; }
  /* ---- Shared profile -------------------------------------------------
     The three outdoors apps live on one origin, so localStorage is shared.
     The display name lives under one JSON key, 'outdoors-profile' (shape
     {name: string}), that every app reads and writes. On first run after
     this update we silently migrate from the old per-app keys. */
  function loadProfile() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem('outdoors-profile') || 'null'); } catch (e) {}
    if (!p || typeof p.name !== 'string') {
      var name = '';
      try {
        name = (app.settings.displayName || '').trim() ||
          (localStorage.getItem('oncamp-name') || '').trim() ||
          (localStorage.getItem('onfish-name') || '').trim();
      } catch (e) {}
      p = { name: name };
      try { localStorage.setItem('outdoors-profile', JSON.stringify(p)); } catch (e) {}
    }
    app.profile = p;
  }
  function profileName() { return ((app.profile && app.profile.name) || '').trim(); }
  function saveProfileName(name) {
    app.profile = { name: String(name == null ? '' : name).trim() };
    try { localStorage.setItem('outdoors-profile', JSON.stringify(app.profile)); } catch (e) {}
  }
  /* ---- Shared appearance ----------------------------------------------
     One JSON key, 'outdoors-appearance', shared by every site on the origin:
     { theme, glass, palette, face, size }. The head script stamps the data
     attributes pre-paint; this is the same logic for live changes from the
     Appearance panel. An old per-app theme migrates into the key once, and
     so does one round of renames: a saved face "system" without the v2
     marker moves to the new Parks default, and palette "shore" becomes
     "parks". A System face picked after that carries v2 and sticks. */
  var APPEAR_KEY = 'outdoors-appearance';
  var APPEAR_DEFAULT = { theme: 'auto', glass: 'on', palette: 'parks', face: 'parks', size: 'm' };
  var APPEAR_VALID = {
    theme: ['auto', 'light', 'dark'],
    glass: ['on', 'off'],
    palette: ['parks', 'field', 'granite'],
    face: ['parks', 'system', 'rounded', 'serif', 'avenir', 'mono'],
    size: ['s', 'm', 'l', 'xl']
  };
  function loadAppearance() {
    var raw = null, save = false;
    try { raw = JSON.parse(localStorage.getItem(APPEAR_KEY) || 'null'); } catch (e) {}
    if (!raw || typeof raw !== 'object') {
      raw = {};
      var t = app.settings.theme;   // one-time migration of the old per-app theme
      if (t === 'light' || t === 'dark') raw.theme = t;
      save = true;
    }
    if (raw.face === 'system' && !raw.v2) { delete raw.face; raw.v2 = 1; save = true; }
    if (raw.palette === 'shore') { raw.palette = 'parks'; save = true; }
    if (save) { try { localStorage.setItem(APPEAR_KEY, JSON.stringify(raw)); } catch (e) {} }
    var a = {};
    for (var k in APPEAR_DEFAULT) {
      if (!APPEAR_DEFAULT.hasOwnProperty(k)) continue;
      a[k] = APPEAR_VALID[k].indexOf(raw[k]) >= 0 ? raw[k] : APPEAR_DEFAULT[k];
    }
    a.v2 = 1;   // every save from here on keeps the migration marker
    app.appearance = a;
  }
  function applyAppearance() {
    var root = document.documentElement, a = app.appearance;
    root.lang = app.settings.lang === 'fr' ? 'fr' : 'en';
    function stamp(attr, val, isDefault) {
      if (isDefault) root.removeAttribute(attr); else root.setAttribute(attr, val);
    }
    stamp('data-theme', a.theme, a.theme !== 'light' && a.theme !== 'dark');
    stamp('data-glass', 'off', a.glass !== 'off');
    // this app wears the parks look only: stored palettes and faces from
    // the sibling apps are read but never stamped here
    stamp('data-palette', '', true);
    stamp('data-face', '', true);
    stamp('data-textsize', a.size, a.size === 'm');
  }
  function setAppearance(key, val) {
    if (!APPEAR_VALID[key] || APPEAR_VALID[key].indexOf(val) < 0) return;
    app.appearance[key] = val;
    try { localStorage.setItem(APPEAR_KEY, JSON.stringify(app.appearance)); } catch (e) {}
    applyAppearance();
  }

  /* ------------------------------------------------------- Data helpers */
  var SPECIES = window.SPECIES || [];
  var CATEGORIES = window.CATEGORIES || [];
  var COMING_SOON = window.COMING_SOON || [];
  var LEARN = window.LEARN || { topics: {}, resources: [], hazardTypes: [] };
  var HAZARD_TYPES = LEARN.hazardTypes || [];
  function hazardType(id) { for (var i = 0; i < HAZARD_TYPES.length; i++) if (HAZARD_TYPES[i].id === id) return HAZARD_TYPES[i]; return HAZARD_TYPES[HAZARD_TYPES.length - 1] || { id: 'other', name: 'Hazard', emoji: '⚠️' }; }
  var BEAR_IDS = { 'american-black-bear': 1, 'polar-bear': 1 };
  function isBearEntry(e) { return e && (BEAR_IDS[e.speciesId] || e.bearReport); }
  var byId = {};
  SPECIES.forEach(function (s) { byId[s.id] = s; });
  function catMeta(id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i]; return null; }
  function subMeta(catId, subId) {
    var c = catMeta(catId); if (!c) return null;
    for (var i = 0; i < c.subs.length; i++) if (c.subs[i].id === subId) return c.subs[i];
    return null;
  }
  function isFloraCat(catId) { var c = catMeta(catId); return !!(c && c.flora); }
  function speciesInCat(catId) { return SPECIES.filter(function (s) { return s.cat === catId; }); }
  function speciesInSub(catId, subId) { return SPECIES.filter(function (s) { return s.cat === catId && s.sub === subId; }); }
  var seenRank = { common: 0, uncommon: 1, rare: 2 };
  function sortSpecies(list) {
    return list.slice().sort(function (a, b) {
      var r = (seenRank[a.seen] || 0) - (seenRank[b.seen] || 0);
      return r !== 0 ? r : a.name.localeCompare(b.name);
    });
  }
  function searchSpecies(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    return SPECIES.filter(function (s) {
      return s.name.toLowerCase().indexOf(q) >= 0 || s.sci.toLowerCase().indexOf(q) >= 0;
    }).slice(0, 40);
  }

  /* ------------------------------------------------ Fishing regulations
     on-fishing folded in: data/regulations.js rides along verbatim (the REG
     global), and the season parsing below is fishing's own open/closed logic,
     ported faithfully so both sites always agree on what is open today. */
  var REGS = (typeof REG !== 'undefined') ? REG : (window.REG || {});
  var REG_ZONES = [];
  (function () { for (var z = 1; z <= 20; z++) if (REGS[z]) REG_ZONES.push(z); })();
  var REG_MONTHS = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
  var REG_WD = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  var REG_ORD = { first: 1, '1st': 1, second: 2, '2nd': 2, third: 3, '3rd': 3, fourth: 4, '4th': 4, fifth: 5, '5th': 5 };
  function regNthWeekday(year, monthIdx, wd, n) {
    var d = new Date(year, monthIdx, 1), count = 0;
    while (d.getMonth() === monthIdx) { if (d.getDay() === wd) { count++; if (count === n) return new Date(d); } d.setDate(d.getDate() + 1); }
    return null;
  }
  function regParseToken(tok, year) {
    tok = tok.trim().toLowerCase();
    if (/before|after/.test(tok)) return null;
    if (/labour day/.test(tok)) return regNthWeekday(year, 8, 1, 1);
    var m = tok.match(/^(first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s+in\s+([a-z]+)/);
    if (m && REG_ORD[m[1]] != null && REG_WD[m[2]] != null && REG_MONTHS[m[3]] != null) return regNthWeekday(year, REG_MONTHS[m[3]], REG_WD[m[2]], REG_ORD[m[1]]);
    m = tok.match(/^([a-z]+)\s+(\d{1,2})/);
    if (m && REG_MONTHS[m[1]] != null) return new Date(year, REG_MONTHS[m[1]], parseInt(m[2], 10));
    return null;
  }
  function regRangesOf(season, year) {
    var s = season.toLowerCase();
    if (/open all year/.test(s)) return { allyear: 'open' };
    if (/closed all year/.test(s)) return { allyear: 'closed' };
    var ranges = [], unknown = false;
    season.split(/\s+and\s+/i).forEach(function (part) {
      var i = part.toLowerCase().indexOf(' to ');
      if (i < 0) { unknown = true; return; }
      var a = regParseToken(part.slice(0, i), year), b = regParseToken(part.slice(i + 4), year);
      if (!a || !b) { unknown = true; return; }
      ranges.push([new Date(a.getFullYear(), a.getMonth(), a.getDate()),
                   new Date(b.getFullYear(), b.getMonth(), b.getDate(), 23, 59, 59)]);
    });
    return { ranges: ranges, unknown: unknown };
  }
  function seasonStatus(season) {
    if (!season) return { status: 'unknown' };
    var now = new Date(), year = now.getFullYear(), r = regRangesOf(season, year);
    if (r.allyear) return { status: r.allyear };
    var open = false, activeEnd = null, nextStart = null;
    r.ranges.forEach(function (range) {
      var a = range[0], b = range[1];
      if (now >= a && now <= b) { open = true; if (!activeEnd || b < activeEnd) activeEnd = b; }
      if (a > now && (!nextStart || a < nextStart)) nextStart = a;
    });
    var DAY = 86400000;
    if (open) {
      var days = activeEnd ? Math.ceil((activeEnd - now) / DAY) : null;
      return { status: 'open', soon: (days != null && days <= 14) ? { type: 'closing', days: days } : null };
    }
    if (r.ranges.length) {
      var days2 = nextStart ? Math.ceil((nextStart - now) / DAY) : null;
      return { status: 'closed', soon: (days2 != null && days2 <= 14) ? { type: 'opening', days: days2 } : null };
    }
    return { status: 'unknown' };
  }
  /* One popularity order in every zone (fishing's), closed species first. */
  var REG_ORDER = ['Largemouth and Smallmouth Bass combined', 'Largemouth Bass', 'Smallmouth Bass',
    'Walleye and Sauger combined', 'Northern Pike', 'Yellow Perch', 'Sunfish', 'Crappie', 'Muskellunge',
    'Lake Trout', 'Lake Trout and Splake', 'Brook Trout', 'Rainbow Trout', 'Brown Trout and Rainbow Trout',
    'Brown Trout', 'Splake', 'Lake Whitefish', 'Channel Catfish', 'Atlantic Salmon', 'Pacific Salmon',
    'Lake Herring (Cisco)', 'Lake Sturgeon', 'Aggregate Limits for Trout and Salmon'];
  var REG_ORDER_IX = {}; REG_ORDER.forEach(function (n, i) { REG_ORDER_IX[n] = i; });
  function regRankName(a, b) {
    var ia = REG_ORDER_IX[a] != null ? REG_ORDER_IX[a] : 900, ib = REG_ORDER_IX[b] != null ? REG_ORDER_IX[b] : 900;
    return ia - ib || a.localeCompare(b);
  }
  function regBySpecies(a, b) {
    var ca = seasonStatus(a.season).status === 'closed' ? 0 : 1;
    var cb = seasonStatus(b.season).status === 'closed' ? 0 : 1;
    return ca - cb || regRankName(a.species, b.species);
  }
  function regStatusLabel(st) { return st === 'open' ? 'Open' : st === 'closed' ? 'Closed' : 'Check'; }
  function regStatusBadge(st) {
    var cls = st === 'open' ? 'badge-open' : st === 'closed' ? 'badge-danger' : 'badge-info';
    return '<span class="badge ' + cls + '" style="flex-shrink:0">' + regStatusLabel(st) + '</span>';
  }
  /* Wildlife fish species id -> the substrings fishing matches regulation
     names on. Only the gamefish both apps carry; anything else shows nothing. */
  var FISH_REG_MATCH = {
    'walleye': ['walleye'],
    'sauger': ['sauger'],
    'largemouth-bass': ['largemouth'],
    'smallmouth-bass': ['smallmouth'],
    'northern-pike': ['northern pike'],
    'muskellunge': ['muskellunge'],
    'yellow-perch': ['yellow perch'],
    'black-crappie': ['crappie'],
    'white-crappie': ['crappie'],
    'bluegill': ['sunfish'],
    'pumpkinseed': ['sunfish'],
    'rock-bass': ['sunfish'],
    'brook-trout': ['brook trout'],
    'brown-trout': ['brown trout'],
    'rainbow-trout': ['rainbow trout'],
    'lake-trout': ['lake trout'],
    'splake': ['splake'],
    'atlantic-salmon': ['atlantic salmon'],
    'chinook-salmon': ['pacific salmon'],
    'coho-salmon': ['pacific salmon'],
    'pink-salmon': ['pacific salmon'],
    'channel-catfish': ['channel catfish'],
    'lake-whitefish': ['lake whitefish'],
    'cisco': ['lake herring'],
    'lake-sturgeon': ['lake sturgeon']
  };
  var _regMap = null;
  function regSpeciesMap() {
    if (_regMap) return _regMap;
    _regMap = {};
    REG_ZONES.forEach(function (z) {
      (REGS[z].species_regulations || []).forEach(function (r) {
        (_regMap[r.species] = _regMap[r.species] || {})[z] = { season: r.season, limits: r.limits };
      });
    });
    return _regMap;
  }
  /* Faithful port of fishing's fishRegInfo zone merge: a species can be
     regulated alone in one zone and as a combined group in another, so its
     zones come from every regulation name its matchers hit. */
  function fishRegForSpecies(id) {
    var matchers = FISH_REG_MATCH[id];
    if (!matchers || !REG_ZONES.length) return null;
    var map = regSpeciesMap(), merged = {}, regNames = [], any = false;
    Object.keys(map).forEach(function (n) {
      if (/^aggregate limits/i.test(n)) return;
      var s = n.toLowerCase(), hit = false;
      for (var i = 0; i < matchers.length; i++) if (s.indexOf(matchers[i]) >= 0) { hit = true; break; }
      if (!hit) return;
      var touched = false;
      REG_ZONES.forEach(function (z) {
        if (map[n][z] && !merged[z]) { merged[z] = { rec: map[n][z], reg: n }; touched = true; any = true; }
      });
      if (touched) regNames.push(n);
    });
    return any ? { merged: merged, regNames: regNames } : null;
  }
  /* Reverse door: a regulation name back to the wildlife species page. */
  function wlSpeciesForReg(regName) {
    var s = regName.toLowerCase();
    for (var id in FISH_REG_MATCH) {
      if (!FISH_REG_MATCH.hasOwnProperty(id) || !byId[id]) continue;
      var m = FISH_REG_MATCH[id];
      for (var i = 0; i < m.length; i++) if (s.indexOf(m[i]) >= 0) return id;
    }
    return null;
  }
  /* ON Fishing's catch-log species names -> wildlife species ids. */
  var ONFISH_NAME_TO_WL = {
    'walleye': 'walleye', 'sauger': 'sauger',
    'largemouth bass': 'largemouth-bass', 'smallmouth bass': 'smallmouth-bass',
    'northern pike': 'northern-pike', 'muskellunge': 'muskellunge',
    'yellow perch': 'yellow-perch', 'crappie': 'black-crappie',
    'bluegill and pumpkinseed': 'bluegill', 'rock bass': 'rock-bass',
    'brook trout': 'brook-trout', 'brown trout': 'brown-trout',
    'rainbow trout': 'rainbow-trout', 'lake trout': 'lake-trout',
    'splake': 'splake', 'atlantic salmon': 'atlantic-salmon',
    'chinook and coho salmon': 'chinook-salmon', 'channel catfish': 'channel-catfish',
    'lake whitefish': 'lake-whitefish', 'cisco (lake herring)': 'cisco',
    'lake sturgeon': 'lake-sturgeon'
  };

  /* --------------------------------------------------------- Date format */
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function fmtTime(iso) {
    var d = new Date(iso);
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM'; h = h % 12; if (h === 0) h = 12;
    return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
  }
  function fmtDay(iso) {
    var d = startOfDay(iso), today = startOfDay(new Date());
    var diff = Math.round((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    var opts = { weekday: 'short', month: 'short', day: 'numeric' };
    if (d.getFullYear() !== today.getFullYear()) opts.year = 'numeric';
    return d.toLocaleDateString('en-CA', opts);
  }
  // "August 2026", and the French room gets the month name from fr-CA rather
  // than a dictionary entry per month.
  function fmtMonth(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(app.settings.lang === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric' });
  }
  function localDatetimeValue(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ------------------------------------------------------------- Toast */
  var toastTimer;
  function toast(msg) {
    var root = $('#toast-root');
    root.innerHTML = '<div class="toast" id="the-toast">' + esc(msg) + '</div>';
    var t = $('#the-toast');
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  // Toast with an Undo action, for reversible destructive actions.
  var toastAction;
  function toastUndo(msg, onUndo) {
    var root = $('#toast-root');
    root.innerHTML = '<div class="toast toast-action" id="the-toast">' +
      '<span>' + esc(msg) + '</span>' +
      '<button type="button" class="toast-btn" id="toast-undo">Undo</button></div>';
    var t = $('#the-toast');
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastAction = onUndo;
    $('#toast-undo').addEventListener('click', function () {
      clearTimeout(toastTimer);
      t.classList.remove('show');
      var cb = toastAction; toastAction = null;
      if (cb) cb();
    });
    toastTimer = setTimeout(function () { t.classList.remove('show'); toastAction = null; }, 5000);
  }

  /* ---------------------------------------------------------- UI pieces */
  function statusBadge(s) {
    if (s.caution) return '<span class="badge badge-danger">⚠ ' + esc(s.status) + '</span>';
    if (s.atRisk) return '<span class="badge badge-risk">✧ ' + esc(s.status) + '</span>';
    return '<span class="badge badge-ok">' + esc(s.status) + '</span>';
  }
  function tintFor(catId) { var c = catMeta(catId); return c ? c.color : 'var(--tint)'; }

  function speciesCell(s, opts) {
    opts = opts || {};
    var logged = opts.loggedIds && opts.loggedIds[s.id];
    var right = opts.right != null ? opts.right :
      '<span class="chevron">' + I.chevron + '</span>';
    var sub = opts.sub != null ? opts.sub : ('<i>' + esc(s.sci) + '</i>');
    // Browsing the guide doubles as working a checklist, so a species you have
    // logged wears a quiet tick rather than a loud badge.
    var tick = logged ? '<span class="seen-tick" role="img" aria-label="in your journal">' + I.check + '</span>' : '';
    if (opts.card) {
      // Journal's entry-card voice: bold name, one secondary line, a
      // metadata footer whose ellipsis opens real actions. The whole
      // card navigates through a stretched cover link, so the ellipsis
      // can be a true button rather than a control inside a link.
      return '<div class="cell tap">' +
        '<span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body">' +
        '<a class="cell-cover" href="#/species/' + esc(s.id) + '" aria-label="' + esc(s.name) + '"></a>' +
        '<span class="cell-title">' + esc(s.name) + tick + '</span>' +
        '<span class="cell-sub"><i>' + esc(s.sci) + '</i></span>' +
        '<span class="cell-foot"><span class="meta">' + esc(seenLabel(s.seen)) + (s.atRisk ? ' · ' + Lx('At risk') : '') + '</span>' +
        '<button type="button" class="cell-more" data-action="species-menu" data-id="' + esc(s.id) + '" aria-label="' + Lx('More') + ': ' + esc(s.name) + '">' + spriteIcon('ellipsis') + '</button></span>' +
        '</span></div>';
    }
    return '<a class="cell tap" href="#/species/' + esc(s.id) + '">' +
      '<span class="cell-emoji">' + s.emoji + '</span>' +
      '<span class="cell-body"><span class="cell-title">' + esc(s.name) + tick +
      '</span><span class="cell-sub">' + sub + '</span></span>' +
      right + '</a>';
  }

  function loggedIdSet() {
    var m = {};
    journalEntries().forEach(function (e) { if (e.speciesId) m[e.speciesId] = true; });
    return m;
  }

  /* ---------------------------------------------- iOS chrome (header, rows) */
  function spriteIcon(name) {
    return '<svg aria-hidden="true"><use href="assets/icons.svg#' + name + '"/></svg>';
  }
  // The avatar shows the first letter of the shared profile name, or a person
  // glyph until a name is set.
  function avatarInner() {
    var n = profileName();
    return n ? esc(n.charAt(0).toUpperCase()) : spriteIcon('user');
  }
  // Sticky chrome for root screens: 44px circular avatar on the left, 44px
  // circular glass buttons (log + search) on the right. The 34px large title
  // stays in the flow below this bar.
  function iosHeaderHtml(noActions) {
    return '<header class="ios-header"><div class="ios-header-row">' +
      '<a class="ios-avatar" id="header-avatar" href="#/account" aria-label="' + Lx('Account') + '">' + avatarInner() + '</a>' +
      // the brand name only shows on big screens; the desktop layer in
      // ios.css owns its visibility
      '<span class="ios-brand">on-wildlife</span>' +
      // screens that carry their own tools (Map, More) skip the pair
      (noActions ? '' : '<div class="ios-header-actions">' +
      '<button class="ios-glass-btn" type="button" data-action="open-log" aria-label="' + Lx('Log an encounter') + '">' + spriteIcon('plus') + '</button>' +
      '<a class="ios-glass-btn" href="#/search" aria-label="' + Lx('Search') + '">' + spriteIcon('search') + '</a>' +
      '</div>') + '</div></header>';
  }
  /* One settings-style row in the new system. opts: href or action (or neither
     for a static row), tile: [colour, icon], title, sub, value, chevron:false,
     ext:true for external links. */
  function iosRow(opts) {
    var lead = opts.tile
      ? '<span class="ios-tile ios-tile--' + opts.tile[0] + '" aria-hidden="true">' + spriteIcon(opts.tile[1]) + '</span>'
      : '';
    var body = '<span class="ios-row-body"><span class="ios-row-title">' + esc(opts.title) + '</span>' +
      (opts.sub ? '<span class="ios-row-sub">' + esc(opts.sub) + '</span>' : '') + '</span>';
    var tail = (opts.value != null ? '<span class="ios-row-value">' + esc(String(opts.value)) + '</span>' : '') +
      (opts.chevron === false ? '' : '<span class="ios-chevron" aria-hidden="true">' + spriteIcon('chevron-right') + '</span>');
    var cls = 'ios-row' + (opts.tile ? '' : ' ios-row--plain') + (opts.danger ? ' ios-row--danger' : '');
    if (opts.action) {
      return '<button type="button" class="' + cls + '" data-action="' + esc(opts.action) + '">' + lead + body + tail + '</button>';
    }
    if (opts.href) {
      return '<a class="' + cls + '" href="' + esc(opts.href) + '"' +
        (opts.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + lead + body + tail + '</a>';
    }
    return '<div class="' + cls + '">' + lead + body + tail + '</div>';
  }
  function spinnerHtml() {
    var blades = '';
    for (var i = 0; i < 8; i++) blades += '<span style="transform:rotate(' + (i * 45) + 'deg);animation-delay:' + (-0.8 + i * 0.1).toFixed(1) + 's"></span>';
    return '<span class="ios-spinner" role="img" aria-label="' + Lx('Loading') + '">' + blades + '</span>';
  }
  function sectionTitle(t) { return '<h2 class="ios-section-title">' + esc(t) + '</h2>'; }

  /* ---- sections, the github home way: a named card of rows whose owner
     picks what is in it and in what order, from the ellipsis edit sheet.
     Saved per section under settings.sections as [{id, on}]. ---- */
  var SECTION_DEFS = {
    'guide-cats': { title: 'Ontario Wildlife', items: function () { return CATEGORIES.map(function (c) { return { id: c.id, label: c.name, emoji: c.emoji }; }); } },
    'more-learn': { title: 'Learn', items: function () { return [
      { id: 'learn', label: 'Learn and safety' },
      { id: 'invasives', label: 'Invasive species' }
    ]; } },
    'more-journal': { title: 'Your journal', items: function () { return [
      { id: 'stats', label: 'Stats' }
    ]; } },
    'more-community': { title: 'Community and data', items: function () { return [
      { id: 'community', label: 'Community' },
      { id: 'resources', label: 'Ontario and Canada resources' },
      { id: 'trust', label: 'Data reliability' },
      { id: 'privacy', label: 'Privacy' }
    ]; } }
  };
  // saved order first (dropping ids the app no longer has), then anything new
  function sectionOrder(key) {
    var defs = SECTION_DEFS[key].items();
    var saved = (app.settings.sections || {})[key] || [];
    var out = [], seen = {};
    saved.forEach(function (s) {
      for (var i = 0; i < defs.length; i++) {
        if (defs[i].id === s.id && !seen[s.id]) { seen[s.id] = 1; out.push({ def: defs[i], on: s.on !== false }); }
      }
    });
    defs.forEach(function (d) { if (!seen[d.id]) out.push({ def: d, on: true }); });
    return out;
  }
  function sectionHead(key) {
    var t = SECTION_DEFS[key].title;
    return '<div class="sec-head"><h2 class="ios-section-title">' + esc(Lx(t)) + '</h2>' +
      '<button type="button" class="sec-edit" data-action="edit-section" data-key="' + key + '" aria-label="' + Lx('Edit') + ' ' + esc(Lx(t)) + '">' + spriteIcon('ellipsis') + '</button></div>';
  }
  function openSectionEditor(key) {
    app._secKey = key;
    app._secDraft = sectionOrder(key).map(function (r) { return { id: r.def.id, on: r.on }; });
    var defs = {};
    SECTION_DEFS[key].items().forEach(function (d) { defs[d.id] = d; });
    var body = '<div class="group"><div class="list" id="sec-rows">';
    app._secDraft.forEach(function (r) {
      var d = defs[r.id];
      body += '<div class="secedit-row' + (r.on ? ' on' : '') + '" data-id="' + esc(r.id) + '">' +
        '<button type="button" class="secedit-check" data-action="sec-toggle" data-id="' + esc(r.id) + '" role="checkbox" aria-checked="' + (r.on ? 'true' : 'false') + '" aria-label="' + Lx('Include') + ' ' + esc(Lx(d.label)) + '">' + spriteIcon('check') + '</button>' +
        (d.emoji ? '<span class="secedit-tile">' + d.emoji + '</span>' : '') +
        '<span class="secedit-label">' + esc(Lx(d.label)) + '</span>' +
        '<span class="secedit-handle" data-drag="' + esc(r.id) + '" aria-hidden="true">' + spriteIcon('grip') + '</span>' +
        '</div>';
    });
    body += '</div></div><p class="ios-group-foot">' + Lx('Drag the handle to reorder. Unchecked rows are hidden from this page and can be checked again any time.') + '</p>';
    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Edit ' + esc(SECTION_DEFS[key].title) + '"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">' + Lx('Edit') + ' ' + esc(Lx(SECTION_DEFS[key].title)) + '</span>' +
      '<button class="nav-btn bold" data-action="sec-done">' + Lx('Done') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { var s = $('#sheet'); if (s) s.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
    afterSheetOpen();
    wireSecDrag();
  }
  // pointer-drag reorder: the row follows the finger, siblings swap under it
  function wireSecDrag() {
    var list = $('#sec-rows'); if (!list) return;
    var row = null, startY = 0, activeId = null;
    function place(ev) { row.style.transform = 'translateY(' + (ev.clientY - startY) + 'px)'; }
    list.addEventListener('pointerdown', function (ev) {
      if (row) return;   // one drag at a time; a second finger is ignored
      var h = ev.target.closest('[data-drag]'); if (!h) return;
      row = h.closest('.secedit-row');
      startY = ev.clientY;
      activeId = ev.pointerId;
      row.classList.add('dragging');
      try { h.setPointerCapture(ev.pointerId); } catch (e) {}
      ev.preventDefault();
    });
    list.addEventListener('pointermove', function (ev) {
      if (!row || ev.pointerId !== activeId) return;
      place(ev);
      var sibs = [].slice.call(list.children);
      var i = sibs.indexOf(row);
      var r = row.getBoundingClientRect();
      var prev = sibs[i - 1], next = sibs[i + 1];
      if (prev && r.top + r.height / 2 < prev.getBoundingClientRect().top + prev.offsetHeight / 2) {
        list.insertBefore(row, prev);
        startY -= prev.offsetHeight;
        place(ev);
      } else if (next && r.top + r.height / 2 > next.getBoundingClientRect().top + next.offsetHeight / 2) {
        list.insertBefore(next, row);
        startY += next.offsetHeight;
        place(ev);
      }
    });
    function drop(ev) {
      if (!row || (ev && ev.pointerId !== activeId)) return;
      row.style.transform = '';
      row.classList.remove('dragging');
      var order = [].map.call(list.children, function (r) { return r.getAttribute('data-id'); });
      app._secDraft.sort(function (a, b) { return order.indexOf(a.id) - order.indexOf(b.id); });
      row = null; activeId = null;
    }
    list.addEventListener('pointerup', drop);
    list.addEventListener('pointercancel', drop);
  }

  /* --------------------------------------------------------- Screen frame
     Builds a nav bar + optional large title + body, and wires scroll fade. */
  // ---- iOS-style navigation transitions ----
  var TAB_ROOTS = { explore: 1, map: 1, journal: 1, more: 1, 'fishing-hub': 1, birding: 1 };
  // tab taps create history entries; safari re-applies each entry's saved
  // scroll AFTER our reset unless restoration is manual
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function reduceMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  // Decide push vs pop vs tab-switch vs same-screen re-render from the hash + a stack.
  function navDirection() {
    if (!app.nav) app.nav = { stack: [] };
    var hash = location.hash || '#/explore';
    var parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var top = parts[0] || 'explore';
    var s = app.nav.stack;
    if (parts.length <= 1 && TAB_ROOTS[top]) {           // a bottom-tab root
      var same = s.length && s[s.length - 1] === hash;
      app.nav.stack = [hash];
      return same ? 'none' : 'tab';
    }
    var idx = s.lastIndexOf(hash);
    if (idx >= 0 && idx === s.length - 1) return 'none';  // same screen, a re-render
    if (idx >= 0) { s.length = idx + 1; return 'pop'; }   // returning to an earlier screen
    s.push(hash); if (s.length > 50) s.shift();
    return 'push';
  }
  // Mount new screen HTML with the right transition. Push/pop overlay two screens
  // briefly; tab and re-render just swap in place (the .screen fade handles it).
  function mountScreen(html, dir) {
    var appEl = $('#app');
    var existing = appEl.querySelectorAll('.screen');
    if (existing.length > 1) { for (var i = 0; i < existing.length - 1; i++) existing[i].remove(); appEl.classList.remove('nav-animating'); }
    var oldScreen = appEl.querySelector('.screen');
    if (!oldScreen || dir === 'none' || dir === 'tab' || reduceMotion()) {
      appEl.innerHTML = html; window.scrollTo(0, 0);
      // belt and braces: land on top even if the browser scrolls late
      requestAnimationFrame(function () { window.scrollTo(0, 0); });
      return;
    }
    var side = dir === 'push' ? 'sc-from-right' : 'sc-from-left';
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var newScreen = tmp.firstElementChild;
    if (!newScreen) { appEl.innerHTML = html; window.scrollTo(0, 0); return; }
    newScreen.classList.add('sc-anim', side);
    var sy = window.scrollY || window.pageYOffset || 0;
    appEl.classList.add('nav-animating');
    oldScreen.classList.add('sc-anim');
    oldScreen.style.top = (-sy) + 'px';                  // freeze old content in place while page scrolls to 0
    appEl.appendChild(newScreen);
    window.scrollTo(0, 0);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        newScreen.classList.remove(side);
        oldScreen.classList.add(dir === 'push' ? 'sc-exit-left' : 'sc-exit-right');
      });
    });
    var done = false;
    var cleanup = function () {
      if (done) return; done = true;
      if (oldScreen && oldScreen.parentNode) oldScreen.parentNode.removeChild(oldScreen);
      appEl.classList.remove('nav-animating');
      newScreen.classList.remove('sc-anim'); newScreen.style.top = '';
      updateNav();
    };
    var t = setTimeout(cleanup, 420);
    newScreen.addEventListener('transitionend', function h(e) { if (e.propertyName === 'transform') { clearTimeout(t); newScreen.removeEventListener('transitionend', h); cleanup(); } });
  }
  function backLabel(t) { return String(t == null ? 'Back' : t); }
  /* iOS swaps a back label for the word "Back" when the real one will not fit
     beside the title. Character counts cannot predict that, since it depends on
     how wide the title itself renders, so measure the two once the screen is in
     the DOM. Without this, "Waterfowl & Water Birds" runs under "Common Loon". */
  function fitBackLabel() {
    // Mid push/pop both the outgoing and incoming screens carry an id="nav", so
    // scope to the newest screen or this measures the one on its way out. The
    // incoming screen is still translated aside, which moves the label and the
    // title together and so leaves the comparison between them valid.
    var screens = document.querySelectorAll('#app .screen');
    var root = screens[screens.length - 1];
    if (!root) return;
    var left = root.querySelector('.nav-left'), title = root.querySelector('.nav-title');
    if (!left || !title) return;
    var lbl = left.querySelector('.lbl');
    if (!lbl || lbl.getAttribute('data-fit')) return;
    if (left.getBoundingClientRect().right + 8 > title.getBoundingClientRect().left) {
      lbl.textContent = 'Back';
      lbl.setAttribute('data-fit', '1');
    }
  }
  function screen(cfg) {
    var nav;
    if (cfg.header) {
      // Root screens carry the shared iOS header instead of a nav-bar row.
      nav = iosHeaderHtml(cfg.actions === false);
    } else {
      // Pushed screens carry a floating glass back circle, chevron only;
      // the destination lives on in the aria-label.
      var backAria = esc(Lx('Back')) + (cfg.backText ? ': ' + esc(backLabel(cfg.backText)) : '');
      var navLeft = cfg.back
        ? '<div class="nav-left"><a class="nav-btn nav-circle" href="' + esc(cfg.back) + '" aria-label="' + backAria + '">' + I.back + '</a></div>'
        : cfg.backAction
          ? '<div class="nav-left"><button class="nav-btn nav-circle" data-action="nav-back" aria-label="' + backAria + '">' + I.back + '</button></div>'
          : (cfg.navLeft ? '<div class="nav-left">' + cfg.navLeft + '</div>' : '');
      var navRight = cfg.navRight ? '<div class="nav-right">' + cfg.navRight + '</div>' : '';
      // cfg.cover hides the inline title until content scrolls, so a
      // full-bleed hero owns the top of the screen (has-large reuses
      // the existing show-title machinery).
      nav = '<div class="nav' + (cfg.large || cfg.cover ? ' has-large' : '') + '" id="nav">' +
        '<div class="nav-row">' + navLeft +
        '<div class="nav-title"' + (cfg.large ? '' : ' role="heading" aria-level="1"') + '>' + esc(cfg.title || '') + '</div>' + navRight +
        '</div></div>';
    }
    var large = cfg.large
      ? '<div class="large-title"><div class="large-head"><h1>' + esc(cfg.title) + '</h1>' +
        (cfg.version ? '<button class="ver" data-action="version-tap">' + esc(cfg.version) + '</button>' : '') + '</div>' +
        (cfg.subtitle ? '<div class="subtitle">' + esc(cfg.subtitle) + '</div>' : '') + '</div>'
      : '';
    var tail = cfg.bare ? '' : '<div class="spacer-lg"></div>';
    // The stack always advances, but browser-driven navigation (native swipe,
    // back/forward) renders with no animation of ours on top of Safari's.
    var dir = navDirection();
    if (app._browserNav && (dir === 'push' || dir === 'pop')) dir = 'none';
    app._browserNav = false;
    mountScreen('<div class="screen' + (cfg.header ? '' : ' is-push') + '">' + nav + large + cfg.body + tail + '</div>', dir);
    fitBackLabel();
    updateNav();
  }
  /* The blended header is transparent at rest and only frosts once content
     runs underneath, so BOTH kinds of top chrome (the root screens'
     .ios-header and pushed screens' .nav) need the scrolled class stamped
     past 8px. Scope to the newest screen: mid push/pop two screens exist. */
  function updateNav() {
    var y = window.scrollY || window.pageYOffset || 0;
    var on = y > 8;
    var screens = document.querySelectorAll('#app .screen');
    var root = screens.length ? screens[screens.length - 1] : null;
    if (!root) return;
    var hdr = root.querySelector('.ios-header');
    if (hdr) hdr.classList.toggle('scrolled', on);
    var nav = root.querySelector('.nav');
    if (nav) {
      nav.classList.toggle('scrolled', on);
      if (nav.classList.contains('has-large')) {
        if (y > 34) nav.classList.add('show-title'); else nav.classList.remove('show-title');
      }
    }
    // The list-screen FAB ducks away while scrolling down and springs
    // back the moment the direction turns.
    var fab = root.querySelector('.fab-log');
    if (fab && !reduceMotion()) {
      var last = app._fabY || 0;
      if (y < 40 || y < last - 4) fab.classList.remove('fab-hide');
      else if (y > last + 4) fab.classList.add('fab-hide');
    }
    app._fabY = y;
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  // settings taps re-render the same screen in place: same scroll spot,
  // no entry animation replay
  function rerenderKeepScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    route();
    // the class rides the mounted screen itself: removing it later would
    // restart the entry animation, so it simply stays until the next nav
    var scr = document.querySelector('#app .screen:last-child');
    if (scr) scr.classList.add('no-anim');
    requestAnimationFrame(function () {
      window.scrollTo(0, y);
      updateNav();
    });
  }

  /* ============================================================ SCREENS */

  // Legacy #/log route now lands on the Guide, which carries the log button.
  function viewLog() { if (location.hash.indexOf('#/log') === 0) { location.replace('#/explore'); return; } viewExplore(); }
  function recentIn(pred, n) {
    return app.entries.filter(pred).sort(function (a, b) { return new Date(b.when) - new Date(a.when); }).slice(0, n || 6);
  }
  function recentGroup(title, list) {
    if (!list.length) return '';
    var h = sectionTitle(title) + '<div class="group"><div class="list">';
    list.forEach(function (e) { h += entryCell(e); });
    return h + '</div><div class="group-footer"><a href="#/mylog">' + Lx('See all encounters ›') + '</a></div></div>';
  }
  // Timely, season-aware highlight for the current month (deterministic, offline)
  function seasonalNote() {
    var notes = [
      { t: 'Deep winter. Watch for snowy owls, winter finches, and fresh tracks in the snow.', s: ['snowy-owl', 'black-capped-chickadee', 'red-fox'] },
      { t: 'Late winter. Great horned owls are nesting and calling at dusk.', s: ['great-horned-owl', 'white-tailed-deer', 'snowshoe-hare'] },
      { t: 'Early spring. The first spring peepers call and maple sap runs.', s: ['spring-peeper', 'sugar-maple', 'american-robin'] },
      { t: 'Spring migration. Waterfowl and early songbirds return, and trilliums come up.', s: ['common-loon', 'white-trillium', 'red-winged-blackbird'] },
      { t: 'Peak migration and bloom. Songbirds pour through and turtles begin nesting.', s: ['baltimore-oriole', 'snapping-turtle', 'white-trillium'] },
      { t: 'Turtles are crossing roads to nest. Help them across in the direction they are heading.', s: ['snapping-turtle', 'blandings-turtle', 'common-loon'] },
      { t: 'High summer. Monarchs on milkweed, dragonflies everywhere, young birds fledging.', s: ['common-milkweed', 'walleye', 'great-blue-heron'] },
      { t: 'Late summer. Berries ripen and fish feed best in the cool mornings.', s: ['staghorn-sumac', 'smallmouth-bass', 'monarch'] },
      { t: 'Fall migration and colour. Hawks stream south and the maples turn.', s: ['sugar-maple', 'bald-eagle', 'white-tailed-deer'] },
      { t: 'Autumn. The deer rut begins and salmon run up the Great Lakes rivers.', s: ['white-tailed-deer', 'chinook-salmon', 'moose'] },
      { t: 'Late fall. Moose are active and waterfowl stage before freeze-up.', s: ['moose', 'canada-goose', 'common-loon'] },
      { t: 'Winter arrives. Chickadees crowd feeders and owls hunt the short days.', s: ['black-capped-chickadee', 'snowy-owl', 'snowshoe-hare'] }
    ];
    return notes[new Date().getMonth()];
  }
  function seasonalCard() {
    var sn = seasonalNote();
    var loggedSet = {}; app.entries.forEach(function (e) { if (e.speciesId) loggedSet[e.speciesId] = 1; });
    var suggest = sn.s.filter(function (id) { return byId[id] && !loggedSet[id]; })[0];
    var h = sectionTitle(Lx('This month in Ontario')) + '<div class="group"><div class="list">' +
      '<div class="cell"><span class="cell-emoji">\u{1F4C5}</span><span class="cell-body"><span class="cell-sub" style="white-space:normal;font-size:15px;color:var(--label)">' + esc(sn.t) + '</span></span></div>';
    if (suggest) {
      var s = byId[suggest];
      h += '<a class="cell tap" href="#/species/' + esc(suggest) + '"><span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">Look for ' + (/^[aeiou]/i.test(s.name) ? 'an ' : 'a ') + esc(s.name) + '</span>' +
        '<span class="cell-sub">Around now, not in your journal yet</span></span><span class="chevron">' + I.chevron + '</span></a>';
    }
    return h + '</div></div>';
  }

  function stat(n, l) { return '<div class="stat"><div class="n">' + n + '</div><div class="l">' + esc(l) + '</div></div>'; }
  // Same tile, but the whole card is the tap target rather than a small link,
  // so all three are comfortably bigger than a thumb.
  function statLink(n, l) { return '<a class="stat tap" href="#/stats"><div class="n">' + n + '</div><div class="l">' + esc(l) + '</div></a>'; }
  function catsSeen() { var m = {}; journalEntries().forEach(function (e) { if (e.cat) m[e.cat] = 1; }); return Object.keys(m).length; }
  function learnCell(emoji, title, sub, topicId) {
    return '<a class="cell tap" href="#/learn/' + esc(topicId) + '">' +
      (emoji ? '<span class="cell-emoji">' + emoji + '</span>' : '') +
      '<span class="cell-body"><span class="cell-title">' + esc(title) + '</span>' +
      '<span class="cell-sub">' + esc(sub) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a>';
  }
  function linkCell(label, url, note) {
    return '<a class="cell tap" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.link + '</span>' +
      '<span class="cell-body"><span class="cell-title">' + esc(label) + '</span>' +
      (note ? '<span class="cell-sub">' + esc(note) + '</span>' : '') + '</span></a>';
  }

  /* ---- Badges ---- */
  var BADGES = window.BADGES || [];
  function badgeCtx() {
    var e = app.entries;
    var sp = {}, cats = {}, fish = 0, birds = 0, rept = 0, amph = 0, flora = 0, released = 0, photos = 0, located = 0, turtle = false;
    var seasons = {}, atRisk = false, earlyBird = false, nightOwl = false, emblems = {};
    e.forEach(function (x) {
      if (x.speciesId) sp[x.speciesId] = 1;
      if (x.cat) cats[x.cat] = 1;
      if (x.cat === 'fish') fish++; else if (x.cat === 'birds') birds++; else if (x.cat === 'reptiles') rept++;
      else if (x.cat === 'amphibians') amph++; else if (x.cat === 'trees' || x.cat === 'plants') flora++;
      if (x.sub === 'turtles') turtle = true;
      if (x.fish && x.fish.released) released++;
      if (x.photo) photos++;
      if (typeof x.lat === 'number') located++;
      var d = new Date(x.when), m = d.getMonth(), h = d.getHours();
      seasons[m >= 2 && m <= 4 ? 'sp' : m >= 5 && m <= 7 ? 'su' : m >= 8 && m <= 10 ? 'fa' : 'wi'] = 1;
      if (x.cat === 'birds' && h < 7) earlyBird = true;
      if (h >= 22 || h < 4) nightOwl = true;
      var s = byId[x.speciesId]; if (s && s.atRisk) atRisk = true;
      if (x.speciesId === 'common-loon' || x.speciesId === 'white-trillium' || x.speciesId === 'eastern-white-pine') emblems[x.speciesId] = 1;
    });
    return {
      total: e.length, species: Object.keys(sp).length, cats: cats, catsN: Object.keys(cats).length,
      fish: fish, birds: birds, reptiles: rept, amph: amph, flora: flora, released: released,
      photos: photos, located: located, seasons: Object.keys(seasons).length, atRisk: atRisk,
      earlyBird: earlyBird, nightOwl: nightOwl, emblems: Object.keys(emblems).length, turtle: turtle,
      reports: app.hazards.length + app.entries.filter(isBearEntry).length
    };
  }
  function earnedBadgeIds() {
    var c = badgeCtx(), out = [];
    BADGES.forEach(function (b) { try { if (b.test(c)) out.push(b.id); } catch (e) {} });
    return out;
  }
  function badgeById(id) { for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) return BADGES[i]; return null; }
  function initBadges() {
    var merged = {}; (app.settings.badges || []).concat(earnedBadgeIds()).forEach(function (id) { merged[id] = 1; });
    app.settings.badges = Object.keys(merged); saveSettings();
  }
  function checkNewBadges() { /* badges retired; no achievement toasts */ }
  function isInvasive(s) { return /invasiv/i.test(s.status || '') || /invasiv/i.test(s.caution || ''); }
  // Species-at-Risk (and all turtles) get location geoprivacy: the precise point
  // stays private on-device, but is coarsened before it could ever be shared/exported.
  function isSensitive(id) { var s = byId[id]; return !!(s && (s.atRisk || s.sub === 'turtles')); }
  function coarse(x) { return Math.round(x * 10) / 10; } // ~11 km grid

  /* ---- Community (optional pooled data via a user-deployed backend) ---- */
  function clientId() {
    var id = null; try { id = localStorage.getItem('owl-cid'); } catch (e) {}
    if (!id) { id = 'c' + Math.random().toString(36).slice(2) + Date.now().toString(36); try { localStorage.setItem('owl-cid', id); } catch (e) {} }
    return id;
  }
  // A device-held secret that proves ownership of clientId to the server, so that
  // knowing a client id alone can't delete or impersonate that contributor.
  function clientToken() {
    var t = null; try { t = localStorage.getItem('owl-tok'); } catch (e) {}
    if (!t) {
      t = '';
      try { var a = new Uint8Array(16); crypto.getRandomValues(a); for (var i = 0; i < a.length; i++) t += (a[i] + 256).toString(16).slice(1); }
      catch (e) { t = (Math.random().toString(36) + Math.random().toString(36)).replace(/[^a-z0-9]/g, '').slice(0, 32); }
      try { localStorage.setItem('owl-tok', t); } catch (e) {}
    }
    return t;
  }
  var Community = {
    base: function () { return (app.settings.communityUrl || '').replace(/\/+$/, ''); },
    on: function () { return !!(this.base() && app.settings.community); },
    post: function (payload) {
      if (!this.on()) return;
      try {
        payload.clientId = clientId(); payload.token = clientToken();
        fetch(this.base() + '/api/v1/sightings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(function () {});
      } catch (e) {}
    },
    feed: function (lat, lng) {
      var b = this.base(); if (!b) return Promise.resolve(null);
      var q = '?days=7&km=80';
      // Only ever send a COARSE (~11 km) location, and only when we have one.
      if (lat != null && lng != null) q += '&lat=' + (Math.round(lat * 10) / 10) + '&lng=' + (Math.round(lng * 10) / 10);
      return fetch(b + '/api/v1/community' + q).then(function (r) { return r.json(); }).catch(function () { return null; });
    },
    stats: function () {
      var b = this.base(); if (!b) return Promise.resolve(null);
      return fetch(b + '/api/v1/stats').then(function (r) { return r.json(); }).catch(function () { return null; });
    },
    health: function (url) {
      url = (url || '').replace(/\/+$/, ''); if (!url) return Promise.resolve(false);
      return fetch(url + '/api/v1/health').then(function (r) { return r.ok; }).catch(function () { return false; });
    },
    remove: function () {
      var b = this.base(); if (!b) return Promise.resolve(null);
      return fetch(b + '/api/v1/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: clientId(), token: clientToken() }) }).then(function (r) { return r.json(); }).catch(function () { return null; });
    },
    // Opt in (on an explicit tap, per iOS's user-gesture rule) to Web Push for
    // nearby bear/hazard alerts. Needs the server to have a VAPID key configured.
    enablePush: function () {
      var b = this.base(); if (!b) { toast('Connect a server first'); return; }
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || typeof Notification === 'undefined') { toast('Push isn’t supported on this device'); return; }
      fetch(b + '/api/v1/push/key').then(function (r) { return r.json(); }).then(function (d) {
        var key = d && d.key;
        if (!key) { toast('This server hasn’t set up alerts yet'); return; }
        return Notification.requestPermission().then(function (perm) {
          if (perm !== 'granted') { toast('Notifications not allowed'); return; }
          return navigator.serviceWorker.ready.then(function (reg) {
            return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToU8(key) });
          }).then(function (sub) {
            return fetch(b + '/api/v1/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: clientId(), token: clientToken(), subscription: sub }) });
          }).then(function () { toast('Nearby bear & hazard alerts enabled'); });
        });
      }).catch(function () { toast('Couldn’t enable alerts'); });
    }
  };
  function urlB64ToU8(base64) {
    var pad = '='.repeat((4 - base64.length % 4) % 4);
    var b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(b64), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  // Coarsen EVERY outgoing coordinate on-device before it leaves: ~5 km grid
  // normally, ~22 km for at-risk species. Raw GPS never leaves the phone.
  function coarseFor(v, sens) { var step = sens ? 5 : 20; return Math.round(v * step) / step; }
  function blurWhen(iso) { try { var d = new Date(iso); if (isNaN(d.getTime())) return ''; d.setMinutes(0, 0, 0); return d.toISOString(); } catch (e) { return ''; } }
  function communityPayload(entry) {
    // Recompute sensitivity at send time (don't trust a possibly-stale saved flag),
    // and always treat bears as sensitive so their locations get the ~22 km grid.
    var sens = !!entry.sensitiveLoc || isBearEntry(entry) || isSensitive(entry.speciesId);
    var lat = entry.lat, lng = entry.lng;
    if (typeof lat === 'number') { lat = coarseFor(lat, sens); lng = coarseFor(lng, sens); }
    return {
      kind: isBearEntry(entry) ? 'bear' : 'sighting', species: entry.speciesId || '', name: '',
      cat: entry.cat || '', sub: entry.sub || '', count: entry.count || 1, sensitive: sens,
      lat: typeof lat === 'number' ? lat : null, lng: typeof lng === 'number' ? lng : null, when: blurWhen(entry.when)
    };
  }

  /* ---- Species photos: openly-licensed (CC) images from iNaturalist, with
         attribution, cached. NOT the copyrighted Lone Pine images, a legal,
         real-photo layer that gracefully falls back to the emoji offline. ---- */
  var _photoTried = {};
  function speciesPhoto(s, cb) {
    var cache = {}; try { cache = JSON.parse(localStorage.getItem('owl-photos') || '{}'); } catch (e) {}
    if (cache[s.id] && cache[s.id].url) { cb(cache[s.id]); return; }
    if (_photoTried[s.id]) { cb(null); return; }
    _photoTried[s.id] = 1;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) { cb(null); return; }
    var url = 'https://api.inaturalist.org/v1/taxa?q=' + encodeURIComponent(s.sci || s.name) + '&rank=species&per_page=1';
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      var t = d && d.results && d.results[0], p = t && t.default_photo;
      if (p && p.medium_url) {
        var rec = { url: p.medium_url, attr: String(p.attribution || '').replace(/\(c\)/gi, '©').slice(0, 140) };
        try { cache[s.id] = rec; localStorage.setItem('owl-photos', JSON.stringify(cache)); } catch (e) {}
        cb(rec);
      } else cb(null);
    }).catch(function () { cb(null); });
  }
  function applySpeciesPhoto(s) {
    if (!app.settings.photos) return; // on by default; the Privacy screen can turn it off
    var forId = s.id;
    speciesPhoto(s, function (rec) {
      if (!rec || !rec.url) return;
      if (location.hash.indexOf('/species/' + forId) < 0) return; // navigated away, don't inject into another page
      var box = $('#sp-photo'), em = $('#sp-emoji'), hero = $('#sp-hero');
      if (!box) return;
      box.innerHTML = '<img class="sp-photo-img" src="' + esc(rec.url) + '" alt="' + esc(s.name) + '" loading="lazy">' +
        '<div class="photo-credit">' + esc(rec.attr || 'iNaturalist') + ' · CC · iNaturalist</div>';
      if (hero) hero.classList.add('has-photo');
      if (em) em.style.display = 'none';
    });
  }

  /* opts.hideDay drops the date when the row already sits under a day header.
     opts.lifer marks the encounter that first put this species on the life list. */
  function entryCell(e, opts) {
    opts = opts || {};
    var parts = [];
    if (!opts.hideDay) parts.push(fmtDay(e.when));
    parts.push(fmtTime(e.when));
    if (e.evidence === 'heard') parts.push('Heard');
    else if (e.evidence === 'tracks') parts.push('Tracks');
    // "Caught" is left off when Kept or Released follows, which already says it.
    else if (e.evidence === 'caught' && !(e.fish && e.fish.caught)) parts.push('Caught');
    if (e.count > 1) parts.push('×' + e.count);
    if (e.fish) {
      if (e.fish.length != null) parts.push(e.fish.length + ' ' + (e.fish.units === 'imperial' ? 'in' : 'cm'));
      if (e.fish.caught) parts.push(e.fish.released ? 'Released' : 'Kept');
      if (e.fish.water) parts.push(e.fish.water);
    }
    if (e.fishZone) parts.push('Zone ' + e.fishZone);
    if (e.external === 'onfish') parts.push('ON Fishing');
    if (e.bird && e.bird.behavior) parts.push(e.bird.behavior);
    if (e.lat != null) { var pl = placeOf(e); if (pl && pl.key.indexOf('park:') === 0) parts.push(pl.name); }
    var thumb = e.photo
      ? '<img class="thumb" src="' + e.photo + '" alt="">'
      : '<span class="cell-emoji">' + (e.emoji || '\u{1F43E}') + '</span>';
    return '<button type="button" class="cell tap" data-action="open-entry" data-id="' + esc(e.id) + '">' +
      thumb +
      '<span class="cell-body"><span class="cell-title">' + esc(e.speciesName) +
      (opts.lifer ? '<span class="pill-new">New</span>' : '') + '</span>' +
      '<span class="cell-sub">' + esc(parts.join(' · ')) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></button>';
  }

  /* ----------------------------------------------------------- Explore */
  function viewExplore() {
    // the Home is the guide itself: one card of category rows, each with
    // the count of what is inside it on the right
    var body = '';
    if (isIosSafari() && !app.settings.seenInstall) {
      body += '<div class="wrap-note" style="align-items:flex-start;margin-top:2px"><span class="i">\u{1F4F2}</span><span><b>Add to Home Screen</b> to use this like a real app, fullscreen and offline. Tap the <b>Share</b> button, then <b>Add to Home Screen</b>. <button data-action="dismiss-install" style="padding:0;font-weight:600;color:var(--tint);background:none">Got it</button></span></div>';
    }

    var atRiskN = SPECIES.filter(function (s) { return s.atRisk; }).length;
    body += sectionHead('guide-cats');
    body += '<div class="group home-list"><div class="list">';
    body += '<a class="cell tap" href="#/atrisk"><span class="cell-emoji">\u{1F6E1}️</span>' +
      '<span class="cell-body"><span class="cell-title">' + Lx('Species at Risk') + '</span></span>' +
      '<span class="cell-value">' + atRiskN + '</span>' +
      '<span class="chevron">' + I.chevron + '</span></a>';
    sectionOrder('guide-cats').forEach(function (r) {
      if (!r.on) return;
      var count = speciesInCat(r.def.id).length;
      body += '<a class="cell tap" href="#/explore/' + esc(r.def.id) + '">' +
        '<span class="cell-emoji">' + r.def.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">' + esc(Lx(r.def.label)) + '</span></span>' +
        '<span class="cell-value">' + count + '</span>' +
        '<span class="chevron">' + I.chevron + '</span></a>';
    });
    body += '</div></div>';
    body += seasonalCard();
    if (COMING_SOON.length) {
      body += sectionTitle(Lx('Coming Soon')) + '<div class="group"><div class="list">';
      COMING_SOON.forEach(function (c) {
        body += '<div class="cell"><span class="cell-emoji">' + c.emoji + '</span>' +
          '<span class="cell-body"><span class="cell-title">' + esc(c.name) + '</span>' +
          '<span class="cell-sub">' + Lx('In a future update') + '</span></span></div>';
      });
      body += '</div></div>';
    }
    if (app.entries.length) {
      body += recentGroup(Lx('Recent'), recentIn(function () { return true; }, 6));
    }

    screen({ title: 'on-wildlife', large: true, header: true, body: body });
  }

  /* ============================================================= SEARCH */
  // The one universal search index: categories, provincial parks and species.
  // Shared by the full search screen and the Guide home's inline field, so the
  // two always agree. Returns '' for an empty query.
  function searchResultsHtml(q) {
    q = (q || '').trim();
    if (!q) return '';
    var html = '';
    // Categories that match
    var qq = q.toLowerCase();
    var catHits = CATEGORIES.filter(function (c) { return c.name.toLowerCase().indexOf(qq) >= 0; });
    if (catHits.length) {
      html += '<div class="group"><div class="group-header">Categories</div><div class="list">';
      catHits.forEach(function (c) {
        html += '<a class="cell tap" href="#/explore/' + esc(c.id) + '"><span class="cell-emoji">' + c.emoji + '</span>' +
          '<span class="cell-body"><span class="cell-title">' + esc(c.name) + '</span>' +
          '<span class="cell-sub">' + speciesInCat(c.id).length + ' species</span></span>' +
          '<span class="chevron">' + I.chevron + '</span></a>';
      });
      html += '</div></div>';
    }
    // Provincial parks (from the shared ecosystem data)
    var parkHits = (window.ECO ? window.ECO.parks : []).filter(function (p) { return p.name.toLowerCase().indexOf(qq) >= 0; }).slice(0, 8);
    if (parkHits.length) {
      html += '<div class="group"><div class="group-header">Parks</div><div class="list">';
      parkHits.forEach(function (p) {
        var loc = (p.region || '').split(' · ').slice(1).join(' · ') || p.region;
        html += '<a class="cell tap" href="#/park/' + esc(p.id) + '"><span class="cell-emoji">\u{1F3DE}️</span>' +
          '<span class="cell-body"><span class="cell-title">' + esc(p.name) + '</span>' +
          '<span class="cell-sub">' + esc(loc) + '</span></span>' +
          '<span class="chevron">' + I.chevron + '</span></a>';
      });
      html += '</div></div>';
    }
    var list = searchSpecies(q);
    if (!list.length && !catHits.length && !parkHits.length) {
      return '<div class="empty"><div class="e">\u{1F50D}</div><h3>No matches</h3><p>Try another name.</p></div>';
    }
    if (list.length) {
      var logged = loggedIdSet();
      html += '<div class="group"><div class="group-header">Species</div><div class="list">';
      list.forEach(function (s) { html += speciesCell(s, { loggedIds: logged, sub: '<i>' + esc(s.sci) + '</i> · ' + esc(catMeta(s.cat).name) }); });
      html += '</div></div>';
    }
    return html;
  }
  // Wire a search input to render results live into a container, showing an
  // optional hint element only while the query is empty.
  function wireLiveSearch(inputId, resultsId, hideIds) {
    var input = $('#' + inputId); if (!input) return;
    input.addEventListener('input', function () {
      var res = $('#' + resultsId); if (!res) return;
      var q = input.value;
      var others = (hideIds || []).map(function (id) { return $('#' + id); });
      if (!q.trim()) {
        res.innerHTML = '';
        others.forEach(function (el) { if (el) el.style.display = ''; });
        return;
      }
      others.forEach(function (el) { if (el) el.style.display = 'none'; });
      // The first results of a query rise in; while narrowing an already
      // visible list, updates land instantly.
      var hadResults = res.childElementCount > 0;
      res.innerHTML = searchResultsHtml(q);
      if (!hadResults) { res.classList.remove('anim-in'); void res.offsetWidth; res.classList.add('anim-in'); }
      else res.classList.remove('anim-in');
    });
  }
  function viewSearch() {
    var body = '<div class="searchbar">' + I.search +
      '<input type="search" id="uni-search" aria-label="' + Lx('Search') + '" placeholder="' + Lx('Search species, categories, or a park') + '" autocomplete="off" autocorrect="off" autocapitalize="none">' +
      '</div>';
    body += '<div id="search-results"></div>';
    body += '<div id="search-hint" class="empty" style="padding-top:40px"><div class="e">' + I.search + '</div>' +
      '<h3>' + Lx('Search the guide') + '</h3><p>' + Lx('All') + ' ' + SPECIES.length + ' ' + Lx('species, every category and every provincial park. Searches stay on this phone.') + '</p></div>';
    screen({ title: Lx('Search'), large: true, backAction: true, backText: Lx('Back'), body: body });
    // No autofocus: the keyboard comes up when the person taps the field.
    // Autofocusing made iOS Safari pan the page and hide the top of the screen.
    wireLiveSearch('uni-search', 'search-results', ['search-hint']);
  }

  // A provincial park as a wildlife destination: the fish in its waters (exact,
  // from on-camp's data) and the wildlife common to its region (a regional guide,
  // ranked by how often each species is seen).
  function viewParkEco(id) {
    var ECO = window.ECO;
    if (!ECO) { location.replace('#/search'); return; }
    var p = ECO.parks.filter(function (x) { return x.id === id; })[0];
    if (!p) { location.replace('#/search'); return; }
    var loc = (p.region || '').split(' · ').slice(1).join(' · ') || '';
    var regionName = { north: 'northern', central: 'central', south: 'southern' }[p.bucket] || 'this part of';
    var near = (loc && loc.toLowerCase() !== p.name.toLowerCase()) ? ', near ' + esc(loc) : '';
    var logged = loggedIdSet();
    var body = '<p class="article-intro">' + esc(p.name) + ' sits in ' + regionName + ' Ontario' + near + '. Here are the fish in its waters and the wildlife you are likely to run into nearby. Log anything you spot.</p>';

    if (p.fish && p.fish.length) {
      body += '<div class="group"><div class="group-header">Fish in ' + (p.water ? esc(p.water) : 'its waters') + '</div><div class="list">';
      p.fish.forEach(function (fk) {
        var f = ECO.fish[fk]; if (!f) return;
        var wl = f.wl && byId[f.wl] ? byId[f.wl] : null;
        if (wl) body += speciesCell(wl, { loggedIds: logged, sub: '<i>' + esc(wl.sci) + '</i>' });
        else body += '<div class="cell"><span class="cell-emoji">\u{1F41F}</span><span class="cell-body"><span class="cell-title">' + esc(f.name) + '</span></span></div>';
      });
      body += '</div></div>';
    }

    var rank = { common: 0, uncommon: 1, rare: 2 };
    var inRegion = SPECIES.filter(function (s) {
      return s.cat !== 'fish' && ECO.regionBucket(s.region).indexOf(p.bucket) >= 0;
    });
    CATEGORIES.forEach(function (c) {
      if (c.id === 'fish') return;
      var rows = inRegion.filter(function (s) { return s.cat === c.id; })
        .sort(function (a, b) { return (rank[a.seen] == null ? 9 : rank[a.seen]) - (rank[b.seen] == null ? 9 : rank[b.seen]); })
        .slice(0, 4);
      if (!rows.length) return;
      body += '<div class="group"><div class="group-header">' + c.emoji + ' ' + esc(c.name) + '</div><div class="list">';
      rows.forEach(function (s) { body += speciesCell(s, { loggedIds: logged, sub: '<i>' + esc(s.sci) + '</i>' }); });
      body += '</div></div>';
    });

    body += '<div class="group"><div class="list">' +
      '<a class="cell tap" href="https://katsuma.ca/on-site/" target="_blank" rel="noopener noreferrer">' +
      '<span class="cell-body"><span class="cell-title">Rate its campsites in on-camp</span>' +
      '<span class="cell-sub">Campgrounds, sites and trails</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      (p.url ? '<a class="cell tap" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="cell-body"><span class="cell-title">Ontario Parks page</span>' +
        '<span class="cell-sub">Hours, fees and reservations</span></span><span class="chevron">' + I.chevron + '</span></a>' : '') +
      '</div><div class="group-footer">The wildlife here is common across ' + regionName + ' Ontario, a regional guide rather than a confirmed checklist for this park.</div></div>';

    screen({ title: p.name, backAction: true, backText: 'Search', body: body });
  }

  /* ============================================================== LEARN */
  function viewLearnHub() {
    var body = '';
    body += '<div class="group"><div class="group-header">Report</div><div class="list">' +
      moreCell('', 'Report a bear', 'For your map and Bear Wise info', 'report-bear') +
      moreCell('', 'Report a hazard', 'Wildlife on road, construction, ticks', 'report-hazard') +
      '<a class="cell tap" href="#/alerts"><span class="cell-body"><span class="cell-title">Safety and alerts</span><span class="cell-sub">Dangers to know, and your reports</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Stay safe</div><div class="list">' +
      learnCell('', 'Ticks and Lyme disease', 'Identify, prevent, remove, when to see a doctor', 'ticks') +
      learnCell('', 'Bear safety (Bear Wise)', 'Prevent encounters and how to report a bear', 'bears') +
      learnCell('', 'Dangerous plants', 'Poison ivy, wild parsnip, giant hogweed', 'plants') +
      learnCell('', 'Wildlife on roads', 'Deer, moose, turtles and road hazards', 'roads') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Out there</div><div class="list">' +
      learnCell('', 'Handling and releasing fish', 'Keep released fish alive', 'fish-handling') +
      learnCell('', 'Protect the water', 'Stop aquatic invasive species spreading', 'water-care') +
      learnCell('', 'Is it safe to eat?', 'Eating your catch the healthy way', 'fish-eating') +
      learnCell('', 'How to birdwatch', 'Patience, quiet and good timing', 'birding-how') +
      learnCell('', 'Trail etiquette', 'Courtesy on the trail, for people and wildlife', 'trail-etiquette') +
      learnCell('', 'Trail safety', 'Planning, packing and knowing your limits', 'trail-safety') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Conservation</div><div class="list">' +
      '<a class="cell tap" href="#/invasives"><span class="cell-body"><span class="cell-title">Invasive species</span><span class="cell-sub">What to watch for and how to report</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      learnCell('', 'Help Ontario’s wildlife', 'How your sightings support conservation', 'contribute') +
      '<a class="cell tap" href="#/resources"><span class="cell-body"><span class="cell-title">Ontario and Canada resources</span><span class="cell-sub">Trusted sites</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div></div>';

    screen({ title: 'Learn', large: true, subtitle: 'Safety guides and ways to help wildlife', body: body });
  }

  function viewAtRisk() {
    var list = SPECIES.filter(function (s) { return s.atRisk; });
    var logged = loggedIdSet();
    var body = '<p class="article-intro">Ontario species assessed as Special Concern, Threatened, Endangered or extirpated under SARO and COSEWIC. When you log one, its exact location is kept private on your phone and coarsened if you ever share it.</p>';
    CATEGORIES.forEach(function (c) {
      var rows = sortSpecies(list.filter(function (s) { return s.cat === c.id; }));
      if (!rows.length) return;
      body += '<div class="group"><div class="group-header">' + c.emoji + ' ' + esc(c.name) + ' (' + rows.length + ')</div><div class="list">';
      rows.forEach(function (s) { body += speciesCell(s, { loggedIds: logged, sub: '<i>' + esc(s.sci) + '</i>', right: statusBadge(s) }); });
      body += '</div></div>';
    });
    body += '<div class="hpad"><a class="btn btn-tinted btn-block" href="#/learn/contribute">How your sightings help</a></div><div class="spacer"></div>';
    screen({ title: 'Species at Risk', back: '#/explore', backText: 'Guide', body: body });
  }
  /* One flat page per category: every species, grouped by subcategory under
     sticky headers, with a pinned filter that narrows the list live. The old
     #/explore/<cat>/<sub> route survives as an alias that scrolls to its group. */
  function categoryListHtml(c, logged, q) {
    q = (q || '').trim().toLowerCase();
    var html = '';
    c.subs.forEach(function (sub) {
      var list = sortSpecies(speciesInSub(c.id, sub.id));
      if (q) {
        list = list.filter(function (s) {
          return s.name.toLowerCase().indexOf(q) >= 0 || s.sci.toLowerCase().indexOf(q) >= 0;
        });
      }
      if (!list.length) return;
      html += '<div class="group jcards" id="sub-' + esc(sub.id) + '">' +
        '<div class="group-header cat-sub-header">' + esc(sub.name) + '</div><div class="list">';
      list.forEach(function (s) { html += speciesCell(s, { loggedIds: logged, card: true }); });
      html += '</div></div>';
    });
    if (!html) html = '<div class="empty"><div class="e">\u{1F50D}</div><h3>No matches</h3><p>Try another name.</p></div>';
    return html;
  }
  /* The entry-card ellipsis and the species page's nav ellipsis open the
     same small action sheet: only actions that really exist. */
  function openSpeciesMenu(id) {
    var s = byId[id]; if (!s) return;
    var onPage = location.hash.indexOf('/species/' + id) >= 0;
    var logged = journalEntries().filter(function (e) { return e.speciesId === id; }).length > 0;
    var rows = '<button class="cell tap" data-action="open-log" data-species="' + esc(s.id) + '">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.plus + '</span>' +
      '<span class="cell-body"><span class="cell-title">' + Lx('Log this sighting') + '</span></span></button>';
    if (!onPage) {
      rows += '<a class="cell tap" href="#/species/' + esc(s.id) + '" data-action="close-sheet-nav">' +
        '<span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">' + Lx('Open guide entry') + '</span></span></a>';
    }
    if (logged) {
      rows += '<a class="cell tap" href="#/journal/species/' + esc(s.id) + '" data-action="close-sheet-nav">' +
        '<span class="cell-emoji">' + spriteIcon('notebook') + '</span>' +
        '<span class="cell-body"><span class="cell-title">' + Lx('Open in your journal') + '</span></span></a>';
    }
    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">' + esc(s.name) + '</span>' +
      '<button class="nav-btn" data-action="close-sheet">' + Lx('Cancel') + '</button></div>' +
      '<div class="sheet-body"><div class="group" style="margin-top:4px"><div class="list">' + rows + '</div></div></div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { var sh = $('#sheet'); if (sh) sh.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
    afterSheetOpen();
  }

  function viewCategory(catId, subId) {
    var c = catMeta(catId);
    if (!c) return viewExplore();
    var logged = loggedIdSet();
    var catTotal = speciesInCat(catId).length;
    var catSeen = speciesInCat(catId).filter(function (s) { return logged[s.id]; }).length;
    var body = '<div class="cat-filter"><div class="searchbar">' + I.search +
      '<input type="search" id="cat-filter-input" aria-label="Filter ' + esc(c.name.toLowerCase()) + '" placeholder="Filter ' + esc(c.name.toLowerCase()) + '" autocomplete="off" autocorrect="off" autocapitalize="none">' +
      '</div></div>';
    // Fish carry regulations now, so the category leads with the zones door.
    if (catId === 'fish' && REG_ZONES.length) {
      body += '<div class="group" style="margin-top:2px"><div class="list">' +
        '<a class="cell tap" href="#/zones"><span class="cell-emoji">\u{1F3A3}</span>' +
        '<span class="cell-body"><span class="cell-title">Fishing zones and seasons</span>' +
        '<span class="cell-sub">What is open right now, in all 20 zones</span></span>' +
        '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    }
    body += '<div id="cat-list">' + categoryListHtml(c, logged, '') + '</div>';
    // Goal gradient: a real, honest count of how far through this group you are.
    body += '<div class="group" style="margin-top:0"><div class="group-footer">' + catTotal + ' species, most commonly seen first within each section.' +
      (catSeen ? ' You have logged ' + catSeen + ' of the ' + catTotal + ' ' + esc(c.name.toLowerCase()) + ' in the guide.' : '') + '</div></div>';
    // The accent FAB carries the one add action; it ducks away on scroll.
    body += '<button type="button" class="fab-log" data-action="open-log" data-cat="' + esc(catId) + '" aria-label="' + Lx('Log an encounter') + '">' + I.plus + '</button>';
    screen({
      title: c.name, large: true, back: '#/explore', backText: 'Guide', body: body,
      navRight: '<button type="button" class="nav-btn nav-circle" data-action="focus-filter" aria-label="' + Lx('Search') + '">' + I.search + '</button>'
    });
    var fi = $('#cat-filter-input');
    if (fi) fi.addEventListener('input', function () {
      var box = $('#cat-list'); if (box) box.innerHTML = categoryListHtml(c, logged, fi.value);
    });
    // Old subcategory links land here: scroll their group under the pinned filter.
    if (subId && subMeta(catId, subId)) {
      setTimeout(function () {
        var el = document.getElementById('sub-' + subId);
        if (!el) return;
        var y = el.getBoundingClientRect().top + (window.scrollY || 0) - 148;
        window.scrollTo(0, Math.max(0, y));
      }, 60);
    }
  }

  /* -------------------------------------------------------- Species page */
  function viewSpecies(id) {
    var s = byId[id];
    if (!s) return viewExplore();
    var c = catMeta(s.cat), sub = subMeta(s.cat, s.sub);

    // The photo, when one arrives, runs edge to edge under the transparent
    // nav and melts into the page; the emoji hero stays as the offline and
    // photos-off fallback.
    var body = '<div class="sp-hero" id="sp-hero"><div id="sp-photo" class="sp-photo-full"></div></div>' +
      '<div class="hero">' +
      '<div class="hero-emoji" id="sp-emoji" style="background:' + tintFor(s.cat) + '22">' + s.emoji + '</div>' +
      '<h1>' + esc(s.name) + '</h1><div class="sci">' + esc(s.sci) + '</div>' +
      '<div class="badges">' + statusBadge(s) +
      '<span class="badge badge-info">' + esc(seenLabel(s.seen)) + '</span>' +
      (isFloraCat(s.cat) ? '' : '<span class="badge badge-info">' + esc(activityLabel(s.activity)) + '</span>') +
      '</div></div>';

    if (s.caution) body += '<div class="wrap-note danger"><span class="i">⚠️</span><span>' + esc(s.caution) + '</span></div>';

    body += '<div class="hpad" style="margin-top:12px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log" data-species="' + esc(s.id) + '">' + I.plus + Lx('Log this sighting') + '</button></div>';

    // Your record sits right under the log button, because on a species page the
    // first question a birder or angler asks is "have I had this one?".
    var mine = journalEntries().filter(function (e) { return e.speciesId === s.id; })
      .sort(function (a, b) { return new Date(a.when) - new Date(b.when); });
    if (mine.length) {
      body += '<div class="group"><div class="group-header">Your record</div><div class="list">' +
        '<div class="cell"><span class="cell-body"><span class="cell-title">Times seen</span></span><span class="cell-value">' + mine.length + '</span></div>' +
        '<div class="cell"><span class="cell-body"><span class="cell-title">First seen</span></span><span class="cell-value">' + esc(fmtDay(mine[0].when)) + '</span></div>' +
        (mine.length > 1 ? '<div class="cell"><span class="cell-body"><span class="cell-title">Last seen</span></span><span class="cell-value">' + esc(fmtDay(mine[mine.length - 1].when)) + '</span></div>' : '') +
        '<a class="cell tap" href="#/journal/species/' + esc(s.id) + '"><span class="cell-body"><span class="cell-title">' + Lx('Open in your journal') + '</span><span class="cell-sub">' + Lx('Every encounter') + '</span></span><span class="chevron">' + I.chevron + '</span></a>' +
        '</div></div>';
    } else {
      body += '<div class="group"><div class="list">' +
        '<div class="cell"><span class="cell-body"><span class="cell-title" style="color:var(--label-2)">Not in your journal yet</span></span></div>' +
        '</div></div>';
    }

    body += '<div class="group"><div class="group-header">Field Notes</div><div class="list">' +
      info('How to identify', s.tips) +
      info('Habitat', s.habitat) +
      info('Size', s.size) +
      (s.angling ? info('Angling tip', s.angling) : '') +
      info('Best seasons', s.seasons.map(cap).join(', ') || 'Year-round') +
      info('Where in Ontario', s.region) +
      info('Did you know', s.fact) +
      '</div></div>';

    // Fishing seasons and limits, straight from the regulations data that
    // rode over from on-fishing. Species with no regs entry show nothing new.
    body += speciesFishingGroup(s);

    // Optional longer account, in the style of a field-guide entry, for those who want it.
    var noteText = (window.SPECIES_NOTES && SPECIES_NOTES[s.id]) || '';
    if (noteText) {
      var paras = noteText.split(/\n\n+/).map(function (pp) { return '<p>' + esc(pp) + '</p>'; }).join('');
      body += '<details class="notes"><summary>' +
        '<span class="cell-emoji">\u{1F4D6}</span>' +
        '<span class="cell-body"><span class="cell-title">In depth</span><span class="cell-sub">A longer read, if you want it</span></span>' +
        '<span class="chevron">' + I.chevron + '</span></summary>' +
        '<div class="notes-body">' + paras + '</div></details>';
    }

    body += '<div class="group"><div class="list">' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Category</span></span>' +
      '<span class="cell-value">' + esc(c ? c.name : '') + (sub ? ' · ' + esc(sub.name) : '') + '</span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Conservation status</span></span>' +
      '<span class="cell-value">' + esc(s.status) + '</span></div>' +
      '</div></div>';

    // Learn more, external, reputable sources (photos, range, conservation)
    body += '<div class="group"><div class="group-header">Learn more</div><div class="list">' +
      speciesLinks(s) +
      '</div><div class="group-footer">Opens external sites in your browser.</div></div>';

    // Categories are flat pages now, so back goes to the category, not a sub page.
    var backHref = c ? '#/explore/' + s.cat : '#/explore';
    screen({
      title: s.name, back: backHref, backText: c ? c.name : 'Back', body: body, cover: true,
      navRight: '<button type="button" class="nav-btn nav-circle" data-action="species-menu" data-id="' + esc(s.id) + '" aria-label="' + Lx('More') + ': ' + esc(s.name) + '">' + spriteIcon('ellipsis') + '</button>'
    });
    applySpeciesPhoto(s);
  }
  function speciesLinks(s) {
    var q = encodeURIComponent(s.sci || s.name);
    var out = linkCell('See photos on iNaturalist', 'https://www.inaturalist.org/search?q=' + q, 'Photos, range map & observations');
    if (s.cat === 'birds') out += linkCell('Look up on eBird', 'https://ebird.org/canada', 'Bird records across Ontario');
    else if (s.cat === 'fish') out += linkCell('Ontario fishing & regulations', 'https://www.ontario.ca/page/fishing', 'Seasons, limits & licences');
    else if (s.cat === 'reptiles' || s.cat === 'amphibians') out += linkCell('Ontario Nature', 'https://ontarionature.org', 'Reptile & amphibian conservation');
    else out += linkCell('Hinterland Who’s Who', 'https://www.hww.ca', 'Species profiles & videos');
    if (s.atRisk) out += linkCell('Species at risk in Ontario', 'https://www.ontario.ca/page/species-risk-ontario', 'Status, recovery & how to help');
    return out;
  }
  function info(k, v) { return '<div class="info-row"><div class="info-k">' + esc(k) + '</div><div class="info-v">' + esc(v) + '</div></div>'; }
  function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  function seenLabel(x) { return x === 'common' ? 'Commonly seen' : x === 'uncommon' ? 'Uncommon' : 'Rarely seen'; }
  function activityLabel(x) {
    return x === 'diurnal' ? 'Active by day' : x === 'nocturnal' ? 'Active at night' :
      x === 'crepuscular' ? 'Dawn & dusk' : 'Active anytime';
  }

  /* ================================================= FISHING ZONES & REGS */
  // The Fishing group on a fish species page: status now, the province-wide
  // default season and limits, and a door into the per-zone list. Everything
  // shown is a string from the regulations data, never hand-written.
  function speciesFishingGroup(s) {
    if (s.cat !== 'fish') return '';
    var fi = fishRegForSpecies(s.id);
    if (!fi) return '';
    var zs = [], openN = 0;
    REG_ZONES.forEach(function (z) {
      if (!fi.merged[z]) return;
      zs.push(z);
      if (seasonStatus(fi.merged[z].rec.season).status === 'open') openN++;
    });
    if (!zs.length) return '';
    // The province-wide default: the season and limits most zones share.
    var counts = {}, bestKey = null;
    zs.forEach(function (z) {
      var k = fi.merged[z].rec.season + '\n' + fi.merged[z].rec.limits;
      counts[k] = (counts[k] || 0) + 1;
      if (bestKey == null || counts[k] > counts[bestKey]) bestKey = k;
    });
    var def = bestKey.split('\n');
    var status = openN
      ? 'Open now in ' + openN + ' of ' + zs.length + (zs.length === 1 ? ' zone' : ' zones')
      : 'Closed in every zone right now';
    var combined = null;
    for (var i = 0; i < fi.regNames.length; i++) {
      if (/ combined$| and /i.test(fi.regNames[i])) { combined = fi.regNames[i]; break; }
    }
    return '<div class="group"><div class="group-header">Fishing</div><div class="list">' +
      '<div class="cell"><span class="cell-emoji">\u{1F3A3}</span>' +
      '<span class="cell-body"><span class="cell-title">' + esc(status) + '</span>' +
      '<span class="cell-sub">Computed for today from the Ontario regulations</span></span>' +
      regStatusBadge(openN ? 'open' : 'closed') + '</div>' +
      info('Season, most zones', def[0]) +
      info('Limits, most zones', def[1]) +
      (combined ? info('Shared limit', 'Regulated as ' + combined + ', so the season and catch limit are shared, not separate per species.') : '') +
      '<a class="cell tap" href="#/fishing/' + esc(s.id) + '">' +
      '<span class="cell-body"><span class="cell-title">Zones and seasons</span>' +
      '<span class="cell-sub">Every zone, open or closed right now</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a>' +
      '</div><div class="group-footer">S is the sport licence limit and C the conservation licence limit. Zones and waterbodies can differ, so check yours before you fish.</div></div>';
  }
  // Per-species zone list: every zone that regulates it, open or closed now.
  function viewSpeciesZones(id) {
    var s = byId[id];
    if (!s) return viewExplore();
    var fi = fishRegForSpecies(id);
    if (!fi) { location.replace('#/species/' + id); return; }
    var open = 0, total = 0, rows = '';
    REG_ZONES.forEach(function (z) {
      var m = fi.merged[z];
      if (!m) return;
      total++;
      var ss = seasonStatus(m.rec.season);
      if (ss.status === 'open') open++;
      rows += '<a class="cell tap" href="#/zones/' + z + '">' +
        '<span class="cell-body"><span class="cell-title">Zone ' + z + '</span>' +
        '<span class="cell-sub" style="white-space:normal">' + esc(m.rec.season) + '</span>' +
        '<span class="cell-sub" style="white-space:normal">' + esc(m.rec.limits) + '</span></span>' +
        regStatusBadge(ss.status) + '</a>';
    });
    var body = '<p class="article-intro">' + esc(s.name) + ' is ' +
      (open ? 'open right now in ' + open + ' of ' + total + ' fisheries management zones.' : 'closed in every zone right now.') +
      ' Seasons and limits come from the Ontario fishing regulations summary.</p>' +
      '<div class="group"><div class="group-header">Seasons by zone</div><div class="list">' + rows + '</div>' +
      '<div class="group-footer">S is the sport licence limit and C the conservation licence limit. Tap a zone for its full rules.</div></div>';
    screen({ title: 'Zones and seasons', back: '#/species/' + id, backText: s.name, body: body });
  }
  // The 20 fisheries management zones, with how many species are open today.
  function viewZones() {
    var body = '<p class="article-intro">Ontario splits recreational fishing into 20 fisheries management zones, each with its own seasons and limits. The rules here are the same ones the on-fishing app carries, and they work offline.</p>';
    body += '<div class="group"><div class="list">';
    for (var z = 1; z <= 20; z++) {
      var d = REGS[z];
      if (!d) {
        body += '<div class="cell"><span class="cell-body"><span class="cell-title">Zone ' + z + '</span><span class="cell-sub">No data</span></span></div>';
        continue;
      }
      var open = 0, total = 0;
      (d.species_regulations || []).forEach(function (r) {
        if (/^aggregate limits/i.test(r.species)) return;
        total++;
        if (seasonStatus(r.season).status === 'open') open++;
      });
      body += '<a class="cell tap" href="#/zones/' + z + '">' +
        '<span class="cell-body"><span class="cell-title">Zone ' + z + '</span>' +
        '<span class="cell-sub">' + open + ' of ' + total + ' species open now</span></span>' +
        '<span class="chevron">' + I.chevron + '</span></a>';
    }
    body += '</div><div class="group-footer">Season status is computed for today. Always confirm against the official summary before you fish.</div></div>';
    screen({ title: 'Fishing zones', backAction: true, backText: 'Back', body: body });
  }
  // One zone: species and limits (closed first, then by popularity, exactly
  // fishing's ordering), the special-rules waters, and the general notes.
  function viewZone(zRaw) {
    var z = parseInt(zRaw, 10);
    var d = REGS[z];
    if (!d) return viewZones();
    var sp = (d.species_regulations || []).slice().sort(regBySpecies);
    var open = 0, total = 0;
    sp.forEach(function (r) {
      if (/^aggregate limits/i.test(r.species)) return;
      total++;
      if (seasonStatus(r.season).status === 'open') open++;
    });
    var body = '<p class="article-intro">' + open + ' of ' + total + ' species are open in Zone ' + z + ' right now. Closed seasons are listed first.</p>';
    body += '<div class="group"><div class="group-header">Species and limits</div><div class="list">';
    sp.forEach(function (r) {
      var ss = seasonStatus(r.season);
      var wl = wlSpeciesForReg(r.species);
      var inner = '<span class="cell-body"><span class="cell-title" style="white-space:normal">' + esc(r.species) + '</span>' +
        '<span class="cell-sub" style="white-space:normal">' + esc(r.season) + '</span>' +
        '<span class="cell-sub" style="white-space:normal">' + esc(r.limits) + '</span></span>' +
        regStatusBadge(ss.status);
      body += wl
        ? '<a class="cell tap" href="#/species/' + esc(wl) + '">' + inner + '</a>'
        : '<div class="cell">' + inner + '</div>';
    });
    body += '</div><div class="group-footer">S is the sport licence limit and C the conservation licence limit. Tap a species for its guide page.</div></div>';
    var wb = d.waterbody_exceptions || [];
    if (wb.length) {
      body += '<div class="group"><div class="group-header">Waters with special rules (' + wb.length + ')</div><div class="list">';
      wb.forEach(function (w) {
        body += '<div class="info-row"><div class="info-k">' + esc(w.waterbody) + '</div>' +
          (w.rules && w.rules.length ? '<div class="info-v">' + w.rules.map(esc).join('<br>') + '</div>' : '') + '</div>';
      });
      body += '</div></div>';
    }
    var gi = (d.general_info || []).filter(Boolean);
    if (gi.length) {
      body += '<div class="group"><div class="group-header">General information</div><div class="list">';
      gi.forEach(function (t) { body += '<div class="info-row"><div class="info-v">' + esc(t) + '</div></div>'; });
      body += '</div></div>';
    }
    screen({ title: 'Zone ' + z, backAction: true, backText: 'Zones', body: body });
  }

  /* ------------------------------------------------------------ My Log */
  /* ============================================================== JOURNAL
     The logbook half of the app. The guide tells you what a thing is; the
     journal is the record of when you met it. Everything here is derived from
     app.entries, so there is one store and it cannot drift out of sync. */

  /* ---- ON Fishing catch log --------------------------------------------
     The three apps share one origin, so ON Fishing's catch log sits in the
     same localStorage. Each catch becomes a read-only journal entry here:
     wildlife-logged fish stay exactly as they are, catches carry their own
     onfish- ids so nothing ever double counts, and edits or deletes happen
     in ON Fishing, not here. Parsed defensively: a bad record is skipped. */
  function loadFishCatches() {
    var raw = [];
    try { raw = JSON.parse(localStorage.getItem('onfish-catchlog') || '[]'); } catch (e) { raw = []; }
    if (!Array.isArray(raw)) raw = [];
    var out = [];
    raw.forEach(function (c, i) {
      if (!c || typeof c !== 'object' || !c.sp || !c.when) return;
      var d = new Date(c.when); if (isNaN(d.getTime())) return;
      var wlId = ONFISH_NAME_TO_WL[String(c.sp).toLowerCase()] || null;
      var sp = wlId ? byId[wlId] : null;
      var len = (c.len != null && c.len !== '' && isFinite(parseFloat(c.len))) ? parseFloat(c.len) : null;
      out.push({
        id: 'onfish-' + String(c.id || i),
        speciesId: sp ? sp.id : null,
        speciesName: sp ? sp.name : String(c.sp),
        cat: 'fish', sub: sp ? sp.sub : '',
        emoji: sp ? sp.emoji : '\u{1F41F}',
        evidence: 'caught', count: 1,
        when: d.toISOString(),
        lat: null, lng: null,
        notes: typeof c.notes === 'string' ? c.notes : '',
        photo: null, bird: null,
        fish: {
          caught: true, released: !!c.rel, length: len, weight: null,
          bait: '', water: typeof c.water === 'string' ? c.water : '',
          units: c.unit === 'in' ? 'imperial' : 'metric'
        },
        fishZone: (typeof c.z === 'number' && isFinite(c.z)) ? c.z : null,
        external: 'onfish'
      });
    });
    return out;
  }
  // The one journal: wildlife encounters plus the read-only ON Fishing catches.
  function journalEntries() { return app.entries.concat(app.fishCatches || []); }
  function findEntry(id) {
    var all = journalEntries();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  /* ---- Journal category filter (persisted) ----
     The options come from the reader's own entries, in guide order, so the
     list never offers a filter that would come back empty. A saved value for
     a category no longer in the log quietly falls back to All. */
  function journalFilterCats() {
    var seen = {};
    journalEntries().forEach(function (e) { if (e.cat) seen[e.cat] = 1; });
    return CATEGORIES.filter(function (c) { return seen[c.id]; });
  }
  function journalFilter() {
    var f = app.settings.journalFilter;
    var cats = journalFilterCats();
    for (var i = 0; i < cats.length; i++) if (cats[i].id === f) return f;
    return 'all';
  }
  /* A native select, not a chip row: the guide has nine categories and a
     dropdown holds all of them at any text size without scrolling sideways. */
  function journalFilterSelect() {
    var cur = journalFilter();
    var opts = '<option value="all"' + (cur === 'all' ? ' selected' : '') + '>' + esc(Lx('All')) + '</option>';
    journalFilterCats().forEach(function (c) {
      opts += '<option value="' + esc(c.id) + '"' + (cur === c.id ? ' selected' : '') + '>' + esc(Lx(c.name)) + '</option>';
    });
    return '<div class="ios-group"><div class="field">' +
      '<label class="field-label" for="journal-filter">' + esc(Lx('Filter')) + '</label>' +
      '<select class="ios-select" id="journal-filter">' + opts + '</select>' +
      '</div></div>';
  }

  // The earliest entry for each species. That entry is the lifer, the one that
  // put the species on the life list, and it is the one that wears the NEW pill.
  function firstEntryBySpecies() {
    var m = {};
    journalEntries().forEach(function (e) {
      if (!e.speciesId) return;
      var cur = m[e.speciesId];
      if (!cur || new Date(e.when) < new Date(cur.when)) m[e.speciesId] = e;
    });
    return m;
  }

  // One row per species ever logged, newest sighting first. A first-ever
  // species from either source (wildlife log or ON Fishing catch) is the lifer.
  function lifeList() {
    var m = {};
    journalEntries().forEach(function (e) {
      if (!e.speciesId) return;
      var r = m[e.speciesId];
      if (!r) r = m[e.speciesId] = { id: e.speciesId, name: e.speciesName, emoji: e.emoji, cat: e.cat, count: 0, first: e.when, last: e.when };
      r.count++;
      if (new Date(e.when) < new Date(r.first)) r.first = e.when;
      if (new Date(e.when) > new Date(r.last)) r.last = e.when;
    });
    var out = [];
    for (var k in m) if (m.hasOwnProperty(k)) out.push(m[k]);
    return out;
  }

  function entriesThisYear() {
    var y = new Date().getFullYear();
    return journalEntries().filter(function (e) { var d = new Date(e.when); return !isNaN(d) && d.getFullYear() === y; }).length;
  }

  /* Places. An entry only stores coordinates, so a place name has to be inferred.
     If the sighting falls within ~15km of a provincial park we name the park,
     otherwise we fall back to a coarse grid cell so nearby sightings still group
     without ever implying more precision than we have. */
  function nearestPark(lat, lng) {
    var parks = (window.ECO && ECO.parks) || [];
    var best = null, bestD = Infinity;
    for (var i = 0; i < parks.length; i++) {
      var p = parks[i];
      if (p.lat == null || p.lng == null) continue;
      var dy = (p.lat - lat) * 111;
      var dx = (p.lng - lng) * 111 * Math.cos(lat * Math.PI / 180);
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) { bestD = d; best = p; }
    }
    return bestD <= 15 ? best : null;
  }
  /* The park list is on-camp's, so a big park like Algonquin appears once per
     campground. Nobody thinks of a weekend as "Pog Lake" and "Rock Lake" and
     "Raccoon Lake"; they think of it as Algonquin. Those rows carry a region of
     "Algonquin · Highway 60", where the first segment is the park itself, while a
     standalone park reads "Central Park · Huntsville" and ends in "Park". So a
     first segment that is not a bucket label is the real park name to group under. */
  function parkPlace(p) {
    var fam = String(p.region || '').split('·')[0].trim();
    if (fam && !/Park$/i.test(fam)) {
      return { key: 'park:' + fam.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: fam, sub: 'Provincial park' };
    }
    return { key: 'park:' + p.id, name: p.name, sub: p.region || 'Provincial park' };
  }
  function placeOf(e) {
    if (e.lat == null || e.lng == null) return null;
    var p = nearestPark(e.lat, e.lng);
    if (p) return parkPlace(p);
    var la = Math.round(e.lat * 10) / 10, ln = Math.round(e.lng * 10) / 10;
    return { key: 'grid:' + la + ',' + ln, name: la.toFixed(1) + ', ' + ln.toFixed(1), sub: 'Around this area' };
  }
  function placeGroups() {
    var m = {};
    journalEntries().forEach(function (e) {
      var p = placeOf(e); if (!p) return;
      var g = m[p.key] || (m[p.key] = { key: p.key, name: p.name, sub: p.sub, entries: [], species: {} });
      g.entries.push(e);
      if (e.speciesId) g.species[e.speciesId] = 1;
    });
    var out = [];
    for (var k in m) if (m.hasOwnProperty(k)) out.push(m[k]);
    out.sort(function (a, b) { return b.entries.length - a.entries.length; });
    return out;
  }

  // Month-grouped timeline, newest first. Shared by the journal and by the
  // per-species and per-place views so they all read the same way. A month
  // is the span a season of outings actually fits in, so the headers stay
  // few enough to scan; each row still names its own day underneath.
  function timelineHtml(entries, lifers) {
    var sorted = entries.slice().sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
    var html = '', curMonth = null;
    sorted.forEach(function (e) {
      var d = new Date(e.when);
      var key = d.getFullYear() + '-' + d.getMonth();
      if (key !== curMonth) {
        if (curMonth !== null) html += '</div></div>';
        html += '<div class="group"><div class="group-header">' + esc(fmtMonth(e.when)) + '</div><div class="list">';
        curMonth = key;
      }
      html += entryCell(e, { lifer: lifers && lifers[e.speciesId] === e });
    });
    if (curMonth !== null) html += '</div></div>';
    return html;
  }

  function journalEmpty() {
    screen({
      title: Lx('Journal'), large: true, header: true,
      subtitle: Lx('A record of everything you have seen outside.'),
      body: '<div class="empty" style="padding-bottom:24px"><div class="e">' + spriteIcon('notebook') + '</div><h3>' + Lx('Start your life list') + '</h3>' +
        '<p>' + Lx('Log what you see and it collects here: a timeline of your outings, a life list of the species you have found, and the places where you found them. Everything stays on this phone.') + '</p></div>' +
        '<div class="hpad"><button class="btn btn-primary btn-block" data-action="open-log">' + I.plus + Lx('Log your first encounter') + '</button></div>' +
        '<div class="group"><div class="group-footer" style="text-align:center">The guide covers ' + SPECIES.length + ' Ontario species across nine categories.</div></div>'
    });
  }

  function viewJournal() {
    var all = journalEntries();
    if (!all.length) return journalEmpty();

    var life = lifeList();
    var lifers = firstEntryBySpecies();

    // The Journal opens on its card: the life list as the hero numeral, the
    // counts beside it, and the honest unfinished total underneath
    // (Zeigarnik: the gap is what pulls you back outside).
    var pct = SPECIES.length ? (life.length / SPECIES.length) * 100 : 0;
    var body = '<div class="home-cards">' +
      '<a class="insight-card tap-scale" href="#/stats">' +
      '<div class="insight-t">' + Lx('Your journal') + '</div>' +
      '<div class="insight-grid">' +
      '<div class="insight-big"><div class="insight-n">' + life.length + '</div>' +
      '<div class="insight-bl">' + Lx('Species') + ' <span>' + Lx('spotted') + '</span></div></div>' +
      '<div class="insight-minis">' +
      '<div class="insight-mini"><div class="n">' + spriteIcon('paw') + '<span>' + all.length + '</span></div>' +
      '<div class="l">' + (all.length === 1 ? Lx('Encounter') : Lx('Encounters')) + '</div></div>' +
      '<div class="insight-mini"><div class="n">' + spriteIcon('sun-moon') + '<span>' + entriesThisYear() + '</span></div>' +
      '<div class="l">' + Lx('This year') + '</div></div>' +
      '</div></div>' +
      '<div class="insight-foot"><span class="insight-bar"><span style="width:' + Math.max(1.5, pct).toFixed(1) + '%"></span></span>' +
      '<span>' + life.length + ' ' + Lx('of') + ' ' + SPECIES.length + ' ' + Lx('in the Ontario guide') + '</span></div>' +
      '</a></div>';

    // One view, the chronological timeline. Species and place pages are
    // reached from the entries themselves and from the guide.
    body += journalFilterSelect();

    // resolve the filter once: it reads the whole log to validate itself
    var filter = journalFilter();
    var shown = filter === 'all' ? all : all.filter(function (e) { return e.cat === filter; });
    if (shown.length) body += timelineHtml(shown, lifers);
    else body += '<div class="empty" style="padding-top:32px"><div class="e">\u{1F50D}</div><h3>' + Lx('Nothing in this filter') + '</h3><p>' + Lx('No encounters match. Choose All to see everything.') + '</p></div>';

    screen({ title: Lx('Journal'), large: true, header: true, body: body });
  }

  /* One species, everything you have recorded of it, and a door into the guide
     entry for it. This is where the dictionary and the logbook meet. */
  function viewSpeciesJournal(id) {
    var mine = journalEntries().filter(function (e) { return e.speciesId === id; });
    if (!mine.length) return viewJournal();
    var sp = byId[id];
    var name = sp ? sp.name : mine[0].speciesName;
    var sorted = mine.slice().sort(function (a, b) { return new Date(a.when) - new Date(b.when); });
    var first = sorted[0], last = sorted[sorted.length - 1];

    var body = '<div class="hero" style="padding-bottom:6px">' +
      '<div class="hero-emoji" style="background:' + tintFor(mine[0].cat) + '22">' + (mine[0].emoji || '\u{1F43E}') + '</div>' +
      '<h1>' + esc(name) + '</h1>' +
      (sp ? '<div class="sci">' + esc(sp.sci) + '</div>' : '') + '</div>';

    body += '<div class="group"><div class="group-header">Your record</div><div class="list">' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Times seen</span></span><span class="cell-value">' + mine.length + '</span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">First seen</span></span><span class="cell-value">' + esc(fmtDay(first.when)) + '</span></div>' +
      (mine.length > 1 ? '<div class="cell"><span class="cell-body"><span class="cell-title">Last seen</span></span><span class="cell-value">' + esc(fmtDay(last.when)) + '</span></div>' : '') +
      (sp ? '<a class="cell tap" href="#/species/' + esc(sp.id) + '"><span class="cell-body"><span class="cell-title">Read the guide entry</span><span class="cell-sub">Identification, habitat and seasons</span></span><span class="chevron">' + I.chevron + '</span></a>' : '') +
      '</div></div>';

    body += timelineHtml(mine, null);

    screen({ title: name, back: '#/journal', backText: 'Journal', body: body });
  }

  function viewJournalPlace(key) {
    var groups = placeGroups(), g = null;
    for (var i = 0; i < groups.length; i++) if (groups[i].key === key) { g = groups[i]; break; }
    if (!g) return viewJournal();
    var ns = Object.keys(g.species).length;
    var body = '<div class="group"><div class="list">' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">' + esc(g.sub) + '</span></span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Species here</span></span><span class="cell-value">' + ns + '</span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Encounters</span></span><span class="cell-value">' + g.entries.length + '</span></div>' +
      '</div></div>';
    body += timelineHtml(g.entries, firstEntryBySpecies());
    screen({ title: g.name, back: '#/journal', backText: 'Journal', body: body });
  }

  /* ------------------------------------------------------ Pursuit pages
     One small screen each. Fishing or Birding sits in the tab bar (the
     primaryPursuit setting decides which); the other stays reachable via
     the quiet switch row at the bottom of each page. */
  function pursuitSwitchRow(toVal, label) {
    return '<div class="group"><div class="list">' +
      '<button type="button" class="cell tap" data-action="set-pursuit" data-v="' + toVal + '">' +
      '<span class="cell-body"><span class="cell-title" style="color:var(--tint)">' + esc(label) + '</span></span></button>' +
      '</div></div>';
  }
  function viewFishingHub() {
    var catches = journalEntries().filter(function (e) { return e.cat === 'fish' && e.fish && e.fish.caught; })
      .sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
    var spSet = {};
    catches.forEach(function (e) { spSet[e.speciesId || e.speciesName] = 1; });
    var y = new Date().getFullYear();
    var thisYear = catches.filter(function (e) { var d = new Date(e.when); return !isNaN(d) && d.getFullYear() === y; }).length;
    var big = null;
    catches.forEach(function (e) { if (e.fish.length != null && (!big || e.fish.length > big.fish.length)) big = e; });
    var bigLabel = big ? (big.fish.length + '&nbsp;' + (big.fish.units === 'imperial' ? 'in' : 'cm')) : '–';

    var body = '<div class="stat-grid" style="margin-top:8px">' +
      stat(Object.keys(spSet).length, Lx('Species caught')) +
      stat(thisYear, Lx('This year')) +
      stat(bigLabel, Lx('Biggest')) + '</div>';
    body += '<div class="group"><div class="list">' +
      '<a class="cell tap" href="#/zones"><span class="cell-emoji">\u{1F3A3}</span>' +
      '<span class="cell-body"><span class="cell-title">' + Lx('What is open now') + '</span>' +
      '<span class="cell-sub">' + Lx('All 20 zones') + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    if (catches.length) {
      body += '<div class="group"><div class="group-header">' + Lx('Recent catches') + '</div><div class="list">';
      catches.slice(0, 5).forEach(function (e) { body += entryCell(e); });
      body += '</div></div>';
    } else {
      body += '<div class="group"><div class="group-footer">' + Lx('No catches yet.') + '</div></div>';
    }
    screen({ title: Lx('Fishing'), large: true, header: true, body: body });
  }
  function viewBirding() {
    var birds = journalEntries().filter(function (e) { return e.cat === 'birds'; })
      .sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
    var life = lifeList().filter(function (r) { return r.cat === 'birds'; });
    var y = new Date().getFullYear(), yearSet = {};
    birds.forEach(function (e) {
      var d = new Date(e.when);
      if (!isNaN(d) && d.getFullYear() === y) yearSet[e.speciesId || e.speciesName] = 1;
    });
    var latest = null;
    life.forEach(function (r) { if (!latest || new Date(r.first) > new Date(latest.first)) latest = r; });

    var body = '<div class="stat-grid" style="margin-top:8px">' +
      stat(life.length, Lx('Life list')) +
      stat(Object.keys(yearSet).length, Lx('This year')) +
      '<div class="stat"><div class="n stat-name">' + (latest ? esc(latest.name) : '–') + '</div><div class="l">' + Lx('Latest lifer') + '</div></div>' +
      '</div>';
    body += '<div class="group"><div class="list">' +
      '<a class="cell tap" href="#/explore/birds"><span class="cell-emoji">\u{1F426}</span>' +
      '<span class="cell-body"><span class="cell-title">' + Lx('Birds in the guide') + '</span>' +
      '<span class="cell-sub">' + speciesInCat('birds').length + ' ' + Lx('species') + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    if (birds.length) {
      body += '<div class="group"><div class="group-header">' + Lx('Recent sightings') + '</div><div class="list">';
      birds.slice(0, 5).forEach(function (e) { body += entryCell(e); });
      body += '</div></div>';
    } else {
      body += '<div class="group"><div class="group-footer">' + Lx('No birds yet.') + '</div></div>';
    }
    screen({ title: Lx('Birding'), large: true, header: true, body: body });
  }

  /* ----------------------------------------------- Appearance panel (More)
     Five controls, identical markup and copy across the three apps: Theme,
     Colours, Glass, Text size, Face. Every change applies live (data
     attributes on <html>) and persists to the shared key. */
  function appearSegRow(label, action, cur, opts, width) {
    var segs = '';
    opts.forEach(function (o) {
      segs += '<button type="button" class="seg-opt' + (cur === o[0] ? ' on' : '') + '" aria-pressed="' + (cur === o[0] ? 'true' : 'false') + '" data-action="' + action + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>';
    });
    return '<div class="field"><span class="field-label">' + esc(label) + '</span><div style="flex:1"></div>' +
      '<div class="segmented" style="width:' + width + 'px">' + segs + '</div></div>';
  }
  function appearancePanel() {
    var a = app.appearance || APPEAR_DEFAULT;
    // theme, glass and text size, nothing else: the look itself is not a
    // choice here, this app simply wears its own colours and type
    var h = '<div class="ios-group">';
    h += appearSegRow(Lx('Theme'), 'appear-theme', a.theme, [['auto', Lx('Auto')], ['light', Lx('Light')], ['dark', Lx('Dark')]], 216);
    h += appearSegRow(Lx('Text size'), 'appear-size', a.size, [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']], 180);
    h += '</div>';
    return h;
  }

  /* -------------------------------------------------------------- More */
  // every More row by id, so the section system can order and hide them
  function moreRow(id) {
    switch (id) {
      case 'learn': return iosRow({ href: '#/learn', tile: ['blue', 'book'], title: Lx('Learn and safety'), sub: Lx('Bears, ticks, roads, water') });
      case 'invasives': return iosRow({ href: '#/invasives', tile: ['orange', 'alert'], title: Lx('Invasive species'), sub: Lx('What to watch for and how to report') });
      case 'stats': return iosRow({ href: '#/stats', tile: ['purple', 'chart'], title: Lx('Stats'), sub: Lx('Your numbers') });
      case 'community': return iosRow({ href: '#/community', tile: ['green', 'globe'], title: Lx('Community'), sub: (Community.on() ? 'Sharing on · see nearby activity' : app.settings.communityUrl ? 'Connected · sharing off' : Lx('What’s near you this week')) });
      case 'resources': return iosRow({ href: '#/resources', tile: ['blue', 'link-out'], title: Lx('Ontario and Canada resources'), sub: Lx('Trusted sites') });
      case 'trust': return iosRow({ href: '#/trust', tile: ['graphite', 'shield'], title: Lx('Data reliability'), sub: Lx('Anomaly detection, a demo') });
      case 'privacy': return iosRow({ href: '#/privacy', tile: ['grey', 'lock'], title: Lx('Privacy'), sub: Lx('Private, on this phone') });
    }
    return '';
  }
  function moreSection(key, foot) {
    var rows = sectionOrder(key).filter(function (r) { return r.on; });
    // an emptied section keeps its head, or the way back in disappears
    if (!rows.length) return sectionHead(key) + '<p class="ios-group-foot">' + Lx('Every row in this section is hidden. Use the edit button to show them again.') + '</p>';
    return sectionHead(key) + '<nav class="ios-group">' +
      rows.map(function (r) { return moreRow(r.def.id); }).join('') + '</nav>' +
      (foot ? '<p class="ios-group-foot">' + foot + '</p>' : '');
  }
  function viewMore() {
    // Settings' voice: grouped rows, straight in. What the app is belongs to
    // the About section further down, which already says it.
    var body = '';
    // Learn moved out of the tab bar to make room for the Journal, so it lives
    // here as an ordinary row into the same hub screen.
    body += moreSection('more-learn');
    body += moreSection('more-journal', Lx('Your encounters live in the Journal tab.'));
    body += moreSection('more-community');

    body += sectionTitle(Lx('Appearance')) + appearancePanel() +
      '<div class="ios-group">' +
      '<div class="field"><span class="field-label">' + Lx('Units') + '</span><div style="flex:1"></div>' +
      '<div class="segmented" style="width:180px">' +
      '<button type="button" class="seg-opt' + (app.settings.units === 'metric' ? ' on' : '') + '" aria-pressed="' + (app.settings.units === 'metric' ? 'true' : 'false') + '" data-action="set-units" data-val="metric">' + Lx('Metric') + '</button>' +
      '<button type="button" class="seg-opt' + (app.settings.units === 'imperial' ? ' on' : '') + '" aria-pressed="' + (app.settings.units === 'imperial' ? 'true' : 'false') + '" data-action="set-units" data-val="imperial">' + Lx('Imperial') + '</button>' +
      '</div></div>' +
      appearSegRow(Lx('Language'), 'set-lang', (app.settings.lang === 'fr' ? 'fr' : 'en'), [['en', 'English'], ['fr', 'Français']], 200) +
      appearSegRow(Lx('Third tab'), 'set-pursuit', (app.settings.primaryPursuit === 'birding' ? 'birding' : 'fishing'), [['fishing', Lx('Fishing')], ['birding', Lx('Birding')]], 200) +
      '</div>';

    body += sectionTitle(Lx('More from the Ontario outdoors')) + '<nav class="ios-group">' +
      iosRow({ href: 'https://katsuma.ca/on-site/', ext: true, title: 'on-site', sub: Lx('Rate Ontario Parks campsites') }) +
      '</nav>';

    body += sectionTitle(Lx('Your data')) + '<div class="ios-group">' +
      iosRow({ action: 'export-data', tile: ['grey', 'download'], title: Lx('Export my log'), sub: Lx('Your whole log in one file') }) +
      iosRow({ action: 'import-data', tile: ['grey', 'upload'], title: Lx('Import a backup'), sub: Lx('From an exported file') }) +
      iosRow({ action: 'reset-data', danger: true, title: Lx('Reset all data'), chevron: false }) +
      '<input type="file" id="import-input" accept=".json,application/json" style="display:none" aria-hidden="true">' +
      '</div><p class="ios-group-foot">' + Lx('Import merges by id and skips anything already saved. Reset asks for confirmation twice.') + '</p>';

    body += sectionTitle(Lx('About')) + '<div class="ios-group">' +
      '<div class="info-row"><div class="info-v">on-wildlife is a private field guide and journal for the mammals, birds, reptiles, amphibians, fish, trees, plants, insects and fungi of Ontario. Look a species up, read the longer account, and log what you see. It works offline and installs to your home screen.</div></div><div class="info-row"><div class="info-v">I built it because I wanted one place to name what I run into outside and keep a record of it. The app has no ads, no accounts and no tracking. Everything you log stays on this device; there is no server. Sensitive locations, like bear sightings, are blurred to a coarser grid before they can reach the optional community layer.</div></div>' +
      iosRow({ href: 'https://katsuma0.github.io/on-fishing/', ext: true, title: Lx('on-fishing, the solo site'), sub: Lx('The standalone zone map stays up') }) +
      iosRow({ title: Lx('Species in guide'), value: SPECIES.length, chevron: false }) +
      iosRow({ action: 'version-tap', title: Lx('Version'), value: '4.5', chevron: false }) +
      iosRow({ href: 'https://katsuma.ca/', ext: true, title: 'katsuma.ca', sub: Lx('Apps, projects and the rest') }) +
      '</div>';

    // The App Store asks for the privacy policy to be reachable inside the
    // app, not only from the listing, and the not-affiliated line keeps the
    // park and programme names in this app clearly descriptive.
    body += sectionTitle(Lx('Legal')) + '<div class="ios-group">' +
      iosRow({ href: 'https://katsuma.ca/privacy.html', ext: true, title: Lx('Privacy policy'), sub: Lx('What stays on this phone, and what does not') }) +
      iosRow({ href: 'https://katsuma.ca/terms.html', ext: true, title: Lx('Terms of use'), sub: Lx('Including what this app is not safe for') }) +
      iosRow({ href: 'https://katsuma.ca/support.html', ext: true, title: Lx('Support'), sub: Lx('Help, and how to reach me') }) +
      '<div class="info-row"><div class="info-v">' + Lx('Not affiliated with Ontario Parks, the Government of Ontario, Parks Canada or Apple. Map images come from CARTO using OpenStreetMap data. Reference photos come from iNaturalist under their contributors’ licences.') + '</div></div>' +
      '</div>';

    body += sectionTitle(Lx('Future of this project')) + '<div class="ios-group">' +
      '<div class="info-row"><div class="info-v">' + Lx('Smart stickers are next: tap one of my stickers in the field and the right page opens in this app.') + '</div></div>' +
      '<div class="info-row"><div class="info-v">' + Lx('Offline maps you download before the trip. Pick your park, carry the map with no signal, and get a campground map you can actually read, because the printed ones are hard to follow.') + '</div></div>' +
      '<div class="info-row"><div class="info-v">' + Lx('Easier park entrances too, especially at parks like Hemlock where there are no signs. The long goal is to partner with a provincial park and pilot these features there.') + '</div></div>' +
      '</div>';
    // The bottom search pill, as Settings carries it; it opens the
    // existing universal search.
    body += '<a class="bottom-search" href="#/search">' + I.search + '<span>' + Lx('Search') + '</span></a><div class="spacer-pill"></div>';
    screen({ title: Lx('More'), large: true, header: true, actions: false, body: body });
  }
  /* ------------------------------------------------------------ Account */
  function viewAccount() {
    var life = lifeList();
    var all = journalEntries();
    var photosN = app.entries.filter(function (e) { return e.photo; }).length;
    var body = '<div class="ios-avatar account-avatar" id="account-avatar" aria-hidden="true">' + avatarInner() + '</div>';

    body += '<div class="ios-group" style="margin-top:8px">' +
      '<div class="field"><label class="field-label" for="display-name">' + Lx('Name') + '</label>' +
      '<input type="text" id="display-name" placeholder="' + Lx('Your name') + '" autocomplete="off" autocorrect="off" value="' + esc(profileName()) + '"></div>' +
      '</div>';

    body += '<div class="stat-grid">' +
      stat(life.length, Lx('Life list')) +
      stat(all.length, all.length === 1 ? Lx('Encounter') : Lx('Encounters')) +
      stat(entriesThisYear(), Lx('This year')) +
      '</div><div class="spacer"></div>';

    body += '<nav class="ios-group">' +
      iosRow({ href: '#/photos', tile: ['orange', 'image'], title: Lx('Photos'), value: photosN }) +
      iosRow({ href: '#/community', tile: ['graphite', 'lock'], title: Lx('Visibility'), value: (Community.on() ? Lx('Sharing on') : Lx('Sharing off')) }) +
      iosRow({ href: '#/stats', tile: ['purple', 'chart'], title: Lx('Stats') }) +
      iosRow({ action: 'export-data', tile: ['grey', 'download'], title: Lx('Export my log') }) +
      iosRow({ title: Lx('Version'), value: '4.5', chevron: false }) +
      '</nav>';

    screen({ title: Lx('Account'), backAction: true, backText: Lx('Back'), body: body });
  }

  /* ------------------------------------------------------------- Photos */
  function viewPhotos() {
    var list = app.entries.filter(function (e) { return e.photo; })
      .sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
    var body;
    if (!list.length) {
      body = '<div class="empty"><div class="e">\u{1F4F7}</div><h3>No photos yet</h3>' +
        '<p>Attach a photo when you log an encounter and it will land here, newest first.</p></div>';
    } else {
      body = '<div class="photo-grid">';
      list.forEach(function (e) {
        body += '<button type="button" class="photo-tile" data-action="open-entry" data-id="' + esc(e.id) + '"' +
          ' aria-label="' + esc(e.speciesName) + ', ' + esc(fmtDay(e.when)) + '">' +
          '<img src="' + e.photo + '" alt="" loading="lazy"></button>';
      });
      body += '</div>';
    }
    screen({ title: 'Photos', backAction: true, backText: 'Back', body: body });
  }

  function moreCell(emoji, title, sub, action, data) {
    var attrs = 'data-action="' + action + '"';
    if (data) { if (data.cat) attrs += ' data-cat="' + data.cat + '"'; if (data.sub) attrs += ' data-sub="' + data.sub + '"'; }
    return '<button class="cell tap" ' + attrs + '>' +
      (emoji ? '<span class="cell-emoji">' + emoji + '</span>' : '') +
      '<span class="cell-body"><span class="cell-title">' + esc(title) + '</span>' +
      '<span class="cell-sub">' + esc(sub) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></button>';
  }

  /* =============================================================== MAP */
  function viewMap() {
    // one control card floats over the map, apple maps style: what shows
    // (the filters, bears folded under hazards) and what draws (layers)
    var body =
      '<div class="map-wrap"><div id="map"></div>' +
        '<div class="map-card" id="map-chips">' + mapChips() + '</div>' +
        '<div class="map-hint" id="map-hint" role="status" aria-live="polite"></div>' +
        '<div class="map-note" id="map-offline" role="status" aria-live="polite" hidden>' + Lx('Map tiles need a connection. Your pins still show.') + '</div>' +
        '<div class="map-note" id="map-zones-note" role="status" aria-live="polite" style="bottom:56px" hidden>' + Lx('Fishing zone boundaries need a connection. Your pins still show.') + '</div>' +
        '<div class="map-fabs">' +
          '<button class="fab fab-locate" data-action="map-locate" aria-label="' + Lx('My location') + '">' + I.crosshair + '</button>' +
          '<button class="fab fab-hazard" data-action="report-hazard" aria-label="' + Lx('Report hazard') + '">⚠️</button>' +
          '<button class="fab fab-bear" data-action="report-bear" aria-label="' + Lx('Report bear') + '">\u{1F43B}</button>' +
        '</div>' +
        '<a class="bottom-search" href="#/search">' + I.search + '<span>' + Lx('Search') + '</span></a>' +
      '</div>';
    screen({ title: Lx('Map'), header: true, body: body, bare: true });
    ensureLeaflet(initMap);
  }
  /* Leaflet is 45KB compressed and only the Map tab needs it, so it stays out
     of the boot chain and loads the first time the map opens. The service
     worker still precaches it, so offline is unchanged. */
  var _leafletLoading = false;
  function ensureLeaflet(then) {
    if (window.L) { then(); return; }
    var el = document.getElementById('map');
    if (el && !el.firstChild) el.innerHTML = '<div class="map-msg">' + spinnerHtml() + '<span>' + Lx('Loading the map…') + '</span></div>';
    if (_leafletLoading) return;
    _leafletLoading = true;
    var s = document.createElement('script');
    s.src = 'vendor/leaflet/leaflet.js';
    s.async = true;
    s.onload = function () { _leafletLoading = false; if (currentTab() === 'map') then(); };
    s.onerror = function () {
      _leafletLoading = false;
      var m = document.getElementById('map');
      if (m) m.innerHTML = '<div class="map-msg">' + Lx('Map couldn’t load.') + '</div>';
    };
    document.body.appendChild(s);
  }
  // every chip is an independent toggle and the map starts clean:
  // nothing draws until it is asked for
  function mapShow(key) {
    var m = app.settings.mapShow;
    return !!(m && m[key]);
  }
  function mapChips() {
    function c(id, label) { var on = mapShow(id); return '<button class="chip' + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-action="map-filter" data-f="' + id + '">' + label + '</button>'; }
    function lay(id, label) { var on = mapLayerOn(id); return '<button class="chip' + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-action="map-layer" data-l="' + id + '">' + label + '</button>'; }
    return c('wildlife', '\u{1F43E} ' + Lx('Wildlife')) + c('hazard', '⚠️ ' + Lx('Hazards')) +
      '<span class="chip-sep" aria-hidden="true"></span>' +
      lay('parks', '\u{1F3D5} ' + Lx('Parks')) + lay('zones', '\u{1F3A3} ' + Lx('Zones'));
  }
  function locatedRecords() {
    var out = [];
    app.entries.forEach(function (e) {
      if (typeof e.lat === 'number' && typeof e.lng === 'number') { var r = clone(e); r.kind = isBearEntry(e) ? 'bear' : 'wildlife'; out.push(r); }
    });
    app.hazards.forEach(function (h) {
      if (typeof h.lat === 'number' && typeof h.lng === 'number') { var r = clone(h); r.kind = 'hazard'; out.push(r); }
    });
    return out;
  }
  function clone(o) { var r = {}; for (var k in o) if (o.hasOwnProperty(k)) r[k] = o[k]; return r; }
  function pinIcon(emoji, cls) {
    return L.divIcon({ className: 'pin-wrap', html: '<div class="pin ' + cls + '"><span class="pin-i">' + emoji + '</span></div>', iconSize: [34, 40], iconAnchor: [17, 38], popupAnchor: [0, -36] });
  }
  function initMap() {
    var el = document.getElementById('map');
    if (!el) return;
    if (!window.L) { el.innerHTML = '<div class="map-msg">' + Lx('Map couldn’t load.') + '</div>'; return; }
    el.innerHTML = '';   // drop the lazy-load placeholder before Leaflet mounts
    if (app.map) { try { app.map.remove(); } catch (e) {} app.map = null; }
    // No +/- buttons: they cover the top-left corner of the map and pinch and
    // scroll wheel zoom already cover both touch and desktop.
    var map = L.map(el, { zoomControl: false, attributionControl: true }).setView([50.0, -85.0], 5);
    app.map = map;
    // carto's muted basemaps read like apple maps; pick by the scheme in
    // effect and keep osm's data attribution
    var darkMap = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (document.documentElement.getAttribute('data-theme') !== 'light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/' + (darkMap ? 'dark_all' : 'light_all') + '/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO'
    });
    // Degrade gracefully offline: show a note instead of a blank grey grid.
    tiles.on('tileerror', function () { var n = $('#map-offline'); if (n) n.hidden = false; });
    tiles.on('load', function () { var n = $('#map-offline'); if (n) n.hidden = true; });
    tiles.addTo(map);
    renderMapMarkers();
    applyMapLayers();
    var located = locatedRecords();
    if (located.length) {
      try { map.fitBounds(L.latLngBounds(located.map(function (r) { return [r.lat, r.lng]; })).pad(0.35), { maxZoom: 13 }); } catch (e) {}
    }
    // Don't silently read GPS on open (privacy): the province view is the default;
    // the user taps the locate button when they want to centre on themselves.
    map.on('click', function (ev) {
      if (app.placeMode === 'bear') { app.placeMode = null; updateMapHint(); openBearReport({ lat: ev.latlng.lat, lng: ev.latlng.lng }); }
      else if (app.placeMode === 'hazard') { app.placeMode = null; updateMapHint(); openHazardReport({ lat: ev.latlng.lat, lng: ev.latlng.lng }); }
    });
    setTimeout(function () { if (app.map === map) map.invalidateSize(); }, 80);
    setTimeout(function () { if (app.map === map) map.invalidateSize(); }, 400);
    updateMapHint();
  }
  function renderMapMarkers() {
    if (!app.map) return;
    if (app._layer) { try { app.map.removeLayer(app._layer); } catch (e) {} app._layer = null; }
    // pins are always drawn: the filter chips are the visibility control
    // now, and an old stored wildlife:false must not hide them forever
    var group = L.layerGroup();
    locatedRecords().filter(function (r) {
      if (r.kind === 'hazard' || r.kind === 'bear') return mapShow('hazard');
      return mapShow('wildlife');
    }).forEach(function (r) {
      var icon, popup;
      if (r.kind === 'hazard') {
        var ht = hazardType(r.type);
        icon = pinIcon(ht.emoji, 'pin-hazard');
        popup = '<b>' + esc(ht.name) + '</b><br>' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when)) + (r.notes ? '<br>' + esc(r.notes) : '');
      } else if (r.kind === 'bear') {
        icon = pinIcon('\u{1F43B}', 'pin-bear');
        popup = '<b>' + esc(r.speciesName || 'Bear') + '</b><br>' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when)) + (r.bearReport && r.bearReport.cubs ? '<br>Cubs present' : '');
      } else {
        icon = pinIcon(r.emoji || '\u{1F43E}', 'pin-wild');
        popup = '<b>' + esc(r.speciesName) + '</b><br>' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when)) + (r.speciesId ? '<br><a href="#/species/' + esc(r.speciesId) + '">Field guide ›</a>' : '');
      }
      L.marker([r.lat, r.lng], { icon: icon }).bindPopup(popup).addTo(group);
    });
    group.addTo(app.map);
    app._layer = group;
  }

  /* ---- Map layers (wildlife pins, provincial parks, fishing zones) ----
     Choices persist in settings.mapLayers. The zone boundaries come from the
     exact service and query on-fishing uses, cached in a module variable and
     runtime-cached by the service worker so they survive offline. */
  var ZONE_SERVICE = 'https://ws.lioservices.lrc.gov.on.ca/arcgis2/rest/services/LIO_OPEN_DATA/LIO_Open07/MapServer/14';
  var ZONE_FIELD = 'FISHERIES_MANAGEMENT_ZONE_ID';
  var ZONE_BOUNDS_URL = ZONE_SERVICE + '/query?where=1%3D1' +
    '&outFields=' + ZONE_FIELD + ',LOCATION_DESCR' +
    '&returnGeometry=true&maxAllowableOffset=0.005&geometryPrecision=5&outSR=4326&f=geojson';
  var _zonesGeo = null, _zonesLoading = false;
  function mapLayerOn(key) {
    var m = app.settings.mapLayers || {};
    return key === 'wildlife' ? m.wildlife !== false : !!m[key];
  }
  function cssVar(name) {
    try { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
    catch (e) { return ''; }
  }
  function buildParksLayer() {
    var group = L.layerGroup();
    ((window.ECO && ECO.parks) || []).forEach(function (p) {
      if (p.lat == null || p.lng == null) return;
      L.marker([p.lat, p.lng], { icon: pinIcon('\u{1F332}', 'pin-park'), title: p.name, alt: p.name })
        .on('click', function () { location.hash = '#/park/' + p.id; })
        .addTo(group);
    });
    return group;
  }
  function drawZonesLayer() {
    if (!app.map || !_zonesGeo) return;
    if (app._zonesLayer) { try { app.map.removeLayer(app._zonesLayer); } catch (e) {} app._zonesLayer = null; }
    var line = cssVar('--tint');
    var geo = L.geoJSON(_zonesGeo, {
      style: function () { return { color: line, weight: 1.2, fillColor: line, fillOpacity: 0.12 }; },
      onEachFeature: function (f, lyr) {
        lyr.on('click', function () {
          var z = f.properties && f.properties[ZONE_FIELD];
          if (z != null) location.hash = '#/zones/' + z;
        });
      }
    });
    var group = L.layerGroup([geo]);
    // one zone-number label per zone, at the centre of its combined bounds
    var bounds = {};
    geo.eachLayer(function (lyr) {
      var z = lyr.feature && lyr.feature.properties && lyr.feature.properties[ZONE_FIELD];
      if (z == null || !lyr.getBounds) return;
      var b = lyr.getBounds();
      if (bounds[z]) bounds[z].extend(b);
      else bounds[z] = L.latLngBounds(b.getSouthWest(), b.getNorthEast());
    });
    for (var z in bounds) {
      if (!bounds.hasOwnProperty(z)) continue;
      group.addLayer(L.marker(bounds[z].getCenter(), {
        interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'zone-label-wrap', html: '<div class="zone-label">' + esc(String(z)) + '</div>', iconSize: [0, 0] })
      }));
    }
    group.addTo(app.map);
    app._zonesLayer = group;
  }
  function ensureZonesLayer() {
    if (_zonesGeo) { drawZonesLayer(); return; }
    if (_zonesLoading) return;
    _zonesLoading = true;
    fetch(ZONE_BOUNDS_URL).then(function (r) { return r.json(); }).then(function (gj) {
      _zonesLoading = false;
      if (!gj || !gj.features) throw new Error('bad geojson');
      _zonesGeo = gj;
      if (app.map && mapLayerOn('zones')) drawZonesLayer();
    }).catch(function () {
      _zonesLoading = false;
      // offline-note style, never an error
      var n = document.getElementById('map-zones-note'); if (n) n.hidden = false;
    });
  }
  function applyMapLayers() {
    if (!app.map) return;
    if (mapLayerOn('parks')) {
      if (!app._parksLayer) app._parksLayer = buildParksLayer();
      if (!app.map.hasLayer(app._parksLayer)) app._parksLayer.addTo(app.map);
    } else if (app._parksLayer) {
      try { app.map.removeLayer(app._parksLayer); } catch (e) {}
    }
    if (mapLayerOn('zones')) {
      if (app._zonesLayer) { if (!app.map.hasLayer(app._zonesLayer)) app._zonesLayer.addTo(app.map); }
      else ensureZonesLayer();
    } else {
      if (app._zonesLayer) { try { app.map.removeLayer(app._zonesLayer); } catch (e) {} }
      var zn = document.getElementById('map-zones-note'); if (zn) zn.hidden = true;
    }
  }
  function layerSwitchRow(id, label, sub, on) {
    return '<div class="field"><span class="ios-row-body" style="flex:1"><span class="ios-row-title">' + esc(label) + '</span>' +
      (sub ? '<span class="ios-row-sub" style="white-space:normal">' + esc(sub) + '</span>' : '') + '</span>' +
      '<label class="switch"><input type="checkbox" id="' + id + '" aria-label="' + esc(label) + '"' + (on ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>';
  }
  function openLayersSheet() {
    var body = '<div class="group" style="margin-top:6px"><div class="group-header">Show on the map</div><div class="list">' +
      layerSwitchRow('layer-wildlife', 'Wildlife pins', 'Your sightings, bears and hazards', mapLayerOn('wildlife')) +
      layerSwitchRow('layer-parks', 'Provincial parks', 'Tap a pin to open the park page', mapLayerOn('parks')) +
      layerSwitchRow('layer-zones', 'Fishing zones', 'The 20 fisheries management zones', mapLayerOn('zones')) +
      '</div><div class="group-footer">Zone boundaries load once from Ontario’s open data service and are kept for offline use. Tap a zone for its seasons and limits.</div></div>';
    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">Layers</span>' +
      '<button class="nav-btn bold" data-action="close-sheet">Done</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { var s = $('#sheet'); if (s) s.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
    afterSheetOpen();
  }
  function setMapLayer(key, on) {
    if (!app.settings.mapLayers || typeof app.settings.mapLayers !== 'object') app.settings.mapLayers = { wildlife: true, parks: false, zones: false };
    app.settings.mapLayers[key] = !!on;
    saveSettings();
    if (key === 'wildlife') renderMapMarkers();
    applyMapLayers();
  }
  function updateMapHint() {
    var el = document.getElementById('map-hint'); if (!el) return;
    clearTimeout(app._hintTimer);
    if (app.placeMode) {
      el.innerHTML = (app.placeMode === 'bear' ? '🐻 Tap the map where you saw the bear' : '⚠️ Tap the map to place the hazard') +
        ' <button type="button" class="hint-btn" data-action="place-center">or place at map centre</button>';
      el.classList.add('show');
    } else if (!locatedRecords().length) {
      el.innerHTML = 'No mapped reports yet. Tap 🐻 or ⚠️, then tap the map. Sightings you log with a location show up here too.';
      el.classList.add('show');
      // informational only, so it steps out of the way after a few seconds
      app._hintTimer = setTimeout(function () { el.classList.remove('show'); }, 4000);
    } else { el.classList.remove('show'); el.textContent = ''; }
  }
  function mapLocate(silent) {
    if (!app.map || !navigator.geolocation) { if (!silent) toast('Location not available'); return; }
    // Coarse accuracy is enough to centre the map, and avoids waking precise GPS.
    navigator.geolocation.getCurrentPosition(function (p) {
      if (app.map) app.map.setView([p.coords.latitude, p.coords.longitude], 12);
    }, function () { if (!silent) toast('Location permission denied'); }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 });
  }

  /* ===================================================== BEAR & HAZARD REPORTS */
  function segHtml(action, current, opts) {
    var h = '<div class="segmented">';
    opts.forEach(function (o) { h += '<button type="button" class="seg-opt' + (current === o[0] ? ' on' : '') + '" aria-pressed="' + (current === o[0] ? 'true' : 'false') + '" data-action="' + action + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; });
    return h + '</div>';
  }
  function locCell(action, lat, lng) {
    var has = lat != null;
    return '<button class="cell tap" data-action="' + action + '">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.pin + '</span>' +
      '<span class="cell-body"><span class="cell-title" style="color:var(--tint)">' + (has ? 'Location set' : 'Use my location') + '</span>' +
      '<span class="cell-sub">' + (has ? (lat.toFixed(4) + ', ' + lng.toFixed(4)) : 'Tap to capture GPS, or drop a pin on the map') + '</span></span></button>';
  }
  /* While any sheet (or the species picker riding on one) is open the page
     behind is scroll-locked: iOS Safari otherwise pans the page when the
     keyboard opens, pushing the top of the sheet out of reach. The scroll
     position is stored on lock and restored on unlock. */
  var _scrollLockY = null;
  function lockScroll() {
    if (_scrollLockY != null) return;
    _scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('sheet-lock');
    document.body.style.top = (-_scrollLockY) + 'px';
  }
  function unlockScroll() {
    if (_scrollLockY == null) return;
    var y = _scrollLockY; _scrollLockY = null;
    document.documentElement.classList.remove('sheet-lock');
    document.body.style.top = '';
    window.scrollTo(0, y);
  }
  // Modal accessibility: label the dialog, move focus in, make the rest of the
  // page inert (also traps Tab where supported), and restore focus on close.
  /* Sheets follow the finger: dragging the grabber or the sheet's own nav
     row pulls the pane down; past the threshold (or on a quick flick) it
     dismisses, otherwise it springs back. The grabber's hit area is grown
     in CSS; scrolling the sheet body is untouched. */
  function wireSheetDrag() {
    var sheet = $('#sheet');
    if (!sheet || sheet._dragWired) return;
    sheet._dragWired = true;
    var startY = 0, dy = 0, active = null, t0 = 0;
    function down(ev) {
      if (active != null) return;
      // The nav row doubles as a drag zone, but its buttons stay buttons:
      // capturing their pointer would swallow the click.
      if (ev.target.closest && ev.target.closest('button, a, input, select, textarea, label')) return;
      active = ev.pointerId; startY = ev.clientY; dy = 0; t0 = Date.now();
      sheet.classList.add('dragging');
      try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (e) {}
      ev.preventDefault();
    }
    function move(ev) {
      if (ev.pointerId !== active) return;
      dy = Math.max(0, ev.clientY - startY);
      sheet.style.transform = 'translateY(' + dy + 'px)';
    }
    function up(ev) {
      if (ev == null || ev.pointerId !== active) return;
      active = null;
      sheet.classList.remove('dragging');
      sheet.style.transform = '';
      var flick = dy > 48 && (Date.now() - t0) < 280;
      if (dy > 120 || flick) closeSheet();
    }
    [sheet.querySelector('.sheet-grabber'), sheet.querySelector('.sheet-nav')].forEach(function (el) {
      if (!el) return;
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }
  function afterSheetOpen() {
    var s = $('#sheet'); if (!s) return;
    lockScroll();
    wireSheetDrag();
    s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true');
    var t = s.querySelector('.sheet-nav .t, h1, h2');
    if (t) { if (!t.id) t.id = 'sheet-title'; s.setAttribute('aria-labelledby', t.id); }
    var firstOpen = !app._lastFocus;
    if (firstOpen) app._lastFocus = document.activeElement;
    var appEl = $('#app'), tb = $('#tabbar');
    try {
      if (appEl) { appEl.setAttribute('inert', ''); appEl.setAttribute('aria-hidden', 'true'); }
      if (tb) { tb.setAttribute('inert', ''); tb.setAttribute('aria-hidden', 'true'); }
    } catch (e) {}
    // Move focus in on first open, and re-establish it whenever a re-render
    // (segmented tap, edit transition) detached the focused control so it fell to <body>.
    var needFocus = firstOpen || !s.contains(document.activeElement);
    if (needFocus) setTimeout(function () {
      var s2 = $('#sheet'); if (!s2 || s2.contains(document.activeElement)) return;
      var f = s2.querySelector('input:not([type=hidden]), textarea, button.nav-btn.bold, button, a[href]');
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) { try { f.focus(); } catch (e2) {} } }
    }, 80);
  }
  function clearSheetA11y() {
    var appEl = $('#app'), tb = $('#tabbar');
    try {
      if (appEl) { appEl.removeAttribute('inert'); appEl.removeAttribute('aria-hidden'); }
      if (tb) { tb.removeAttribute('inert'); tb.removeAttribute('aria-hidden'); }
    } catch (e) {}
    if (app._lastFocus && app._lastFocus.focus) { try { app._lastFocus.focus(); } catch (e) {} }
    app._lastFocus = null;
  }
  function mountSheet(title, body, saveAction) {
    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">' + Lx('Cancel') + '</button><span class="t">' + esc(Lx(title)) + '</span>' +
      '<button class="nav-btn bold" data-action="' + saveAction + '">' + Lx('Save') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { var s = $('#sheet'); if (s) s.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
    afterSheetOpen();
  }
  function reportLocate(which) {
    if (!navigator.geolocation) { toast('Location not available'); return; }
    var d = which === 'bear' ? app.bdraft : app.hdraft; if (!d) return;
    toast('Locating…');
    navigator.geolocation.getCurrentPosition(function (p) {
      d.lat = p.coords.latitude; d.lng = p.coords.longitude;
      var active = which === 'bear' ? app.bdraft : app.hdraft;
      if (active !== d || !$('#sheet')) return;   // sheet was closed / draft replaced, don't re-open a modal the user dismissed
      haptic();
      if (which === 'bear') { readBear(); renderBearSheet(); } else { readHazard(); renderHazardSheet(); }
    }, function () { toast('Location permission denied'); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }
  function afterReportSaved() {
    if (app.map) { renderMapMarkers(); updateMapHint(); }
    else setTimeout(route, 120);
  }

  function openBearReport(prefill) {
    prefill = prefill || {};
    app.bdraft = { species: 'american-black-bear', count: 1, cubs: false, behaviour: 'calm', when: localDatetimeValue(new Date()), notes: '', lat: prefill.lat != null ? prefill.lat : null, lng: prefill.lng != null ? prefill.lng : null };
    renderBearSheet();
  }
  function readBear() {
    var d = app.bdraft; if (!d) return;
    var w = document.getElementById('b-when'); if (w) d.when = w.value;
    var n = document.getElementById('b-notes'); if (n) d.notes = n.value;
    var c = document.getElementById('b-cubs'); if (c) d.cubs = c.checked;
  }
  function renderBearSheet() {
    var d = app.bdraft;
    var body = '';
    body += '<div class="wrap-note danger" style="margin:8px 16px"><span class="i">🐻</span><span>Saving here adds it to <b>your own log</b>. It does <b>not</b> alert authorities. For an immediate threat call <b>911</b>. For non-emergency bear problems call Bear Wise <b>1-866-514-2327</b> (Apr to Nov). <a href="#/learn/bears" data-action="close-sheet-nav">Bear safety ›</a></span></div>';
    body += '<div class="group" style="margin-top:6px"><div class="group-header">The bear</div><div class="list">';
    body += '<div class="field"><span class="field-label">Type</span><div style="flex:1"></div><div style="width:220px">' + segHtml('bear-species', d.species, [['american-black-bear', 'Black bear'], ['polar-bear', 'Polar bear']]) + '</div></div>';
    body += '<div class="field"><span class="field-label">How many</span><div style="flex:1"></div><div class="stepper"><button data-action="bcount" data-d="-1">−</button><div class="sep"></div><div class="val" id="bcount-val">' + d.count + '</div><div class="sep"></div><button data-action="bcount" data-d="1">+</button></div></div>';
    body += '<div class="field"><span class="field-label">Cubs present</span><div style="flex:1"></div><label class="switch"><input type="checkbox" id="b-cubs" aria-label="Cubs present"' + (d.cubs ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>';
    body += '</div></div>';
    body += '<div class="group"><div class="group-header">Behaviour</div><div class="list"><div style="padding:12px 16px">' + segHtml('bear-behaviour', d.behaviour, [['calm', 'Calm / moved off'], ['curious', 'Curious'], ['aggressive', 'Aggressive']]) + '</div></div></div>';
    body += '<div class="group"><div class="group-header">Where & when</div><div class="list">' + locCell('bear-locate', d.lat, d.lng) +
      '<div class="field"><span class="field-label">When</span><input type="datetime-local" id="b-when" aria-label="Date and time seen" value="' + esc(d.when) + '"></div></div></div>';
    body += '<div class="group"><div class="group-header">Notes</div><div class="list"><textarea class="notes" id="b-notes" aria-label="Notes" placeholder="Location details, what it was doing…"></textarea></div></div>';
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-bear">Save Bear Sighting</button></div>';
    mountSheet('Report a Bear', body, 'save-bear');
    setVal('b-notes', d.notes);
  }
  function saveBear() {
    readBear();
    var d = app.bdraft, sp = byId[d.species];
    var entry = {
      id: uid(), speciesId: d.species, speciesName: sp ? sp.name : 'Bear', cat: 'mammals', sub: sp ? sp.sub : 'large-mammals',
      emoji: sp ? sp.emoji : '\u{1F43B}', evidence: 'saw', count: d.count,
      when: d.when ? new Date(d.when).toISOString() : new Date().toISOString(),
      lat: d.lat, lng: d.lng, notes: (d.notes || '').trim(), photo: null, fish: null, bird: null,
      bearReport: { count: d.count, cubs: !!d.cubs, behaviour: d.behaviour }, createdAt: new Date().toISOString()
    };
    if (entry.lat != null && isSensitive(entry.speciesId)) entry.sensitiveLoc = true;
    if (app._saving) return; app._saving = true;
    app.entries.push(entry);
    Store.put(entry).then(function () {
      app._saving = false;
      Community.post(communityPayload(entry)); haptic(); closeSheet(); toast('🐻 Saved to your log (on your phone)'); afterReportSaved(); setTimeout(checkNewBadges, 1400);
    }).catch(function () { app._saving = false; var i = app.entries.indexOf(entry); if (i >= 0) app.entries.splice(i, 1); toast('Couldn’t save. Storage may be full.'); });
  }

  function openHazardReport(prefill) {
    prefill = prefill || {};
    app.hdraft = { type: 'wildlife-road', when: localDatetimeValue(new Date()), notes: '', lat: prefill.lat != null ? prefill.lat : null, lng: prefill.lng != null ? prefill.lng : null };
    renderHazardSheet();
  }
  function readHazard() {
    var d = app.hdraft; if (!d) return;
    var w = document.getElementById('h-when'); if (w) d.when = w.value;
    var n = document.getElementById('h-notes'); if (n) d.notes = n.value;
  }
  function renderHazardSheet() {
    var d = app.hdraft;
    var grid = '<div class="type-grid">';
    HAZARD_TYPES.forEach(function (t) {
      grid += '<button class="type-opt' + (d.type === t.id ? ' on' : '') + '" aria-pressed="' + (d.type === t.id ? 'true' : 'false') + '" data-action="hazard-type" data-t="' + t.id + '"><span class="te">' + t.emoji + '</span><span>' + esc(t.name) + '</span></button>';
    });
    grid += '</div>';
    var body = '';
    body += '<div class="group" style="margin-top:6px"><div class="group-header">Hazard type</div>' + grid + '</div>';
    body += '<div class="group"><div class="group-header">Where & when</div><div class="list">' + locCell('hazard-locate', d.lat, d.lng) +
      '<div class="field"><span class="field-label">When</span><input type="datetime-local" id="h-when" aria-label="Date and time" value="' + esc(d.when) + '"></div></div></div>';
    body += '<div class="group"><div class="group-header">Notes</div><div class="list"><textarea class="notes" id="h-notes" aria-label="Notes" placeholder="What & where exactly…"></textarea></div></div>';
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-hazard">Save Hazard</button></div>';
    mountSheet('Report a Hazard', body, 'save-hazard');
    setVal('h-notes', d.notes);
  }
  function saveHazard() {
    readHazard();
    var d = app.hdraft;
    var h = { id: uid(), type: d.type, lat: d.lat, lng: d.lng, when: d.when ? new Date(d.when).toISOString() : new Date().toISOString(), notes: (d.notes || '').trim(), createdAt: new Date().toISOString() };
    if (app._saving) return; app._saving = true;
    app.hazards.push(h);
    Store.put(h, 'hazards').then(function () {
      app._saving = false;
      Community.post({ kind: 'hazard', hazardType: h.type, cat: 'hazard', count: 1, sensitive: false, lat: typeof h.lat === 'number' ? coarseFor(h.lat, false) : null, lng: typeof h.lng === 'number' ? coarseFor(h.lng, false) : null, when: blurWhen(h.when) });
      haptic(); closeSheet(); toast('⚠️ Hazard saved'); afterReportSaved(); setTimeout(checkNewBadges, 1400);
    }).catch(function () { app._saving = false; var i = app.hazards.indexOf(h); if (i >= 0) app.hazards.splice(i, 1); toast('Couldn’t save. Storage may be full.'); });
  }

  /* ======================================================== LEARN / RESOURCES */
  function viewLearn(topicId) {
    var t = LEARN.topics[topicId];
    if (!t) return viewMore();
    var body = '<div class="hero" style="padding-bottom:2px">' +
      '<div class="hero-emoji" style="background:' + (t.tint || 'var(--tint)') + '22">' + t.emoji + '</div>' +
      '<h1>' + esc(t.title) + '</h1>' + (t.subtitle ? '<div class="sci" style="font-style:normal">' + esc(t.subtitle) + '</div>' : '') + '</div>';
    if (t.disclaimer) body += '<div class="wrap-note"><span class="i">ℹ️</span><span>' + esc(t.disclaimer) + '</span></div>';
    if (t.intro) body += '<p class="article-intro">' + esc(t.intro) + '</p>';
    (t.sections || []).forEach(function (s) {
      body += '<section class="article-sec"><h3>' + esc(s.h) + '</h3>';
      if (s.p) body += '<p>' + esc(s.p) + '</p>';
      if (s.bullets) { body += '<ul>'; s.bullets.forEach(function (b) { body += '<li>' + esc(b) + '</li>'; }); body += '</ul>'; }
      if (s.steps) { body += '<ol>'; s.steps.forEach(function (b) { body += '<li>' + esc(b) + '</li>'; }); body += '</ol>'; }
      if (s.callout) body += calloutHtml(s.callout);
      body += '</section>';
    });
    if (t.links && t.links.length) {
      body += '<div class="group"><div class="group-header">Official sources</div><div class="list">';
      t.links.forEach(function (l) { body += linkCell(l.label, l.url, l.note); });
      body += '</div><div class="group-footer">Opens external sites in your browser.</div></div>';
    }
    screen({ title: t.title, backAction: true, backText: 'Back', body: body });
  }
  function calloutHtml(c) {
    var cls = c.style === 'danger' ? 'callout-danger' : c.style === 'warn' ? 'callout-warn' : 'callout-info';
    return '<div class="callout ' + cls + '">' + (c.title ? '<div class="callout-t">' + esc(c.title) + '</div>' : '') + '<div>' + esc(c.body) + '</div></div>';
  }
  function viewResources() {
    var body = '';
    (LEARN.resources || []).forEach(function (g) {
      body += '<div class="group"><div class="group-header">' + esc(g.group) + '</div><div class="list">';
      g.items.forEach(function (it) { body += linkCell(it.label, it.url, it.note); });
      body += '</div></div>';
    });
    body += '<div class="group-footer hpad" style="margin:8px 16px">Links open external sites in your browser. Ontario Wildlife Log isn’t affiliated with these organizations, and can’t guarantee external content.</div>';
    screen({ title: 'Resources', backAction: true, backText: 'More', body: body });
  }

  /* ==================================================== SAFETY & ALERTS */
  function isDanger(s) {
    if (!s.caution) return false;
    // Exclude purely legal/protection notes (e.g. protected species) that aren't a physical danger
    if (/illegal|protected/i.test(s.caution) &&
        !/venom|bite|burn|poison|rash|sting|toxic|attack|aggress|blister|quill|spray|fatal|dangerous|charge/i.test(s.caution)) return false;
    return true;
  }
  function viewAlerts() {
    var reports = [];
    app.entries.forEach(function (e) { if (isBearEntry(e)) reports.push({ kind: 'bear', e: e, when: e.when }); });
    app.hazards.forEach(function (h) { reports.push({ kind: 'hazard', h: h, when: h.when }); });
    reports.sort(function (a, b) { return new Date(b.when) - new Date(a.when); });

    var body = '';
    body += '<div class="wrap-note"><span class="i">⚠️</span><span>Your bear and hazard reports, and Ontario’s dangerous wildlife and plants, in one place. Alerts that reach everyone need the community server, which you can connect. For now this shows your own reports plus what to watch for.</span></div>';

    body += '<div class="group"><div class="group-header">Your recent reports</div>';
    if (reports.length) {
      body += '<div class="list">';
      reports.slice(0, 12).forEach(function (r) {
        if (r.kind === 'bear') {
          body += '<button type="button" class="cell tap" data-action="open-entry" data-id="' + esc(r.e.id) + '"><span class="cell-emoji">\u{1F43B}</span><span class="cell-body"><span class="cell-title">Bear sighting' + (r.e.bearReport && r.e.bearReport.cubs ? ' · cubs' : '') + '</span><span class="cell-sub">' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when)) + '</span></span><span class="chevron">' + I.chevron + '</span></button>';
        } else {
          var ht = hazardType(r.h.type);
          body += '<a class="cell tap" href="#/map"><span class="cell-emoji">' + ht.emoji + '</span><span class="cell-body"><span class="cell-title">' + esc(ht.name) + '</span><span class="cell-sub">' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when) + (r.h.notes ? ' · ' + r.h.notes : '')) + '</span></span><span class="chevron">' + I.chevron + '</span></a>';
        }
      });
      body += '</div>';
    } else {
      body += '<div class="list"><div class="info-row"><div class="info-v muted">No reports yet. Use 🐻 Report a Bear or ⚠️ Report a Hazard. They will show here and on the map.</div></div></div>';
    }
    body += '<div class="group-footer"><a href="#/map">Open the map ›</a></div></div>';

    body += '<div class="hpad" style="display:flex;gap:10px">' +
      '<button class="btn btn-gray btn-block" data-action="report-bear">\u{1F43B} Bear</button>' +
      '<button class="btn btn-gray btn-block" data-action="report-hazard">⚠️ Hazard</button></div>';

    body += '<div class="group"><div class="group-header">Safety guides</div><div class="list">' +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'Identify, prevent & remove', 'ticks') +
      learnCell('\u{1F43B}', 'Bear safety (Bear Wise)', 'Prevent encounters & report', 'bears') +
      learnCell('☠️', 'Dangerous plants', 'Poison ivy, giant hogweed & more', 'plants') +
      learnCell('\u{1F6E3}️', 'Wildlife on roads', 'Deer, moose & turtles', 'roads') +
      '</div></div>';

    body += dangerousList();
    screen({ title: 'Safety & Alerts', large: true, subtitle: 'Dangers to know & report', body: body });
  }
  function dangerousList() {
    var flagged = SPECIES.filter(isDanger);
    if (!flagged.length) return '';
    var order = CATEGORIES.map(function (c) { return c.id; });
    flagged.sort(function (a, b) { var d = order.indexOf(a.cat) - order.indexOf(b.cat); return d !== 0 ? d : a.name.localeCompare(b.name); });
    var html = '<div class="group"><div class="group-header">Dangerous wildlife & plants (' + flagged.length + ')</div><div class="list">';
    flagged.forEach(function (s) {
      html += '<a class="cell tap" href="#/species/' + esc(s.id) + '">' +
        '<span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">' + esc(s.name) + '</span>' +
        '<span class="cell-sub">' + esc(s.caution) + '</span></span>' +
        '<span class="badge badge-danger" style="flex-shrink:0">⚠</span></a>';
    });
    html += '</div><div class="group-footer">Tap any for identification and safety details.</div></div>';
    return html;
  }

  /* ============================================ DATA RELIABILITY (anomaly demo) */
  function riskClass(label) { return label === 'Flagged' ? 'risk-hi' : label === 'Review' ? 'risk-mid' : 'risk-lo'; }
  function trustBadgeClass(label) { return label === 'Flagged' ? 'badge-danger' : label === 'Review' ? 'badge-risk' : 'badge-ok'; }
  function viewTrust() {
    var T = window.TRUST;
    if (!T || !T.result) return viewMore();
    var cs = T.result.contributors;
    var flagged = cs.filter(function (c) { return c.label === 'Flagged'; }).length;
    var review = cs.filter(function (c) { return c.label === 'Review'; }).length;
    var maxRisk = Math.max(1, cs.reduce(function (m, c) { return Math.max(m, c.risk); }, 0));
    var body = '';
    body += '<div class="wrap-note"><span class="i">\u{1F9EA}</span><span><b>Demo.</b> Crowdsourced sightings only help conservation if they’re trustworthy. This runs a statistical model over <b>simulated</b> contributors, including a deliberately fake “sham” account with skewed, mostly false data, and flags anomalies. Not real user data.</span></div>';
    body += '<div class="stat-grid" style="margin-top:4px">' + stat(cs.length, 'Accounts') + stat(flagged, 'Flagged') + stat(review, 'To review') + '</div>';
    body += '<div class="group"><div class="group-header">Contributors by anomaly risk</div><div class="list">';
    cs.forEach(function (c) {
      body += '<a class="cell tap" href="#/trust/' + encodeURIComponent(c.account) + '">' +
        '<span class="cell-body"><span class="cell-title">' + esc(c.account) + '</span>' +
        '<span class="cell-sub">' + c.obsCount + ' sightings · ' + esc(c.home) + '</span>' +
        '<span class="riskbar"><span class="riskbar-fill ' + riskClass(c.label) + '" style="width:' + Math.round(c.risk / maxRisk * 100) + '%"></span></span></span>' +
        '<span class="badge ' + trustBadgeClass(c.label) + '" style="flex-shrink:0">' + esc(c.label) + '</span>' +
        '<span class="chevron">' + I.chevron + '</span></a>';
    });
    body += '</div><div class="group-footer">Robust z-scores (median/MAD) across six behavioural & plausibility features, combined into a 0–100 risk score. Tap an account for the breakdown.</div></div>';
    screen({ title: 'Data reliability', large: true, subtitle: 'Anomaly detection (demo)', body: body });
  }
  function viewTrustAccount(id) {
    var T = window.TRUST; if (!T || !T.result) return viewTrust();
    var acc = decodeURIComponent(id || ''), c = null;
    T.result.contributors.forEach(function (x) { if (x.account === acc) c = x; });
    if (!c) return viewTrust();
    var res = T.result;
    var heroBg = c.label === 'Flagged' ? '#ff3b3022' : c.label === 'Review' ? '#ff950022' : 'var(--tint-soft)';
    var heroIco = c.label === 'Flagged' ? '⚠️' : c.label === 'Review' ? '\u{1F50D}' : '✓';
    var body = '<div class="hero" style="padding:18px 20px 6px"><div class="hero-emoji" style="width:64px;height:64px;font-size:30px;background:' + heroBg + '">' + heroIco + '</div>' +
      '<h1 style="font-size:22px">' + esc(c.account) + '</h1>' +
      '<div class="badges"><span class="badge ' + trustBadgeClass(c.label) + '">' + esc(c.label) + '</span><span class="badge badge-info">Risk ' + c.risk + '/100</span><span class="badge badge-info">' + c.obsCount + ' sightings</span>' + (c.sham ? '<span class="badge badge-danger">simulated sham</span>' : '') + '</div></div>';
    if (c.reasons.length) {
      body += '<div class="group"><div class="group-header">Why it was flagged</div><div class="list">';
      c.reasons.forEach(function (r) { body += '<div class="cell"><span class="cell-emoji">⚠️</span><span class="cell-body"><span class="cell-title" style="font-size:15px">' + esc(r) + '</span></span></div>'; });
      body += '</div></div>';
    } else {
      body += '<div class="wrap-note"><span class="i">✓</span><span>No significant anomalies. This contributor’s data is consistent with peers.</span></div>';
    }
    body += '<div class="group"><div class="group-header">Feature deviation (robust z-score)</div><div class="list" style="padding:8px 0">';
    res.keys.forEach(function (k) {
      var z = c.z[k]; var pct = Math.max(2, Math.min(100, Math.round(Math.min(Math.abs(z), 4) / 4 * 100)));
      var cls = z >= 1.8 ? 'risk-hi' : z >= 1 ? 'risk-mid' : 'risk-lo';
      body += '<div class="zrow"><div class="zrow-top"><span>' + esc(res.labels[k]) + '</span><span class="muted">' + (z >= 0 ? '+' : '') + z.toFixed(1) + 'σ</span></div>' +
        '<span class="riskbar"><span class="riskbar-fill ' + cls + '" style="width:' + pct + '%"></span></span></div>';
    });
    body += '</div><div class="group-footer">σ = deviations from the peer median (median/MAD). Higher = more unusual.</div></div>';
    if (c.examples.length) {
      body += '<div class="group"><div class="group-header">Suspicious sightings</div><div class="list">';
      c.examples.forEach(function (ex) { body += '<div class="cell"><span class="cell-body"><span class="cell-title" style="font-size:15px">' + esc(ex.name) + '</span><span class="cell-sub">' + esc(ex.why) + '</span></span></div>'; });
      body += '</div></div>';
    }
    screen({ title: c.account, backAction: true, backText: 'Reliability', body: body });
  }

  /* ================================================================ BADGES */
  function viewBadges() {
    var earned = {}; earnedBadgeIds().forEach(function (id) { earned[id] = 1; });
    var visible = BADGES.filter(function (b) { return !b.secret || earned[b.id]; });
    var denom = BADGES.filter(function (b) { return !b.secret; }).length + (earned.emblems ? 1 : 0);
    var earnedCount = Object.keys(earned).length;
    var body = '<div class="stat-grid" style="margin-top:4px">' +
      stat(earnedCount, 'Earned') + stat(denom, 'Total') + stat(Math.round(earnedCount / denom * 100) + '%', 'Complete') + '</div>';
    body += '<div class="badge-grid">';
    visible.forEach(function (b) {
      var on = earned[b.id];
      body += '<div class="badge-card' + (on ? '' : ' locked') + '" role="group" aria-label="' + esc(b.name) + ', ' + (on ? 'earned' : 'locked') + '">' +
        '<div class="badge-ico">' + b.emoji + '</div>' +
        '<div class="badge-name">' + esc(b.name) + '</div>' +
        '<div class="badge-desc">' + esc(b.desc) + '</div>' +
        (on ? '<div class="badge-chk" aria-label="Earned">✓</div>' : '') + '</div>';
    });
    body += '</div>';
    if (!earned.emblems) body += '<div class="group-footer hpad" style="text-align:center">One badge is hidden until you earn it.</div>';
    screen({ title: 'Badges', backAction: true, backText: 'Back', body: body });
  }

  /* ================================================================= STATS */
  function viewStats() {
    // Stats read the one merged journal: wildlife encounters plus the
    // read-only ON Fishing catches sharing this device.
    var all = journalEntries();
    var spSet = {}, catSet = {}, perCat = {};
    all.forEach(function (e) {
      if (e.speciesId) { spSet[e.speciesId] = 1; (perCat[e.cat] = perCat[e.cat] || {})[e.speciesId] = 1; }
      if (e.cat) catSet[e.cat] = 1;
    });
    var speciesN = Object.keys(spSet).length, catsN = Object.keys(catSet).length;
    if (!all.length) {
      screen({ title: 'Stats', large: true, subtitle: 'Your field record',
        body: '<div class="empty"><div class="e">\u{1F4CA}</div><h3>No stats yet</h3><p>Log a few encounters and your totals, badges and community comparison will appear here.</p><div class="spacer"></div><div class="hpad"><a class="btn btn-tinted" href="#/log">Start logging</a></div></div>' });
      return;
    }
    var earned = earnedBadgeIds().length;
    var body = '<div class="stat-grid" style="margin-top:4px">' +
      stat(all.length, 'Encounters') + stat(speciesN, 'Species') + stat(catsN, 'Categories') + '</div>';
    // Honest personal progress: how much of the Ontario guide you've recorded
    body += '<div class="group"><div class="group-header">Guide completion</div><div class="list" style="padding:8px 0">';
    body += progressRow('\u{1F30E} All species', speciesN, SPECIES.length);
    CATEGORIES.forEach(function (cm) {
      var got = perCat[cm.id] ? Object.keys(perCat[cm.id]).length : 0;
      if (got) body += progressRow(cm.emoji + ' ' + cm.name, got, speciesInCat(cm.id).length, cm.color);
    });
    body += '</div><div class="group-footer">You’ve recorded ' + speciesN + ' of Ontario’s ' + SPECIES.length + ' guide species, ON Fishing catches included. A live community comparison arrives with the shared layer.</div></div>';
    body += '<div class="group"><div class="list">' +
      '<a class="cell tap" href="#/badges"><span class="cell-emoji">\u{1F3C5}</span><span class="cell-body"><span class="cell-title">Badges</span><span class="cell-sub">' + earned + ' earned</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div></div>';
    screen({ title: 'Stats', large: true, subtitle: 'Your field record', body: body });
  }
  function progressRow(label, got, total, color) {
    var p = total ? Math.round(got / total * 100) : 0;
    return '<div class="zrow"><div class="zrow-top"><span>' + esc(label) + '</span><span class="muted">' + got + ' / ' + total + '</span></div>' +
      '<span class="riskbar"><span class="riskbar-fill" style="width:' + Math.max(2, p) + '%;background:' + (color || 'var(--tint)') + '"></span></span></div>';
  }

  /* ============================================================= INVASIVES */
  function viewInvasives() {
    var inv = SPECIES.filter(isInvasive);
    var body = '<div class="hero" style="padding-bottom:2px"><div class="hero-emoji" style="background:rgba(230,81,0,.14)">\u{1F6AB}</div><h1>Invasive Species</h1><div class="sci" style="font-style:normal">Ontario’s unwanted species, and how you help</div></div>';
    body += '<p class="article-intro">Invasive species are plants, animals and insects from elsewhere that spread aggressively and harm Ontario’s native wildlife, waters and forests. Learning to spot and report them makes a real difference.</p>';
    body += '<div class="callout callout-warn" style="margin:10px 20px"><div class="callout-t">How you help</div><div>Clean · Drain · Dry your boat and gear, never move firewood or live bait, plant native species, and report what you find.</div></div>';
    var order = CATEGORIES.map(function (cm) { return cm.id; });
    var groups = {}; inv.forEach(function (s) { (groups[s.cat] = groups[s.cat] || []).push(s); });
    order.forEach(function (cid) {
      if (!groups[cid]) return; var cm = catMeta(cid);
      body += '<div class="group"><div class="group-header">' + esc(cm.name) + '</div><div class="list">';
      groups[cid].sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (s) {
        body += '<a class="cell tap" href="#/species/' + esc(s.id) + '"><span class="cell-emoji">' + s.emoji + '</span>' +
          '<span class="cell-body"><span class="cell-title">' + esc(s.name) + '</span><span class="cell-sub">' + esc(s.caution || s.habitat) + '</span></span>' +
          '<span class="badge badge-risk" style="flex-shrink:0">invasive</span></a>';
      });
      body += '</div></div>';
    });
    body += '<div class="group"><div class="group-header">Report & learn</div><div class="list">' +
      '<div class="cell"><span class="cell-emoji">\u{1F4DE}</span><span class="cell-body"><span class="cell-title">Invading Species Hotline</span><span class="cell-sub">1-800-563-7711</span></span></div>' +
      linkCell('EDDMapS Ontario, report online', 'https://www.eddmaps.org/ontario/', '') +
      linkCell('Ontario: Invasive species', 'https://www.ontario.ca/page/invasive-species-ontario', '') +
      '</div></div>';
    screen({ title: 'Invasive Species', backAction: true, backText: 'Back', body: body });
  }

  /* =============================================================== PRIVACY */
  function viewPrivacy() {
    var body = '<div class="hero" style="padding-bottom:2px"><div class="hero-emoji" style="background:var(--tint-soft)">\u{1F512}</div><h1>Your Privacy</h1><div class="sci" style="font-style:normal">Private by default</div></div>';
    body += '<p class="article-intro">Your log, including sightings, photos, locations and notes, is stored <b>only on this device</b>. There are no accounts, ads or trackers, and <b>nothing you log is uploaded</b> unless you turn on Community sharing. Two other features reach the internet: connecting to a Community server (off until you set one up), and loading reference photos (on by default, and you can turn it off below). The <b>Map</b> loads its background tiles from <b>CARTO</b>, drawn from OpenStreetMap data, so opening the Map tab sends the area you are viewing, and your device IP, to that tile service. It never sends your saved sightings.</p>';
    body += '<div class="group"><div class="group-header">On this device</div><div class="list">' +
      infoRow2('\u{1F4F1}', 'Stored locally', 'Your journal lives in this app’s private storage on your phone.') +
      infoRow2('\u{1F6AB}', 'No accounts or trackers', 'No sign-in, no ads, no analytics.') +
      infoRow2('\u{1F4E4}', 'Export and delete', 'Export your whole log to a file, or delete everything, anytime.') +
      '</div></div>';
    body += '<div class="group"><div class="group-header">Reference photos</div><div class="list">' +
      '<div class="field"><span class="field-label" style="flex:1">Load species photos</span>' +
      '<label class="switch"><input type="checkbox" id="photos-toggle" aria-label="Load species reference photos from iNaturalist"' + (app.settings.photos ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>' +
      '</div><div class="group-footer">On by default. When on, species pages fetch one openly-licensed (Creative Commons) photo from <b>iNaturalist</b>, which means your device contacts iNaturalist. Off keeps everything to the built-in illustrations.</div></div>';
    body += '<div class="group"><div class="group-header">Community sharing</div><div class="list">' +
      '<a class="cell tap" href="#/community"><span class="cell-emoji">\u{1F30D}</span><span class="cell-body"><span class="cell-title">' + (Community.on() ? 'Sharing is ON' : app.settings.communityUrl ? 'Connected · sharing off' : 'Not connected') + '</span><span class="cell-sub" style="white-space:normal">Set up or change sharing</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div><div class="group-footer">Sharing is off unless you connect a server you choose and switch it on. What gets sent is <b>pseudonymous</b>, a random device id and not your name, with coordinates <b>coarsened to about a 5&nbsp;km grid</b> (about 22&nbsp;km for Species at Risk) and times blurred to the hour, before anything leaves your phone. You can delete everything you have shared below.</div></div>';
    body += '<div class="group"><div class="list">' +
      '<button class="cell tap" data-action="export-data"><span class="cell-emoji">\u{1F4E4}</span><span class="cell-body"><span class="cell-title">Export my data</span></span><span class="chevron">' + I.chevron + '</span></button>' +
      (app.settings.communityUrl ? '<button class="cell tap" data-action="delete-shared"><span class="cell-emoji">\u{1F310}</span><span class="cell-body"><span class="cell-title" style="color:var(--red)">Delete my shared data</span><span class="cell-sub">Remove everything from the community server</span></span></button>' : '') +
      '<button class="cell tap" data-action="clear-data"><span class="cell-emoji">\u{1F5D1}️</span><span class="cell-body"><span class="cell-title" style="color:var(--red)">Delete all my data on this device</span></span></button>' +
      '</div></div>';
    screen({ title: 'Privacy', backAction: true, backText: 'More', body: body });
  }
  function infoRow2(emoji, title, sub) {
    return '<div class="cell"><span class="cell-emoji">' + emoji + '</span>' +
      '<span class="cell-body"><span class="cell-title" style="font-size:15px">' + esc(title) + '</span>' +
      '<span class="cell-sub" style="white-space:normal">' + esc(sub) + '</span></span></div>';
  }

  /* ============================================================= COMMUNITY */
  function viewCommunity() {
    var url = app.settings.communityUrl;
    var body = '<div class="hero" style="padding-bottom:2px"><div class="hero-emoji" style="background:var(--tint-soft)">\u{1F30D}</div><h1>Community</h1><div class="sci" style="font-style:normal">Pooled Ontario sightings</div></div>';
    if (!url) {
      body += '<p class="article-intro">Connect a community server to see what others are spotting near you this week, recent bear and hazard activity, and province-wide totals. Nothing is shared until you turn sharing on. Species-at-Risk locations are always coarsened before they leave your phone.</p>';
      body += '<div class="group"><div class="group-header">Connect a server</div><div class="list">' +
        '<div class="field"><input type="url" id="community-url" placeholder="https://your-server.example" style="text-align:left;flex:1" autocapitalize="none" autocorrect="off" spellcheck="false"></div>' +
        '</div><div class="group-footer">No server yet? Anyone can deploy the free, open-source one in a couple of minutes. See <b>server/README</b> in the project. Leave this blank to stay fully offline.</div></div>';
      body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="community-connect">Connect</button></div>';
      screen({ title: 'Community', backAction: true, backText: 'Back', body: body });
      return;
    }
    body += '<div class="group"><div class="group-header">Connection</div><div class="list">' +
      '<div class="cell"><span class="cell-emoji">\u{1F517}</span><span class="cell-body"><span class="cell-title">Server</span><span class="cell-sub" style="white-space:normal">' + esc(url) + '</span></span></div>' +
      '<div class="field"><span class="field-label" style="flex:1">Share my sightings</span><label class="switch"><input type="checkbox" id="community-share" aria-label="Share my sightings with the community"' + (app.settings.community ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>' +
      '<button class="cell tap" data-action="enable-push"><span class="cell-emoji">\u{1F514}</span><span class="cell-body"><span class="cell-title">Enable nearby alerts</span><span class="cell-sub" style="white-space:normal">Push me when bears or hazards are reported near me (needs the server set up for push)</span></span><span class="chevron">' + I.chevron + '</span></button>' +
      '<button class="cell tap" data-action="reset-cid"><span class="cell-emoji">\u{1F504}</span><span class="cell-body"><span class="cell-title">Reset my device id</span><span class="cell-sub" style="white-space:normal">Breaks the link between your past and future shared reports</span></span></button>' +
      '<button class="cell tap" data-action="community-disconnect"><span class="cell-emoji">\u{1F50C}</span><span class="cell-body"><span class="cell-title" style="color:var(--red)">Disconnect</span></span></button>' +
      '</div><div class="group-footer">' + (app.settings.community ? 'Your sightings are shared <b>pseudonymously</b>, with a random device id and no name. A server operator could group your reports by that id, so you can reset it anytime above. At-risk locations are coarsened before they leave your phone.' : 'Sharing is off. You can still see the community feed below.') + '</div></div>';
    body += '<div id="community-feed"><div class="empty"><div class="e">\u{1F4E1}</div><p>Loading community activity…</p></div></div>';
    screen({ title: 'Community', backAction: true, backText: 'Back', body: body });
    loadCommunityFeed();
  }
  /* Anything the community feed shows comes from someone else's phone, so it
     needs the controls the App Store asks any app with other people's content
     to have: hide it, report it, and reach a person. The feed itself carries
     no free text, only species ids, hazard types and blurred times, so hiding
     is per item and per phone, which is also what a block amounts to when
     there are no accounts to block. */
  function reportKey(v) { return String(v.e || '') + '|' + String(v.when || ''); }
  function hiddenReports() {
    var h = app.settings.hiddenReports;
    return (h && typeof h === 'object' && !Array.isArray(h)) ? h : {};
  }
  function hiddenReportCount() { return Object.keys(hiddenReports()).length; }
  function isReportHidden(k) { return !!hiddenReports()[k]; }
  function hideReport(k) {
    var h = hiddenReports(); h[k] = Date.now();
    app.settings.hiddenReports = h; saveSettings();
  }
  function unhideReports() { app.settings.hiddenReports = {}; saveSettings(); }
  function openReportMenu(k) {
    if (!k) return;
    var mail = 'mailto:katsuma123@gmail.com?subject=' + encodeURIComponent('on-wildlife: report content') +
      '&body=' + encodeURIComponent('Reported item: ' + k + '\n\nWhat is wrong with it:\n');
    var rows = '<button class="cell tap" data-action="hide-report" data-key="' + esc(k) + '">' +
      '<span class="cell-body"><span class="cell-title">Hide this report</span>' +
      '<span class="cell-sub">It stops showing on this phone</span></span></button>' +
      '<a class="cell tap" href="' + esc(mail) + '" data-action="hide-report" data-key="' + esc(k) + '">' +
      '<span class="cell-body"><span class="cell-title">Hide it and tell me about it</span>' +
      '<span class="cell-sub">Opens an email so I can act on it</span></span></a>';
    $('#sheet-root').innerHTML = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">This report</span>' +
      '<button class="nav-btn" data-action="close-sheet">' + Lx('Cancel') + '</button></div>' +
      '<div class="sheet-body"><div class="group" style="margin-top:4px"><div class="list">' + rows + '</div></div></div></div>';
    requestAnimationFrame(function () { var sh = $('#sheet'); if (sh) sh.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
    afterSheetOpen();
  }
  function loadCommunityFeed() {
    var go = function (lat, lng) {
      Community.feed(lat, lng).then(function (d) {
        var box = $('#community-feed'); if (!box) return;
        if (!d || !d.ok) { box.innerHTML = '<div class="empty"><div class="e">\u{1F4F5}</div><h3>Couldn’t reach the server</h3><p>Check the address, or that the server is running.</p></div>'; return; }
        var h = '<div class="stat-grid" style="margin-top:4px">' + stat(d.stats.sightings, 'This week') + stat(d.stats.contributors, 'People') + stat(d.stats.species, 'Species') + '</div>';
        if (d.topSpecies && d.topSpecies.length) {
          h += '<div class="group"><div class="group-header">Seen near you this week</div><div class="list">';
          d.topSpecies.forEach(function (t) { var s = byId[t.id]; h += '<a class="cell tap" href="#/species/' + esc(t.id) + '"><span class="cell-emoji">' + ((s && s.emoji) || '\u{1F43E}') + '</span><span class="cell-body"><span class="cell-title">' + esc(s ? s.name : t.id) + '</span></span><span class="cell-value">×' + t.count + '</span></a>'; });
          h += '</div></div>';
        }
        var events = (d.bears || []).map(function (b) { return { e: '\u{1F43B} Bear', when: b.when }; }).concat((d.hazards || []).map(function (z) { return { e: '⚠️ ' + (hazardType(z.type).name), when: z.when }; }));
        events = events.filter(function (v) { return !isReportHidden(reportKey(v)); });
        if (events.length) {
          h += '<div class="group"><div class="group-header">Recent bear & hazard activity nearby</div><div class="list">';
          events.slice(0, 10).forEach(function (v) {
            h += '<div class="cell"><span class="cell-body"><span class="cell-title" style="font-size:15px">' + esc(v.e) + '</span><span class="cell-sub">' + esc(v.when ? fmtDay(v.when) : '') + '</span></span>' +
              '<button class="cell-more" data-action="report-item" data-key="' + esc(reportKey(v)) + '" aria-label="Report or hide this report">' + spriteIcon('ellipsis') + '</button></div>';
          });
          h += '</div><div class="group-footer">Locations are approximate (coarsened for privacy). These are community reports, not official alerts. Anything wrong or offensive can be hidden and reported from the button on the row.</div></div>';
        }
        if (!(d.topSpecies && d.topSpecies.length) && !events.length) h += '<div class="empty"><div class="e">\u{1F331}</div><h3>Quiet so far</h3><p>No community sightings near you this week.</p></div>';
        // Guideline 1.2 wants a way to reach a person about content, in the app.
        h += '<div class="group"><div class="list">' +
          '<a class="cell tap" href="mailto:katsuma123@gmail.com?subject=' + encodeURIComponent('on-wildlife: report content') + '"><span class="cell-body"><span class="cell-title">Report a problem with this feed</span><span class="cell-sub">Email me and I will act on it</span></span><span class="chevron">' + I.chevron + '</span></a>' +
          (hiddenReportCount() ? '<button class="cell tap" data-action="unhide-reports"><span class="cell-body"><span class="cell-title">Show hidden reports</span><span class="cell-sub">' + hiddenReportCount() + ' hidden on this phone</span></span></button>' : '') +
          '<a class="cell tap" href="https://katsuma.ca/terms.html" target="_blank" rel="noopener"><span class="cell-body"><span class="cell-title">Terms of use</span><span class="cell-sub">What may not be posted</span></span><span class="chevron">' + I.chevron + '</span></a>' +
          '</div></div>';
        box.innerHTML = h;
      });
    };
    // Only read location for the "near you" feed when the user has sharing on;
    // otherwise show province-wide activity without transmitting any position.
    if (app.settings.community && navigator.geolocation) navigator.geolocation.getCurrentPosition(function (p) { go(p.coords.latitude, p.coords.longitude); }, function () { go(null, null); }, { timeout: 6000, maximumAge: 300000 });
    else go(null, null);
  }

  /* ====================================================== FIRST-RUN PRIVACY */
  function maybePrivacyBanner() {
    if (app.settings.seenPrivacy) {
      // belt and braces: if the head script could not read settings, the
      // static copy of this sheet is still in the DOM; clear it
      var st = document.querySelector('.privacy-static');
      if (st) st.remove();
      return;
    }
    var html = '<div class="scrim show" data-action="accept-privacy"></div>' +
      '<div class="sheet show" id="sheet" style="max-height:none">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-body" style="padding:8px 20px calc(24px + var(--sa-bottom))">' +
      '<div style="text-align:center;font-size:44px;margin:8px 0">\u{1F43E}</div>' +
      '<h2 style="text-align:center;margin:0 0 6px;font-size:22px">Welcome to Wildlife Log</h2>' +
      '<p style="text-align:center;color:var(--label-2);font-size:15px;line-height:1.45;margin:0 0 16px">Log the wildlife, fish and plants you find across Ontario. <b>Your sightings stay on this phone.</b> The app uploads an entry only when you turn sharing on and post it yourself.</p>' +
      '<button class="btn btn-primary btn-block" data-action="accept-privacy">Get started</button>' +
      '<div class="spacer"></div>' +
      '<button class="btn btn-plain btn-block" data-action="open-privacy-first" style="height:40px">Read our privacy note</button>' +
      '</div></div>';
    $('#sheet-root').innerHTML = html;
    afterSheetOpen();
  }

  /* ==================================================== LOG ENCOUNTER SHEET */
  function openLog(prefill) {
    prefill = prefill || {};
    var sp = prefill.species ? byId[prefill.species] : null;
    app.draft = {
      speciesId: sp ? sp.id : null,
      speciesName: sp ? sp.name : '',
      customName: '',
      cat: sp ? sp.cat : (prefill.cat || ''),
      sub: sp ? sp.sub : (prefill.sub || ''),
      emoji: sp ? sp.emoji : '',
      evidence: (prefill.cat === 'fish' || (sp && sp.cat === 'fish')) ? 'caught' : 'saw',
      count: 1,
      when: localDatetimeValue(new Date()),
      lat: null, lng: null,
      photo: null,
      released: true,
      heardOnly: false
    };
    renderSheet();
  }

  function renderSheet() {
    var d = app.draft;
    var isFish = d.cat === 'fish';
    var isBird = d.cat === 'birds';
    var sp = d.speciesId ? byId[d.speciesId] : null;

    // Species selector
    var speciesRow;
    if (sp) {
      speciesRow = '<button class="cell tap" data-action="pick-species">' +
        '<span class="cell-emoji">' + sp.emoji + '</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title">' + esc(sp.name) + '</span>' +
        '<span class="cell-sub"><i>' + esc(sp.sci) + '</i></span></span>' +
        '<span class="cell-value" style="color:var(--tint)">' + Lx('Change') + '</span></button>';
    } else if (d.customName) {
      speciesRow = '<button class="cell tap" data-action="pick-species">' +
        '<span class="cell-emoji">❓</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title">' + esc(d.customName) + '</span>' +
        '<span class="cell-sub">' + Lx('Not in the guide') + '</span></span>' +
        '<span class="cell-value" style="color:var(--tint)">' + Lx('Change') + '</span></button>';
    } else {
      speciesRow = '<button class="cell tap" data-action="pick-species">' +
        '<span class="cell-emoji">\u{1F50D}</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title" style="color:var(--tint)">' + Lx('Choose a species') + '</span>' +
        '<span class="cell-sub">' + Lx('Search the guide or add your own') + '</span></span>' +
        '<span class="chevron">' + I.chevron + '</span></button>';
    }

    // Evidence options
    var evOpts = isFish
      ? [['caught', Lx('Caught')], ['saw', Lx('Seen')]]
      : [['saw', Lx('Saw')], ['heard', Lx('Heard')], ['tracks', Lx('Signs')]];
    var evHtml = '<div class="segmented">';
    evOpts.forEach(function (o) {
      evHtml += '<button type="button" class="seg-opt' + (d.evidence === o[0] ? ' on' : '') + '" aria-pressed="' + (d.evidence === o[0] ? 'true' : 'false') + '" data-action="set-evidence" data-val="' + o[0] + '">' + o[1] + '</button>';
    });
    evHtml += '</div>';

    var body = '';
    // What
    body += '<div class="group" style="margin-top:6px"><div class="group-header">' + Lx('What did you see?') + '</div><div class="list">' +
      speciesRow + '</div></div>';

    // How you saw it. Kept apart from where and when so no single group asks the
    // eye to hold more than a couple of things at once.
    body += '<div class="group"><div class="group-header">' + Lx('How did you see it?') + '</div><div class="list">';
    body += '<div class="field"><span class="field-label">' + Lx('Observation') + '</span><div style="flex:1"></div>' +
      '<div style="width:' + (isFish ? '150' : '210') + 'px">' + evHtml + '</div></div>';
    body += '<div class="field"><span class="field-label">' + Lx('How many') + '</span><div style="flex:1"></div>' +
      '<div class="stepper"><button data-action="count" data-d="-1">−</button><div class="sep"></div>' +
      '<div class="val" id="count-val">' + d.count + '</div>' +
      '<div class="sep"></div><button data-action="count" data-d="1">+</button></div></div>';
    body += '</div></div>';

    // Where and when
    body += '<div class="group"><div class="group-header">' + Lx('Where and when') + '</div><div class="list">';
    body += '<div class="field"><span class="field-label">When</span>' +
      '<input type="datetime-local" id="f-when" aria-label="Date and time seen" value="' + esc(d.when) + '"></div>';
    body += '<button class="cell tap" data-action="use-location">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.pin + '</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title" id="loc-title">' +
      (d.lat != null ? 'Location captured' : 'Add current location') + '</span>' +
      '<span class="cell-sub" id="loc-sub" aria-live="polite">' +
      (d.lat != null ? (d.lat.toFixed(4) + ', ' + d.lng.toFixed(4)) : 'Optional · uses your GPS') + '</span></span></button>';
    body += '</div>';
    if (sp && isSensitive(sp.id)) body += '<div class="group-footer">\u{1F4CD} This is a Species at Risk. Its exact location stays private on your phone and is obscured if data is ever shared.</div>';
    body += '</div>';

    // Fish-specific
    if (isFish) {
      var u = app.settings.units;
      body += '<div class="group"><div class="group-header">Catch Details</div><div class="list">';
      if (d.evidence === 'caught') {
        body += '<div class="field"><span class="field-label">Kept or released?</span><div style="flex:1"></div>' +
          '<div style="width:170px"><div class="segmented">' +
          '<button type="button" class="seg-opt' + (d.released ? ' on' : '') + '" aria-pressed="' + (d.released ? 'true' : 'false') + '" data-action="set-kept" data-v="released">Released</button>' +
          '<button type="button" class="seg-opt' + (!d.released ? ' on' : '') + '" aria-pressed="' + (!d.released ? 'true' : 'false') + '" data-action="set-kept" data-v="kept">Kept</button>' +
          '</div></div></div>';
      }
      body += '<div class="field"><span class="field-label">Length</span>' +
        '<input type="number" inputmode="decimal" id="f-length" aria-label="Length in ' + (u === 'metric' ? 'centimetres' : 'inches') + '" placeholder="0" step="0.1">' +
        '<span class="muted" style="margin-left:6px">' + (u === 'metric' ? 'cm' : 'in') + '</span></div>';
      body += '<div class="field"><span class="field-label">Weight</span>' +
        '<input type="number" inputmode="decimal" id="f-weight" aria-label="Weight in ' + (u === 'metric' ? 'kilograms' : 'pounds') + '" placeholder="0" step="0.01">' +
        '<span class="muted" style="margin-left:6px">' + (u === 'metric' ? 'kg' : 'lb') + '</span></div>';
      body += '<div class="field"><span class="field-label">Bait / lure</span>' +
        '<input type="text" id="f-bait" aria-label="Bait or lure" placeholder="e.g. jig & minnow"></div>';
      body += '<div class="field"><span class="field-label">Water body</span>' +
        '<input type="text" id="f-water" aria-label="Water body" placeholder="Lake or river"></div>';
      body += '</div></div>';
    } else if (isBird) {
      body += '<div class="group"><div class="group-header">Bird Details</div><div class="list">' +
        '<div class="field"><span class="field-label">Behaviour</span>' +
        '<input type="text" id="f-behavior" aria-label="Bird behaviour" placeholder="feeding, flying, singing…"></div>' +
        '</div></div>';
    }

    // Photo + notes
    body += '<div class="group"><div class="group-header">Photo & Notes</div><div class="list">';
    body += '<div id="photo-slot">' + photoSlot() + '</div>';
    body += '<textarea class="notes" id="f-notes" aria-label="Notes" placeholder="' + Lx('Notes. Where exactly, what it was doing, the weather…') + '"></textarea>';
    body += '</div></div>';

    // Save
    var canSave = !!(d.speciesId || d.customName);
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-entry"' +
      (canSave ? '' : ' disabled') + '>' + Lx('Save Encounter') + '</button></div>';

    var sheetHtml = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">' + Lx('Cancel') + '</button>' +
      '<span class="t">' + (d._editId ? Lx('Edit Encounter') : Lx('Log Encounter')) + '</span>' +
      '<button class="nav-btn bold" data-action="save-entry"' + (canSave ? '' : ' disabled') + '>' + Lx('Save') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';

    $('#sheet-root').innerHTML = sheetHtml;
    requestAnimationFrame(function () {
      $('#sheet').classList.add('show');
      $('.scrim').classList.add('show');
    });
    afterSheetOpen();
    // Restore free-text values into the freshly rendered inputs
    setVal('f-notes', d._notes); setVal('f-behavior', d._behavior);
    setVal('f-length', d._length); setVal('f-weight', d._weight);
    setVal('f-bait', d._bait); setVal('f-water', d._water);
  }
  function setVal(id, v) { var el = document.getElementById(id); if (el && v != null) el.value = v; }
  function photoSlot() {
    var d = app.draft;
    if (d.photo) {
      return '<div style="padding:12px 16px"><img class="entry-photo" src="' + d.photo + '" alt="Photo you attached to this sighting">' +
        '<button class="btn btn-danger btn-block" style="height:40px;margin-top:10px" data-action="remove-photo">' + Lx('Remove photo') + '</button></div>';
    }
    return '<button class="cell tap" data-action="take-photo">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.camera + '</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title" style="color:var(--tint)">' + Lx('Add a photo') + '</span>' +
      '<span class="cell-sub">' + Lx('Take one or choose from your library') + '</span></span></button>' +
      '<input type="file" id="photo-input" accept="image/*" capture="environment" style="display:none">';
  }
  // Read current free-text inputs into the draft so a re-render doesn't lose them
  function syncDraftInputs() {
    var d = app.draft; if (!d) return;
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : undefined; };
    if (g('f-when') != null) d.when = g('f-when');
    d._notes = g('f-notes'); d._behavior = g('f-behavior');
    d._length = g('f-length'); d._weight = g('f-weight');
    d._bait = g('f-bait'); d._water = g('f-water');
  }
  function closeSheet() {
    var s = $('#sheet'), sc = $('.scrim');
    if (s) s.classList.remove('show');
    if (sc) sc.classList.remove('show');
    clearSheetA11y();
    unlockScroll();
    setTimeout(function () {
      // a sheet opened during the close animation must not be wiped
      var s2 = $('#sheet');
      if (!s2 || !s2.classList.contains('show')) $('#sheet-root').innerHTML = '';
    }, 320);
  }

  /* ---- Species picker (nested sheet) ---- */
  function openPicker() {
    var d = app.draft;
    var startCat = d.cat || 'all';
    var html = '<div class="scrim show" data-action="close-picker"></div>' +
      '<div class="sheet show" id="picker" role="dialog" aria-modal="true" aria-label="' + Lx('Choose Species') + '" style="height:88dvh">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-picker">Back</button>' +
      '<span class="t">' + Lx('Choose Species') + '</span><span style="width:44px"></span></div>' +
      '<div class="searchbar" style="margin-top:2px">' + I.search +
      '<input type="search" id="picker-search" aria-label="Search all species" placeholder="Search all species" autocomplete="off" autocapitalize="none">' +
      '</div>' +
      '<div class="chip-row" id="picker-chips">' + pickerChips(startCat) + '</div>' +
      '<div class="sheet-body" id="picker-list">' + pickerList(startCat, '') + '</div>' +
      '</div>';
    var root = document.createElement('div');
    root.id = 'picker-root';
    root.innerHTML = html;
    document.body.appendChild(root);
    app._pickerCat = startCat;
    // a11y: trap focus in the picker and make the underlying log sheet inert
    app._pickerOpener = document.activeElement;
    var sheetEl = $('#sheet');
    try { if (sheetEl) { sheetEl.setAttribute('inert', ''); sheetEl.setAttribute('aria-hidden', 'true'); } } catch (e) {}
    var inp = $('#picker-search');
    inp.addEventListener('input', function () { refreshPicker(); });
    setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) { try { inp.focus(); } catch (e2) {} } }, 60);
  }
  function pickerChips(active) {
    var html = '<button class="chip' + (active === 'all' ? ' on' : '') + '" aria-pressed="' + (active === 'all' ? 'true' : 'false') + '" data-action="picker-cat" data-cat="all">All</button>';
    CATEGORIES.forEach(function (c) {
      html += '<button class="chip' + (active === c.id ? ' on' : '') + '" aria-pressed="' + (active === c.id ? 'true' : 'false') + '" data-action="picker-cat" data-cat="' + c.id + '">' + c.emoji + ' ' + esc(c.name) + '</button>';
    });
    return html;
  }
  function recentSpeciesList(n) {
    var seen = {}, out = [];
    app.entries.slice().sort(function (a, b) { return new Date(b.when) - new Date(a.when); }).forEach(function (e) {
      if (e.speciesId && byId[e.speciesId] && !seen[e.speciesId]) { seen[e.speciesId] = 1; out.push(byId[e.speciesId]); }
    });
    return out.slice(0, n || 6);
  }
  function pickerList(catId, q) {
    var list;
    if (q) list = searchSpecies(q).filter(function (s) { return catId === 'all' || s.cat === catId; });
    else list = sortSpecies(catId === 'all' ? SPECIES.slice() : speciesInCat(catId));
    var html = '';
    // One-tap tiles for species you've logged before, the most common re-log
    if (!q) {
      var rec = recentSpeciesList(6).filter(function (s) { return catId === 'all' || s.cat === catId; });
      if (rec.length) {
        html += '<div class="group" style="margin-top:6px"><div class="group-header">Recently logged</div><div class="chip-row" style="padding:2px 16px 6px">';
        rec.forEach(function (s) { html += '<button class="chip" data-action="select-species" data-id="' + esc(s.id) + '">' + s.emoji + ' ' + esc(s.name) + '</button>'; });
        html += '</div></div>';
      }
    }
    // "Not sure" escape hatch, never let anyone get stuck on a name
    html += '<div class="group"' + (q ? ' style="margin-top:6px"' : '') + '><div class="list">' +
      '<button class="cell tap" data-action="custom-species">' +
      '<span class="cell-emoji">✏️</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title" style="color:var(--tint)">I’m not sure yet, name it later</span>' +
      '<span class="cell-sub">Log it now and identify it whenever</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></button></div></div>';
    if (!list.length) {
      html += '<div class="empty"><div class="e">\u{1F50D}</div><h3>No matches</h3></div>';
      return html;
    }
    html += '<div class="group"><div class="list">';
    list.forEach(function (s) {
      html += '<button class="cell tap" data-action="select-species" data-id="' + esc(s.id) + '">' +
        '<span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title">' + esc(s.name) + '</span>' +
        '<span class="cell-sub"><i>' + esc(s.sci) + '</i></span></span>' +
        (s.atRisk ? '<span class="badge ' + (s.caution ? 'badge-danger' : 'badge-risk') + '">' + esc(s.status) + '</span>' : '') +
        '</button>';
    });
    html += '</div></div>';
    return html;
  }
  function refreshPicker() {
    var q = ($('#picker-search') || {}).value || '';
    $('#picker-list').innerHTML = pickerList(app._pickerCat, q);
  }
  function closePicker() {
    var sheetEl = $('#sheet');
    try { if (sheetEl) { sheetEl.removeAttribute('inert'); sheetEl.removeAttribute('aria-hidden'); } } catch (e) {}
    var r = $('#picker-root'); if (r) r.remove();
    // If the opener still exists (Back with no re-render), restore focus to it;
    // otherwise renderSheet()→afterSheetOpen() will re-establish focus.
    if (app._pickerOpener && app._pickerOpener.focus && document.contains(app._pickerOpener)) {
      try { app._pickerOpener.focus({ preventScroll: true }); } catch (e) {}
    }
    app._pickerOpener = null;
  }

  function saveEntry() {
    syncDraftInputs();
    var d = app.draft;
    if (!d.speciesId && !d.customName) { toast(Lx('Choose a species first')); return; }
    if (app._saving) return; app._saving = true;   // guard against double-tap duplicate saves
    var sp = d.speciesId ? byId[d.speciesId] : null;
    var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : null; };
    var entry = {
      id: d._editId || uid(),
      speciesId: d.speciesId || null,
      speciesName: sp ? sp.name : d.customName,
      cat: sp ? sp.cat : (d.cat || 'other'),
      sub: sp ? sp.sub : (d.sub || ''),
      emoji: sp ? sp.emoji : '\u{1F43E}',
      evidence: d.evidence,
      count: d.count,
      when: d.when ? new Date(d.when).toISOString() : new Date().toISOString(),
      lat: d.lat, lng: d.lng,
      notes: (d._notes || '').trim(),
      photo: d.photo || null,
      fish: null, bird: null,
      createdAt: d._editCreatedAt || new Date().toISOString()
    };
    if (d.cat === 'fish') {
      entry.fish = {
        caught: d.evidence === 'caught',
        released: d.evidence === 'caught' ? !!d.released : false,
        length: num(d._length), weight: num(d._weight),
        bait: (d._bait || '').trim(), water: (d._water || '').trim(),
        units: app.settings.units
      };
    }
    if (d.cat === 'birds') entry.bird = { behavior: (d._behavior || '').trim() };
    if (entry.lat != null && isSensitive(entry.speciesId)) entry.sensitiveLoc = true;

    // Work out whether this is a lifer before the entry joins the list, or the
    // entry itself would count as the prior record and no save would ever be new.
    var isLifer = false, lifeNumber = 0;
    if (!d._editId && entry.speciesId) {
      // First-ever from either source counts: an ON Fishing catch already on
      // the life list means logging the same species here is not a lifer.
      var seen = {};
      journalEntries().forEach(function (x) { if (x.speciesId) seen[x.speciesId] = 1; });
      isLifer = !seen[entry.speciesId];
      if (isLifer) lifeNumber = Object.keys(seen).length + 1;
    }

    var editing = !!d._editId, prevIdx = -1, prevEntry = null;
    if (editing) {
      for (var ei = 0; ei < app.entries.length; ei++) if (app.entries[ei].id === entry.id) { prevIdx = ei; prevEntry = app.entries[ei]; break; }
      if (prevIdx >= 0) app.entries[prevIdx] = entry; else app.entries.push(entry);
    } else {
      app.entries.push(entry);
    }
    Store.put(entry).then(function () {
      app._saving = false;
      if (!editing) Community.post(communityPayload(entry));
      haptic();
      closeSheet();
      // The peak of the whole flow: the first time you record a species, say so.
      if (isLifer) toast('New species. That is #' + lifeNumber + ' on your life list.');
      else toast((editing ? '✓ Updated ' : '✓ Logged ') + entry.speciesName);
      setTimeout(function () { route(); }, 120);
      if (!editing) setTimeout(checkNewBadges, 1400);
    }).catch(function () {
      app._saving = false;
      if (editing) {
        if (prevIdx >= 0) app.entries[prevIdx] = prevEntry;
        else { var j = app.entries.indexOf(entry); if (j >= 0) app.entries.splice(j, 1); }
      } else { var i = app.entries.indexOf(entry); if (i >= 0) app.entries.splice(i, 1); }
      toast('Couldn’t save. Your device storage may be full. Try removing the photo.');
    });
  }

  /* ---- Entry detail sheet ---- */
  function openEntry(id) {
    var e = findEntry(id);
    if (!e) return;
    var ro = e.external === 'onfish';   // an ON Fishing catch: read-only here
    var sp = e.speciesId ? byId[e.speciesId] : null;
    var rows = '';
    rows += info('When', fmtDay(e.when) + ' at ' + fmtTime(e.when));
    rows += info('Observation', e.evidence === 'caught' ? 'Caught' : e.evidence === 'heard' ? 'Heard' : e.evidence === 'tracks' ? 'Tracks / signs' : 'Seen');
    if (e.count > 1) rows += info('Count', String(e.count));
    if (e.lat != null) rows += info('Location', e.lat.toFixed(5) + ', ' + e.lng.toFixed(5) + (e.sensitiveLoc ? '  \u{1F512}' : ''));
    if (e.fish) {
      var u = e.fish.units === 'imperial' ? { l: 'in', w: 'lb' } : { l: 'cm', w: 'kg' };
      if (e.fish.length != null) rows += info('Length', e.fish.length + ' ' + u.l);
      if (e.fish.weight != null) rows += info('Weight', e.fish.weight + ' ' + u.w);
      if (e.fish.bait) rows += info('Bait / lure', e.fish.bait);
      if (e.fish.water) rows += info('Water body', e.fish.water);
      if (e.fish.caught) rows += info('Kept or released', e.fish.released ? 'Released' : 'Kept');
    }
    if (e.fishZone) rows += info('Fishing zone', 'Zone ' + e.fishZone);
    if (e.bird && e.bird.behavior) rows += info('Behaviour', e.bird.behavior);
    if (e.notes) rows += info('Notes', e.notes);

    var body = '<div class="hero" style="padding-top:16px">' +
      '<div class="hero-emoji" style="width:76px;height:76px;font-size:44px;background:' + tintFor(e.cat) + '22">' + (e.emoji || '\u{1F43E}') + '</div>' +
      '<h1>' + esc(e.speciesName) + '</h1>' +
      (sp ? '<div class="sci">' + esc(sp.sci) + '</div>' : '') + '</div>';
    if (ro) body += '<div class="wrap-note"><span class="i">\u{1F3A3}</span><span>Logged in <b>ON Fishing</b> on this device. It shows here read-only, so edit or delete it over there.</span></div>';
    if (e.photo) body += '<div class="hpad"><img class="entry-photo" src="' + e.photo + '" alt="Photo of your ' + esc(e.speciesName) + ' sighting"></div>';
    body += '<div class="group"><div class="list">' + rows + '</div></div>';
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="share-entry" data-id="' + esc(e.id) + '">' + I.share + 'Share this sighting</button></div><div class="spacer"></div>';
    if (!ro) body += '<div class="hpad"><button class="btn btn-tinted btn-block" data-action="edit-entry" data-id="' + esc(e.id) + '">Edit encounter</button></div><div class="spacer"></div>';
    if (sp) body += '<div class="hpad"><a class="btn btn-tinted btn-block" href="#/species/' + esc(sp.id) + '" data-action="close-sheet-nav">View in field guide</a></div><div class="spacer"></div>';
    if (!ro) body += '<div class="hpad"><button class="btn btn-danger btn-block" data-action="delete-entry" data-id="' + esc(e.id) + '">Delete this encounter</button></div>';

    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">Encounter</span>' +
      '<button class="nav-btn bold" data-action="close-sheet">Done</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { $('#sheet').classList.add('show'); $('.scrim').classList.add('show'); });
    afterSheetOpen();
  }
  // Re-open the log sheet pre-filled with an existing encounter, for editing.
  function editEntry(id) {
    var e = null;
    for (var i = 0; i < app.entries.length; i++) if (app.entries[i].id === id) { e = app.entries[i]; break; }
    if (!e || e.external) return;   // ON Fishing catches are read-only here
    var sp = e.speciesId ? byId[e.speciesId] : null;
    app.draft = {
      speciesId: e.speciesId || null,
      speciesName: e.speciesName || (sp ? sp.name : ''),
      customName: e.speciesId ? '' : (e.speciesName || ''),
      cat: e.cat || (sp ? sp.cat : ''),
      sub: e.sub || (sp ? sp.sub : ''),
      emoji: e.emoji || (sp ? sp.emoji : ''),
      evidence: e.evidence || 'saw',
      count: e.count || 1,
      when: localDatetimeValue(new Date(e.when)),
      lat: e.lat != null ? e.lat : null,
      lng: e.lng != null ? e.lng : null,
      photo: e.photo || null,
      released: e.fish ? !!e.fish.released : true,
      heardOnly: e.evidence === 'heard',
      _notes: e.notes || '',
      _behavior: e.bird ? (e.bird.behavior || '') : '',
      _length: e.fish && e.fish.length != null ? String(e.fish.length) : '',
      _weight: e.fish && e.fish.weight != null ? String(e.fish.weight) : '',
      _bait: e.fish ? (e.fish.bait || '') : '',
      _water: e.fish ? (e.fish.water || '') : '',
      _editId: e.id,
      _editCreatedAt: e.createdAt || new Date().toISOString()
    };
    renderSheet();
  }
  /* ------------------------------------------------ Share (unified card) */
  // A compact, self-contained item that travels inside the share link, so a
  // recipient sees the exact same encounter with no server and nothing tracked.
  function entryShareItem(e) {
    var sp = e.speciesId ? byId[e.speciesId] : null;
    var it = { t: 'wl', n: e.speciesName, e: e.emoji || '\u{1F43E}', cat: e.cat, ev: e.evidence, w: e.when };
    if (sp && sp.sci) it.sci = sp.sci;
    if (e.count > 1) it.c = e.count;
    if (e.notes) it.note = e.notes.length > 200 ? e.notes.slice(0, 197) + '…' : e.notes;
    if (e.lat != null && !e.sensitiveLoc) { it.lat = +e.lat.toFixed(3); it.lng = +e.lng.toFixed(3); }
    else if (e.lat != null) it.prot = 1;
    if (e.fish) { it.fish = 1; if (e.fish.length != null) { it.len = e.fish.length; it.unit = e.fish.units === 'imperial' ? 'in' : 'cm'; } if (e.fish.caught) it.rel = e.fish.released ? 1 : 0; }
    return it;
  }
  function evidenceLabel(ev) { return ev === 'caught' ? 'Caught' : ev === 'heard' ? 'Heard' : ev === 'tracks' ? 'Tracks' : 'Seen'; }
  // Item -> OnShare card params. Sender and recipient both build the card this
  // way, so the picture is identical on either end.
  function wildlifeCard(it) {
    var cm = catMeta(it.cat);
    var chips = [{ label: evidenceLabel(it.ev) }];
    if (cm) chips.push({ label: cm.name });
    if (it.c) chips.push({ label: '×' + it.c });
    if (it.fish && it.len != null) chips.push({ label: it.len + ' ' + (it.unit || 'cm') });
    if (it.fish && it.rel != null) chips.push({ label: it.rel ? 'Released' : 'Kept' });
    var meta = fmtDay(it.w);
    if (it.lat != null && it.lng != null) meta += ' · ' + it.lat.toFixed(2) + ', ' + it.lng.toFixed(2);
    else if (it.prot) meta += ' · location protected';
    return {
      eyebrow: 'on-wildlife', kicker: 'Field note', emoji: it.e || '\u{1F43E}',
      title: it.n, subtitle: it.sci || (cm ? cm.name : ''),
      chips: chips.slice(0, 4), meta: meta
    };
  }
  function shareEntry(id) {
    var e = findEntry(id);
    if (!e) return;
    if (!window.OnShare) { toast('Sharing is not available'); return; }
    var item = entryShareItem(e);
    OnShare.share({ card: wildlifeCard(item), text: 'I spotted a ' + e.speciesName + ' in Ontario.', item: item })
      .then(function (r) { if (r === 'fallback') toast('Link copied, card saved'); });
  }
  // #/shared/<data> : render an encounter someone sent, straight from the link.
  function viewShared(data) {
    var it = window.OnShare && OnShare.decode(data || '');
    if (!it || it.t !== 'wl') {
      screen({ title: 'Shared', back: '#/explore', backText: 'Explore', large: true,
        body: '<div class="hpad"><p class="empty">This shared link could not be opened. It may be from a newer version of the app.</p></div>' });
      return;
    }
    var card = wildlifeCard(it);
    var body =
      '<div class="hpad shared-recv">' +
        '<div class="shared-card-wrap"><img id="shared-card-img" class="shared-card" alt="Shared ' + esc(card.title) + ' encounter"></div>' +
        (it.note ? '<p class="shared-note">“' + esc(it.note) + '”</p>' : '') +
      '</div>' +
      '<div class="hpad"><a class="btn btn-primary btn-block" href="#/mylog">Start your own log</a></div><div class="spacer"></div>' +
      '<div class="hpad"><a class="btn btn-tinted btn-block" href="#/explore">Explore Ontario wildlife</a></div>';
    screen({ title: 'Shared with you', back: '#/explore', backText: 'Explore', large: true,
      subtitle: 'A wildlife encounter, shared with you', body: body });
    OnShare.makeCard(card).then(function (blob) {
      if (!blob) return; var img = $('#shared-card-img'); if (img) img.src = URL.createObjectURL(blob);
    });
  }
  function deleteEntry(id) {
    var removed = app.entries.filter(function (e) { return e.id === id; })[0];
    app.entries = app.entries.filter(function (e) { return e.id !== id; });
    Store.del(id);
    closeSheet();
    setTimeout(route, 120);
    if (removed) {
      toastUndo('Encounter deleted', function () {
        app.entries.push(removed);
        Store.put(removed).then(function () { route(); });
        toast('Encounter restored');
      });
    } else {
      toast('Encounter deleted');
    }
  }

  /* ------------------------------------------------------- Image resize */
  function handlePhoto(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var max = 1280, w = img.width, h = img.height;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h > max) { w = Math.round(w * max / h); h = max; }
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        try { app.draft.photo = canvas.toDataURL('image/jpeg', 0.72); }
        catch (e) { app.draft.photo = ev.target.result; }
        var slot = $('#photo-slot'); if (slot) slot.innerHTML = photoSlot();
      };
      img.onerror = function () { toast('Could not read that image'); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ------------------------------------------------------- Data export */
  function exportData() {
    if (!app.entries.length && !app.hazards.length) { toast('Nothing to export yet'); return; }
    // Geoprivacy: coarsen at-risk species locations before they leave the device
    var exEntries = app.entries.map(function (e) {
      // Recompute sensitivity at export time so a stale/missing flag can't leak an
      // at-risk or turtle location at full GPS precision into a shared backup file.
      if ((e.sensitiveLoc || isSensitive(e.speciesId)) && typeof e.lat === 'number') {
        var c = {}; for (var k in e) if (e.hasOwnProperty(k)) c[k] = e[k];
        c.lat = coarse(e.lat); c.lng = coarse(e.lng); c.locationObscured = true;
        return c;
      }
      return e;
    });
    var blob = new Blob([JSON.stringify({ app: 'ontario-wildlife-log', version: 1, exported: new Date().toISOString(), entries: exEntries, hazards: app.hazards }, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'wildlife-log-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Exported ' + app.entries.length + ' encounters');
  }

  /* ------------------------------------------------------- Data import */
  // Reads an exported backup, validates the shape, and merges by id into the
  // store: existing records win, only genuinely new ones are added.
  function importBackup(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onerror = function () { toast('Couldn’t read that file'); };
    reader.onload = function (ev) {
      var data = null;
      try { data = JSON.parse(ev.target.result); } catch (e) {}
      if (!data || data.app !== 'ontario-wildlife-log' || !Array.isArray(data.entries)) {
        toast('That file isn’t a wildlife log backup'); return;
      }
      var have = {}; app.entries.forEach(function (e) { have[e.id] = 1; });
      var newEntries = data.entries.filter(function (e) {
        return e && typeof e.id === 'string' && e.id && !have[e.id] &&
          typeof e.speciesName === 'string' && e.when && !isNaN(new Date(e.when).getTime());
      });
      var haveH = {}; app.hazards.forEach(function (h) { haveH[h.id] = 1; });
      var newHazards = (Array.isArray(data.hazards) ? data.hazards : []).filter(function (h) {
        return h && typeof h.id === 'string' && h.id && !haveH[h.id] && h.when;
      });
      if (!newEntries.length && !newHazards.length) { toast('Nothing new in that backup'); return; }
      var writes = newEntries.map(function (e) { app.entries.push(e); return Store.put(e); })
        .concat(newHazards.map(function (h) { app.hazards.push(h); return Store.put(h, 'hazards'); }));
      Promise.all(writes).then(function () {
        haptic();
        var msg = 'Imported ' + newEntries.length + (newEntries.length === 1 ? ' encounter' : ' encounters');
        if (newHazards.length) msg += ' and ' + newHazards.length + (newHazards.length === 1 ? ' hazard' : ' hazards');
        toast(msg);
        route();
      }).catch(function () { toast('Couldn’t save the import. Storage may be full.'); route(); });
    };
    reader.readAsText(file);
  }

  /* ------------------------------------------------------- Full reset */
  // Store.clear is fire-and-forget; the reset reloads the page, so it needs a
  // promise that resolves only when the wipe has really committed.
  function clearStoreDone(store) {
    return new Promise(function (resolve) {
      if (!Store.useIDB) { Store._ls(store); return resolve(); }
      try {
        var tx = Store.db.transaction(store, 'readwrite');
        tx.objectStore(store).clear();
        tx.oncomplete = tx.onerror = tx.onabort = function () { resolve(); };
      } catch (e) { resolve(); }
      Store._ls(store);
    });
  }
  function resetAllData() {
    app.entries = []; app.hazards = [];
    var seen = !!app.settings.seenPrivacy;
    try {
      localStorage.removeItem('owl-settings');
      localStorage.removeItem('owl-entries');
      localStorage.removeItem('owl-hazards');
      localStorage.removeItem('owl-photos');
      // The shared 'outdoors-profile' key belongs to all three apps, so a
      // wildlife reset leaves it alone.
      localStorage.setItem('owl-settings', JSON.stringify({ seenPrivacy: seen }));
    } catch (e) {}
    Promise.all([clearStoreDone('entries'), clearStoreDone('hazards')]).then(function () {
      location.reload();
    });
  }

  /* ---------------------------------------------------------- Tab bar */
  // The floating five-item capsule. Glyphs come from the shared sprite so the
  // sibling apps present the exact same footer. The fourth slot is the
  // pursuit tab: Fishing by default, Birding when primaryPursuit says so.
  function renderTabs() {
    var base = currentTab();
    var pursuit = app.settings.primaryPursuit === 'birding'
      ? ['pursuit', '#/birding', Lx('Birding'), 'bird']
      : ['pursuit', '#/fishing-hub', Lx('Fishing'), 'fish'];
    var tabs = [
      ['explore', '#/explore', Lx('Guide'), 'book-open'],
      ['map', '#/map', Lx('Map'), 'map'],
      pursuit,
      ['journal', '#/journal', Lx('Journal'), 'notebook'],
      ['more', '#/more', Lx('More'), 'ellipsis']
    ];
    var html = '';
    tabs.forEach(function (t) {
      var on = base === t[0];
      html += '<a class="tab ios-tab' + (on ? ' active' : '') + '" data-tab="' + t[0] + '" href="' + t[1] + '"' +
        (on ? ' aria-current="page"' : '') + '>' + spriteIcon(t[3]) + '<span>' + t[2] + '</span></a>';
    });
    $('#tabbar').innerHTML = html;
  }
  function currentTab() {
    var h = location.hash.replace(/^#\//, '');
    // Search, Account and Photos are pushed screens now: no tab highlights.
    if (h.indexOf('search') === 0 || h.indexOf('park') === 0 ||
        h.indexOf('account') === 0 || h.indexOf('photos') === 0) return '';
    // The pursuit tab owns both hubs, whichever of the two sits in the bar.
    if (h.indexOf('fishing-hub') === 0 || h.indexOf('birding') === 0) return 'pursuit';
    if (h.indexOf('map') === 0) return 'map';
    // Everything that is a record of what you have seen belongs to the Journal tab.
    if (h.indexOf('journal') === 0 || h.indexOf('mylog') === 0 || h.indexOf('stats') === 0 ||
        h.indexOf('badges') === 0) return 'journal';
    // Learn now lives inside More, so its screens highlight More.
    if (h.indexOf('learn') === 0 || h.indexOf('alerts') === 0 || h.indexOf('invasives') === 0 || h.indexOf('roads') === 0 ||
        h.indexOf('more') === 0 || h.indexOf('resources') === 0 || h.indexOf('trust') === 0 ||
        h.indexOf('privacy') === 0 || h.indexOf('community') === 0) return 'more';
    if (h.indexOf('explore') === 0 || h.indexOf('species') === 0 || h.indexOf('atrisk') === 0 ||
        h.indexOf('zones') === 0 || h.indexOf('fishing') === 0 || h.indexOf('log') === 0) return 'explore';
    return 'explore';
  }

  /* ------------------------------------------------------------ Router */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var r = parts[0] || 'log';
    // Re-read the shared ON Fishing catch log so a catch made in the sibling
    // app (same origin, same storage) appears without a reload.
    app.fishCatches = loadFishCatches();
    // Tear down the Leaflet map when navigating away from the Map screen
    if (r !== 'map' && app.map) {
      try { app.map.remove(); } catch (e) {}
      app.map = null; app.placeMode = null;
      app._layer = null; app._parksLayer = null; app._zonesLayer = null;
      clearTimeout(app._hintTimer);
    }
    if (r === 'log') viewLog();
    else if (r === 'explore') {
      // #/explore/<cat>/<sub> is an alias of the flat category page that
      // scrolls to the right group; old links keep working.
      if (parts[1]) viewCategory(parts[1], parts[2]);
      else viewExplore();
    }
    else if (r === 'atrisk') viewAtRisk();
    else if (r === 'zones') { if (parts[1]) viewZone(parts[1]); else viewZones(); }
    else if (r === 'fishing-hub') viewFishingHub();
    else if (r === 'birding') viewBirding();
    else if (r === 'fishing') viewSpeciesZones(parts[1]);
    else if (r === 'species') viewSpecies(parts[1]);
    else if (r === 'search') viewSearch();
    else if (r === 'account') viewAccount();
    else if (r === 'photos') viewPhotos();
    else if (r === 'park') viewParkEco(parts[1]);
    else if (r === 'map') viewMap();
    else if (r === 'journal') {
      if (parts[1] === 'species' && parts[2]) viewSpeciesJournal(parts[2]);
      else if (parts[1] === 'place' && parts[2]) viewJournalPlace(decodeURIComponent(parts[2]));
      else viewJournal();
    }
    // #/mylog is where the journal used to live. Old links and share cards still
    // point at it, so it stays as an alias rather than a dead route.
    else if (r === 'mylog') viewJournal();
    else if (r === 'alerts') viewAlerts();
    else if (r === 'community') viewCommunity();
    else if (r === 'invasives') viewInvasives();
    else if (r === 'badges') viewBadges();
    else if (r === 'stats') viewStats();
    else if (r === 'privacy') viewPrivacy();
    else if (r === 'trust') { if (parts[1]) viewTrustAccount(parts[1]); else viewTrust(); }
    else if (r === 'learn') { if (parts[1]) viewLearn(parts[1]); else viewLearnHub(); }
    else if (r === 'resources') viewResources();
    else if (r === 'more') viewMore();
    else if (r === 'shared') viewShared(parts[1]);
    else viewExplore();
    renderTabs();
  }

  /* --------------------------------------------------- Global handlers */
  // Escape closes the top-most modal, hardware keyboards on iPad and desktop.
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' && ev.key !== 'Esc') return;
    if ($('#picker-root')) { ev.preventDefault(); closePicker(); }
    else if ($('#sheet')) {
      ev.preventDefault();
      // The first-run privacy gate uses id="sheet"; dismissing it via Escape must
      // still record consent, or it silently reappears on the next launch.
      var root = $('#sheet-root');
      if (root && root.querySelector('[data-action="accept-privacy"]') && !app.settings.seenPrivacy) {
        app.settings.seenPrivacy = true; saveSettings();
      }
      closeSheet();
    }
  });

  /* Browser-driven navigation (back/forward buttons, Safari's own edge swipe)
     must render without our push/pop animation, or the two animations stack and
     the screen flashes. An in-app tap on a hash link or back button stamps a
     short-lived flag; a hashchange that arrives without a fresh stamp is the
     browser's doing and renders with direction 'none'. Safari's native gesture
     already drives history, so there is no custom edge-swipe handler any more. */
  var _tapNavAt = 0;
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest && ev.target.closest('a[href^="#"], [data-action="nav-back"]');
    if (el) _tapNavAt = Date.now();
  }, true);
  function isUserNav() { return (Date.now() - _tapNavAt) < 700; }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-action]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    switch (a) {
      case 'open-log':
        ev.preventDefault();
        openLog({ species: t.getAttribute('data-species'), cat: t.getAttribute('data-cat'), sub: t.getAttribute('data-sub') });
        break;
      case 'close-sheet': ev.preventDefault(); closeSheet(); break;
      case 'close-sheet-nav': closeSheet(); break; // let the link navigate too
      case 'species-menu': ev.preventDefault(); openSpeciesMenu(t.getAttribute('data-id')); break;
      case 'focus-filter': {
        ev.preventDefault();
        window.scrollTo(0, 0);
        var ffi = $('#cat-filter-input');
        if (ffi) setTimeout(function () { ffi.focus(); }, 60);
        break;
      }
      case 'nav-back': ev.preventDefault(); if (history.length > 1) history.back(); else location.hash = '#/more'; break;
      case 'report-bear':
        ev.preventDefault();
        if (app.map) { app.placeMode = 'bear'; updateMapHint(); toast('Tap the map where you saw the bear'); }
        else openBearReport({});
        break;
      case 'report-hazard':
        ev.preventDefault();
        if (app.map) { app.placeMode = 'hazard'; updateMapHint(); toast('Tap the map to place the hazard'); }
        else openHazardReport({});
        break;
      case 'report-item': openReportMenu(t.getAttribute('data-key')); ev.preventDefault(); break;
      case 'hide-report':
        ev.preventDefault();
        hideReport(t.getAttribute('data-key')); closeSheet(); loadCommunityFeed(); toast('Hidden on this phone');
        break;
      case 'unhide-reports':
        ev.preventDefault();
        unhideReports(); loadCommunityFeed(); toast('Hidden reports restored');
        break;
      case 'map-filter': {
        ev.preventDefault();
        var fk = t.getAttribute('data-f');
        if (!app.settings.mapShow || typeof app.settings.mapShow !== 'object') app.settings.mapShow = {};
        app.settings.mapShow[fk] = !app.settings.mapShow[fk];
        saveSettings();
        var mc = $('#map-chips'); if (mc) mc.innerHTML = mapChips();
        renderMapMarkers();
        break;
      }
      case 'map-layer':
        ev.preventDefault();
        { var lk = t.getAttribute('data-l'); setMapLayer(lk, !mapLayerOn(lk)); var mc2 = $('#map-chips'); if (mc2) mc2.innerHTML = mapChips(); }
        break;
      case 'map-locate': ev.preventDefault(); mapLocate(false); break;
      case 'map-layers': ev.preventDefault(); openLayersSheet(); break;
      case 'place-center': {
        ev.preventDefault();
        if (!app.map || !app.placeMode) break;
        var ctr = app.map.getCenter(), mode = app.placeMode;
        app.placeMode = null; updateMapHint();
        if (mode === 'bear') openBearReport({ lat: ctr.lat, lng: ctr.lng });
        else openHazardReport({ lat: ctr.lat, lng: ctr.lng });
        break;
      }
      case 'bear-species': ev.preventDefault(); readBear(); app.bdraft.species = t.getAttribute('data-v'); renderBearSheet(); break;
      case 'bear-behaviour': ev.preventDefault(); readBear(); app.bdraft.behaviour = t.getAttribute('data-v'); renderBearSheet(); break;
      case 'bcount': {
        ev.preventDefault();
        app.bdraft.count = Math.max(1, Math.min(99, app.bdraft.count + parseInt(t.getAttribute('data-d'), 10)));
        var bv = $('#bcount-val'); if (bv) bv.textContent = app.bdraft.count;
        break;
      }
      case 'bear-locate': ev.preventDefault(); reportLocate('bear'); break;
      case 'save-bear': ev.preventDefault(); saveBear(); break;
      case 'hazard-type': ev.preventDefault(); readHazard(); app.hdraft.type = t.getAttribute('data-t'); renderHazardSheet(); break;
      case 'hazard-locate': ev.preventDefault(); reportLocate('hazard'); break;
      case 'save-hazard': ev.preventDefault(); saveHazard(); break;
      case 'save-entry': ev.preventDefault(); saveEntry(); break;
      case 'pick-species': ev.preventDefault(); syncDraftInputs(); openPicker(); break;
      case 'close-picker': ev.preventDefault(); closePicker(); break;
      case 'picker-cat':
        ev.preventDefault();
        app._pickerCat = t.getAttribute('data-cat');
        $('#picker-chips').innerHTML = pickerChips(app._pickerCat);
        refreshPicker();
        break;
      case 'select-species': {
        ev.preventDefault();
        var s = byId[t.getAttribute('data-id')];
        if (s) { app.draft.speciesId = s.id; app.draft.customName = ''; app.draft.cat = s.cat; app.draft.sub = s.sub; app.draft.emoji = s.emoji;
          if (s.cat === 'fish' && app.draft.evidence !== 'caught' && app.draft.evidence !== 'saw') app.draft.evidence = 'caught'; }
        closePicker(); renderSheet();
        break;
      }
      case 'custom-species': {
        ev.preventDefault();
        var name = prompt('What did you see? (name it yourself)');
        if (name && name.trim()) { app.draft.customName = name.trim(); app.draft.speciesId = null; app.draft.emoji = '\u{1F43E}'; }
        closePicker(); renderSheet();
        break;
      }
      case 'set-evidence': ev.preventDefault(); syncDraftInputs(); app.draft.evidence = t.getAttribute('data-val'); renderSheet(); break;
      case 'set-kept': ev.preventDefault(); syncDraftInputs(); app.draft.released = t.getAttribute('data-v') === 'released'; renderSheet(); break;
      case 'count': {
        ev.preventDefault();
        var delta = parseInt(t.getAttribute('data-d'), 10);
        app.draft.count = Math.max(1, Math.min(999, app.draft.count + delta));
        var cv = $('#count-val'); if (cv) cv.textContent = app.draft.count;
        break;
      }
      case 'use-location': ev.preventDefault(); captureLocation(); break;
      case 'take-photo': ev.preventDefault(); { var pi = $('#photo-input'); if (pi) pi.click(); } break;
      case 'remove-photo': ev.preventDefault(); app.draft.photo = null; { var slot = $('#photo-slot'); if (slot) slot.innerHTML = photoSlot(); } break;
      case 'open-entry': ev.preventDefault(); openEntry(t.getAttribute('data-id')); break;
      case 'share-entry': ev.preventDefault(); shareEntry(t.getAttribute('data-id')); break;
      case 'edit-entry': ev.preventDefault(); editEntry(t.getAttribute('data-id')); break;
      case 'delete-entry':
        ev.preventDefault();
        deleteEntry(t.getAttribute('data-id'));
        break;
      case 'export-data': ev.preventDefault(); exportData(); break;
      case 'import-data': ev.preventDefault(); { var ii = $('#import-input'); if (ii) ii.click(); } break;
      case 'reset-data': {
        // Two taps: the first arms the row and relabels it, the second wipes.
        // A few seconds of inaction disarms it again.
        ev.preventDefault();
        if (!app._resetArmed) {
          app._resetArmed = true;
          var rl = t.querySelector('.ios-row-title');
          if (rl) rl.textContent = 'Tap again to erase everything';
          clearTimeout(app._resetTimer);
          app._resetTimer = setTimeout(function () {
            app._resetArmed = false;
            var rl2 = document.querySelector('[data-action="reset-data"] .ios-row-title');
            if (rl2) rl2.textContent = 'Reset all data';
          }, 4000);
          break;
        }
        clearTimeout(app._resetTimer);
        app._resetArmed = false;
        resetAllData();
        break;
      }
      case 'set-units': ev.preventDefault(); app.settings.units = t.getAttribute('data-val'); saveSettings(); rerenderKeepScroll(); break;
      case 'edit-section': ev.preventDefault(); openSectionEditor(t.getAttribute('data-key')); break;
      case 'sec-toggle': ev.preventDefault(); (function () {
        var id = t.getAttribute('data-id');
        app._secDraft.forEach(function (r) { if (r.id === id) r.on = !r.on; });
        var rowEl = t.closest('.secedit-row');
        if (rowEl) {
          rowEl.classList.toggle('on');
          t.setAttribute('aria-checked', rowEl.classList.contains('on') ? 'true' : 'false');
        }
      })(); break;
      case 'sec-done': ev.preventDefault(); (function () {
        app.settings.sections = app.settings.sections || {};
        app.settings.sections[app._secKey] = app._secDraft;
        saveSettings(); closeSheet(); route();
      })(); break;
      case 'appear-theme': ev.preventDefault(); setAppearance('theme', t.getAttribute('data-v')); rerenderKeepScroll(); break;
      case 'appear-size': ev.preventDefault(); setAppearance('size', t.getAttribute('data-v')); rerenderKeepScroll(); break;
      case 'set-pursuit': {
        ev.preventDefault();
        var pv = t.getAttribute('data-v');
        if (pv === 'fishing' || pv === 'birding') {
          app.settings.primaryPursuit = pv; saveSettings();
          renderTabs(); rerenderKeepScroll();
          toast(pv === 'birding' ? Lx('Birding is in the bar') : Lx('Fishing is in the bar'));
        }
        break;
      }
      case 'set-lang': {
        ev.preventDefault();
        var lv = t.getAttribute('data-v');
        if (lv === 'en' || lv === 'fr') {
          app.settings.lang = lv; saveSettings();
          document.documentElement.lang = lv;
          renderTabs(); rerenderKeepScroll();
        }
        break;
      }
      case 'accept-privacy': ev.preventDefault(); app.settings.seenPrivacy = true; saveSettings(); closeSheet(); break;
      case 'open-privacy-first': ev.preventDefault(); app.settings.seenPrivacy = true; saveSettings(); closeSheet(); setTimeout(function () { location.hash = '#/privacy'; }, 320); break;
      case 'version-tap': ev.preventDefault(); versionTap(); break;
      case 'dismiss-install': ev.preventDefault(); app.settings.seenInstall = true; saveSettings(); viewExplore(); break;
      case 'community-connect': {
        ev.preventDefault();
        var inp = $('#community-url'); var url = inp ? inp.value.trim() : '';
        if (!url) { toast('Enter a server address'); break; }
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        toast('Connecting…');
        Community.health(url).then(function (ok) {
          if (ok) { app.settings.communityUrl = url.replace(/\/+$/, ''); saveSettings(); toast('Connected'); viewCommunity(); }
          else toast('Couldn’t reach that server');
        });
        break;
      }
      case 'community-disconnect': ev.preventDefault(); app.settings.communityUrl = ''; app.settings.community = false; saveSettings(); toast('Disconnected'); viewCommunity(); break;
      case 'enable-push': ev.preventDefault(); Community.enablePush(); break;
      case 'reset-cid':
        ev.preventDefault();
        if (confirm('Reset your device id? Future shared reports won’t be linkable to your past ones. Your on-device log is unaffected.')) {
          try { localStorage.removeItem('owl-cid'); localStorage.removeItem('owl-tok'); } catch (e) {}
          toast('Device id reset');
        }
        break;
      case 'delete-shared':
        ev.preventDefault();
        if (confirm('Delete everything you’ve shared to the community server? This can’t be undone.')) {
          Community.remove().then(function (r) { toast(r && r.ok ? ('Deleted ' + (r.deleted || 0) + ' shared records') : 'Couldn’t reach the server'); });
        }
        break;
      case 'clear-data':
        ev.preventDefault();
        if ((app.entries.length || app.hazards.length) && confirm('Delete ALL ' + app.entries.length + ' encounters and ' + app.hazards.length + ' hazards? This cannot be undone.')) {
          app.entries = []; app.hazards = []; Store.clear('entries'); Store.clear('hazards'); toast('All data cleared'); route();
        } else if (!app.entries.length && !app.hazards.length) { toast('Nothing to clear'); }
        break;
    }
  });
  // Delegated file input change
  document.addEventListener('change', function (ev) {
    if (!ev.target) return;
    if (ev.target.id === 'photo-input') handlePhoto(ev.target.files && ev.target.files[0]);
    else if (ev.target.id === 'journal-filter') {
      // re-render in place so the timeline swaps under a still-parked scroll
      app.settings.journalFilter = ev.target.value; saveSettings();
      rerenderKeepScroll();
    }
    else if (ev.target.id === 'photos-toggle') {
      app.settings.photos = !!ev.target.checked; saveSettings();
      toast(ev.target.checked ? 'Reference photos on (fetched from iNaturalist)' : 'Reference photos off');
    }
    else if (ev.target.id === 'glass-toggle') {
      setAppearance('glass', ev.target.checked ? 'on' : 'off');
    }
    else if (ev.target.id === 'layer-wildlife' || ev.target.id === 'layer-parks' || ev.target.id === 'layer-zones') {
      setMapLayer(ev.target.id.replace('layer-', ''), ev.target.checked);
    }
    else if (ev.target.id === 'community-share') {
      app.settings.community = !!ev.target.checked; saveSettings();
      toast(ev.target.checked ? 'Sharing your sightings. Thanks.' : 'Sharing turned off');
    }
    else if (ev.target.id === 'display-name') {
      // One shared profile for all three outdoors apps (see loadProfile).
      saveProfileName(ev.target.value);
      // The avatar initial follows the name wherever an avatar is on screen.
      var av = document.getElementById('account-avatar'); if (av) av.innerHTML = avatarInner();
      var hv = document.getElementById('header-avatar'); if (hv) hv.innerHTML = avatarInner();
    }
    else if (ev.target.id === 'import-input') {
      importBackup(ev.target.files && ev.target.files[0]);
      ev.target.value = '';
    }
  });

  function captureLocation() {
    if (!navigator.geolocation) { toast('Location not available'); return; }
    var d = app.draft; if (!d) return;   // capture THIS draft; a later openLog/editEntry may replace app.draft
    var sub = $('#loc-sub'); if (sub) sub.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      d.lat = pos.coords.latitude; d.lng = pos.coords.longitude;
      if (app.draft !== d) return;        // draft was replaced while GPS was pending, don't stamp the wrong entry / touch a different sheet
      var ti = $('#loc-title'), su = $('#loc-sub');
      if (ti) ti.textContent = 'Location captured';
      if (su) su.textContent = d.lat.toFixed(4) + ', ' + d.lng.toFixed(4);
      haptic();
    }, function () {
      if (app.draft !== d) return;
      var su2 = $('#loc-sub'); if (su2) su2.textContent = 'Couldn’t get location. Tap to retry.';
      toast('Location permission denied');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }

  /* -------------------------------------------------------------- Boot */
  window.addEventListener('hashchange', function () {
    app._browserNav = !isUserNav();
    route();
  });
  /* The "In depth" accounts are 650KB, a third of the whole app, and are only
     read on a species page. Loading them after first paint keeps the first
     screen fast without giving anything up: the species page already renders
     fine without notes, and re-routes once they arrive if one is open. */
  function loadNotesLazily() {
    if (window.SPECIES_NOTES) return;
    var s = document.createElement('script');
    s.src = 'data/notes.js';
    s.async = true;
    s.onload = function () {
      if (location.hash.indexOf('#/species/') === 0) route();
    };
    document.body.appendChild(s);
  }

  function boot() {
    loadSettings();
    loadProfile();
    loadAppearance();
    applyAppearance();
    if (window.OnShare) OnShare.config({ app: 'on-wildlife', base: 'https://katsuma0.github.io/on-wildlife/', accent: '#284162' });
    Store.load().then(function (entries) {
      app.entries = entries || [];
      return Store.loadHazards();
    }).then(function (hazards) {
      app.hazards = hazards || [];
      app.ready = true;
      initBadges();
      if (!location.hash || location.hash === '#/log') location.hash = '#/explore';
      route();
      maybePrivacyBanner();
      loadNotesLazily();
    });
    // Only over http(s): inside the native iOS shell the files are bundled
    // locally and a service worker would just serve stale copies.
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').catch(function () {});
      });
    }
  }
  boot();
})();
