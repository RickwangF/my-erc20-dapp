// lib/contract.ts
import {useAccount} from "wagmi";
import {BrowserProvider, Contract, parseEther, formatEther, ethers} from 'ethers';
import abi from '../MetaNodeStakeABI.json';
import erc20Abi from '../erc20ABI.json';

async function getContract(address:string) {
    if (!window.ethereum) throw new Error('No wallet found');
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(address, abi, signer);
}

async function getTokenContract(address:string) {
    if (!window.ethereum) throw new Error('No wallet found');
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(address, erc20Abi, signer);
}

export async function approve(tokenAddress: string, contractAddress: string, amount: number) {
    debugger
    const tokenContact = await getTokenContract(tokenAddress);
    try {
        const allowance: boolean = await tokenContact.approve(contractAddress, ethers.parseUnits(amount.toString(), 18));
        return allowance;
    } catch (error) {
        console.error('Error during approval:', error);
    }
}

export async function hasAdminRole(acountAddress: string, address: string) {
    const contract = await getContract(address);
    try {
        debugger
        const isAdmin = await contract.hasRole(await contract.ADMIN_ROLE(), acountAddress);
        return isAdmin;
    } catch (error) {
        console.error('Error checking admin role:', error);
    }
}

export async function allowance(tokenAddress: string, owner: string, spender: string) {
    const tokenContact = await getTokenContract(tokenAddress);
    try {
        const allowance = await tokenContact.allowance(owner, spender);
        return formatEther(allowance);
    } catch (error) {
        console.error('Error fetching allowance:', error);
    }
}

export async function getStakedAmount(address: string) {
    const contract = await getContract(address);
    const pid: number = await getPID(address) as number;
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

export async function stake(tokenAddress:string, contractAddress: string, amount: number) {
    try {
        const approved = await approve(tokenAddress, contractAddress, amount);
        if (!approved) {
            throw new Error('Approval failed');
        }

        debugger
        const contract = await getContract(contractAddress);
        const pid = await getPID(contractAddress);
        const tx = await contract.deposit(pid, ethers.parseUnits(amount.toString(), 18));
        const result = await tx.wait();
        return result;
    } catch (error) {
        console.error('Error during staking:', error);
    }
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