import { test, expect } from '@playwright/test';
import { info } from 'console';

// Sampel files for test 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const test1Files = [
	'small.zip', // 2 MB
	'medium.zip', // 11 MB
	'large.zip' // 48 MB
];

// Files retrieved from https://www.ui.com/download/releases/firmware
// Test 2 files
const test2Files = [
	'5916-UNVR-3.1.14-47633012-2988-43d6-bf38-e3dc693a152f.bin',
	'BZ.mt7621_6.5.28+14491.230127.2313.bin',
	'BZ.qca956x_6.5.28+14491.230127.1612.bin',
	'ER-e300.v2.0.9-hotfix.5.5554172.tar',
	'IL.qca956x_6.2.52+14128.221219.1403.bin',
	'OLT.xgs.v4.5.3.ea4948f.230801.1125.bin',
	'UF-OLT.v4.5.3.5672.230801.1406.tar',
	'US.mt7628_6.5.32+14509.230207.0929.bin',
	'US2.bcm5334x_6.5.32+14509.230207.0931.bin',
	'XW.v6.3.11.33396.230425.1644.bin'
];

const ROOT = 'http://localhost:5249';

for (const file of test2Files) {
  test('Performance testing: ' + file, async ({ page }) => {
	const version = Math.floor(Math.random() * 100000) + file.substring(0, 5); // avoid version collision
	await page.goto(`${ROOT}/dashboard`);
	await page.getByTestId('createbutton').click();
	await expect(page.getByTestId('createmodal')).toBeVisible();

	await page.getByPlaceholder('Firmware').fill('Unify TestOS');
	await page.getByPlaceholder('Version').fill(version);
	await page.getByTestId('filename').fill(file);
	await page.getByTestId('isenabled').check();
	await page.getByTestId('firmware').setInputFiles('tests/files/' +  file);

	let start = performance.now();

	let responsePromise = page.waitForResponse(
		(response) =>
			response.url() === `${ROOT}/api/updates` && response.status() === 201
	);
	await page.getByTestId('publish').click();
	await responsePromise;
	await expect(page.getByTestId('createmodal')).toBeHidden();

	let end = performance.now() - start;
	info('Upload speed (ms): ' + end);

	responsePromise = page.waitForResponse(
		(response) =>
			response.url().startsWith(`${ROOT}/api/updates/`) && response.status() === 200
	);
	await page.getByText(version).click();
	await responsePromise;

	start = performance.now();

	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('download').click();
	const download = await downloadPromise;
	await download.path();
	end = performance.now() - start;

	info('Download speed (ms): ' + end);
  });
}