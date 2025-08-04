import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugins/microphone.esm.js';
import { motion } from 'framer-motion';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WaveSurfer>();
  const recorder = useRef<MediaRecorder>();
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    ws.current = WaveSurfer.create({
      container: waveformRef.current!,
      waveColor: '#2563EB',
      progressColor: '#FACC15',
      cursorWidth: 0,
      plugins: [MicrophonePlugin.create()]
    });
    return () => ws.current?.destroy();
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    ws.current?.plugins.microphone.start();
    recorder.current = new MediaRecorder(stream);
    recorder.current.ondataavailable = ev => setChunks(p => [...p, ev.data]);
    recorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    recorder.current.start();
    videoRef.current?.play();
    setRecording(true);
  };

  const stopRecording = () => {
    recorder.current?.stop();
    ws.current?.plugins.microphone.stop();
    setRecording(false);
  };

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const exportVideo = async () => {
    if (!videoRef.current || !audioUrl) return;
    const response = await fetch(audioUrl);
    const audioBlob = await response.blob();
    const worker = new Worker(new URL('./worker/exporter.ts', import.meta.url), {
      type: 'module'
    });
    worker.postMessage({ video: videoRef.current.src, audio: audioBlob });
    worker.onmessage = e => {
      const url = URL.createObjectURL(e.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.mp4';
      a.click();
    };
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      }
      if (e.key.toLowerCase() === 'r') startRecording();
      if (e.key.toLowerCase() === 'e') exportVideo();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div>
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Voice Pause Video</h1>
          <div className="space-x-2">
            <button onClick={() => {
              document.documentElement.classList.toggle('dark');
              setDark(d => !d);
            }} className="px-2 py-1 border rounded">{dark ? 'Light' : 'Dark'}</button>
            <a href="https://github.com" className="text-primary" target="_blank" rel="noopener">GitHub</a>
          </div>
        </header>
        <input type="file" aria-label="Upload" accept="video/*" onChange={handleUpload} className="mb-2" />
        <video ref={videoRef} controls className="w-full mb-2" />
        <div className="space-x-2">
          <motion.button whileHover={{ scale:1.05 }} className="px-4 py-2 rounded-xl bg-primary text-white" onClick={startRecording}>Record</motion.button>
          <motion.button whileHover={{ scale:1.05 }} className="px-4 py-2 rounded-xl bg-primary text-white" onClick={togglePause}>Pause</motion.button>
          <motion.button whileHover={{ scale:1.05 }} className="px-4 py-2 rounded-xl bg-accent" onClick={exportVideo}>Export</motion.button>
          {recording && <motion.span className="ml-2 text-red-500" animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1 }}>REC</motion.span>}
          {recording && <button className="ml-2 px-2" onClick={stopRecording}>Stop</button>}
        </div>
      </div>
      <div ref={waveformRef} className="h-40"></div>
    </div>
  );
}
