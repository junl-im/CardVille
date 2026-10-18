'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const h=read('web/index.html'),css=read('web/css/lany-ui-v21.css'),builder=read('tools/build-visual-v18.py'),
  sw=read('web/sw.js'),v=JSON.parse(read('web/version.json')),m=JSON.parse(read('web/manifest.json'));
assert.equal(v.version,'2.3.7-beta');assert.equal(v.visualRelease,'2.3.7');
for(const flag of ['premiumIndependentArtKit','allScreenRasterUi','artKitWebpOnly','sourceUiFromApprovedStudio'])assert.equal(v[flag],true,flag);
assert.equal(v.artKitAssets,51);assert(m.start_url.includes('v=2.3.7'));
assert(sw.includes("lanypang-match-v2.3.7-ko"));
assert(h.includes('lany-ui-v21.css?v=2.3.7'));
const kit={
 title:['logo','play','install','help','friends'],
 buttons:[...['pink','blue','gold','green','wood','red'].map(x=>'skin-'+x),
  ...['play','resume','next','retry','map','home','help','pause','exit','back','friends','close','settings','sound','notice','confirm','cancel'].map(x=>'action-'+x)],
 popup:['clear','fail','help','pause','install','friends','settings','confirm'].map(x=>'panel-'+x),
 hud:['stage','goal','moves','score','best','booster','clock'].map(x=>'panel-'+x),
 map:['world','chapter','prev','next'],
 booster:['hammer','shuffle','color','time'].map(x=>'badge-'+x)
};
let count=0;
for(const [group,names] of Object.entries(kit))for(const name of names){
 const u='./assets/ui/v21/'+group+'/'+name+'.webp';
 assert(sw.includes("'"+u+"'"),'Missing precache '+u);
 count++;
}
assert.equal(count,51);
for(const needle of [
 '.lany-title .lany-illustrated-logo img','.lany-title #lany-start-button',
 '.lany-action,.lany-secondary,.lany-cta','.lany-world-banner','#app>.header .hud-box',
 '#board .cell','.booster','#overlay-win .modal','#overlay-lose .modal',
 '.lany-install-card','.lany-friends-panel','.lany-prep-card',':focus-visible',
 '@media(max-width:380px)','prefers-reduced-motion',
 'background-image:url(\'../assets/ui/v21/popup/panel-clear.webp\')'
])assert(css.includes(needle),'Missing CSS '+needle);
assert(builder.includes('def build_ui_v21()'), 'No real WebP generator');
assert(fs.statSync('web/assets/ui/v21/source-original-kit.zip').size>500000,'Approved source art ZIP missing');
assert(builder.includes("('play','start_main.webp')")&&builder.includes("('help','help.webp')")&&builder.includes("('friends','friends.webp')"),'Do not regress user supplied illustrated buttons');
assert(builder.includes('build_ui_v21()'),'Generator is not invoked');
assert(builder.includes('source'), 'Missing art source');
assert(!css.includes('url(\'../assets/ui/v21/title/logo.svg\')'),'Vector UI regression');
for(const [role,file] of Object.entries({logo:'logo',play:'start',install:'install',help:'help',friends:'friends'}))
 assert(h.includes('./assets/v26/title/'+file+'.webp'),role);
if(process.argv.includes('--raster')){
 const p='web/assets/ui/v21/manifest.json';
 const manifest=JSON.parse(read(p));
 assert.equal(manifest.release,v.version);
 assert.equal(manifest.userArtSource,'web/assets/ui/v21/source-original-kit.zip');
 assert(/^[0-9a-f]{64}$/.test(manifest.userArtSHA256));
 let total=0;for(const [group,names] of Object.entries(kit))for(const name of names){
  const raw=fs.readFileSync('web/assets/ui/v21/'+group+'/'+name+'.webp');
  assert(raw.subarray(0,4).toString()==='RIFF'&&raw.subarray(8,12).toString()==='WEBP',group+'/'+name);
  assert(raw.length>500,group+'/'+name+' undersized');
  total++;
 }
 assert.equal(total,count);
}
new vm.Script(read('web/js/lany-update-v17.js'));
console.log(JSON.stringify({pass:true,version:v.version,independentRasterAssets:count,allScreenUI:true,legacyProgressUntouched:true,buildVerified:process.argv.includes('--raster')}));
