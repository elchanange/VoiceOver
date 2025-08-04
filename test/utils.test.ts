import { describe, it, expect, vi } from 'vitest';
import { trimBuffer } from '../src/utils/trim';
import { togglePlayback } from '../src/utils/toggle';

describe('trimBuffer', () => {
  it('trims a Float32Array', () => {
    const buf = new Float32Array([0,1,2,3,4]);
    const trimmed = trimBuffer(buf, 1, 3);
    expect(Array.from(trimmed)).toEqual([1,2]);
  });
});

describe('togglePlayback', () => {
  it('plays when paused', () => {
    const play = vi.fn();
    const pause = vi.fn();
    togglePlayback({ paused: true, play, pause });
    expect(play).toHaveBeenCalled();
  });
  it('pauses when playing', () => {
    const play = vi.fn();
    const pause = vi.fn();
    togglePlayback({ paused: false, play, pause });
    expect(pause).toHaveBeenCalled();
  });
});
