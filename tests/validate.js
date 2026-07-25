#!/usr/bin/env node
/* Zero-dependency CI validation for Ontario Wildlife Log.
 *
 * Runs in GitHub Actions (and locally: `node tests/validate.js`). No browser and
 * no npm install needed. Checks:
 *   1. Every JS file passes `node --check` (syntax).
 *   2. The species DB parses: expected count, no duplicate ids, valid subcategories,
 *      well-formed records.
 *   3. The manifest is valid JSON with the icons it declares present on disk.
 *   4. The service worker declares a cache version and every local shell file exists.
 *   5. The community server boots and a submit -> feed -> delete round-trip works,
 *      including ownership-token enforcement and forced bear geoprivacy.
 *
 * Exit code is non-zero if anything fails.
 */
'use strict';
var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var http = require('http');

var ROOT = path.resolve(__dirname, '..');
var fails = [];
var passes = 0;
function ok(name) { passes++; console.log('  ✓ ' + name); }
function bad(name, detail) { fails.push(name + (detail ? ', ' + detail : '')); console.log('  ✗ ' + name + (detail ? ', ' + detail : '')); }
function rel(p) { return path.join(ROOT, p); }

// ---- 1. syntax ----
console.log('\n[1] Syntax (node --check)');
var JS_FILES = [
  'app.js', 'service-worker.js', 'server/server.js',
  'data/species.js', 'data/notes.js', 'data/categories.js', 'data/learn.js', 'data/trust.js', 'data/badges.js',
  'tests/validate.js',
];
JS_FILES.forEach(function (f) {
  try { cp.execFileSync(process.execPath, ['--check', rel(f)], { stdio: 'pipe' }); ok(f); }
  catch (e) { bad(f, 'syntax error'); }
});

// ---- 2. species DB ----
console.log('\n[2] Species database');
var SUBS = {
  mammals: ['large-mammals', 'carnivores', 'small-mammals', 'bats'],
  birds: ['raptors-owls', 'waterfowl', 'songbirds', 'woodpeckers', 'game-birds', 'other-birds'],
  reptiles: ['turtles', 'snakes', 'lizards'],
  amphibians: ['frogs-toads', 'salamanders'],
  fish: ['gamefish', 'panfish', 'trout-salmon', 'other-fish'],
  trees: ['conifers', 'deciduous'],
  plants: ['wildflowers', 'shrubs-berries', 'ferns-grasses', 'dangerous-invasive'],
  insects: ['butterflies-moths', 'dragonflies', 'bees-wasps', 'beetles', 'other-insects'],
  fungi: ['edible', 'poisonous', 'other-fungi'],
};
try {
  global.window = {};
  require(rel('data/species.js'));
  var S = global.window.SPECIES;
  if (!Array.isArray(S) || S.length < 300) bad('species count', 'got ' + (S && S.length));
  else ok('species count = ' + S.length);
  var ids = S.map(function (r) { return r.id; });
  var dupes = ids.filter(function (x, i) { return ids.indexOf(x) !== i; });
  if (dupes.length) bad('duplicate ids', dupes.slice(0, 5).join(', ')); else ok('no duplicate ids');
  var badSub = S.filter(function (r) { return !SUBS[r.cat] || SUBS[r.cat].indexOf(r.sub) < 0; });
  if (badSub.length) bad('invalid category/sub', badSub.slice(0, 5).map(function (r) { return r.id; }).join(', ')); else ok('all categories/subcategories valid');
  var malformed = S.filter(function (r) { return !r.name || !r.sci || typeof r.atRisk !== 'boolean' || !Array.isArray(r.seasons); });
  if (malformed.length) bad('malformed records', String(malformed.length)); else ok('all records well-formed');
} catch (e) { bad('species DB load', e.message); }

// ---- 3. manifest ----
console.log('\n[3] Manifest');
try {
  var man = JSON.parse(fs.readFileSync(rel('manifest.webmanifest'), 'utf8'));
  ok('manifest is valid JSON');
  var missing = (man.icons || []).map(function (i) { return i.src; }).filter(function (src) { return !fs.existsSync(rel(src)); });
  if (missing.length) bad('declared icons missing', missing.join(', ')); else ok('declared icons exist on disk');
} catch (e) { bad('manifest', e.message); }

