'use strict';
// Local convenience smoke: NODE_PATH=<directory containing playwright> node tests/verify-ui-v22-local.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('playwright');
(async () => {
  fs.mkdirSync('docs/ui-v22', {recursive: true});
  const browser = await chromium.launch({headless: true});
  const results = [];
  for (const [width, height, mobile] of [[320, 568, true], [390, 844, true], [1366, 768, false]]) {
    const context = await browser.newContext({viewport: {width, height}, isMobile: mobile,
      hasTouch: mobile, serviceWorkers: 'block'});
    const page = await context.newPage();
    const errors = [], missing = [], vectors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => {if(r.status() >= 400) missing.push(r.url());});
    page.on('request', r => {if(/\.svg(?:[?#]|$)/i.test(r.url())) vectors.push(r.url());});
    await page.goto('http://127.0.0.1:8765/?v=2.2.0', {waitUntil: 'load'});
    await page.waitForFunction(() => window.LanyShell && window.LanyNumbers22);
    assert.match(await page.locator('#lany-title').evaluate(e => getComputedStyle(e).backgroundImage),
      /title-garden\.webp/);
    assert((await page.locator('#lany-install-button img').evaluate(e => e.naturalWidth)) > 0);
    await page.screenshot({path: 'docs/ui-v22/' + width + '-title.png'});
    assert.equal(await page.locator('#lany-title-sound').getAttribute('aria-pressed'), 'false');
    await page.locator('#lany-start-button').click();
    assert(await page.locator('#lany-world-map').isVisible());
    await page.screenshot({path: 'docs/ui-v22/' + width + '-map.png'});
    await page.locator('#lany-map-continue').click();
    assert(await page.locator('#lany-stage-prep').isVisible());
    assert((await page.locator('#lany-prep-goal img').count()) > 0);
    await page.locator('#lany-prep-play').click();
    assert.equal(await page.locator('#board .cell').count(), 64);
    assert((await page.locator('#score-val img').count()) > 0);
    assert.match(await page.locator('#app>.header .hud').evaluate(e => getComputedStyle(e).backgroundImage),
      /individual\/hud-frame\.webp/);
    assert.match(await page.locator('.lany-game-nav .lany-game-pause-button').evaluate(e => getComputedStyle(e).backgroundImage),
      /individual\/button-pink\.webp/);
    await page.screenshot({path: 'docs/ui-v22/' + width + '-game.png'});
    for (const stars of [1, 2, 3]) {
      await page.evaluate(n => showWin(n), stars);
      assert.match(await page.locator('#win-stars img').getAttribute('src'), new RegExp('star-' + stars + '\\.webp$'));
      await page.waitForFunction(() => {
        const image = document.querySelector('#win-stars img');
        return image?.complete && image.naturalWidth > 0;
      });
      if (stars === 3) await page.screenshot({path: 'docs/ui-v22/' + width + '-result.png'});
    }
    await page.evaluate(() => showLose());
    assert.match(await page.locator('#overlay-lose h2').evaluate(e => getComputedStyle(e).backgroundImage),
      /fail-banner\.webp/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 3), true);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    assert.deepEqual(vectors, []);
    results.push({viewport: width + 'x' + height, pass: true});
    await context.close();
  }
  const offline = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'allow'});
  const installed = await offline.newPage();
  await installed.goto('http://127.0.0.1:8765/?v=2.2.0', {waitUntil: 'load'});
  await installed.evaluate(() => navigator.serviceWorker.ready);
  await installed.waitForFunction(async () => (await caches.keys()).some(k => k.includes('v2.2.0')));
  await offline.setOffline(true);
  await installed.reload({waitUntil: 'load'});
  assert(await installed.locator('#lany-start-button').isVisible(), 'Offline PWA title did not load');
  assert((await installed.locator('.lany-illustrated-logo img').evaluate(e => e.naturalWidth)) > 0,
    'Offline PWA logo missing');
  await offline.close();
  results.push({offlinePwa: true, pass: true});
  await browser.close();
  console.log(JSON.stringify(results));
})().catch(error => {console.error(error); process.exitCode = 1;});
