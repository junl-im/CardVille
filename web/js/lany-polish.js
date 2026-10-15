/* v1.1: approved artwork in actual puzzle interactions; zero persistent changes. */
(()=>{'use strict';
const variants=['normal','wink','cheer','surprise'];
const root='./assets/polish/';let layer;
const puzzleFaces=['rabbit','bear','chick','puppy','cat','fox','wolf'];
const puzzleRoot='./assets/v25/animals/';
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const getLayer=()=>{if(!layer){layer=document.createElement('div');layer.className='lany-vfx-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer)}return layer};
const face=(el,variant)=>{
  if(!el)return;const img=el.querySelector('.lany-animal-face');if(!img)return;
  const name=img.dataset.gem||(img.dataset.lanyOriginal||img.src).split('/').pop().split('.')[0].split('-')[0];
  if(!['rabbit','bear','chick','puppy','fox','cat','wolf','panda'].includes(name))return;
  const key=variants.includes(variant)?variant:'normal';
  if(puzzleFaces.includes(name)&&key==='wink'){
    if(!img.dataset.lanyOriginal)img.dataset.lanyOriginal=img.src;
    img.src=puzzleRoot+name+'-wink.webp';
    return;
  }
  if(key==='normal'){if(img.dataset.lanyOriginal){img.src=img.dataset.lanyOriginal;delete img.dataset.lanyOriginal;}return;}
  if(!img.dataset.lanyOriginal)img.dataset.lanyOriginal=img.src;
  img.src=root+name+'-'+key+'.webp';
};
function burst(rect,type='burst-star'){
  if(reduced()||!rect||!document.body)return;
  const v=document.createElement('img');v.className='lany-vfx-pop';v.src=root+type+'.webp';v.alt='';v.draggable=false;
  v.style.left=(rect.left+rect.width/2)+'px';v.style.top=(rect.top+rect.height/2)+'px';
  const parent=getLayer();while(parent.children.length>=8)parent.firstElementChild?.remove();parent.appendChild(v);setTimeout(()=>v.remove(),650);
}
let pressed=null;
function down(e){if(e.button!==0)return;const tile=e.target.closest?.('#board .cell');
 if(tile&&!tile.classList.contains('locked')){pressed=tile;tile.classList.add('lany-tap');return;}
 const button=e.target.closest?.('button,.booster');if(!button||button.disabled)return;
 button.classList.add('lany-tactile-down');setTimeout(()=>button.classList.remove('lany-tactile-down'),220);
}
function up(){if(pressed){const old=pressed;pressed=null;old.classList.remove('lany-tap');}}
function onMatch(indices,chain=1){const cells=[];
  for(const idx of indices){let el=document.querySelector(`#board .cell[data-r="${Math.floor(idx/8)}"][data-c="${idx%8}"]`);if(el)cells.push(el)}
  cells.forEach((el,i)=>{
    el.classList.add('lany-match-pop');
    face(el,'wink');
    el.style.setProperty('--lany-delay',Math.min(i,9)*16+'ms');
  });
  if(cells.length){const a=cells[Math.floor(cells.length/2)],rect=a.getBoundingClientRect();burst(rect,cells.length>=5||chain>=3?'burst-star':'burst-heart');if(chain>=3)burst(rect,'combo')}
}
function onFall(indices){if(reduced())return;const tiles=document.getElementById('board')?.children;if(!tiles)return;indices.slice(0,24).forEach((idx,i)=>{const el=tiles[idx];if(el){el.classList.add('lany-fall-in');el.style.setProperty('--lany-delay',(i%8)*22+'ms')}})}
function invalidSwap(r1,c1,r2,c2){if(reduced())return;const tiles=document.getElementById('board')?.children;if(!tiles)return;for(const idx of [r1*8+c1,r2*8+c2]){const el=tiles[idx];if(el){el.classList.add('lany-swap-reject');setTimeout(()=>el.classList.remove('lany-swap-reject'),250)}}}
function onSwap(r1,c1,r2,c2){if(reduced())return;const tiles=document.getElementById('board')?.children;if(!tiles)return;for(const idx of [r1*8+c1,r2*8+c2])tiles[idx]?.classList.add('lany-swap-land')}
function promoteDialog(){document.querySelectorAll('#lany-pause .lany-dialog-emoji,#lany-exit .lany-dialog-emoji').forEach((el,i)=>{
 if(el.querySelector('img'))return;
 el.textContent='';const img=document.createElement('img');img.className='lany-popup-mascot';img.src=root+(i===0?'rabbit-wink.webp':'bear-surprise.webp');img.alt='';img.draggable=false;el.append(img)
 });}
function dialog(type){promoteDialog();const sel=type==='win'?'#overlay-win .modal':'#overlay-lose .modal';const el=document.querySelector(sel);if(el)burst(el.getBoundingClientRect(),type==='win'?'burst-star':'burst-heart');}
function init(){
  promoteDialog();
  puzzleFaces.forEach(name=>{const image=new Image();image.src=puzzleRoot+name+'-wink.webp';});
  document.addEventListener('pointerdown',down,{capture:true,passive:true});
  document.addEventListener('pointerup',up,{capture:true,passive:true});
  document.addEventListener('pointercancel',up,{capture:true,passive:true});
}
window.LanyPolish={onMatch,onFall,invalidSwap,onSwap,dialog,burst,face};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
