/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch('/api');
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
