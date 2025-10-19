
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "modern-css-reset";
import "./globals.css";
import {Providers} from "./Providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MetaNode Stake DApp",
    description: "A staking DApp built with Next.js + RainbowKit + MUI",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 用独立的 Provider 组件包装应用 */}
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
