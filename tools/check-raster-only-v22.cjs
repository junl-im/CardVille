/* Release gate: no vector illustration or SVG DOM can ship with LanyPang. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const web='web';
function paths(root){return fs.readdirSync(root,{withFileTypes:true}).flatMap(x=>{
 const next=path.join(root,x.name);
 return x.isDirectory()?paths(next):[next];
});}
const files=paths(web);
assert(!files.some(x=>/\.svg$/i.test(x)),'Legacy vector image found in deployable web tree');
const textFiles=files.filter(x=>/\.(?:css|js|html|json)$/i.test(x));
const bad=[];
for(const p of textFiles){
 const s=fs.readFileSync(p,'utf8');
 if(/\.svg(?:[?'"]|\b)|image\/svg\+xml|createElementNS\s*\(|<svg\b/i.test(s))bad.push(p);
}
assert.deepEqual(bad,[],'Vector reference / inline vector DOM must never return');
const manifest=JSON.parse(fs.readFileSync('web/manifest.json','utf8'));
assert(manifest.icons.length>=4&&manifest.icons.every(x=>x.type==='image/png'&&x.src.endsWith('.png')),'PWA icons must be PNG only');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8'),css=fs.readFileSync('web/css/lany-worlds-v20.css','utf8');
assert(shell.includes("document.createElement('canvas')")&&shell.includes("route.getContext('2d')"),'The map route must use Canvas');
for(const id of ['ordinary','current','boss','locked'])assert(css.includes('stage-'+id+'-v20.webp'),'Map stage art '+id);
assert(fs.existsSync('web/assets/lanypang-icon-512.png'),'Source raster icon must be retained');
for(const workflow of ['pages.yml','firebase-hosting.yml','firebase-live.yml','lanypang-v12-check.yml']){
 const s=fs.readFileSync('.github/workflows/'+workflow,'utf8');
 assert(s.includes('node tools/check-raster-only-v22.cjs'),workflow+' missing anti-vector gate');
 assert(!s.includes('CairoSVG'),'No vector build dependencies allowed');
}
const art=fs.readFileSync('web/css/lany-art-v23.css','utf8');
const atlas=fs.readFileSync('web/assets/v23/regions/world-atlas.webp');
assert(atlas.subarray(0,4).toString()==='RIFF'&&atlas.subarray(8,12).toString()==='WEBP'&&atlas.length>60000,'10 region raster atlas missing or corrupt');
for(let i=0;i<10;i++)assert(art.includes('.lany-map-section .lany-map-levels[data-world="'+i+'"]'),'Missing regional background mapping '+i);
assert(fs.readFileSync('web/sw.js','utf8').includes("'./assets/v23/regions/world-atlas.webp'"),'Atlas must be available in offline PWA');
console.log(JSON.stringify({pass:true,webFiles:files.length,vectorFiles:0,vectorReferences:0,canvasMap:true,pwaPngOnly:true}));
