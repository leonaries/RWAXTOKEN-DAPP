"use client";

import { useState } from "react";
import { useAuthApi } from "./useAuthApi";
import type { OAuthProvider } from "@/types/auth";

export function useThirdPartyLogin() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string>();
  const { getOAuthUrl } = useAuthApi();

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    try {
      setError(undefined);
      setLoadingProvider(provider);

      const authUrl = await getOAuthUrl(provider);
      window.location.href = authUrl;
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "获取授权链接失败";
      setError(message);
      setLoadingProvider(null);
    }
  };

  return {
    error,
    isGoogleLoading: loadingProvider === "google",
    handleGoogleLogin: () => handleOAuthLogin("google")
  };
}
