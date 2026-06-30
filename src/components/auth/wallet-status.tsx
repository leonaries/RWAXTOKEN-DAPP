"use client";

import { LoginMethodModal } from "@/features/auth/login-method-modal";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStatus() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) {
    return (
      <>
        <button
          className="inline-flex h-10 min-w-[142px] items-center justify-center rounded-full bg-white/[0.13] px-5 text-sm font-semibold text-white transition hover:bg-hnb hover:text-ink"
          onClick={() => setIsLoginModalOpen(true)}
          type="button"
        >
          链接/登陆
        </button>
        <LoginMethodModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/[0.09] px-2 py-2 text-sm font-semibold text-white">
      <span className="inline-flex items-center gap-2 px-2">
        <Wallet className="h-4 w-4 text-hnb" />
        {formatAddress(address)}
      </span>
      <button
        className="h-8 rounded-full bg-white/[0.12] px-3 text-xs font-semibold text-white transition hover:bg-hnb hover:text-ink"
        onClick={() => disconnect()}
        type="button"
      >
        断开
      </button>
    </div>
  );
}
