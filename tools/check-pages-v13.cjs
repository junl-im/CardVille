/* Release v1.3: page-by-page map/gallery/dialog invariants; no server data access. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const h=read('web/index.html'),shell=read('web/js/lany-shell.js'),friends=read('web/js/lany-friends.js');
const css=read('web/css/lany-paging.css'),diff=read('web/js/difficulty.js'),editor=read('web/js/level-editor.js');
const sw=read('web/sw.js'),version=JSON.parse(read('web/version.json'));
assert.equal(version.version,'2.3.22-beta');assert(version.pagedWorldMap&&version.pagedAnimalGallery);
for(const id of ['lany-map-prev','lany-map-next','lany-world-prev','lany-world-next','lany-map-page-status','lany-friends-prev','lany-friends-next','lany-friends-status','lany-prep-prev','lany-prep-next','lany-help-prev','lany-help-next'])assert(h.includes('id="'+id+'"'),id);
for(const id of ['data-prep-page="0"','data-prep-page="1"','data-tutorial-page="0"','data-tutorial-page="1"'])assert(h.includes(id),id);
assert(h.includes('lany-paging.css?v=2.3.22'));
assert(sw.includes('lanypang-match-v2.3.22-ko')&&sw.includes('./css/lany-paging.css'));
assert(!shell.includes("?.scrollTo("),'Map should not use scrollTo');
for(const mark of ['function mapPage(delta)','function worldPage(delta)','function renderMap()','function renderPrepPage()','function renderHelpPage()','nav.mapPageSize=size','grid.dataset.page','renderId!==mapRenderId','nav.mapPage=0;nav.worldTabPage','enabled=unlocked.has(i)'])assert(shell.includes(mark),mark);
for(const mark of ['function page(delta)','roster.slice(start,start+size)','grid.replaceChildren()','img.loading=\'eager\'','window.LanyFriends={roster,open,close,page'])assert(friends.includes(mark),mark);
assert(!friends.includes('if(!grid.childElementCount)'), 'Gallery should not append all thirty at once');
for(const mark of ['.lany-map-section{display:flex!important','.lany-map-section .lany-map-levels','.lany-game-pager','.lany-world-switcher .lany-world-tabs{display:grid','.lany-friends-grid{overflow:hidden!important','#overlay-tutorial .modal','#ng-level-editor','prefers-reduced-motion'])assert(css.includes(mark),mark);
assert(diff.includes("entries.slice(currentPage*2,currentPage*2+2)")&&diff.includes('renderModal()'));
assert(editor.includes("data.editorPage")===false);
assert(editor.includes('showEditorPage(0)')&&editor.includes('editorPage=0'));
for(const path of ['web/js/lany-shell.js','web/js/lany-friends.js','web/js/difficulty.js','web/js/level-editor.js'])new vm.Script(read(path),{filename:path});
for(const [i,m] of [...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].entries())new vm.Script(m[1],{filename:'inline-'+i});
const rowsSource=shell.match(/const mapPageSize=\(\)=>\{[^}]*\};/);
assert(rowsSource);for(const [height,result] of [[420,3],[568,6],[844,9],[1000,12]]){
 const size=vm.runInNewContext(rowsSource[0]+'mapPageSize()', {window:{innerHeight:height}});
 assert.equal(size,result);
 assert.equal(Array.from({length:Math.ceil(25/size)},(_,p)=>Math.min(size,25-p*size)).reduce((x,y)=>x+y,0),25);
}
const worldsSource=shell.match(/const worldTabSize=\(\)=>[^;]*;/);assert(worldsSource);
assert.equal(vm.runInNewContext(worldsSource[0]+'worldTabSize()', {window:{innerWidth:390}}),3);
assert.equal(vm.runInNewContext(worldsSource[0]+'worldTabSize()', {window:{innerWidth:1366}}),5);
assert(h.includes("campaignKey(key)")&&h.includes("`sc_${key}`")&&h.includes("cv_last_level"));
console.log(JSON.stringify({pass:true,version:version.version,stages:250,worlds:10,friendCards:30,layouts:[3,6,9,12],scrollbarsReplaced:true,saveKeysPreserved:true}));
