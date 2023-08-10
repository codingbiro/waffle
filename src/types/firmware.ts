export interface FirmwareUdpdate {
	id: number;
	version: string;
	uploader: string;
	hash: string;
	name: string;
	isEnabled: boolean;
	isStable: boolean;
	timestamp: number;
}

export type NewFirmware = Pick<FirmwareUdpdate, 'version' | 'isEnabled' | 'isStable' | 'name'>;

export type EditFirmware = FirmwareUdpdate & { url: string };

export type ShowHideEditFn = (v: FirmwareUdpdate | null) => Promise<void>;
