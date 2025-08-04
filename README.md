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

MIT

## Deployment

The repository includes a GitHub Pages workflow that builds the app and
publishes the `dist` directory whenever changes land on the `main` branch.
