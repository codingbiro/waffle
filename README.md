# Waffle
A Secure Firmware Dispatch System for IoT Devices using Blockchain - a MSC Thesis project by Vince Biro at the Technical University of Denmark.
## Project information
- Requires a running Ethereum network

- `config.js`: project configuration

- `yarn contract:deploy`: deploys smart contract

- `yarn contract:test`: tests deployment

- `yarn upload:test`: tests upload to Filecoin

- `yarn client:init`: initializes client

## Client usage
- Run Ganache Ethereum development network (or any Ethereum network)
- Update `./config.js` and `./client/config/index.ts` with the required configuration  
- Run `yarn contract:deploy` and `yarn client:init`
- Then `cd ./client` and runt `yarn dev`
- For more information on how to run Svelte, read `./client/README.md`

### Notes
- Use node version `18` for best compatibility [(GitHub Issue)](https://github.com/web3-storage/web3.storage/issues/2274)
