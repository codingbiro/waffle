# Waffle
A Secure Firmware Dispatch System for IoT Devices using Blockchain - a MSC Thesis project by Vince Biro at the Technical University of Denmark.
## Project information
- Requires Node v18 with npx and yarn. Make sure you run `yarn` to install dependencies in the root folder and in `./client`

- To start an Ethereum development network with Hardhat, run `yarn network:start`
⚠️ If you use your own network, make sure the configuration files (`config.js` and `client/config/*`) are set up accordingly.
- `config.js`: Project's core configuration location.

- `config:init`: Initializes the project config from Hardhat's output.

- `yarn contract:deploy`: Deploys the smart contract.

- `yarn contract:test`: Tests the deployment.

- `yarn upload:test`: Tests the upload to Filecoin using web3-storage.

- `yarn client:init`: This initializes client (copies required configs).

- `yarn client:start`: This starts the Svelte client in ./client.

- `yarn start`: One command to run all the above: starts network, initializes configuration files, compiles and deploys the smart contract and starts the client.

- `yarn solhint`: Runs Solidity linting for smart contracts.

## Client-only usage
- Update `./client/config/*` with the required configuration.
- Then run `yarn client:start`.
- For more information on how to run Svelte, read `./client/README.md`.

### Notes
- Use node version `18` for best compatibility [(GitHub Issue)](https://github.com/web3-storage/web3.storage/issues/2274).
