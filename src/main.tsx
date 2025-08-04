import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
 tp3y12-codex/create-voice-pause-video-pwa
import './index.css';
=======
 main

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
 tp3y12-codex/create-voice-pause-video-pwa
  navigator.serviceWorker.register('/sw.js');
=======
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
 main
}
