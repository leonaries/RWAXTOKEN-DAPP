"use client";

/**
 * Wagmi + RainbowKit 钱包连接配置
 * 自动处理所有钱包连接和冲突问题
 */

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { createConfig, http, type Config } from "wagmi";

// WalletConnect 项目 ID
// 必需。如果没有配置，RainbowKit v2 可能会报错或功能受限。
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

function createServerSafeConfig() {
  return createConfig({
    chains,
    connectors: [],
    transports,
    ssr: true
  });
}

function createClientConfig() {
  return getDefaultConfig({
    appName: "RWAXTOKEN-DAPP",
    projectId,
    chains,
    transports,
    ssr: true
  });
}

declare global {
  // eslint-disable-next-line no-var
  var __RWAXTOKEN_WAGMI_CONFIG__: Config | undefined;
}

function getWagmiConfig() {
  if (!globalThis.__RWAXTOKEN_WAGMI_CONFIG__) {
    globalThis.__RWAXTOKEN_WAGMI_CONFIG__ =
      typeof window === "undefined" ? createServerSafeConfig() : createClientConfig();
  }

  return globalThis.__RWAXTOKEN_WAGMI_CONFIG__;
}

/**
 * Wagmi 配置
 * 服务端使用安全占位配置，避免在 SSR / dev compile 阶段触发 indexedDB。
 * 浏览器端再启用完整的 RainbowKit + WalletConnect 配置。
 */
export const wagmiConfig = getWagmiConfig();

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
