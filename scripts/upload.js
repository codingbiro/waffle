import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { info, trace } from 'console';
import dotenv from 'dotenv';

dotenv.config();

// Upload data to w3s
async function handleUpload(filepath) {
    const client = new Web3Storage({ token: process.env.TOKEN });

    // Pack files into a CAR and send to web3.storage
    const carFiles = await getFilesFromPath(filepath);
    const rootCid = await client.put(carFiles);
    info('CID', rootCid);

    // Get info on the Filecoin deals that the CID is stored in
    const statusInfo = await client.status(rootCid);
    info('info', statusInfo);

    // Fetch and verify files from web3.storage
    const res = await client.get(rootCid);
    const [{ cid, name, size }] = await res.files();
    info('retrieved file', { cid, name, size });
}

async function uploadData(filepath) {
    if (!filepath) {
        throw new Error('Filepath is required!');
    }
    await handleUpload(filepath);
    info('Succesfully uploaded', filepath);
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
    try {
        const operation = process.argv[2];
        const argument = process.argv[3];
        if (!operations.includes(operation)) {
            throw new Error('Invalid operation!');
        }
        handleOperation(operation, argument);
    } catch (err) {
        trace(err);
    }
}

main();