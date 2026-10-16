/* Campaign record summary in the optional drawer. */
document.addEventListener('DOMContentLoaded',()=>{
  const drawer=document.getElementById('lany-extra-controls');
  drawer?.addEventListener('toggle',()=>{
    if(!drawer.open||typeof state==='undefined')return;
    const unlocked=Array.isArray(state.unlockedLevels)?state.unlockedLevels:[];
    const stars=state.levelStars||{};
    const scores=state.bestScores||{};
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=Number(value||0).toLocaleString();};
    set('lany-record-cleared',Object.keys(stars).filter(k=>Number(stars[k])>0).length);
    set('lany-record-stars',Object.values(stars).reduce((sum,n)=>sum+Number(n||0),0));
    set('lany-record-best',Math.max(0,...Object.values(scores).map(n=>Number(n)||0)));
  });
});
