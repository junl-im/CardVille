'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/css/lany-result-v19.css','utf8');
assert(html.includes("s.textContent=i<stars?'★':'☆'"),'unearned stars must be hollow');
assert(html.includes('별 ${stars}개 획득'),'result must state the earned count');
assert(html.includes('최종 점수로 별 판정'),'finish bonus must be explained');
assert(css.includes('.star-item.unearned'),'unearned star style missing');
console.log('result star display checks passed');
