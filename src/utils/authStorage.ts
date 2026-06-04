export interface AuthTokenPayload {
  grantType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

const AUTH_STORAGE_KEYS = [
  "grantType",
  "accessToken",
  "accessTokenExpiresAt",
  "refreshToken",
  "refreshTokenExpiresAt",
  "nickname",
  "chat_history",
] as const;

export const saveAuthTokens = (tokens: AuthTokenPayload) => {
  localStorage.setItem("grantType", tokens.grantType);
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("accessTokenExpiresAt", tokens.accessTokenExpiresAt);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem("refreshTokenExpiresAt", tokens.refreshTokenExpiresAt);
};

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getAccessTokenExpiresAt = () =>
  localStorage.getItem("accessTokenExpiresAt");

export const getRefreshTokenExpiresAt = () =>
  localStorage.getItem("refreshTokenExpiresAt");

export const hasAuthTokens = () =>
  Boolean(getAccessToken() && getRefreshToken());

export const saveNickname = (nickname: string) => {
  localStorage.setItem("nickname", nickname);
};
