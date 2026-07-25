/* Ontario Wildlife Log, community backend (reference implementation).
 *
 * A tiny, ZERO-DEPENDENCY Node HTTP server that lets the app pool anonymized
 * sightings so users can see "near you this week", recent bear/hazard activity,
 * and province-wide totals. Protections baked in:
 *   1. Geoprivacy, coordinates are coarsened AT INGEST (never stored raw): to a
 *      ~5 km grid normally and a ~22 km grid for at-risk species and bears. The
 *      coarse grid is FORCED server-side for bears, never trusted to the client.
 *   2. Ownership tokens, a client proves ownership of its (pseudonymous) id with
 *      a secret token, so knowing an id alone can't submit-as or delete another's
 *      data. Only the token's hash is stored.
 *   3. Rate limiting, every route is limited per IP; submissions also per client
 *      and per IP per day, plus a cap on how many new ids one IP can mint.
 *   4. Bounded storage, the rate map is swept, orphan clients are pruned, writes
 *      are atomic (tmp+rename) with a .bak fallback, and pushSubs are capped.
 *   5. Soft anti-abuse, rapid-fire / impossible-travel submissions are throttled
 *      temporarily (never a permanent ban, never a retroactive purge of history).
 *
 * Identities are a random client id (pseudonymous, not "anonymous"): no accounts,
 * names or emails. Run: node server/server.js  (PORT, default 8787).
 *
 * IMPORTANT for operators: set ALLOW_ORIGIN to your site's origin (e.g.
 * https://you.github.io) so arbitrary websites can't drive this API from a
 * visitor's browser. If you run behind a reverse proxy, set TRUST_PROXY=1 so the
 * X-Forwarded-For header is honoured (it is IGNORED by default, since clients can
 * forge it). For push delivery, set VAPID_PUBLIC_KEY (served at /api/v1/push/key).
 */
'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var PORT = parseInt(process.env.PORT || '8787', 10);
var DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');
var ORIGIN = process.env.ALLOW_ORIGIN || '*'; // SET THIS to your site origin in production
var TRUST_PROXY = /^(1|true|yes)$/i.test(process.env.TRUST_PROXY || '');
var MAX_SIGHTINGS = 200000;
var MAX_PER_CLIENT = 5000;   // no single client may dominate the store
var MAX_PUSHSUBS = 50000;

// ---- storage ----
function loadDb() {
  var files = [DATA_FILE, DATA_FILE + '.bak'];
  for (var i = 0; i < files.length; i++) {
    try { if (fs.existsSync(files[i])) return JSON.parse(fs.readFileSync(files[i], 'utf8')); } catch (e) { }
  }
  return { sightings: [], clients: {}, pushSubs: [] };
}
var db = loadDb();
if (!db.sightings) db.sightings = [];
if (!db.clients) db.clients = {};
if (!db.pushSubs) db.pushSubs = [];

var flushTimer = null;
function flush() {
  if (flushTimer) return;
  flushTimer = setTimeout(function () {
    flushTimer = null;
    var tmp = DATA_FILE + '.tmp';
    // Async + atomic (tmp then rename), keeping a .bak so a crash mid-write can't
    // zero the store. Never block the event loop with a synchronous whole-DB write.
    try {
      fs.writeFile(tmp, JSON.stringify(db), function (err) {
        if (err) return;
        try { if (fs.existsSync(DATA_FILE)) fs.copyFileSync(DATA_FILE, DATA_FILE + '.bak'); } catch (e) { }
        try { fs.renameSync(tmp, DATA_FILE); } catch (e) { }
      });
    } catch (e) { }
  }, 400);
}

// ---- helpers ----
function sha(s) { return crypto.createHash('sha256').update(String(s)).digest('hex'); }
function coarse(x, step) { return Math.round(x / step) * step; }
function haversine(a, b, c, d) {
  var R = 6371, toR = Math.PI / 180;
  var dLat = (c - a) * toR, dLng = (d - b) * toR, la1 = a * toR, la2 = c * toR;
  var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function pubStep(sensitive) { return sensitive ? 0.2 : 0.05; } // ~22 km / ~5 km grids
// Slug sanitizer for ids keeps hyphens; only [a-z0-9_-] survive.
function slug(s, n) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, n || 64); }
// Normalize a timestamp to ISO, dropping anything that isn't a real date (no free
// text / HTML is ever stored or re-served).
function validWhen(s) { var t = Date.parse(String(s == null ? '' : s)); return isNaN(t) ? '' : new Date(t).toISOString(); }

