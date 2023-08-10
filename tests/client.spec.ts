import { test, expect } from '@playwright/test';

const random = Math.floor(Math.random() * 100000); // avoid version collision

test('Performance - small', async ({ page }) => {
  await page.goto('http://localhost:5249/dashboard');
  await page.getByTestId('createbutton').click();
  await expect(page.getByTestId('createmodal')).toBeVisible();

  await page.getByPlaceholder('Firmware').fill('RouterOS');
  await page.getByPlaceholder('Version').fill('1.0.0-small' + random);
  await page.getByTestId('isenabled').check();
  await page.getByTestId('firmware').setInputFiles("tests/files/small.bin");
  
  const start = performance.now();

  const responsePromise =
    page.waitForResponse(response => response.url() === 'http://localhost:5249/api/updates' && response.status() === 201);
  await page.getByTestId('publish').click();
  await responsePromise;
  await expect(page.getByTestId('createmodal')).toBeHidden();

  const upload = performance.now() - start;
  console.log(upload);
});

test('Performance - medium', async ({ page }) => {
  await page.goto('http://localhost:5249/dashboard');
  await page.getByTestId('createbutton').click();
  await expect(page.getByTestId('createmodal')).toBeVisible();

  await page.getByPlaceholder('Firmware').fill('RouterOS');
  await page.getByPlaceholder('Version').fill('1.0.0-medium' + random);
  await page.getByTestId('isenabled').check();
  await page.getByTestId('firmware').setInputFiles("tests/files/medium.bin");

  const start = performance.now();

  const responsePromise =
    page.waitForResponse(response => response.url() === 'http://localhost:5249/api/updates' && response.status() === 201);
  await page.getByTestId('publish').click();
  await responsePromise;
  await expect(page.getByTestId('createmodal')).toBeHidden();

  const upload = performance.now() - start;
  console.log(upload);
});

test('Performance - large', async ({ page }) => {
  await page.goto('http://localhost:5249/dashboard');
  await page.getByTestId('createbutton').click();
  await expect(page.getByTestId('createmodal')).toBeVisible();

  await page.getByPlaceholder('Firmware').fill('RouterOS');
  await page.getByPlaceholder('Version').fill('1.0.0-large' + random);
  await page.getByTestId('isenabled').check();
  await page.getByTestId('firmware').setInputFiles("tests/files/large.bin");

  const start = performance.now();

  const responsePromise =
    page.waitForResponse(response => response.url() === 'http://localhost:5249/api/updates' && response.status() === 201);
  await page.getByTestId('publish').click();
  await responsePromise;
  await expect(page.getByTestId('createmodal')).toBeHidden();

  const upload = performance.now() - start;
  console.log(upload);
});