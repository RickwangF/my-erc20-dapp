'use client'

import { useReadContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatUnits } from 'viem'
import utils from '@/app/utils'

// ERC20 ABI 只需 balanceOf 方法
const erc20Abi = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
]

export default function CheckSepoliaTokenBalance() {
    const tokenAddress = '0xBA17EFEbe6078918c5866A23DBc20542f1957E14'
    const userAddress = '0x6eA5F70015c435A85b8F9d9619f5F3D8DA7f665B'

    const { data, isLoading, error } = useReadContract({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: sepolia.id,
    })

    if (isLoading) return <p>查询中...</p>
    if (error) return <p>查询失败：{error.message}</p>

    return (
        <div style={{ padding: 20 }}>
            <h2>Sepolia Token 余额 🪙</h2>
            <p>Token 地址: {utils.formatAddress(tokenAddress)}</p>
            <p>用户地址: {utils.formatAddress(userAddress)}</p>
            <p>余额: {data ? formatUnits(data as bigint, 18) : '0'} Token</p>
        </div>
    )
}
