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
MIT
