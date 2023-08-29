import fs from 'fs';
import abi from './FirmwareUdpdatesAbi';

const deployedAddress = fs.readFileSync('./config/DeployedContractAddress.bin', 'utf8');
const PORT = (fs.readFileSync('./config/PORT', 'utf8').substring(0,4)) || 8545;

const contractName = 'FirmwareUpdates';
const networkAddress = 'http://127.0.0.1:' + PORT;
const clientAddress = 'http://127.0.0.1:5249';

const DEFAULT_GAS = '1000000';

export default {
	abi,
	clientAddress,
	contractName,
	DEFAULT_GAS,
	deployedAddress,
	networkAddress
};
