import React, { useRef, useState, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { togglePlayback } from './utils/toggle.js';

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef();
  const recorderRef = useRef(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#2563EB',
        progressColor: '#FACC15',
        cursorWidth: 0,
        height: 80,
        plugins: [RecordPlugin.create()]
      });
    }
    return () => wavesurfer.current?.destroy();
  }, []);

  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const render = () => {
      if (!recording) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(render);
    };
    render();
  }, [recording]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  };

  const startRecording = async () => {
    if (recording) return;
    const audioStream = await wavesurfer.current?.plugins.record.startMic();
    const canvasStream = canvasRef.current?.captureStream();
    if (!canvasStream || !audioStream) return;
    const mixed = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);
    const recorder = new MediaRecorder(mixed);
    recorder.ondataavailable = (ev) => setChunks((p) => [...p, ev.data]);
    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
    drawFrame();
    videoRef.current?.play();
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    wavesurfer.current?.plugins.record.stopMic();
    setRecording(false);
    videoRef.current?.pause();
  };

  const togglePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    togglePlayback(video);
  }, []);

  const exportRecording = async () => {
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: 'video/webm' });
    const { createFFmpeg, fetchFile } = await import(
      'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/ffmpeg.min.mjs'
    );
    const ffmpeg = createFFmpeg({ log: false });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'in.webm', await fetchFile(blob));
    await ffmpeg.run('-i', 'in.webm', '-c', 'copy', 'out.mp4');
    const data = ffmpeg.FS('readFile', 'out.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.mp4';
    a.click();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.key.toLowerCase() === 'r') {
        startRecording();
      } else if (e.key.toLowerCase() === 'e') {
        exportRecording();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause, startRecording, exportRecording]);

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Voice Pause Video</h1>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="px-2 py-1 border rounded"
          >
            Toggle theme
          </button>
        </header>
        <input
          type="file"
          accept="video/*"
          aria-label="Upload"
          onChange={handleUpload}
          className="mb-2"
        />
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="w-full bg-black mb-2" />
        <div className="space-x-2">
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={startRecording}
          >
            Record
          </button>
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={togglePause}
          >
            Pause
          </button>
          <button
            className="px-4 py-2 rounded bg-accent text-black"
            onClick={exportRecording}
          >
            Export
          </button>
          {recording && <span className="ml-2 text-red-500">REC</span>}
          {recording && (
            <button className="ml-2 px-2 border rounded" onClick={stopRecording}>
              Stop
            </button>
          )}
        </div>
        <div ref={waveformRef} className="h-32 mt-4" />
      </div>
    </div>
  );
}
