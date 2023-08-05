import { Web3 } from 'web3';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { Web3Storage, type CIDString } from 'web3.storage';

import config from '$config';
import 'dotenv/config.js';
import type { FirmwareUdpdate } from '$src/types/firmware';

const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
const [defaultAccount] = await web3.eth.getAccounts();
const FirmwareUpdatesContract = new web3.eth.Contract(config.abi, config.deployedAddress);
if (!process.env.TOKEN) {
	throw new Error('Missing TOKEN');
}
const client = new Web3Storage({ token: process.env.TOKEN });

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
		// Get available updates again
		const updates = parseResponse(
			await FirmwareUpdatesContract.methods.getFirmwareUpdates().call({ from: defaultAccount })
		);

		return json(updates);
	} catch (e) {
		console.log(e);
		throw error(500, 'Could not get firmware updates');
	}
}

async function handleUpload(file: File) {
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

		const hash = await handleUpload(file as File);

		const input = {
			version,
			enabled,
			stable,
			hash,
			name
		};

		await FirmwareUpdatesContract.methods.createFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: '1000000' // TODO!
		});

		return json({ cid: hash }, { status: 201 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not create firmware update');
	}
};
