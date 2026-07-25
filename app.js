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
    back: '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 1 2 10l8 9"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/></svg>',
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
    if (_vtaps >= 5) { _vtaps = 0; haptic(); toast('\u{1F43E} Made with care for Ontario’s wild places. Thanks for logging!'); }
  }

  var app = {
    entries: [], hazards: [],
    settings: { units: 'metric', theme: 'auto', homeMode: 'all', photos: false, seenPrivacy: false, seenInstall: false, community: false, communityUrl: '', badges: [] },
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
  }
  function saveSettings() { try { localStorage.setItem('owl-settings', JSON.stringify(app.settings)); } catch (e) {} }
  function applyTheme() {
    var t = app.settings.theme || 'auto';
    var root = document.documentElement;
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
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
    return '<a class="cell tap" href="#/species/' + esc(s.id) + '">' +
      '<span class="cell-emoji">' + s.emoji + '</span>' +
      '<span class="cell-body"><span class="cell-title">' + esc(s.name) +
      (logged ? ' <span class="badge badge-info" style="vertical-align:1px">logged</span>' : '') +
      '</span><span class="cell-sub">' + sub + '</span></span>' +
      right + '</a>';
  }

  function loggedIdSet() {
    var m = {};
    app.entries.forEach(function (e) { if (e.speciesId) m[e.speciesId] = true; });
    return m;
  }

  /* --------------------------------------------------------- Screen frame
     Builds a nav bar + optional large title + body, and wires scroll fade. */
  // ---- iOS-style navigation transitions ----
  var TAB_ROOTS = { log: 1, explore: 1, map: 1, mylog: 1, more: 1 };
  function reduceMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  // Decide push vs pop vs tab-switch vs same-screen re-render from the hash + a stack.
  function navDirection() {
    if (!app.nav) app.nav = { stack: [] };
    var hash = location.hash || '#/log';
    var parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var top = parts[0] || 'log';
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
      appEl.innerHTML = html; window.scrollTo(0, 0); return;
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
  function screen(cfg) {
    var navLeft = cfg.back
      ? '<div class="nav-left"><a class="nav-btn bold" href="' + esc(cfg.back) + '">' + I.back + esc(cfg.backText || 'Back') + '</a></div>'
      : cfg.backAction
        ? '<div class="nav-left"><button class="nav-btn bold" data-action="nav-back">' + I.back + esc(cfg.backText || 'Back') + '</button></div>'
        : (cfg.navLeft ? '<div class="nav-left">' + cfg.navLeft + '</div>' : '');
    var navRight = cfg.navRight ? '<div class="nav-right">' + cfg.navRight + '</div>' : '';
    var nav = '<div class="nav' + (cfg.large ? ' has-large' : '') + '" id="nav">' +
      '<div class="nav-row">' + navLeft +
      '<div class="nav-title"' + (cfg.large ? '' : ' role="heading" aria-level="1"') + '>' + esc(cfg.title || '') + '</div>' + navRight +
      '</div></div>';
    var large = cfg.large
      ? '<div class="large-title"><h1>' + esc(cfg.title) + '</h1>' +
        (cfg.subtitle ? '<div class="subtitle">' + esc(cfg.subtitle) + '</div>' : '') + '</div>'
      : '';
    var tail = cfg.bare ? '' : '<div class="spacer-lg"></div>';
    mountScreen('<div class="screen">' + nav + large + cfg.body + tail + '</div>', navDirection());
    updateNav();
  }
  function updateNav() {
    var nav = $('#nav'); if (!nav) return;
    var y = window.scrollY || window.pageYOffset || 0;
    if (y > 6) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    if (nav.classList.contains('has-large')) {
      if (y > 34) nav.classList.add('show-title'); else nav.classList.remove('show-title');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ============================================================ SCREENS */

  function viewLog() {
    var mode = app.settings.homeMode || 'all';
    var cfg = mode === 'fishing' ? fishingHome() : mode === 'birding' ? birdingHome() : allHome();
    var body = modeSeg(mode) + cfg.body;
    screen({ title: cfg.title, large: true, subtitle: cfg.subtitle, body: body });
  }
  function modeSeg(mode) {
    function o(id, label) { return '<button type="button" class="seg-opt' + (mode === id ? ' on' : '') + '" aria-pressed="' + (mode === id ? 'true' : 'false') + '" data-action="home-mode" data-m="' + id + '">' + label + '</button>'; }
    return '<div class="hpad" style="margin-top:2px"><div class="segmented">' +
      o('all', 'All wildlife') + o('fishing', '\u{1F3A3} Fishing') + o('birding', '\u{1F985} Birding') + '</div></div>';
  }
  function recentIn(pred, n) {
    return app.entries.filter(pred).sort(function (a, b) { return new Date(b.when) - new Date(a.when); }).slice(0, n || 6);
  }
  function recentGroup(title, list) {
    if (!list.length) return '';
    var h = '<div class="group"><div class="group-header">' + esc(title) + '</div><div class="list">';
    list.forEach(function (e) { h += entryCell(e); });
    return h + '</div><div class="group-footer"><a href="#/mylog">See all encounters ›</a></div></div>';
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
    var h = '<div class="group"><div class="group-header">This month in Ontario</div><div class="list">' +
      '<div class="cell"><span class="cell-emoji">\u{1F4C5}</span><span class="cell-body"><span class="cell-sub" style="white-space:normal;font-size:15px;color:var(--label)">' + esc(sn.t) + '</span></span></div>';
    if (suggest) {
      var s = byId[suggest];
      h += '<a class="cell tap" href="#/species/' + esc(suggest) + '"><span class="cell-emoji">' + s.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">Look for ' + (/^[aeiou]/i.test(s.name) ? 'an ' : 'a ') + esc(s.name) + '</span>' +
        '<span class="cell-sub">Around right now, and you have not logged one yet</span></span><span class="chevron">' + I.chevron + '</span></a>';
    }
    return h + '</div></div>';
  }

  function allHome() {
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var uniq = {}; app.entries.forEach(function (e) { if (e.speciesId) uniq[e.speciesId] = 1; });
    var body = '';
    if (isIosSafari() && !app.settings.seenInstall) {
      body += '<div class="wrap-note" style="align-items:flex-start;margin-top:8px"><span class="i">\u{1F4F2}</span><span><b>Add to Home Screen</b> to use this like a real app, fullscreen and offline. Tap the <b>Share</b> button, then <b>Add to Home Screen</b>. <button data-action="dismiss-install" style="padding:0;font-weight:600;color:var(--tint);background:none">Got it</button></span></div>';
    }
    body += '<div class="hpad" style="margin-top:10px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log">' + I.plus + 'Log an Encounter</button></div>';
    body += '<div class="chip-row" style="margin-top:14px">' +
      '<button class="chip chip-alert" data-action="report-bear">\u{1F43B} Report a Bear</button>' +
      '<button class="chip chip-warn" data-action="report-hazard">⚠️ Report a Hazard</button>' +
      '<a class="chip" href="#/explore">\u{1F50D} Field Guide</a>' +
      '<a class="chip" href="#/badges">\u{1F3C5} Badges</a>' +
      '<a class="chip" href="#/community">\u{1F30D} Community</a>' +
      '</div>';
    body += seasonalCard();
    body += '<div class="group"><div class="group-header">Safety & Alerts</div><div class="list">' +
      '<a class="cell tap" href="#/alerts"><span class="cell-emoji">⚠️</span><span class="cell-body"><span class="cell-title">Safety & Alerts</span><span class="cell-sub">Dangers to know · your bear & hazard reports</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'What to look for and what to do', 'ticks') +
      learnCell('\u{1F43B}', 'Bear safety', 'Prevent encounters · Bear Wise', 'bears') +
      learnCell('☠️', 'Dangerous plants', 'Poison ivy, giant hogweed & more', 'plants') +
      '</div></div>';
    if (app.entries.length) {
      body += '<div class="stat-grid" style="margin-top:8px">' +
        stat(app.entries.length, app.entries.length === 1 ? 'Encounter' : 'Encounters') +
        stat(Object.keys(uniq).length, 'Species') + stat(catsSeen(), 'Categories') + '</div>';
      body += recentGroup('Recent', recentIn(function () { return true; }, 6));
    } else {
      body += '<div class="empty"><div class="e">\u{1F343}</div><h3>Start your field journal</h3>' +
        '<p>Tap <b>Log an Encounter</b> to record the first animal you spot, hear, or catch. Everything is saved right on your phone.</p></div>';
    }
    return { title: greet, subtitle: 'What did you spot today?', body: body };
  }

  function fishingHome() {
    var fish = recentIn(function (e) { return e.cat === 'fish'; }, 6);
    var caught = app.entries.filter(function (e) { return e.cat === 'fish'; });
    var released = caught.filter(function (e) { return e.fish && e.fish.released; }).length;
    var uniq = {}; caught.forEach(function (e) { if (e.speciesId) uniq[e.speciesId] = 1; });
    var body = '<div class="hpad" style="margin-top:10px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log" data-cat="fish">' + I.plus + 'Log a Fish</button></div>';
    body += '<div class="chip-row" style="margin-top:14px">' +
      '<a class="chip" href="#/explore/fish">\u{1F41F} Fish guide</a>' +
      '<a class="chip" href="#/species/walleye">\u{1F3A3} Species</a>' +
      '<button class="chip chip-warn" data-action="report-hazard">⚠️ Report a hazard</button>' +
      '</div>';
    body += '<div class="group"><div class="group-header">Fishing safety and learning</div><div class="list">' +
      learnCell('\u{1F3A3}', 'Handling & releasing fish', 'Keep released fish alive', 'fish-handling') +
      learnCell('\u{1F6A4}', 'Protect the water', 'Stop invasive species spreading', 'water-care') +
      learnCell('\u{1F37D}️', 'Is it safe to eat?', 'Eating your catch, the healthy way', 'fish-eating') +
      learnCell('\u{1F6E5}️', 'Boating safety', 'Lifejackets, cold water & gear', 'boat-safety') +
      linkCell('Get your fishing licence', 'https://www.ontario.ca/page/get-fishing-licence', 'Required for most anglers in Ontario') +
      '</div></div>';
    if (caught.length) {
      body += '<div class="stat-grid" style="margin-top:8px">' +
        stat(caught.length, caught.length === 1 ? 'Fish' : 'Fish') + stat(Object.keys(uniq).length, 'Species') + stat(released, 'Released') + '</div>';
      body += recentGroup('Recent catches', fish);
    } else {
      body += '<div class="empty"><div class="e">\u{1F3A3}</div><h3>Log your first catch</h3>' +
        '<p>Record fish you catch or see, with length, weight, bait and whether you released it.</p></div>';
    }
    return { title: 'Fishing', subtitle: 'Log your catch', body: body };
  }

  function birdingHome() {
    var birds = recentIn(function (e) { return e.cat === 'birds'; }, 6);
    var all = app.entries.filter(function (e) { return e.cat === 'birds'; });
    var uniq = {}; all.forEach(function (e) { if (e.speciesId) uniq[e.speciesId] = 1; });
    var body = '<div class="hpad" style="margin-top:10px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log" data-cat="birds">' + I.plus + 'Log a Bird</button></div>';
    body += '<div class="chip-row" style="margin-top:14px">' +
      '<a class="chip" href="#/explore/birds">\u{1F426} Bird guide</a>' +
      '<a class="chip" href="#/learn/birding-how">\u{1F430} How to bird</a>' +
      '<a class="chip" href="#/badges">\u{1F3C5} Badges</a>' +
      '</div>';
    body += '<div class="group"><div class="group-header">Birding safety and learning</div><div class="list">' +
      learnCell('\u{1F430}', 'How to birdwatch', 'The early bird gets the bird', 'birding-how') +
      learnCell('\u{1F97E}', 'Trail etiquette', 'Share the trail, protect the wild', 'trail-etiquette') +
      learnCell('\u{1F9ED}', 'Trail safety', 'Come home from every hike', 'trail-safety') +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'Check after every walk', 'ticks') +
      '</div></div>';
    if (all.length) {
      body += '<div class="stat-grid" style="margin-top:8px">' +
        stat(all.length, 'Sightings') + stat(Object.keys(uniq).length, 'Species') + stat('\u{1F305}', 'Go early') + '</div>';
      body += recentGroup('Recent birds', birds);
    } else {
      body += '<div class="empty"><div class="e">\u{1F985}</div><h3>Start your life list</h3>' +
        '<p>Head out early, keep quiet, and log the birds you see or hear. Tap <b>How to birdwatch</b> for tips.</p></div>';
    }
    return { title: 'Birding', subtitle: 'The early bird gets the bird', body: body };
  }
  function stat(n, l) { return '<div class="stat"><div class="n">' + n + '</div><div class="l">' + esc(l) + '</div></div>'; }
  function catsSeen() { var m = {}; app.entries.forEach(function (e) { if (e.cat) m[e.cat] = 1; }); return Object.keys(m).length; }
  function learnCell(emoji, title, sub, topicId) {
    return '<a class="cell tap" href="#/learn/' + esc(topicId) + '">' +
      '<span class="cell-emoji">' + emoji + '</span>' +
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
  function checkNewBadges() {
    var earned = earnedBadgeIds(), known = app.settings.badges || [];
    var fresh = earned.filter(function (id) { return known.indexOf(id) < 0; });
    if (fresh.length) {
      app.settings.badges = known.concat(fresh); saveSettings();
      var b = badgeById(fresh[0]);
      if (b) { haptic(); toast('\u{1F3C5} Badge unlocked: ' + b.name + (fresh.length > 1 ? ' +' + (fresh.length - 1) + ' more' : '')); }
    }
  }
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
    if (!app.settings.photos) return; // off by default; contacts iNaturalist only when enabled
    var forId = s.id;
    speciesPhoto(s, function (rec) {
      if (!rec || !rec.url) return;
      if (location.hash.indexOf('/species/' + forId) < 0) return; // navigated away, don't inject into another page
      var box = $('#sp-photo'), em = $('#sp-emoji');
      if (!box) return;
      box.innerHTML = '<img class="sp-photo" src="' + esc(rec.url) + '" alt="' + esc(s.name) + '" loading="lazy">' +
        '<div class="photo-credit">' + esc(rec.attr || 'iNaturalist') + ' · CC · iNaturalist</div>';
      box.classList.add('show');
      if (em) em.style.display = 'none';
    });
  }

  function entryCell(e) {
    var meta = e.speciesId ? byId[e.speciesId] : null;
    var sub = fmtDay(e.when) + ' · ' + fmtTime(e.when);
    var extra = [];
    if (e.count > 1) extra.push('×' + e.count);
    if (e.evidence === 'heard') extra.push('heard');
    if (e.evidence === 'tracks') extra.push('signs');
    if (e.fish && e.fish.caught) extra.push(e.fish.released ? 'caught · released' : 'caught');
    if (extra.length) sub += ' · ' + extra.join(' · ');
    var thumb = e.photo
      ? '<img class="thumb" src="' + e.photo + '" alt="">'
      : '<span class="cell-emoji">' + (e.emoji || '\u{1F43E}') + '</span>';
    return '<button type="button" class="cell tap" data-action="open-entry" data-id="' + esc(e.id) + '">' +
      thumb +
      '<span class="cell-body"><span class="cell-title">' + esc(e.speciesName) + '</span>' +
      '<span class="cell-sub">' + esc(sub) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></button>';
  }

  /* ----------------------------------------------------------- Explore */
  function viewExplore() {
    var body = '';
    body += '<div class="searchbar">' + I.search +
      '<input type="search" id="explore-search" aria-label="Search species" placeholder="Search species" autocomplete="off" autocorrect="off" autocapitalize="none">' +
      '</div>';
    body += '<div id="search-results"></div>';
    body += '<div id="explore-cats">';
    var atRiskN = SPECIES.filter(function (s) { return s.atRisk; }).length;
    body += '<div class="group" style="margin-top:6px"><div class="list">' +
      '<a class="cell tap" href="#/atrisk"><span class="cell-emoji">\u{1F6E1}️</span>' +
      '<span class="cell-body"><span class="cell-title">Species at Risk</span>' +
      '<span class="cell-sub">' + atRiskN + ' in Ontario, flagged through the guide</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    body += '<div class="group-header hpad" style="margin-top:6px">Ontario Wildlife</div>';
    body += '<div class="card-grid">';
    CATEGORIES.forEach(function (c) {
      var count = speciesInCat(c.id).length;
      body += '<a class="cat-card" href="#/explore/' + esc(c.id) + '">' +
        '<div class="ce">' + c.emoji + '</div>' +
        '<div><div class="cn">' + esc(c.name) + '</div>' +
        '<div class="cc">' + count + ' species</div></div></a>';
    });
    body += '</div>';
    if (COMING_SOON.length) {
      body += '<div class="group-header hpad" style="margin-top:18px">Coming Soon</div>';
      body += '<div class="card-grid">';
      COMING_SOON.forEach(function (c) {
        body += '<div class="cat-card soon">' +
          '<div class="ce">' + c.emoji + '</div>' +
          '<div><div class="cn">' + esc(c.name) + '</div>' +
          '<div class="cc">In a future update</div></div></div>';
      });
      body += '</div>';
    }
    body += '</div>';

    screen({ title: 'Guide', large: true, subtitle: 'A field guide to Ontario', body: body });
    wireSearch();
  }
  function wireSearch() {
    var input = $('#explore-search'); if (!input) return;
    input.addEventListener('input', function () {
      var q = input.value;
      var res = $('#search-results');
      var cats = $('#explore-cats');
      if (!q.trim()) { res.innerHTML = ''; cats.style.display = ''; return; }
      cats.style.display = 'none';
      var list = searchSpecies(q);
      if (!list.length) { res.innerHTML = '<div class="empty"><div class="e">\u{1F50D}</div><h3>No matches</h3><p>Try another name.</p></div>'; return; }
      var logged = loggedIdSet();
      var html = '<div class="group"><div class="list">';
      list.forEach(function (s) { html += speciesCell(s, { loggedIds: logged, sub: '<i>' + esc(s.sci) + '</i> · ' + esc(catMeta(s.cat).name) }); });
      html += '</div></div>';
      res.innerHTML = html;
    });
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
  function viewCategory(catId) {
    var c = catMeta(catId);
    if (!c) return viewExplore();
    var body = '<div class="group">';
    body += '<div class="group-header">' + esc(c.name) + '</div><div class="list">';
    c.subs.forEach(function (sub) {
      var n = speciesInSub(catId, sub.id).length;
      body += '<a class="cell tap" href="#/explore/' + esc(catId) + '/' + esc(sub.id) + '">' +
        '<span class="cell-emoji">' + sub.emoji + '</span>' +
        '<span class="cell-body"><span class="cell-title">' + esc(sub.name) + '</span></span>' +
        '<span class="cell-value">' + n + '</span><span class="chevron">' + I.chevron + '</span></a>';
    });
    body += '</div></div>';
    screen({ title: c.name, back: '#/explore', backText: 'Guide', body: body });
  }

  function viewSub(catId, subId) {
    var c = catMeta(catId), sub = subMeta(catId, subId);
    if (!c || !sub) return viewCategory(catId);
    var list = sortSpecies(speciesInSub(catId, subId));
    var logged = loggedIdSet();
    var body = '<div class="group"><div class="list">';
    list.forEach(function (s) { body += speciesCell(s, { loggedIds: logged }); });
    body += '</div><div class="group-footer">' + list.length + ' species · most commonly seen first</div></div>';
    screen({ title: sub.name, back: '#/explore/' + catId, backText: c.name, body: body });
  }

  /* -------------------------------------------------------- Species page */
  function viewSpecies(id) {
    var s = byId[id];
    if (!s) return viewExplore();
    var c = catMeta(s.cat), sub = subMeta(s.cat, s.sub);
    var count = app.entries.filter(function (e) { return e.speciesId === s.id; }).length;

    var body = '<div class="hero">' +
      '<div id="sp-photo" class="sp-photo-wrap"></div>' +
      '<div class="hero-emoji" id="sp-emoji" style="background:' + tintFor(s.cat) + '22">' + s.emoji + '</div>' +
      '<h1>' + esc(s.name) + '</h1><div class="sci">' + esc(s.sci) + '</div>' +
      '<div class="badges">' + statusBadge(s) +
      '<span class="badge badge-info">' + esc(seenLabel(s.seen)) + '</span>' +
      (isFloraCat(s.cat) ? '' : '<span class="badge badge-info">' + esc(activityLabel(s.activity)) + '</span>') +
      '</div></div>';

    if (s.caution) body += '<div class="wrap-note danger"><span class="i">⚠️</span><span>' + esc(s.caution) + '</span></div>';

    body += '<div class="hpad" style="margin-top:12px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log" data-species="' + esc(s.id) + '">' + I.plus + 'Log this sighting</button></div>';

    body += '<div class="group"><div class="group-header">Field Notes</div><div class="list">' +
      info('How to identify', s.tips) +
      info('Habitat', s.habitat) +
      info('Size', s.size) +
      (s.angling ? info('Angling tip', s.angling) : '') +
      info('Best seasons', s.seasons.map(cap).join(', ') || 'Year-round') +
      info('Where in Ontario', s.region) +
      info('Did you know', s.fact) +
      '</div></div>';

    body += '<div class="group"><div class="list">' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Category</span></span>' +
      '<span class="cell-value">' + esc(c ? c.name : '') + (sub ? ' · ' + esc(sub.name) : '') + '</span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Conservation status</span></span>' +
      '<span class="cell-value">' + esc(s.status) + '</span></div>' +
      (count ? '<div class="cell"><span class="cell-body"><span class="cell-title">Your sightings</span></span><span class="cell-value">' + count + '</span></div>' : '') +
      '</div></div>';

    // Learn more, external, reputable sources (photos, range, conservation)
    body += '<div class="group"><div class="group-header">Learn more</div><div class="list">' +
      speciesLinks(s) +
      '</div><div class="group-footer">Opens external sites in your browser.</div></div>';

    var backHref = (c && sub) ? '#/explore/' + s.cat + '/' + s.sub : '#/explore';
    screen({ title: s.name, back: backHref, backText: sub ? sub.name : (c ? c.name : 'Back'), body: body });
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

  /* ------------------------------------------------------------ My Log */
  function viewMyLog() {
    if (!app.entries.length) {
      screen({
        title: 'Journal', large: true,
        body: '<div class="empty"><div class="e">\u{1F4D3}</div><h3>No encounters yet</h3>' +
          '<p>Your logged sightings will appear here, grouped by day.</p>' +
          '<div class="spacer"></div><div class="hpad"><button class="btn btn-tinted" data-action="open-log">' + I.plus + 'Log your first</button></div></div>'
      });
      return;
    }
    var uniq = {}; app.entries.forEach(function (e) { if (e.speciesId) uniq[e.speciesId] = 1; });
    var sorted = app.entries.slice().sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
    var groups = [], cur = null;
    sorted.forEach(function (e) {
      var day = fmtDay(e.when);
      if (!cur || cur.day !== day) { cur = { day: day, items: [] }; groups.push(cur); }
      cur.items.push(e);
    });
    var body = '<div class="stat-grid" style="margin-top:4px">' +
      stat(app.entries.length, 'Total') + stat(Object.keys(uniq).length, 'Species') + stat(catsSeen(), 'Categories') +
      '</div>';
    groups.forEach(function (g) {
      body += '<div class="group"><div class="group-header">' + esc(g.day) + '</div><div class="list">';
      g.items.forEach(function (e) { body += entryCell(e); });
      body += '</div></div>';
    });
    screen({
      title: 'Journal', large: true, subtitle: sorted.length + ' encounters logged',
      navRight: '<button class="nav-btn" data-action="open-log" aria-label="Add">' + I.plus + '</button>',
      body: body
    });
  }

  /* -------------------------------------------------------------- More */
  function viewMore() {
    var body = '';
    body += '<div class="group"><div class="group-header">Your Journal</div><div class="list">' +
      '<a class="cell tap" href="#/badges"><span class="cell-emoji">\u{1F3C5}</span><span class="cell-body"><span class="cell-title">Badges</span><span class="cell-sub">Collectible naturalist achievements</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '<a class="cell tap" href="#/stats"><span class="cell-emoji">\u{1F4CA}</span><span class="cell-body"><span class="cell-title">Stats</span><span class="cell-sub">Your totals & community comparison</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      moreCell('\u{1F4E4}', 'Export my log', 'Download everything as a file', 'export-data') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Report</div><div class="list">' +
      moreCell('\u{1F43B}', 'Report a bear', 'For your map & Bear Wise info', 'report-bear') +
      moreCell('⚠️', 'Report a hazard', 'Wildlife on road, construction, ticks…', 'report-hazard') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Learn & Safety</div><div class="list">' +
      '<a class="cell tap" href="#/alerts"><span class="cell-emoji">⚠️</span><span class="cell-body"><span class="cell-title">Safety & Alerts</span><span class="cell-sub">Dangers to know · your bear & hazard reports</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '<a class="cell tap" href="#/invasives"><span class="cell-emoji">\u{1F6AB}</span><span class="cell-body"><span class="cell-title">Invasive species</span><span class="cell-sub">What to watch for & how to report</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'Identify, prevent, remove & when to see a doctor', 'ticks') +
      learnCell('\u{1F43B}', 'Bear safety (Bear Wise)', 'Prevent encounters and how to report a bear', 'bears') +
      learnCell('☠️', 'Dangerous plants', 'Poison ivy, wild parsnip, giant hogweed', 'plants') +
      learnCell('\u{1F6E3}️', 'Wildlife on roads', 'Deer, moose, turtles & road hazards', 'roads') +
      learnCell('\u{1F30D}', 'Help Ontario’s wildlife', 'How your sightings support conservation', 'contribute') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Community & Data</div><div class="list">' +
      '<a class="cell tap" href="#/community"><span class="cell-emoji">\u{1F30D}</span>' +
      '<span class="cell-body"><span class="cell-title">Community</span>' +
      '<span class="cell-sub">' + (Community.on() ? 'Sharing on · see nearby activity' : app.settings.communityUrl ? 'Connected · sharing off' : 'See what’s near you this week') + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a>' +
      '<a class="cell tap" href="#/resources"><span class="cell-emoji">\u{1F517}</span>' +
      '<span class="cell-body"><span class="cell-title">Ontario & Canada resources</span>' +
      '<span class="cell-sub">Trusted sites for wildlife, fishing & safety</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a>' +
      '<a class="cell tap" href="#/trust"><span class="cell-emoji">\u{1F9EA}</span>' +
      '<span class="cell-body"><span class="cell-title">Data reliability</span>' +
      '<span class="cell-sub">Anomaly detection on contributor data (demo)</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    body += '<div class="group"><div class="group-header">Appearance</div><div class="list">' +
      '<div class="field"><span class="field-label">Theme</span><div style="flex:1"></div>' +
      '<div class="segmented" style="width:216px">' +
      '<button type="button" class="seg-opt' + (app.settings.theme === 'auto' ? ' on' : '') + '" aria-pressed="' + (app.settings.theme === 'auto' ? 'true' : 'false') + '" data-action="set-theme" data-val="auto">Auto</button>' +
      '<button type="button" class="seg-opt' + (app.settings.theme === 'light' ? ' on' : '') + '" aria-pressed="' + (app.settings.theme === 'light' ? 'true' : 'false') + '" data-action="set-theme" data-val="light">Light</button>' +
      '<button type="button" class="seg-opt' + (app.settings.theme === 'dark' ? ' on' : '') + '" aria-pressed="' + (app.settings.theme === 'dark' ? 'true' : 'false') + '" data-action="set-theme" data-val="dark">Dark</button>' +
      '</div></div>' +
      '<div class="field"><span class="field-label">Units</span><div style="flex:1"></div>' +
      '<div class="segmented" style="width:180px">' +
      '<button type="button" class="seg-opt' + (app.settings.units === 'metric' ? ' on' : '') + '" aria-pressed="' + (app.settings.units === 'metric' ? 'true' : 'false') + '" data-action="set-units" data-val="metric">Metric</button>' +
      '<button type="button" class="seg-opt' + (app.settings.units === 'imperial' ? ' on' : '') + '" aria-pressed="' + (app.settings.units === 'imperial' ? 'true' : 'false') + '" data-action="set-units" data-val="imperial">Imperial</button>' +
      '</div></div></div>' +
      '<div class="group-footer">Auto follows your phone’s light or dark setting.</div></div>';

    body += '<div class="group"><div class="list">' +
      '<a class="cell tap" href="#/privacy"><span class="cell-emoji">\u{1F512}</span><span class="cell-body"><span class="cell-title">Privacy</span><span class="cell-sub">Your data is private, on this device</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div></div>';

    body += '<div class="group"><div class="group-header">About</div><div class="list">' +
      '<div class="info-row"><div class="info-v">Ontario Wildlife Log is a simple, private field journal for the mammals, birds, reptiles, amphibians, fish, trees, plants, insects and fungi of Ontario.</div></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Species in guide</span></span><span class="cell-value">' + SPECIES.length + '</span></div>' +
      '<button class="cell tap" data-action="version-tap"><span class="cell-body"><span class="cell-title">Version</span></span><span class="cell-value">2.0</span></button>' +
      '<a class="cell tap" href="https://katsuma0.github.io" target="_blank" rel="noopener noreferrer">' +
      '<span class="cell-emoji">\u{1F464}</span><span class="cell-body"><span class="cell-title">Made by Katsuma Onishi</span>' +
      '<span class="cell-sub">katsuma0.github.io</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      '</div></div>';
    screen({ title: 'More', large: true, body: body });
  }
  function moreCell(emoji, title, sub, action, data) {
    var attrs = 'data-action="' + action + '"';
    if (data) { if (data.cat) attrs += ' data-cat="' + data.cat + '"'; if (data.sub) attrs += ' data-sub="' + data.sub + '"'; }
    return '<button class="cell tap" ' + attrs + '>' +
      '<span class="cell-emoji">' + emoji + '</span>' +
      '<span class="cell-body"><span class="cell-title">' + esc(title) + '</span>' +
      '<span class="cell-sub">' + esc(sub) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></button>';
  }

  /* =============================================================== MAP */
  function viewMap() {
    var body =
      '<div class="chip-row map-chiprow" id="map-chips">' + mapChips() + '</div>' +
      '<div class="map-wrap"><div id="map"></div>' +
        '<div class="map-hint" id="map-hint" role="status" aria-live="polite"></div>' +
        '<div class="map-note" id="map-offline" role="status" aria-live="polite" hidden>Map tiles need a connection. Your pins still show.</div>' +
        '<div class="map-fabs">' +
          '<button class="fab fab-locate" data-action="map-locate" aria-label="My location">' + I.crosshair + '</button>' +
          '<button class="fab fab-hazard" data-action="report-hazard" aria-label="Report hazard">⚠️</button>' +
          '<button class="fab fab-bear" data-action="report-bear" aria-label="Report bear">\u{1F43B}</button>' +
        '</div>' +
      '</div>';
    screen({ title: 'Map', body: body, bare: true });
    initMap();
  }
  function mapChips() {
    var f = app.mapFilter;
    function c(id, label) { return '<button class="chip' + (f === id ? ' on' : '') + '" aria-pressed="' + (f === id ? 'true' : 'false') + '" data-action="map-filter" data-f="' + id + '">' + label + '</button>'; }
    return c('all', 'All') + c('wildlife', '\u{1F43E} Wildlife') + c('bear', '\u{1F43B} Bears') + c('hazard', '⚠️ Hazards');
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
    if (!window.L) { el.innerHTML = '<div class="map-msg">Map couldn’t load.</div>'; return; }
    if (app.map) { try { app.map.remove(); } catch (e) {} app.map = null; }
    var map = L.map(el, { zoomControl: true, attributionControl: true }).setView([50.0, -85.0], 5);
    app.map = map;
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
    });
    // Degrade gracefully offline: show a note instead of a blank grey grid.
    tiles.on('tileerror', function () { var n = $('#map-offline'); if (n) n.hidden = false; });
    tiles.on('load', function () { var n = $('#map-offline'); if (n) n.hidden = true; });
    tiles.addTo(map);
    renderMapMarkers();
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
    if (app._layer) { try { app.map.removeLayer(app._layer); } catch (e) {} }
    var group = L.layerGroup();
    locatedRecords().filter(function (r) { return app.mapFilter === 'all' || r.kind === app.mapFilter; }).forEach(function (r) {
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
  function updateMapHint() {
    var el = document.getElementById('map-hint'); if (!el) return;
    if (app.placeMode) {
      el.innerHTML = (app.placeMode === 'bear' ? '🐻 Tap the map where you saw the bear' : '⚠️ Tap the map to place the hazard') +
        ' <button type="button" class="hint-btn" data-action="place-center">or place at map centre</button>';
      el.classList.add('show');
    } else if (!locatedRecords().length) {
      el.innerHTML = 'No mapped reports yet. Tap 🐻 or ⚠️, then tap the map. Sightings you log with a location show up here too.';
      el.classList.add('show');
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
  // Modal accessibility: label the dialog, move focus in, make the rest of the
  // page inert (also traps Tab where supported), and restore focus on close.
  function afterSheetOpen() {
    var s = $('#sheet'); if (!s) return;
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
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">Cancel</button><span class="t">' + esc(title) + '</span>' +
      '<button class="nav-btn bold" data-action="' + saveAction + '">Save</button></div>' +
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
    if (!earned.emblems) body += '<div class="group-footer hpad" style="text-align:center">✨ There’s a secret badge to discover…</div>';
    screen({ title: 'Badges', backAction: true, backText: 'Back', body: body });
  }

  /* ================================================================= STATS */
  function viewStats() {
    var c = badgeCtx();
    if (!c.total) {
      screen({ title: 'Stats', large: true, subtitle: 'Your field record',
        body: '<div class="empty"><div class="e">\u{1F4CA}</div><h3>No stats yet</h3><p>Log a few encounters and your totals, badges and community comparison will appear here.</p><div class="spacer"></div><div class="hpad"><a class="btn btn-tinted" href="#/log">Start logging</a></div></div>' });
      return;
    }
    var earned = earnedBadgeIds().length;
    var body = '<div class="stat-grid" style="margin-top:4px">' +
      stat(c.total, 'Encounters') + stat(c.species, 'Species') + stat(c.catsN, 'Categories') + '</div>';
    // Honest personal progress: how much of the Ontario guide you've recorded
    var perCat = {}; app.entries.forEach(function (e) { if (e.speciesId) (perCat[e.cat] = perCat[e.cat] || {})[e.speciesId] = 1; });
    body += '<div class="group"><div class="group-header">Guide completion</div><div class="list" style="padding:8px 0">';
    body += progressRow('\u{1F30E} All species', c.species, SPECIES.length);
    CATEGORIES.forEach(function (cm) {
      var got = perCat[cm.id] ? Object.keys(perCat[cm.id]).length : 0;
      if (got) body += progressRow(cm.emoji + ' ' + cm.name, got, speciesInCat(cm.id).length, cm.color);
    });
    body += '</div><div class="group-footer">You’ve recorded ' + c.species + ' of Ontario’s ' + SPECIES.length + ' guide species. A live community comparison arrives with the shared layer.</div></div>';
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
    body += '<p class="article-intro">Your log, including sightings, photos, locations and notes, is stored <b>only on this device</b>. There are no accounts, ads or trackers, and <b>nothing you log is uploaded</b> unless you turn on Community sharing. Two optional features reach the internet, and only when you turn them on: connecting to a Community server, and loading reference photos. One more thing to know. The <b>Map</b> loads its background tiles from <b>OpenStreetMap</b>, so opening the Map tab sends the area you are viewing, and your device IP, to that map service. It never sends your saved sightings.</p>';
    body += '<div class="group"><div class="group-header">On this device</div><div class="list">' +
      infoRow2('\u{1F4F1}', 'Stored locally', 'Your journal lives in this app’s private storage on your phone.') +
      infoRow2('\u{1F6AB}', 'No accounts or trackers', 'No sign-in, no ads, no analytics.') +
      infoRow2('\u{1F4E4}', 'You’re in control', 'Export your whole log to a file, or delete everything, anytime.') +
      '</div></div>';
    body += '<div class="group"><div class="group-header">Reference photos</div><div class="list">' +
      '<div class="field"><span class="field-label" style="flex:1">Load species photos</span>' +
      '<label class="switch"><input type="checkbox" id="photos-toggle" aria-label="Load species reference photos from iNaturalist"' + (app.settings.photos ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>' +
      '</div><div class="group-footer">Off by default. When on, species pages fetch one openly-licensed (Creative Commons) photo from <b>iNaturalist</b>, which means your device contacts iNaturalist. Off keeps everything to the built-in illustrations.</div></div>';
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
        if (events.length) {
          h += '<div class="group"><div class="group-header">Recent bear & hazard activity nearby</div><div class="list">';
          events.slice(0, 10).forEach(function (v) { h += '<div class="cell"><span class="cell-body"><span class="cell-title" style="font-size:15px">' + esc(v.e) + '</span><span class="cell-sub">' + esc(v.when ? fmtDay(v.when) : '') + '</span></span></div>'; });
          h += '</div><div class="group-footer">Locations are approximate (coarsened for privacy). These are community reports, not official alerts.</div></div>';
        }
        if (!(d.topSpecies && d.topSpecies.length) && !events.length) h += '<div class="empty"><div class="e">\u{1F331}</div><h3>Quiet so far</h3><p>Be the first to log something near you this week.</p></div>';
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
    if (app.settings.seenPrivacy) return;
    var html = '<div class="scrim show" data-action="accept-privacy"></div>' +
      '<div class="sheet show" id="sheet" style="max-height:none">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-body" style="padding:8px 20px calc(24px + var(--sa-bottom))">' +
      '<div style="text-align:center;font-size:44px;margin:8px 0">\u{1F43E}</div>' +
      '<h2 style="text-align:center;margin:0 0 6px;font-size:22px">Welcome to Wildlife Log</h2>' +
      '<p style="text-align:center;color:var(--label-2);font-size:15px;line-height:1.45;margin:0 0 16px">Log the wildlife, fish and plants you find across Ontario. <b>Your sightings stay private on your device.</b> Nothing you log is uploaded unless you choose to turn on sharing.</p>' +
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
        '<span class="cell-value" style="color:var(--tint)">Change</span></button>';
    } else if (d.customName) {
      speciesRow = '<button class="cell tap" data-action="pick-species">' +
        '<span class="cell-emoji">❓</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title">' + esc(d.customName) + '</span>' +
        '<span class="cell-sub">Not in the guide</span></span>' +
        '<span class="cell-value" style="color:var(--tint)">Change</span></button>';
    } else {
      speciesRow = '<button class="cell tap" data-action="pick-species">' +
        '<span class="cell-emoji">\u{1F50D}</span>' +
        '<span class="cell-body" style="text-align:left"><span class="cell-title" style="color:var(--tint)">Choose a species</span>' +
        '<span class="cell-sub">Search the guide or add your own</span></span>' +
        '<span class="chevron">' + I.chevron + '</span></button>';
    }

    // Evidence options
    var evOpts = isFish
      ? [['caught', 'Caught'], ['saw', 'Seen']]
      : [['saw', 'Saw'], ['heard', 'Heard'], ['tracks', 'Signs']];
    var evHtml = '<div class="segmented">';
    evOpts.forEach(function (o) {
      evHtml += '<button type="button" class="seg-opt' + (d.evidence === o[0] ? ' on' : '') + '" aria-pressed="' + (d.evidence === o[0] ? 'true' : 'false') + '" data-action="set-evidence" data-val="' + o[0] + '">' + o[1] + '</button>';
    });
    evHtml += '</div>';

    var body = '';
    // What
    body += '<div class="group" style="margin-top:6px"><div class="group-header">What did you see?</div><div class="list">' +
      speciesRow + '</div></div>';

    // Details
    body += '<div class="group"><div class="group-header">Details</div><div class="list">';
    body += '<div class="field"><span class="field-label">Observation</span><div style="flex:1"></div>' +
      '<div style="width:' + (isFish ? '150' : '210') + 'px">' + evHtml + '</div></div>';
    body += '<div class="field"><span class="field-label">How many</span><div style="flex:1"></div>' +
      '<div class="stepper"><button data-action="count" data-d="-1">−</button><div class="sep"></div>' +
      '<div class="val" id="count-val">' + d.count + '</div>' +
      '<div class="sep"></div><button data-action="count" data-d="1">+</button></div></div>';
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
    body += '<textarea class="notes" id="f-notes" aria-label="Notes" placeholder="Notes. Where exactly, what it was doing, the weather…"></textarea>';
    body += '</div></div>';

    // Save
    var canSave = !!(d.speciesId || d.customName);
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-entry"' +
      (canSave ? '' : ' disabled') + '>Save Encounter</button></div>';

    var sheetHtml = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">Cancel</button>' +
      '<span class="t">' + (d._editId ? 'Edit Encounter' : 'Log Encounter') + '</span>' +
      '<button class="nav-btn bold" data-action="save-entry"' + (canSave ? '' : ' disabled') + '>Save</button></div>' +
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
        '<button class="btn btn-danger btn-block" style="height:40px;margin-top:10px" data-action="remove-photo">Remove photo</button></div>';
    }
    return '<button class="cell tap" data-action="take-photo">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.camera + '</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title" style="color:var(--tint)">Add a photo</span>' +
      '<span class="cell-sub">Take one or choose from your library</span></span></button>' +
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
    setTimeout(function () { $('#sheet-root').innerHTML = ''; }, 320);
  }

  /* ---- Species picker (nested sheet) ---- */
  function openPicker() {
    var d = app.draft;
    var startCat = d.cat || 'all';
    var html = '<div class="scrim show" data-action="close-picker"></div>' +
      '<div class="sheet show" id="picker" role="dialog" aria-modal="true" aria-label="Choose Species" style="height:88vh">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-picker">Back</button>' +
      '<span class="t">Choose Species</span><span style="width:44px"></span></div>' +
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
    if (!d.speciesId && !d.customName) { toast('Choose a species first'); return; }
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
      toast((editing ? '✓ Updated ' : '✓ Logged ') + entry.speciesName);
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
    var e = null;
    for (var i = 0; i < app.entries.length; i++) if (app.entries[i].id === id) { e = app.entries[i]; break; }
    if (!e) return;
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
    if (e.bird && e.bird.behavior) rows += info('Behaviour', e.bird.behavior);
    if (e.notes) rows += info('Notes', e.notes);

    var body = '<div class="hero" style="padding-top:16px">' +
      '<div class="hero-emoji" style="width:76px;height:76px;font-size:44px;background:' + tintFor(e.cat) + '22">' + (e.emoji || '\u{1F43E}') + '</div>' +
      '<h1>' + esc(e.speciesName) + '</h1>' +
      (sp ? '<div class="sci">' + esc(sp.sci) + '</div>' : '') + '</div>';
    if (e.photo) body += '<div class="hpad"><img class="entry-photo" src="' + e.photo + '" alt="Photo of your ' + esc(e.speciesName) + ' sighting"></div>';
    body += '<div class="group"><div class="list">' + rows + '</div></div>';
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="share-entry" data-id="' + esc(e.id) + '">' + I.share + 'Share this sighting</button></div><div class="spacer"></div>';
    body += '<div class="hpad"><button class="btn btn-tinted btn-block" data-action="edit-entry" data-id="' + esc(e.id) + '">Edit encounter</button></div><div class="spacer"></div>';
    if (sp) body += '<div class="hpad"><a class="btn btn-tinted btn-block" href="#/species/' + esc(sp.id) + '" data-action="close-sheet-nav">View in field guide</a></div><div class="spacer"></div>';
    body += '<div class="hpad"><button class="btn btn-danger btn-block" data-action="delete-entry" data-id="' + esc(e.id) + '">Delete this encounter</button></div>';

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
    if (!e) return;
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
  function wrapText(g, text, x, y, maxW, lh) {
    var words = String(text).split(' '), line = '', lines = [];
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    var startY = y - (lines.length - 1) * lh / 2;
    lines.forEach(function (l, i) { g.fillText(l, x, startY + i * lh); });
  }
  function shareEntry(id) {
    var e = null; for (var i = 0; i < app.entries.length; i++) if (app.entries[i].id === id) { e = app.entries[i]; break; }
    if (!e) return;
    var sp = e.speciesId ? byId[e.speciesId] : null;
    var W = 1080, H = 1080, canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H; var g = canvas.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, '#2f8f5b'); grad.addColorStop(1, '#0e6b3d');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '340px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
    try { g.fillText(e.emoji || '\u{1F43E}', W / 2, 360); } catch (er) {}
    g.fillStyle = '#fff'; g.font = '700 84px -apple-system,system-ui,sans-serif';
    wrapText(g, e.speciesName, W / 2, 636, W - 160, 92);
    if (sp) { g.fillStyle = 'rgba(255,255,255,.85)'; g.font = 'italic 40px -apple-system,system-ui,serif'; g.fillText(sp.sci, W / 2, 762); }
    g.fillStyle = 'rgba(255,255,255,.92)'; g.font = '40px -apple-system,system-ui,sans-serif';
    var loc = e.lat != null ? (e.sensitiveLoc ? 'Location protected' : (e.lat.toFixed(2) + ', ' + e.lng.toFixed(2))) : '';
    g.fillText(fmtDay(e.when) + (loc ? '  ·  ' + loc : ''), W / 2, 842);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '600 38px -apple-system,system-ui,sans-serif';
    g.fillText('\u{1F43E}  Ontario Wildlife Log', W / 2, 992);
    canvas.toBlob(function (blob) {
      if (!blob) { toast('Could not create image'); return; }
      var file = null;
      try { file = new File([blob], 'sighting.png', { type: 'image/png' }); } catch (er) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: e.speciesName, text: 'I spotted a ' + e.speciesName + ' in Ontario! \u{1F43E}' }).catch(function () {});
      } else {
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'wildlife-sighting.png'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        toast('Saved sighting image');
      }
    }, 'image/png');
  }
  function deleteEntry(id) {
    app.entries = app.entries.filter(function (e) { return e.id !== id; });
    Store.del(id);
    closeSheet();
    toast('Encounter deleted');
    setTimeout(route, 120);
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

  /* ---------------------------------------------------------- Tab bar */
  function renderTabs() {
    var base = currentTab();
    var tabs = [
      ['log', '#/log', 'Home', I.log],
      ['explore', '#/explore', 'Guide', I.explore],
      ['map', '#/map', 'Map', I.map],
      ['mylog', '#/mylog', 'Journal', I.mylog],
      ['more', '#/more', 'More', I.more]
    ];
    var html = '';
    tabs.forEach(function (t) {
      var on = base === t[0];
      html += '<a class="tab' + (on ? ' active' : '') + '" href="' + t[1] + '"' + (on ? ' aria-current="page"' : '') + '>' + t[3] + '<span>' + t[2] + '</span></a>';
    });
    $('#tabbar').innerHTML = html;
  }
  function currentTab() {
    var h = location.hash.replace(/^#\//, '');
    if (h.indexOf('explore') === 0 || h.indexOf('species') === 0) return 'explore';
    if (h.indexOf('map') === 0) return 'map';
    if (h.indexOf('mylog') === 0 || h.indexOf('badges') === 0 || h.indexOf('stats') === 0) return 'mylog';
    if (h.indexOf('more') === 0 || h.indexOf('learn') === 0 || h.indexOf('resources') === 0 ||
        h.indexOf('trust') === 0 || h.indexOf('invasives') === 0 || h.indexOf('privacy') === 0 || h.indexOf('community') === 0) return 'more';
    return 'log';
  }

  /* ------------------------------------------------------------ Router */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var r = parts[0] || 'log';
    // Tear down the Leaflet map when navigating away from the Map screen
    if (r !== 'map' && app.map) { try { app.map.remove(); } catch (e) {} app.map = null; app.placeMode = null; }
    if (r === 'log') viewLog();
    else if (r === 'explore') {
      if (parts[1] && parts[2]) viewSub(parts[1], parts[2]);
      else if (parts[1]) viewCategory(parts[1]);
      else viewExplore();
    }
    else if (r === 'atrisk') viewAtRisk();
    else if (r === 'species') viewSpecies(parts[1]);
    else if (r === 'map') viewMap();
    else if (r === 'mylog') viewMyLog();
    else if (r === 'alerts') viewAlerts();
    else if (r === 'community') viewCommunity();
    else if (r === 'invasives') viewInvasives();
    else if (r === 'badges') viewBadges();
    else if (r === 'stats') viewStats();
    else if (r === 'privacy') viewPrivacy();
    else if (r === 'trust') { if (parts[1]) viewTrustAccount(parts[1]); else viewTrust(); }
    else if (r === 'learn') viewLearn(parts[1]);
    else if (r === 'resources') viewResources();
    else if (r === 'more') viewMore();
    else viewLog();
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

  // iOS-style swipe from the left edge to go back. Mirrors the nav back button and
  // rides the same push/pop animation. Ignored when a sheet or picker is open.
  (function edgeSwipeBack() {
    var sx = 0, sy = 0, t0 = 0, active = false;
    function backTarget() {
      var a = document.querySelector('#nav .nav-left a.nav-btn[href]');
      if (a) return { href: a.getAttribute('href') };
      if (document.querySelector('#nav .nav-left button[data-action="nav-back"]')) return { back: true };
      return null;
    }
    document.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1 || $('#sheet') || $('#picker-root') || $('#app').classList.contains('nav-animating')) { active = false; return; }
      var t = e.touches[0];
      if (t.clientX <= 26) { active = true; sx = t.clientX; sy = t.clientY; t0 = Date.now(); } else active = false;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (!active) return; active = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = Math.abs(t.clientY - sy), dt = Date.now() - t0;
      if (dx > 55 && dx > dy * 1.6 && dt < 700) {
        var bt = backTarget(); if (!bt) return;
        if (bt.href) location.hash = bt.href.replace(/^#/, ''); else history.back();
      }
    }, { passive: true });
  })();

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
      case 'map-filter':
        ev.preventDefault();
        app.mapFilter = t.getAttribute('data-f');
        { var mc = $('#map-chips'); if (mc) mc.innerHTML = mapChips(); }
        renderMapMarkers();
        break;
      case 'map-locate': ev.preventDefault(); mapLocate(false); break;
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
        if (confirm('Delete this encounter? This cannot be undone.')) deleteEntry(t.getAttribute('data-id'));
        break;
      case 'export-data': ev.preventDefault(); exportData(); break;
      case 'set-units': ev.preventDefault(); app.settings.units = t.getAttribute('data-val'); saveSettings(); viewMore(); break;
      case 'home-mode': ev.preventDefault(); app.settings.homeMode = t.getAttribute('data-m'); saveSettings(); viewLog(); break;
      case 'set-theme': ev.preventDefault(); app.settings.theme = t.getAttribute('data-val'); saveSettings(); applyTheme(); viewMore(); break;
      case 'accept-privacy': ev.preventDefault(); app.settings.seenPrivacy = true; saveSettings(); closeSheet(); break;
      case 'open-privacy-first': ev.preventDefault(); app.settings.seenPrivacy = true; saveSettings(); closeSheet(); setTimeout(function () { location.hash = '#/privacy'; }, 320); break;
      case 'version-tap': ev.preventDefault(); versionTap(); break;
      case 'dismiss-install': ev.preventDefault(); app.settings.seenInstall = true; saveSettings(); viewLog(); break;
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
    else if (ev.target.id === 'photos-toggle') {
      app.settings.photos = !!ev.target.checked; saveSettings();
      toast(ev.target.checked ? 'Reference photos on (fetched from iNaturalist)' : 'Reference photos off');
    }
    else if (ev.target.id === 'community-share') {
      app.settings.community = !!ev.target.checked; saveSettings();
      toast(ev.target.checked ? 'Sharing your sightings. Thanks.' : 'Sharing turned off');
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
  window.addEventListener('hashchange', route);
  function boot() {
    loadSettings();
    applyTheme();
    Store.load().then(function (entries) {
      app.entries = entries || [];
      return Store.loadHazards();
    }).then(function (hazards) {
      app.hazards = hazards || [];
      app.ready = true;
      initBadges();
      if (!location.hash) location.hash = '#/log';
      route();
      maybePrivacyBanner();
    });
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').catch(function () {});
      });
    }
  }
  boot();
})();
