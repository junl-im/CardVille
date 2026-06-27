import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const modesDir = path.join(root, 'public/assets/data/modes');
const catalog = JSON.parse(fs.readFileSync(path.join(modesDir, 'catalog.json'), 'utf8'));
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON: ${filePath} ${error.message}`);
    return null;
  }
}

for (const item of catalog.modes ?? []) {
  if (item.status !== 'open') continue;
  const filePath = path.join(modesDir, `${item.modeId}.json`);
  assert(fs.existsSync(filePath), `Open mode missing JSON: ${item.modeId}`);
  const mode = readJson(filePath);
  if (!mode) continue;
  assert(mode.modeId === item.modeId, `Mode id mismatch in ${filePath}`);
  assert(Array.isArray(mode.stages) && mode.stages.length > 0, `Mode has no stages: ${item.modeId}`);

  for (const stage of mode.stages ?? []) {
    assert(typeof stage.stageId === 'string', `Stage missing stageId in ${item.modeId}`);
    assert(stage.cards?.length === stage.goal?.targetCount * 2, `Stage card count must be targetCount*2: ${stage.stageId}`);
    const counts = new Map();
    for (const card of stage.cards ?? []) {
      assert(typeof card.id === 'string', `Card missing id in ${stage.stageId}`);
      assert(typeof card.answerKey === 'string', `Card missing answerKey in ${stage.stageId}`);
      counts.set(card.answerKey, (counts.get(card.answerKey) ?? 0) + 1);
      assert(['common','uncommon','rare','epic','legendary','mythic'].includes(card.rarity), `Invalid rarity ${card.rarity} in ${stage.stageId}`);
    }
    for (const [answerKey, count] of counts.entries()) {
      assert(count === 2, `answerKey '${answerKey}' appears ${count} times in ${stage.stageId}; expected 2`);
    }
  }
}

const collection = readJson(path.join(root, 'public/assets/data/cards/collection.base.json'));
const packs = readJson(path.join(root, 'public/assets/data/packs/card_packs.json'));
const setIds = new Set((collection?.sets ?? []).map((set) => set.setId));
for (const pack of packs?.packs ?? []) {
  for (const setId of pack.availableSets ?? []) {
    assert(setIds.has(setId), `Pack ${pack.packId} references missing set ${setId}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('JSON data check passed.');
