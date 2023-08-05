const solc = require('solc');
const path = require('path');
const fs = require('fs');
const { info, trace } = require('console');

const config = require('./config');

function run() {
    try {
        // Read the Solidity source code from the file system
        const contractPathJoin = path.join(__dirname, config.contractPath);
        const sourceCode = fs.readFileSync(contractPathJoin, 'utf8');

        // solc compiler config
        const input = {
            language: 'Solidity',
            sources: {
                [config.contractPath]: {
                    content: sourceCode,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        // Compile the Solidity code using solc
        const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

        // Get the bytecode from the compiled contract
        const bytecode = compiledCode.contracts[config.contractPath][config.contractName].evm.bytecode.object;
        // Write the bytecode to a new file
        const bytecodePathJoin = path.join(__dirname, config.bytecodePath);
        fs.writeFileSync(bytecodePathJoin, bytecode);

        // Get the ABI from the compiled contract
        const abi = compiledCode.contracts[config.contractPath][config.contractName].abi;

        // Write the Contract ABI to a new file
        const abiPathJoin = path.join(__dirname, config.abiPath);
        fs.writeFileSync(abiPathJoin, JSON.stringify(abi, null, '\t'));
        info('CompilationSuccess');
    } catch (err) {
        trace(err);
    }
}

run();