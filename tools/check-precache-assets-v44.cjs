const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../web');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const section = sw.match(/const PRECACHE=\[([\s\S]*?)\];/);
if (!section) throw new Error('Service worker PRECACHE list not found');
const paths = [...section[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
const missing = paths.filter(item => item !== './' && !fs.existsSync(path.resolve(root, item)));
if (missing.length) throw new Error(`Missing precache assets:\n${missing.join('\n')}`);
console.log(`Verified ${paths.length} precache entries`);
const cssDir = path.join(root, 'css');
const missingCss=[];
for (const name of fs.readdirSync(cssDir).filter(name=>name.endsWith('.css'))) {
  const css=fs.readFileSync(path.join(cssDir,name),'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    const url=match[1];
    if (/^(?:data:|https?:|#)/.test(url)) continue;
    if (!fs.existsSync(path.resolve(cssDir,url.split('?')[0]))) missingCss.push(`${name}: ${url}`);
  }
}
if (missingCss.length) throw new Error(`Missing CSS assets:\n${missingCss.join('\n')}`);
console.log('Verified CSS image references');
