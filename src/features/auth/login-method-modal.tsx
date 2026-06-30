"use client";

import { WalletLoginModal } from "@/features/auth/wallet-login-modal";
import type { LoginStatus } from "@/features/auth/login.types";
import { useWalletConnection } from "@/hooks/web3";
import { ArrowRight, CheckCircle2, Loader2, Mail, Send, ShieldCheck, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type LoginMethodModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LoginMethodCardProps = {
  description: string;
  disabled?: boolean;
  icon: "email" | "telegram" | "wallet";
  isLoading?: boolean;
  label: string;
  onClick?: () => void;
};

const methodIconMap = {
  email: Mail,
  telegram: Send,
  wallet: Wallet
};

export function LoginMethodModal({ isOpen, onClose }: LoginMethodModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<"methods" | "email">("methods");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState<string>();
  const { address, availableWallets, connect, isConnecting } = useWalletConnection();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  const closeAll = () => {
    setActiveView("methods");
    setIsWalletModalOpen(false);
    onClose();
  };

  const connectWallet = async (walletId: string) => {
    setConnectingWalletId(walletId);
    const result = await connect(walletId);
    setConnectingWalletId(undefined);

    if (result.success) {
      setIsWalletModalOpen(false);
      onClose();
      return;
    }

    const errorMessage = result.error || (address ? "当前钱包已连接，请重试登录。" : "钱包连接被取消，请重试。");
    window.alert(errorMessage);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/72 px-4 py-8 backdrop-blur-md">
        <button aria-label="关闭登录弹窗遮罩" className="absolute inset-0 cursor-default" onClick={closeAll} type="button" />
        <section
          className={`relative z-10 max-h-[calc(100vh-48px)] w-full overflow-y-auto rounded-[30px] border border-white/18 bg-[#222523]/82 text-white shadow-2xl shadow-black/50 ring-1 ring-white/8 ${
            activeView === "email" ? "max-w-[820px] p-6 sm:p-8" : "max-w-[820px] p-6 sm:p-8 lg:p-10"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(48,238,105,0.18),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(35,174,247,0.16),transparent_32%)]" />
          <button
            aria-label="关闭登录弹窗"
            className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-black/20 text-white transition hover:bg-hnb hover:text-ink"
            onClick={closeAll}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative">
            {activeView === "methods" ? (
              <LoginMethodSelection
                isConnecting={isConnecting}
                onEmail={() => setActiveView("email")}
                onWallet={() => setIsWalletModalOpen(true)}
              />
            ) : (
              <EmailLoginForm onCancel={closeAll} onSuccess={closeAll} />
            )}
          </div>
        </section>
      </div>

      <WalletLoginModal
        connectingWalletId={connectingWalletId}
        isConnecting={isConnecting}
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={connectWallet}
        wallets={availableWallets}
      />
    </>,
    document.body
  );
}

function LoginMethodCard({
  description,
  disabled,
  icon,
  isLoading,
  label,
  onClick
}: LoginMethodCardProps) {
  const Icon = methodIconMap[icon];
  const content = (
    <>
      <span
        className={`grid h-[82px] w-[82px] shrink-0 place-items-center rounded-[18px] ${
          icon === "telegram"
            ? "bg-[#20a0df] text-white"
            : icon === "wallet"
              ? "bg-gradient-to-br from-[#16a5ff] to-[#2355ff] text-white"
              : "bg-black text-white"
        }`}
      >
        <Icon className="h-10 w-10" />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-left text-[24px] font-black leading-tight tracking-normal sm:text-[28px]">
          {label}
        </strong>
        <span className="mt-3 block text-left text-sm leading-6 text-white/58 sm:text-base">{description}</span>
      </span>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/68 text-[#2c3135]">
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowRight className="h-7 w-7" />}
      </span>
    </>
  );

  const className = `group flex w-full items-center gap-5 rounded-[22px] bg-white/[0.13] px-5 py-5 text-white backdrop-blur transition ${
    disabled
      ? "cursor-not-allowed opacity-55"
      : "hover:-translate-y-0.5 hover:bg-white/[0.19] hover:shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
  }`;

  return (
    <button className={className} disabled={disabled || isLoading} onClick={onClick} type="button">
      {content}
    </button>
  );
}

function LoginMethodSelection({
  isConnecting,
  onEmail,
  onWallet
}: {
  isConnecting: boolean;
  onEmail: () => void;
  onWallet: () => void;
}) {
  return (
    <>
      <h2 className="text-center text-[28px] font-black leading-tight tracking-normal sm:text-[34px]">
        请选择登录方式
      </h2>
      <div className="mt-7 space-y-4">
        <LoginMethodCard
          description="使用邮箱验证码登录进行注册登录，登录后可绑定钱包地址。"
          icon="email"
          label="邮箱快速登录"
          onClick={onEmail}
        />
        <LoginMethodCard
          description="使用 Telegram 账号登录，登录后可绑定钱包地址。"
          disabled
          icon="telegram"
          label="Telegram 快捷登录"
        />
        <LoginMethodCard
          description="使用 WEB3 通用型钱包进行授权登录，支持 MetaMask、Trust、OK Wallet、TokenPocket 等钱包。"
          icon="wallet"
          isLoading={isConnecting}
          label="Wallet Connect"
          onClick={onWallet}
        />
      </div>
      <p className="mt-6 text-center text-sm font-semibold text-white/45">更多选择，敬请期待</p>
    </>
  );
}

function EmailLoginForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [message, setMessage] = useState("使用邮箱登录后请及时备份默认地址的私钥。");

  const canSendCode = useMemo(() => /\S+@\S+\.\S+/.test(email) && countdown === 0, [countdown, email]);
  const canSubmit = useMemo(() => /\S+@\S+\.\S+/.test(email) && code.trim().length >= 4, [code, email]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const sendCode = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("请输入有效邮箱后再获取验证码。");
      return;
    }

    setCountdown(60);
    setStatus("success");
    setMessage("验证码已发送，请查收邮箱。");
  };

  const submitEmailLogin = () => {
    if (!canSubmit) {
      setStatus("error");
      setMessage("请填写邮箱和至少 4 位验证码。");
      return;
    }

    setStatus("loading");
    window.setTimeout(() => {
      window.localStorage.setItem("rwaxtoken_access_token", `email_mock_${Date.now()}`);
      window.localStorage.setItem(
        "rwaxtoken_user",
        JSON.stringify({
          email,
          id: email,
          provider: "email"
        })
      );
      setStatus("success");
      setMessage("邮箱登录成功。");
      window.setTimeout(onSuccess, 450);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-[740px]">
      <h2 className="text-center text-[32px] font-black leading-tight tracking-normal sm:text-[36px]">邮箱快速登入</h2>

      <div className="mt-7 space-y-5">
        <label className="block">
          <span className="mb-3 block text-[19px] font-semibold text-white/88">邮箱地址</span>
          <input
            className="h-[60px] w-full rounded-2xl border border-white/16 bg-white/[0.13] px-6 text-[24px] font-semibold text-white outline-none transition placeholder:text-white/42 focus:border-hnb/80"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="输入邮箱地址"
            type="email"
            value={email}
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-[19px] font-semibold text-white/88">验证码</span>
          <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
            <input
              className="h-[60px] rounded-2xl border border-white/16 bg-white/[0.13] px-6 text-[24px] font-semibold text-white outline-none transition placeholder:text-white/42 focus:border-hnb/80"
              inputMode="numeric"
              maxLength={8}
              onChange={(event) => setCode(event.target.value)}
              placeholder="输入邮箱验证码"
              type="text"
              value={code}
            />
            <button
              className="h-[60px] rounded-2xl border border-white/8 bg-black/60 px-5 text-[20px] font-black text-white shadow-lg shadow-black/20 transition hover:bg-hnb hover:text-ink disabled:pointer-events-none disabled:opacity-45"
              disabled={!canSendCode || status === "loading"}
              onClick={sendCode}
              type="button"
            >
              {countdown > 0 ? `${countdown}s` : "发送"}
            </button>
          </div>
        </label>

        <div className="min-h-7">
          {status !== "idle" ? (
            <div
              className={`flex items-center gap-2 text-base font-semibold ${
                status === "error" ? "text-red-300" : status === "success" ? "text-hnb" : "text-white/54"
              }`}
            >
              {status === "success" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          ) : (
            <p className="text-base leading-6 text-white/62">{message}</p>
          )}
        </div>

        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <button
            className="h-[60px] rounded-full border border-hnb bg-transparent text-[24px] font-black text-hnb transition hover:bg-hnb hover:text-ink"
            onClick={onCancel}
            type="button"
          >
            取消
          </button>
          <button
            className="h-[60px] rounded-full bg-hnb text-[24px] font-black text-ink transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-55"
            disabled={status === "loading"}
            onClick={submitEmailLogin}
            type="button"
          >
            {status === "loading" ? <Loader2 className="mx-auto h-7 w-7 animate-spin" /> : "确认登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
