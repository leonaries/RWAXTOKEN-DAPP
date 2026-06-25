"use client";

import { darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/lib/web3/walletConnector";

import "@rainbow-me/rainbowkit/styles.css";

/**
 * Wagmi + RainbowKit 提供者
 * 自动处理所有钱包连接和冲突
 */

interface WalletProviderProps {
  children: ReactNode;
  /**
   * 允许外部传入 QueryClient，避免在应用内重复创建多个实例
   */
  queryClient?: QueryClient;
}

export function WalletProvider({ children, queryClient: providedQueryClient }: WalletProviderProps) {
  // 复用外部传入的 queryClient，避免重复实例；否则按默认配置创建一个
  const [queryClient] = useState(
    () =>
      providedQueryClient ||
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1
          }
        }
      })
  );

  // RainbowKit 主题缓存，避免重复创建
  const rainbowKitTheme = useMemo(
    () => ({
      lightMode: lightTheme({
        accentColor: "#34f56f",
        accentColorForeground: "#07090d",
        borderRadius: "medium"
      }),
      darkMode: darkTheme({
        accentColor: "#34f56f",
        accentColorForeground: "#07090d",
        borderRadius: "medium"
      })
    }),
    []
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// 为了兼容性，保留旧名称
export { WalletProvider as ReownProvider };
export { WalletProvider as WagmiProviderWrapper };
