export function sanitizeText(value: unknown, fallback = '', maxLength = 40): string {
  const text = typeof value === 'string' ? value : fallback;
  return text
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>`]/g, '')
    .trim()
    .slice(0, maxLength) || fallback;
}

export function clampInt(value: unknown, min: number, max: number, fallback = min): number {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

export function safeJsonRecord(value: string | null): Record<string, unknown> {
  if (!value || value.length > 250_000) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function safeId(value: unknown, fallback = 'unknown'): string {
  const text = sanitizeText(value, fallback, 80).toLowerCase();
  return /^[a-z0-9:_-]{1,80}$/.test(text) ? text : fallback;
}

export function isSafeEmail(email: string): boolean {
  return email.length >= 5
    && email.length <= 254
    && /^[^\s@<>`]+@[^\s@<>`]+\.[^\s@<>`]+$/.test(email);
}
