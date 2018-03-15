/**
 * Script to check if the deployment done by `npm start` was successful.
 * The important setup variables of the contracts are also printed,
 *   which can be used to see e.g. which address can issue voting passes.
 */

import * as winston from 'winston';
import * as assert from 'assert';
import importer from '../index';
import web3 from 'web3-instance';

// Executing the script

const pass = importer.getContract('VotingPass');
const ballot = importer.getContract('VotingBallot');
const dispenser = importer.getContract('BallotDispenser');
const vault = importer.getContract('Vault');

/* Expected values (that should have been hardcoded on deployment) */

// hardcoded: second account is the pass issuer
const expectedPassIssuer = web3.eth.accounts[1];
// hardcoded: second account is the mixer
const expectedMixer = web3.eth.accounts[1];

/* Actual values in the contracts */
const passIssuer = pass.issuer.call();
const passRedeemer = pass.redeemer.call();

const ballotIssuer = ballot.owner.call();

const dispenserMixer = dispenser.mixer.call();

/* Some extra info on the current state */
const currentMix = dispenser.currentMix.call();

/* Print */
winston.info(`Pass address ${pass.address}`);
winston.info(`Ballot address ${ballot.address}`);
winston.info(`Dispenser address ${dispenser.address}`);
winston.info(`Vault address ${vault.address}`);

winston.info(`-----------------`);

winston.info(`Pass issuer ${passIssuer}`);
winston.info(`Pass redeemer ${passRedeemer}`);
winston.info(`Ballot issuer ${ballotIssuer}`);
winston.info(`Dispenser mixer ${dispenserMixer}`);

winston.info(`-----------------`);

winston.info(`Current mix ${currentMix}`);

/* Verify */
assert.strictEqual(passIssuer, expectedPassIssuer);
assert.strictEqual(passRedeemer, dispenser.address);
assert.strictEqual(ballotIssuer, dispenser.address);
assert.strictEqual(dispenserMixer, expectedMixer);
