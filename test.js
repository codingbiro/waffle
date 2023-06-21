const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const { trace } = require('console');

const config = require('./config');
const abiPathJoin = path.join(__dirname, config.abiPath);
const abi = require(abiPathJoin);

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
web3.eth.Contract.handleRevert = true;

async function testWeb3() {
    try {
        console.trace(Number.parseInt(await web3.eth.getBlockNumber()).toString());
    } catch (err) {
        console.error(err);
    }
}

async function test() {
    testWeb3();
    const providersAccounts = await web3.eth.getAccounts();

    try {
        const defaultAccount = providersAccounts[0];
        // Read the contract address from the file system
        const deployedAddressPath = path.join(__dirname, config.deployedContractAddress);
        const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8');

        // Create a new contract object using the ABI and bytecode
        const FirmwareUpdatesContract = new web3.eth.Contract(abi, deployedAddress);

        // Get available updates
        let updates = await FirmwareUpdatesContract.methods.getFirmwareUpdates().call();
        trace(updates);

        // Push an update
        const input = {
            version: "0.0.1-beta",
            hash: "bAerseretERrfdin3gdfOOld",
            enabled: true,
            latest: false,
        };
        const receipt = await FirmwareUpdatesContract.methods.createFirmwareUpdate(input).send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        trace(receipt);

        // Get available updates again
        updates = await FirmwareUpdatesContract.methods.getFirmwareUpdates().call();
        trace(updates);
        trace('Tests have finished.');
    } catch (error) {
        console.error(error);
    }
}

test();