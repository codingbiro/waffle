import { json } from '@sveltejs/kit';
import config from '$config/index';
import { web3Helper } from '$src/helpers';

export async function GET() {
	const { defaultAccount } = await web3Helper();

	return json({
		account: {
			address: defaultAccount
		},
		config: {
			contractName: config.contractName,
			deployedAddress: config.deployedAddress,
			networkAddress: config.networkAddress
		}
	});
}
