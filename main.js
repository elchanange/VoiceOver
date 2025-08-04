import React, { useRef, useState, useEffect, useCallback } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import WaveSurfer from 'https://esm.sh/wavesurfer.js@7';

function App() {
  const videoRef = useRef(null);
  const waveformRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (waveformRef.current) {
      waveformRef.current.ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ff3333',
        height: 80
      });
    }
  }, []);

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  };

  const startRecording = async () => {
    if (recording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (ev) => {
      chunks.push(ev.data);
      const blob = new Blob(chunks, { type: 'audio/webm' });
      waveformRef.current.ws?.loadBlob(blob);
    };
    recorder.onstop = () => setAudioChunks(chunks);
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
    videoRef.current?.play();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    videoRef.current?.pause();
  };

  const togglePause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.key?.toLowerCase() === 'r') {
        startRecording();
      } else if (e.key?.toLowerCase() === 'e') {
        exportVideo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause]);

  const exportVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    const videoBlob = await fetch(video.src).then(r => r.blob());
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const merged = new Blob([videoBlob, audioBlob], { type: 'video/webm' });
    const url = URL.createObjectURL(merged);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

    return React.createElement('div', { className: 'app' },
      React.createElement('h1', null, 'Voice Pause Video'),
      React.createElement('input', { type: 'file', accept: 'video/*', onChange: handleFile }),
      React.createElement('div', null,
        React.createElement('video', { ref: videoRef, width: 640, controls: true })
      ),
      React.createElement('button', { onClick: recording ? stopRecording : startRecording }, recording ? 'Stop Recording' : 'Start Recording'),
      recording && React.createElement('span', { className: 'rec' }, 'REC'),
      React.createElement('div', { ref: waveformRef }),
      React.createElement('button', { onClick: exportVideo }, 'Export')
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
