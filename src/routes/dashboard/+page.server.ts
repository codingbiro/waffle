import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/updates');
		const updates = (await response?.json()) || [];

		return {
			updates
		};
	} catch (e) {
		return {
			updates: []
		};
	}
};
