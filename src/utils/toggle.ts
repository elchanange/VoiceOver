export function togglePlayback(video: { paused: boolean; play: () => void; pause: () => void }) {
  video.paused ? video.play() : video.pause();
}
