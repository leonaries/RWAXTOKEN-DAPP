"use client";

import type { WalletInfo } from "@/lib/web3";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

type WalletLoginModalProps = {
  isOpen: boolean;
  wallets: WalletInfo[];
  isConnecting: boolean;
  connectingWalletId?: string;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
};

export function WalletLoginModal({
  isOpen,
  wallets,
  isConnecting,
  connectingWalletId,
  onClose,
  onSelectWallet
}: WalletLoginModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-sm">
      <button aria-label="关闭钱包弹窗" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <section className="relative z-10 flex max-h-[85vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-[#FCFCFD] shadow-[0_64px_64px_1px_rgba(15,15,15,0.1)]">
        <header className="flex items-start justify-between gap-6 px-[25px] pb-[19px] pt-[21px]">
          <div>
            <h2 className="h-[35px] text-[24px] font-black leading-[35px] tracking-normal text-black">链接钱包</h2>
            <p className="mt-2 max-w-[389px] text-[14px] font-normal leading-[22px] text-[#999999]">
              绑定钱包后，可通过钱包地址注册与登录。请保管好您的私钥或助记词，切勿与他人分享。
            </p>
          </div>
          <button
            aria-label="关闭"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-black/65 transition hover:bg-black/5 hover:text-ink"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="space-y-[10px] overflow-y-auto px-[25px] pb-[18px]">
          {wallets.map((wallet) => {
            const isCurrentWalletConnecting = isConnecting && connectingWalletId === wallet.id;

            return (
              <div
                className="flex min-h-[66px] w-full items-center justify-between rounded-[12px] border border-transparent bg-[#F3F3F3] px-[18px] py-[14px]"
                key={wallet.id}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[6px] bg-white">
                  <Image alt={`${wallet.name} icon`} className="object-contain" height={36} src={wallet.icon} width={36} />
                </span>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="truncate text-[16px] font-medium leading-[22px] text-black">{wallet.name}</p>
                </div>
                <button
                  className="inline-flex h-[28px] w-[64px] shrink-0 items-center justify-center rounded-[24px] bg-[#010101] text-xs font-medium text-white transition hover:bg-ink disabled:bg-black/35"
                  disabled={isConnecting}
                  onClick={() => onSelectWallet(wallet.id)}
                  type="button"
                >
                  {isCurrentWalletConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "链接"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
