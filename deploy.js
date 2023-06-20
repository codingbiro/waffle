const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { log, trace } = require('console');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider(config.networkAddress));
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePathJoin = path.join(__dirname, config.bytecodePath);
const bytecode = fs.readFileSync(bytecodePathJoin, 'utf8');

// Create a new contract object using the ABI and bytecode
const abiPathJoin = path.join(__dirname, config.abiPath);
const abi = require(abiPathJoin);
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    try {
        // Create contract
        const myContract = MyContract.deploy({
            data: '0x' + bytecode,
            arguments: [],
        });

        // Estimate gas consumption
        const gas = await myContract.estimateGas({
            from: defaultAccount,
        });
        log('estimateGas', gas, '| deployer account', defaultAccount);

        // Deploy the contract to the network
        const tx = await myContract.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        });

        // Write the Contract address to a new file
        const deployedAddressPath = path.join(__dirname, config.deployedContractAddress);
        fs.writeFileSync(deployedAddressPath, tx.options.address);
        trace('DeploymentSuccess');
    } catch (err) {
        trace(err);
    }
}

deploy();