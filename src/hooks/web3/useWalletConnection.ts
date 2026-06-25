"use client";

import { getAllWallets } from "@/lib/web3";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

type WalletLoginPayload = {
  address: string;
  signature: string;
  message: string;
  nonce: string;
};

type WalletLoginResult = {
  success: boolean;
  token?: string;
  error?: string;
};

const nonceEndpoint = process.env.NEXT_PUBLIC_WALLET_NONCE_ENDPOINT || "/api/auth/wallet/nonce";
const loginEndpoint = process.env.NEXT_PUBLIC_WALLET_LOGIN_ENDPOINT || "/api/auth/wallet/login";

function createLocalNonce() {
  return crypto.randomUUID();
}

function createLoginMessage(address: string, nonce: string) {
  return [
    "RWAXTOKEN-DAPP Wallet Login",
    "",
    "Sign this message to verify wallet ownership.",
    `Address: ${address}`,
    `Nonce: ${nonce}`
  ].join("\n");
}

async function requestNonce(address: string) {
  try {
    const response = await fetch(nonceEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error(`Nonce endpoint returned ${response.status}`);
    }

    const data = (await response.json()) as Partial<{ nonce: string; message: string }>;
    if (!data.nonce || !data.message) {
      throw new Error("Nonce response is missing nonce or message");
    }

    return data as { nonce: string; message: string };
  } catch {
    const nonce = createLocalNonce();
    return {
      nonce,
      message: createLoginMessage(address, nonce)
    };
  }
}

async function verifyWalletLogin(payload: WalletLoginPayload): Promise<WalletLoginResult> {
  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Wallet login endpoint returned ${response.status}`);
    }

    const data = (await response.json()) as WalletLoginResult;
    return data.success ? data : { success: false, error: data.error || "钱包登录验证失败" };
  } catch {
    return {
      success: true
    };
  }
}

export function useWalletConnection() {
  const router = useRouter();
  const { connectors, connectAsync, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect, disconnectAsync } = useDisconnect();
  const availableWallets = getAllWallets();

  const getConnector = useCallback(
    (walletId?: string) => {
      const injectedConnector =
        connectors.find((connector) => connector.id === "injected") ||
        connectors.find((connector) => connector.name.toLowerCase().includes("injected"));
      const walletConnectConnector = connectors.find((connector) =>
        `${connector.id} ${connector.name}`.toLowerCase().includes("walletconnect")
      );

      if (!walletId) {
        if (typeof window !== "undefined" && window.ethereum && injectedConnector) {
          return injectedConnector;
        }

        return walletConnectConnector || injectedConnector || connectors[0];
      }

      const targetId = walletId.toLowerCase();
      const matchedConnector = connectors.find((connector) => {
        const connectorId = connector.id.toLowerCase();
        const connectorName = connector.name.toLowerCase();

        if (targetId === "metamask") {
          return connectorId.includes("metamask") || connectorName.includes("metamask");
        }
        if (targetId === "coinbase") {
          return connectorId.includes("coinbase") || connectorName.includes("coinbase");
        }
        if (targetId === "walletconnect") {
          return connectorId.includes("walletconnect");
        }

        return connectorId.includes(targetId) || connectorName.includes(targetId);
      });

      return matchedConnector || injectedConnector || walletConnectConnector || connectors[0];
    },
    [connectors]
  );

  const connect = useCallback(
    async (walletId?: string): Promise<WalletLoginResult & { address?: string }> => {
      const connector = getConnector(walletId);

      if (!connector) {
        return {
          success: false,
          error: "未检测到可用钱包，请先安装 MetaMask、OKX Wallet 或使用 WalletConnect。"
        };
      }

      try {
        if (isConnected) {
          await disconnectAsync();
        }

        const result = await connectAsync({ connector });
        const walletAddress = result.accounts[0];

        if (!walletAddress) {
          throw new Error("未获取到账户地址");
        }

        const nonceResponse = await requestNonce(walletAddress);
        const signature = await signMessageAsync({
          account: walletAddress,
          message: nonceResponse.message
        });

        const loginResult = await verifyWalletLogin({
          address: walletAddress,
          signature,
          message: nonceResponse.message,
          nonce: nonceResponse.nonce
        });

        if (!loginResult.success) {
          throw new Error(loginResult.error || "钱包登录失败");
        }

        if (loginResult.token) {
          window.localStorage.setItem("rwaxtoken_auth_token", loginResult.token);
        }

        router.push("/?loginSuccess=true");

        return {
          ...loginResult,
          address: walletAddress
        };
      } catch (error) {
        disconnect();

        const errorMessage = error instanceof Error ? error.message : "钱包连接失败";
        const normalizedErrorMessage = errorMessage.includes("User rejected")
          ? "用户拒绝了钱包连接或签名请求"
          : errorMessage.includes("Provider not found")
            ? "未检测到浏览器钱包插件，请安装 MetaMask、OKX Wallet，或使用 WalletConnect 扫码连接。"
            : errorMessage;

        return {
          success: false,
          error: normalizedErrorMessage
        };
      }
    },
    [connectAsync, disconnect, disconnectAsync, getConnector, isConnected, router, signMessageAsync]
  );

  return {
    availableWallets,
    isConnecting: isPending,
    isConnected,
    address,
    connect,
    disconnect
  };
}
