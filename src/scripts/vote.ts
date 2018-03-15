import { voteFor } from './scriptUtils';
import * as winston from 'winston';

const voter1 = process.argv[2];
const candidate1 = process.argv[3]; // getCandidateAddress(process.argv[3]);

if (candidate1 !== undefined) {
  voteFor(voter1, candidate1);
} else {
  winston.info(`Candidate ${process.argv[3]} does not exist`);
}
