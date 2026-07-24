/* Data-reliability demo: anomaly detection over simulated contributors.
   Crowdsourced wildlife data is only useful for conservation if it is
   trustworthy. This module builds a DETERMINISTIC synthetic dataset — several
   genuine contributors plus one deliberately fake "sham" account whose data is
   skewed and largely false — and runs a transparent statistical model
   (robust z-scores + domain plausibility rules) that flags anomalous accounts.
   All data here is simulated; it is not real user data. */
(function () {
  'use strict';
  var SP = window.SPECIES || [];
  var byId = {}; SP.forEach(function (s) { byId[s.id] = s; });

  // Seeded PRNG (mulberry32) so the demo is identical on every load.
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  var BASE = Date.UTC(2025, 3, 1, 12, 0, 0); // Apr 1 2025 — fixed epoch (no Date.now)
  var CITIES = [
    { n: 'Toronto', lat: 43.65, lng: -79.38 }, { n: 'Ottawa', lat: 45.42, lng: -75.70 },
    { n: 'Sudbury', lat: 46.49, lng: -80.99 }, { n: 'London', lat: 42.98, lng: -81.24 },
    { n: 'Kingston', lat: 44.23, lng: -76.49 }, { n: 'Barrie', lat: 44.39, lng: -79.69 },
    { n: 'Huntsville', lat: 45.33, lng: -79.22 }, { n: 'Peterborough', lat: 44.30, lng: -78.32 }
  ];
  function seasonOf(ms) {
    var m = new Date(ms).getUTCMonth();
    return (m >= 2 && m <= 4) ? 'spring' : (m >= 5 && m <= 7) ? 'summer' : (m >= 8 && m <= 10) ? 'fall' : 'winter';
  }
  function inSeason(s, season) { return !s.seasons || !s.seasons.length || s.seasons.indexOf(season) >= 0; }

  var commonPool = SP.filter(function (s) { return s.seen === 'common' && !s.atRisk; });
  var uncommonPool = SP.filter(function (s) { return s.seen === 'uncommon' && !s.atRisk; });
  var rarePool = SP.filter(function (s) { return s.seen === 'rare' || s.atRisk; });
  if (!commonPool.length) commonPool = SP.slice(0, 20);

  // A genuine contributor: plausible species, in season, low counts, natural
  // gaps between submissions, sightings clustered near a home area.
  function genGenuine(name, seed, homeIdx, nObs, uncommonBias) {
    var rng = mulberry32(seed); var home = CITIES[homeIdx % CITIES.length];
    var obs = [], day = 0;
    for (var i = 0; i < nObs; i++) {
      day += 1 + Math.floor(rng() * 6);
      var when = BASE + day * 86400000 + Math.floor(rng() * 36000000);
      var season = seasonOf(when);
      var basePool = rng() < uncommonBias ? uncommonPool : commonPool;
      var pool = basePool.filter(function (s) { return inSeason(s, season); });
      if (!pool.length) pool = commonPool;
      var s = pick(rng, pool);
      var count = 1 + Math.floor(rng() * rng() * 4);
      if (s.cat === 'fish' || s.cat === 'birds') count = 1 + Math.floor(rng() * 6);
      obs.push({
        speciesId: s.id, count: count,
        lat: home.lat + (rng() - 0.5) * 0.3, lng: home.lng + (rng() - 0.5) * 0.3,
        when: new Date(when).toISOString(), createdAt: when + Math.floor(rng() * 7200000)
      });
    }
    return { account: name, home: home.n, sham: false, obs: obs };
  }

  // The sham: over-claims rare/charismatic species, out of season, absurd
  // counts, impossible travel, and bot-like submission bursts.
  function genSham(name, seed) {
    var rng = mulberry32(seed);
    var charis = SP.filter(function (s) {
      return ['cougar', 'polar-bear', 'wolverine', 'grey-wolf', 'canada-lynx', 'woodland-caribou', 'massasauga', 'american-badger'].indexOf(s.id) >= 0;
    });
    var pool = charis.length ? charis : (rarePool.length ? rarePool : SP.slice(0, 10));
    var burstStart = BASE + 20 * 86400000;
    var obs = [];
    for (var i = 0; i < 14; i++) {
      var s = pick(rng, pool);
      var when = BASE + Math.floor(rng() * 120) * 86400000;      // scattered, often wrong season
      var lat = 42.9 + rng() * 6.6, lng = -95 + rng() * 15;       // wildly spread, some impossible
      var count = 12 + Math.floor(rng() * 70);                    // absurd counts
      var createdAt = burstStart + i * Math.floor(rng() * 45000); // many within seconds
      obs.push({ speciesId: s.id, count: count, lat: lat, lng: lng, when: new Date(when).toISOString(), createdAt: createdAt });
    }
    return { account: name, home: '—', sham: true, obs: obs };
  }

  var DATA = [
    genGenuine('MapleTrail_Jo', 101, 0, 16, 0.25),
    genGenuine('LoonWatcher', 202, 2, 12, 0.35),
    genGenuine('RiverbendRick', 303, 4, 18, 0.20),
    genGenuine('BorealBirder', 404, 6, 20, 0.40),
    genGenuine('QuietPaddler', 505, 1, 10, 0.15),
    genGenuine('TrilliumTina', 606, 3, 14, 0.30),
    genGenuine('CedarRidge_Sam', 707, 5, 11, 0.25),
    genSham('TrailCamTony_99', 909)
  ];

  // ---- Model ----
  function haversine(a, b, c, d) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (c - a) * toR, dLng = (d - b) * toR, la1 = a * toR, la2 = c * toR;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  function median(arr) {
    if (!arr.length) return 0;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function features(c) {
    var obs = c.obs, outSeason = 0, rare = 0, counts = [], maxCount = 0;
    obs.forEach(function (o) {
      var s = byId[o.speciesId] || {};
      var season = seasonOf(new Date(o.when).getTime());
      if (s.seasons && s.seasons.length && s.seasons.indexOf(season) < 0) outSeason++;
      if (s.seen === 'rare' || s.atRisk) rare++;
      counts.push(o.count); if (o.count > maxCount) maxCount = o.count;
    });
    var mean = counts.reduce(function (a, b) { return a + b; }, 0) / (counts.length || 1);
    var byCreated = obs.slice().sort(function (a, b) { return a.createdAt - b.createdAt; });
    var burst = 0, gaps = 0;
    for (var i = 1; i < byCreated.length; i++) { gaps++; if ((byCreated[i].createdAt - byCreated[i - 1].createdAt) / 1000 < 120) burst++; }
    var byWhen = obs.slice().sort(function (a, b) { return new Date(a.when) - new Date(b.when); });
    var maxSpeed = 0;
    for (var j = 1; j < byWhen.length; j++) {
      var hrs = Math.abs(new Date(byWhen[j].when) - new Date(byWhen[j - 1].when)) / 3600000; if (hrs < 0.01) hrs = 0.01;
      var km = haversine(byWhen[j - 1].lat, byWhen[j - 1].lng, byWhen[j].lat, byWhen[j].lng);
      var sp = km / hrs; if (sp > maxSpeed) maxSpeed = sp;
    }
    return {
      implausibleRate: obs.length ? outSeason / obs.length : 0,
      rareRate: obs.length ? rare / obs.length : 0,
      meanCount: mean, maxCount: maxCount,
      burstFrac: gaps ? burst / gaps : 0, maxSpeed: maxSpeed
    };
  }
  var KEYS = ['implausibleRate', 'rareRate', 'meanCount', 'maxCount', 'burstFrac', 'maxSpeed'];
  var WEIGHTS = { implausibleRate: 1.2, rareRate: 1.2, meanCount: 1.0, maxCount: 0.8, burstFrac: 1.3, maxSpeed: 1.0 };
  var LABELS = {
    implausibleRate: 'Out-of-season sightings', rareRate: 'Over-reports rare / at-risk species',
    meanCount: 'Unusually high counts', maxCount: 'Extreme single counts',
    burstFrac: 'Bot-like submission bursts', maxSpeed: 'Impossible travel between sightings'
  };
  function analyze(data) {
    var feats = data.map(function (c) { return { c: c, f: features(c) }; });
    var stats = {};
    KEYS.forEach(function (k) {
      var vals = feats.map(function (x) { return x.f[k]; });
      var med = median(vals);
      var mad = median(vals.map(function (v) { return Math.abs(v - med); }));
      var meanAD = vals.reduce(function (a, v) { return a + Math.abs(v - med); }, 0) / (vals.length || 1);
      // Robust scale: prefer MAD; if the median group is degenerate (MAD 0),
      // fall back to mean absolute deviation so a lone outlier still scores.
      var denom = mad > 1e-9 ? 1.4826 * mad : (meanAD > 1e-9 ? 1.2533 * meanAD : (Math.abs(med) > 1e-9 ? Math.abs(med) : 1));
      stats[k] = { med: med, mad: mad, meanAD: meanAD, denom: denom };
    });
    var out = feats.map(function (x) {
      var z = {}, score = 0, reasons = [];
      KEYS.forEach(function (k) {
        var s = stats[k];
        var zz = (x.f[k] - s.med) / s.denom;
        z[k] = zz;
        if (zz > 0) score += WEIGHTS[k] * zz;
        if (zz >= 1.8) reasons.push(LABELS[k]);
      });
      var risk = Math.min(100, Math.round(score * 7));
      var label = risk >= 60 ? 'Flagged' : risk >= 30 ? 'Review' : 'Trusted';
      var examples = [];
      x.c.obs.forEach(function (o) {
        var s = byId[o.speciesId] || { name: o.speciesId };
        var season = seasonOf(new Date(o.when).getTime());
        var why = [];
        if (s.seasons && s.seasons.length && s.seasons.indexOf(season) < 0) why.push('reported in ' + season);
        if (s.seen === 'rare' || s.atRisk) why.push('rare/at-risk');
        if (o.count >= 15) why.push('count of ' + o.count);
        if (why.length) examples.push({ name: s.name || o.speciesId, why: why.join(' · ') });
      });
      return {
        account: x.c.account, home: x.c.home, sham: x.c.sham, obsCount: x.c.obs.length,
        f: x.f, z: z, risk: risk, reliability: 100 - risk, label: label,
        reasons: reasons, examples: examples.slice(0, 5)
      };
    });
    out.sort(function (a, b) { return b.risk - a.risk; });
    return { contributors: out, stats: stats, keys: KEYS, labels: LABELS };
  }

  window.TRUST = { data: DATA, result: analyze(DATA) };
})();
