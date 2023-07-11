import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import abi from './FirmwareUdpdatesAbi.json';

const deployedAddress = fs.readFileSync(__dirname + '/DeployedContractAddress.bin', 'utf8');

const contractName = 'FirmwareUpdates';
const networkAddress = 'http://127.0.0.1:7545';
const clientAddress = 'http://127.0.0.1:5173';

export default {
	abi,
	clientAddress,
	contractName,
	deployedAddress,
	networkAddress
};
