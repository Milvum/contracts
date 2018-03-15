const VotingPass = artifacts.require('VotingPass');
const BallotDispenser = artifacts.require('BallotDispenser');
const VotingBallot = artifacts.require('VotingBallot');

contract('BallotDispenser', accounts => {
  let ballotDispenserContract;
  let votingPassContract;
  let votingBallotContract;

  function createContracts(issuer, mixer) {
    return VotingPass.new(issuer)
      .then(instance => {
        votingPassContract = instance;

        return BallotDispenser.new(mixer, instance.address, "dummyModulo", 1);
      }).then(instance => {
        ballotDispenserContract = instance;
        return votingPassContract.setRedeemer(instance.address, { from: issuer });
      }).then(() => {
        return VotingBallot.new(ballotDispenserContract.address);
      }).then((instance) => {
        votingBallotContract = instance;
        ballotDispenserContract.setVotingBallot(instance.address, { from: mixer });
      });
  }

  // Taken from https://gist.github.com/joepie91/2664c85a744e6bd0629c
  function delayPromise(duration) {
    return function (...args) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(...args);
        }, duration);
      });
    };
  }

  it('Should be able to start a mix', () => {
    const issuer = accounts[0];
    const mixer = accounts[1];

    return createContracts(issuer, mixer)
      .then(() => ballotDispenserContract.startMix(11, 12, 13, 14, 15, 16, { from: mixer }))
      .then(() => ballotDispenserContract.currentMix.call());
  });


  it('Should be able to redeem a voting pass through the contract', () => {
    const issuer = accounts[0];
    const mixer = accounts[1];
    const target = accounts[2];

    return createContracts(issuer, mixer)
      .then(() => votingPassContract.give(target, { from: issuer }))
      .then(() => ballotDispenserContract.provideWarranty(target, '', { from: mixer }))
      .then(() => votingPassContract.balanceOf.call(target))
      .then(balance => assert.equal(balance, 0));
  });

  it('Should be able to give a seeded ballot with 10 wei attached', () => {
    const issuer = accounts[0];
    const mixer = accounts[1];
    const target = accounts[2];

    // Uint16 size
    const nonce = Math.floor(Math.random() * 65535);
    let initialWeiBalance;

    return createContracts(issuer, mixer)
      .then(() => web3.eth.getBalance(target))
      .then(weiBalance => {
        initialWeiBalance = weiBalance.toNumber();
      })
      .then(() => ballotDispenserContract.giveSeededBallot(target, nonce, { from: mixer, value: 10 }))
      .then(() => votingBallotContract.balanceOf.call(target))
      .then(ballotBalance => assert.equal(ballotBalance, 1))
      .then(() => web3.eth.getBalance(target))
      .then(weiBalance => assert.equal(weiBalance.toNumber(), initialWeiBalance + 10));
  });
});
