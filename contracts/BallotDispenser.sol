pragma solidity ^0.4.11;

import './VotingPass.sol';
import './VotingBallot.sol';

/* The BallotDispenser is a mixing service to allow voters to anonymousely exchange
 * their voting pass (proof of voting right) for a voting ballot
 * (anonymous token used for voting).
 * The protocol is based on the Blindcoin protocol by L. Valenta and B. Rowan
 */
contract BallotDispenser {
  string public name = 'BallotDispenser';

  address public mixer;
  int public publicKey = 65537;
  string public moduloParam;
  // The mix tokens that have already been redeemed, per address.
  // A mix token is a combination of an address and a nonce.
  mapping(address => uint16[]) public redeemedTokens;

  Mix public currentMix; // Usage of currentMix allows users to all use the same parameters
  VotingPass private votingPass;
  VotingBallot private votingBallot;
  uint8 public tokenAmount; // amount of ballot tokens that are transferred (> 1 is for dummy votes)

  struct Mix {
    uint deposit;
    uint deadlineTransferClient;  // A unix timestmap, known as t1 in the protocol
    uint deadlineProvideWarranty; // A unix timestmap, known as t2 in the protocol
    uint deadlineUnblindAddress;  // A unix timestmap, known as t3 in the protocol
    uint deadlineTransferMixer;   // A unix timestmap, known as t4 in the protocol
    uint minimumBlockAmount;
    uint numberOfParticipants;
    bool isValid;                 // Used to check wheter struct is initialized (should be true)
  }

  event JoinRequested(address indexed client,
                      uint deposit,                    // Start Mix Struct
                      uint deadlineTransferClient,
                      uint deadlineProvideWarranty,
                      uint deadlineUnblindAddress,
                      uint deadlineTransferMixer,
                      uint minimumBlockAmount,      // End Mix Struct
                      string mixToken);             // mixToken is an encrypted MixToken struct (blinded)

  /* partialWarranty is an object signed by the mixer containing:
   * The MixToken of the client, the paymnent address and the Mix (parameters)
   */
  event JoinAccepted(address indexed client, string partialWarranty);

  /* Used to notify a client that his join request as been rejected */
  event JoinRejected(address indexed client);

  event FundsTransferred(address client, uint value);

  event WarrantyProvided(address indexed client, string warranty); // warranty is a signed MixWarranty struct

  /* Constructor */
  function BallotDispenser(address _mixer, address _vpAddress, string _moduloParam, uint8 _tokenAmount) {
    mixer = _mixer;
    votingPass = VotingPass(_vpAddress);
    moduloParam = _moduloParam;
    tokenAmount = _tokenAmount;
  }

  function isInitialized() private returns (bool) {
    return votingBallot != address(0);
  }


  /* As VotingBallot (VB) depends on BallotDispenser (BD), VB cannot be deployed first.
   * Its address is therefore unknown when BD is deployed, and should be set at a later stage
   */
  function setVotingBallot(address _votingBallot) {
    require(!isInitialized());
    require(msg.sender == mixer);
    votingBallot = VotingBallot(_votingBallot);
  }

  /* Allows the mixer to setup the mixing parameters for a mix */
  function startMix(uint deposit,
                    uint deadlineTransferClient,
                    uint deadlineProvideWarranty,
                    uint deadlineUnblindAddress,
                    uint deadlineTransferMixer,
                    uint minimumBlockAmount) {
    require(isInitialized());
    require(msg.sender == mixer);

    currentMix = Mix(deposit,
                     deadlineTransferClient,
                     deadlineProvideWarranty,
                     deadlineUnblindAddress,
                     deadlineTransferMixer,
                     minimumBlockAmount,
                     0,
                     true);
  }

  /* Used by the client to provide a request to join a mix.
   * The provided mix parameters are preferred to be equal to currentMix
   * to allow for 1/n anonimity.
   * The mix token should be blinded to remain untraceable */
  function joinMix(uint deposit,
                   uint deadlineTransferClient,
                   uint deadlineProvideWarranty,
                   uint deadlineUnblindAddress,
                   uint deadlineTransferMixer,
                   uint minimumBlockAmount,
                   string mixToken) {
    require(isInitialized());
    require(votingPass.balanceOf(msg.sender) > 0);
    // TODO: Perhaps votingpass should be set on lock with a deadline (deadlineProvideWarranty),
    // such that when it is not redeemed before that deadline, it gets released (or when rejectMix is called)
    /* require(deposit                 == currentMix.deposit); */
    /* require(deadlineTransferClient  == currentMix.deadlineTransferClient); */
    /* require(deadlineProvideWarranty == currentMix.deadlineProvideWarranty); */
    /* require(deadlineUnblindAddress  == currentMix.deadlineUnblindAddress); */
    /* require(deadlineTransferMixer   == currentMix.deadlineTransferMixer); */
    /* require(minimumBlockAmount      == currentMix.minimumBlockAmount); */

    JoinRequested(msg.sender,
                  deposit,
                  deadlineTransferClient,
                  deadlineProvideWarranty,
                  deadlineUnblindAddress,
                  deadlineTransferMixer,
                  minimumBlockAmount,
                  mixToken);
  }

  /* If the mixer accepts the client's terms, a partial warranty is provided
   * We support knowledge on the number of participants for the currentMix, If clients wish to join
   * using different mixing paramaters, that's their choice bu we will not count the number
   * of participants for them.
   * */
  function acceptJoin(address client, string partialWarranty, bool joinsCurrentMix) {
    require(isInitialized());
    require(currentMix.isValid);
    require(msg.sender == mixer);

    // increment the number of people in the current mix
    if(joinsCurrentMix) {
      currentMix.numberOfParticipants++;
    }

    JoinAccepted(client, partialWarranty);
  }

  /* A client's request to join can be rejected by the mixer,
   * this function notifies the client of this rejection.
   */
  function rejectJoin(address client) {
    //TODO: add rejection parameters to handle multiple joins.
    require(isInitialized());
    require(msg.sender == mixer);

    JoinRejected(client);
  }

  /* The client should use this function to pay the mixer
   * after they have received a partial warranty.
   * The mixer listens to events emitted by this function to determine whether the client
   * has paid the agreed-upon funds.
   */
  function payMixer() payable {
    require(isInitialized());

    mixer.transfer(msg.value);

    // @TODO Add more parameters to make this unique for one "mix attempt",
    //   i.e. unique for the combination of client + token + mix
    FundsTransferred(msg.sender, msg.value);
  }

  /* The mixer provides a warranty: the blinded MixToken, signed by the mixer*/
  function provideWarranty(address client, string warranty) {
    require(isInitialized());
    require(msg.sender == mixer);

    // TODO: check warranty for validity
    // VotingPass should only be redeemed in exchange for a valid warranty

    // Take in the voting pass and provide the warranty
    votingPass.redeem(client);
    WarrantyProvided(client, warranty);
  }

  /* Input: the address and nonce of the mixing token that is being redeemed */
  function giveSeededBallot(address to, uint16 nonce) payable {
    require(isInitialized());
    require(msg.sender == mixer);

    // Check if the token has not been redeemed already
    // @TODO check if we need to limit the max amount of loop iterations
    for (uint i = 0; i < redeemedTokens[to].length; i++) {
      require(redeemedTokens[to][i] != nonce);
    }

    redeemedTokens[to].push(nonce);

    to.transfer(msg.value);
    votingBallot.give(to, tokenAmount);
  }
}
