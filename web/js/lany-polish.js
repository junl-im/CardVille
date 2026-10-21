/* v1.1: approved artwork in actual puzzle interactions; zero persistent changes. */
(()=>{'use strict';
const variants=['normal','wink','cheer','surprise'];
const root='./assets/polish/';let layer;
const puzzleFaces=['rabbit','bear','chick','puppy','cat','fox','wolf'];
const puzzleRoot='./assets/v25/animals/';
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let lastMatchAccentAt=-Infinity;
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
function spray(rect,grade){
  if(reduced()||document.hidden||!rect)return;
  const parent=getLayer();
  const old=parent.querySelectorAll('.lany-match-spray');
  if(old.length>=3)old[0].remove();
  const group=document.createElement('span');group.className='lany-match-spray';
  group.dataset.grade=grade;
  group.style.left=(rect.left+rect.width/2)+'px';group.style.top=(rect.top+rect.height/2)+'px';
  const count=grade==='combo'?8:grade==='big'?7:5;
  const distance=Math.min(37,Math.max(19,rect.width*(grade==='small' ? 0.45 : 0.68)));
  for(let i=0;i<count;i++){
    const dot=document.createElement('i'),angle=(i/count)*Math.PI*2-Math.PI/2;
    dot.style.setProperty('--dx',Math.round(Math.cos(angle)*distance)+'px');
    dot.style.setProperty('--dy',Math.round(Math.sin(angle)*distance)+'px');
    dot.style.setProperty('--spark-delay',((i%3)*18)+'ms');
    group.appendChild(dot);
  }
  parent.appendChild(group);setTimeout(()=>group.remove(),620);
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
  if(cells.length){
  const a=cells[Math.floor(cells.length/2)],rect=a.getBoundingClientRect();
  if(window.LanyPolish)window.LanyPolish.lastMatchPoint={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
  const now=performance.now(),showAccent=now-lastMatchAccentAt>=180;
  if(showAccent)lastMatchAccentAt=now;
  if(!reduced()&&showAccent){
    const ring=document.createElement('span');ring.className='lany-match-ring';
    ring.style.left=(rect.left+rect.width/2)+'px';ring.style.top=(rect.top+rect.height/2)+'px';
    ring.style.setProperty('--ring-size',Math.max(48,rect.width*2.3)+'px');
    const parent=getLayer();parent.append(ring);setTimeout(()=>ring.remove(),470);
  }
  const grade=chain>=3?'combo':cells.length>=5?'big':'small';
  if(showAccent){
    spray(rect,grade);
    // Cascades retain the pop and expression; one bright badge is enough.
    if(chain===1||chain>=3)burst(rect,grade==='small'?'burst-heart':'burst-star');
  }
}
}
function onFall(indices,distances={}){
 if(reduced())return;
 const board=document.getElementById('board'),tiles=board?.children;if(!tiles)return;
 const cell=tiles[0];const step=(cell?.getBoundingClientRect().height||40)+(parseFloat(getComputedStyle(board).rowGap)||0);
 indices.slice(0,24).forEach((idx,i)=>{const el=tiles[idx];if(!el)return;
  el.style.setProperty('--fall-offset',-(Math.min(4,Math.max(1,distances[idx]||1))*step)+'px');
  el.style.setProperty('--lany-delay',(i%8)*15+'ms');el.classList.add('lany-fall-in');
  setTimeout(()=>el.classList.remove('lany-fall-in'),320);
 });
}
function swapTiles(r1,c1,r2,c2,valid){
 if(reduced())return;
 const tiles=document.getElementById('board')?.children;if(!tiles)return;
 const a=tiles[r1*8+c1],b=tiles[r2*8+c2];if(!a||!b)return;
 const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
 for(const [el,dx,dy] of [[a,br.left-ar.left,br.top-ar.top],[b,ar.left-br.left,ar.top-br.top]]){
  el.style.setProperty('--swap-x',dx+'px');el.style.setProperty('--swap-y',dy+'px');
  el.style.setProperty('--reject-x',(dx*.22)+'px');el.style.setProperty('--reject-y',(dy*.22)+'px');
  const cls=valid?'lany-swap-land':'lany-swap-reject';el.classList.add(cls);
  setTimeout(()=>el.classList.remove(cls),valid?200:260);
 }
}
function invalidSwap(r1,c1,r2,c2){swapTiles(r1,c1,r2,c2,false)}
function onSwap(r1,c1,r2,c2){swapTiles(r1,c1,r2,c2,true)}
function specialFootprint(items,affected,comboCells,boardKinds){
 const hits=new Map(),allowed=new Set(affected||[]),combo=new Set(comboCells||[]);
 const put=(index,axis,delay)=>{
  if(!allowed.has(index))return;
  const old=hits.get(index);
  if(!old||delay<old.delay)hits.set(index,{axis,delay});
 };
 for(const {index,special} of items){
  const r=Math.floor(index/8),c=index%8;
  if([2,6].includes(special))for(let x=0;x<8;x++)put(r*8+x,'row',Math.abs(x-c)*20);
  else if([3,7].includes(special))for(let y=0;y<8;y++)put(y*8+c,'col',Math.abs(y-r)*20);
  else if([1,4,8].includes(special))for(let y=Math.max(0,r-1);y<=Math.min(7,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(7,c+1);x++)put(y*8+x,'burst',Math.max(Math.abs(y-r),Math.abs(x-c))*55);
  else if(special===5){
   const gem=boardKinds?.[index];
   for(const target of allowed)if(target===index||boardKinds?.[target]===gem)
    put(target,'color',Math.min(140,(Math.abs(Math.floor(target/8)-r)+Math.abs(target%8-c))*18));
  }
 }
 // A paired special can reach farther than either single footprint.
 if(combo.size){
  const origins=items.map(item=>item.index);
  for(const index of combo){
   const distance=Math.min(...origins.map(origin=>Math.abs(Math.floor(index/8)-Math.floor(origin/8))+Math.abs(index%8-origin%8)));
   put(index,'combo',Math.min(140,distance*20));
  }
 }
 return hits;
}
function onSpecial(items,affected,comboCells,boardKinds,dwell=360){
 if(document.hidden||!items?.length)return;
 const board=document.getElementById('board');if(!board)return;
 const hits=specialFootprint(items,affected,comboCells,boardKinds),parent=getLayer();
 // Show the entire affected area first. The travelling wave follows it.
 parent.querySelectorAll('.lany-special-cell-preview,.lany-special-cell-wave').forEach(el=>el.remove());
 const maxDelay=Math.max(0,Math.min(140,dwell-160)),speed=maxDelay/140;
 const duration=Math.max(120,dwell-maxDelay-10);
 const fragment=document.createDocumentFragment(),nodes=[];
 for(const [index,{axis,delay}] of hits){
  const rect=board.children[index]?.getBoundingClientRect();if(!rect)continue;
  const preview=document.createElement('span');preview.className='lany-special-cell-preview';preview.dataset.axis=axis;preview.dataset.index=String(index);
  preview.style.left=rect.left+'px';preview.style.top=rect.top+'px';preview.style.width=rect.width+'px';preview.style.height=rect.height+'px';
  fragment.appendChild(preview);nodes.push(preview);
  if(!reduced()){
   const el=document.createElement('span');el.className='lany-special-cell-wave';el.dataset.axis=axis;el.dataset.index=String(index);
   el.style.left=rect.left+'px';el.style.top=rect.top+'px';el.style.width=rect.width+'px';el.style.height=rect.height+'px';
   el.style.setProperty('--special-delay',Math.round(delay*speed)+'ms');
   el.style.setProperty('--special-duration',duration+'ms');fragment.appendChild(el);nodes.push(el);
  }
 }
 parent.appendChild(fragment);
 setTimeout(()=>nodes.forEach(el=>el.remove()),dwell+20);
}
function onSpecialCombo(r1,c1,r2,c2){
 if(reduced()||document.hidden)return;
 const board=document.getElementById('board'),a=board?.children[r1*8+c1],b=board?.children[r2*8+c2];if(!a||!b)return;
 const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
 const ring=document.createElement('span');ring.className='lany-special-combo-ring';
 const size=Math.max(ar.width,ar.height)*1.7;
 ring.style.width=size+'px';ring.style.height=size+'px';
 ring.style.left=((ar.left+br.left+ar.width)/2-size/2)+'px';
 ring.style.top=((ar.top+br.top+ar.height)/2-size/2)+'px';
 getLayer().append(ring);setTimeout(()=>ring.remove(),500);
}
function onTimeBonus(seconds){
 if(document.hidden||seconds<=0)return;
 const clock=document.getElementById('lany-clock'),rect=clock?.getBoundingClientRect();if(!rect)return;
 const parent=getLayer();parent.querySelector('.lany-time-bonus')?.remove();
 const label=document.createElement('span');label.className='lany-time-bonus';label.textContent=`⏱ +${seconds}초`;
 label.style.left=(rect.left+rect.width/2)+'px';label.style.top=(rect.top+rect.height/2)+'px';
 parent.appendChild(label);setTimeout(()=>label.remove(),950);
}
function promoteDialog(){document.querySelectorAll('#lany-pause .lany-dialog-emoji,#lany-exit .lany-dialog-emoji').forEach((el,i)=>{
 if(el.querySelector('img'))return;
 el.textContent='';const img=document.createElement('img');img.className='lany-popup-mascot';img.src=puzzleRoot+(i===0?'rabbit.webp':'bear.webp');img.alt='';img.draggable=false;el.append(img)
 });}
function dialog(type){promoteDialog();const sel=type==='win'?'#overlay-win .modal':'#overlay-lose .modal';const el=document.querySelector(sel);if(el)burst(el.getBoundingClientRect(),type==='win'?'burst-star':'burst-heart');}
function init(){
  promoteDialog();
  puzzleFaces.forEach(name=>{const image=new Image();image.src=puzzleRoot+name+'-wink.webp';});
  document.addEventListener('pointerdown',down,{capture:true,passive:true});
  document.addEventListener('pointerup',up,{capture:true,passive:true});
  document.addEventListener('pointercancel',up,{capture:true,passive:true});
}
window.LanyPolish={onMatch,onFall,invalidSwap,onSwap,onSpecial,onSpecialCombo,onTimeBonus,dialog,burst,face,specialFootprint};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
