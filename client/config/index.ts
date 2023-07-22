import fs from 'fs';
import abi from './FirmwareUdpdatesAbi';

const deployedAddress = fs.readFileSync('./config/DeployedContractAddress.bin', 'utf8');
const PORT = fs.readFileSync('./config/PORT', 'utf8') || 8545;

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
