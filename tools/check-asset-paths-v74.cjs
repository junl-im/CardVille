'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve('web');
const missing=[];let references=0;
function check(owner,reference){
 const ref=reference.trim().replace(/^['"]|['"]$/g,'').split(/[?#]/,1)[0];
 if(!ref||/^(data:|https?:|#|var\()/i.test(ref))return;
 const target=path.resolve(path.dirname(owner),decodeURIComponent(ref));
 references++;
 if(!target.startsWith(root+path.sep)||!fs.existsSync(target))missing.push(`${path.relative(root,owner)}: ${reference}`);
}
for(const file of fs.readdirSync(path.join(root,'css')).filter(name=>name.endsWith('.css'))){
 const owner=path.join(root,'css',file),text=fs.readFileSync(owner,'utf8');
 for(const match of text.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g))check(owner,match[2]);
}
const html=path.join(root,'index.html'),source=fs.readFileSync(html,'utf8');
for(const match of source.matchAll(/<(?:img|script|link)\b[^>]*?\b(?:src|href)="(\.\/[^"#?]+)(?:[?#][^"]*)?"/g))check(html,match[1]);
assert.equal(missing.length,0,`missing or escaped assets:\n${missing.join('\n')}`);
console.log(`v74 ${references} local asset paths exist`);
