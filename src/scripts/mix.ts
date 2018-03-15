import * as winston from 'winston';
import web3 from 'web3-instance';
import importer from '../index';

const mixer = web3.eth.accounts[1];

// Executing the script
const inAddr = process.argv[2];
const outAddr = process.argv[3];

const dispenser = importer.getContract('BallotDispenser');
const ballot = importer.getContract('VotingBallot');

winston.info(`${inAddr} is being mixed to ${outAddr}`);
// dispenser.startMix(
//   0.001,
//   100,
//   200,
//   300,
//   400,
//   5,
//   { from: mixer, gas: 999999 });

// dispenser.acceptJoin(inAddr, 'partial_warranty_placeholder', true);

// dispenser.provideWarranty(inAddr, 'warranty_placeholder');

ballot.give(outAddr, 1, { from: mixer });

const newBalance = ballot.balanceOf.call(outAddr).toNumber();
winston.info(`Anonymous address ${outAddr} now has a vote balance of ${newBalance}`);
