'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),h=read('web/index.html'),sw=read('web/sw.js');
const manifest=JSON.parse(read('web/manifest.json')),ver=JSON.parse(read('web/version.json')),js=read('web/js/lany-install.js');
assert.equal(ver.version,'1.4.0-beta');
for(const k of ['pwaStandaloneInstall','pwaPromptOnSupportedBrowsers','pwaIOSManualGuide','brandedFavicon','maskableGameIcon'])assert.equal(ver[k],true,k);
assert.equal(manifest.display,'standalone');assert.equal(manifest.id,'./');assert.equal(manifest.scope,'./');assert(manifest.start_url.includes('v=1.4.0'));
assert.equal(manifest.short_name,'라니팡');
assert(manifest.icons.some(x=>x.purpose==='maskable'&&x.sizes==='512x512'&&x.type==='image/png'));
assert(manifest.icons.some(x=>x.purpose==='any'&&x.sizes==='192x192'&&x.type==='image/png'));
for(const value of ['rel="icon" type="image/svg+xml"','rel="icon" type="image/png"','rel="apple-touch-icon"','name="apple-mobile-web-app-title"','id="lany-install-button"','id="lany-install-modal"','lany-install.js?v=1.4.0','lany-install.css?v=1.4.0'])assert(h.includes(value),value);
for(const value of ['beforeinstallprompt','e.preventDefault()','event.prompt()','event.userChoice','appinstalled','display-mode: standalone','navigator.standalone','iPhone','홈 화면에 추가','showGuide','isInstalled'])assert(js.includes(value),value);
for(const value of ['lanypang-match-v1.4.0-ko','lanypang-brand.svg','lanypang-maskable.svg','lanypang-maskable-512.png','lanypang-apple-touch-180.png','lany-install.js',"e.request.mode==='navigate'?caches.match('./index.html')"])assert(sw.includes(value),value);
for(const name of ['lanypang-brand.svg','lanypang-maskable.svg']){const svg=read('web/assets/'+name);assert(svg.includes('viewBox="0 0 512 512"'));assert(!/<script|foreignObject|https?:\/\//i.test(svg.replace('http://www.w3.org/2000/svg','')));}
for(const path of ['.github/workflows/pages.yml','.github/workflows/firebase-hosting.yml','.github/workflows/firebase-live.yml','.github/workflows/lanypang-v12-check.yml']){
 const w=read(path);assert(w.includes('tools/check-pwa-v14.cjs'),path);
}
assert(read('.github/workflows/pages.yml').includes('tools/build-pwa-icons.py'));
assert(read('.github/workflows/firebase-hosting.yml').includes('tools/build-pwa-icons.py'));
assert(read('.github/workflows/firebase-live.yml').includes('tools/build-pwa-icons.py'));
new vm.Script(js,{filename:'lany-install.js'});
if(process.argv.includes('--raster')){
 const formats=new Map([['lanypang-favicon-16.png',16],['lanypang-favicon-32.png',32],['lanypang-favicon-48.png',48],['lanypang-apple-touch-180.png',180],['lanypang-icon-192.png',192],['lanypang-icon-512.png',512],['lanypang-maskable-192.png',192],['lanypang-maskable-512.png',512]]);
 for(const [file,size] of formats){const data=fs.readFileSync('web/assets/'+file);assert(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),file);assert.equal(data.readUInt32BE(16),size,file);assert.equal(data.readUInt32BE(20),size,file);assert(data.length>100,file);}
}
console.log(JSON.stringify({pass:true,version:ver.version,installPrompt:true,iosGuide:true,homeScreenIcons:true,maskable:true,offlineFallback:true,raster:process.argv.includes('--raster')}));
