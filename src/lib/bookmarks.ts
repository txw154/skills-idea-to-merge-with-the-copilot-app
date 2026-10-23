export interface Bookmark {
  url: string;
  slug: string;
}

export const STORAGE_KEY = 'mona-bookmarks';
export const SEPARATOR = ' :: ';
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** Normalise user input to a canonical http(s) URL, or return null if invalid. */
export function normalizeUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  try {
    const parsed = new URL(hasScheme ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (!parsed.hostname) return null;
    // Drop a bare trailing slash so "example.com" and "example.com/" match.
    return parsed.pathname === '/' && !parsed.search && !parsed.hash
      ? parsed.origin
      : parsed.href;
  } catch {
    return null;
  }
}

/** Generate a "mona-" slug with 4 base62 characters. */
export function generateSlug(random: () => number = Math.random): string {
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += ALPHABET[Math.min(Math.floor(random() * 62), 61)];
  }
  return `mona-${id}`;
}

export function uniqueSlug(existing: Bookmark[], random: () => number = Math.random): string {
  const taken = new Set(existing.map((b) => b.slug));
  for (let i = 0; i < 50; i++) {
    const slug = generateSlug(random);
    if (!taken.has(slug)) return slug;
  }
  return `${generateSlug(random)}${Date.now().toString(36)}`;
}

function isBookmark(value: unknown): value is Bookmark {
  if (typeof value !== 'object' || value === null) return false;
  const { url, slug } = value as Record<string, unknown>;
  return typeof url === 'string' && url.length > 0 && typeof slug === 'string' && slug.length > 0;
}

/** Validate raw stored text. Never throws; malformed data is dropped. */
export function parseStored(raw: unknown): Bookmark[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data
    .filter(isBookmark)
    .map((b) => ({ url: b.url, slug: b.slug }));
}

export function formatBookmark(b: Bookmark): string {
  return `${b.url}${SEPARATOR}${b.slug}`;
}

export function loadBookmarks(storage: Pick<Storage, 'getItem'>): Bookmark[] {
  try {
    return parseStored(storage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveBookmarks(storage: Pick<Storage, 'setItem'>, list: Bookmark[]): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
