pragma solidity ^0.4.11;

/* VotingPass contract will be used in combination with BallotDispenser contract
 * to authorize people for obtaining a voting ballot */
contract VotingPass {
  // standard token members
  string public name = 'VotingPass';
  string public symbol = 'VP';
  uint8 public decimals = 0;

  address public issuer;
  address public redeemer; // Redeemer should be the address of BallotDispenser contract
  mapping (address => uint) public balanceOf;

  event Give(address indexed to);
  event Redeem(address indexed from);

  function VotingPass(address _issuer) {
    issuer = _issuer;
  }

  /* As BallotDispenser (BD) depends on VotingPass (VP), BD cannot be deployed first.
   * Its address is therefore unknown when VP is deployed, and should be set at a later stage
   */
  function setRedeemer(address _redeemer) {
    require(redeemer == address(0));
    require(msg.sender == issuer);
    redeemer = _redeemer;
  }

  /* give a single voting pass to <to> */
  function give(address to) {
    require(msg.sender == issuer);
    require(balanceOf[to] + 1 > balanceOf[to]);

    balanceOf[to]++;

    Give(to);
  }

  /* Redeem a single voting pass of <from> */
  function redeem(address from) {
    require(msg.sender == redeemer);
    require(balanceOf[from] > 0);

    balanceOf[from]--;

    Redeem(from);
  }
}
