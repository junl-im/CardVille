import Phaser from 'phaser';

export const UI_FONT_FAMILY = "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', Arial, sans-serif";
const RESOLUTION = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

function base(size: number, color: string, stroke = '#061127', strokeThickness = 4): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${size}px`,
    fontStyle: '900',
    color,
    stroke,
    strokeThickness,
    shadow: {
      offsetX: 0,
      offsetY: 3,
      color: '#000000',
      blur: 7,
      fill: true
    },
    resolution: RESOLUTION
  };
}

export function titleText(size = 34): TextStyle {
  return base(size, '#ffffff', '#061127', 6);
}

export function goldText(size = 20): TextStyle {
  return base(size, '#ffe8a6', '#061127', 5);
}

export function bodyText(size = 15): TextStyle {
  return {
    ...base(size, '#eaf6ff', '#07142c', 3),
    fontStyle: '800'
  };
}

export function mutedText(size = 13): TextStyle {
  return {
    ...base(size, '#cfe4ff', '#07142c', 3),
    fontStyle: '800'
  };
}

export function darkText(size = 18): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${size}px`,
    fontStyle: '900',
    color: '#14233f',
    stroke: '#ffffff',
    strokeThickness: 2,
    shadow: {
      offsetX: 0,
      offsetY: 1,
      color: '#ffffff',
      blur: 1,
      fill: true
    },
    resolution: RESOLUTION
  };
}

export function cardText(size = 24): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${size}px`,
    fontStyle: '900',
    color: '#4a1b28',
    stroke: '#fffaf0',
    strokeThickness: 3,
    align: 'center',
    shadow: {
      offsetX: 0,
      offsetY: 2,
      color: '#ffffff',
      blur: 2,
      fill: true
    },
    resolution: RESOLUTION
  };
}

export function cardSmallText(size = 12): TextStyle {
  return {
    ...cardText(size),
    strokeThickness: 2
  };
}

export function applyWrap(style: TextStyle, width: number, align: 'left' | 'center' | 'right' = 'center'): TextStyle {
  return {
    ...style,
    align,
    wordWrap: { width, useAdvancedWrap: true }
  };
}
