// src/app/stake/layout.tsx
"use client";

import './stake.module.css';
import { ReactNode } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function StakeLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold">MetaNode Stake</h1>
                <ConnectButton />
            </header>

            <main className="flex-1 p-6 flex flex-col items-center">
                {children}
            </main>

            {/* 公共页脚 */}
            <footer className="p-4 text-center text-gray-400 border-t border-gray-700">
                © 2025 MyERC20DApp. All rights reserved.
            </footer>
        </div>
    );
}
