const contractPath = 'contracts/FirmwareUpdates.sol';
const contractName = 'FirmwareUpdates';
const bytecodePath = 'target/FirmwareUdpdatesBC.bin';
const abiPath = 'target/FirmwareUdpdatesAbi.json';
const networkAddress = 'http://127.0.0.1:7545';
const deployedContractAddress = 'target/DeployedContractAddress.bin';

module.exports = {
    abiPath,
    bytecodePath,
    contractName,
    contractPath,
    deployedContractAddress,
    networkAddress,
};