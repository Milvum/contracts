import * as winston from 'winston';
import web3 from 'web3-instance';

const VotingBallot = require('../build/contracts/VotingBallot.json');
const BallotDispenser = require('../build/contracts/BallotDispenser.json');
const VotingPass = require('../build/contracts/VotingPass.json');
const Vault = require('../build/contracts/Vault.json');

const Contracts = {};
addContract(VotingBallot);
addContract(VotingPass);
addContract(BallotDispenser);
addContract(Vault);

function addContract(contract) {
  Contracts[contract.contractName] = contract;
}

export class ContractImporter {
  private _web3: any;

  constructor(_web3: any) {
    this._web3 = _web3;
  }

  // Get the deployed contract with name contractName.
  // If the contractInfo json file does not contain deployment info for the network,
  //   you need to include the contractAddress in this call.
  public getContract(contractName: string, contractAddress?: string) {
    const contractInfo = this.getContractInfo(contractName);
    const networkInfo = contractInfo.networks[this._web3.version.network];

    if (!networkInfo && !contractAddress) {
      const errorMessage = `Can't locate ${contractName} in the network. ` +
        `The contract's json file contains no networkInfo, and no contractAddress was supplied`;

      winston.log('error', errorMessage);
      throw new Error(errorMessage);
    }

    if (networkInfo && contractAddress && networkInfo.address !== contractAddress) {
      const errorMessage = `The supplied contractAddress for ${contractName} does not match` +
        `the networkInfo in its json file. Using the supplied address...`;

      winston.log('error', errorMessage);
      throw new Error(errorMessage);
    }

    const abi = contractInfo.abi;
    const address = contractAddress || networkInfo.address;

    return this._web3.eth.contract(abi).at(address);
  }

  // Get the info stored in the contract's built json file
  public getContractInfo(contractName: string) {
    const contractInfo = Contracts[contractName];

    if (contractInfo) {
      return contractInfo;
    }

    const errorMessage = `Can't find the built json file for contract ${contractName}`;

    winston.log('error', errorMessage);
    throw new Error(errorMessage);
  }
}

export default new ContractImporter(web3);
