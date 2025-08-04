5miv4h-codex/create-voice-pause-video-pwa
# Voice Pause Video

A small web app that lets you upload a video, narrate a voice‑over while pausing/resuming playback with the spacebar, view a live waveform, and export a merged WebM—all in the browser without any server or build step.

## Usage
1. Run `npm run dev` to start a simple local server (uses Python's `http.server`) or open `index.html` directly in a modern browser.
2. Choose a video file and click **Start Recording**.
3. Press **Space** to pause/resume the video while audio keeps recording. Keys **R** and **E** also start recording and export respectively.
4. Click **Export** to download the combined video and narration as a WebM file.

## Development
The project uses CDN modules for React and WaveSurfer and has no npm dependencies, so `npm install` isn't required.

## License

# Voice Pause Video PWA

Voice Pause Video is a Progressive Web App that lets you upload a video and
record a narration while pausing and resuming the video without stopping the
audio capture. The project is built with React, TypeScript and Vite and runs
entirely on the client.

## Features

- Drag-and-drop or file picker video upload and preview
- Voice recording using the MediaRecorder API
- Spacebar to pause/resume video while recording continues
- Live "REC" indicator and waveform visualisation (wavesurfer.js)
- Export merged video and narration using ffmpeg.wasm (placeholder)
- PWA support with offline caching and install prompt
- Keyboard shortcuts: Space (pause/resume), R (record), E (export)

## Scripts

- `npm run dev` – start development server
- `npm run build` – build the app
- `npm test` – run unit tests with Vitest
- `npm run e2e` – run Playwright end-to-end tests

## License

main
MIT
