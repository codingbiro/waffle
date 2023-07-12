/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch('/api/info');
		const json = await response?.json();

		if (!json) {
			throw new Error('Failed to fetch info');
		}

		return {
            info: json,
        };
	} catch (e) {
		return {};
	}
}
