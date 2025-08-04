import { describe, expect, it, vi } from 'vitest';
import { togglePlay } from './toggle';

describe('togglePlay', () => {
  it('plays when paused', () => {
    const play = vi.fn();
    const pause = vi.fn();
    const video = { paused: true, play, pause };
    togglePlay(video);
    expect(play).toHaveBeenCalled();
    expect(pause).not.toHaveBeenCalled();
  });

  it('pauses when playing', () => {
    const play = vi.fn();
    const pause = vi.fn();
    const video = { paused: false, play, pause };
    togglePlay(video);
    expect(pause).toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
  });
});
