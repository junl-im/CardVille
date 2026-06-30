import Phaser from 'phaser';

export const UI_FONT_FAMILY = "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', Arial, sans-serif";
const RESOLUTION = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
export const CARDVILLE_MOBILE_TEXT_TAG = 'mobile-readable-text-v156' as const;

function mobileTextScale(): number {
  if (typeof window === 'undefined') return 1.08;
  try {
    const raw = window.localStorage?.getItem('cardville.accessibility.v143');
    const prefs = raw ? JSON.parse(raw) as { largeText?: boolean } : {};
    return prefs.largeText ? 1.34 : 1.17;
  } catch {
    return 1.17;
  }
}

function readableSize(size: number): number {
  const minReadable = size <= 9 ? 12 : size <= 11 ? 14 : size <= 13 ? 16 : size;
  return Math.round(minReadable * mobileTextScale());
}

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

function base(size: number, color: string, stroke = '#061127', strokeThickness = 4): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${readableSize(size)}px`,
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

export function bodyText(size = 16): TextStyle {
  return {
    ...base(size, '#eaf6ff', '#07142c', 3),
    fontStyle: '800'
  };
}

export function mutedText(size = 14): TextStyle {
  return {
    ...base(size, '#cfe4ff', '#07142c', 3),
    fontStyle: '800'
  };
}

export function darkText(size = 18): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${readableSize(size)}px`,
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
    fontSize: `${readableSize(size)}px`,
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

export function cardSmallText(size = 13): TextStyle {
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
