import * as winston from 'winston';
import importer from '../index';

// Executing the script
const voter = process.argv[2];

const dispenser = importer.getContract('BallotDispenser');

winston.info(`${voter} requesting to join the mix`);
dispenser.joinMix(
  0.001, // deposit
  100,   // deadlineTransferClient
  200,   // deadlineProvideWarranty
  300,   // deadlineUnblindAddress
  400,   // deadlineTransferMixer
  5,     // minimumBlockAmount
  'blinded_token_placholder', // mixToken
  { from: voter });
