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
				name: 'newUpdater',
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
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					}
				],
				internalType: 'struct FirmwareUpdates.CreateUpdateInput',
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
				components: [
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					}
				],
				internalType: 'struct FirmwareUpdates.EditUpdateInput',
				name: 'newValues',
				type: 'tuple'
			}
		],
		name: 'editFirmwareUpdate',
		outputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
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
		inputs: [
			{
				internalType: 'uint64',
				name: 'id',
				type: 'uint64'
			}
		],
		name: 'getAvailableFirmwareUpdate',
		outputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					}
				],
				internalType: 'struct FirmwareUpdates.Update',
				name: '',
				type: 'tuple'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getAvailableFirmwareUpdates',
		outputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
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
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
					}
				],
				internalType: 'struct FirmwareUpdates.Update',
				name: '',
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
						internalType: 'string',
						name: 'hash',
						type: 'string'
					},
					{
						internalType: 'uint64',
						name: 'id',
						type: 'uint64'
					},
					{
						internalType: 'bool',
						name: 'isEnabled',
						type: 'bool'
					},
					{
						internalType: 'bool',
						name: 'isStable',
						type: 'bool'
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string'
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					},
					{
						internalType: 'address',
						name: 'uploader',
						type: 'address'
					},
					{
						internalType: 'string',
						name: 'version',
						type: 'string'
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
				name: 'newOwner',
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
