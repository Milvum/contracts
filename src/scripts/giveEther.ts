import { transferEther } from './scriptUtils';

// Executing the script
const toAddress = process.argv[2];

transferEther(toAddress);
