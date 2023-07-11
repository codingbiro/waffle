import config from '../../../config/index';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const response = await fetch(config.clientAddress + '/api');
		const updates = (await response?.json()) || [];
		return {
			updates
		};
	} catch (e) {
		return {
			updates: []
		};
	}
}
