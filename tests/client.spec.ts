import { test, expect } from '@playwright/test';
import { info } from 'console';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const test1Files = [
	'small.zip', // 2 MB
	'medium.zip', // 11 MB
	'large.zip' // 48 MB
];

// Files retrieved from https://www.ui.com/download/releases/firmware
const test2Files = [
	'5916-UNVR-3.1.14-47633012-2988-43d6-bf38-e3dc693a152f.bin',
	'BZ.mt7621_6.5.28+14491.230127.2313.bin',
	'BZ.qca956x_6.5.28+14491.230127.1612.bin',
	'ER-e300.v2.0.9-hotfix.5.5554172.tar',
	'OLT.xgs.v4.5.3.ea4948f.230801.1125.bin',
	'UF-OLT.v4.5.3.5672.230801.1406.tar',
	'US.mt7628_6.5.32+14509.230207.0929.bin',
	'US2.bcm5334x_6.5.32+14509.230207.0931.bin',
	'XW.v6.3.11.33396.230425.1644.bin'
];

const APP_ROOT = 'http://localhost:5249';

// Loops through all Test 2 cases
for (const file of test2Files) {
  // Tests a case
  test('Performance testing: ' + file, async ({ page }) => {
	// Random version to avoid version collision
	const version = Math.floor(Math.random() * 100000) + file.substring(0, 5);

	// Navigate to dashboard and open createmodal
	await page.goto(`${APP_ROOT}/dashboard`);
	await page.getByTestId('createbutton').click();
	await expect(page.getByTestId('createmodal')).toBeVisible();

	// Fill out createmodal form
	await page.getByPlaceholder('Firmware').fill('Unify TestOS');
	await page.getByPlaceholder('Version').fill(version);
	await page.getByTestId('filename').fill(file);
	await page.getByTestId('isenabled').check();
	await page.getByTestId('firmware').setInputFiles('tests/files/' +  file);

	// Start timer1
	const start1 = performance.now();

	// Promise for awaiting API request for creating the firmware is resolved
	let responsePromise = page.waitForResponse(
		(response) =>
			response.url() === `${APP_ROOT}/api/updates` && response.status() === 201
	);
	// Submit form
	await page.getByTestId('publish').click();
	// Await Promise after submitting
	await responsePromise;
	// Modal should be closed after promise is resolved
	await expect(page.getByTestId('createmodal')).toBeHidden();

	// End timer1
	const end1 = performance.now() - start1;
	info('Upload speed (ms): ' + end1);

	// Promise for awaiting API request for querying the update
	responsePromise = page.waitForResponse(
		(response) =>
			response.url().startsWith(`${APP_ROOT}/api/updates/`) && response.status() === 200
	);
	// Click the update in the table
	await page.getByText(version).click();
	// Await Promise after clicking
	await responsePromise;

	// Start timer2
	const start2 = performance.now();

	// Promise for download event
	const downloadPromise = page.waitForEvent('download');
	// Start download
	await page.getByTestId('download').click();
	// Await Promise for download
	const download = await downloadPromise;
	// Await download.path to finish = download done
	await download.path();

	// End timer2
	const end2 = performance.now() - start2;
	info('Download speed (ms): ' + end2);
  });
}