// Issue #8: Level Editor — create custom puzzles, share via URL
(function(){
  const CANDY_TYPES = ['🍭','🍬','🍡','🍰','🍩','🌈','💎'];
  let editGrid = Array.from({length:8}, () => Array(8).fill(0));
  let editTarget = 1000;
  let editMoves  = 20;
  let editorPage=0;

  function encodeLevel() {
    const flat = editGrid.flat().join('');
    return btoa(JSON.stringify({g:flat,t:editTarget,m:editMoves}));
  }

  function decodeLevel(hash) {
    try {
      const d = JSON.parse(atob(hash));
      editTarget = d.t; editMoves = d.m;
      editGrid = [];
      for(let r=0;r<8;r++) editGrid.push(d.g.slice(r*8,(r+1)*8).split('').map(Number));
    } catch {}
  }

  function buildEditorUI() {
    const div = document.createElement('div');
    div.id = 'ng-level-editor';
    div.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9998;overflow-y:auto;padding:20px';

    div.innerHTML = `
      <div style="max-width:520px;margin:0 auto;background:#1a1a2e;border-radius:20px;padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h2 style="color:#fff;font-size:1.1rem;margin:0">🎮 단계 편집기</h2>
          <button onclick="document.getElementById('ng-level-editor').style.display='none'"
            style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <label style="color:#aaa;font-size:.8rem;display:flex;align-items:center;gap:6px">
            목표 점수: <input id="ed-target" type="number" value="1000" min="100" step="100"
              style="width:80px;padding:4px 8px;border-radius:6px;border:1px solid #444;background:#0f0f1a;color:#fff;font-size:.8rem">
          </label>
          <label style="color:#aaa;font-size:.8rem;display:flex;align-items:center;gap:6px">
            이동 횟수: <input id="ed-moves" type="number" value="20" min="5" max="50"
              style="width:60px;padding:4px 8px;border-radius:6px;border:1px solid #444;background:#0f0f1a;color:#fff;font-size:.8rem">
          </label>
        </div>
        <div id="editor-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;margin-bottom:14px"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
          ${CANDY_TYPES.map((c,i)=>`<button type="button" data-type="${i}"
            style="font-size:1.4rem;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
            border-radius:8px;width:40px;height:40px;cursor:pointer">${c}</button>`).join('')}
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="shareLevel()" style="flex:1;padding:10px;background:#7c3aed;color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:.85rem;font-weight:700">📋 공유 주소 복사</button>
          <button onclick="randomFill()" style="padding:10px 14px;background:rgba(255,255,255,.1);color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:.85rem">🎲 무작위</button>
        </div>
        <p id="share-msg" style="color:#22c55e;font-size:.8rem;text-align:center;margin-top:10px;display:none">주소를 복사했습니다!</p>
      </div>`;

    document.body.appendChild(div);
    const panel=div.firstElementChild;
    const blocks=Array.from(panel.children);
    if(blocks.length>=6){
      const settings=blocks[1],grid=blocks[2],palette=blocks[3],actions=blocks[4],msg=blocks[5];
      const editPage=document.createElement('section');editPage.className='lany-editor-page';editPage.dataset.editorPage='0';
      const settingPage=document.createElement('section');settingPage.className='lany-editor-page';settingPage.dataset.editorPage='1';
      const shareButton=actions.querySelector('button:first-child');
      if(shareButton){shareButton.removeAttribute('onclick');shareButton.addEventListener('click',shareLevel);}
      const randomButton=actions.querySelector('button:last-child');
      if(randomButton){randomButton.removeAttribute('onclick');randomButton.addEventListener('click',randomFill);}
      for(const btn of palette.querySelectorAll('[data-type]')){
        btn.addEventListener('click',()=>{selectedType=Number(btn.dataset.type);palette.querySelectorAll('[data-type]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));});
      }
      palette.querySelector('[data-type="0"]')?.setAttribute('aria-pressed','true');
      editPage.append(grid,palette);
      if(randomButton)editPage.append(randomButton);
      settingPage.append(settings,actions,msg);
      const pager=document.createElement('nav');pager.className='lany-game-pager lany-editor-pager';
      pager.setAttribute('aria-label','단계 편집기 페이지');
      const prev=document.createElement('button');prev.type='button';prev.className='lany-page-arrow';prev.id='lany-editor-prev';prev.textContent='◀ 편집';prev.addEventListener('click',()=>showEditorPage(0));
      const status=document.createElement('span');status.id='lany-editor-status';status.setAttribute('role','status');
      const next=document.createElement('button');next.type='button';next.className='lany-page-arrow';next.id='lany-editor-next';next.textContent='설정 ▶';next.addEventListener('click',()=>showEditorPage(1));
      pager.append(prev,status,next);
      panel.append(editPage,settingPage,pager);
    }
    renderEditorGrid();showEditorPage(0);
    return div;
  }

  let selectedType = 0;
  function showEditorPage(n){
    editorPage=Math.max(0,Math.min(1,n));
    const root=document.getElementById('ng-level-editor');if(!root)return;
    for(const section of root.querySelectorAll('[data-editor-page]'))section.hidden=Number(section.dataset.editorPage)!==editorPage;
    const prev=root.querySelector('#lany-editor-prev'),next=root.querySelector('#lany-editor-next'),status=root.querySelector('#lany-editor-status');
    if(prev)prev.disabled=editorPage===0;if(next)next.disabled=editorPage===1;
    if(status)status.textContent=(editorPage+1)+' / 2';
  }

  function renderEditorGrid() {
    const grid = document.getElementById('editor-grid');
    if(!grid) return;
    grid.innerHTML = '';
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
      const cell = document.createElement('button');
      cell.style.cssText = 'aspect-ratio:1;font-size:1.2rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center';
      cell.textContent = CANDY_TYPES[editGrid[r][c]] || '';
      cell.onclick = () => {
        editGrid[r][c] = selectedType;
        cell.textContent = CANDY_TYPES[selectedType] || '';
      };
      grid.appendChild(cell);
    }
  }

  function randomFill() {
    editGrid = Array.from({length:8}, () => Array.from({length:8}, () => Math.floor(Math.random()*5)));
    renderEditorGrid();
  }

  function shareLevel() {
    editTarget = parseInt(document.getElementById('ed-target')?.value||'1000');
    editMoves  = parseInt(document.getElementById('ed-moves')?.value||'20');
    const encoded = encodeLevel();
    const url = `${location.origin}${location.pathname}#level=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      const msg = document.getElementById('share-msg');
      if(msg){msg.style.display='block';setTimeout(()=>msg.style.display='none',2500);}
    });
  }

  // Check for level in URL on load
  window.addEventListener('load', () => {
    const hash = location.hash.match(/#level=(.+)/);
    if(hash) decodeLevel(hash[1]);
    buildEditorUI();
  });

  // Open editor button
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = '🎮 단계 편집기';
    btn.style.cssText = 'position:fixed;bottom:80px;left:16px;z-index:998;padding:8px 14px;background:rgba(124,58,237,.9);color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:.8rem;font-weight:700';
    btn.onclick = () => { const ed=document.getElementById('ng-level-editor'); if(ed)ed.style.display=ed.style.display==='none'?'block':'none'; };
    document.body.appendChild(btn);
  });

  window.LevelEditor = {openEditor: ()=>{const ed=document.getElementById('ng-level-editor');if(ed){ed.style.display='block';showEditorPage(0);}}, encodeLevel, decodeLevel, randomFill, shareLevel, showPage:showEditorPage};
})();
