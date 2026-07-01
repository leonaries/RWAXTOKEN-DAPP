"use client";

import "@/lib/web3/walletConnector";
import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

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
  const { open } = useAppKit();
  const appKitState = useAppKitState();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const openWalletModal = useCallback(async (): Promise<WalletLoginResult> => {
    try {
      await open({ view: "Connect" });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "钱包弹窗打开失败";
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [open]);

  const authenticateWallet = useCallback(
    async (walletAddress = address): Promise<WalletLoginResult & { address?: string }> => {
      if (!walletAddress) {
        return {
          success: false,
          error: "未获取到钱包地址，请先连接钱包。"
        };
      }

      try {
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
    [address, disconnect, router, signMessageAsync]
  );

  return {
    isConnecting: appKitState.loading || appKitState.open,
    isConnected,
    address,
    authenticateWallet,
    openWalletModal,
    disconnect
  };
}
