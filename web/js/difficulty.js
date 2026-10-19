// Sweet Crush — Difficulty Levels
// Easy / Normal / Hard / Expert — affects board size, candy types, moves, targets

const Difficulty = (function() {
  const LEVELS = {
    easy: {
      label: '😊 쉬움',
      color: '#22c55e',
      gridSize: 6,
      candyTypes: 4,
      movesPerLevel: 30,
      targetMultiplier: 0.7,
      description: '6×6 판 · 블록 4종 · 30회 이동',
      timeLimit: null,
    },
    normal: {
      label: '😐 보통',
      color: '#3b82f6',
      gridSize: 8,
      candyTypes: 5,
      movesPerLevel: 20,
      targetMultiplier: 1.0,
      description: '8×8 판 · 블록 5종 · 20회 이동',
      timeLimit: null,
    },
    hard: {
      label: '😤 어려움',
      color: '#f59e0b',
      gridSize: 8,
      candyTypes: 6,
      movesPerLevel: 15,
      targetMultiplier: 1.4,
      description: '8×8 판 · 블록 6종 · 15회 이동 · 높은 목표',
      timeLimit: null,
    },
    expert: {
      label: '💀 전문가',
      color: '#ef4444',
      gridSize: 9,
      candyTypes: 7,
      movesPerLevel: 12,
      targetMultiplier: 2.0,
      description: '9×9 판 · 블록 7종 · 12회 이동 · 60초 제한',
      timeLimit: 60,
    },
  };

  let current = 'normal';
  try { current = localStorage.getItem('crushDifficulty') || 'normal'; } catch (_) {}

  function get() { return LEVELS[current] || LEVELS.normal; }
  function getKey() { return current; }

  function set(key) {
    if (!LEVELS[key]) return;
    current = key;
    try { localStorage.setItem('crushDifficulty', key); } catch (_) {}
    applyToGame();
  }

  function applyToGame() {
    const d = get();
    // Expose to game engine via window globals
    window.DIFFICULTY_CONFIG = d;
    // Show toast
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;top:120px;left:50%;transform:translateX(-50%);
      background:${d.color};color:#fff;padding:10px 24px;border-radius:20px;
      font-weight:700;z-index:9999;pointer-events:none;transition:opacity 0.4s`;
    t.textContent = `${d.label} 난이도가 선택됐습니다!`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),400); }, 1800);
  }

  let currentPage=0;
  function renderModal(){
    const modal=document.getElementById('difficulty-modal');if(!modal)return;
    modal.replaceChildren();
    const card=document.createElement('div');card.className='lany-difficulty-card';card.setAttribute('role','dialog');
    card.setAttribute('aria-label','시험용 난이도 선택');card.setAttribute('aria-modal','true');
    const title=document.createElement('h2');title.textContent='⚙️ 난이도 선택 (시험용)';
    const note=document.createElement('p');note.className='lany-difficulty-note';
    note.textContent='이 메뉴는 시험용이며 실제 모험 맵 250단계 난이도에는 적용되지 않아요.';
    const options=document.createElement('div');options.className='lany-difficulty-options';
    const entries=Object.entries(LEVELS),pages=Math.ceil(entries.length/2);
    for(const [key,d] of entries.slice(currentPage*2,currentPage*2+2)){
      const btn=document.createElement('button');btn.type='button';btn.className='lany-difficulty-option';
      btn.style.setProperty('--diff-color',d.color);btn.setAttribute('aria-pressed',String(current===key));
      const name=document.createElement('b');name.textContent=d.label;
      const description=document.createElement('span');description.textContent=d.description;
      btn.append(name,description);btn.addEventListener('click',()=>choose(key));options.append(btn);
    }
    const pager=document.createElement('nav');pager.className='lany-game-pager';
    pager.setAttribute('aria-label','난이도 페이지');
    const prev=document.createElement('button');prev.type='button';prev.className='lany-page-arrow';
    prev.textContent='◀ 이전';prev.disabled=currentPage===0;prev.addEventListener('click',()=>page(-1));
    const status=document.createElement('span');status.setAttribute('role','status');
    status.textContent=(currentPage+1)+' / '+pages;
    const next=document.createElement('button');next.type='button';next.className='lany-page-arrow';
    next.textContent='다음 ▶';next.disabled=currentPage>=pages-1;next.addEventListener('click',()=>page(1));
    pager.append(prev,status,next);
    const closeButton=document.createElement('button');closeButton.type='button';
    closeButton.className='lany-difficulty-close';closeButton.textContent='닫기';closeButton.addEventListener('click',close);
    card.append(title,note,options,pager,closeButton);modal.append(card);
  }
  function showModal(){
    let modal=document.getElementById('difficulty-modal');
    if(!modal){modal=document.createElement('div');modal.id='difficulty-modal';document.body.appendChild(modal);}
    currentPage=0;modal.style.display='flex';renderModal();modal.querySelector('.lany-difficulty-option')?.focus();
  }
  function page(delta){const m=document.getElementById('difficulty-modal');if(!m||m.style.display==='none')return;currentPage=Math.max(0,Math.min(1,currentPage+delta));renderModal();}
  function choose(key){set(key);close();}
  function close(){const m=document.getElementById('difficulty-modal');if(m)m.style.display='none';}

  // Init
  window.DIFFICULTY_CONFIG = LEVELS[current];

  function getBadge() {
    const d = LEVELS[current];
    return `<span style="background:${d.color}22;color:${d.color};border:1px solid ${d.color}55;
      border-radius:20px;padding:2px 8px;font-size:0.7rem;font-weight:700">${d.label}</span>`;
  }

  return { get, getKey, set, showModal, page, choose, close, getBadge, LEVELS };
})();

window.Difficulty = Difficulty;
