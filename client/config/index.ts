import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import abi from './FirmwareUdpdatesAbi';

const __dirname = dirname(fileURLToPath(import.meta.url));
const deployedAddress = fs.readFileSync(__dirname + '/DeployedContractAddress.bin', 'utf8');
const PORT = fs.readFileSync(__dirname + '/PORT', 'utf8') || 8545;

const contractName = 'FirmwareUpdates';
const networkAddress = 'http://127.0.0.1:' + PORT;
const clientAddress = 'http://127.0.0.1:5249';

export default {
	abi,
	clientAddress,
	contractName,
	deployedAddress,
	networkAddress
};
