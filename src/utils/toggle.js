export function togglePlayback(video) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