// ---- 4. service worker ----
console.log('\n[4] Service worker');
try {
  var sw = fs.readFileSync(rel('service-worker.js'), 'utf8');
  if (!/var CACHE = '[^']+'/.test(sw)) bad('cache version', 'no CACHE constant'); else ok('cache version declared (' + sw.match(/var CACHE = '([^']+)'/)[1] + ')');
  var shell = (sw.match(/var SHELL = \[([\s\S]*?)\];/) || [])[1] || '';
  var localPaths = (shell.match(/'\.\/[^']*'/g) || []).map(function (s) { return s.replace(/'/g, '').replace(/^\.\//, ''); }).filter(Boolean);
  var swMissing = localPaths.filter(function (p) { return p && !fs.existsSync(rel(p)); });
  if (swMissing.length) bad('precached shell file missing', swMissing.join(', ')); else ok('all ' + localPaths.length + ' precached shell files exist');
} catch (e) { bad('service worker', e.message); }

// ---- 5. community server round-trip ----
console.log('\n[5] Community server round-trip');
function reqJSON(opts, body) {
  return new Promise(function (resolve, reject) {
    var r = http.request(opts, function (res) {
      var d = ''; res.on('data', function (c) { d += c; });
      res.on('end', function () { try { resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: {} }); } });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}
function post(port, p, body) { return reqJSON({ host: '127.0.0.1', port: port, path: p, method: 'POST', headers: { 'Content-Type': 'application/json' } }, body); }
function get(port, p) { return reqJSON({ host: '127.0.0.1', port: port, path: p, method: 'GET' }); }

(function runServerTest() {
  var PORT = 8911;
  var DATA = path.join(require('os').tmpdir(), 'owl-ci-' + process.pid + '.json');
  var srv = cp.spawn(process.execPath, [rel('server/server.js')], { env: Object.assign({}, process.env, { PORT: String(PORT), DATA_FILE: DATA, ALLOW_ORIGIN: 'https://example.test' }), stdio: 'ignore' });
  var done = function (code) {
    try { srv.kill('SIGKILL'); } catch (e) {}
    try { fs.unlinkSync(DATA); } catch (e) {}
    console.log('\n' + (fails.length ? ('FAILED: ' + fails.length + ' check(s)\n - ' + fails.join('\n - ')) : ('ALL ' + passes + ' CHECKS PASSED')));
    process.exit(fails.length ? 1 : 0);
  };
  setTimeout(function () {
    Promise.resolve()
      .then(function () { return get(PORT, '/api/v1/health'); })
      .then(function (r) { if (r.status === 200 && r.body.ok) ok('server health'); else bad('server health', 'status ' + r.status); })
      .then(function () { return post(PORT, '/api/v1/sightings', { clientId: 'ci-a', kind: 'sighting', species: 'moose', lat: 45.5, lng: -79.5, when: '2026-07-24T14:00:00.000Z' }); })
      .then(function (r) { if (r.status === 400) ok('submit without token rejected'); else bad('submit without token', 'expected 400, got ' + r.status); })
      .then(function () { return post(PORT, '/api/v1/sightings', { clientId: 'ci-a', token: 'secretA', kind: 'sighting', species: 'moose', lat: 45.5, lng: -79.5, when: '2026-07-24T14:00:00.000Z' }); })
      .then(function (r) { if (r.status === 200 && r.body.accepted) ok('submit with token accepted'); else bad('submit with token', JSON.stringify(r.body)); })
      .then(function () { return post(PORT, '/api/v1/sightings', { clientId: 'ci-a', token: 'WRONG', kind: 'sighting', species: 'deer', lat: 45.5, lng: -79.5 }); })
      .then(function (r) { if (r.status === 403) ok('wrong token rejected'); else bad('wrong token', 'expected 403, got ' + r.status); })
      .then(function () { return post(PORT, '/api/v1/sightings', { clientId: 'ci-b', token: 'secretB', kind: 'bear', species: 'american-black-bear', sensitive: false, lat: 45.123, lng: -79.987, when: '2026-07-24T15:00:00.000Z' }); })
      .then(function () { return get(PORT, '/api/v1/community?lat=45.2&lng=-80&km=60&days=7'); })
      .then(function (r) {
        var bear = (r.body.bears || [])[0];
        if (bear && Math.abs(bear.lat - 45.2) < 1e-9) ok('bear coords forced to ~22km grid server-side'); else bad('bear geoprivacy', JSON.stringify(bear));
      })
      .then(function () { return post(PORT, '/api/v1/delete', { clientId: 'ci-a', token: 'WRONG' }); })
      .then(function (r) { if (r.status === 403) ok('delete with wrong token rejected'); else bad('delete auth', 'expected 403, got ' + r.status); })
      .then(function () { return post(PORT, '/api/v1/delete', { clientId: 'ci-a', token: 'secretA' }); })
      .then(function (r) { if (r.status === 200 && r.body.deleted >= 1) ok('delete with correct token works'); else bad('delete', JSON.stringify(r.body)); })
      .then(done, function (e) { bad('server round-trip', e.message); done(); });
  }, 700);
})();
