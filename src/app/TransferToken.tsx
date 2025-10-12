'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'
import erc20Abi from '@/app/const' // 你也可以直接在本文件中定义 ERC20 ABI

export default function TransferToken() {
    const [to, setTo] = useState('')
    const [amount, setAmount] = useState('')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const tokenAddress = '0x0918Bb9AD8a920Dbdbb814d5a379f7005fcbf90c'

    const { writeContract } = useWriteContract()

    const handleTransfer = async () => {
        if (!to || !amount) {
            alert('请输入接收地址和转账金额')
            return
        }

        try {
            setIsLoading(true)
            setIsSuccess(false)

            // 直接调用 writeContract 官方示例方式
            const tx = await writeContract({
                abi: erc20Abi,
                address: tokenAddress,
                functionName: 'transfer',
                args: [to, parseUnits(amount, 18)],
            })

            console.log('交易已发送:')
            console.log('交易完成:')

            setIsSuccess(true)
        } catch (err: any) {
            alert(`转账失败: ${err?.message || err}`)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ padding: 20, border: '1px solid #ffffff', borderRadius: 8, marginTop: 20, cornerRadius: 8 }}>
            <h3>转账 Token 💸</h3>

            <input
                placeholder="接收地址"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{ width: '100%', marginBottom: 10 }}
            />

            <input
                placeholder="转账金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', marginBottom: 10 }}
            />

            <button onClick={handleTransfer} disabled={isLoading}>
                {isLoading ? '转账中...' : '确定转账'}
            </button>

            {isSuccess && txHash && (
                <p style={{ marginTop: 10 }}>
                    ✅ 转账成功，交易哈希：{' '}
                    <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {txHash}
                    </a>
                </p>
            )}
        </div>
    )
}
