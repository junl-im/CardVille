/* Reusable raster numerals. The accessible text remains in the DOM for screen
 * readers, copy/paste, and existing game checks. */
(() => {
  'use strict';
  const ROOT = './assets/ui/v22/numbers/';
  function render(target, value, kind, suffix = '') {
    const node = typeof target === 'string' ? document.getElementById(target) : target;
    if (!node) return;
    const numeric = Number(value);
    const display = Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)).toLocaleString('en-US') : String(value);
    const spoken = display + suffix;
    if (node.dataset.lanyNumber === kind + ':' + spoken) return;
    node.dataset.lanyNumber = kind + ':' + spoken;
    node.classList.add('lany-image-number');
    node.setAttribute('aria-label', spoken);
    const fragment = document.createDocumentFragment();
    for (const digit of display) {
      if (!/[0-9,]/.test(digit)) continue;
      const img = document.createElement('img');
      img.src = ROOT + kind + '/' + (digit === ',' ? 'comma' : digit) + '.webp';
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      img.setAttribute('aria-hidden', 'true');
      fragment.appendChild(img);
    }
    const text = document.createElement('span');
    text.className = 'lany-number-fallback';
    text.textContent = spoken;
    fragment.appendChild(text);
    node.replaceChildren(fragment);
  }
  window.LanyNumbers22 = {
    render,
    renderStageNumber: (target, value, suffix = '') => render(target, value, 'stage', suffix),
    renderMovesNumber: (target, value, suffix = '') => render(target, value, 'moves', suffix),
    renderScoreNumber: (target, value, suffix = '') => render(target, value, 'score', suffix),
  };
})();
