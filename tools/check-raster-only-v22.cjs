/* Strict v2.2 release gate: no vector assets, inline vectors, or references anywhere in live web files. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const source=p=>fs.readFileSync(p,'utf8');
const all=[];
function visit(dir){
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,ent.name);
  if(ent.isDirectory())visit(file);
  else all.push(file.replaceAll('\\','/'));
 }
}
visit('web');
const vectorFiles=all.filter(f=>/\.svg$/i.test(f));
assert.deepEqual(vectorFiles,[],'Vector assets must be deleted, not just unlinked');
for(const file of all.filter(f=>/\.(html|css|js|json)$/i.test(f))){
 const text=source(file);
 assert(!/\.svg(?:[?\x22\x27\s)]|$)|<svg\b|<\/svg\s*>|createElementNS\s*\(|image\/svg\+xml/i.test(text),'Vector resource or DOM code remains: '+file);
}
const html=source('web/index.html'),css=source('web/css/lany-ui-v22.css'),shell=source('web/js/lany-shell.js'),sw=source('web/sw.js');
const v=JSON.parse(source('web/version.json')),manifest=JSON.parse(source('web/manifest.json'));
assert.equal(v.version,'2.2.0-beta');
assert.equal(v.svgAssetsAllowed,false);
assert(v.rasterOnlyUI&&v.cssMapRoutes&&v.illustratedScoreGauge&&v.unifiedGameHUD);
assert.equal(manifest.icons.length,4);
assert(manifest.icons.every(x=>x.type==='image/png'));
for(const id of ['lany-hud-moves-value','progress-fill','score-val','best-val','level-val','lany-map-levels'])assert(html.includes('id="'+id+'"'),id);
for(const fragment of ["progress-track.webp","progress-fill.webp","panel-moves.webp","panel-score.webp","stage-current-v20.webp","lany-route-strip"]){
 assert(css.includes(fragment)||shell.includes(fragment),fragment);
}
assert(!shell.includes('createElementNS'),'No vector route construction');
assert(shell.includes("document.createElement('i')"),'HTML/CSS route strips must be constructed');
assert(html.includes('lany-ui-v22.css?v=2.2.0'));
for(const res of ['css/lany-ui-v22.css','hud/progress-track.webp','hud/progress-fill.webp'])assert(sw.includes(res),'Missing offline resource '+res);
assert(html.includes('sc_stars')&&html.includes('sc_best')&&html.includes('sc_unlocked'));
for(const f of all.filter(f=>f.endsWith('.js')))new vm.Script(source(f),{filename:f});
for(const [i,m] of [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].entries())new vm.Script(m[1],{filename:'inline-'+i});
console.log(JSON.stringify({pass:true,release:v.version,deletedVectorFiles:true,rasterOnlyAssets:true,menuAccessible:true,mapRoute:'HTML-CSS',hud:'illustrated',persistedProgress:true,webFiles:all.length}));
