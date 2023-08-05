export interface FirmwareUdpdate {
	id: number;
	version: string;
	uploader: string;
	hash: string;
	name: string;
	enabled: boolean;
	stable: boolean;
	timestamp: number;
}

export type NewFirmware = Pick<FirmwareUdpdate, 'version' | 'enabled' | 'stable' | 'name'>;

export type EditFirmware = Pick<
	FirmwareUdpdate,
	'id' | 'hash' | 'enabled' | 'name' | 'uploader'
> & { url: string };

export type ShowHideEditFn = (v: Omit<EditFirmware, 'url'> | null) => Promise<void>;
