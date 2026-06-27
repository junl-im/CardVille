import { ModeData } from '../types/ModeTypes';

export class ModeSystem {
  static async loadMode(modeId: string): Promise<ModeData> {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/data/modes/${modeId}.json`);
    if (!response.ok) {
      throw new Error(`Mode data not found: ${modeId}`);
    }
    return (await response.json()) as ModeData;
  }
}
