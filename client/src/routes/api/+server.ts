import { Web3 } from 'web3';
import config from '../../../config/index';
import { error, json } from '@sveltejs/kit';
import { Web3Storage } from 'web3.storage';
import 'dotenv/config.js';

const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
const [defaultAccount] = await web3.eth.getAccounts();

interface FirmwareUdpdate {
	id: number;
	version: string;
	uploader: string;
	hash: string;
	enabled: boolean;
	latest: boolean;
	timestamp: number;
}

function parseResponse(input?: Record<string, bigint | boolean | string>[]): FirmwareUdpdate[] {
	if (!input) {
		return [];
	}

	const returnArray: FirmwareUdpdate[] = [];

	for (const i of input) {
		if (i) {
			if (
				typeof i.id === 'bigint' &&
				typeof i.version === 'string' &&
				typeof i.uploader === 'string' &&
				typeof i.hash === 'string' &&
				typeof i.enabled === 'boolean' &&
				typeof i.latest === 'boolean' &&
				typeof i.timestamp === 'bigint'
			) {
				returnArray.push({
					id: Number(i.id),
					version: i.version,
					uploader: i.uploader,
					hash: i.hash,
					enabled: i.enabled,
					latest: i.latest,
					timestamp: Number(i.timestamp)
				});
			}
		}
	}

	return returnArray;
}

export async function GET() {
	try {
		const FirmwareUpdatesContract = new web3.eth.Contract(config.abi, config.deployedAddress);

		// Get available updates again
		const updates = parseResponse(
			await FirmwareUpdatesContract.methods.getFirmwareUpdates().call()
		);

		return json(updates);
	} catch (e) {
		throw error(500, 'Could not get firmware updates');
	}
}

async function handleUpload(file: File) {
	if (!process.env.TOKEN) {
		throw new Error('Missing TOKEN');
	}
	const client = new Web3Storage({ token: process.env.TOKEN });

	// Upload file to Filecoin
	const rootCid = await client.put([file]);

	return rootCid;
}

export async function POST({ request }) {
	try {
		const values = await request.formData();
		const version = values.get('version') as string;
		const enabled = values.get('enabled') === 'true';
		const latest = values.get('latest') === 'true';
		const file = values.get('file') as File;

		if (!version || !file) {
			throw new Error('Invalid input');
		}

		const hash = await handleUpload(file);

		const FirmwareUpdatesContract = new web3.eth.Contract(config.abi, config.deployedAddress);

		const input = {
			version,
			enabled,
			latest,
			hash
		};

		await FirmwareUpdatesContract.methods.createFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: '1000000',
			gasPrice: '10000000000'
		});

		return json({ cid: hash }, { status: 201 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not create firmware update');
	}
}
