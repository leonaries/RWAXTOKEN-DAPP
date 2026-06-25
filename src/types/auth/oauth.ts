export type OAuthProvider = "google";

export type OAuthUser = {
  id?: string | number;
  email?: string;
  username?: string;
  name?: string;
  avatar_url?: string | null;
  avatar?: string | null;
  is_admin?: boolean;
};

export type OAuthTokenInfo = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

export type OAuthCallbackResponse = OAuthTokenInfo & {
  user?: OAuthUser;
  token?: string;
  refresh_token?: string;
};

export type OAuthUrlResponse = {
  auth_url?: string;
  url?: string;
  data?: {
    auth_url?: string;
    url?: string;
  };
  code?: number;
  message?: string;
};
