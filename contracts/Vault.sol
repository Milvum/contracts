pragma solidity ^0.4.11;

/* The Vault is a simple append-only list which allows anybody to add an RSA-encrypted Ethereum
 * receipt + appropriately chosen nonce. It also includes the parameters of the public key used to
 * encrypt these entries to allow software which makes use of the data in this contract to ignore
 * spam-values inserted into the list.
 *
 * After the private key associated with the public key parameters stored in this contract are made
 * public, any party can decrypt the contents of the list stored in the Vault and apply the
 * appropriate election rules to derive an election result.
 */
contract Vault {
  string public name = 'Vault';

  int public publicKey = 65537;
  string public moduloParam;

  // The nonce should be 'big enough' to prevent dispelling the Vault encryption before the election
  // is over. https://security.stackexchange.com/questions/1952/how-long-should-a-random-nonce-be
  int public nonceBits;

  // TODO: Proper datatype for the resulting encrypted value (either `string` or `bytes`)
  mapping(address => string) public encryptedList;
  address[] public lookupTable;

  /* Constructor */
  function Vault(string _moduloParam, int _nonceBits) {
    moduloParam = _moduloParam;
    nonceBits = _nonceBits;
  }

  function size() public returns (uint) {
    return lookupTable.length;
  }

  function append(string payload) public {
    // Payload has to be non-empty
    require(bytes(payload).length != 0);
    address from = msg.sender;
    // Only allow one write per address
    require(bytes(encryptedList[from]).length == 0);
    lookupTable.push(from);
    encryptedList[from] = payload;
  }
}
