const fs = require('fs');
const path = require('path');

const portPath = path.join(__dirname, 'target/PORT');
const PORT = fs.readFileSync(portPath, 'utf8') || 8545;

const contractPath = 'contracts/FirmwareUpdates.sol';
const contractName = 'FirmwareUpdates';
const bytecodePath = 'target/FirmwareUdpdatesBC.bin';
const abiPath = 'target/FirmwareUdpdatesAbi.json';
const networkAddress = 'http://127.0.0.1:' + PORT;
const deployedContractAddress = 'target/DeployedContractAddress.bin';


module.exports = {
    abiPath,
    bytecodePath,
    contractName,
    contractPath,
    deployedContractAddress,
    networkAddress,
};