/* Local-only high scores. Render as text nodes to prevent HTML injection. */
const LB_KEY = 'ccm3_leaderboard';
function getLeaderboard() {
  try {const v=JSON.parse(localStorage.getItem(LB_KEY)||'[]');return Array.isArray(v)?v:[];}
  catch (_) {return [];}
}
function saveScore(score, level) {
  if(!Number.isFinite(score)||!Number.isFinite(level))return;
  const lb=getLeaderboard();
  const name=(localStorage.getItem('ccm3_playerName')||'Player').slice(0,20);
  lb.push({name,score,level,date:new Date().toISOString()});
  lb.sort((a,b)=>(Number(b.score)||0)-(Number(a.score)||0));
  lb.splice(10);
  try{localStorage.setItem(LB_KEY,JSON.stringify(lb))}catch(_){}
  renderLeaderboard();
}
function renderLeaderboard() {
  const el=document.getElementById('leaderboard');if(!el)return;
  el.replaceChildren();
  const lb=getLeaderboard();
  const heading=document.createElement('h3');
  heading.textContent='🏆 이 기기 최고 점수';heading.style.cssText='color:#fbbf24;margin:0 0 .5rem';
  el.append(heading);
  if(!lb.length){ const p=document.createElement('p');p.textContent='아직 기록이 없습니다.';p.style.textAlign='center';el.append(p);return;}
  lb.slice(0,10).forEach((item,i)=>{
    const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;gap:8px;padding:.3rem 0;border-bottom:1px solid #30363d';
    const player=document.createElement('span'),points=document.createElement('span');
    player.textContent=`${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${String(item.name||'Player').slice(0,20)}`;
    points.textContent=`${Number(item.score||0).toLocaleString()} (L${Number(item.level||1)})`;
    points.style.color='#a78bfa';row.append(player,points);el.append(row);
  });
}
function setPlayerName() {
  const name=prompt('닉네임을 입력하세요:',localStorage.getItem('ccm3_playerName')||'Player');
  if(name) localStorage.setItem('ccm3_playerName',name.slice(0,20));
}
document.addEventListener('DOMContentLoaded',renderLeaderboard);
