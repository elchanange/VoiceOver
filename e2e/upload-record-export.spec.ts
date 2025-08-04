import { test, expect } from '@playwright/test';
 tp3y12-codex/create-voice-pause-video-pwa

// base64 tiny webm clip
const sample = 'GkXfo0AgQoaBAUL4......'; // truncated placeholder

function b64toFile(b64: string, filename: string, type: string) {
  const bin = Buffer.from(b64, 'base64');
  return new File([bin], filename, { type });
}

test('happy path', async ({ page }) => {
  await page.goto('/');
  const file = b64toFile(sample, 'test.webm', 'video/webm');
  await page.getByLabel('Upload').setInputFiles(file);
  await page.getByText('Record').click();
  await page.waitForTimeout(3000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Space');
  await page.keyboard.press('e');
  // verify download triggered
=======
import { Buffer } from 'buffer';

const SAMPLE_WEBM = Buffer.from(
  // Minimal WebM container (1px, 1 frame)
  'GkXfo0AgQoaBAULyg5IehPTcVQCgAAAAAAUAAA',
  'base64'
);

test('upload-record-export happy path', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const fileInput = page.locator('input[type=file]');
  await fileInput.setInputFiles({
    name: 'sample.webm',
    mimeType: 'video/webm',
    buffer: SAMPLE_WEBM
  });
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  await page.keyboard.press('KeyE');
  const download = await page.waitForEvent('download');
  const suggested = download.suggestedFilename();
  expect(suggested).toContain('output');
 main
});
