import { ModeData, ModeMeta, StageData } from '../types/GameData';

export const MODE_LIST: ModeMeta[] = [
  {
    modeId: 'word_ko_basic',
    title: '낱말 카드',
    description: '같은 뜻을 가진 카드를 찾아요.',
    dataPath: 'assets/data/modes/word.ko.basic.json',
    emoji: '📚',
  },
  {
    modeId: 'memory_basic',
    title: '기억력 카드',
    description: '위치를 기억해서 같은 카드를 맞춰요.',
    dataPath: 'assets/data/modes/memory.basic.json',
    emoji: '🧠',
  },
  {
    modeId: 'math_basic',
    title: '연산 카드',
    description: '문제와 정답 카드를 연결해요.',
    dataPath: 'assets/data/modes/math.basic.json',
    emoji: '➕',
  },
];

const modeCache = new Map<string, ModeData>();

export class ModeSystem {
  static getModeList(): ModeMeta[] {
    return MODE_LIST;
  }

  static async loadMode(modeId: string): Promise<ModeData> {
    const cached = modeCache.get(modeId);
    if (cached) return cached;

    const meta = MODE_LIST.find((item) => item.modeId === modeId);
    if (!meta) throw new Error(`Unknown mode: ${modeId}`);

    const response = await fetch(`${import.meta.env.BASE_URL}${meta.dataPath}`);
    if (!response.ok) throw new Error(`Failed to load mode data: ${modeId}`);

    const data = (await response.json()) as ModeData;
    modeCache.set(modeId, data);
    return data;
  }

  static getStage(mode: ModeData, stageIndex: number): StageData {
    const stage = mode.stages[stageIndex];
    if (!stage) return mode.stages[0];
    return stage;
  }
}
