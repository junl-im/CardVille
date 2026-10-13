/* Non-destructive progressive enhancement layer for the imported game. */
(() => {
  'use strict';
  for (const element of document.querySelectorAll('.booster')) {
    if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
    element.setAttribute('role','button');
    element.addEventListener('keydown',(e)=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); element.click(); }
    });
  }
  // Keep stage update and original game controls owned by upstream.
  console.info('[CardVille Match3] optional UI overlay loaded');
})();
