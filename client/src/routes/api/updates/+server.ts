import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { CIDString } from 'web3.storage';

import type { FirmwareUdpdate } from '$src/types/firmware';
import { web3Helper, web3storageHelper } from '$src/helpers';

function parseResponse(input?: Record<string, bigint | boolean | string>[]): FirmwareUdpdate[] {
	if (!input) {
		return [];
	}

	const returnArray: FirmwareUdpdate[] = [];

	for (const i of input) {
		if (
			i &&
			typeof i.id === 'bigint' &&
			typeof i.version === 'string' &&
			typeof i.uploader === 'string' &&
			typeof i.hash === 'string' &&
			typeof i.name === 'string' &&
			typeof i.enabled === 'boolean' &&
			typeof i.stable === 'boolean' &&
			typeof i.timestamp === 'bigint'
		) {
			returnArray.push({
				id: Number(i.id),
				version: i.version,
				uploader: i.uploader,
				hash: i.hash,
				name: i.name,
				enabled: i.enabled,
				stable: i.stable,
				timestamp: Number(i.timestamp)
			});
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
		const version =
			typeof values.get('version') === 'string' ? (values.get('version') as string) : '';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';
		const enabled = values.get('enabled') === 'true';
		const stable = values.get('stable') === 'true';
		const file = typeof values.get('file') === 'object' ? (values.get('file') as File) : undefined;

		if (!version || !file || !name) {
			throw new Error('Invalid input');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const hash = await handleUpload(file as File);

		const input = {
			version,
			enabled,
			stable,
			hash,
			name
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
