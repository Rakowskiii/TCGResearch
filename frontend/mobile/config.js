import { abi } from './Cards.json';
import { ethers } from 'ethers';


const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.EXPO_PUBLIC_RPC_URL);
const wallet = new ethers.Wallet(process.env.EXPO_PUBLIC_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);
const selfAddress = wallet.address;

export {
    contractAddress,
    contract,
    wallet,
    selfAddress
}