import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/info');
		const json = await response?.json();

		if (!json) {
			throw new Error('Failed to fetch info');
		}

		return {
			info: json
		};
	} catch (e) {
		return {};
	}
};
