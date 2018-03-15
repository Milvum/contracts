const VotingPass = artifacts.require('VotingPass');

contract('VotingPass', accounts => {
  let contract;

  function createContract(issuer, redeemer) {
    return VotingPass.new(issuer).then(instance => {
      contract = instance;
      instance.setRedeemer(redeemer, { from: issuer });
    });
  }

  function randomAccount(accounts) {
    return accounts[Math.floor(Math.random() * accounts.length)];
  }

  it('should allow the issuer to give tokens', () => {
    const owner = randomAccount(accounts);
    const target = randomAccount(accounts);

    return createContract(owner, owner)
      .then(() => contract.give(target, { from: owner }))
      .then(() => contract.balanceOf.call(target))
      .then(balance => assert.equal(balance.toNumber(), 1));
  });

  it('should allow the redeemer to redeem tokens', () => {
    assert.ok(accounts.length > 2);

    const issuer = randomAccount(accounts);
    const target = randomAccount(accounts);

    let redeemer;
    do {
      redeemer = randomAccount(accounts);
    } while (redeemer == issuer);

    return createContract(issuer, redeemer)
      .then(() => contract.give(target, { from: issuer }))
      .then(() => contract.balanceOf.call(target))
      .then(balance => assert.equal(balance.toNumber(), 1))
      .then(() => contract.redeem(target, { from: redeemer }))
      .then(() => contract.balanceOf.call(target))
      .then(balance => assert.equal(balance.toNumber(), 0));
  });

  it('should not allow tokens to be redeemed from an account with no tokens', () => {
    assert.ok(accounts.length > 2);

    const issuer = randomAccount(accounts);
    const target = randomAccount(accounts);
    const redeemer = randomAccount(accounts);

    return createContract(issuer, redeemer)
      .then(() => contract.balanceOf.call(target))
      // target has zero tokens
      .then(balance => assert.equal(balance.toNumber(), 0))
      .then(() => contract.redeem(target, { from: redeemer }))
      // doing something illegal, we expect an error
      .catch(err => assert.ok(err instanceof Error))
      .then(() => contract.balanceOf.call(target))
      // target still has zero tokens at the end
      .then(balance => assert.equal(balance.toNumber(), 0));
  });

  it('should not allow the issuer to redeem tokens', () => {
    assert.ok(accounts.length > 2);

    const issuer = randomAccount(accounts);
    const target = randomAccount(accounts);

    let redeemer;
    do {
      redeemer = randomAccount(accounts);
    } while (redeemer == issuer);

    return createContract(issuer, redeemer)
      .then(() => contract.give(target, { from: issuer }))
      .then(() => contract.balanceOf.call(target))
      .then(balance => assert.equal(balance.toNumber(), 1))
      .then(() => contract.redeem(target, { from: issuer }))
      .catch(err => assert.ok(err instanceof Error))
      .then(() => contract.balanceOf.call(target))
      .then(balance => assert.equal(balance.toNumber(), 1));
  })
})
