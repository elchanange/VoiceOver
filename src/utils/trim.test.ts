import { describe, expect, it } from 'vitest';
import { trimBuffer } from './trim';

describe('trimBuffer', () => {
  it('trims to given range', () => {
    const data = new Float32Array([1, 2, 3, 4, 5]);
    const trimmed = trimBuffer(data, 1, 3);
    expect(Array.from(trimmed)).toEqual([2, 3]);
  });

  it('throws on invalid range', () => {
    const data = new Float32Array([1, 2, 3]);
    expect(() => trimBuffer(data, 2, 1)).toThrow();
  });
});
