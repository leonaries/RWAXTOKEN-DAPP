"use client";

import { AppButton } from "@/components/app-button";
import { isAuthenticated } from "@/lib/auth/token-manager";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
};

export function AuthGuard({ children, fallback, redirectTo = "/login" }: AuthGuardProps) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

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
            <p className="mt-2 text-sm text-white/48">请先完成邮箱、Google 或钱包登录。</p>
            <AppButton className="mt-5" href={redirectTo} size="md">
              前往登录
            </AppButton>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
