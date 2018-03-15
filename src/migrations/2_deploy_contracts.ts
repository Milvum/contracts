// tslint:disable-next-line:no-reference
/// <reference path="../typings/truffle-types.d.ts" />

import web3 from 'web3-instance';
import * as winston from 'winston';

const VotingBallot = artifacts.require('VotingBallot.sol');
const VotingPass = artifacts.require('VotingPass.sol');
const BallotDispenser = artifacts.require('BallotDispenser.sol');
const Vault = artifacts.require('Vault.sol');
const pubHex = process.env.npm_config_pubhex || 'i-did-not-set--pubhex---so-tickle-me';
const pubHexCheck = process.env.npm_config_pubhex_check || 'i-did-not-set--pubhex---so-tickle-me';
const tokenAmount = process.env.npm_config_token_amount || 1;

const vaultPublicKey = process.env.npm_config_vault_public_key || 'i-did-not-set--vault-key---so-tickle-me';
const vaultNonceBits = process.env.npm_config_vault_nonce_bits || 256; // rather too big than too little

// hardcoded: second account is the pass issuer
const passIssuer = web3.eth.accounts[1];
// hardcoded: second account is the mixer
const mixer = web3.eth.accounts[1];

if (pubHex === pubHexCheck) {
  winston.warn(`${pubHex} is equal to  ${pubHexCheck}, make sure we are not deploying to production!`);
}

module.exports = (deployer) => {
  // @TODO: de-spaghettify this code by using async await
  // Deploy voting pass
  deployer.deploy(VotingPass, passIssuer)
    // The "ballotOwner" functions as the mixer
    .then(() => {
      return deployer.deploy(BallotDispenser, mixer, VotingPass.address, pubHex, tokenAmount);
    })
    // Get an instance of the voting pass contract
    .then(() => VotingPass.deployed())
    // The ballot dispenser is allowed to redeem voting passes
    .then((vpInstance) => {
      return vpInstance.setRedeemer(BallotDispenser.address, { from: mixer });
    })
    // The ballot dispenser also owns the ballots, so he can hand them out
    .then(() => {
      return deployer.deploy(VotingBallot, BallotDispenser.address);
    })
    .then(() => BallotDispenser.deployed())
    .then((bdInstance) => {
      return bdInstance.setVotingBallot(VotingBallot.address, { from: mixer });
    })
    .then(() => {
      return deployer.deploy(Vault, vaultPublicKey, vaultNonceBits);
    })
    ;
};
