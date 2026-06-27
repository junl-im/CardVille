import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCENES = path.join(ROOT, 'src', 'game', 'scenes');
const errors = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith('.ts') ? [full] : [];
  });
}

for (const file of walk(SCENES)) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  const titleMatches = [...text.matchAll(/add\.text\((\d+),\s*(\d+),/g)];
  for (const match of titleMatches) {
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (x < 0 || x > 390 || y < 0 || y > 844) {
      errors.push(`${rel}: text at (${x}, ${y}) is outside the design canvas.`);
    }
    if (y > 820) {
      warnings.push(`${rel}: text at y=${y} is very close to the bottom safe area.`);
    }
  }
  if (text.includes('scene.restart()') && text.includes('createFilterBar')) {
    warnings.push(`${rel}: restart-based filter refresh detected. Prefer local redraw in future cleanup.`);
  }
}

const requiredScenes = [
  'WorldSelectScene.ts',
  'CardBackSelectScene.ts',
  'PackInfoScene.ts',
  'CardDetailScene.ts'
];
for (const scene of requiredScenes) {
  if (!fs.existsSync(path.join(SCENES, scene))) errors.push(`Missing required v1.0-rc scene: ${scene}`);
}

if (errors.length) {
  console.error('UI layout check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const warning of warnings.slice(0, 20)) console.warn(`UI layout warning: ${warning}`);
console.log(`UI layout check passed with ${warnings.length} warning(s).`);
