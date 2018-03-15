import { giveVote } from './scriptUtils';

// Executing the script
const voterArg = process.argv[2];

giveVote(voterArg);
