import type { FirmwareUdpdate } from '$src/types/firmware';

export default function parseUpdate(
	input: Record<string, bigint | boolean | string>
): FirmwareUdpdate | undefined {
	if (!input) {
		return undefined;
	}

	if (
		typeof input.id === 'bigint' &&
		typeof input.version === 'string' &&
		typeof input.uploader === 'string' &&
		typeof input.hash === 'string' &&
		typeof input.name === 'string' &&
		typeof input.filename === 'string' &&
		typeof input.isEnabled === 'boolean' &&
		typeof input.isStable === 'boolean' &&
		typeof input.timestamp === 'bigint'
	) {
		return input.hash
			? {
					id: Number(input.id),
					version: input.version,
					uploader: input.uploader,
					hash: input.hash,
					name: input.name,
					filename: input.filename,
					isEnabled: input.isEnabled,
					isStable: input.isStable,
					timestamp: Number(input.timestamp)
			  }
			: undefined;
	}

	return undefined;
}
