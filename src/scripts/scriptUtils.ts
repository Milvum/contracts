import * as winston from 'winston';
import importer from '../index';
import web3 from 'web3-instance';

// Transfer 5 Ether, for reasonable gas(price)
const VALUE = '5000000000000000000';
const GAS = '100000';
const GAS_PRICE = '40000000000';

// Hardcoded: first account has Ether and emptystring password
const donor: string = web3.eth.accounts[0];

const ballotContract = importer.getContract('VotingBallot');

function transferEther(to: string) {
  winston.info(`Transfering ether from ${donor} to ${to}`);

  web3.eth.sendTransaction({
    from: donor,
    to,
    value: VALUE,
    gas: GAS,
    gasPrice: GAS_PRICE,
  });

  const newBalance = web3.eth.getBalance(to, 'latest');
  winston.info(`Address ${to} now has an ether balance of ${newBalance}`);
}

function voteFor(targetVoter, targetCandidate) {
  winston.info(`Casting a vote from ${targetVoter} to ${targetCandidate}`);

  ballotContract.transfer(targetCandidate, 1, { from: targetVoter });

  const newBalance = ballotContract.balanceOf.call(targetCandidate).toNumber();

  winston.info(`Address ${targetCandidate} now has a balance of ${newBalance}`);
}

function giveVote(voter) {
  const contract = importer.getContract('VotingBallot');

  const owner = contract.owner.call();

  winston.info(`Ballot owner ${owner} gives a vote to ${voter}`);
  contract.give(voter, 1, { from: owner });

  const newBalance = contract.balanceOf.call(voter).toNumber();
  winston.info(`Address ${voter} now has a vote balance of ${newBalance}`);
}

export {
  transferEther,
  voteFor,
  giveVote,
};
