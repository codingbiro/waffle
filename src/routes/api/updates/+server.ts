import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { CIDString } from 'web3.storage';

import type { FirmwareUdpdate } from '$src/types/firmware';
import { web3Helper, web3storageHelper } from '$src/helpers';
import { parseUpdate } from '$src/utils';
import config from '$config/index';

function parseResponse(input?: Record<string, bigint | boolean | string>[]) {
	// Invalid response
	if (!input) {
		return [];
	}

	const returnArray: FirmwareUdpdate[] = [];
	for (const i of input) {
		const update = parseUpdate(i);
		// Get all valid updates
		if (update) {
			returnArray.push(update);
		}
	}

	// Return valid updates
	return returnArray;
}

/**
 * @returns All FirmwareUdpdates
 */
export async function GET() {
	try {
		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		// Get available updates again
		const updates = parseResponse(
			await firmwareUpdatesContract.methods.getFirmwareUpdates().call({ from: defaultAccount })
		);

		// Return JSON response with Updates
		return json(updates);
	} catch (e) {
		console.log(e);
		throw error(500, 'Could not get firmware updates');
	}
}

/**
 * @description Uploads a file to Web3.Storage
 * @param file file to be uploaded
 * @returns CID of uploaded file
 */
async function handleUpload(file: File) {
	const client = web3storageHelper();

	// Save local CID
	let localCid = '';
	// This gets triggered before the CAR is uploaded to the server
	const onRootCidReady = (cid: CIDString) => (localCid = cid);

	// Upload file to Filecoin
	const serverCid = await client.put([file], { wrapWithDirectory: false, onRootCidReady });

	// Verify CID from server
	if (localCid !== serverCid) {
		throw new Error('CID mismatch');
	}

	// Return CID
	return serverCid;
}

/**
 * @description Creates a new firmware update
 * @returns CID of uploaded file
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get values from request's formData
		const values = await request.formData();
		const file = typeof values.get('file') === 'object' ? (values.get('file') as File) : undefined;
		const filename =
			typeof values.get('filename') === 'string' ? (values.get('filename') as string) : '';
		const isEnabled = values.get('isEnabled') === 'true';
		const isStable = values.get('isStable') === 'true';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';
		const version =
			typeof values.get('version') === 'string' ? (values.get('version') as string) : '';

		// Validate input
		if (!version || !file || !name) {
			throw new Error('Invalid input');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		// Upload file
		const hash = await handleUpload(file);

		// Smart contract's CreateUpdateInput
		const input = {
			hash,
			isEnabled,
			isStable,
			name,
			filename,
			version
		};

		// Estimate TX gas cost
		const gas = await firmwareUpdatesContract.methods.createFirmwareUpdate(input).estimateGas();

		// Save update with smart contract
		await firmwareUpdatesContract.methods.createFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: gas?.toString() ?? config.DEFAULT_GAS
		});

		// Return CID
		return json({ cid: hash }, { status: 201 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not create firmware update');
	}
};
