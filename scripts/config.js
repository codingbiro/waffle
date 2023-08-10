import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const portPath = join(__dirname, 'target/PORT');
const PORT = readFileSync(portPath, 'utf8') || 8545;

const contractPath = '../contracts/FirmwareUpdates.sol';
const contractName = 'FirmwareUpdates';
const bytecodePath = 'target/FirmwareUdpdatesBC.bin';
const abiPath = 'target/FirmwareUdpdatesAbi.json';
const networkAddress = 'http://127.0.0.1:' + PORT;
const deployedContractAddress = 'target/DeployedContractAddress.bin';

export default {
	abiPath,
	bytecodePath,
	contractName,
	contractPath,
	deployedContractAddress,
	networkAddress
};
