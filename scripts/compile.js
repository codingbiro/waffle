import solc from 'solc';
import { join, dirname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { info, trace } from 'console';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import config from './config.js';
const { contractPath, contractName, bytecodePath, abiPath } = config;

function run() {
	try {
		// Read the Solidity source code from the file system
		const contractPathJoin = join(__dirname, contractPath);
		const sourceCode = readFileSync(contractPathJoin, 'utf8');

		// solc compiler config
		const input = {
			language: 'Solidity',
			sources: {
				[contractPath]: {
					content: sourceCode
				}
			},
			settings: {
				outputSelection: {
					'*': {
						'*': ['*']
					}
				}
			}
		};

		// Compile the Solidity code using solc
		const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

		// Get the bytecode from the compiled contract
		const bytecode = compiledCode.contracts[contractPath][contractName].evm.bytecode.object;
		// Write the bytecode to a new file
		const bytecodePathJoin = join(__dirname, bytecodePath);
		writeFileSync(bytecodePathJoin, bytecode);

		// Get the ABI from the compiled contract
		const abi = compiledCode.contracts[contractPath][contractName].abi;

		// Write the Contract ABI to a new file
		const abiPathJoin = join(__dirname, abiPath);
		writeFileSync(abiPathJoin, JSON.stringify(abi, null, '\t'));
		info('CompilationSuccess');
	} catch (err) {
		trace(err);
	}
}

run();
