 tp3y12-codex/create-voice-pause-video-pwa
export function togglePlayback(video: { paused: boolean; play: () => void; pause: () => void }) {
  video.paused ? video.play() : video.pause();
=======
export function togglePlay(video: { paused: boolean; play: () => void; pause: () => void }): void {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
 main
}
