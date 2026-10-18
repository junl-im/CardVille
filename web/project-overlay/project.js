/* CardVille v0.4 game enhancements. External layer; original engine is preserved. */
(() => {
  'use strict';
  // v0.5: 250 Korean stage names without altering level IDs or scoring.
  const cvWorldNames=["사탕 골짜기", "막대사탕 숲", "젤리 바다", "초콜릿 산맥", "무지개 하늘", "설탕 성", "말랑별 은하", "캐러멜 협곡", "토피 설원", "수정 동굴"];
  const cvStageNames=["반짝이는 첫걸음", "달콤한 길목", "숨은 보석 찾기", "새로운 갈림길", "깜짝 도전", "빛나는 샛길", "세 갈래 기회", "선물 상자", "별들의 속삭임", "반짝 폭발", "수상한 문", "뒤섞인 길", "작은 기적", "아슬아슬한 순간", "다섯 색의 비밀", "거센 파도", "숨은 문양", "꼬인 퍼즐", "빛의 연쇄", "순간의 선택", "마지막 열쇠", "거대한 도전", "황금빛 실마리", "최후의 시험", "전설의 관문"];
  // v0.6: the original 250 stage records are Korean before any module reads them.
  // The above Korean arrays remain for validation and older saved progress compatibility.
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

  // 라니팡 v0.7: only left-button drag or one-finger swipe can swap ordinary tiles.
  // A right click, click-click, long press or accidental tap cannot swap gems.
  const board = document.getElementById('board');
  if (!board) return;
  let gesture = null;
  let suppressClickUntil = 0;
  const getCell = el => {
    const cell = el?.closest?.('.cell');
    return cell && board.contains(cell) ? cell : null;
  };
  function cleanup() {
    board.querySelectorAll('.cv-dragging,.cv-drag-target').forEach(cell => {
      cell.classList.remove('cv-dragging','cv-drag-target');
      cell.style.removeProperty('--cv-dx');
      cell.style.removeProperty('--cv-dy');
    });
    gesture = null;
  }
  function destination(s, x, y) {
    const dx = x-s.x, dy = y-s.y;
    const threshold = Math.max(12, Math.min(22, s.width*0.24));
    if (Math.hypot(dx,dy) < threshold) return null;
    const dr = Math.abs(dy) > Math.abs(dx) ? Math.sign(dy) : 0;
    const dc = dr ? 0 : Math.sign(dx);
    const nr=s.r+dr, nc=s.c+dc;
    if (nr<0||nr>=ROWS||nc<0||nc>=COLS) return null;
    if(state.locked[nr*COLS+nc]||state.walls[nr*COLS+nc]) return null;
    return [nr,nc];
  }
  board.addEventListener('pointerdown', e => {
    // Right/middle click is prohibited on the entire game view, no drag initiates.
    if (e.button!==0 || (e.pointerType==='mouse' && (e.buttons&1)!==1)) return;
    if (gesture && (gesture.pointerId!==e.pointerId || performance.now()-gesture.started>1500) && !board.hasPointerCapture?.(gesture.pointerId)) cleanup();
    if (gesture || typeof state === 'undefined' || state.animating || state.activeBooster || document.getElementById('lany-go-intro')?.hidden===false) return;
    if (document.querySelector('.overlay[style*="flex"]')) return;
    const cell=getCell(e.target);
    if (!cell) return;
    const r=Number(cell.dataset.r),c=Number(cell.dataset.c);
    if(state.locked[r*COLS+c]||state.walls[r*COLS+c]) return;
    gesture={pointerId:e.pointerId,r,c,x:e.clientX,y:e.clientY,width:cell.getBoundingClientRect().width,target:null,started:performance.now()};
    try { board.setPointerCapture?.(e.pointerId); } catch (_) { /* synthetic/test or interrupted pointer */ }
    cell.classList.add('cv-dragging');
    clearHint();
    e.preventDefault();
  });
  board.addEventListener('pointermove', e => {
    if(!gesture || e.pointerId!==gesture.pointerId) return;
    if(e.pointerType==='mouse' && (e.buttons&1)===0){cleanup();return;}
    const s=gesture;
    const cell=board.querySelector(`.cell[data-r="${s.r}"][data-c="${s.c}"]`);
    const scale=s.width*.46;
    const dx=Math.max(-scale,Math.min(scale,e.clientX-s.x));
    const dy=Math.max(-scale,Math.min(scale,e.clientY-s.y));
    if(cell){cell.style.setProperty('--cv-dx',`${dx}px`);cell.style.setProperty('--cv-dy',`${dy}px`);}
    const next=destination(s,e.clientX,e.clientY);
    board.querySelectorAll('.cv-drag-target').forEach(node=>node.classList.remove('cv-drag-target'));
    if(next){board.querySelector(`.cell[data-r="${next[0]}"][data-c="${next[1]}"]`)?.classList.add('cv-drag-target');}
    s.target=next;
    e.preventDefault();
  });
  board.addEventListener('pointerup', e => {
    if(!gesture || e.pointerId!==gesture.pointerId) return;
    const s=gesture;
    const to=destination(s,e.clientX,e.clientY);
    cleanup();
    try{if(board.hasPointerCapture?.(e.pointerId))board.releasePointerCapture(e.pointerId);}catch(_){}
    suppressClickUntil=performance.now()+420;
    e.preventDefault();
    if(!to || state.animating || state.activeBooster || state.locked[s.r*COLS+s.c]) return;
    state.selected=null;
    clearHint();
    snd_swap();
    void trySwap(s.r,s.c,to[0],to[1]);
  });
  board.addEventListener('pointercancel', cleanup);
  board.addEventListener('lostpointercapture', cleanup);
  window.addEventListener('pointerup', e=>{if(gesture&&e.pointerId===gesture.pointerId)cleanup()});
  window.addEventListener('pointercancel', cleanup);
  window.addEventListener('blur',cleanup);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanup()});
  board.addEventListener('click', e => {
    if (performance.now() < suppressClickUntil || !state.activeBooster) {
      e.preventDefault();e.stopImmediatePropagation();
    }
  }, true);

  // Entire game web page acts like a game, not a text-editing website.
  document.addEventListener('contextmenu', e=>e.preventDefault(),true);
  document.addEventListener('dragstart', e=>e.preventDefault(),true);
  document.addEventListener('selectstart',e=>{
    if(!e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))e.preventDefault();
  },true);
  // The imported game has a local-only leaderboard. Avoid claiming global ranking.
  const scores = document.getElementById('leaderboard');
  if (scores && !scores.previousElementSibling?.classList.contains('cv-local-caption')) {
    const cap = document.createElement('p');
    cap.className = 'cv-local-caption';
    cap.textContent = '🏆 이 기기의 기록입니다. 온라인 순위 기능은 서버 연동 후 제공됩니다.';
    scores.parentNode.insertBefore(cap,scores);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const app=document.getElementById('app');
    if(!app)return;
    const toolbar=document.createElement('nav');
    toolbar.className='cv-action-toolbar';
    toolbar.setAttribute('aria-label','추가 게임 메뉴');
    const additions=Array.from(document.querySelectorAll('body > button')).filter(el=>
      el.textContent.includes('오늘의 도전') || el.textContent.includes('단계 편집'));
    for (const btn of additions) {btn.removeAttribute('style');btn.classList.add('cv-secondary-btn');toolbar.append(btn);}
    const gameModes=document.getElementById('game-mode-bar');
    if(gameModes){
      gameModes.removeAttribute('style');
      const pvp=Array.from(gameModes.querySelectorAll('button')).find(x=>x.textContent.includes('2인 대전'));
      if(pvp){pvp.textContent='👥 2인 대전 (시험용)';pvp.title='원격 매칭은 개발 중이며 같은 기기 대전부터 시험합니다';}
      toolbar.append(gameModes);
    }
    const leaderboard=document.getElementById('leaderboard');
    const caption=document.querySelector('.cv-local-caption');
    app.append(toolbar);
    if(caption)app.append(caption);
    if(leaderboard)app.append(leaderboard);
  });
  console.info('[라니팡 v0.7] Korean drag-only play ready');
})();
