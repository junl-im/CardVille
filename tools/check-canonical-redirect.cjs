'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('redirect-site/index.html','utf8');
const notfound=fs.readFileSync('redirect-site/404.html','utf8');
const sw=fs.readFileSync('redirect-site/sw.js','utf8');
const cfg=JSON.parse(fs.readFileSync('redirect-site/firebase.json','utf8'));
assert.equal(notfound,html,'GitHub 404 must also redirect');
assert(html.includes('https://cardville.web.app/'),'missing official link');
assert(!html.includes('const LEVELS'),'legacy host must not serve playable game');
assert(!html.includes('localStorage.removeItem'),'progress deletion forbidden');
assert(sw.includes('self.skipWaiting()'),'previous PWA worker should be retired');
assert.equal(cfg.hosting.site,'cardville');
assert.equal(cfg.hosting.rewrites[0].destination,'/index.html');
assert(fs.readFileSync('web/index.html','utf8').includes('lany-origin-migration.js?v=2.3.26'),'canonical handoff import missing');
const body=html.match(/<script id="redirect-code">([\s\S]*?)<\/script>/)?.[1];
assert(body,'redirect logic missing');
const simulate=(hostname,progress)=>{
 const map=new Map(Object.entries(progress).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));
 let dest=null;const link={href:''};
 vm.runInNewContext(body,{location:{hostname,replace:uri=>{dest=uri}},
 document:{getElementById:()=>link},localStorage:{getItem:k=>map.get(k)??null},
 navigator:{},btoa:x=>Buffer.from(x,'binary').toString('base64'),
 encodeURIComponent},{timeout:2000});
 assert.equal(dest,link.href);
 return dest;
};
const dest=simulate('junl-im.github.io',{sc_unlocked:[1,2,5],sc_best:{2:600},sc_stars:{2:3},cv_last_level:'5'});
assert(dest.startsWith('https://cardville.web.app/#lp-progress='));
const data=JSON.parse(Buffer.from(decodeURIComponent(dest.split('#lp-progress=')[1]),'base64url').toString());
assert.equal(data.source,'pages');assert.equal(data.best[2],600);assert.equal(data.last,5);
assert.equal(simulate('cardville--cardville-match3-preview-ikhmalki.web.app',{}),'https://cardville.web.app/');
assert(simulate('cardville--cardville-match3-preview-ikhmalki.web.app',{sc_unlocked:[1,9]}).includes('#lp-progress='));
console.log(JSON.stringify({pass:true,official:'https://cardville.web.app/',progressTransfer:true}));
