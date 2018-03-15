import * as winston from 'winston';
import importer from '../index';

// Executing the script
const receiver = process.argv[2];

const passContract = importer.getContract('VotingPass');
const issuer = passContract.issuer.call();

winston.info(`${issuer} gives a voting pass to ${receiver}`);
passContract.give(receiver, { from: issuer });

const newBalance = passContract.balanceOf.call(receiver).toNumber();
winston.info(`${receiver} now has a voting pass balance of ${newBalance}`);
