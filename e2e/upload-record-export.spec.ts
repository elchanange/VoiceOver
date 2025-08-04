import { test, expect } from '@playwright/test';

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
});
