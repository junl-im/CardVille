import { GAME_HEIGHT, GAME_WIDTH } from '../config/phaserConfig';

export interface GridPosition {
  x: number;
  y: number;
}

export class LayoutSystem {
  static readonly width = GAME_WIDTH;
  static readonly height = GAME_HEIGHT;
  static readonly safeTop = 28;
  static readonly safeBottom = 818;
  static readonly contentLeft = 30;
  static readonly contentRight = GAME_WIDTH - 30;

  static cardGrid(count: number): GridPosition[] {
    const cols = count <= 4 ? 2 : 2;
    const rows = Math.ceil(count / cols);
    const startY = rows >= 4 ? 226 : 268;
    const gapY = rows >= 4 ? 160 : 174;
    const gapX = 176;
    const startX = GAME_WIDTH / 2 - gapX / 2;
    const positions: GridPosition[] = [];

    for (let index = 0; index < count; index += 1) {
      positions.push({
        x: startX + (index % cols) * gapX,
        y: startY + Math.floor(index / cols) * gapY
      });
    }

    return positions;
  }

  static page<T>(items: T[], page: number, pageSize: number): T[] {
    return items.slice(page * pageSize, page * pageSize + pageSize);
  }

  static clampPage(page: number, totalItems: number, pageSize: number): number {
    const maxPage = Math.max(0, Math.ceil(totalItems / pageSize) - 1);
    return Math.min(Math.max(0, page), maxPage);
  }
}
