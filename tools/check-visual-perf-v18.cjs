'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const html=read('web/index.html'),sw=read('web/sw.js'),css=read('web/css/lany-raster-v18.css'),py=read('tools/build-visual-v18.py');
const v=JSON.parse(read('web/version.json')),m=JSON.parse(read('web/manifest.json'));
assert.equal(v.version,'1.9.0-beta');assert(v.reusedBoardCells&&v.preventStaleAsyncMatches&&v.blackCatDistinct&&v.approvedRasterTitleRestored);
assert(m.start_url.includes('v=1.9.0'));
assert(html.includes('const LanyPerf=')&&html.includes('state.playEpoch++'));
assert(html.includes("if(board.children.length!==ROWS*COLS)"));
assert(html.includes('div.addEventListener(\'click\'')&&html.includes('board.appendChild(frag)'));
assert(html.includes('const epoch=state.playEpoch')&&html.includes('if(epoch!==state.playEpoch)return'));
assert(html.includes('function renderBoard()')&&!html.includes("board.innerHTML=''"));
assert(css.includes('lanypang-cover.webp')===false);
assert(css.includes('visibility:visible!important')&&css.includes('.lany-title .lany-cover'));
assert(css.includes('.lany-title .lany-title-play-scene .lany-art-play'));
for(const key of ['title-logo-v18.webp','btn-play-v18.webp','btn-install-v18.webp','btn-help-v18.webp','btn-friends-v18.webp']){
 assert(html.includes('./assets/title/'+key+'?v=1.9.0'),key);
 assert(sw.includes('./assets/title/'+key),key+' precache');
}
assert(py.includes("A/'friends'/'cat.webp'"),'generated black cat portrait');
assert(py.includes("f'polish/cat-{expression}.webp'"),'generated black cat expressions');
for(const file of ['web/assets/lanypang-cover.webp','web/assets/polish/rabbit-cheer.webp','web/assets/polish/bear-cheer.webp','web/assets/polish/chick-cheer.webp'])assert(fs.statSync(file).size>1500,file);
assert(sw.includes('lanypang-match-v1.9.0-ko'));
assert(read('.github/workflows/firebase-hosting.yml').includes('tools/build-visual-v18.py'));
assert(read('.github/workflows/firebase-live.yml').includes('tools/build-visual-v18.py'));
assert(read('.github/workflows/pages.yml').includes('tools/build-visual-v18.py'));
if(process.argv.includes('--raster')){
 for(const file of ['title-logo-v18.webp','btn-play-v18.webp','btn-install-v18.webp','btn-help-v18.webp','btn-friends-v18.webp']){
  const data=fs.readFileSync('web/assets/title/'+file);assert(data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP',file);
  assert(data.length>1200,file);
 }
 for(const file of ['web/assets/friends/cat.webp','web/assets/polish/cat-normal.webp'])assert(fs.statSync(file).size>800,file);
}
console.log(JSON.stringify({ok:true,version:v.version,webpTitle:true,blackCat:true,oldAssetsRestored:true,stableDomCells:true,asyncEpoch:true,raster:process.argv.includes('--raster')}));
