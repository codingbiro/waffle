const { trace, log } = require("console");
require('dotenv').config()
const { Web3Storage, getFilesFromPath } = require("web3.storage");

async function handleUpload(filepath) {
    try {
        const client = new Web3Storage({ token: process.env.TOKEN });
        
        // Pack files into a CAR and send to web3.storage
        const carFiles = await getFilesFromPath(filepath);
        const rootCid = await client.put(carFiles);
        log('CID', rootCid);

        // Get info on the Filecoin deals that the CID is stored in
        const info = await client.status(rootCid);
        log('info', info);

        // Fetch and verify files from web3.storage
        const res = await client.get(rootCid);
        const [{ cid, name, size }] = await res.files();
        log('retrieved file', { cid, name, size });
    } catch (err) {
        console.error(err);
    }
}

// Upload data to IPFS
async function uploadData(filepath) {
    if (!filepath) {
        throw new Error('Filepath is required!');
    }
    await handleUpload(filepath);
    trace('Succesfully uploaded', filepath);
    process.exitCode = 0;
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