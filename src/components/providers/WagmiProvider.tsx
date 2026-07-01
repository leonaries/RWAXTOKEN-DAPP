"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

import { initializeAppKit, wagmiConfig } from "@/lib/web3/walletConnector";

/**
 * Wagmi + Reown AppKit 提供者
 * AppKit 负责钱包弹窗，Wagmi 负责账户状态和签名。
 */

interface WalletProviderProps {
  children: ReactNode;
  /**
   * 允许外部传入 QueryClient，避免在应用内重复创建多个实例
   */
  queryClient?: QueryClient;
}

export function WalletProvider({ children, queryClient: providedQueryClient }: WalletProviderProps) {
  initializeAppKit();

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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

// 为了兼容性，保留旧名称
export { WalletProvider as ReownProvider };
export { WalletProvider as WagmiProviderWrapper };
