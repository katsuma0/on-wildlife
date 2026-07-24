/* =========================================================================
   Ontario Wildlife Log — application logic
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
    crosshair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>'
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

  var app = { entries: [], hazards: [], settings: { units: 'metric' }, draft: null, hdraft: null, ready: false, map: null, mapFilter: 'all', placeMode: null };

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
      } catch (e) {}
    },
    put: function (v, store) {
      store = store || 'entries';
      if (Store.useIDB) { try { Store.tx('readwrite', store).put(v); } catch (e) { Store._ls(store); } }
      else Store._ls(store);
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
    try { var s = JSON.parse(localStorage.getItem('owl-settings') || '{}'); if (s && s.units) app.settings = s; }
    catch (e) {}
  }
  function saveSettings() { try { localStorage.setItem('owl-settings', JSON.stringify(app.settings)); } catch (e) {} }

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
  function screen(cfg) {
    var navLeft = cfg.back
      ? '<div class="nav-left"><a class="nav-btn bold" href="' + esc(cfg.back) + '">' + I.back + esc(cfg.backText || 'Back') + '</a></div>'
      : cfg.backAction
        ? '<div class="nav-left"><button class="nav-btn bold" data-action="nav-back">' + I.back + esc(cfg.backText || 'Back') + '</button></div>'
        : (cfg.navLeft ? '<div class="nav-left">' + cfg.navLeft + '</div>' : '');
    var navRight = cfg.navRight ? '<div class="nav-right">' + cfg.navRight + '</div>' : '';
    var nav = '<div class="nav' + (cfg.large ? ' has-large' : '') + '" id="nav">' +
      '<div class="nav-row">' + navLeft +
      '<div class="nav-title">' + esc(cfg.title || '') + '</div>' + navRight +
      '</div></div>';
    var large = cfg.large
      ? '<div class="large-title"><h1>' + esc(cfg.title) + '</h1>' +
        (cfg.subtitle ? '<div class="subtitle">' + esc(cfg.subtitle) + '</div>' : '') + '</div>'
      : '';
    var tail = cfg.bare ? '' : '<div class="spacer-lg"></div>';
    $('#app').innerHTML = '<div class="screen">' + nav + large + cfg.body + tail + '</div>';
    window.scrollTo(0, 0);
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
    var recent = app.entries.slice().sort(function (a, b) { return new Date(b.when) - new Date(a.when); }).slice(0, 6);
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var uniq = {}; app.entries.forEach(function (e) { if (e.speciesId) uniq[e.speciesId] = 1; });

    var body = '';
    // Primary action
    body += '<div class="hpad" style="margin-top:6px">' +
      '<button class="btn btn-primary btn-block" data-action="open-log">' + I.plus + 'Log an Encounter</button></div>';
    // Quick modes
    body += '<div class="chip-row" style="margin-top:14px">' +
      '<button class="chip chip-alert" data-action="report-bear">\u{1F43B} Report a Bear</button>' +
      '<button class="chip chip-warn" data-action="report-hazard">⚠️ Report a Hazard</button>' +
      '<button class="chip" data-action="open-log" data-cat="fish">\u{1F3A3} Log a Fish</button>' +
      '<button class="chip" data-action="open-log" data-cat="birds">\u{1F985} Log a Bird</button>' +
      '<button class="chip" data-action="open-log" data-cat="reptiles" data-sub="turtles">\u{1F422} Log a Turtle</button>' +
      '</div>';

    // Safety & alerts
    body += '<div class="group"><div class="group-header">Safety & Alerts</div><div class="list">' +
      '<a class="cell tap" href="#/alerts"><span class="cell-emoji">⚠️</span><span class="cell-body"><span class="cell-title">Safety & Alerts</span><span class="cell-sub">Dangers to know · your bear & hazard reports</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'What to look for and what to do', 'ticks') +
      learnCell('\u{1F43B}', 'Bear safety', 'Prevent encounters · Bear Wise', 'bears') +
      learnCell('☠️', 'Dangerous plants', 'Poison ivy, giant hogweed & more', 'plants') +
      '</div></div>';

    if (app.entries.length) {
      body += '<div class="stat-grid" style="margin-top:8px">' +
        stat(app.entries.length, app.entries.length === 1 ? 'Encounter' : 'Encounters') +
        stat(Object.keys(uniq).length, 'Species') +
        stat(catsSeen(), 'Categories') + '</div>';
      body += '<div class="group"><div class="group-header">Recent</div><div class="list">';
      recent.forEach(function (e) { body += entryCell(e); });
      body += '</div>' +
        '<div class="group-footer"><a href="#/mylog">See all encounters ›</a></div></div>';
    } else {
      body += '<div class="empty"><div class="e">\u{1F343}</div><h3>Start your field journal</h3>' +
        '<p>Tap <b>Log an Encounter</b> to record the first animal you spot, hear, or catch. ' +
        'Everything is saved right on your phone.</p></div>';
    }

    screen({ title: greet, large: true, subtitle: 'What did you spot today?', body: body });
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
    return '<div class="cell tap" data-action="open-entry" data-id="' + esc(e.id) + '">' +
      thumb +
      '<span class="cell-body"><span class="cell-title">' + esc(e.speciesName) + '</span>' +
      '<span class="cell-sub">' + esc(sub) + '</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></div>';
  }

  /* ----------------------------------------------------------- Explore */
  function viewExplore() {
    var body = '';
    body += '<div class="searchbar">' + I.search +
      '<input type="search" id="explore-search" placeholder="Search species" autocomplete="off" autocorrect="off" autocapitalize="none">' +
      '</div>';
    body += '<div id="search-results"></div>';
    body += '<div id="explore-cats">';
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
    body += '<div class="group-header hpad" style="margin-top:18px">Coming Soon</div>';
    body += '<div class="card-grid">';
    COMING_SOON.forEach(function (c) {
      body += '<div class="cat-card soon">' +
        '<div class="ce">' + c.emoji + '</div>' +
        '<div><div class="cn">' + esc(c.name) + '</div>' +
        '<div class="cc">In a future update</div></div></div>';
    });
    body += '</div></div>';

    screen({ title: 'Explore', large: true, subtitle: 'A field guide to Ontario', body: body });
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
    screen({ title: c.name, back: '#/explore', backText: 'Explore', body: body });
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
      '<div class="hero-emoji" style="background:' + tintFor(s.cat) + '22">' + s.emoji + '</div>' +
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

    // Learn more — external, reputable sources (photos, range, conservation)
    body += '<div class="group"><div class="group-header">Learn more</div><div class="list">' +
      speciesLinks(s) +
      '</div><div class="group-footer">Opens external sites in your browser.</div></div>';

    var backHref = (c && sub) ? '#/explore/' + s.cat + '/' + s.sub : '#/explore';
    screen({ title: s.name, back: backHref, backText: sub ? sub.name : (c ? c.name : 'Back'), body: body });
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
        title: 'My Log', large: true,
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
      title: 'My Log', large: true, subtitle: sorted.length + ' encounters logged',
      navRight: '<button class="nav-btn" data-action="open-log" aria-label="Add">' + I.plus + '</button>',
      body: body
    });
  }

  /* -------------------------------------------------------------- More */
  function viewMore() {
    var body = '';
    body += '<div class="group"><div class="group-header">Ways to Log</div><div class="list">' +
      moreCell('\u{1F3A3}', 'Fishing', 'Log fish caught or seen', 'open-log', { cat: 'fish' }) +
      moreCell('\u{1F985}', 'Birding', 'Track the birds you spot', 'open-log', { cat: 'birds' }) +
      moreCell('\u{1F422}', 'Turtles', 'Ontario turtles are Species at Risk', 'open-log', { cat: 'reptiles', sub: 'turtles' }) +
      moreCell('\u{1F43B}', 'Report a bear', 'For your map & Bear Wise info', 'report-bear') +
      moreCell('⚠️', 'Report a hazard', 'Wildlife on road, construction, ticks…', 'report-hazard') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Learn & Safety</div><div class="list">' +
      '<a class="cell tap" href="#/alerts"><span class="cell-emoji">⚠️</span><span class="cell-body"><span class="cell-title">Safety & Alerts</span><span class="cell-sub">Dangers to know · your bear & hazard reports</span></span><span class="chevron">' + I.chevron + '</span></a>' +
      learnCell('\u{1F577}️', 'Ticks & Lyme disease', 'Identify, prevent, remove & when to see a doctor', 'ticks') +
      learnCell('\u{1F43B}', 'Bear safety (Bear Wise)', 'Prevent encounters and how to report a bear', 'bears') +
      learnCell('☠️', 'Dangerous plants', 'Poison ivy, wild parsnip, giant hogweed', 'plants') +
      learnCell('\u{1F6E3}️', 'Wildlife on roads', 'Deer, moose, turtles & road hazards', 'roads') +
      learnCell('\u{1F30D}', 'Help Ontario’s wildlife', 'How your sightings support conservation', 'contribute') +
      '</div></div>';

    body += '<div class="group"><div class="group-header">Resources & Data</div><div class="list">' +
      '<a class="cell tap" href="#/resources"><span class="cell-emoji">\u{1F517}</span>' +
      '<span class="cell-body"><span class="cell-title">Ontario & Canada resources</span>' +
      '<span class="cell-sub">Trusted sites for wildlife, fishing & safety</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a>' +
      '<a class="cell tap" href="#/trust"><span class="cell-emoji">\u{1F9EA}</span>' +
      '<span class="cell-body"><span class="cell-title">Data reliability</span>' +
      '<span class="cell-sub">Anomaly detection on contributor data (demo)</span></span>' +
      '<span class="chevron">' + I.chevron + '</span></a></div></div>';
    body += '<div class="group"><div class="group-header">Your Data</div><div class="list">' +
      moreCell('\u{1F4E4}', 'Export encounters', 'Download your log as a file', 'javascript:void 0', 'export-data') +
      '</div>' +
      '<div class="group-footer">Everything you log is stored privately on this device only.</div></div>';
    body += '<div class="group"><div class="group-header">Units</div><div class="list">' +
      '<div class="field"><span class="field-label">Measurement</span>' +
      '<div style="flex:1"></div>' +
      '<div class="segmented" style="width:180px">' +
      '<div class="seg-opt' + (app.settings.units === 'metric' ? ' on' : '') + '" data-action="set-units" data-val="metric">Metric</div>' +
      '<div class="seg-opt' + (app.settings.units === 'imperial' ? ' on' : '') + '" data-action="set-units" data-val="imperial">Imperial</div>' +
      '</div></div></div></div>';
    body += '<div class="group"><div class="group-header">About</div><div class="list">' +
      '<div class="info-row"><div class="info-v">Ontario Wildlife Log is a simple field journal for recording the animals, fish and birds you encounter across Ontario. Plants, trees, insects and fungi are coming in future updates.</div></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Species in guide</span></span><span class="cell-value">' + SPECIES.length + '</span></div>' +
      '<div class="cell"><span class="cell-body"><span class="cell-title">Version</span></span><span class="cell-value">1.0</span></div>' +
      '</div></div>';
    body += '<div class="group"><div class="list">' +
      '<button class="cell tap" data-action="clear-data" style="justify-content:center"><span class="btn-danger" style="background:none;color:var(--red);font-weight:500">Clear all logged data</span></button>' +
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
        '<div class="map-hint" id="map-hint"></div>' +
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
    function c(id, label) { return '<button class="chip' + (f === id ? ' on' : '') + '" data-action="map-filter" data-f="' + id + '">' + label + '</button>'; }
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    renderMapMarkers();
    var located = locatedRecords();
    if (located.length) {
      try { map.fitBounds(L.latLngBounds(located.map(function (r) { return [r.lat, r.lng]; })).pad(0.35), { maxZoom: 13 }); } catch (e) {}
    } else { mapLocate(true); }
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
      el.textContent = app.placeMode === 'bear' ? '🐻 Tap the map where you saw the bear' : '⚠️ Tap the map to place the hazard';
      el.classList.add('show');
    } else if (!locatedRecords().length) {
      el.innerHTML = 'No mapped reports yet — tap 🐻 or ⚠️, then tap the map. Sightings you log with a location show up here too.';
      el.classList.add('show');
    } else { el.classList.remove('show'); el.textContent = ''; }
  }
  function mapLocate(silent) {
    if (!app.map || !navigator.geolocation) { if (!silent) toast('Location not available'); return; }
    navigator.geolocation.getCurrentPosition(function (p) {
      if (app.map) app.map.setView([p.coords.latitude, p.coords.longitude], 12);
    }, function () { if (!silent) toast('Location permission denied'); }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 });
  }

  /* ===================================================== BEAR & HAZARD REPORTS */
  function segHtml(action, current, opts) {
    var h = '<div class="segmented">';
    opts.forEach(function (o) { h += '<div class="seg-opt' + (current === o[0] ? ' on' : '') + '" data-action="' + action + '" data-v="' + o[0] + '">' + esc(o[1]) + '</div>'; });
    return h + '</div>';
  }
  function locCell(action, lat, lng) {
    var has = lat != null;
    return '<button class="cell tap" data-action="' + action + '">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.pin + '</span>' +
      '<span class="cell-body"><span class="cell-title" style="color:var(--tint)">' + (has ? 'Location set' : 'Use my location') + '</span>' +
      '<span class="cell-sub">' + (has ? (lat.toFixed(4) + ', ' + lng.toFixed(4)) : 'Tap to capture GPS, or drop a pin on the map') + '</span></span></button>';
  }
  function mountSheet(title, body, saveAction) {
    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">Cancel</button><span class="t">' + esc(title) + '</span>' +
      '<button class="nav-btn bold" data-action="' + saveAction + '">Save</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { var s = $('#sheet'); if (s) s.classList.add('show'); var sc = $('.scrim'); if (sc) sc.classList.add('show'); });
  }
  function reportLocate(which) {
    if (!navigator.geolocation) { toast('Location not available'); return; }
    var d = which === 'bear' ? app.bdraft : app.hdraft; if (!d) return;
    toast('Locating…');
    navigator.geolocation.getCurrentPosition(function (p) {
      d.lat = p.coords.latitude; d.lng = p.coords.longitude; haptic();
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
    body += '<div class="wrap-note danger" style="margin:8px 16px"><span class="i">🐻</span><span><b>Bear Wise:</b> call <b>911</b> if a bear is an immediate threat. For non-emergency problems call <b>1-866-514-2327</b> (Apr–Nov). <a href="#/learn/bears" data-action="close-sheet-nav">Bear safety ›</a></span></div>';
    body += '<div class="group" style="margin-top:6px"><div class="group-header">The bear</div><div class="list">';
    body += '<div class="field"><span class="field-label">Type</span><div style="flex:1"></div><div style="width:220px">' + segHtml('bear-species', d.species, [['american-black-bear', 'Black bear'], ['polar-bear', 'Polar bear']]) + '</div></div>';
    body += '<div class="field"><span class="field-label">How many</span><div style="flex:1"></div><div class="stepper"><button data-action="bcount" data-d="-1">−</button><div class="sep"></div><div id="bcount-val" style="min-width:44px;text-align:center;line-height:30px">' + d.count + '</div><div class="sep"></div><button data-action="bcount" data-d="1">+</button></div></div>';
    body += '<div class="field"><span class="field-label">Cubs present</span><div style="flex:1"></div><label class="switch"><input type="checkbox" id="b-cubs"' + (d.cubs ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>';
    body += '</div></div>';
    body += '<div class="group"><div class="group-header">Behaviour</div><div class="list"><div style="padding:12px 16px">' + segHtml('bear-behaviour', d.behaviour, [['calm', 'Calm / moved off'], ['curious', 'Curious'], ['aggressive', 'Aggressive']]) + '</div></div></div>';
    body += '<div class="group"><div class="group-header">Where & when</div><div class="list">' + locCell('bear-locate', d.lat, d.lng) +
      '<div class="field"><span class="field-label">When</span><input type="datetime-local" id="b-when" value="' + esc(d.when) + '"></div></div></div>';
    body += '<div class="group"><div class="group-header">Notes</div><div class="list"><textarea class="notes" id="b-notes" placeholder="Location details, what it was doing…"></textarea></div></div>';
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
    app.entries.push(entry); Store.put(entry); haptic(); closeSheet(); toast('🐻 Bear sighting saved'); afterReportSaved();
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
      grid += '<button class="type-opt' + (d.type === t.id ? ' on' : '') + '" data-action="hazard-type" data-t="' + t.id + '"><span class="te">' + t.emoji + '</span><span>' + esc(t.name) + '</span></button>';
    });
    grid += '</div>';
    var body = '';
    body += '<div class="group" style="margin-top:6px"><div class="group-header">Hazard type</div>' + grid + '</div>';
    body += '<div class="group"><div class="group-header">Where & when</div><div class="list">' + locCell('hazard-locate', d.lat, d.lng) +
      '<div class="field"><span class="field-label">When</span><input type="datetime-local" id="h-when" value="' + esc(d.when) + '"></div></div></div>';
    body += '<div class="group"><div class="group-header">Notes</div><div class="list"><textarea class="notes" id="h-notes" placeholder="What & where exactly…"></textarea></div></div>';
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-hazard">Save Hazard</button></div>';
    mountSheet('Report a Hazard', body, 'save-hazard');
    setVal('h-notes', d.notes);
  }
  function saveHazard() {
    readHazard();
    var d = app.hdraft;
    var h = { id: uid(), type: d.type, lat: d.lat, lng: d.lng, when: d.when ? new Date(d.when).toISOString() : new Date().toISOString(), notes: (d.notes || '').trim(), createdAt: new Date().toISOString() };
    app.hazards.push(h); Store.put(h, 'hazards'); haptic(); closeSheet(); toast('⚠️ Hazard saved'); afterReportSaved();
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
    body += '<div class="wrap-note"><span class="i">⚠️</span><span>Your bear & hazard reports and Ontario’s dangerous wildlife and plants, in one place. Community-wide real-time alerts need a shared server (on the roadmap) — for now this shows your reports plus what to watch for.</span></div>';

    body += '<div class="group"><div class="group-header">Your recent reports</div>';
    if (reports.length) {
      body += '<div class="list">';
      reports.slice(0, 12).forEach(function (r) {
        if (r.kind === 'bear') {
          body += '<div class="cell tap" data-action="open-entry" data-id="' + esc(r.e.id) + '"><span class="cell-emoji">\u{1F43B}</span><span class="cell-body"><span class="cell-title">Bear sighting' + (r.e.bearReport && r.e.bearReport.cubs ? ' · cubs' : '') + '</span><span class="cell-sub">' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when)) + '</span></span><span class="chevron">' + I.chevron + '</span></div>';
        } else {
          var ht = hazardType(r.h.type);
          body += '<a class="cell tap" href="#/map"><span class="cell-emoji">' + ht.emoji + '</span><span class="cell-body"><span class="cell-title">' + esc(ht.name) + '</span><span class="cell-sub">' + esc(fmtDay(r.when) + ' · ' + fmtTime(r.when) + (r.h.notes ? ' · ' + r.h.notes : '')) + '</span></span><span class="chevron">' + I.chevron + '</span></a>';
        }
      });
      body += '</div>';
    } else {
      body += '<div class="list"><div class="info-row"><div class="info-v muted">No reports yet. Use 🐻 Report a Bear or ⚠️ Report a Hazard — they’ll show here and on the map.</div></div></div>';
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
    body += '<div class="wrap-note"><span class="i">\u{1F9EA}</span><span><b>Demo.</b> Crowdsourced sightings only help conservation if they’re trustworthy. This runs a statistical model over <b>simulated</b> contributors — including a deliberately fake “sham” account with skewed, mostly false data — and flags anomalies. Not real user data.</span></div>';
    body += '<div class="stat-grid" style="margin-top:4px">' + stat(cs.length, 'Accounts') + stat(flagged, 'Flagged') + stat(review, 'To review') + '</div>';
    body += '<div class="group"><div class="group-header">Contributors — by anomaly risk</div><div class="list">';
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
      body += '<div class="wrap-note"><span class="i">✓</span><span>No significant anomalies — this contributor’s data is consistent with peers.</span></div>';
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
      evHtml += '<div class="seg-opt' + (d.evidence === o[0] ? ' on' : '') + '" data-action="set-evidence" data-val="' + o[0] + '">' + o[1] + '</div>';
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
      '<div style="min-width:44px;text-align:center;line-height:30px" id="count-val">' + d.count + '</div>' +
      '<div class="sep"></div><button data-action="count" data-d="1">+</button></div></div>';
    body += '<div class="field"><span class="field-label">When</span>' +
      '<input type="datetime-local" id="f-when" value="' + esc(d.when) + '"></div>';
    body += '<button class="cell tap" data-action="use-location">' +
      '<span class="cell-emoji" style="color:var(--tint)">' + I.pin + '</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title" id="loc-title">' +
      (d.lat != null ? 'Location captured' : 'Add current location') + '</span>' +
      '<span class="cell-sub" id="loc-sub">' +
      (d.lat != null ? (d.lat.toFixed(4) + ', ' + d.lng.toFixed(4)) : 'Optional · uses your GPS') + '</span></span></button>';
    body += '</div></div>';

    // Fish-specific
    if (isFish) {
      var u = app.settings.units;
      body += '<div class="group"><div class="group-header">Catch Details</div><div class="list">';
      if (d.evidence === 'caught') {
        body += '<div class="field"><span class="field-label">Released</span><div style="flex:1"></div>' +
          '<label class="switch"><input type="checkbox" id="f-released"' + (d.released ? ' checked' : '') + '><span class="track"></span><span class="knob"></span></label></div>';
      }
      body += '<div class="field"><span class="field-label">Length</span>' +
        '<input type="number" inputmode="decimal" id="f-length" placeholder="0" step="0.1">' +
        '<span class="muted" style="margin-left:6px">' + (u === 'metric' ? 'cm' : 'in') + '</span></div>';
      body += '<div class="field"><span class="field-label">Weight</span>' +
        '<input type="number" inputmode="decimal" id="f-weight" placeholder="0" step="0.01">' +
        '<span class="muted" style="margin-left:6px">' + (u === 'metric' ? 'kg' : 'lb') + '</span></div>';
      body += '<div class="field"><span class="field-label">Bait / lure</span>' +
        '<input type="text" id="f-bait" placeholder="e.g. jig & minnow"></div>';
      body += '<div class="field"><span class="field-label">Water body</span>' +
        '<input type="text" id="f-water" placeholder="Lake or river"></div>';
      body += '</div></div>';
    } else if (isBird) {
      body += '<div class="group"><div class="group-header">Bird Details</div><div class="list">' +
        '<div class="field"><span class="field-label">Behaviour</span>' +
        '<input type="text" id="f-behavior" placeholder="feeding, flying, singing…"></div>' +
        '</div></div>';
    }

    // Photo + notes
    body += '<div class="group"><div class="group-header">Photo & Notes</div><div class="list">';
    body += '<div id="photo-slot">' + photoSlot() + '</div>';
    body += '<textarea class="notes" id="f-notes" placeholder="Notes—where exactly, what it was doing, weather…"></textarea>';
    body += '</div></div>';

    // Save
    var canSave = !!(d.speciesId || d.customName);
    body += '<div class="hpad"><button class="btn btn-primary btn-block" data-action="save-entry"' +
      (canSave ? '' : ' disabled') + '>Save Encounter</button></div>';

    var sheetHtml = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-sheet">Cancel</button>' +
      '<span class="t">Log Encounter</span>' +
      '<button class="nav-btn bold" data-action="save-entry"' + (canSave ? '' : ' disabled') + '>Save</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';

    $('#sheet-root').innerHTML = sheetHtml;
    requestAnimationFrame(function () {
      $('#sheet').classList.add('show');
      $('.scrim').classList.add('show');
    });
    // Restore free-text values into the freshly rendered inputs
    setVal('f-notes', d._notes); setVal('f-behavior', d._behavior);
    setVal('f-length', d._length); setVal('f-weight', d._weight);
    setVal('f-bait', d._bait); setVal('f-water', d._water);
  }
  function setVal(id, v) { var el = document.getElementById(id); if (el && v != null) el.value = v; }
  function photoSlot() {
    var d = app.draft;
    if (d.photo) {
      return '<div style="padding:12px 16px"><img class="entry-photo" src="' + d.photo + '" alt="">' +
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
    var r = document.getElementById('f-released'); if (r) d.released = r.checked;
  }
  function closeSheet() {
    var s = $('#sheet'), sc = $('.scrim');
    if (s) s.classList.remove('show');
    if (sc) sc.classList.remove('show');
    setTimeout(function () { $('#sheet-root').innerHTML = ''; }, 320);
  }

  /* ---- Species picker (nested sheet) ---- */
  function openPicker() {
    var d = app.draft;
    var startCat = d.cat || 'all';
    var html = '<div class="scrim show" data-action="close-picker"></div>' +
      '<div class="sheet show" id="picker" style="height:88vh">' +
      '<div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><button class="nav-btn" data-action="close-picker">Back</button>' +
      '<span class="t">Choose Species</span><span style="width:44px"></span></div>' +
      '<div class="searchbar" style="margin-top:2px">' + I.search +
      '<input type="search" id="picker-search" placeholder="Search all species" autocomplete="off" autocapitalize="none">' +
      '</div>' +
      '<div class="chip-row" id="picker-chips">' + pickerChips(startCat) + '</div>' +
      '<div class="sheet-body" id="picker-list">' + pickerList(startCat, '') + '</div>' +
      '</div>';
    var root = document.createElement('div');
    root.id = 'picker-root';
    root.innerHTML = html;
    document.body.appendChild(root);
    app._pickerCat = startCat;
    var inp = $('#picker-search');
    inp.addEventListener('input', function () { refreshPicker(); });
  }
  function pickerChips(active) {
    var html = '<button class="chip' + (active === 'all' ? ' on' : '') + '" data-action="picker-cat" data-cat="all">All</button>';
    CATEGORIES.forEach(function (c) {
      html += '<button class="chip' + (active === c.id ? ' on' : '') + '" data-action="picker-cat" data-cat="' + c.id + '">' + c.emoji + ' ' + esc(c.name) + '</button>';
    });
    return html;
  }
  function pickerList(catId, q) {
    var list;
    if (q) list = searchSpecies(q).filter(function (s) { return catId === 'all' || s.cat === catId; });
    else list = sortSpecies(catId === 'all' ? SPECIES.slice() : speciesInCat(catId));
    var html = '';
    // "Not in guide" option
    html += '<div class="group" style="margin-top:6px"><div class="list">' +
      '<button class="cell tap" data-action="custom-species">' +
      '<span class="cell-emoji">✏️</span>' +
      '<span class="cell-body" style="text-align:left"><span class="cell-title">Something else…</span>' +
      '<span class="cell-sub">Type a name not in the guide</span></span>' +
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
  function closePicker() { var r = $('#picker-root'); if (r) r.remove(); }

  function saveEntry() {
    syncDraftInputs();
    var d = app.draft;
    if (!d.speciesId && !d.customName) { toast('Choose a species first'); return; }
    var sp = d.speciesId ? byId[d.speciesId] : null;
    var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : null; };
    var entry = {
      id: uid(),
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
      createdAt: new Date().toISOString()
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

    app.entries.push(entry);
    Store.put(entry);
    haptic();
    closeSheet();
    toast('✓ Logged ' + entry.speciesName);
    setTimeout(function () { route(); }, 120);
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
    if (e.lat != null) rows += info('Location', e.lat.toFixed(5) + ', ' + e.lng.toFixed(5));
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
    if (e.photo) body += '<div class="hpad"><img class="entry-photo" src="' + e.photo + '" alt=""></div>';
    body += '<div class="group"><div class="list">' + rows + '</div></div>';
    if (sp) body += '<div class="hpad"><a class="btn btn-tinted btn-block" href="#/species/' + esc(sp.id) + '" data-action="close-sheet-nav">View in field guide</a></div><div class="spacer"></div>';
    body += '<div class="hpad"><button class="btn btn-danger btn-block" data-action="delete-entry" data-id="' + esc(e.id) + '">Delete this encounter</button></div>';

    var html = '<div class="scrim" data-action="close-sheet"></div>' +
      '<div class="sheet" id="sheet"><div class="sheet-grabber"></div>' +
      '<div class="sheet-nav"><span style="width:44px"></span><span class="t">Encounter</span>' +
      '<button class="nav-btn bold" data-action="close-sheet">Done</button></div>' +
      '<div class="sheet-body">' + body + '</div></div>';
    $('#sheet-root').innerHTML = html;
    requestAnimationFrame(function () { $('#sheet').classList.add('show'); $('.scrim').classList.add('show'); });
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
    var blob = new Blob([JSON.stringify({ app: 'ontario-wildlife-log', version: 1, exported: new Date().toISOString(), entries: app.entries, hazards: app.hazards }, null, 2)], { type: 'application/json' });
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
      ['log', '#/log', 'Log', I.log],
      ['explore', '#/explore', 'Guide', I.explore],
      ['map', '#/map', 'Map', I.map],
      ['mylog', '#/mylog', 'My Log', I.mylog],
      ['more', '#/more', 'More', I.more]
    ];
    var html = '';
    tabs.forEach(function (t) {
      html += '<a class="tab' + (base === t[0] ? ' active' : '') + '" href="' + t[1] + '">' + t[3] + '<span>' + t[2] + '</span></a>';
    });
    $('#tabbar').innerHTML = html;
  }
  function currentTab() {
    var h = location.hash.replace(/^#\//, '');
    if (h.indexOf('explore') === 0 || h.indexOf('species') === 0) return 'explore';
    if (h.indexOf('map') === 0) return 'map';
    if (h.indexOf('mylog') === 0) return 'mylog';
    if (h.indexOf('more') === 0 || h.indexOf('learn') === 0 || h.indexOf('resources') === 0 || h.indexOf('trust') === 0) return 'more';
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
    else if (r === 'species') viewSpecies(parts[1]);
    else if (r === 'map') viewMap();
    else if (r === 'mylog') viewMyLog();
    else if (r === 'alerts') viewAlerts();
    else if (r === 'trust') { if (parts[1]) viewTrustAccount(parts[1]); else viewTrust(); }
    else if (r === 'learn') viewLearn(parts[1]);
    else if (r === 'resources') viewResources();
    else if (r === 'more') viewMore();
    else viewLog();
    renderTabs();
  }

  /* --------------------------------------------------- Global handlers */
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
      case 'delete-entry':
        ev.preventDefault();
        if (confirm('Delete this encounter? This cannot be undone.')) deleteEntry(t.getAttribute('data-id'));
        break;
      case 'export-data': ev.preventDefault(); exportData(); break;
      case 'set-units': ev.preventDefault(); app.settings.units = t.getAttribute('data-val'); saveSettings(); viewMore(); break;
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
    if (ev.target && ev.target.id === 'photo-input') handlePhoto(ev.target.files && ev.target.files[0]);
  });

  function captureLocation() {
    if (!navigator.geolocation) { toast('Location not available'); return; }
    var sub = $('#loc-sub'); if (sub) sub.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      app.draft.lat = pos.coords.latitude; app.draft.lng = pos.coords.longitude;
      var ti = $('#loc-title'), su = $('#loc-sub');
      if (ti) ti.textContent = 'Location captured';
      if (su) su.textContent = app.draft.lat.toFixed(4) + ', ' + app.draft.lng.toFixed(4);
      haptic();
    }, function () {
      var su2 = $('#loc-sub'); if (su2) su2.textContent = 'Couldn’t get location — tap to retry';
      toast('Location permission denied');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }

  /* -------------------------------------------------------------- Boot */
  window.addEventListener('hashchange', route);
  function boot() {
    loadSettings();
    Store.load().then(function (entries) {
      app.entries = entries || [];
      return Store.loadHazards();
    }).then(function (hazards) {
      app.hazards = hazards || [];
      app.ready = true;
      if (!location.hash) location.hash = '#/log';
      route();
    });
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').catch(function () {});
      });
    }
  }
  boot();
})();
