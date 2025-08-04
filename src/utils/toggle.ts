export function togglePlay(video: { paused: boolean; play: () => void; pause: () => void }): void {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
