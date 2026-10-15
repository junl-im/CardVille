/* 라니팡 — 동물 친구 도감: 공개·제작된 동물 얼굴 에셋만 사용. */
(()=>{'use strict';
const roster=[{"id":"rabbit","name":"토끼","main":true},{"id":"bear","name":"곰","main":true},{"id":"chick","name":"병아리","main":true},{"id":"puppy","name":"강아지","main":true},{"id":"cat","name":"고양이","main":true},{"id":"fox","name":"여우","main":true},{"id":"wolf","name":"늑대","main":true},{"id":"panda","name":"판다","main":false},{"id":"tiger","name":"호랑이","main":false},{"id":"deer","name":"사슴","main":false},{"id":"koala","name":"코알라","main":false},{"id":"pig","name":"돼지","main":false},{"id":"cow","name":"소","main":false},{"id":"sheep","name":"양","main":false},{"id":"penguin","name":"펭귄","main":false},{"id":"raccoon","name":"너구리","main":false},{"id":"squirrel","name":"다람쥐","main":false},{"id":"hamster","name":"햄스터","main":false},{"id":"hedgehog","name":"고슴도치","main":false},{"id":"frog","name":"개구리","main":false},{"id":"elephant","name":"코끼리","main":false},{"id":"giraffe","name":"기린","main":false},{"id":"monkey","name":"원숭이","main":false},{"id":"hippo","name":"하마","main":false},{"id":"lion","name":"사자","main":false},{"id":"crocodile","name":"악어","main":false},{"id":"owl","name":"부엉이","main":false},{"id":"hen","name":"닭","main":false},{"id":"polar_bear","name":"북극곰","main":false},{"id":"red_panda","name":"레서판다","main":false}];
const imageRoot='./assets/friends/';
const $=id=>document.getElementById(id);
let currentPage=0,lastPageSize=6;
const pageSize=()=>{
 const h=Math.min(window.innerHeight||800,window.visualViewport?.height||Infinity);
 return h<650?6:h<950?9:12;
};
function render(){
 const grid=$('lany-friends-grid');if(!grid)return;
 const size=pageSize(),pages=Math.ceil(roster.length/size);
 currentPage=Math.max(0,Math.min(pages-1,currentPage));lastPageSize=size;
 grid.replaceChildren();
 const start=currentPage*size;
 for(const a of roster.slice(start,start+size)){
   const card=document.createElement('article');card.className='lany-friend-card'+(a.main?' main-friend':'');
   const img=document.createElement('img');img.src=a.main?'./assets/v25/animals/'+a.id+'.webp':imageRoot+a.id+'.webp';
   img.loading='eager';img.decoding='async';img.alt=a.name+' 동물 얼굴';img.draggable=false;
   const label=document.createElement('span');label.textContent=a.name;card.append(img,label);grid.appendChild(card);
 }
 $('lany-friends-status').textContent=(currentPage+1)+' / '+pages+' · '+(start+1)+'~'+Math.min(start+size,roster.length)+'종';
 $('lany-friends-prev').disabled=currentPage===0;
 $('lany-friends-next').disabled=currentPage===pages-1;
 grid.dataset.page=String(currentPage);
}
function page(delta){
 if($('lany-friends-modal')?.hidden||!Number.isInteger(delta))return;
 const next=Math.max(0,Math.min(Math.ceil(roster.length/pageSize())-1,currentPage+delta));
 if(next===currentPage)return;
 currentPage=next;render();
}
function open(){
 const box=$('lany-friends-modal');if(!box)return;
 currentPage=0;window.LanyTempo?.pause();box.hidden=false;render();box.querySelector('.lany-friends-close')?.focus();
}
function close(){const box=$('lany-friends-modal');if(!box||box.hidden)return;box.hidden=true;
 if(window.LanyShell?.getCurrentScreen?.()==='game')window.LanyTempo?.resume();}
window.LanyFriends={roster,open,close,page,isOpen:()=>!$('lany-friends-modal')?.hidden};
window.addEventListener('resize',()=>{if(!$('lany-friends-modal')?.hidden){const anchor=currentPage*lastPageSize;currentPage=Math.floor(anchor/pageSize());render();}},{passive:true});
})();
