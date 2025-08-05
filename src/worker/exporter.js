import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

self.onmessage = async (e) => {
  const { video, audio } = e.data;
  if ('VideoEncoder' in self && 'AudioEncoder' in self) {
    // WebCodecs path would go here; to keep worker lightweight we fallback to ffmpeg.wasm
  }
  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));
  ffmpeg.FS('writeFile', 'voice.webm', await fetchFile(audio));
  await ffmpeg.run('-i', 'input.mp4', '-i', 'voice.webm', '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', 'out.mp4');
  const data = ffmpeg.FS('readFile', 'out.mp4');
  self.postMessage(new Blob([data.buffer], { type: 'video/mp4' }));
};

export {}; // ensure module
