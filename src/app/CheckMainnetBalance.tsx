'use client'

import { useBalance } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import utils from '@/app/utils'
import {useAccount} from "wagmi";

export default function CheckMainnetBalance() {
    const account = useAccount()
    const address = account.address // 举例：Bitfinex 热钱包
    const { data, isLoading, error } = useBalance({
        address, // 举例：Bitfinex 热钱包
        chainId: mainnet.id,
    })

    if (isLoading) return <p>查询中...</p>
    if (error) return <p>查询失败：{error.message}</p>

    return (
        <div style={{ padding: 20, border: '1px solid #ffffff', borderRadius: 8, marginTop: 20}}>
            <h2>主网地址余额 💰</h2>
            <p>地址: {utils.formatAddress(address)}</p>
            <p>余额: {data?.formatted} {data?.symbol}</p>
        </div>
    )
}
