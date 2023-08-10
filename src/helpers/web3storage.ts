import { Web3Storage } from 'web3.storage';

import 'dotenv/config.js';

let client: Web3Storage | null = null;

export default function web3storageHelper(): Web3Storage {
	if (!process.env.TOKEN) {
		throw new Error('Missing TOKEN');
	}

	if (!client) {
		client = new Web3Storage({ token: process.env.TOKEN });
	}

	return client;
}
