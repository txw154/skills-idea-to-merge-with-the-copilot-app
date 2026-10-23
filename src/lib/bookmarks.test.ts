import { describe, expect, it } from 'vitest';
import {
  formatBookmark,
  generateSlug,
  loadBookmarks,
  normalizeUrl,
  parseStored,
} from './bookmarks';

describe('normalizeUrl', () => {
  it('normalises with and without https:// to the same value', () => {
    const a = normalizeUrl('www.example.com');
    expect(a).toBe('https://www.example.com');
    expect(normalizeUrl('https://www.example.com')).toBe(a);
    expect(normalizeUrl('  https://www.example.com/ ')).toBe(a);
  });
  it('rejects invalid input', () => {
    expect(normalizeUrl('')).toBeNull();
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl(42)).toBeNull();
  });
});

describe('generateSlug', () => {
  it('makes mona- plus 4 base62 chars', () => {
    expect(generateSlug()).toMatch(/^mona-[0-9A-Za-z]{4}$/);
  });
});

describe('parseStored', () => {
  it('recovers from empty, corrupted, legacy and non-array values', () => {
    expect(parseStored(null)).toEqual([]);
    expect(parseStored('')).toEqual([]);
    expect(parseStored('{not json')).toEqual([]);
    expect(parseStored('"hello"')).toEqual([]);
    expect(parseStored('{"url":"a","slug":"b"}')).toEqual([]);
    expect(parseStored('["https://a.com","https://b.com"]')).toEqual([]);
    expect(parseStored('null')).toEqual([]);
  });
  it('drops malformed entries and keeps valid ones', () => {
    const raw = JSON.stringify([
      { url: 'https://a.com', slug: 'mona-1111', extra: 1 },
      { url: 5, slug: 'x' },
      null,
      { url: 'https://b.com' },
    ]);
    expect(parseStored(raw)).toEqual([{ url: 'https://a.com', slug: 'mona-1111' }]);
  });
  it('loadBookmarks never throws if storage throws', () => {
    expect(loadBookmarks({ getItem: () => { throw new Error('denied'); } })).toEqual([]);
  });
});

describe('formatBookmark', () => {
  it('uses the exact " :: " separator', () => {
    expect(formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' })).toBe(
      'https://www.example.com :: mona-7fk2',
    );
  });
});
