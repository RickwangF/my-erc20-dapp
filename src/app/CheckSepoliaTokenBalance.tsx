'use client'

import {useReadContract, useWatchContractEvent} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import {formatUnits, decodeEventLog } from 'viem'
import utils from '@/app/utils'

// ERC20 ABI — 包含 balanceOf 和 Transfer 事件
const erc20Abi = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
]

export default function CheckSepoliaTokenBalance() {

    // 0x0918Bb9AD8a920Dbdbb814d5a379f7005fcbf90c
    // 0xBA17EFEbe6078918c5866A23DBc20542f1957E14
    const tokenAddress = '0x0918Bb9AD8a920Dbdbb814d5a379f7005fcbf90c'
    const userAddress = '0x6eA5F70015c435A85b8F9d9619f5F3D8DA7f665B'

    // 查询余额
    const { data, isLoading, error, refetch } = useReadContract({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: sepolia.id,
    })

    // 监听 Transfer 事件
    useWatchContractEvent({
        address: tokenAddress,
        abi: erc20Abi,
        eventName: 'Transfer',
        chainId: sepolia.id,
        onLogs(logs) {
            for (const log of logs) {
                // 使用类型断言明确告知 TS 返回值的结构
                const parsed = decodeEventLog({
                    abi: erc20Abi,
                    data: log.data,
                    topics: log.topics,
                })

                const { from, to, value } = parsed.args
                console.log(`📡 Transfer 事件: from=${from}, to=${to}, value=${formatUnits(value, 18)}`)
                //如果跟当前用户有关，就刷新余额
                if (from === userAddress || to === userAddress) {
                    refetch()
                }
            }
        },
    })

    if (isLoading) return <p>查询中...</p>
    if (error) return <p>查询失败：{error.message}</p>

    return (
        <div style={{ padding: 20, border: '1px solid #ffffff', borderRadius: 8, marginTop: 20}}>
            <h2>Sepolia Token 余额 🪙</h2>
            <p>Token 地址: {utils.formatAddress(tokenAddress)}</p>
            <p>用户地址: {utils.formatAddress(userAddress)}</p>
            <p>余额: {data ? formatUnits(data as bigint, 18) : '0'} Token</p>
            <p style={{ color: '#888', marginTop: 8 }}>
                （监听中，如果发生转账会自动刷新余额）
            </p>
        </div>
    )
}
