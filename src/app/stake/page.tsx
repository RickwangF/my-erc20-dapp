'use client';

import styles from './stake.module.css'
import {
    getStakedAmount,
    getPID,
    stake,
    withdraw,
    approve,
    allowance,
    hasAdminRole,
    unstake,
    withdrawAmount,
} from '../lib/contract';
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import {ConnectButton} from "@rainbow-me/rainbowkit";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import {ethers} from "ethers";


export default function Page() {
    const account = useAccount()
    const [stakeAmount, setStakeAmount] = useState('');
    const [pendingWithdrawAmount, setPendingWithdrawAmount] = useState('');
    const [availableWithdrawAmount, setAvailableWithdrawAmount] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    // 当前 Tab 索引
    const [tabIndex, setTabIndex] = useState('1');
    const [inputAmount, setInputAmount] = useState<number | null>(null);
    const [unstakeAmount, setUnstakeAmount] = useState<string | null>(null);
    // Tab 切换事件
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue);
    };

    const handleInputChange = (value: string) => {
        const numericValue = parseFloat(value);
        setInputAmount(isNaN(numericValue) ? null : numericValue);
    }

    const handleUnstakeInputChange = (value: string) => {
        const numericValue = parseFloat(value);
        if (numericValue === null || isNaN(numericValue)) {
            alert('Please enter a valid amount!');
            return;
        }

        setUnstakeAmount(value);
    }

    const handleButtonTapped = () => {
        if (inputAmount === null) {
            alert('Please enter a valid amount!');
            return
        }
        handleStakeTokens(inputAmount as number);
    }

    const handleUnstakeButtonTapped = () => {
        if (unstakeAmount === null) {
            alert('Please enter a valid amount!');
            return
        }
        handleUnstakeTokens(unstakeAmount as string);
    }

    const handleWithdrawButtonTapped = () => {
        if (availableWithdrawAmount === null) {
            alert('Please commit unstake first!');
            return
        }

        const numericValue = parseFloat(availableWithdrawAmount);
        if (isNaN(numericValue) || numericValue <= 0) {
            alert('No tokens available for withdrawal!');
            return;
        }

        handleWithdrawTokens(availableWithdrawAmount.toString());
    }

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

    const handleStakeTokens = async (amount: number) => {
        console.log('Staking tokens');
        try {
            const tx = await stake(contractAddress, amount);
            console.log('Stake successful, transaction:', tx);
            fetchStakeAmount()
        } catch (error) {
            console.error('Error during staking:', error);
        }
    }

    const fetchWithdrawAmount = async () => {
        console.log('Fetching withdrawable amount for account:', account.address);
        try {
            const tx = await withdrawAmount(contractAddress, account.address as string);
            setAvailableWithdrawAmount(ethers.formatEther(tx.requestAmount))
            setPendingWithdrawAmount(ethers.formatEther(tx.pendingWithdrawAmount))
            console.log('Withdrawable amount fetched, transaction:', tx);
        } catch (error) {
            console.error('Error fetching withdrawable amount:', error);
        }
    }

    const handleUnstakeTokens = async (amount: string) => {
        console.log('Unstaking tokens');
        try {
            const tx = await unstake(contractAddress, amount);
            console.log('Unstake successful, transaction:', tx);
            debugger
            fetchStakeAmount()
            fetchWithdrawAmount()
        } catch (e) {
            console.error('Error during unstaking:', e);
        }
    }

    const handleWithdrawTokens = async (amount: string) => {
        console.log('Withdrawing tokens');
        try {
            const tx = await withdraw(contractAddress);
            console.log('Withdraw successful, transaction:', tx);
            fetchWithdrawAmount()
        } catch (e) {
            console.error('Error during withdrawing:', e);
        }
    }

    useEffect(() => {
        fetchStakeAmount()
        fetchWithdrawAmount()
    }, [account.isConnected]);

    return(
        <TabContext value={tabIndex}>
            <div className="min-h-screen flex flex-col bg-gray-900 text-white">
                <header className="grid grid-cols-3 items-center p-4 bg-gray-800 shadow-md">
                    {/* 左侧标题 */}
                    <div className="text-left">
                        <h1 className="text-xl font-bold">MetaNode Stake</h1>
                    </div>

                    {/* 中间 Tabs 居中 */}
                    <div className="flex justify-center">
                        <Tabs
                            value={tabIndex}
                            onChange={handleChange}
                            textColor="inherit"
                            indicatorColor="primary"
                        >
                            <Tab label="Stake" value="1"/>
                            <Tab label="Withdraw" value="2" />
                        </Tabs>
                    </div>

                    {/* 右侧钱包连接按钮 */}
                    <div className="flex justify-end">
                        <ConnectButton />
                    </div>
                </header>
                <main className="flex-1 p-6 flex flex-col items-center">
                    <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                        <TabPanel value="1">
                            <div className={styles.whiteBorderContainer}>
                                <p className="text-white text-2xl !pr-3 !pt-5">
                                    Staked Amount
                                </p>
                                <p className="text-white text-2xl font-bold">
                                    { stakeAmount }
                                </p>
                                <p className="!mt-20 text-2xl">amount to stake</p>
                                <div className="h-20">
                                    <TextField id="filled-basic" placeholder="input ETH amount" variant="filled" fullWidth className="bg-white rounded-lg" onChange={ (e) => { handleInputChange(e.target.value) } } />
                                </div>
                                <div className="h-20">
                                    <Button variant="contained" color="primary" fullWidth className="bg-blue-600 hover:bg-blue-700 h-15" onClick={ () => { handleButtonTapped() } }> Stake </Button>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <div className={styles.whitLgBorderContainer}>
                                <div className={styles.withdrawAmountContainer}>
                                    <div className={styles.withdrawAmountItem}>
                                        <p className={styles.withdrawAmountItemTitle}>staked Amount</p>
                                        <p className={styles.withdrawAmountItemValue}>{ stakeAmount }ETH</p>
                                    </div>
                                    <div className={styles.withdrawAmountItem}>
                                        <p className={styles.withdrawAmountItemTitle}>Available to Withdraw</p>
                                        <p className={styles.withdrawAmountItemValue}>{ availableWithdrawAmount }ETH</p>
                                    </div>
                                    <div className={styles.withdrawAmountItem}>
                                        <p className={styles.withdrawAmountItemTitle}>Pending Withdraw</p>
                                        <p className={styles.withdrawAmountItemValue}>{ pendingWithdrawAmount }ETH</p>
                                    </div>
                                </div>
                                <p className="text-white text-2xl !p-4">
                                    Unstake
                                </p>
                                <div className="h-20">
                                    <TextField id="filled-basic" placeholder="input ETH amount" variant="filled" fullWidth className="bg-white rounded-lg" onChange={ (e) => { handleUnstakeInputChange(e.target.value) } } />
                                </div>
                                <div className="h-20">
                                    <Button variant="contained" color="primary" fullWidth className="bg-blue-600 hover:bg-blue-700 h-15" onClick={ () => { handleUnstakeButtonTapped() } }> Unstake </Button>
                                </div>

                                <p className="text-white text-2xl !p-4">
                                    Withdraw
                                </p>
                                <div className="h-20">
                                    <TextField id="filled-basic" placeholder="input ETH amount" variant="filled" fullWidth className="bg-white rounded-lg" disabled value={availableWithdrawAmount}/>
                                </div>
                                <div className="h-20">
                                    <Button variant="contained" color="primary" fullWidth className="bg-blue-600 hover:bg-blue-700 h-15" onClick={ () => { handleWithdrawButtonTapped() } }> withdraw </Button>
                                </div>
                            </div>
                        </TabPanel>
                    </div>
                </main>
                {/* 公共页脚 */}
                <footer className="p-4 text-center text-gray-400 border-t border-gray-700">
                    © 2025 MyERC20DApp. All rights reserved.
                </footer>
            </div>
        </TabContext>
    );
}