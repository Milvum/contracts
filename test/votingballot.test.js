var VotingBallot = artifacts.require("VotingBallot");

contract('VotingBallot', accounts => {
  it("should allow the owner to give tokens", () => {
    var ballot;

    // Make accounts[3] the owner
    // Using new() to pass constructor parameters (see https://github.com/trufflesuite/truffle/issues/159)
    return VotingBallot.new(accounts[3]).then(instance => {
      ballot = instance;

      return ballot.give(accounts[2], 100, { from: accounts[3] });
    }).then(() =>
      ballot.getBalance.call(accounts[2])
    ).then(balance => {
      assert.equal(balance.toNumber(), 100, '100 wasn\'t given to the account');
    });
  });
});
