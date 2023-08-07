import { error, json, type RequestHandler } from '@sveltejs/kit';

import type { FirmwareUdpdate } from '$src/types/firmware';
import { web3Helper } from '$src/helpers';

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
		const id =
			typeof params.id === 'string' && !Number.isNaN(Number.parseInt(params.id))
				? Number.parseInt(params.id)
				: -1;

		if (id < 0) {
			throw new Error('Invalid ID');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const update = parseResponse(
			await firmwareUpdatesContract.methods.getFirmwareUpdate(id).call({ from: defaultAccount })
		);

		if (!update) {
			throw new Error('Invalid udpate');
		}

		const fileUrl = `https://${update.hash}.ipfs.w3s.link/`;

		return json({ ...update, fileUrl });
	} catch (e) {
		console.trace(e);
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

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const input = {
			id: params.id,
			name,
			enabled
		};

		/**
		 * @TODO
        	// Estimate gas consumption
        	const gas = await firmwareUpdatesContract.estimateGas({
            	from: defaultAccount,
        	});
        	console.info('estimateGas', gas, '| deployer account', defaultAccount);
		 */

		await firmwareUpdatesContract.methods.editFirmwareUpdate(input).send({
			from: defaultAccount,
			gas: '10000000' // @TODO
		});

		return json({ id: params.id }, { status: 200 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not edit firmware update');
	}
};
