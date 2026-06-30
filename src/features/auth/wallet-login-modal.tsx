"use client";

import type { WalletInfo } from "@/lib/web3";
import { ArrowLeft, ChevronRight, Copy, HelpCircle, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

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
  const [view, setView] = useState<"list" | "qr">("list");
  const walletConnectLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "wc:rwaxtoken-dapp@2?relay-protocol=irn";
    }

    return `wc:rwaxtoken-dapp@2?relay-protocol=irn&origin=${encodeURIComponent(window.location.origin)}`;
  }, []);

  if (!isOpen) {
    return null;
  }

  const closeModal = () => {
    setView("list");
    onClose();
  };

  const copyWalletConnectLink = async () => {
    try {
      await navigator.clipboard.writeText(walletConnectLink);
    } catch {
      window.prompt("复制 WalletConnect 链接", walletConnectLink);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/62 px-5 py-8 backdrop-blur-md">
      <button aria-label="关闭钱包弹窗" className="absolute inset-0 cursor-default" onClick={closeModal} type="button" />
      <section className="relative z-10 flex max-h-[88vh] w-full max-w-[430px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#202020] text-white shadow-2xl shadow-black/50">
        <header className="grid grid-cols-[40px_1fr_40px] items-center px-7 pt-6">
          {view === "qr" ? (
            <button
              aria-label="返回钱包列表"
              className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/10"
              onClick={() => setView("list")}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              aria-label="钱包帮助"
              className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/10"
              type="button"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-center text-[18px] font-medium leading-none tracking-normal">
            {view === "qr" ? "WalletConnect" : "Connect Wallet"}
          </h2>
          <button
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/10"
            onClick={closeModal}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {view === "list" ? (
          <WalletList
            connectingWalletId={connectingWalletId}
            isConnecting={isConnecting}
            onSelectWallet={onSelectWallet}
            onShowQr={() => setView("qr")}
            wallets={wallets}
          />
        ) : (
          <WalletConnectQr link={walletConnectLink} onCopy={copyWalletConnectLink} />
        )}
      </section>
    </div>
  );
}

function WalletList({
  connectingWalletId,
  isConnecting,
  onSelectWallet,
  onShowQr,
  wallets
}: {
  connectingWalletId?: string;
  isConnecting: boolean;
  onSelectWallet: (walletId: string) => void;
  onShowQr: () => void;
  wallets: WalletInfo[];
}) {
  const orderedWallets = [
    ...wallets.filter((wallet) => ["metamask", "trust", "okx"].includes(wallet.id)),
    {
      id: "uniswap",
      name: "Uniswap Extension",
      icon: "",
      description: "Uniswap 浏览器插件"
    },
    ...wallets.filter((wallet) => !["metamask", "trust", "okx"].includes(wallet.id)),
    {
      id: "binance",
      name: "Binance Wallet",
      icon: "",
      description: "Binance 浏览器钱包"
    }
  ];

  return (
    <div className="overflow-y-auto px-7 pb-6 pt-7">
      <div className="space-y-4">
        <WalletRow
          icon="/assets/icons/wallet.svg"
          label="WalletConnect"
          onClick={onShowQr}
          status="QR CODE"
          statusTone="blue"
        />
        {orderedWallets.map((wallet) => (
          <WalletRow
            disabled={wallet.id === "binance"}
            icon={wallet.icon}
            isLoading={isConnecting && connectingWalletId === wallet.id}
            key={wallet.id}
            label={wallet.name}
            onClick={() => onSelectWallet(wallet.id)}
            status={["metamask", "trust", "okx", "uniswap"].includes(wallet.id) ? "INSTALLED" : undefined}
          />
        ))}
      </div>
      <p className="mt-7 text-center text-xs text-white/45">
        UX by <span className="rounded-full bg-white/12 px-2 py-1">.</span>{" "}
        <span className="rounded-full bg-white/12 px-3 py-1">/</span>{" "}
        <span className="rounded-full bg-white/12 px-3 py-1 text-white/80">reown</span>
      </p>
    </div>
  );
}

function WalletRow({
  disabled,
  icon,
  isLoading,
  label,
  onClick,
  status,
  statusTone = "green"
}: {
  disabled?: boolean;
  icon?: string;
  isLoading?: boolean;
  label: string;
  onClick: () => void;
  status?: string;
  statusTone?: "blue" | "green";
}) {
  return (
    <button
      className={`flex min-h-[46px] w-full items-center gap-3 text-left transition ${
        disabled ? "cursor-not-allowed opacity-42" : "hover:translate-x-1"
      }`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type="button"
    >
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center overflow-hidden rounded-md bg-white/8">
        {icon ? (
          <Image alt={`${label} icon`} className="object-contain" height={34} src={icon} width={34} />
        ) : (
          <span className="text-xl font-black text-hnb">{label.slice(0, 1)}</span>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-[18px] font-medium leading-none text-white">{label}</span>
      {status ? (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium leading-none ${
            statusTone === "blue" ? "bg-[#0d2f52] text-[#1c94ff]" : "bg-hnb/12 text-hnb"
          }`}
        >
          {status}
        </span>
      ) : null}
      <span className="grid h-7 w-7 shrink-0 place-items-center text-white/55">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-6 w-6" />}
      </span>
    </button>
  );
}

function WalletConnectQr({
  link,
  onCopy
}: {
  link: string;
  onCopy: () => void;
}) {
  return (
    <div className="px-7 pb-7 pt-6 text-center">
      <div className="mx-auto grid aspect-square w-full max-w-[330px] place-items-center rounded-2xl bg-white p-2">
        <QrPattern />
      </div>
      <p className="mt-6 text-[18px] font-medium leading-tight text-white">Scan this QR Code with your phone</p>
      <button
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 px-3.5 font-mono text-sm text-white transition hover:bg-white/10"
        onClick={onCopy}
        type="button"
      >
        Copy link
        <Copy className="h-3.5 w-3.5" />
      </button>
      <p className="mt-7 text-center text-xs text-white/45">
        UX by <span className="rounded-full bg-white/12 px-2 py-1">.</span>{" "}
        <span className="rounded-full bg-white/12 px-3 py-1">/</span>{" "}
        <span className="rounded-full bg-white/12 px-3 py-1 text-white/80">reown</span>
      </p>
      <span className="sr-only">{link}</span>
    </div>
  );
}

function QrPattern() {
  const cells = Array.from({ length: 29 * 29 }, (_, index) => {
    const x = index % 29;
    const y = Math.floor(index / 29);
    const inCorner =
      (x < 7 && y < 7) ||
      (x > 21 && y < 7) ||
      (x < 7 && y > 21);
    const core =
      ((x * 7 + y * 11 + x * y) % 5 === 0) ||
      ((x + y * 3) % 7 === 0) ||
      (x % 6 === 0 && y % 3 !== 1);

    return inCorner || core;
  });

  return (
    <div className="relative grid h-full w-full grid-cols-[repeat(29,minmax(0,1fr))] gap-[3px] rounded-xl bg-white p-3">
      {cells.map((active, index) => (
        <span className={active ? "rounded-sm bg-[#1e1e1f]" : "rounded-sm bg-transparent"} key={index} />
      ))}
      <span className="absolute left-3 top-3 h-[58px] w-[58px] rounded-full border-[8px] border-[#1e1e1f] bg-white">
        <span className="absolute inset-3 rounded-full bg-[#1e1e1f]" />
      </span>
      <span className="absolute right-3 top-3 h-[58px] w-[58px] rounded-full border-[8px] border-[#1e1e1f] bg-white">
        <span className="absolute inset-3 rounded-full bg-[#1e1e1f]" />
      </span>
      <span className="absolute bottom-3 left-3 h-[58px] w-[58px] rounded-full border-[8px] border-[#1e1e1f] bg-white">
        <span className="absolute inset-3 rounded-full bg-[#1e1e1f]" />
      </span>
      <span className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-xl bg-[#202020]">
        <Image alt="WalletConnect" className="brightness-0 invert" height={44} src="/assets/icons/wallet.svg" width={44} />
      </span>
    </div>
  );
}
