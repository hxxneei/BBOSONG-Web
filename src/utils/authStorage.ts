import { markAuthSessionActive } from "./authEvents";

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

const CHAT_SESSION_STORAGE_PREFIX = "bbosong_chat_";
const sessionResetters = new Set<() => void>();

export const saveAuthTokens = (tokens: AuthTokenPayload) => {
  localStorage.setItem("grantType", tokens.grantType);
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("accessTokenExpiresAt", tokens.accessTokenExpiresAt);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem("refreshTokenExpiresAt", tokens.refreshTokenExpiresAt);
  markAuthSessionActive();
};

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const registerSessionResetter = (resetter: () => void) => {
  sessionResetters.add(resetter);
};

export const resetSession = () => {
  clearAuthStorage();

  Object.keys(sessionStorage)
    .filter((key) => key.startsWith(CHAT_SESSION_STORAGE_PREFIX))
    .forEach((key) => sessionStorage.removeItem(key));

  sessionResetters.forEach((resetter) => resetter());
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
