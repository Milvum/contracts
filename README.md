# [StemApp](https://milvum.github.io/stemapp/)

At the end of 2016 we started our journey with the goal: making digital voting possible for The Netherlands. In co-creation with five municipalities, we worked together to enable citizen participation on the blockchain. We believe this is a perfect step for making digital voting on the blockchain a reality. We have worked hard to realize the project and are pleased that a first version is now available for further development. That is why we are now doing an Open Source release of our StemApp project. We invite developers and security researchers to help The Netherlands in the next phase of digital voting. We be

Please mention [Milvum](https://milvum.com) in communications when using this code.

# Contracts
This repository has two functionalities:
1. It hosts the Ethereum smart contracts that are used by the StemApp project. The smart contracts are written in Solidium. The Truffle framework is used to deploy these contracts to a blockchain. 
1. It acts as an npm module which can be used by the other projects (such as ballot-dispenser) to obtain the callable functions of the contracts.

A minor additional feature is that it contains a collection of utility scripts that can be used to communicate with the smart contracts (for manually playing around). These scripts will be found in de `build/scripts` folder after building (runnable by `node build/scripts/<name>.js [args]`).

## StemApp-stack dependencies
This project depends on the following StemApp projects:
* web3j-instance (npm module)
* candidates (npm module)

## Testing & deploying
1. `$ npm install`
1. `$ npm run build`
1. Make sure you have a reachable geth node running (e.g. by using the private-ethereum project)
    * If the geth node is not running local on port 8545, set the config options of the running blockchain in .npmrc: 
    ```
    web3_port=<PORT>
    web3_host=<HOST_IP>    
    ```       
1. run `$ npm test` to test 
1. run `$ npm start` to deploy your contracts to your blockchain
    
## RSA keys
1. Check `.npmrc` for development info relating to the RSA keypair found in `data`.
1. Make sure to generate a fresh keypair before a production deploy. Make contract deployments work
   by setting the correct value of pubhex: `export npm_config_pubhex="<0x-prefixed modulus part of pubkey>"`
1. The included `private.pem` and `public.pem` are the RSA-keys used in the default-deploy for the
   Vault. The password of the included private key is `abcd`.

## Transfering Info to other projects
Two projects talk directly with contracts: the ballot dispenser and the stemapp. Both need the addresses of where the contracts are situated. You can obtain these addresses by running 
```
$ npm run test-deploy
```
If you deploy contracts to a freshly started private-ethereum, these addresses will stay consistent. Meaning you won't have to adjust it every time you reset (and redeploy) your chain.

Additionally the StemApp requires the ABI's that can be build from the compiled contracts. These can be created using the `scripts/export-abis.sh` script. **If** your stemapp folder resides in the same root as contracts, you can use `scripts/move-contracts.sh` to move the `compiled-contracts` folder to the correct location.

## Including this project as an NPM module
This project is meant to be included in other parts of the StemApp-stack as an npm module. To include it as an npm module, you can either:
1. Set up your own [private npm registry](https://docs.npmjs.com/private-modules/intro),
1. or include it as a [local module](https://docs.npmjs.com/files/package.json#local-paths).

## Disclaimer

The project in the current state is not market ready and thus should only be used for pilots or testing. In its current state the StemApp is not yet fully tested and not entirely secure (see open issues in the [whitepaper](https://milvum.com/en/download-stemapp-whitepaper/)). This version is also not yet ready for a release on the public Ethereum network. Milvum is not accountable for the use of the StemApp in any way, and the possible outcomes this may have.
