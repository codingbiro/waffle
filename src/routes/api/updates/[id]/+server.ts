import { error, json, type RequestHandler } from '@sveltejs/kit';

import { web3Helper } from '$src/helpers';
import { parseParamToNumber, parseUpdate } from '$src/utils';
import config from '$config/index';

/**
 * @param id id of update
 * @returns FirmwareUdpdate or fails
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = parseParamToNumber(params.id);

		// Validate id
		if (id < 0) {
			throw new Error('Invalid ID');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		// Parse update from smart contract
		const update = parseUpdate(
			await firmwareUpdatesContract.methods.getFirmwareUpdate(id).call({ from: defaultAccount })
		);

		// Update not found
		if (!update) {
			throw new Error('Invalid udpate');
		}

		// Contruct file url for download
		const fileUrl = `https://${update.hash}.ipfs.w3s.link/?filename=${
			update.filename || 'download'
		}`;

		// Return JSON response with update and fileUrl
		return json({ ...update, fileUrl });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not get firmware update');
	}
};

/**
 * @description Edits an existing firmware update
 * @returns id of modified update
 */
export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const id = parseParamToNumber(params.id);

		// Get values from request's formData
		const values = await request.formData();
		const filename =
			typeof values.get('filename') === 'string' ? (values.get('filename') as string) : '';
		const isEnabled = values.get('isEnabled') === 'true';
		const isStable = values.get('isStable') === 'true';
		const name = typeof values.get('name') === 'string' ? (values.get('name') as string) : '';
		const version =
			typeof values.get('version') === 'string' ? (values.get('version') as string) : '';

		// Validate input
		if (id < 0 || !name || !version) {
			throw new Error('Invalid input');
		}

		const { defaultAccount, firmwareUpdatesContract } = await web3Helper();

		// Smart contract's EditUpdateInput
		const input = {
			isEnabled,
			isStable,
			name,
			filename,
			version
		};

		// Estimate TX gas cost
		const gas = await firmwareUpdatesContract.methods.editFirmwareUpdate(id, input).estimateGas();

		// Save update with smart contract
		await firmwareUpdatesContract.methods.editFirmwareUpdate(id, input).send({
			from: defaultAccount,
			gas: gas?.toString() ?? config.DEFAULT_GAS
		});

		// Return id
		return json({ id }, { status: 200 });
	} catch (e) {
		console.trace(e);
		throw error(500, 'Could not edit firmware update');
	}
};
