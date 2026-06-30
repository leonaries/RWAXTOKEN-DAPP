"use client";

import { LoginMethodModal } from "@/features/auth/login-method-modal";
import { isAuthenticated } from "@/lib/auth/token-manager";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    setAllowed(isAuthenticated());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!allowed) {
    return (
      fallback ?? (
        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-white/10 bg-white/[0.07] p-8 text-center text-white">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.09] text-white/58">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-black">需要登录后访问</h2>
            <p className="mt-2 text-sm text-white/48">请先完成邮箱或钱包登录。</p>
            <button
              className="mt-5 inline-flex h-10 min-w-[142px] items-center justify-center rounded-full bg-white/[0.13] px-5 text-sm font-semibold text-white transition hover:bg-hnb hover:text-ink"
              onClick={() => setIsLoginModalOpen(true)}
              type="button"
            >
              前往登录
            </button>
            <LoginMethodModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
