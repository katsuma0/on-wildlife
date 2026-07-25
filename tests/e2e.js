/* Headless UI smoke test, core flows. Run: `node tests/e2e.js`
   Requires Playwright (`npm install && npx playwright install chromium`) and a
   static server serving the app (BASE, default http://localhost:8000/index.html). */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8000/index.html';

(async () => {
  const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const results = [];
  const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  [' + extra + ']' : '')); };

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const getStarted = await page.$('[data-action="accept-privacy"]');
  if (getStarted) { await getStarted.click(); await page.waitForTimeout(300); }

  ok('app loaded, no JS errors so far', errors.length === 0, errors.join(' | '));

  await page.click('[data-action="open-log"]');
  await page.waitForTimeout(300);
  ok('log sheet visible', !!(await page.$('#sheet.show')));

  const role = await page.getAttribute('#sheet', 'role');
  const modal = await page.getAttribute('#sheet', 'aria-modal');
  const appInert = await page.$eval('#app', el => el.hasAttribute('inert'));
  ok('sheet role=dialog', role === 'dialog', 'role=' + role);
  ok('sheet aria-modal=true', modal === 'true');
  ok('#app inert while sheet open', appInert === true);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok('Escape closed the sheet', !(await page.$('#sheet.show')));
  const appInert2 = await page.$eval('#app', el => el.hasAttribute('inert'));
  ok('#app inert removed after close', appInert2 === false);

  await page.click('[data-action="open-log"]');
  await page.waitForTimeout(300);
  await page.click('[data-action="pick-species"]');
  await page.waitForTimeout(300);
  ok('picker opened', !!(await page.$('#picker-root')));
  await page.click('#picker-list [data-action="select-species"]');
  await page.waitForTimeout(300);
  await page.fill('#f-notes', 'test note alpha');
  await page.click('[data-action="save-entry"]');
  await page.waitForTimeout(500);
  ok('entry saved (sheet closed)', !(await page.$('#sheet.show')));

  await page.evaluate(() => { location.hash = '#/mylog'; });
  await page.waitForTimeout(400);
  let entryCount = await page.$$eval('[data-action="open-entry"]', els => els.length);
  ok('one entry in log after save', entryCount === 1, 'count=' + entryCount);

  await page.click('[data-action="open-entry"]');
  await page.waitForTimeout(300);
  const editBtn = await page.$('[data-action="edit-entry"]');
  ok('edit button present on entry', !!editBtn);
  await editBtn.click();
  await page.waitForTimeout(300);
  const title = await page.$eval('#sheet .sheet-nav .t', el => el.textContent).catch(() => null);
  ok('edit sheet titled "Edit Encounter"', title === 'Edit Encounter', 'title=' + title);
  const notesVal = await page.$eval('#f-notes', el => el.value).catch(() => null);
  ok('notes pre-filled in edit', notesVal === 'test note alpha', 'notes=' + notesVal);
  await page.fill('#f-notes', 'edited note beta');
  await page.click('[data-action="save-entry"]');
  await page.waitForTimeout(500);

  await page.evaluate(() => { location.hash = '#/mylog'; });
  await page.waitForTimeout(400);
  entryCount = await page.$$eval('[data-action="open-entry"]', els => els.length);
  ok('still one entry after edit (in-place)', entryCount === 1, 'count=' + entryCount);
  const persistedNote = await page.evaluate(() => new Promise(res => {
    try {
      const r = indexedDB.open('owl-db');
      r.onsuccess = () => {
        const db = r.result, tx = db.transaction('entries', 'readonly'), all = tx.objectStore('entries').getAll();
        all.onsuccess = () => res((all.result[0] && all.result[0].notes) || 'NONE');
        all.onerror = () => res('ERR');
      };
      r.onerror = () => res('OPENERR');
    } catch (e) { res('EX:' + e.message); }
  }));
  ok('persisted note updated in place', persistedNote === 'edited note beta', 'note=' + persistedNote);

  await page.evaluate(() => { location.hash = '#/search'; });
  await page.waitForTimeout(300);
  const exLabel = await page.getAttribute('#uni-search', 'aria-label');
  ok('search screen input has aria-label', exLabel === 'Search', 'label=' + exLabel);

  const toastLive = await page.getAttribute('#toast-root', 'aria-live');
  ok('toast-root aria-live=polite', toastLive === 'polite');

  const tabColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tab-inactive').trim());
  ok('--tab-inactive token defined', !!tabColor, 'val=' + tabColor);

  ok('no JS errors during whole run', errors.length === 0, errors.slice(0, 4).join(' | '));

  console.log('\n===== E2E (core flows) =====');
  console.log(results.join('\n'));
  const fails = results.filter(r => r.startsWith('FAIL'));
  console.log('\n' + (fails.length ? (fails.length + ' FAILURE(S)') : 'ALL PASSED'));
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
