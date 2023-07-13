import { json } from '@sveltejs/kit';
import { Web3 } from 'web3';
import config from '../../../../config';

const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
const [defaultAccount] = await web3.eth.getAccounts();

export async function GET() {
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
