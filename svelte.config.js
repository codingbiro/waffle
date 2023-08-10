import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(), // https://kit.svelte.dev/docs/integrations#preprocessors
	kit: {
		adapter: adapter(), // https://kit.svelte.dev/docs/adapter-auto
		alias: {
			$config: resolve('config'),
			$src: resolve('src')
		}
	}
};

export default config;
