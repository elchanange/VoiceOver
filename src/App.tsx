import React, { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { togglePlay } from './utils/toggle';
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer>();

  useEffect(() => {
    if (waveformRef.current && !waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ff3333',
        cursorWidth: 1,
        height: 80,
      });
    }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && videoRef.current) {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;
    }
  };

  const startRecording = async () => {
    if (recording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (ev) => {
      chunks.push(ev.data);
      waveSurferRef.current?.loadBlob(new Blob(chunks));
    };
    recorder.onstop = () => {
      setAudioChunks(chunks);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
    videoRef.current?.play();
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    videoRef.current?.pause();
  };

  const togglePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    togglePlay(video);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.key.toLowerCase() === 'r') {
        startRecording();
      } else if (e.key.toLowerCase() === 'e') {
        exportVideo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause]);

  const exportVideo = async () => {
    if (!videoRef.current) return;
    const videoBlob = await fetch(videoRef.current.src).then((r) => r.blob());
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    // Placeholder for ffmpeg.wasm merge. Actual implementation would run in a worker.
    const merged = new Blob([videoBlob, audioBlob], { type: 'video/webm' });
    const url = URL.createObjectURL(merged);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <h1>Voice Pause Video</h1>
      <input type="file" accept="video/*" onChange={handleFile} />
      <div>
        <video ref={videoRef} width={640} controls />
      </div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {recording && <span className="rec">REC</span>}
      <div ref={waveformRef} />
      <button onClick={exportVideo}>Export</button>
    </div>
  );
};

export default App;
