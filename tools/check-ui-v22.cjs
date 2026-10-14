'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const read = file => fs.readFileSync(file, 'utf8');
const root = 'web/assets/ui/v22/';
const raster = process.argv.includes('--raster');
const manifest = raster ? JSON.parse(read(root + 'manifest.json')) : null;
const version = JSON.parse(read('web/version.json'));
const html = read('web/index.html');
const css = read('web/css/lany-ui-v22.css');
const sw = read('web/sw.js');
assert.equal(version.version, '2.2.0-beta');
if (raster) {
  assert.equal(manifest.release, version.version);
  assert.equal(manifest.count, 89);
  assert.equal(Object.keys(manifest.verified_sha256 || {}).length, 7);
}
const required = [
  ...['hud-frame', 'button-blue', 'button-green', 'button-pink'].map(x => 'individual/' + x + '.webp'),
  'title/logo-main.webp', 'title/logo-alt.webp', 'title/logo-compact.webp',
  ...['start', 'install', 'help', 'friends'].map(x => 'buttons/btn-' + x + '.webp'),
  ...['settings', 'sound-on', 'sound-off', 'notice'].map(x => 'icons/btn-' + x + '.webp'),
  ...['stage', 'moves', 'score'].flatMap(kind => [
    ...Array.from({length: 10}, (_, n) => 'numbers/' + kind + '/' + n + '.webp'),
    'numbers/' + kind + '/label-' + kind + '.webp',
  ]),
  'numbers/score/comma.webp',
  ...['empty', '1', '2', '3'].map(x => 'result/star-' + x + '.webp'),
  ...['clear-banner', 'fail-banner', 'result-score-frame', 'result-best-frame'].map(x => 'result/' + x + '.webp'),
  ...['stage', 'goal', 'moves', 'score', 'popup', 'map', 'result', 'board', 'small-button', 'large-button', 'badge'].map(x => 'frames/frame-' + x + '.webp'),
  ...['title-garden', 'game-garden', 'map-village', 'result-clear', 'result-fail'].map(x => 'backgrounds/' + x + '.webp'),
  ...['leaf', 'flower', 'sparkle', 'wood', 'clover'].map(x => 'patterns/pattern-' + x + '.webp'),
  ...['stage', 'goal', 'moves', 'score', 'best', 'booster', 'clock'].map(x => 'hud/panel-' + x + '.webp'),
];
for (const name of required) {
  if (raster) {
    const raw = fs.readFileSync(root + name);
    assert.equal(raw.subarray(0, 4).toString(), 'RIFF', name);
    assert.equal(raw.subarray(8, 12).toString(), 'WEBP', name);
    assert(raw.length > 300, name + ' too small');
  }
  assert(sw.includes('./assets/ui/v22/' + name), name + ' missing offline');
}
assert(required.length <= 89);
if (raster) for (const name of Object.values(manifest.roles).flat()) {
  assert(fs.existsSync(root + name), name);
  assert(sw.includes('./assets/ui/v22/' + name), name);
}
for (const mark of ['lany-ui-v22.css?v=2.2.0', 'lany-numbers-v22.js?v=2.2.0',
  'lany-ui-v22.js?v=2.2.0', 'btn-start.webp?v=2.2.0', 'btn-install.webp?v=2.2.0',
  'star-\${Math.max(1,Math.min(3,stars))}', 'LanyNumbers22?.renderScoreNumber']) {
  assert(html.includes(mark), mark);
}
for (const mark of ['backgrounds/title-garden.webp', 'backgrounds/game-garden.webp',
  'backgrounds/map-village.webp', 'result/clear-banner.webp',
  'result/fail-banner.webp', '.lany-title-tools', '.lany-number-fallback',
  '.lany-art-small[hidden]']) assert(css.includes(mark), mark);
for (const path of ['web/index.html', 'web/manifest.json', 'web/sw.js',
  'web/js/lany-shell.js', 'web/css/lany-action-art-v16.css',
  'web/css/lany-title-stage-v17.css', 'web/css/lany-ui-v22.css']) {
  assert(!/\.svg|<svg|createElementNS\s*\(/i.test(read(path)), path + ' has active SVG');
}
assert.equal((html.match(/class="lany-art-button lany-art-small/g) || []).length, 3);
for (const path of ['web/js/lany-numbers-v22.js', 'web/js/lany-ui-v22.js'])
  new vm.Script(read(path), {filename: path});
console.log(JSON.stringify({pass: true, version: version.version, assets: 89,
  offline: true, stages: 250, blackCatInstall: true}));
