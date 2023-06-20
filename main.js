const fs = require('fs');
const { Web3 } = require('web3');

async function testWeb3() {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
        const response = Number.parseInt(await web3.eth.getBlockNumber());
        console.trace(response.toString());
    } catch (err) {
        console.error(err);
    }
}

// const { createHelia } = require('helia');
async function heliaHelper() {
    // const helia = await createHelia();
}

// Upload data to IPFS
function uploadData(filename) {
    if (!filename) {
        throw new Error('Filename is required!');
    }
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        // TODO: handle upload
        console.trace('Succesfully uploaded', data);
        process.exitCode = 1;
    });
}

// Handle incoming operation
function handleOperation(operation, argument) {
    switch (operation) {
        case 'upload': {
            return uploadData(argument);
        }
        default: return;
    }
}

// Supported operations
const operations = ['upload'];

// Main function
async function main() {
    const operation = process.argv[2];
    const argument = process.argv[3];
    if (!operations.includes(operation)) {
        throw new Error('Invalid operation!');
    }
    handleOperation(operation, argument);
}

main();