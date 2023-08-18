import { Web3 } from 'web3';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { info, trace } from 'console';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import config from './config.js';
const { abiPath, networkAddress, bytecodePath, deployedContractAddress } = config;

const abiPathJoin = join(__dirname, abiPath);

async function deploy() {
	try {
		// Load in ABI
		const { default: abi } = await import(abiPathJoin, { assert: { type: 'json' } });

		// Set up a connection to the Ethereum network
		const web3 = new Web3(new Web3.providers.HttpProvider(networkAddress));
		web3.eth.Contract.handleRevert = true;
		const providersAccounts = await web3.eth.getAccounts();
		const defaultAccount = providersAccounts[0];

		// Read the bytecode from the file system
		const bytecodePathJoin = join(__dirname, bytecodePath);
		const bytecode = readFileSync(bytecodePathJoin, 'utf8');

		// Create a new contract object using the ABI and bytecode
		const FirmwareUpdatesContract = new web3.eth.Contract(abi);

		// Create contract
		const firmwareUpdatesContract = FirmwareUpdatesContract.deploy({
			data: '0x' + bytecode,
			arguments: []
		});

		// Estimate gas consumption
		const gas = await firmwareUpdatesContract.estimateGas({
			from: defaultAccount
		});

		// Deploy the contract to the network
		const tx = await firmwareUpdatesContract.send({
			from: defaultAccount,
			gas
		});

		// Write the Contract address to a new file
		const deployedAddressPath = join(__dirname, deployedContractAddress);
		writeFileSync(deployedAddressPath, tx.options.address);
		info('Contract deployed successfully at ' + tx.options.address + ' (deployer account:', defaultAccount + ')');
	} catch (err) {
		trace(err);
	}
}

deploy();
