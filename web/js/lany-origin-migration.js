/* One-time game-progress handoff from retired public addresses to cardville.web.app.
   Only game scores, stars and unlocked stages are accepted. No account data,
   browser storage clearing or network requests. Imported values only increase. */
(() => {
  'use strict';
  if(location.hostname!=='cardville.web.app'||!location.hash.startsWith('#lp-progress='))return;
  const stage=n=>Number.isInteger(Number(n))&&Number(n)>=1&&Number(n)<=250?Number(n):null;
  const read=(key,otherwise)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??otherwise}catch(_){return otherwise}};
  const scores=(value,max)=>{const result={};if(!value||typeof value!=='object'||Array.isArray(value))return result;
    for(const [k,v] of Object.entries(value)){
      const n=stage(k),x=Number(v);
      if(n!==null&&Number.isFinite(x)&&x>=0&&x<=max)result[String(n)]=x;
    }
    return result;
  };
  try{
    const raw=decodeURIComponent(location.hash.slice('#lp-progress='.length));
    if(raw.length>25000)throw Error('oversized transfer');
    const p=JSON.parse(atob(raw.replace(/-/g,'+').replace(/_/g,'/')));
    if(p.v!==1||!['pages','preview'].includes(p.source))throw Error('unknown source');
    const unlocked=new Set([1]);
    for(const item of [...(Array.isArray(p.unlocked)?p.unlocked:[]),...(Array.isArray(read('sc_unlocked',[]))?read('sc_unlocked',[]):[])]) {
      const n=stage(item);if(n!==null)unlocked.add(n);
    }
    const oldBest=scores(read('sc_best',{}),1e9),newBest=scores(p.best,1e9),best={...oldBest};
    for(const [k,v] of Object.entries(newBest))best[k]=Math.max(best[k]??0,v);
    const oldStars=scores(read('sc_stars',{}),3),newStars=scores(p.stars,3),stars={...oldStars};
    for(const [k,v] of Object.entries(newStars))stars[k]=Math.max(stars[k]??0,Math.min(3,Math.floor(v)));
    const current=stage(localStorage.getItem('cv_last_level'))||1, incoming=stage(p.last)||1;
    const last=[current,incoming].filter(n=>unlocked.has(n)).reduce((a,b)=>Math.max(a,b),1);
    localStorage.setItem('sc_best',JSON.stringify(best));
    localStorage.setItem('sc_unlocked',JSON.stringify([...unlocked].sort((a,b)=>a-b)));
    localStorage.setItem('sc_stars',JSON.stringify(stars));
    localStorage.setItem('cv_last_level',String(last));
    window.LanyOriginMigration={imported:true,source:p.source,maxStage:Math.max(...unlocked)};
  }catch(_){window.LanyOriginMigration={imported:false}}
  try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}
})();
