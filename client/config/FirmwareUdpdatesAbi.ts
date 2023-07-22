const abi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'info',
				type: 'string'
			}
		],
		name: 'Debug',
		type: 'event'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'updater',
				type: 'address'
			}
		],
		name: 'addUpdater',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					},
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'enabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'stable',
						type: 'bool'
					}
				],
				internalType: 'struct FirmwareUpdates.UpdateInput',
				name: 'update',
				type: 'tuple'
			}
		],
		name: 'createFirmwareUpdate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'id',
				type: 'uint64'
			},
			{
				internalType: 'bool',
				name: 'enabled',
				type: 'bool'
			}
		],
		name: 'editFirmwareUpdate',
		outputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'enabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'stable',
						type: 'bool'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					}
				],
				internalType: 'struct FirmwareUpdates.Update',
				name: 'firmwareUpdate_',
				type: 'tuple'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getAvailableFirmwareUpdates',
		outputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'enabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'stable',
						type: 'bool'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					}
				],
				internalType: 'struct FirmwareUpdates.Update[]',
				name: 'firmwareUpdates_',
				type: 'tuple[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'id',
				type: 'uint64'
			}
		],
		name: 'getFirmwareUpdate',
		outputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'enabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'stable',
						type: 'bool'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					}
				],
				internalType: 'struct FirmwareUpdates.Update',
				name: 'firmwareUpdate_',
				type: 'tuple'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getFirmwareUpdates',
		outputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'enabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'stable',
						type: 'bool'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					}
				],
				internalType: 'struct FirmwareUpdates.Update[]',
				name: '',
				type: 'tuple[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'updater',
				type: 'address'
			}
		],
		name: 'removeUpdater',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address'
			}
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;
export default abi;
