"use client";

import type { OAuthCallbackResponse, OAuthProvider, OAuthUrlResponse } from "@/types/auth";

const oauthAuthorizeBasePath = process.env.NEXT_PUBLIC_OAUTH_AUTHORIZE_ENDPOINT || "/api/v1/auth/oauth";
const oauthCallbackBasePath = process.env.NEXT_PUBLIC_OAUTH_CALLBACK_ENDPOINT || "/api/v1/auth/oauth";

function buildRedirectUri(provider: OAuthProvider) {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/auth/callback/${provider}`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;

  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data ? String(data.message) : response.statusText;
    throw new Error(message || `HTTP ${response.status}`);
  }

  return data;
}

export function useAuthApi() {
  const getOAuthUrl = async (provider: OAuthProvider): Promise<string> => {
    const redirectUri = buildRedirectUri(provider);
    const url = new URL(`${oauthAuthorizeBasePath}/${provider}`, window.location.origin);
    url.searchParams.set("redirect_uri", redirectUri);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      credentials: "include"
    });
    const data = await readJsonResponse<OAuthUrlResponse>(response);
    const authUrl = data.data?.auth_url || data.data?.url || data.auth_url || data.url;

    if (!authUrl) {
      throw new Error(data.message || "后端未返回 Google 授权链接");
    }

    return authUrl;
  };

  const handleOAuthCallback = async (
    provider: OAuthProvider,
    payload: {
      code: string;
      state?: string;
    }
  ) => {
    const response = await fetch(`${oauthCallbackBasePath}/${provider}/callback`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    return readJsonResponse<OAuthCallbackResponse>(response);
  };

  return {
    getOAuthUrl,
    handleOAuthCallback
  };
}
