import {
    transferEther,
    voteFor,
    giveVote,
} from './scriptUtils';

import web3 from 'web3-instance';
import * as winston from 'winston';

import importer from '../index';

// HARDCODED we will use the first account, which we assume as ether already
const voter = web3.eth.accounts[0];

const target = process.argv[2];
const numVotes = parseInt(process.argv[3], 10);

if (!target || !numVotes) {
    winston.error(`You forgot to pass cli arguments for the target or the number of votes`);
}

winston.info(`Going to generate ${numVotes} votes from ${voter} to ${target}`);

for (let i = 0; i < numVotes; i++) {
    voteFor(voter, target);
}

winston.info(`Done generating votes!`);
