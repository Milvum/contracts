/* Copied and modified from both pieces of token code of https://www.ethereum.org/token */
pragma solidity ^0.4.8;

contract VotingBallot {
  /* Public variables of the token */
  string public standard = 'Token 0.1';
  // name, symbol and decimals are all for display purposes
  string public name = 'VotingBallot';
  string public symbol = 'VB';
  uint8 public decimals = 0;

  /* The owner can create and give tokens to anyone */
  address public owner;

  /* This creates an array with all balances */
  mapping (address => uint256) public balanceOf;

  /* This generates a public event on the blockchain that will notify clients */
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Give(address indexed from, address indexed to, uint256 value);

  /* Initializes contract */
  function VotingBallot(address _owner) {
    owner = _owner;
  }

  /* Send tokens */
  function transfer(address to, uint256 value) {
    require(balanceOf[msg.sender] >= value);
    // Check for overflows
    require(balanceOf[to] + value > balanceOf[to]);

    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    Transfer(msg.sender, to, value);
  }

  /*
   * Create value new tokens and give them to the to address
   */
  function give(address to, uint256 value) {
    require(msg.sender == owner);
    // Check for overflows
    require(balanceOf[to] + value >= balanceOf[to]);


    balanceOf[to] += value;

    Give(msg.sender, to, value);
  }

  /* Get the balance of address addr */
  function getBalance(address addr) returns(uint) {
    return balanceOf[addr];
  }
}
