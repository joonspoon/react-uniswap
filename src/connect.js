import { ethers } from "ethers";
import fs from 'fs';
import * as Utils from './utils.js';

const contractAddress = '0xd593D207FdA0034d34D0F7CC911c03b7BB17A614';
const contractJson = JSON.parse(fs.readFileSync('../proxy-contract/artifacts/contracts/Box.sol/Box.json', 'utf8'));
const secrets = JSON.parse(fs.readFileSync('../proxy-contract/secrets.json', 'utf8'));
const provider = ethers.providers.getDefaultProvider('rinkeby');
const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);

const value = await contract.retrieve();
console.log('Box value is', value.toString());

let privateKey = Utils.getPrivateKeyFromSeedPhrase(secrets.seedPhrase);
let wallet = new ethers.Wallet(privateKey, provider);
var signedContract = new ethers.Contract(contractAddress, contractJson.abi, wallet);
await signedContract.store(value.add(1));

await new Promise(r => setTimeout(r, 10000));

const updatedValue = await contract.retrieve();
console.log('New box value is', updatedValue.toString());