// ---- rate limiting (each bucket expires by its own window) ----
var rate = {};
function allow(key, max, windowMs) {
  var now = Date.now(), b = rate[key];
  if (!b || now > b.exp) { b = rate[key] = { c: 0, exp: now + windowMs }; }
  b.c++;
  return b.c <= max;
}
var sweeper = setInterval(function () {
  var now = Date.now();
  for (var k in rate) { if (rate[k].exp < now) delete rate[k]; }
}, 300000);
if (sweeper.unref) sweeper.unref();
function ipOf(req) {
  // X-Forwarded-For is forgeable, so honour it ONLY behind a trusted proxy; then
  // take the rightmost (proxy-appended) hop rather than the client-chosen first one.
  if (TRUST_PROXY) {
    var xff = (req.headers['x-forwarded-for'] || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (xff.length) return xff[xff.length - 1];
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

// ---- soft anti-abuse (behavioural signals only; temporary, never a purge) ----
function updateClient(cid, s) {
  var c = db.clients[cid] || (db.clients[cid] = { count: 0, lastAt: 0, lastLat: null, lastLng: null, bursts: 0, flaggedUntil: 0, tokHash: null });
  var now = Date.now();
  if (c.lastAt) {
    var gapSec = (now - c.lastAt) / 1000;
    if (gapSec > 300) c.bursts = 0;                          // decay: a quiet period clears the burst count
    else {
      if (gapSec < 2) c.bursts++;                            // genuinely bot-like rapid-fire (not a normal multi-entry hike)
      if (c.lastLat != null && typeof s.lat === 'number' && gapSec > 0) {
        var km = haversine(c.lastLat, c.lastLng, s.lat, s.lng);
        if (km / (gapSec / 3600) > 900) c.bursts++;          // impossible travel
      }
    }
  }
  c.count++;
  c.lastAt = now; if (typeof s.lat === 'number') { c.lastLat = s.lat; c.lastLng = s.lng; }
  // A sustained burst earns a TEMPORARY cooldown, no permanent ban, and a single
  // high-count observation (e.g. a 300-goose flock) is never a trigger.
  if (c.bursts >= 6) c.flaggedUntil = now + 600000;          // 10-minute throttle
  return c;
}
function pruneOrphanClients() {
  var live = {}; db.sightings.forEach(function (s) { live[s.clientId] = 1; });
  var cutoff = Date.now() - 7 * 86400000;
  for (var cid in db.clients) {
    if (!live[cid] && (db.clients[cid].lastAt || 0) < cutoff) delete db.clients[cid];
  }
}

// ---- API ----
function send(res, code, obj) {
  var h = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };
  if (ORIGIN) h['Access-Control-Allow-Origin'] = ORIGIN;
  res.writeHead(code, h);
  res.end(JSON.stringify(obj));
}
function readBody(req, cb) {
  var data = '';
  req.on('data', function (c) { data += c; if (data.length > 1e5) req.destroy(); });
  req.on('end', function () { try { cb(JSON.parse(data || '{}')); } catch (e) { cb(null); } });
}
// Verify the caller owns `cid` via its secret token. Binds the token hash on first
// use. Returns true if allowed, false if the token doesn't match a bound id.
function owns(c, token) {
  if (!c.tokHash) { if (token) c.tokHash = sha(token); return true; }
  return !!token && sha(token) === c.tokHash;
}

function handleSighting(req, res) {
  var ip = ipOf(req);
  if (!allow('ip:' + ip, 60, 60000)) return send(res, 429, { error: 'rate limited' });
  if (!allow('ipday:' + ip, 2000, 86400000)) return send(res, 429, { error: 'daily limit' });
  readBody(req, function (b) {
    if (!b || !b.clientId) return send(res, 400, { error: 'bad request' });
    var cid = slug(b.clientId, 64);
    if (!cid) return send(res, 400, { error: 'bad client id' });
    if (!allow('cid:' + cid, 30, 60000)) return send(res, 429, { error: 'rate limited' });
    var token = typeof b.token === 'string' ? b.token : '';
    var isNew = !db.clients[cid];
    // Cap how many brand-new ids one IP can mint, so rotating ids can't buy fresh budgets.
    if (isNew && !allow('newcid:' + ip, 60, 3600000)) return send(res, 429, { error: 'too many new ids' });
    if (isNew && !token) return send(res, 400, { error: 'token required' });
    var c = db.clients[cid] || (db.clients[cid] = { count: 0, lastAt: 0, lastLat: null, lastLng: null, bursts: 0, flaggedUntil: 0, tokHash: null });
    if (!owns(c, token)) return send(res, 403, { error: 'ownership mismatch' });

    // Geoprivacy is enforced HERE, not trusted to the client: bears always use the
    // coarse grid, and coordinates are only ever stored coarsened.
    var sensitive = !!b.sensitive || b.kind === 'bear';
    var lat = typeof b.lat === 'number' && isFinite(b.lat) ? coarse(b.lat, pubStep(sensitive)) : null;
    var lng = typeof b.lng === 'number' && isFinite(b.lng) ? coarse(b.lng, pubStep(sensitive)) : null;
    var s = {
      id: crypto.randomBytes(8).toString('hex'),
      clientId: cid,
      kind: ['sighting', 'bear', 'hazard'].indexOf(b.kind) >= 0 ? b.kind : 'sighting',
      species: slug(b.species, 64),
      cat: slug(b.cat, 24), sub: slug(b.sub, 24), hazardType: slug(b.hazardType, 24),
      count: Math.max(1, Math.min(9999, parseInt(b.count, 10) || 1)),
      sensitive: sensitive, lat: lat, lng: lng,
      when: validWhen(b.when), createdAt: Date.now()
    };
    var cc = updateClient(cid, s);
    if (cc.flaggedUntil && Date.now() < cc.flaggedUntil) return send(res, 200, { ok: true, accepted: false, reason: 'throttled' });
    s.q = cc.bursts >= 5 ? 1 : 0;   // quarantine only the anomalous burst window from public aggregates
    db.sightings.push(s);
    if (db.sightings.length > MAX_SIGHTINGS) {
      db.sightings = db.sightings.filter(function (x) { return !x.q; });       // drop quarantined first
      // then enforce per-client fairness so no flood can push out everyone else
      var per = {};
      db.sightings = db.sightings.filter(function (x) { per[x.clientId] = (per[x.clientId] || 0) + 1; return per[x.clientId] <= MAX_PER_CLIENT; });
      if (db.sightings.length > MAX_SIGHTINGS) db.sightings.splice(0, db.sightings.length - (MAX_SIGHTINGS - 20000));
      pruneOrphanClients();
    }
    flush();
    send(res, 200, { ok: true, id: s.id, accepted: true });
  });
}

function handleDelete(req, res) {
  var ip = ipOf(req);
  if (!allow('del:' + ip, 20, 60000)) return send(res, 429, { error: 'rate limited' });
  readBody(req, function (b) {
    if (!b || !b.clientId) return send(res, 400, { error: 'bad request' });
    var cid = slug(b.clientId, 64);
    var token = typeof b.token === 'string' ? b.token : '';
    var c = db.clients[cid];
    // Ownership must be proven: knowing an id alone can't erase someone's data.
    if (c && c.tokHash && sha(token) !== c.tokHash) return send(res, 403, { error: 'ownership mismatch' });
    var before = db.sightings.length;
    db.sightings = db.sightings.filter(function (x) { return x.clientId !== cid; });
    delete db.clients[cid];
    db.pushSubs = db.pushSubs.filter(function (p) { return p.clientId !== cid; });
    flush();
    send(res, 200, { ok: true, deleted: before - db.sightings.length });
  });
}

function handleCommunity(req, res, q) {
  var ip = ipOf(req);
  if (!allow('ip:' + ip, 120, 60000)) return send(res, 429, { error: 'rate limited' });
  var lat = parseFloat(q.lat), lng = parseFloat(q.lng);
  var km = Math.min(500, parseFloat(q.km) || 50);
  var days = Math.min(365, parseInt(q.days, 10) || 7);
  var since = Date.now() - days * 86400000;
  var valid = db.sightings.filter(function (s) { return s.createdAt >= since && !s.q; });
  var near = valid;
  if (isFinite(lat) && isFinite(lng)) {
    near = valid.filter(function (s) { return typeof s.lat === 'number' && haversine(lat, lng, s.lat, s.lng) <= km; });
  }
  var speciesCount = {}, contributors = {}, bears = [], hazards = [];
  near.forEach(function (s) {
    contributors[s.clientId] = 1;
    if (s.kind === 'bear') bears.push({ when: s.when, lat: s.lat, lng: s.lng });
    else if (s.kind === 'hazard') hazards.push({ type: s.hazardType, when: s.when, lat: s.lat, lng: s.lng });
    else if (s.species) speciesCount[s.species] = (speciesCount[s.species] || 0) + 1;
  });
  var topSpecies = Object.keys(speciesCount).map(function (k) { return { id: k, count: speciesCount[k] }; })
    .sort(function (a, b) { return b.count - a.count; }).slice(0, 12);
  send(res, 200, {
    ok: true, radiusKm: km, days: days,
    stats: { sightings: near.length, contributors: Object.keys(contributors).length, species: Object.keys(speciesCount).length },
    topSpecies: topSpecies, bears: bears.slice(-30), hazards: hazards.slice(-30)
  });
}

function handleStats(req, res) {
  var ip = ipOf(req);
  if (!allow('ip:' + ip, 120, 60000)) return send(res, 429, { error: 'rate limited' });
  var valid = db.sightings.filter(function (s) { return !s.q; });
  var sp = {}, ct = {}, bears = 0, hazards = 0;
  valid.forEach(function (s) { ct[s.clientId] = 1; if (s.kind === 'bear') bears++; else if (s.kind === 'hazard') hazards++; else if (s.species) sp[s.species] = 1; });
  send(res, 200, { ok: true, sightings: valid.length, contributors: Object.keys(ct).length, species: Object.keys(sp).length, bears: bears, hazards: hazards });
}

function validSub(sub) {
  return sub && typeof sub === 'object' && typeof sub.endpoint === 'string' &&
    /^https:\/\//.test(sub.endpoint) && sub.endpoint.length < 1000;
}
function handlePush(req, res) {
  var ip = ipOf(req);
  if (!allow('push:' + ip, 20, 60000)) return send(res, 429, { error: 'rate limited' });
  readBody(req, function (b) {
    if (!b || !b.clientId || !validSub(b.subscription)) return send(res, 400, { error: 'bad request' });
    var cid = slug(b.clientId, 64); if (!cid) return send(res, 400, { error: 'bad client id' });
    var token = typeof b.token === 'string' ? b.token : '';
    var c = db.clients[cid];
    if (c && c.tokHash && sha(token) !== c.tokHash) return send(res, 403, { error: 'ownership mismatch' });
    // Upsert: one subscription per client id (no unbounded append / duplicates).
    db.pushSubs = db.pushSubs.filter(function (p) { return p.clientId !== cid; });
    db.pushSubs.push({ clientId: cid, sub: b.subscription, lat: typeof b.lat === 'number' ? coarse(b.lat, 0.2) : null, lng: typeof b.lng === 'number' ? coarse(b.lng, 0.2) : null, at: Date.now() });
    if (db.pushSubs.length > MAX_PUSHSUBS) db.pushSubs.splice(0, db.pushSubs.length - MAX_PUSHSUBS);
    flush();
    send(res, 200, { ok: true, note: 'stored; delivery requires VAPID keys (see README)' });
  });
}

var server = http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') { send(res, 204, {}); return; }
  var u = new URL(req.url, 'http://x');
  var p = u.pathname.replace(/\/+$/, '');
  var q = Object.fromEntries(u.searchParams.entries());
  if (p === '/api/v1/health') return send(res, 200, { ok: true, service: 'ontario-wildlife-log', time: Date.now() });
  if (p === '/api/v1/sightings' && req.method === 'POST') return handleSighting(req, res);
  if (p === '/api/v1/delete' && req.method === 'POST') return handleDelete(req, res);
  if (p === '/api/v1/community' && req.method === 'GET') return handleCommunity(req, res, q);
  if (p === '/api/v1/stats' && req.method === 'GET') return handleStats(req, res);
  if (p === '/api/v1/push/subscribe' && req.method === 'POST') return handlePush(req, res);
  if (p === '/api/v1/push/key' && req.method === 'GET') return send(res, 200, { key: process.env.VAPID_PUBLIC_KEY || '' });
  send(res, 404, { error: 'not found' });
});
server.listen(PORT, function () {
  console.log('Wildlife community server on :' + PORT + ' (data: ' + DATA_FILE + ')');
  if (ORIGIN === '*') console.warn('[warn] ALLOW_ORIGIN is "*": any website can call this API from a visitor\'s browser. Set ALLOW_ORIGIN to your site origin in production.');
  if (!TRUST_PROXY) console.log('[info] X-Forwarded-For ignored (set TRUST_PROXY=1 only when behind a trusted reverse proxy).');
});
