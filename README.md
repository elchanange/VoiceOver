# Voice Pause Video

A progressive web app to upload a video, record a voice-over while pausing the video, preview a live waveform, and export the merged MP4 directly in the browser.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
npx playwright test
```

## Deployment

CI runs on every push to `main`. If lint, unit tests, and Playwright tests all pass, the app is built and deployed to GitHub Pages automatically.

## License

MIT
