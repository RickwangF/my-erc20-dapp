'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, http } from 'wagmi';
import {
    RainbowKitProvider,
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { mainnet, sepolia } from 'wagmi/chains';
import { BalanceProvider } from '@/app/BalanceContext';

// 🧩 初始化配置
const config = getDefaultConfig({
    appName: 'my-erc20-dapp',
    projectId: '8b1891b3443d4d7d7da7bc070de5bdae',
    chains: [sepolia, mainnet],
    ssr: false, // ❗️客户端渲染，不要在 SSR 阶段初始化钱包
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <BalanceProvider>{children}</BalanceProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
