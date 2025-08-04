import { test, expect } from '@playwright/test';
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
});
