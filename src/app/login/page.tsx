"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  CheckCircle2,
  Chrome,
  Loader2,
  Mail,
  ShieldCheck,
  Wallet
} from "lucide-react";

type LoginStatus = "idle" | "loading" | "success" | "error";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [message, setMessage] = useState("首次登录会自动创建 RWAXTOKEN 账号。");

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
      setMessage("请输入有效邮箱后再获取验证码。");
      setStatus("error");
      return;
    }
    setCountdown(60);
    setStatus("success");
    setMessage("验证码已发送。新邮箱验证通过后会自动创建账号。");
  };

  const submitEmailLogin = () => {
    if (!canSubmit) {
      setStatus("error");
      setMessage("请填写邮箱和至少 4 位验证码。");
      return;
    }
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("success");
      setMessage("验证通过。若这是首次登录，账号已自动创建。");
    }, 700);
  };

  const connectWallet = async () => {
    setStatus("loading");
    setMessage("正在唤起 Web3 钱包...");
    try {
      if (!window.ethereum) {
        setStatus("error");
        setMessage("未检测到钱包插件，请先安装 MetaMask 或兼容钱包。");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setStatus("success");
      setMessage(`钱包已连接：${accounts[0]?.slice(0, 6)}...${accounts[0]?.slice(-4)}。首次登录会自动创建账号。`);
    } catch {
      setStatus("error");
      setMessage("钱包连接被取消，请重试。");
    }
  };

  const startGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="grid min-h-screen bg-[#FCFCFD] text-ink lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      <section className="relative hidden overflow-hidden bg-black text-white lg:block">
        <div className="absolute inset-0 grid-fade opacity-70" />
        <div className="absolute left-10 top-12 z-20 flex items-center gap-3 xl:left-20 xl:top-20">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">
            <Blocks className="h-5 w-5 text-cyanweb" />
          </span>
          <span className="text-lg font-black tracking-wide xl:text-xl">RWAXTOKEN</span>
        </div>

        <div className="relative z-10 flex h-screen items-center justify-center px-10 py-12">
          <div className="w-full max-w-xl">
            <p className="mb-5 inline-flex w-fit rounded-full border border-hnb/25 px-4 py-2 text-xs font-semibold text-hnb">
              Web3 / RWA / Brand Token
            </p>
            <h1 className="max-w-xl text-[32px] font-black leading-[1.12] tracking-normal">
              欢迎进入
              <span className="block">RWAXTOKEN资产社区</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/68">
              打新、金融、Staking、品牌Token 与矿池入口统一聚合，让真实世界资产连接链上流动性。
            </p>

            <div className="relative mt-8 h-[320px]">
              <div className="absolute left-0 top-[86px] h-52 w-52 rounded-full orbital-ring opacity-80" />
              <div className="absolute left-36 top-9 h-64 w-64 rounded-full border border-dashed border-hnb/45" />
              <div className="animate-float-slow absolute left-32 top-10 h-60 w-60 rounded-[1.6rem] border border-white/14 bg-white/[0.03] shadow-glow backdrop-blur">
                <div className="wire-cube left-8 top-7 scale-75" />
                <div className="wire-cube right-8 top-[72px] scale-[0.58]" />
                <div className="wire-cube bottom-10 left-20 scale-[0.62]" />
                <div className="absolute bottom-5 left-1/2 h-20 w-24 -translate-x-1/2 rounded-2xl border border-white/20 bg-black shadow-2xl">
                  <div className="absolute inset-x-5 top-4 h-2 rounded-full bg-white/70" />
                  <div className="absolute bottom-5 left-6 flex gap-2">
                    <span className="h-5 w-5 rounded-full bg-cyanweb" />
                    <span className="h-5 w-5 rounded-full bg-hnb" />
                  </div>
                </div>
              </div>
              <div className="animate-float-mid absolute bottom-3 right-10 rounded-full border border-white/12 px-4 py-2 text-xs text-white/62">
                链接钱包后同步资产身份
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:h-screen lg:min-h-0">
        <div className="w-full max-w-md px-0 lg:px-6 lg:py-8">
          <div className="mb-6 flex items-center justify-between lg:mb-7 lg:justify-end">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-ink lg:hidden">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
            <Link href="/" className="hidden items-center gap-2 text-sm font-semibold text-black/45 transition hover:text-ink lg:inline-flex">
              返回平台首页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white shadow-soft lg:hidden">
              <Blocks className="h-7 w-7 text-hnb" />
            </div>
            <h2 className="text-2xl font-black tracking-normal md:text-3xl">账号登录</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#707070]">邮箱登录</span>
              <div className="flex h-11 items-center gap-3 rounded-md bg-[#F3F3F3] px-3 ring-1 ring-transparent transition focus-within:ring-ink">
                <Mail className="h-[18px] w-[18px] text-black/30" />
                <input
                  className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-black/28"
                  inputMode="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="输入邮箱地址"
                  type="email"
                  value={email}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#707070]">请输入验证码</span>
              <div className="flex h-11 items-center gap-3 rounded-md bg-[#F3F3F3] px-3 ring-1 ring-transparent transition focus-within:ring-ink">
                <ShieldCheck className="h-[18px] w-[18px] text-black/30" />
                <input
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/28"
                  inputMode="numeric"
                  maxLength={8}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="输入邮箱验证码"
                  type="text"
                  value={code}
                />
                <button
                  className="shrink-0 text-xs font-black text-ink transition disabled:text-black/25"
                  disabled={!canSendCode}
                  onClick={sendCode}
                  type="button"
                >
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </button>
              </div>
            </label>

            <button
              className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition hover:bg-gray-900 disabled:bg-black/35 disabled:text-white"
              disabled={status === "loading"}
              onClick={submitEmailLogin}
              type="button"
            >
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "登录"}
            </button>

          </div>

          <div className="mb-[30px] mt-[64px] flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium text-gray-400">其他登录方式</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="flex h-[50px] items-center justify-center gap-2 rounded-lg bg-[#F3F3F3] text-base font-medium text-[#707070] transition hover:-translate-y-0.5 hover:text-ink hover:shadow-soft"
              onClick={startGoogleAuth}
              type="button"
            >
              <Chrome className="h-5 w-5 text-[#4285f4]" />
              Google
            </button>
            <button
              className="flex h-[50px] items-center justify-center gap-2 rounded-lg bg-[#F3F3F3] text-base font-medium text-[#707070] transition hover:-translate-y-0.5 hover:text-ink hover:shadow-soft"
              onClick={connectWallet}
              type="button"
            >
              <Wallet className="h-5 w-5 text-cyanweb" />
              Wallet
            </button>
          </div>

          {status !== "idle" ? (
            <div
              className={`mt-5 flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold ${
                status === "error"
                  ? "bg-red-50 text-red-600"
                  : status === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-white text-black/45"
              }`}
            >
              {status === "success" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
