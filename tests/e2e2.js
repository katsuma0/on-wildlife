/* Headless UI smoke test, hardening behaviours (a11y states, picker inert,
   double-tap guard, community-payload privacy). Run: `node tests/e2e2.js`
   Requires Playwright + a static server (BASE, default localhost:8000). */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8000/index.html';

(async () => {
  const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    geolocation: { latitude: 45.556789, longitude: -79.556789, accuracy: 20 },
    permissions: ['geolocation'],
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const results = [];
  const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  [' + extra + ']' : '')); };

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const bannerShown = !!(await page.$('[data-action="accept-privacy"]'));
  ok('privacy gate shows on first run', bannerShown);
  if (bannerShown) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const gone = !(await page.$('[data-action="accept-privacy"]'));
    const consent = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('owl-settings') || '{}').seenPrivacy === true; } catch (e) { return false; } });
    ok('Escape dismissed the privacy gate', gone);
    ok('Escape recorded consent (seenPrivacy=true)', consent);
  }

  await page.evaluate(() => { location.hash = '#/log'; });
  await page.waitForTimeout(300);
  const cur = await page.$$eval('#tabbar .tab', els => els.filter(e => e.getAttribute('aria-current') === 'page').map(e => e.textContent.trim()));
  ok('exactly one tab has aria-current=page', cur.length === 1, 'tabs=' + JSON.stringify(cur));

  await page.click('[data-action="open-log"]');
  await page.waitForTimeout(300);
  await page.click('[data-action="pick-species"]');
  await page.waitForTimeout(300);
  const sheetInert = await page.$eval('#sheet', el => el.hasAttribute('inert'));
  ok('picker makes underlying log sheet inert', sheetInert === true);
  await page.click('#picker-list [data-action="select-species"]');
  await page.waitForTimeout(300);
  const sheetInert2 = await page.$eval('#sheet', el => el.hasAttribute('inert')).catch(() => 'no-sheet');
  ok('inert cleared after picker closes', sheetInert2 === false);
  const segPressed = await page.$$eval('.seg-opt', els => els.map(e => e.getAttribute('aria-pressed')));
  ok('segmented options expose aria-pressed', segPressed.length > 0 && segPressed.every(v => v === 'true' || v === 'false'), JSON.stringify(segPressed));
  ok('at least one evidence option pressed', segPressed.filter(v => v === 'true').length >= 1);

  // community payload: coarse coords + token + no name, when sharing on
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('owl-settings') || '{}');
    s.communityUrl = 'https://dummy.example'; s.community = true;
    localStorage.setItem('owl-settings', JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    window.__posts = [];
    const orig = window.fetch;
    window.fetch = function (url, opts) {
      try { if (String(url).indexOf('/api/v1/sightings') >= 0 && opts && opts.body) window.__posts.push(JSON.parse(opts.body)); } catch (e) {}
      if (String(url).indexOf('/api/v1/') >= 0) return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      return orig.apply(this, arguments);
    };
  });
  await page.click('[data-action="open-log"]');
  await page.waitForTimeout(300);
  await page.click('[data-action="pick-species"]');
  await page.waitForTimeout(300);
  await page.click('#picker-list [data-action="select-species"]');
  await page.waitForTimeout(300);
  await page.click('[data-action="use-location"]');
  await page.waitForTimeout(500);
  await page.click('[data-action="save-entry"]');
  await page.waitForTimeout(600);
  const posts = await page.evaluate(() => window.__posts || []);
  ok('exactly one community post per save (no double post)', posts.length === 1, 'count=' + posts.length);
  if (posts.length) {
    const p = posts[0];
    ok('outgoing lat is coarsened to ~5km grid', Math.abs(p.lat - Math.round(45.556789 * 20) / 20) < 1e-9, 'lat=' + p.lat);
    ok('outgoing payload carries an ownership token', typeof p.token === 'string' && p.token.length >= 16, 'tok len=' + ((p.token || '').length));
    ok('outgoing payload sends no name (PII)', p.name === '' || p.name == null, 'name=' + JSON.stringify(p.name));
    ok('outgoing when is blurred to the hour', typeof p.when === 'string' && /:00:00/.test(p.when), 'when=' + p.when);
  }

  ok('no JS errors during whole run', errors.length === 0, errors.slice(0, 4).join(' | '));

  console.log('\n===== E2E (hardening behaviours) =====');
  console.log(results.join('\n'));
  const fails = results.filter(r => r.startsWith('FAIL'));
  console.log('\n' + (fails.length ? (fails.length + ' FAILURE(S)') : 'ALL PASSED'));
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
