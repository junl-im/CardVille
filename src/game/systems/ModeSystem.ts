import { ModeCatalog, ModeData } from '../types/ModeTypes';

export class ModeSystem {
  static async loadCatalog(): Promise<ModeCatalog> {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/data/modes/catalog.json`);
    if (!response.ok) {
      throw new Error('Mode catalog not found.');
    }
    return (await response.json()) as ModeCatalog;
  }

  static async loadMode(modeId: string): Promise<ModeData> {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/data/modes/${modeId}.json`);
    if (!response.ok) {
      throw new Error(`Mode data not found: ${modeId}`);
    }
    return (await response.json()) as ModeData;
  }
}
