/* 라니팡 v1.0 동물머리 30종 및 모바일 팝업 리그레션 */
'use strict';
const fs=require('fs'),assert=require('node:assert/strict');const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/css/lany-mobile-friends.css','utf8');
const friends=fs.readFileSync('web/js/lany-friends.js','utf8');
const roster=JSON.parse(fs.readFileSync('web/assets/friends/roster.json'));
assert.equal(roster.length,30);assert.equal(roster.filter(x=>x.main).length,7);
assert.equal(new Set(roster.map(x=>x.id)).size,30);
for(const x of roster){const p='web/assets/friends/'+x.id+'.webp';assert(fs.statSync(p).size>1000,p);assert(/[가-힣]/.test(x.name));}
assert(html.includes('id="lany-friends-modal"')&&html.includes('lany-animal-face'));
assert(html.includes('LanyFriends.open()')&&html.includes('LANY_FACE_IDS'));
for(const s of ['max-height:calc(100dvh','env(safe-area-inset-bottom','max-width:min(94vw','max-width:min(96vw','height:100dvh','.lany-animal-face','grid-template-columns:repeat(3'])assert(css.includes(s),s);
for(const s of ['#daily-modal','#ng-level-editor','#difficulty-modal','#mp-setup'])assert(css.includes(s));
assert(css.includes('#mp-share>div')&&css.includes('#ng-level-editor>div'));
assert(friends.includes('LanyFriends=')&&!html.includes('How to Play CardVille'));
console.log(JSON.stringify({ok:true,friends:30,animalTiles:7,mobileModalSizing:true,dynamicPopups:true}));
