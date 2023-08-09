const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const { info, trace } = require('console');

const config = require('./config');
const abiPathJoin = path.join(__dirname, config.abiPath);
const abi = require(abiPathJoin);

async function deploy() {
    try {
        // Set up a connection to the Ethereum network
        const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
        web3.eth.Contract.handleRevert = true;
        const providersAccounts = await web3.eth.getAccounts();
        const defaultAccount = providersAccounts[0];
        
        // Read the bytecode from the file system
        const bytecodePathJoin = path.join(__dirname, config.bytecodePath);
        const bytecode = fs.readFileSync(bytecodePathJoin, 'utf8');
        
        // Create a new contract object using the ABI and bytecode
        const FirmwareUpdatesContract = new web3.eth.Contract(abi);

        // Create contract
        const firmwareUpdatesContract = FirmwareUpdatesContract.deploy({
            data: '0x' + bytecode,
            arguments: [],
        });

        // Estimate gas consumption
        const gas = await firmwareUpdatesContract.estimateGas({
            from: defaultAccount,
        });

        // Deploy the contract to the network
        const tx = await firmwareUpdatesContract.send({
            from: defaultAccount,
            gas,
        });

        // Write the Contract address to a new file
        const deployedAddressPath = path.join(__dirname, config.deployedContractAddress);
        fs.writeFileSync(deployedAddressPath, tx.options.address);
        info('DeploymentSuccess' + ' (deployer account:', defaultAccount + ')');
    } catch (err) {
        trace(err);
    }
}

deploy();