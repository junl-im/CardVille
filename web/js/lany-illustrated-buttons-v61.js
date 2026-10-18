/* One illustrated button system for every action outside the puzzle tiles. */
(() => {
  'use strict';
  const root = './assets/';
  const pictures = {
    green: root + 'v61/buttons/green-rabbit.webp',
    blue: root + 'v61/buttons/blue-map.webp',
    pink: root + 'v61/buttons/pink-bear.webp',
    gold: root + 'v61/buttons/gold-book.webp',
    purple: root + 'v61/buttons/purple-cat.webp',
    hard: root + 'v61/buttons/hard-bear.webp',
    crazy: root + 'v61/buttons/crazy-cat.webp'
  };
  const iconPictures = {
    'lany-world-prev':'v23/buttons/back.webp', 'lany-world-next':'v23/buttons/next.webp',
    'lany-map-prev':'v23/buttons/back.webp','lany-map-next':'v23/buttons/next.webp',
    'lany-prep-prev':'v23/buttons/back.webp','lany-prep-next':'v23/buttons/next.webp',
    'lany-help-prev':'v23/buttons/back.webp','lany-help-next':'v23/buttons/next.webp',
    'lany-friends-prev':'v23/buttons/back.webp','lany-friends-next':'v23/buttons/next.webp',
    'lany-editor-prev':'v23/buttons/back.webp','lany-editor-next':'v23/buttons/next.webp'
  };
  const skip = '#lany-title .lany-art-button, #lany-world-tabs button, #lany-map-levels button, #level-grid button, #board button, .booster, #ng-level-editor button[data-type], #editor-grid button';
  function realText(button) {
    return [...button.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('cv-illustrated-label')))
      .map(n => n.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
  }
  function choice(button, label) {
    const id = button.id;
    const modeArt = document.body.dataset.campaign === 'crazy' ? pictures.crazy : document.body.dataset.campaign === 'hard' ? pictures.hard : pictures.green;
    if (iconPictures[id]) return ['icon', root + iconPictures[id]];
    if (button.matches('.lany-install-close,.lany-friends-close')) return ['icon', root + 'v23/buttons/close.webp'];
    if (id === 'music-btn') return ['icon', root + 'v23/buttons/music.webp'];
    if (button.matches('#app>.header .hud button[data-lany-art="pause"]')) return ['icon', root + 'v53/control.webp'];
    if (button.matches('#ng-level-editor>div>div:first-child>button:first-of-type:not([data-type])')) return ['icon', root + 'v23/buttons/close.webp'];
    if (button.classList.contains('lany-page-arrow') || button.matches('#difficulty-modal .lany-page-arrow')) {
      return ['icon', root + (/다음|▶|›/.test(label) ? 'v23/buttons/next.webp' : 'v23/buttons/back.webp')];
    }
    if (id === 'lany-mode-normal') return ['art', pictures.green, '노멀'];
    if (id === 'lany-mode-hard') return ['art', pictures.hard, '하드'];
    if (id === 'lany-mode-crazy') return ['art', pictures.crazy, '크레이지'];
    if (button.classList.contains('lany-difficulty-option')) {
      const name = button.querySelector('b')?.textContent?.trim() || label;
      const detail = button.querySelector('span')?.textContent || '';
      const board = detail.match(/\d+\s*[×x]\s*\d+/)?.[0] || '';
      const moves = detail.match(/\d+\s*회/)?.[0] || '';
      return ['art', pictures.gold, [name, [board,moves].filter(Boolean).join(' · ')].filter(Boolean).join('\n')];
    }
    if (id === 'lany-map-continue') return ['art', modeArt, '이어서 도전'];
    if (id === 'lany-map-resume') return ['art', modeArt, '퍼즐 계속'];
    if (id === 'lany-prep-play') return ['art', modeArt, '이 단계 시작'];
    if (/다시|재도전/.test(label)) return ['art', pictures.hard];
    if (/계속|이어서|시작/.test(label)) return ['art', pictures.green];
    if (/크레이지|광폭/.test(label)) return ['art', pictures.crazy];
    if (/하드/.test(label)) return ['art', pictures.hard];
    if (/나가기|종료|취소|닫기|그만/.test(label)) return ['art', pictures.pink];
    if (/맵|지도|이전|돌아가기|첫 화면|처음 화면|홈/.test(label)) return ['art', pictures.blue];
    if (/도감|방법|설정|편집|난이도|기록|도전|도움|오늘/.test(label)) return ['art', pictures.gold];
    if (/2인|대전|친구|초대|설치/.test(label)) return ['art', pictures.purple];
    return ['art', pictures.green];
  }
  function paint(button) {
    if (button.matches(skip)) return;
    const label = realText(button) || button.getAttribute('aria-label') || '';
    if (!label) return;
    const [kind, path, shortLabel] = choice(button, label);
    const key = kind + '|' + path + '|' + (shortLabel || label);
    if (button.dataset.cvPictureKey === key && (kind !== 'art' || button.querySelector(':scope > .cv-illustrated-label'))) return;
    button.dataset.cvPictureKey = key;
    button.dataset.cvPicture = kind;
    button.style.setProperty('background-image', `url("${path}")`, 'important');
    button.style.setProperty('background-color', 'transparent', 'important');
    button.style.setProperty('background-size', kind === 'icon' ? 'contain' : '100% 100%', 'important');
    button.style.setProperty('background-position', 'center', 'important');
    button.style.setProperty('background-repeat', 'no-repeat', 'important');
    button.style.setProperty('border', '0', 'important');
    button.style.setProperty('box-shadow', 'none', 'important');
    button.style.setProperty('font-size', '0', 'important');
    button.style.setProperty('color', 'transparent', 'important');
    button.style.setProperty('text-shadow', 'none', 'important');
    button.style.setProperty('padding', '0', 'important');
    for (const child of button.children) if (!child.classList.contains('cv-illustrated-label')) child.style.setProperty('visibility','hidden','important');
    if (kind === 'icon' && button.matches('#lany-map-pager button,#lany-prep-pager button,.lany-friends-pager button,.lany-tutorial-pager button,#ng-level-editor .lany-editor-pager button,#difficulty-modal .lany-page-arrow')) {
      button.style.setProperty('width','clamp(38px,11vw,44px)','important');
      button.style.setProperty('height','clamp(38px,11vw,44px)','important');
      button.style.setProperty('min-width','38px','important');
    }
    if (button.matches('#overlay-win .modal-btns button[data-lany-art="map"],#overlay-win .modal-btns button[data-lany-art="retry"]')) {
      button.style.setProperty('width','100%','important');
      button.style.setProperty('height','44px','important');
      button.style.setProperty('min-height','44px','important');
      button.style.setProperty('max-height','44px','important');
    }
    if (button.matches('#mp-setup > div > button:last-child')) {
      button.style.setProperty('width','min(190px,65%)','important');
      button.style.setProperty('height','46px','important');
      button.style.setProperty('min-height','46px','important');
      button.style.setProperty('margin','8px auto 0','important');
      button.style.setProperty('display','block','important');
    }
    if (kind === 'art') {
      let word = button.querySelector(':scope > .cv-illustrated-label');
      if (!word) {
        word = document.createElement('span');
        word.className = 'cv-illustrated-label';
        word.setAttribute('aria-hidden', 'true');
        button.append(word);
      }
      word.textContent = shortLabel || label;
      word.style.setProperty('visibility','visible','important');
      word.style.setProperty('position','absolute','important');
      word.style.setProperty('display','flex','important');
      word.style.setProperty('align-items','center','important');
      word.style.setProperty('justify-content','center','important');
      word.style.setProperty('text-align','center','important');
      word.style.setProperty('line-height','1.12','important');
      word.style.setProperty('white-space','pre-line','important');
      word.style.setProperty('transform','none','important');
      word.style.setProperty('margin','0','important');
      word.style.setProperty('padding','0','important');
      word.style.setProperty('height','auto','important');
      word.style.setProperty('width','auto','important');
      word.style.setProperty('font-size','clamp(13px,3.3vw,17px)','important');
      if (button.matches('.lany-campaign-switch button')) word.style.setProperty('font-size','clamp(11px,3vw,14px)','important');
      if (button.matches('#lany-world-map .lany-map-bottom button,#lany-pause button,#lany-exit button,#lany-update-now,#overlay-win .modal-btns button,#overlay-lose .modal-btns button,#lany-extra-controls button')) {
        word.style.setProperty('font-size','12px','important');
        word.style.setProperty('left','33%','important');
        word.style.setProperty('right','4%','important');
      }
      word.style.setProperty('top','10%','important');
      word.style.setProperty('bottom','10%','important');
      word.style.setProperty('left','43%','important');
      word.style.setProperty('right','6%','important');
      if (button.matches('#lany-world-map .lany-map-bottom button,#lany-pause button,#lany-exit button,#lany-update-now,#overlay-win .modal-btns button,#overlay-lose .modal-btns button,#lany-extra-controls button')) {
        word.style.setProperty('left','33%','important');
        word.style.setProperty('right','4%','important');
      }
      if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', label);
    } else {
      const old = button.querySelector(':scope > .cv-illustrated-label');
      if (old) old.remove();
      if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', label);
    }
  }
  function paintAll() {
    document.querySelectorAll('button').forEach(paint);
    document.querySelectorAll('#lany-extra-controls button[data-cv-picture="art"]>.cv-illustrated-label').forEach(word => {
      word.style.setProperty('font-size','12px','important');
      word.style.setProperty('left','33%','important');
      word.style.setProperty('right','4%','important');
    });
  }
  let pending = false;
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; paintAll(); }); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintAll, {once:true}); else paintAll();
  new MutationObserver(mutations => {
    if (mutations.some(m =>
      m.type === 'attributes' && (m.attributeName === 'aria-pressed' && m.target.id === 'music-btn' || m.attributeName === 'data-campaign' && m.target === document.body) ||
      m.type === 'characterData' && m.target.parentElement?.closest('button') && !m.target.parentElement?.classList.contains('cv-illustrated-label') ||
      m.type === 'childList' && m.target.closest?.('button') && !m.target.closest('#board,#lany-map-levels,#level-grid') && ![...m.addedNodes].every(n => n.nodeType === 1 && n.classList?.contains('cv-illustrated-label')) ||
      [...m.addedNodes].some(n => n.nodeType === 1 && !n.classList?.contains('cv-illustrated-label') && (n.matches?.('button') || n.querySelector?.('button')))
    )) paintAll();
  }).observe(document.documentElement, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['aria-pressed','data-campaign']});
})();
