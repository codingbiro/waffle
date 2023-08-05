import { Web3 } from 'web3';
import config from '$config';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import 'dotenv/config.js';
import type { FirmwareUdpdate } from '$src/types/firmware';

const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
const [defaultAccount] = await web3.eth.getAccounts();
const FirmwareUpdatesContract = new web3.eth.Contract(config.abi, config.deployedAddress);

if (!process.env.TOKEN) {
	throw new Error('Missing TOKEN');
}

function parseResponse(
	input?: Record<string, bigint | boolean | string>
): FirmwareUdpdate | undefined {
	if (!input) {
		return undefined;
	}

	if (
		typeof input.id === 'bigint' &&
		typeof input.version === 'string' &&
		typeof input.uploader === 'string' &&
		typeof input.hash === 'string' &&
		typeof input.name === 'string' &&
		typeof input.enabled === 'boolean' &&
		typeof input.stable === 'boolean' &&
		typeof input.timestamp === 'bigint'
	) {
		return input.hash
			? {
					id: Number(input.id),
					version: input.version,
					uploader: input.uploader,
					hash: input.hash,
					name: input.name,
					enabled: input.enabled,
					stable: input.stable,
					timestamp: Number(input.timestamp)
			  }
			: undefined;
	}

	return undefined;
}
export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = params.id ?? -1;

		const update = parseResponse(
			await FirmwareUpdatesContract.methods.getFirmwareUpdate(id).call({ from: defaultAccount })
		);

		if (!update) {
			throw new Error('Invalid udpate');
		}

		const fileUrl = `https://${update.hash}.ipfs.w3s.link/`;

		return json({ ...update, fileUrl });
	} catch (e) {
		console.log(e);
		throw error(500, 'Could not get firmware update');
	}
};

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const values = await request.formData();
		const enabled = values.get('enabled') === 'true';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';

		if (!params.id || !name) {
			throw new Error('Invalid input');
		}

		const input = {
			id: params.id,
			name,
			enabled
		};

		await FirmwareUpdatesContract.methods.editFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: '10000000' // TODO!
		});

		return json({ id: params.id }, { status: 200 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not edit firmware update');
	}
};
