"use client";

/**
 * Wagmi + Reown AppKit 钱包连接配置
 * AppKit 负责钱包选择、插件唤起和 WalletConnect 扫码。
 */

import { createAppKit } from "@reown/appkit/react";
import { arbitrum, mainnet, polygon } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http, type Config } from "wagmi";

import { themeColors } from "@/config/theme";

// WalletConnect 项目 ID
// 必需。如果没有配置，AppKit 的 WalletConnect 扫码能力会受限。
// 请在 .env 中配置 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "908d23f4996b71c5155ba75d19bef88b";
const chains = [mainnet, polygon, arbitrum] as const;
const ethereumRpcUrl =
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://ethereum.publicnode.com";
const polygonRpcUrl =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com";
const arbitrumRpcUrl =
  process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arbitrum-one-rpc.publicnode.com";

// 显式覆盖 wagmi/chains 的默认 RPC，避免浏览器请求 eth.merkle.io 这类默认公共节点。
const transports = {
  [mainnet.id]: http(ethereumRpcUrl),
  [polygon.id]: http(polygonRpcUrl),
  [arbitrum.id]: http(arbitrumRpcUrl)
} as const;

const wagmiAdapter = new WagmiAdapter({
  networks: [...chains],
  projectId,
  ssr: true,
  transports
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...chains],
  defaultNetwork: mainnet,
  metadata: {
    name: "RWAXTOKEN-DAPP",
    description: "RWA token launch, finance, staking, mining pool and brand token dapp.",
    url: typeof window === "undefined" ? "https://rwaxtoken.com" : window.location.origin,
    icons: [typeof window === "undefined" ? "https://rwaxtoken.com/favicon.ico" : `${window.location.origin}/favicon.ico`]
  },
  features: {
    email: false,
    socials: false,
    allWallets: true,
    swaps: false,
    onramp: false,
    history: false,
    analytics: false
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": themeColors.accent,
    "--w3m-color-mix": themeColors.surface,
    "--w3m-color-mix-strength": 18,
    "--w3m-border-radius-master": "18px"
  }
});

export function initializeAppKit() {
  return appKit;
}

/**
 * Wagmi 配置
 * Reown AppKit 使用同一个 WagmiAdapter 输出的配置。
 */
export const wagmiConfig = wagmiAdapter.wagmiConfig as Config;

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
