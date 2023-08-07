import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { CIDString } from 'web3.storage';

import type { FirmwareUdpdate } from '$src/types/firmware';
import { web3Helper, web3storageHelper } from '$src/helpers';
import { parseUpdate } from '$src/utils';

function parseResponse(input?: Record<string, bigint | boolean | string>[]): FirmwareUdpdate[] {
	if (!input) {
		return [];
	}

	const returnArray: FirmwareUdpdate[] = [];

	for (const i of input) {
		const update = parseUpdate(i);
		if (update) {
			returnArray.push(update);
		}
	}

	return returnArray;
}

export async function GET() {
	try {
		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		// Get available updates again
		const updates = parseResponse(
			await firmwareUpdatesContract.methods.getFirmwareUpdates().call({ from: defaultAccount })
		);

		return json(updates);
	} catch (e) {
		console.log(e);
		throw error(500, 'Could not get firmware updates');
	}
}

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

	return serverCid;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const values = await request.formData();
		const file = typeof values.get('file') === 'object' ? (values.get('file') as File) : undefined;
		const isEnabled = values.get('isEnabled') === 'true';
		const isStable = values.get('isStable') === 'true';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';
		const version =
			typeof values.get('version') === 'string' ? (values.get('version') as string) : '';

		if (!version || !file || !name) {
			throw new Error('Invalid input');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const hash = await handleUpload(file as File);

		const input = {
			hash,
			isEnabled,
			isStable,
			name,
			version
		};

		/**
		 * @TODO
        	// Estimate gas consumption
        	const gas = await firmwareUpdatesContract.estimateGas({
            	from: defaultAccount,
        	});
        	console.info('estimateGas', gas, '| deployer account', defaultAccount);
		 */

		await firmwareUpdatesContract.methods.createFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: '1000000' //
		});

		return json({ cid: hash }, { status: 201 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not create firmware update');
	}
};
