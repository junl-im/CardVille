/* 라니팡 v1.5: tactile feedback for illustrated title and native game buttons. */
(()=>{'use strict';
 const isInteractive=el=>el instanceof Element?el.closest('button,.booster'):null;
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const pending=new WeakMap();
 let active=null,sparkCount=0;
 function press(el){
   if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;
   const old=pending.get(el);if(old)clearTimeout(old);
   el.classList.add('lany-pressed');
   active=el;
 }
 function release(el){
   if(!el)return;
   const old=pending.get(el);if(old)clearTimeout(old);
   const id=setTimeout(()=>{el.classList.remove('lany-pressed');pending.delete(el)},85);
   pending.set(el,id);
   if(active===el)active=null;
 }
 document.addEventListener('pointerdown',e=>{
   if(e.button!==0||!e.isPrimary)return;
   const el=isInteractive(e.target);if(!el||el.disabled)return;
   press(el);
   if(e.pointerType==='touch'&&!reduced()){
     try{navigator.vibrate?.(8)}catch(_){}
   }
 },{capture:true,passive:true});
 document.addEventListener('pointerup',()=>release(active),{capture:true,passive:true});
 document.addEventListener('pointercancel',()=>release(active),{capture:true,passive:true});
 document.addEventListener('pointerleave',e=>{
   if(active&&active===e.target)release(active);
 },true);
 document.addEventListener('keydown',e=>{
   if((e.key==='Enter'||e.key===' ')&&e.target instanceof HTMLButtonElement&&!e.repeat)press(e.target);
 },true);
 document.addEventListener('keyup',e=>{
   if((e.key==='Enter'||e.key===' ')&&e.target instanceof HTMLButtonElement)release(e.target);
 },true);
 document.addEventListener('click',e=>{
   if(reduced()||document.hidden||sparkCount>=7)return;
   const el=isInteractive(e.target);
   if(!el||el.disabled||!el.classList.contains('lany-art-button'))return;
   const rect=el.getBoundingClientRect();
   if(!rect.width||!rect.height)return;
   const piece=document.createElement('span');
   piece.className='lany-art-spark';piece.setAttribute('aria-hidden','true');piece.textContent='✦';
   piece.style.left=Math.round(rect.left+rect.width*(.7))+'px';
   piece.style.top=Math.round(rect.top+rect.height*.42)+'px';
   document.body.appendChild(piece);sparkCount++;
   setTimeout(()=>{piece.remove();sparkCount=Math.max(0,sparkCount-1)},460);
 },{capture:true,passive:true});
 window.LanyButtonFX={isBound:true};
})();
