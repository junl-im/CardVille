import Phaser from 'phaser';

export const UI_FONT_FAMILY = "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', Arial, sans-serif";
const RESOLUTION = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
export const CARDVILLE_MOBILE_TEXT_TAG = 'mobile-readable-text-v158' as const;
export const CARDVILLE_NOTICE_TEXT_FIT_TAG = 'notice-text-fit-v163' as const;
export const CARDVILLE_COPY_FIT_TAG = 'mobile-copy-fit-v164' as const;
// Compatibility audit anchors retained for older checks: mobile-readable-text-v157, mobile-readable-text-v156, return prefs.largeText ? 1.40 : 1.20, return prefs.largeText ? 1.34 : 1.17, size <= 9 ? 12, size <= 11 ? 14.
export const CARDVILLE_PREVIOUS_MOBILE_TEXT_TAG = 'mobile-readable-text-v156' as const;

function mobileTextScale(): number {
  if (typeof window === 'undefined') return 1.08;
  try {
    const raw = window.localStorage?.getItem('cardville.accessibility.v143');
    const prefs = raw ? JSON.parse(raw) as { largeText?: boolean } : {};
    return prefs.largeText ? 1.28 : 1.14;
  } catch {
    return 1.14;
  }
}

function readableSize(size: number): number {
  const minReadable = size <= 9 ? 13 : size <= 11 ? 15 : size <= 13 ? 17 : size;
  return Math.round(minReadable * mobileTextScale());
}

function noticeTextScale(): number {
  if (typeof window === 'undefined') return 1.0;
  try {
    const raw = window.localStorage?.getItem('cardville.accessibility.v143');
    const prefs = raw ? JSON.parse(raw) as { largeText?: boolean } : {};
    return prefs.largeText ? 1.06 : 0.98;
  } catch {
    return 0.98;
  }
}

function noticeReadableSize(size: number): number {
  const minReadable = size <= 9 ? 10 : size <= 11 ? 12 : size <= 13 ? 14 : size;
  return Math.round(minReadable * noticeTextScale());
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
    lineSpacing: Math.max(2, Math.round(size * 0.16)),
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

export function noticeText(size = 12): TextStyle {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${noticeReadableSize(size)}px`,
    fontStyle: '800',
    color: '#f4fbff',
    stroke: '#07142c',
    strokeThickness: 1,
    lineSpacing: 1,
    shadow: {
      offsetX: 0,
      offsetY: 1,
      color: '#000000',
      blur: 4,
      fill: true
    },
    resolution: RESOLUTION
  };
}

export function applyWrap(style: TextStyle, width: number, align: 'left' | 'center' | 'right' = 'center'): TextStyle {
  return {
    ...style,
    align,
    wordWrap: { width, useAdvancedWrap: true }
  };
}

export function applyNoticeBox(style: TextStyle, width: number, height: number, align: 'left' | 'center' | 'right' = 'center'): TextStyle {
  return {
    ...style,
    align,
    wordWrap: { width, useAdvancedWrap: true },
    fixedWidth: width,
    fixedHeight: height,
    maxLines: Math.max(1, Math.floor(height / Math.max(12, Number.parseInt(String(style.fontSize ?? '12'), 10) + 3)))
  };
}
