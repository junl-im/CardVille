/* CardVille Match-3 keyboard controls and accessibility. */
(() => {
  'use strict';
  let focusRow = 0, focusCol = 0;
  let keyboardMode = false;
  const GRID_SIZE = 8;
  const board = document.getElementById('board');
  function getCell(r,c) { return board?.children?.[r*GRID_SIZE+c] || null; }
  function decorate() {
    for (const cell of board?.querySelectorAll('.cell') || []) {
      const r=Number(cell.dataset.r),c=Number(cell.dataset.c);
      if(cell.getAttribute('role')!=='button')cell.setAttribute('role','button');
      const tabStop=r===focusRow && c===focusCol ? 0 : -1;
      if(cell.tabIndex!==tabStop)cell.tabIndex=tabStop;
      const content=cell.dataset.gameLabel||'빈 칸';
      const label=`퍼즐 ${r+1}행 ${c+1}열: ${content}${cell.classList.contains('locked')?' 잠김':''}`;
      if(cell.getAttribute('aria-label')!==label)cell.setAttribute('aria-label',label);
    }
  }
  document.addEventListener('focusin',e=>{keyboardMode=!!(board && board.contains(e.target));});
  function focusCell(r,c) {
    if(r<0||r>=GRID_SIZE||c<0||c>=GRID_SIZE) return;
    const previous=getCell(focusRow,focusCol);
    if(previous)previous.tabIndex=-1;
    focusRow=r;focusCol=c;
    const next=getCell(r,c);
    if(next){next.tabIndex=0;next.focus({preventScroll:true});}
  }
  if (board) {
    new MutationObserver(()=>{decorate();
      if(keyboardMode && !board.contains(document.activeElement)) getCell(focusRow,focusCol)?.focus({preventScroll:true});
    }).observe(board,{childList:true});
    decorate();
  }
  document.addEventListener('keydown', (e) => {
    const target=e.target;
    if (target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    if (document.querySelector('.overlay[style*="flex"]')) return;
    if (!board || !getCell(0,0)) return;
    // Keyboard controls only when board has focus; never hijack site-wide arrows.
    if (!board.contains(document.activeElement)) return;
    let moved=true;
    if(e.key==='ArrowUp') focusCell(focusRow-1,focusCol);
    else if(e.key==='ArrowDown') focusCell(focusRow+1,focusCol);
    else if(e.key==='ArrowLeft') focusCell(focusRow,focusCol-1);
    else if(e.key==='ArrowRight') focusCell(focusRow,focusCol+1);
    else if(e.key==='Enter'||e.key===' ') {
      if (typeof state !== 'undefined' && state.activeBooster) {
        getCell(focusRow,focusCol)?.click();
      }
      else if (typeof cvKeyboardSelect === 'function') {
        keyboardMode=true; cvKeyboardSelect(focusRow,focusCol);
        queueMicrotask(()=>getCell(focusRow,focusCol)?.focus({preventScroll:true}));
      }
    }
    else moved=false;
    if(moved) e.preventDefault();
  });
  function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    try { localStorage.setItem('crushHighContrast', String(document.body.classList.contains('high-contrast'))); } catch (_) {}
  }
  function toggleReducedMotion() {
    document.body.classList.toggle('reduced-motion');
    try { localStorage.setItem('crushReducedMotion', String(document.body.classList.contains('reduced-motion'))); } catch (_) {}
  }
  try {
    if(localStorage.getItem('crushHighContrast')==='true') document.body.classList.add('high-contrast');
    if(localStorage.getItem('crushReducedMotion')==='true') document.body.classList.add('reduced-motion');
  } catch (_) { /* Keep the game usable when browser storage is unavailable. */ }
  window.A11y={toggleHighContrast,toggleReducedMotion,decorate};
})();
