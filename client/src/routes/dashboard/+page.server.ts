/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
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
}
