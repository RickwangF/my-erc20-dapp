import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import erc20Abi from '@/app/const'
import { useBalanceContext } from '@/app/BalanceContext'

export default function TransferToken() {
    const [to, setTo] = useState('')
    const [amount, setAmount] = useState('')
    const [txHash, setTxHash] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const tokenAddress = '0x0918Bb9AD8a920Dbdbb814d5a379f7005fcbf90c'
    const { writeContractAsync } = useWriteContract()

    // 监听交易确认
    const { data: receipt, isLoading: isTxLoading, isSuccess: isTxSuccess, isError } =
        useWaitForTransactionReceipt({
            hash: txHash && txHash.startsWith('0x') ? (txHash as `0x${string}`) : undefined,
        })

    // 当交易被确认或失败时执行副作用
    useEffect(() => {
        if (isTxSuccess) {
            console.log('交易已上链 ✅', receipt)
            setIsSuccess(true)
            setIsLoading(false)
        }
        if (isError) {
            console.error('交易失败 ❌')
            setIsLoading(false)
            setIsSuccess(false)
        }
    }, [receipt, isTxSuccess, isError])

    const handleTransfer = async () => {
        if (!to || !amount) {
            alert('请输入接收地址和转账金额')
            return
        }

        try {
            setIsLoading(true)
            setIsSuccess(false)

            const tx = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress,
                functionName: 'transfer',
                args: [to, parseUnits(amount, 18)],
            })

            console.log('交易已发送，hash:', tx)
            setTxHash(tx as string)
        } catch (err: unknown) {
            setIsLoading(false)
            if (err instanceof Error) {
                // TS 能识别 err.message
                alert(`转账失败: ${err.message}`)
                console.error(err)
            } else {
                // 非 Error 类型
                alert(`转账失败: ${String(err)}`)
                console.error(err)
            }
        }
    }

    return (
        <div style={{ padding: 20 }}>
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
            <button onClick={handleTransfer} disabled={isLoading || isTxLoading}>
                {isLoading || isTxLoading ? '转账中...' : '确定转账'}
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
