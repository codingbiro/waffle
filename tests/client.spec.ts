import { test, expect } from '@playwright/test';
import { info } from 'console';

const random = Math.floor(Math.random() * 100000); // avoid version collision

test('Performance - small', async ({ page }) => {
	await page.goto('http://localhost:5249/dashboard');
	await page.getByTestId('createbutton').click();
	await expect(page.getByTestId('createmodal')).toBeVisible();

	await page.getByPlaceholder('Firmware').fill('RouterOS');
	await page.getByPlaceholder('Version').fill('1.0.0-small' + random);
	await page.getByTestId('isenabled').check();
	await page.getByTestId('firmware').setInputFiles('tests/files/small.bin');

	let start = performance.now();

	let responsePromise = page.waitForResponse(
		(response) =>
			response.url() === 'http://localhost:5249/api/updates' && response.status() === 201
	);
	await page.getByTestId('publish').click();
	await responsePromise;
	await expect(page.getByTestId('createmodal')).toBeHidden();

	let end = performance.now() - start;
	info("Upload speed (ms): " + end);

	responsePromise = page.waitForResponse(
		(response) =>
			response.url().startsWith('http://localhost:5249/api/updates/') && response.status() === 200
	);
	await page.getByText('1.0.0-small' + random).click();
	await responsePromise;

	start = performance.now();

	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('download').click();
	const download = await downloadPromise;
	await download.path();
	end = performance.now() - start;

	info("Download speed (ms): " + end);
});

test('Performance - medium', async ({ page }) => {
	await page.goto('http://localhost:5249/dashboard');
	await page.getByTestId('createbutton').click();
	await expect(page.getByTestId('createmodal')).toBeVisible();

	await page.getByPlaceholder('Firmware').fill('RouterOS');
	await page.getByPlaceholder('Version').fill('1.0.0-medium' + random);
	await page.getByTestId('isenabled').check();
	await page.getByTestId('firmware').setInputFiles('tests/files/medium.bin');

	let start = performance.now();

	let responsePromise = page.waitForResponse(
		(response) =>
			response.url() === 'http://localhost:5249/api/updates' && response.status() === 201
	);
	await page.getByTestId('publish').click();
	await responsePromise;
	await expect(page.getByTestId('createmodal')).toBeHidden();

	let end = performance.now() - start;
	info("Upload speed (ms): " + end);

	responsePromise = page.waitForResponse(
		(response) =>
			response.url().startsWith('http://localhost:5249/api/updates/') && response.status() === 200
	);
	await page.getByText('1.0.0-medium' + random).click();
	await responsePromise;

	start = performance.now();

	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('download').click();
	const download = await downloadPromise;
	await download.path();
	end = performance.now() - start;

	info("Download speed (ms): " + end);
});

test('Performance - large', async ({ page }) => {
	await page.goto('http://localhost:5249/dashboard');
	await page.getByTestId('createbutton').click();
	await expect(page.getByTestId('createmodal')).toBeVisible();

	await page.getByPlaceholder('Firmware').fill('RouterOS');
	await page.getByPlaceholder('Version').fill('1.0.0-large' + random);
	await page.getByTestId('isenabled').check();
	await page.getByTestId('firmware').setInputFiles('tests/files/large.bin');

	let start = performance.now();

	let responsePromise = page.waitForResponse(
		(response) =>
			response.url() === 'http://localhost:5249/api/updates' && response.status() === 201
	);
	await page.getByTestId('publish').click();
	await responsePromise;
	await expect(page.getByTestId('createmodal')).toBeHidden();

	let end = performance.now() - start;
	info("Upload speed (ms): " + end);

	responsePromise = page.waitForResponse(
		(response) =>
			response.url().startsWith('http://localhost:5249/api/updates/') && response.status() === 200
	);
	await page.getByText('1.0.0-large' + random).click();
	await responsePromise;

	start = performance.now();

	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('download').click();
	const download = await downloadPromise;
	await download.path();
	end = performance.now() - start;

	info("Download speed (ms): " + end);
});
