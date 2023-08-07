import { error, json, type RequestHandler } from '@sveltejs/kit';

import { web3Helper } from '$src/helpers';
import { parseParamToNumber, parseUpdate } from '$src/utils';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = parseParamToNumber(params.id);

		if (id < 0) {
			throw new Error('Invalid ID');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const update = parseUpdate(
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
		const id = parseParamToNumber(params.id);

		const values = await request.formData();
		const isEnabled = values.get('isEnabled') === 'true';
		const isStable = values.get('isStable') === 'true';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';
		const version =
			typeof values.get('version') === 'string' ? (values.get('version') as string) : '';

		if (id < 0 || !name) {
			throw new Error('Invalid input');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		const input = {
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

		await firmwareUpdatesContract.methods.editFirmwareUpdate(id, input).send({
			from: defaultAccount,
			gas: '10000000' // @TODO
		});

		return json({ id }, { status: 200 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not edit firmware update');
	}
};
