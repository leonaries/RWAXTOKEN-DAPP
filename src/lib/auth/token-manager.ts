import type { OAuthCallbackResponse, OAuthTokenInfo, OAuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "rwaxtoken_access_token";
const REFRESH_TOKEN_KEY = "rwaxtoken_refresh_token";
const TOKEN_TYPE_KEY = "rwaxtoken_token_type";
const TOKEN_EXPIRES_AT_KEY = "rwaxtoken_token_expires_at";
const USER_KEY = "rwaxtoken_user";

export function setTokenInfo(tokenInfo: OAuthTokenInfo) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokenInfo.access_token);
  window.localStorage.setItem(TOKEN_TYPE_KEY, tokenInfo.token_type || "Bearer");

  if (tokenInfo.refresh_token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokenInfo.refresh_token);
  }

  if (tokenInfo.expires_in) {
    const expiresAt = Date.now() + tokenInfo.expires_in * 1000;
    window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  }
}

export function setAuthUser(user?: OAuthUser) {
  if (typeof window === "undefined" || !user) {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveOAuthSession(response: OAuthCallbackResponse) {
  const accessToken = response.access_token || response.token;

  if (!accessToken) {
    throw new Error("后端未返回登录 token");
  }

  setTokenInfo({
    access_token: accessToken,
    refresh_token: response.refresh_token,
    expires_in: response.expires_in,
    token_type: response.token_type || "Bearer"
  });
  setAuthUser(response.user);
}

export function clearOAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  [
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    TOKEN_TYPE_KEY,
    TOKEN_EXPIRES_AT_KEY,
    USER_KEY,
    "rwaxtoken_auth_token"
  ].forEach((key) => window.localStorage.removeItem(key));
}
