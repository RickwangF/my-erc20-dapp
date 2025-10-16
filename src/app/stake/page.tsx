'use client';

import styles from './stake.module.css'
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {getStakedAmount, getPID, redeem, stake, withdraw, approve, allowance, hasAdminRole} from '../lib/contract';
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function Page() {
    const account = useAccount()
    const [stakeAmount, setStakeAmount] = useState('');
    const [loadedPID, setLoadedPID] = useState(false);
    const [allowanceAmount, setAllowanceAmount] = useState('');
    const [approveContract, setApproveContract] = useState(false);
    const [pid, setPID] = useState<number | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [stakeAmountInput, setStakeAmountInput] = useState('1');

    const contractAddress = "0x01A01E8B862F10a3907D0fC7f47eBF5d34190341"
    const tokenAddress = "0x0918Bb9AD8a920Dbdbb814d5a379f7005fcbf90c"

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

    const handleApprove = async () => {
        console.log('Approving contract:', tokenAddress);
        try {
            const allowance = await approve(tokenAddress, contractAddress, 90);
            console.log('Approval successful, allowance:', allowance);
        } catch (error) {
            console.error('Error during approval:', error);
        }
    }

    const checkAllowance = async () => {
        console.log('Checking allowance for contract:', tokenAddress);
        try {
            const currentAllowance = await allowance(tokenAddress, account.address as string, contractAddress);
            setAllowanceAmount(currentAllowance);
            console.log('Current allowance:', currentAllowance);
            setShowAlert(true)
            // 5秒后隐藏
            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error('Error checking allowance:', error);
        }
    }

    const handleClose = () => setShowAlert(false);

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

    const handleStakeOneToken = async () => {
        console.log('Staking tokens');
        try {
            const tx = await stake(tokenAddress, contractAddress, 1);
            console.log('Stake successful, transaction:', tx);
        } catch (error) {
            console.error('Error during staking:', error);
        }
    }

    const handleCheckAdminRole = async () => {
        console.log('Checking admin role for account:', account.address);
        try {
            const isAdmin = await hasAdminRole(account.address as string, contractAddress);
            console.log('Is admin:', isAdmin);
        } catch (error) {
            console.error('Error checking admin role:', error);
        }
    }

    useEffect(() => {
        handleCheckAdminRole()
    }, [account.isConnected]);

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
                        <Button variant="contained" onClick={ ()=> { checkAllowance() } }>fetch allowance amount</Button>
                    </div>
                    <div className="h-20">
                        <Button variant="contained" onClick={ () => { handleStakeOneToken() }}> quick stake one token </Button>
                    </div>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

            </footer>
            <Snackbar
                open={showAlert}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Allowance Amount: {allowanceAmount}
                </Alert>
            </Snackbar>
        </div>
    );
}