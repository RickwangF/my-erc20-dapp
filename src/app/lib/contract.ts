// lib/contract.ts
import {useAccount} from "wagmi";
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import abi from '../MetaNodeStakeABI.json';

async function getContract(address:string) {
    if (!window.ethereum) throw new Error('No wallet found');
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(address, abi, signer);
}

export async function getStakedAmount(pid: number, address: string) {
    const contract = await getContract(address);
    const amount = await contract.stakingBalance(pid, address);
    return formatEther(amount);
}

export async function getPID(address: string) {
    const contract = await getContract(address);
    try{
        const ethPid = await contract.ETH_PID();
        return ethPid;
    } catch (error) {
        console.error('Error fetching ETH_PID:', error);
    }
}

export async function stake(address: string, amount: string) {
    const contract = await getContract(address);
    const tx = await contract.stake({ value: parseEther(amount) });
    return tx.wait();
}

export async function redeem(address: string, amount: string) {
    const contract = await getContract(address);
    const tx = await contract.redeem(parseEther(amount));
    return tx.wait();
}

export async function withdraw(address: string) {
    const contract = await getContract(address);
    const tx = await contract.withdraw();
    return tx.wait();
}