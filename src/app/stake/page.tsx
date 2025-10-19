'use client';

import styles from './stake.module.css'
import {getStakedAmount, getPID, redeem, stake, withdraw, approve, allowance, hasAdminRole} from '../lib/contract';
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function Page() {
    const account = useAccount()
    const [stakeAmount, setStakeAmount] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const contractAddress = "0x01A01E8B862F10a3907D0fC7f47eBF5d34190341"

    const fetchStakeAmount = async () => {
        console.log('Fetching staked amount for account:', account.address);
        try {
            const amount = await getStakedAmount(contractAddress, account.address as string);
            console.log('staked amount: ', amount);
            setStakeAmount(amount);
        } catch (error) {
            console.error('Error fetching staked amount:', error);
        }
    };

    const handleClose = () => setShowAlert(false);

    const handleStakeOneToken = async () => {
        console.log('Staking tokens');
        try {
            const tx = await stake(contractAddress, 0.001);
            console.log('Stake successful, transaction:', tx);
            fetchStakeAmount()
        } catch (error) {
            console.error('Error during staking:', error);
        }
    }

    useEffect(() => {
        fetchStakeAmount()
    }, [account.isConnected]);

    return(
        <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className={styles.whiteBorderContainer}>
                <p className="text-white text-2xl !pr-3 !pt-5">
                    Staked Amount
                </p>
                <p className="text-white text-2xl font-bold">
                    { stakeAmount }
                </p>
                <p className="!mt-20 text-2xl">amount to stake</p>
                <div className="h-20">
                    <TextField id="filled-basic" placeholder="input ETH amount" variant="filled" fullWidth className="bg-white rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
// <div>
{/*<div className="flex flex-row justify-start items-center p-3 min-w-screen bg-white shadow-md shadow-gray-300">*/}
{/*    <ConnectButton />*/}
{/*</div>*/}

{/*<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">*/}

{/*</footer>*/}
{/*<Snackbar*/}
{/*    open={showAlert}*/}
{/*    autoHideDuration={5000}*/}
{/*    onClose={handleClose}*/}
{/*    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}*/}
{/*>*/}
{/*    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>*/}
{/*        Allowance Amount: {allowanceAmount}*/}
{/*    </Alert>*/}
{/*</Snackbar>*/}
// </div>