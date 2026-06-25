"use client";

import { BrandLogo } from "@/components/brand-logo";
import { useAuthApi } from "@/hooks/auth";
import { saveOAuthSession } from "@/lib/auth/token-manager";
import type { OAuthProvider } from "@/types/auth";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OAuthCallbackClientProps = {
  provider: OAuthProvider;
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
};

export function OAuthCallbackClient({
  provider,
  code,
  state,
  error,
  errorDescription
}: OAuthCallbackClientProps) {
  const router = useRouter();
  const { handleOAuthCallback } = useAuthApi();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [statusMessage, setStatusMessage] = useState("正在处理 Google 授权登录...");

  useEffect(() => {
    const finishOAuthLogin = async () => {
      try {
        if (error) {
          throw new Error(errorDescription || error);
        }

        if (!code) {
          throw new Error("未获取到 Google 授权码");
        }

        const response = await handleOAuthCallback(provider, {
          code,
          state
        });

        saveOAuthSession(response);
        setStatus("success");
        setStatusMessage("登录成功，正在跳转...");

        window.setTimeout(() => {
          router.push("/?loginSuccess=true");
        }, 700);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Google 登录失败，请重试";
        setStatus("error");
        setStatusMessage(message);

        window.setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    finishOAuthLogin();
  }, [code, error, errorDescription, handleOAuthCallback, provider, router, state]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFCFD] px-5 text-ink">
      <section className="w-full max-w-md text-center">
        <BrandLogo
          className="mx-auto mb-8 flex justify-center"
          iconClassName="h-7 w-7 text-hnb"
          markClassName="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white shadow-soft"
          textClassName="hidden"
        />
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-[#F3F3F3]">
          {status === "processing" ? <Loader2 className="h-7 w-7 animate-spin text-cyanweb" /> : null}
          {status === "success" ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : null}
          {status === "error" ? <ShieldAlert className="h-7 w-7 text-red-600" /> : null}
        </div>
        <h1 className="text-2xl font-black">
          {status === "processing" ? "Google 登录" : status === "success" ? "登录成功" : "登录失败"}
        </h1>
        <p className="mt-4 text-sm font-medium leading-6 text-black/48">{statusMessage}</p>
      </section>
    </main>
  );
}
