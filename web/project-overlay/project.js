/* CardVille v0.4 game enhancements. External layer; original engine is preserved. */
(() => {
  'use strict';
  // Intentional, reproducible beta goal adjustment for 250 original stages.
  if (typeof LEVELS !== 'undefined' && window.CardVilleBalance) {
    const summary = window.CardVilleBalance.apply(LEVELS);
    console.info('[CardVille v0.4] Provisional goals calibrated:', summary.filter(x=>x.changed).length, 'of', summary.length);
  }

  // Make boosters accessible with keyboard (native handlers remain the same).
  for (const element of document.querySelectorAll('.booster')) {
    if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
    element.setAttribute('role','button');
    element.addEventListener('keydown',(e)=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); element.click(); }
    });
  }

  // A gesture becomes a swap only between two distinct neighbouring cells.
  // Pointer events work on mouse and touch, avoiding the old touchstart+click double action.
  const board = document.getElementById('board');
  if (!board) return;
  let start = null;
  let suppressClickUntil = 0;
  const position = (element) => {
    const cell = element && element.closest && element.closest('.cell');
    return cell && board.contains(cell) ? [Number(cell.dataset.r),Number(cell.dataset.c)] : null;
  };
  board.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || typeof state === 'undefined' || state.animating) return;
    const from = position(e.target);
    if (!from) return;
    start = { pointerId: e.pointerId, from, x:e.clientX, y:e.clientY };
  });
  board.addEventListener('pointerup', (e) => {
    if (!start || e.pointerId !== start.pointerId) return;
    const s = start; start = null;
    if (typeof state === 'undefined' || state.animating || state.activeBooster) return;
    if (Math.hypot(e.clientX-s.x,e.clientY-s.y)<18) return;
    const to = position(document.elementFromPoint(e.clientX,e.clientY));
    if (!to || !isAdjacent(s.from[0],s.from[1],to[0],to[1])) return;
    if (state.locked[s.from[0]*COLS+s.from[1]] || state.locked[to[0]*COLS+to[1]]) return;
    suppressClickUntil = performance.now() + 500;
    e.preventDefault();
    state.selected = null;
    clearHint();
    snd_swap();
    void trySwap(s.from[0],s.from[1],to[0],to[1]);
  });
  board.addEventListener('pointercancel', () => {start = null;});
  board.addEventListener('click', (e) => {
    if (performance.now() < suppressClickUntil) { e.preventDefault();e.stopPropagation(); }
  }, true);

  // The imported game has a local-only leaderboard. Avoid claiming global ranking.
  const scores = document.getElementById('leaderboard');
  if (scores && !scores.previousElementSibling?.classList.contains('cv-local-caption')) {
    const cap = document.createElement('p');
    cap.className = 'cv-local-caption';
    cap.textContent = '🏆 이 기기의 기록입니다. 온라인 랭킹은 Firebase 연결 후 제공됩니다.';
    scores.parentNode.insertBefore(cap,scores);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const app=document.getElementById('app');
    if(!app)return;
    const toolbar=document.createElement('nav');
    toolbar.className='cv-action-toolbar';
    toolbar.setAttribute('aria-label','추가 게임 메뉴');
    const additions=Array.from(document.querySelectorAll('body > button')).filter(el=>
      el.textContent.includes('Daily') || el.textContent.includes('Level Editor'));
    for (const btn of additions) {btn.removeAttribute('style');btn.classList.add('cv-secondary-btn');toolbar.append(btn);}
    const gameModes=document.getElementById('game-mode-bar');
    if(gameModes){
      gameModes.removeAttribute('style');
      const pvp=Array.from(gameModes.querySelectorAll('button')).find(x=>x.textContent.includes('Players'));
      if(pvp){pvp.textContent='👥 2인 대전 (시험용)';pvp.title='원격 매칭은 개발 중이며 같은 기기 대전부터 시험합니다';}
      toolbar.append(gameModes);
    }
    const leaderboard=document.getElementById('leaderboard');
    const caption=document.querySelector('.cv-local-caption');
    app.append(toolbar);
    if(caption)app.append(caption);
    if(leaderboard)app.append(leaderboard);
  });
  console.info('[CardVille v0.4] Input and difficulty enhancements loaded');
})();
