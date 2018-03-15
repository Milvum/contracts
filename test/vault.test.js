let Vault = artifacts.require("Vault");

contract('Vault', accounts => {
  async function freshContract() {
    return await Vault.new("dummyModulo", 256);
  }

  it("should be created", async () => {
    return await freshContract();
  });

  it('should start out empty', async () => {
    const contract = await freshContract();
    const size = await contract.size.call();
    assert.equal(size, 0, "Size should be zero");
  });

  it('should be able to append values', async () => {
    const contract = await freshContract();
    contract.append("myPayload");
    const size = await contract.size.call();
    assert.equal(size, 1, "Size should be one");
  });

  it('should not be able to append an empty payload', async () => {
    const contract = await freshContract();
    try {
      await contract.append('');
      return assert(false, 'Appending empty payload should have failed');
    } catch (err) {
      return assert.match(err, /VM Exception[a-zA-Z0-9 ]+: (revert|invalid opcode)/, "Appending empty payload should have failed");
    }
  });

  it('should not be able to retrieve unset values', async () => {
    const contract = await freshContract();
    const randomValue = await contract.encryptedList(7331);
    assert.equal(randomValue, '', "unset values should default to the empty value ('')");
  });

  it('should not be able to append a payload twice', async () => {
    const contract = await freshContract();
    try {
      await contract.append("myPayload1");
      await contract.append("myPayload2");
      return assert(false, 'Appending multiple payloads should have failed');
    } catch(err) {
      return assert.match(err, /VM Exception[a-zA-Z0-9 ]+: (revert|invalid opcode)/, "Appending multiple payloads should have failed");
    }
  });

  it('should be able to retrieve stored values', async () => {
    const contract = await freshContract();
    const payload = "randomPayload";
    contract.append(payload);
    const key = await contract.lookupTable.call(0);
    const retrievedPayload = await contract.encryptedList.call(key);
    assert.equal(retrievedPayload, payload, "Retrieved payload should match stored payload");
  });
});
