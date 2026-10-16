/* Keep optional play modes and device records out of the puzzle viewport. */
document.addEventListener('DOMContentLoaded',()=>{
 const drawer=document.getElementById('lany-extra-controls');
 if(!drawer)return;
 const move=()=>{
  for(const selector of ['.cv-action-toolbar','#game-mode-bar','#leaderboard']){
   const element=document.querySelector(selector);
   if(element && element.parentElement!==drawer && !drawer.contains(element))drawer.append(element);
  }
 };
 move();requestAnimationFrame(move);setTimeout(move,250);
});
