'use client';

import styles from './stake.module.css'
import {ConnectButton} from "@rainbow-me/rainbowkit";
import { getStakedAmount, getPID, redeem, stake, withdraw } from '../lib/contract';
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";

export default function Page() {
    const account = useAccount()
    const [stakeAmount, setStakeAmount] = useState('');
    const [loadedPID, setLoadedPID] = useState(false);
    const [approveContract, setApproveContract] = useState(false);
    const [pid, setPID] = useState<number | null>(null);

    const contractAddress = "0x01A01E8B862F10a3907D0fC7f47eBF5d34190341"

    const fetchStakeAmount = async () => {
        console.log('Fetching staked amount for account:', account.address);
        try {
            const amount = await getStakedAmount(typeof pid === "number" ? pid : 0, contractAddress);
            console.log('staked amount: ', amount);
            setStakeAmount(amount);
        } catch (error) {
            console.error('Error fetching staked amount:', error);
        }
    };

    const fetchPID = async () => {
        console.log('Fetching PID');
        try {
            const pid = await getPID(contractAddress);
            setPID(pid)
            setLoadedPID(true);
            console.log('PID:', pid);
        } catch (error) {
            console.error('Error fetching PID:', error);
        }
    };

    useEffect(() => {
        fetchPID()
    }, [account.isConnected]);

    useEffect(() => {
        if (pid !== null && loadedPID) {
            fetchStakeAmount();
        }
    }, [pid, loadedPID]);

    return(
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <div className="flex flex-row justify-start items-center p-3 min-w-screen bg-white shadow-md shadow-gray-300">
                <ConnectButton />
            </div>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className={styles.whiteBorderContainer}>
                    <p className="text-white text-base p-3">
                        Stake Balance: { stakeAmount }
                    </p>
                    <div className="h-20">

                    </div>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

            </footer>
        </div>
    );
}