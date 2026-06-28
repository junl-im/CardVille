import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const stagesText = fs.readFileSync(path.join(root, 'src/game/data/wordStages.ts'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const stageCount = (stagesText.match(/id: \d+,/g) ?? []).length;
if (stageCount < 16) throw new Error(`Expected at least 16 word stages, found ${stageCount}`);
for (const token of ["| 'shape'", "shape: '모양/도형'", "{ label: '정육면체', category: 'shape'"]) {
  if (!stagesText.includes(token)) throw new Error(`Association data missing token: ${token}`);
}
if (stagesText.includes("{ label: '정육면체', category: 'strong'")) {
  throw new Error('정육면체 goal must use shape category, not strong');
}

// Lightweight static validator: ensure each goal category has enough matching cards
// inside its stage block. This catches accidental impossible stages before deploy.
const blocks = stagesText.split(/\n  \{\n    id: /).slice(1).map((block) => `id: ${block}`);
for (const block of blocks) {
  const id = Number(block.match(/^id: (\d+)/)?.[1] ?? 0);
  const goalsSection = block.match(/goals:\s*\[([\s\S]*?)\],\n    columns:/)?.[1] ?? '';
  const columnsSection = block.match(/columns:\s*\[([\s\S]*?)\n    \]/)?.[1] ?? '';
  const goals = [...goalsSection.matchAll(/category: '([^']+)', needed: (\d+)/g)].map((m) => ({ category: m[1], needed: Number(m[2]) }));
  for (const goal of goals) {
    const count = [...columnsSection.matchAll(new RegExp(`category: '${goal.category}'`, 'g'))].length;
    if (count < goal.needed) throw new Error(`Stage ${id} category ${goal.category} has ${count} cards but needs ${goal.needed}`);
  }
}
console.log(`Association check passed. Version ${pkg.version}, stages ${stageCount}, shape category and goal counts OK.`);
