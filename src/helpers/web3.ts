import { Contract, Web3 } from 'web3';

import config from '$config/index';
import type abi from '$config/FirmwareUdpdatesAbi';

let defaultAccount: string | null = null;
let firmwareUpdatesContract: Contract<typeof abi> | null = null;
let web3: Web3 | null = null;

export default async function web3Helper() {
	if (!config.networkAddress) {
		throw new Error('Missing config.networkAddress');
	}

	if (!web3) {
		web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
	}

	if (!defaultAccount) {
		defaultAccount = (await web3.eth.getAccounts())[0];
	}

	if (!firmwareUpdatesContract) {
		firmwareUpdatesContract = new web3.eth.Contract(config.abi, config.deployedAddress);
	}

	return {
		defaultAccount,
		firmwareUpdatesContract,
		web3
	};
}
